"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * 2023년 판의 모니터 얼굴을 옮겨온 것.
 * 화면 안에는 눈 둘뿐이다. 입도, 입을 대신하는 무엇도 두지 않는다.
 *
 * mark는 이름 옆에 놓는 작은 판이다. 이 크기에서는 커서를 따라가는 눈이
 * 캐릭터가 아니라 디테일로 읽힌다. 장식이므로 스크린리더에서는 감춘다.
 */
export function Mascot({
  className = "",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "mark";
}) {
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

  if (variant === "mark") {
    return (
      <div ref={wrapRef} className={`select-none ${className}`} aria-hidden="true">
        <svg viewBox="0 0 64 52" className="w-full">
          <rect
            x="2.5"
            y="2.5"
            width="59"
            height="47"
            rx="12"
            fill="var(--bg-raised)"
            stroke="var(--line-strong)"
            strokeWidth="5"
          />
          <g
            transform={`translate(${pupil.x * 0.5} ${pupil.y * 0.5})`}
            style={{
              transition: reduced ? undefined : "transform 220ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {blink ? (
              <>
                <rect x="18" y="24" width="10" height="4" rx="2" fill="var(--fg)" />
                <rect x="36" y="24" width="10" height="4" rx="2" fill="var(--fg)" />
              </>
            ) : (
              <>
                <rect x="20" y="17" width="6" height="18" rx="3" fill="var(--fg)" />
                <rect x="38" y="17" width="6" height="18" rx="3" fill="var(--fg)" />
              </>
            )}
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`relative select-none ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 200 176"
        className="w-full overflow-visible"
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <clipPath id="mascot-screen">
            <rect x="26" y="20" width="148" height="96" rx="9" />
          </clipPath>
          <pattern id="mascot-scan" width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="1" fill="var(--screen-ink)" />
          </pattern>
        </defs>

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
                <rect x="66" y="66" width="20" height="4" rx="2" fill="var(--screen-ink)" />
                <rect x="114" y="66" width="20" height="4" rx="2" fill="var(--screen-ink)" />
              </>
            ) : (
              <>
                <rect x="70" y="52" width="12" height="32" rx="6" fill="var(--screen-ink)" />
                <rect x="118" y="52" width="12" height="32" rx="6" fill="var(--screen-ink)" />
              </>
            )}
          </g>

          {/* 주사선 */}
          <rect x="26" y="20" width="148" height="96" fill="url(#mascot-scan)" opacity="0.06" />
        </g>

      </motion.svg>
    </div>
  );
}
