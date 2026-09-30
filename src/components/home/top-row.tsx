import { ViewTransition } from "react";
import Link from "next/link";
import { GithubIcon } from "@/components/icons";
import { Mascot } from "@/components/mascot";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/lib/data";

/**
 * 페이지 맨 위 한 줄. 누구인지, 바깥 링크, 테마 전환 셋뿐이다.
 * 스크롤해도 따라온다 — 어디까지 읽었든 누구의 사이트인지와 테마 전환은 손 닿는 데 있어야 한다.
 * 바탕은 페이지와 같은 색을 반투명으로 깔아, 맨 위에서는 보이지 않고 내용 위에 올라탔을 때만 드러난다.
 *
 * 페이지를 넘길 때 헤더는 제자리에 있다(globals.css의 site-header).
 * 이 ViewTransition은 그 이름표이자, React가 페이지 넘김을 시작하게 하는 스위치다 —
 * 화면에 ViewTransition이 하나도 없으면 React는 넘김 자체를 건너뛴다.
 */
export function TopRow() {
  return (
    <ViewTransition name="site-header">
      <header className="sticky top-0 z-40 flex h-[4.5rem] items-center justify-between gap-6 bg-bg/80 px-6 backdrop-blur-md sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Mascot variant="mark" className="w-7" />
          <span className="flex items-baseline gap-3">
            <span className="text-sm font-medium text-fg">{profile.name}</span>
            <span className="hidden text-[12px] text-fg-muted sm:inline">프론트엔드 엔지니어 · 경남 창원</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub (새 탭)"
            className="grid size-9 place-items-center rounded-full text-fg-muted transition-colors hover:text-fg"
          >
            <GithubIcon className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </header>
    </ViewTransition>
  );
}
