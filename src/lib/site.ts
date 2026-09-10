/** 배포 도메인. 메타데이터·사이트맵·robots가 전부 여기를 본다. */
export const siteUrl = "https://chajuick.vercel.app";

/** command는 도크의 chajuick이 받아치는 명령어다. 이동은 링크가 그대로 한다. */
export const sections = [
  { id: "work", label: "실무", href: "/#work", command: "/work" },
  { id: "lab", label: "프로젝트", href: "/#lab", command: "/projects" },
  { id: "about", label: "소개", href: "/#about", command: "/about" },
] as const;

/** 도크에 명령어를 흘려보내는 신호. */
export const COMMAND_EVENT = "chajuick:command";

export type CommandDetail = { command: string; reply: string };
