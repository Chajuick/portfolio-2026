/** 배포 도메인. 메타데이터·사이트맵·robots가 전부 여기를 본다. */
export const siteUrl = "https://chajuick.vercel.app";

export const sections = [
  { id: "work", label: "실무", href: "/#work" },
  { id: "lab", label: "프로젝트", href: "/#lab" },
  { id: "craft", label: "실험", href: "/#craft" },
  { id: "about", label: "소개", href: "/#about" },
] as const;
