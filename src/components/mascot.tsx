"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * 2023년 판 포트폴리오의 모니터 얼굴 마스코트를 옮겨온 것.
 * 눈동자가 커서를 따라가고 말풍선이 한 글자씩 찍히는 동작은 그대로 두되,
 * 데코레이션이므로 스크린리더에서는 감춘다.
 */

const LINES = [
  "안녕하세요.",
  "만드는 걸 좋아합니다.",
  "아래로 내려보세요.",
];

export function Mascot({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [typed, setTyped] = useState("");
  const [blink, setBlink] = useState(false);

  // 눈동자 추적
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const max = 5;
      const k = Math.min(dist, 260) / 260;
      setPupil({ x: (dx / dist) * max * k, y: (dy / dist) * max * k });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // 눈 깜빡임
  useEffect(() => {
    if (reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      timer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        loop();
      }, 2600 + Math.random() * 3200);
    };
    loop();
    return () => clearTimeout(timer);
  }, [reduced]);

  // 타이핑 말풍선
  useEffect(() => {
    if (reduced) return;
    let line = 0;
    let char = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const text = LINES[line];
      if (char <= text.length) {
        setTyped(text.slice(0, char));
        char += 1;
        timer = setTimeout(tick, 85);
      } else {
        timer = setTimeout(() => {
          line = (line + 1) % LINES.length;
          char = 0;
          tick();
        }, 2400);
      }
    };
    tick();
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <div ref={wrapRef} className={`relative select-none ${className}`} aria-hidden="true">
      {/* 말풍선 */}
      <div className="absolute -top-3 left-1/2 min-h-9 w-max max-w-[15rem] -translate-x-1/2 -translate-y-full">
        <div className="relative rounded-2xl border border-line bg-bg-raised px-4 py-2 text-sm text-fg shadow-[var(--shadow)]">
          {/* 모션을 줄인 환경에서는 타이핑 없이 첫 문장만 보여준다 */}
          <span className="font-mono">{reduced ? LINES[0] : typed}</span>
          <motion.span
            className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-accent"
            animate={reduced ? undefined : { opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
          <span className="absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b border-line bg-bg-raised" />
        </div>
      </div>

      <motion.svg
        viewBox="0 0 160 150"
        className="w-full"
        animate={reduced ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* 받침 */}
        <rect x="58" y="120" width="44" height="6" rx="3" fill="var(--fg-faint)" />
        <rect x="42" y="132" width="76" height="7" rx="3.5" fill="var(--fg-muted)" />
        {/* 본체 */}
        <rect
          x="10"
          y="12"
          width="140"
          height="108"
          rx="18"
          fill="var(--bg-raised)"
          stroke="var(--line-strong)"
          strokeWidth="5"
        />
        {/* 눈 */}
        <g transform={`translate(${pupil.x} ${pupil.y})`}>
          {blink ? (
            <>
              <rect x="46" y="62" width="20" height="5" rx="2.5" fill="var(--fg)" />
              <rect x="94" y="62" width="20" height="5" rx="2.5" fill="var(--fg)" />
            </>
          ) : (
            <>
              <rect x="50" y="48" width="12" height="32" rx="6" fill="var(--fg)" />
              <rect x="98" y="48" width="12" height="32" rx="6" fill="var(--fg)" />
            </>
          )}
        </g>
        {/* 입 */}
        <path
          d="M62 94 Q80 106 98 94"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </motion.svg>
    </div>
  );
}
