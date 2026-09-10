import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-7 px-6 text-center">
      <p className="display-en text-[clamp(4rem,18vw,9rem)] text-fg-faint">404</p>
      <p className="text-base text-fg-muted">없는 페이지입니다.</p>
      <Link
        href="/"
        className="rounded-full border border-line px-6 py-3 text-sm text-fg transition-colors duration-300 hover:border-line-strong"
      >
        처음으로
      </Link>
    </main>
  );
}
