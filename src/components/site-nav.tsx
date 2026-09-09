"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GithubIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/lib/data";

const SECTIONS = [
  { href: "/#work", label: "실무" },
  { href: "/#lab", label: "실험실" },
  { href: "/#craft", label: "잡동사니" },
  { href: "/#about", label: "소개" },
];

export function SiteNav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="주요"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6"
      >
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-fg transition-colors hover:text-accent"
        >
          {profile.name}
          <span className="text-fg-faint"> / {profile.handle}</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 sm:flex">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="rounded-full px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-bg-sunken hover:text-fg"
                >
                  {s.label}
                </Link>
              </li>
            ))}
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
    </header>
  );
}
