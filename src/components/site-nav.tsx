"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GithubIcon } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { ThemeToggle } from "@/components/theme-toggle";
import { sections, COMMAND_EVENT, type CommandDetail } from "@/lib/site";
import { profile } from "@/lib/data";

export function SiteNav() {
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 지금 보고 있는 섹션을 메뉴에 표시한다. 섹션이 없는 페이지에서는 아무것도 켜지지 않는다.
  useEffect(() => {
    const ids = sections.map((s) => s.id).filter((id) => document.getElementById(id));
    if (!ids.length || typeof IntersectionObserver === "undefined") return;

    const inBand = new Map<string, boolean>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) inBand.set(entry.target.id, entry.isIntersecting);
        // 문서 순서상 가장 앞선 것을 고른다. 걸린 게 없으면 표시를 끈다.
        setActive(ids.find((id) => inBand.get(id)) ?? null);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`enter-down sticky top-0 z-50 transition-colors duration-500 ${
        solid ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="주요"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6"
      >
        <Link href="/" aria-label={`${profile.name} 홈`} className="block w-9">
          <Mascot variant="mark" className="w-full" />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center sm:flex">
            {sections.map((s) => {
              const on = active === s.id;
              return (
                <li key={s.id} className="relative">
                  <Link
                    href={s.href}
                    aria-current={on ? "true" : undefined}
                    onClick={() => {
                      // 이동은 링크가 그대로 한다. 도크는 같은 명령을 받아치기만 한다 —
                      // 연출 때문에 이동이 늦어지면 두 번째 클릭부터 성가시다.
                      window.dispatchEvent(
                        new CustomEvent<CommandDetail>(COMMAND_EVENT, {
                          detail: { command: s.command, reply: `${s.label} 화면으로 이동합니다.` },
                        }),
                      );
                    }}
                    className={`relative z-10 block px-3.5 py-1.5 text-sm transition-colors duration-300 ${
                      on ? "text-fg" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {s.label}
                  </Link>
                  {on && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-bg-sunken"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub 프로필 (새 탭)"
            className="grid size-9 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <GithubIcon className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </nav>

      {/* 스크롤 진행. CSS 스크롤 타임라인이 있는 브라우저에서만 그려진다. */}
      <div
        aria-hidden
        className="scroll-progress absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
      />
    </header>
  );
}
