import type { Metadata } from "next";
import { Noto_Sans_KR, Archivo, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const sansKr = Noto_Sans_KR({
  variable: "--font-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["800", "900"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,
  keywords: ["프론트엔드", "React", "Next.js", "TypeScript", "포트폴리오", profile.handle],
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: `${profile.name} 포트폴리오`,
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${sansKr.variable} ${display.variable} ${mono.variable} h-full`}
    >
      <body className="grain min-h-full">
        {/* 스크롤 연출을 켜는 표시. 이 스크립트가 안 돌면 CSS가 아무것도 감추지 않는다. */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.dataset.js=""' }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
