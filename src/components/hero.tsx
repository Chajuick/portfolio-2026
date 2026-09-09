import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { profile } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-14 pb-24 sm:pt-24 sm:pb-32">
      <div className="grid items-center gap-16 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <p className="mb-6 flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            {profile.role}
          </p>

          <h1 className="display text-[clamp(3rem,10vw,6.5rem)]">
            {profile.name}
            <span className="block text-fg-faint">{profile.handle}</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg-muted sm:text-xl">
            {profile.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              작업 보기
              <ArrowDown aria-hidden className="size-4" />
            </Link>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-line-strong"
            >
              GitHub
              <span className="sr-only">(새 탭에서 열림)</span>
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[280px] pt-16 lg:pt-0">
          <Mascot />
        </div>
      </div>
    </section>
  );
}
