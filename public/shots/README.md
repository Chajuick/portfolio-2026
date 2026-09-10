# 화면 캡처

상세 페이지에 기기 테두리로 들어가는 실제 화면을 여기에 둔다.

- 파일명: `{slug}-{화면이름}.png` (예: `donidora-dashboard.png`)
- 데스크톱: 16:10 근처가 가장 잘 맞는다 (예: 1600×1000)
- 모바일: 9:19.5 근처 (예: 390×844)
- 비율이 달라도 깨지지는 않는다. 위쪽을 기준으로 잘린다.

연결은 `src/lib/data.ts`의 해당 프로젝트에 `shots`를 추가한다.

```ts
shots: [
  { src: "/shots/donidora-dashboard.png", alt: "회계 대시보드", device: "desktop", caption: "월 마감 화면" },
  { src: "/shots/donidora-mobile.png", alt: "모바일 조회", device: "mobile" },
],
```

`shots`가 없는 프로젝트는 화면 구역 자체가 그려지지 않는다.
