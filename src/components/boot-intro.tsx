"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
const SEEN_KEY = "chajuick:boot";

/** 도크가 다시 재생을 요청할 때 쓰는 신호. */
export const REPLAY_EVENT = "chajuick:replay";

const BOOT_LINES = ["chajuick 2026.9", "프로필 불러오는 중… 완료"];

type Phase = "hidden" | "power" | "boot" | "typing" | "fold" | "face" | "hello" | "out";

export function BootIntro() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [visibleLines, setVisibleLines] = useState(0);
  const [typed, setTyped] = useState("");
  const [greeted, setGreeted] = useState("");
  /* 마지막에 화면이 접힐 때 얼굴이 그대로 남아야 한다. phase만 보면 부팅 화면이 되돌아온다. */
  const [faceOn, setFaceOn] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  /** 본문 등장 연출을 켜는 신호. 연출이 끝나야 헤더와 내용이 올라온다. */
  const releasePage = useCallback(() => {
    document.documentElement.classList.add("booted");
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setPhase("hidden");
    releasePage();
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // 세션 저장소를 못 쓰면 매번 보여준다. 그 편이 안 보이는 것보다 낫다.
    }
  }, [clearTimers, releasePage]);

  /** 건너뛰기. 화면을 끄는 연출만 짧게 보여주고 걷는다. */
  const skip = useCallback(() => {
    clearTimers();
    setPhase("out");
    after(280, finish);
  }, [after, clearTimers, finish]);

  /** 상태 변경은 전부 타이머 안에서 한다. 효과 본문에서 바로 바꾸지 않는다. */
  const start = useCallback(() => {
    clearTimers();

    /*
      각 구간이 앞 동작을 끝까지 보고 넘어가게 잡았다.
      화면 켜짐 780ms, 접힘 560ms — 애니메이션이 도는 중에 다음 단계로 넘기면
      단계가 끊겨 보이고, 무슨 일이 일어났는지 눈에 남지 않는다.
    */
    after(0, () => {
      setVisibleLines(0);
      setTyped("");
      setGreeted("");
      setFaceOn(false);
      setPhase("power");
    });

    after(700, () => {
      setPhase("boot");
      setVisibleLines(1);
    });
    after(1100, () => setVisibleLines(2));
    after(1550, () => setPhase("typing"));

    const typeAt = 1650;
    COMMAND.split("").forEach((_, i) => {
      after(typeAt + i * 95, () => setTyped(COMMAND.slice(0, i + 1)));
    });

    // 다 치고 한 박자 쉰 뒤, 화면이 접혔다가 얼굴로 다시 켜진다.
    const introDone = typeAt + COMMAND.length * 95;
    after(introDone + 340, () => setPhase("fold"));

    const faceAt = introDone + 340 + 560;
    after(faceAt, () => {
      setFaceOn(true);
      setPhase("face");
    });

    // 눈이 다 돌아본 뒤에 인사한다.
    const helloAt = faceAt + 1700;
    after(helloAt, () => setPhase("hello"));
    GREETING.split("").forEach((_, i) => {
      after(helloAt + 120 + i * 95, () => setGreeted(GREETING.slice(0, i + 1)));
    });

    const helloDone = helloAt + 120 + GREETING.length * 95;
    after(helloDone + 420, () => setPhase("out"));
    after(helloDone + 420 + 560, finish);
  }, [after, clearTimers, finish]);

  // 첫 방문에서 한 번. 그 밖에는 곧바로 본문 연출을 풀어준다.
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem(SEEN_KEY));
    } catch {
      // 세션 저장소를 못 쓰는 환경이면 그냥 보여준다.
    }

    if (reduced || seen) {
      releasePage();
      return;
    }

    start();
    return clearTimers;
  }, [clearTimers, releasePage, start]);

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
    <div aria-hidden onClick={skip} className="terminal fixed inset-0 z-[100] cursor-pointer bg-bg">
      <div
        data-off={phase === "fold" || phase === "out"}
        className="boot-screen scanlines relative flex h-full w-full items-center justify-center bg-bg"
      >
        {isFace ? (
          /* 화면 전체가 얼굴이다. */
          <div className="flex flex-col items-center gap-[9vmin]">
            {/* 좁고 붙어 있으면 일시정지 아이콘으로 읽힌다. 넓게 벌리고 둥글게. */}
            <div className="eyes flex items-center gap-[20vmin]">
              <span className="eye h-[19vmin] w-[9.5vmin] rounded-full bg-fg" />
              <span className="eye h-[19vmin] w-[9.5vmin] rounded-full bg-fg" />
            </div>

            <p className="h-6 font-mono text-sm text-fg">
              {phase === "hello" && (
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
                {BOOT_LINES.slice(0, visibleLines).map((line) => (
                  <p key={line} className="boot-fade text-fg-muted">
                    {line}
                  </p>
                ))}

                {phase === "typing" && (
                  <p className="boot-fade mt-6 text-fg">
                    <span className="text-accent">chajuick:~$</span> {typed}
                    <span className="caret ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-accent" />
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <p className="label absolute right-6 bottom-6 text-fg-faint">아무 키나 눌러 건너뛰기</p>
      </div>
    </div>
  );
}
