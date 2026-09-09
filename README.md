# portfolio-2026

차주익(chajuick) 개인 포트폴리오. 2023년 판(`portfolio-2023`)을 다시 지은 것.

## 2023년 판에서 바꾼 것

| 2023 | 2026 | 이유 |
|---|---|---|
| CRA + HashRouter (`/#/intro`) | Next.js App Router 정적 라우트 | SEO 색인, OG 미리보기, 공유 링크 |
| `overflow-x: scroll` 가로 스크롤 강제 | 일반 세로 스크롤 | 스크롤바 상시 노출, 세로 스크롤 봉인 해소 |
| 폴더 아이콘 2번 클릭 → 모달 | 카드 → 케이스 스터디 페이지 | 내용을 숨기지 않음 |
| SWOT 자기소개 (약점·위기 나열) | 문제 → 판단 → 결과 케이스 스터디 | 포트폴리오는 자소서가 아님 |
| 컴포넌트마다 미디어쿼리 6벌 | Tailwind 반응형 유틸 | 유지보수 |
| 다크 고정 | 라이트/다크 (`next-themes`) | 사용자 선택 존중 |
| 소스맵 프로덕션 노출 | 기본값(비노출) | 소스 유출 |

계승한 것: 다크 톤, 두꺼운 산세리프 디스플레이 타이포, 모니터 얼굴 AI 마스코트(눈동자 커서 추적 + 타이핑 말풍선).

## 스택

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Motion · next-themes

## 규칙

**색은 `src/app/globals.css`의 CSS 변수로만 정의한다.** 컴포넌트에 색을 직접 쓰지 않는다.
다크 모드에서 흰 배경에 흰 글씨가 나오는 사고는 전부 이 규칙을 어겨서 생긴다.

## 개발

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
pnpm lint
```

## 콘텐츠 수정

프로젝트·소개·스킬은 전부 `src/lib/data.ts` 한 곳에 있다. 컴포넌트를 건드릴 필요 없다.

`problem` 또는 `decisions`가 있는 프로젝트만 `/work/[slug]` 상세 페이지가 생성된다.

## 배포

Vercel. `main` 푸시 시 자동 배포.
배포 후 `src/app/layout.tsx`와 `src/app/sitemap.ts`, `src/app/robots.ts`의
`siteUrl`을 실제 도메인으로 바꿀 것.
