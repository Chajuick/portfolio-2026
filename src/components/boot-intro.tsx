"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOOT_SEEN_KEY } from "@/lib/site";

/**
 * 들어오면 벌어지는 일.
 *
 *   화면이 켜진다 → chajuick이 실행되며 /intro를 친다 → 화면이 접힌다
 *   → 화면 전체가 얼굴이 되어 두리번거린다 → /hello를 친다
 *   → 헤더가 내려오고 본문이 올라오며 스크롤이 생긴다
 *
 * 마스코트를 구석에 둔 그림이 아니라, 보고 있는 화면 자체가 그 화면이라는 뜻이다.
 * 도크의 chajuick도, 내비를 눌렀을 때 받아치는 명령어도 같은 말을 쓴다.
 *
 * 이건 덧씌우는 층일 뿐이다. 아래 페이지는 서버에서 이미 다 그려져 있고
 * 오버레이는 마운트된 뒤에야 올라온다. 스크립트가 죽으면 연출만 사라진다.
 * 본문 등장 연출도 html.booted 안에서만 정의되므로, 붙지 않으면 그냥 보인다.
 */

const COMMAND = "/intro";
const GREETING = "/hello";

/** 도크가 다시 재생을 요청할 때 쓰는 신호. */
export const REPLAY_EVENT = "chajuick:replay";

/** 마지막 줄은 한 박자 뒤에 LOADED가 붙는다. 처음부터 '완료'면 불러오는 줄로 읽히지 않는다. */
const BOOT_LINES = ["chajuick 2026.9", "프로필 불러오는 중…"];
const LOADED = "완료";

/** 한 글자 치는 간격. 더 빠르면 붙여 넣는 것처럼 보이고, 더 느리면 기다리게 된다. */
const KEY_MS = 80;

/** 눈이 좌우를 보고 가운데로 돌아올 때까지. .eyes 애니메이션 2s의 88% 지점이다. */
const LOOK_MS = 1750;

type Phase = "hidden" | "power" | "boot" | "typing" | "fold" | "face" | "hello" | "reveal";

