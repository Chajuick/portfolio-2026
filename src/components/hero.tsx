import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { profile } from "@/lib/data";

/** 등장 순서. 지연을 CSS 변수로 넘겨 한 줄씩 올라오게 한다. */
function delay(seconds: number) {
  return { "--enter-delay": `${seconds}s` } as React.CSSProperties;
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-20 px-6 pt-10 pb-20 sm:pt-20 sm:pb-28 lg:grid-cols-[1.45fr_1fr] lg:items-center lg:gap-20">
        <div>
          <p className="enter label text-fg-muted" style={delay(0)}>
            {profile.role}
          </p>

          <h1 className="enter display mt-7 text-[clamp(3.25rem,11vw,7rem)]" style={delay(0.08)}>
            {profile.name}
            <span className="display-en mt-2 block text-fg-faint">{profile.handle}</span>
          </h1>

          <p
            className="enter mt-9 max-w-xl text-xl leading-snug font-medium text-fg text-balance sm:text-2xl"
            style={delay(0.16)}
          >
            {profile.tagline}
          </p>

          <div className="enter mt-5 max-w-xl space-y-1.5" style={delay(0.22)}>
            {profile.intro.map((line) => (
              <p key={line} className="text-base leading-relaxed text-fg-muted">
                {line}
              </p>
            ))}
          </div>

          {/* 메타. 표처럼 보이도록 헤어라인으로만 나눈다. */}
          <dl className="enter mt-10 max-w-xl border-t border-line" style={delay(0.3)}>
            {profile.meta.map((m) => (
              <div
                key={m.label}
                className="flex items-baseline gap-6 border-b border-line py-2.5"
              >
                <dt className="label w-32 shrink-0 text-fg-faint">{m.label}</dt>
                <dd className="text-sm text-fg-muted">{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="enter mt-10 flex flex-wrap items-center gap-3" style={delay(0.38)}>
            <Link
              href="/#work"
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-transform duration-300 hover:-translate-y-0.5"
            >
              작업 보기
              <ArrowDown
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </Link>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-fg transition-colors duration-300 hover:border-line-strong"
            >
              GitHub
              <span className="sr-only">(새 탭에서 열림)</span>
            </a>
          </div>
        </div>

        {/* 화면을 곡선으로 가르는 큰 원. 오른쪽 밖으로 흘러나가 잘린다. */}
        <div className="enter relative flex justify-center" style={delay(0.44)}>
          <div
            aria-hidden
            className="surface-invert pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg lg:left-0 lg:w-[130vw] lg:max-w-[900px] lg:translate-x-0"
          />
          <div className="surface-invert relative w-full max-w-[230px] sm:max-w-[270px] lg:translate-x-14">
            <Mascot />
          </div>
        </div>
      </div>
    </section>
  );
}
