"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * 2023년 판의 모니터 얼굴을 옮겨온 것.
 * 눈동자가 커서를 따라가는 동작만 남기고, 웃는 입은 뺐다.
 * 살아있다는 신호는 화면 안에서 깜빡이는 커서가 대신한다.
 * 장식이므로 스크린리더에서는 감춘다.
 */
export function Mascot({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  // 눈동자 추적
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist, 320) / 320;
      setPupil({ x: (dx / dist) * 6 * reach, y: (dy / dist) * 4.5 * reach });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // 눈 깜빡임
  useEffect(() => {
    if (reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      timer = setTimeout(
        () => {
          setBlink(true);
          setTimeout(() => setBlink(false), 120);
          loop();
        },
        3000 + Math.random() * 3600,
      );
    };
    loop();
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <div ref={wrapRef} className={`relative select-none ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 200 176"
        className="w-full overflow-visible"
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <filter id="mascot-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <clipPath id="mascot-screen">
            <rect x="26" y="20" width="148" height="96" rx="9" />
          </clipPath>
          <pattern id="mascot-scan" width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="1" fill="var(--screen-ink)" />
          </pattern>
        </defs>

        {/* 화면에서 새어나오는 빛 */}
        <ellipse
          cx="100"
          cy="72"
          rx="62"
          ry="42"
          fill="var(--accent)"
          opacity="0.16"
          filter="url(#mascot-glow)"
        />

        {/* 받침 */}
        <rect x="94" y="126" width="12" height="22" rx="2" fill="var(--fg-faint)" opacity="0.55" />
        <rect x="64" y="148" width="72" height="6" rx="3" fill="var(--fg-muted)" />

        {/* 본체 */}
        <rect
          x="16"
          y="10"
          width="168"
          height="116"
          rx="16"
          fill="var(--bg-raised)"
          stroke="var(--line-strong)"
          strokeWidth="3.5"
        />

        {/* 화면 */}
        <g clipPath="url(#mascot-screen)">
          <rect x="26" y="20" width="148" height="96" fill="var(--screen)" />

          {/* 눈 */}
          <g
            transform={`translate(${pupil.x} ${pupil.y})`}
            style={{ transition: reduced ? undefined : "transform 220ms cubic-bezier(0.16,1,0.3,1)" }}
          >
            {blink ? (
              <>
                <rect x="66" y="58" width="20" height="4" rx="2" fill="var(--screen-ink)" />
                <rect x="114" y="58" width="20" height="4" rx="2" fill="var(--screen-ink)" />
              </>
            ) : (
              <>
                <rect x="70" y="44" width="12" height="32" rx="6" fill="var(--screen-ink)" />
                <rect x="118" y="44" width="12" height="32" rx="6" fill="var(--screen-ink)" />
              </>
            )}
          </g>

          {/* 입 대신 커서 */}
          <rect x="93" y="92" width="14" height="3" rx="1.5" fill="var(--accent)">
            <animate
              attributeName="opacity"
              values="1;1;0;0;1"
              keyTimes="0;0.45;0.5;0.95;1"
              dur="1.4s"
              repeatCount="indefinite"
            />
          </rect>

          {/* 주사선 */}
          <rect x="26" y="20" width="148" height="96" fill="url(#mascot-scan)" opacity="0.06" />
        </g>

        {/* 전원 표시 */}
        <circle cx="100" cy="121" r="1.8" fill="var(--accent)" />
      </motion.svg>
    </div>
  );
}
