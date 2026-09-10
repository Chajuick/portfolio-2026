import { Mascot } from "@/components/mascot";
import { GithubIcon } from "@/components/icons";
import { profile } from "@/lib/data";

/**
 * 반전된 띠로 페이지를 닫는다.
 * 장식을 더하는 대신 색조를 한 번 뒤집어 끝을 만든다.
 */
export function SiteFooter() {
  return (
    <footer className="surface-invert bg-bg text-fg">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Mascot variant="mark" className="size-12" />
          <p className="display-en mt-6 text-3xl">{profile.handle}</p>
          <p className="mt-2 text-sm text-fg-muted">{profile.tagline}</p>
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
          <p className="text-xs text-fg-faint">
            © {new Date().getFullYear()} {profile.name} · 2023년 판을 다시 지었습니다
          </p>
        </div>
      </div>
    </footer>
  );
}
