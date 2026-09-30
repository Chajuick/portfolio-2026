import { projects } from "@/lib/data";

/**
 * 첫 화면 모니터에 차례로 뜨는 작업들.
 * 데스크톱 화면이 있는 것만, 실무부터. 목록 순서(세계 순)를 그대로 따른다.
 * 2D 화면과 3D 화면이 같은 목록을 써야 바꿔 끼울 때 같은 장면이 이어진다.
 */
export const slides = projects
  .filter((p) => p.shots?.some((s) => s.device === "desktop"))
  .sort((a, b) => Number(b.kind === "work") - Number(a.kind === "work"))
  .slice(0, 8)
  .map((p) => ({
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    src: p.shots!.find((s) => s.device === "desktop")!.src,
    detail: Boolean(p.problem || p.decisions?.length),
  }));

export type Slide = (typeof slides)[number];

/** 한 장이 머무는 시간 */
export const SLIDE_MS = 3600;
