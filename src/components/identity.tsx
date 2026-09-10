import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { profile } from "@/lib/data";

/** 등장 순서. 지연을 CSS 변수로 넘겨 한 줄씩 올라오게 한다. */
function delay(seconds: number) {
  return { "--enter-delay": `${seconds}s` } as React.CSSProperties;
}

/**
 * 왼쪽에 붙박이로 남는 신원 블록.
 * 작업이 이 옆을 흘러간다 — 주장과 증거가 같은 화면에 놓이도록.
 */
export function Identity() {
  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <p className="enter label text-fg-muted" style={delay(0.06)}>
        {profile.role}
      </p>

      <h1 className="enter display mt-3 text-[clamp(2.5rem,4.5vw,3.5rem)]" style={delay(0.1)}>
        {profile.name}
        <span className="display-en mt-1 block text-[0.82em] text-fg-faint">{profile.handle}</span>
      </h1>

      <p
        className="enter mt-7 text-lg leading-snug font-medium text-balance text-fg"
        style={delay(0.16)}
      >
        {profile.tagline}
      </p>

      {/* 표처럼 보이도록 헤어라인으로만 나눈다. */}
      <dl className="enter mt-8 border-t border-line" style={delay(0.22)}>
        {profile.meta.map((m) => (
          <div key={m.label} className="border-b border-line py-2.5">
            <dt className="label text-fg-faint">{m.label}</dt>
            <dd className="mt-1 text-sm text-fg-muted">{m.value}</dd>
          </div>
        ))}
      </dl>

      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer noopener"
        className="enter group mt-7 inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-accent"
        style={delay(0.28)}
      >
        <GithubIcon className="size-4" />
        github.com/{profile.handle}
        <ArrowUpRight
          aria-hidden
          className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
        <span className="sr-only">(새 탭에서 열림)</span>
      </a>
    </div>
  );
}
