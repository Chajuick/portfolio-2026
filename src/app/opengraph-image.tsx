import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.role}`;

/**
 * 공유 미리보기 이미지.
 *
 * 여기만 색을 직접 쓴다. 서버에서 PNG로 굽는 그림이라 CSS 변수를 읽을 수 없다.
 * 값은 globals.css의 다크 토큰과 같게 유지할 것.
 * 한글을 쓰려면 폰트 파일을 함께 심어야 해서, 문구는 라틴으로만 세웠다.
 */
const ink = "#0c0c0b";
const paper = "#f3f1ea";
const muted = "#969186";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: ink,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", color: muted, fontSize: 24, letterSpacing: 6 }}>
          FRONTEND ENGINEER
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: paper, fontSize: 132, fontWeight: 800, letterSpacing: -5 }}>
              {profile.handle}
            </div>
            <div style={{ color: muted, fontSize: 30, marginTop: 18 }}>
              B2B SaaS for manufacturing &amp; accounting
            </div>
          </div>

          {/* 사이트의 모니터 마스코트. 화면 안에는 눈 둘뿐이다. */}
          <div
            style={{
              display: "flex",
              width: 240,
              height: 168,
              borderRadius: 24,
              border: `6px solid ${paper}`,
              background: "#1b1b19",
              alignItems: "center",
              justifyContent: "center",
              gap: 34,
            }}
          >
            <div style={{ width: 22, height: 58, borderRadius: 11, background: paper }} />
            <div style={{ width: 22, height: 58, borderRadius: 11, background: paper }} />
          </div>
        </div>

        <div style={{ display: "flex", color: muted, fontSize: 24, letterSpacing: 1 }}>
          React · TypeScript · Next.js — github.com/{profile.handle}
        </div>
      </div>
    ),
    size,
  );
}
