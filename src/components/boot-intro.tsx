"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 들어오면 화면이 켜지고 chajuick이 실행되면서 /intro를 치는 연출.
 *
 * 이건 덧씌우는 층일 뿐이다. 아래 페이지는 서버에서 이미 다 그려져 있고,
 * 이 컴포넌트는 마운트된 뒤에야 올라온다. 스크립트가 죽으면 연출만 사라진다.
 * 2023년 판처럼 내용을 가리는 연출은 만들지 않는다.
 *
 * 세션당 한 번만 돈다. 두 번째 방문자를 3초씩 붙잡아둘 이유가 없다.
 */

const COMMAND = "/intro";
const SEEN_KEY = "chajuick:boot";

const BOOT_LINES = ["chajuick 2026.9", "프로필 불러오는 중… 완료"];

type Phase = "hidden" | "power" | "boot" | "typing" | "off";

export function BootIntro() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [visibleLines, setVisibleLines] = useState(0);
  const [typed, setTyped] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setPhase("hidden");
    // 다 보고 나서야 기록한다. 시작할 때 쓰면 연출이 끊긴 방문자가 다시는 못 본다.
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // 세션 저장소를 못 쓰면 매번 보여준다. 그 편이 안 보이는 것보다 낫다.
    }
  }, [clearTimers]);

  /** 건너뛰기. 화면을 끄는 연출만 짧게 보여주고 걷는다. */
  const skip = useCallback(() => {
    clearTimers();
    setPhase("off");
    after(300, finish);
  }, [after, clearTimers, finish]);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem(SEEN_KEY));
    } catch {
      // 세션 저장소를 못 쓰는 환경이면 그냥 보여준다.
    }
    if (seen) return;

    // 상태 변경은 전부 타이머 안에서 한다. 효과 본문에서 바로 바꾸지 않는다.
    after(0, () => setPhase("power"));
    after(620, () => {
      setPhase("boot");
      setVisibleLines(1);
    });
    after(920, () => setVisibleLines(2));
    after(1260, () => setPhase("typing"));

    COMMAND.split("").forEach((_, i) => {
      after(1300 + i * 85, () => setTyped(COMMAND.slice(0, i + 1)));
    });

    const typedDone = 1300 + COMMAND.length * 85;
    after(typedDone + 420, () => setPhase("off"));
    after(typedDone + 880, finish);

    return clearTimers;
  }, [after, clearTimers, finish]);

  // ESC나 아무 곳이나 누르면 건너뛴다.
  useEffect(() => {
    if (phase === "hidden") return;
    const onKey = () => skip();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, skip]);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      onClick={skip}
      className="terminal fixed inset-0 z-[100] cursor-pointer bg-bg"
    >
      <div
        data-off={phase === "off"}
        className="boot-screen scanlines relative flex h-full w-full items-center justify-center bg-bg"
      >
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

        <p className="label absolute right-6 bottom-6 text-fg-faint">아무 키나 눌러 건너뛰기</p>
      </div>
    </div>
  );
}
