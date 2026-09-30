import type { Metadata } from "next";
import { Noto_Sans_KR, Archivo, JetBrains_Mono, Hahmlet, Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { BootIntro } from "@/components/boot-intro";
import { Dock } from "@/components/dock";
import { profile } from "@/lib/data";
import { BOOT_SEEN_KEY, siteUrl } from "@/lib/site";
import "./globals.css";
import "./v2.css";

const sansKr = Noto_Sans_KR({
  variable: "--font-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/*
  새 디자인의 서체. 제목은 가는 한글 세리프(Hahmlet), 본문과 숫자는 Geist.
  기본 고딕 한 벌로 가면 흔한 인상이 되어서, 제목만큼은 드문 서체로 간다.
*/
const serif = Hahmlet({ variable: "--font-v2-serif", subsets: ["latin"], display: "swap" });
const geist = Geist({ variable: "--font-v2-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-v2-mono", subsets: ["latin"], display: "swap" });

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

/*
  첫 페인트 전에 도는 스크립트.
  - data-js: 스크롤 연출을 켠다.
  - boot-pending: 첫 연출이 나올 차례면 화면을 미리 가린다. 오버레이는 하이드레이션이
    끝나야 올라오므로, 그 사이 완성된 페이지가 한 번 번쩍 보인다. 오버레이가 올라오면
    연출이 막을 떼고, 끝내 안 올라오면 4초 뒤 스스로 걷는다.
  연출이 나올지 판단하는 조건은 BootIntro와 같아야 한다.
*/
const PRE_PAINT = `(function(){var d=document.documentElement,seen=false;d.dataset.js="";
try{seen=!!sessionStorage.getItem(${JSON.stringify(BOOT_SEEN_KEY)})}catch(e){}
if(seen||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches))return;
d.classList.add("boot-pending");setTimeout(function(){d.classList.remove("boot-pending")},4000)})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      // 부드러운 스크롤은 페이지 안에서만. 다른 페이지로 넘어갈 땐 Next가 잠시 꺼서 새 페이지가 맨 위에서 바로 시작한다.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${sansKr.variable} ${display.variable} ${mono.variable} ${serif.variable} ${geist.variable} ${geistMono.variable} h-full`}
    >
      <head>
        {/*
          Pretendard는 빌드 때 받지 않고 브라우저가 받는다.
          next/font로 묶으면 빌드가 네트워크를 타야 해서, 오프라인 빌드에서 깨진다.
        */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="grain min-h-full">
        {/* 스크롤 연출을 켜는 표시. 이 스크립트가 안 돌면 CSS가 아무것도 감추지 않는다. */}
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
        <ThemeProvider>
          {children}
          {/* 연출과 도크는 본문 위에 얹히는 층이다. 내용을 가리지 않는다. */}
          <BootIntro />
          <Dock />
        </ThemeProvider>
      </body>
    </html>
  );
}
