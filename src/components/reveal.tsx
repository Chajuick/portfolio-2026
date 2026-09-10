"use client";

import { useEffect, useRef } from "react";

/**
 * 스크롤 진입 시 한 번만 올라오는 래퍼.
 *
 * 감추는 일은 CSS(globals.css)가 하고, 여기서는 들어왔다는 표시만 남긴다.
 * 그래서 JS가 죽으면 연출만 사라지고 내용은 그대로 보인다 —
 * initial opacity를 서버 HTML에 박으면 스크립트가 실패한 순간 백지가 된다.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "li" | "section";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.setAttribute("data-reveal", "in");

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
