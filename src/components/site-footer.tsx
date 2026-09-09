import { GithubIcon } from "@/components/icons";
import { profile } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-fg-faint">
          © {new Date().getFullYear()} {profile.name}. 2023년 판을 다시 지었습니다.
        </p>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex w-fit items-center gap-2 font-mono text-xs text-fg-muted transition-colors hover:text-accent"
        >
          <GithubIcon className="size-3.5" />
          github.com/{profile.handle}
          <span className="sr-only">(새 탭에서 열림)</span>
        </a>
      </div>
    </footer>
  );
}
