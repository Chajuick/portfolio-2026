import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";

/**
 * 개인 프로젝트 항목.
 * 테두리 상자 대신 위쪽 헤어라인 하나만 둔다. 상자가 많아지면 내용보다 상자가 먼저 읽힌다.
 * compact는 실험 목록용 — 요약을 접고 제목만 세운다.
 */
export function ProjectCard({
  project,
  index,
  compact = false,
}: {
  project: Project;
  index?: number;
  compact?: boolean;
}) {
  const detail = Boolean(project.problem || project.decisions?.length);
  const Wrapper = detail ? Link : "div";

  return (
    <Wrapper
      {...({ href: detail ? `/work/${project.slug}` : undefined } as { href: string })}
      className="group flex h-full flex-col border-t border-line pt-5 transition-colors duration-500 hover:border-line-strong"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="label-en text-fg-faint">
          {typeof index === "number" ? String(index + 1).padStart(2, "0") : ""}
        </span>
        {detail && (
          <ArrowUpRight
            aria-hidden
            className="size-4 -translate-x-1 text-accent opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
          />
        )}
      </div>

      <h3 className="mt-4 text-lg font-bold tracking-tight text-fg transition-transform duration-500 group-hover:translate-x-0.5">
        {project.title}
      </h3>
      <p className="mt-1.5 text-sm font-medium text-accent">{project.subtitle}</p>

      {!compact && (
        <p className="mt-3.5 grow text-sm leading-relaxed text-fg-muted">{project.summary}</p>
      )}

      <p className={`text-[11px] text-fg-faint ${compact ? "mt-4" : "mt-5"}`}>
        {project.stack.slice(0, compact ? 2 : 3).join(" · ")}
      </p>
    </Wrapper>
  );
}
