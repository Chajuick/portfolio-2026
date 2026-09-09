import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="display text-7xl text-fg-faint">404</p>
      <p className="text-base text-fg-muted">여긴 아무것도 없습니다.</p>
      <Link
        href="/"
        className="rounded-full border border-line px-5 py-2.5 text-sm text-fg transition-colors hover:border-line-strong"
      >
        처음으로
      </Link>
    </main>
  );
}
