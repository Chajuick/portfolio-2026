import { GithubIcon } from "@/components/icons";
import { profile } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="display text-2xl text-fg">{profile.handle}</p>
          <p className="label mt-3 text-fg-faint">© {new Date().getFullYear()} {profile.name}</p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
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
          <p className="text-xs text-fg-faint">2023년 판을 다시 지었습니다</p>
        </div>
      </div>
    </footer>
  );
}
