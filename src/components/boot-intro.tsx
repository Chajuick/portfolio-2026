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

    after(0, () => {
      setVisibleLines(0);
      setTyped("");
      setGreeted("");
      setPhase("power");
    });
    after(500, () => {
      setPhase("boot");
      setVisibleLines(1);
    });
    after(740, () => setVisibleLines(2));
    after(1000, () => setPhase("typing"));

    COMMAND.split("").forEach((_, i) => {
      after(1040 + i * 70, () => setTyped(COMMAND.slice(0, i + 1)));
    });

    // 화면이 한 번 접혔다가, 얼굴로 다시 켜진다.
    const introDone = 1040 + COMMAND.length * 70;
    after(introDone + 260, () => setPhase("fold"));
    after(introDone + 660, () => setPhase("face"));

    const faceAt = introDone + 660;
    after(faceAt + 1150, () => setPhase("hello"));
    GREETING.split("").forEach((_, i) => {
      after(faceAt + 1190 + i * 70, () => setGreeted(GREETING.slice(0, i + 1)));
    });

    const helloDone = faceAt + 1190 + GREETING.length * 70;
    after(helloDone + 320, () => setPhase("out"));
    after(helloDone + 720, finish);
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

  const isFace = phase === "face" || phase === "hello";

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
                <>
                  <span className="text-accent">chajuick:~$</span> {greeted}
                  <span className="caret ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-accent" />
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-xl px-8 font-mono text-sm text-fg">
            {phase !== "power" && (
              <>
                {BOOT_LINES.slice(0, visibleLines).map((line) => (
                  <p key={line} className="text-fg-muted">
                    {line}
                  </p>
                ))}

                {phase === "typing" && (
                  <p className="mt-6 text-fg">
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
