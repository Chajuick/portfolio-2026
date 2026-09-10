"use client";

import { ThemeProvider as NextThemes } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    /*
      기본을 다크로 둔다. 히어로 무대가 늘 어두워서, 라이트로 열면 내비 띠만
      밝게 남아 이음매가 보인다. 라이트는 토글로 그대로 쓸 수 있다.
    */
    <NextThemes attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
