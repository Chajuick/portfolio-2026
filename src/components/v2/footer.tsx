import { profile } from "@/lib/data";

/** 페이지 끝. 말은 짧게, 한 줄로. */
export function V2Footer() {
  return (
    <footer className="v2-mono flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-10 text-[11px] text-fg-faint sm:px-10">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span>Next.js 16 · React 19 · 직접 짓고 직접 씁니다</span>
    </footer>
  );
}