export function BootIntro() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [visibleLines, setVisibleLines] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [typed, setTyped] = useState("");
  const [greeted, setGreeted] = useState("");
  /* 마지막에 화면이 접힐 때 얼굴이 그대로 남아야 한다. phase만 보면 부팅 화면이 되돌아온다. */
  const [faceOn, setFaceOn] = useState(false);
  const [meltMs, setMeltMs] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const lockScroll = useCallback((on: boolean) => {
    document.documentElement.classList.toggle("scroll-locked", on);
  }, []);

  /**
   * 본문 등장 연출을 켜는 신호.
   * 히어로가 먼저 서고, 헤더가 내려온 뒤에 스크롤을 연다 —
   * 연출이 끝나자마자 스크롤이 열리면 첫 화면을 볼 새가 없다.
   */
  const releasePage = useCallback(() => {
    document.documentElement.classList.add("booted");
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setPhase("hidden");
    releasePage();
    timers.current.push(setTimeout(() => lockScroll(false), 1250));
    try {
      sessionStorage.setItem(BOOT_SEEN_KEY, "1");
    } catch {
      // 세션 저장소를 못 쓰면 매번 보여준다. 그 편이 안 보이는 것보다 낫다.
    }
  }, [clearTimers, lockScroll, releasePage]);

  /**
   * 끝맺음. 오버레이를 옅게 지우면서 그 아래 본문을 동시에 올린다.
   * 순서대로 하면 중간에 빈 화면이 한 박자 보인다.
   */
  const reveal = useCallback(
    (fadeMs: number) => {
      clearTimers();
      setMeltMs(fadeMs);
      setPhase("reveal");
      releasePage();
      after(fadeMs, finish);
    },
    [after, clearTimers, finish, releasePage],
  );

  /** 건너뛰기. 같은 방식으로, 더 짧게. */
  const skip = useCallback(() => reveal(360), [reveal]);

  /** 상태 변경은 전부 타이머 안에서 한다. 효과 본문에서 바로 바꾸지 않는다. */
  const start = useCallback(() => {
    clearTimers();
    lockScroll(true);
    // 다시 볼 때도 헤더와 본문이 처음처럼 올라오게 되돌린다.
    document.documentElement.classList.remove("booted");

    /*
      박자는 앞 박자에서 얼마 뒤인지로 적는다. 한 곳을 늘려도 뒤가 따라 밀린다.

      각 박자는 앞 동작이 끝나고, 그걸 한 번 볼 틈까지 지난 뒤에 온다.
      화면 켜짐 780ms, 접힘 560ms, 두리번 LOOK_MS — 도는 중에 다음으로 넘기면
      단계가 겹쳐 파바박 지나가고, 무슨 일이 일어났는지 눈에 남지 않는다.
    */
    let t = 0;
    const beat = (gap: number, fn: () => void) => {
      t += gap;
      after(t, fn);
    };
    // 커서가 잠깐 깜빡인 뒤(lead) 치기 시작한다. 프롬프트가 뜨자마자 글자가 붙으면 기계 같다.
    const type = (text: string, set: (s: string) => void, lead: number) => {
      text.split("").forEach((_, i) => beat(i === 0 ? lead : KEY_MS, () => set(text.slice(0, i + 1))));
    };

    beat(0, () => {
      setVisibleLines(0);
      setLoaded(false);
      setTyped("");
      setGreeted("");
      setFaceOn(false);
      setPhase("power");
    });

    beat(700, () => {
      setPhase("boot");
      setVisibleLines(1);
    });
    beat(250, () => setVisibleLines(2));
    beat(400, () => setLoaded(true));

    beat(250, () => setPhase("typing"));
    type(COMMAND, setTyped, 250);

    // 엔터를 친 한 박자 뒤, 화면이 접혔다가 얼굴로 다시 켜진다.
    beat(350, () => setPhase("fold"));
    beat(560, () => {
      setFaceOn(true);
      setPhase("face");
    });

    // 눈이 다 돌아보고 가운데로 돌아온 뒤에 인사한다.
    beat(LOOK_MS, () => setPhase("hello"));
    type(GREETING, setGreeted, 150);

    // 인사를 읽을 틈을 두고 녹인다.
    beat(500, () => reveal(640));
  }, [after, clearTimers, lockScroll, reveal]);

  // 첫 방문에서 한 번. 그 밖에는 곧바로 본문 연출을 풀어준다.
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem(BOOT_SEEN_KEY));
    } catch {
      // 세션 저장소를 못 쓰는 환경이면 그냥 보여준다.
    }

    if (reduced || seen) {
      releasePage();
      return;
    }

    start();
    return () => {
      clearTimers();
      lockScroll(false);
    };
  }, [clearTimers, lockScroll, releasePage, start]);

  // 첫 페인트부터 화면을 가리던 막(layout의 PRE_PAINT)을, 올라온 오버레이가 이어받는다.
  useEffect(() => {
    if (phase !== "hidden") document.documentElement.classList.remove("boot-pending");
  }, [phase]);

  // 도크에서 부르면 다시 돈다.
  useEffect(() => {
    const onReplay = () => start();
    window.addEventListener(REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(REPLAY_EVENT, onReplay);
  }, [start]);

  // 아무 키나 누르면 건너뛴다.
  useEffect(() => {
    if (phase === "hidden") return;
    const onKey = () => skip();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, skip]);

  if (phase === "hidden") return null;

  const isFace = faceOn;

  return (
    <div
      aria-hidden
      onClick={skip}
      /* data-reveal은 본문 스크롤 연출(reveal.tsx)이 쓰는 이름이다. 겹치면 이 화면이 통째로 투명해진다. */
      data-melt={phase === "reveal"}
      style={{ "--melt": `${meltMs}ms` } as React.CSSProperties}
      className="terminal fixed inset-0 z-[100] cursor-pointer bg-bg"
    >
      <div
        data-off={phase === "fold"}
        className="boot-screen scanlines relative flex h-full w-full items-center justify-center bg-bg"
      >
        <div className="boot-body flex h-full w-full items-center justify-center">
        {isFace ? (
          /* 화면 전체가 얼굴이다. */
          <div className="flex flex-col items-center gap-[9vmin]">
            {/* 좁고 붙어 있으면 일시정지 아이콘으로 읽힌다. 넓게 벌리고 둥글게. */}
            <div className="eyes flex items-center gap-[20vmin]">
              <span className="eye h-[19vmin] w-[9.5vmin] rounded-full bg-fg" />
              <span className="eye h-[19vmin] w-[9.5vmin] rounded-full bg-fg" />
            </div>

            <p className="h-6 font-mono text-sm text-fg">
              {(phase === "hello" || phase === "reveal") && (
                <span className="boot-fade inline-block">
                  <span className="text-accent">chajuick:~$</span> {greeted}
                  <span className="caret ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-accent" />
                </span>
              )}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-xl px-8 font-mono text-sm text-fg">
            {phase !== "power" && (
              <>
                {/* 줄 자리는 처음부터 다 잡아 둔다. 가운데 정렬이라 줄이 생길 때마다 묶음이 위로 튄다. */}
                {BOOT_LINES.map((line, i) => (
                  <p key={line} className={i < visibleLines ? "boot-fade text-fg-muted" : "invisible"}>
                    {line}
                    {loaded && i === BOOT_LINES.length - 1 && (
                      <span className="boot-fade ml-1.5 inline-block text-fg">{LOADED}</span>
                    )}
                  </p>
                ))}

                {/* 접히는 동안에도 친 명령이 남아 있어야 한다. 빠지면 접히기 직전에 한 번 튄다. */}
                <p className={phase === "typing" || phase === "fold" ? "boot-fade mt-6 text-fg" : "invisible mt-6"}>
                  <span className="text-accent">chajuick:~$</span> {typed}
                  <span className="caret ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-accent" />
                </p>
              </>
            )}
          </div>
        )}

        </div>

        <p className="label absolute right-6 bottom-6 text-fg-faint">아무 키나 눌러 건너뛰기</p>
      </div>
    </div>
  );
}
