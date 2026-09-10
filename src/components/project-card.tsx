import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ProjectMark } from "@/components/project-mark";
import type { Project } from "@/lib/data";

/**
 * 개인 프로젝트 항목.
 * 화면이 있으면 화면을 먼저 보여주고, 없으면 헤어라인 한 줄로만 시작한다.
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
  const cover = project.shots?.[0];

  return (
    <Wrapper
      {...({ href: detail ? `/work/${project.slug}` : undefined } as { href: string })}
      className="group flex h-full flex-col"
    >
      {/* 화면이 있든 없든 같은 크기의 판을 둔다. 하나만 비면 그리드가 어긋난다. */}
      <div className="relative aspect-16/10 overflow-hidden rounded-lg border border-line bg-bg-sunken transition-colors duration-500 group-hover:border-line-strong">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 640px) 360px, 100vw"
            className={`transition-transform duration-700 group-hover:scale-[1.03] ${
              cover.device === "mobile" ? "object-contain p-3" : "object-cover object-top"
            }`}
          />
        ) : (
          <ProjectMark
            slug={project.slug}
            index={index ?? 0}
            className="absolute inset-0 m-auto size-1/2 opacity-70"
          />
        )}
      </div>

      <div className="mt-5">
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

        <h3 className="mt-3 text-lg font-bold tracking-tight text-fg transition-transform duration-500 group-hover:translate-x-0.5">
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm font-medium text-accent">{project.subtitle}</p>

        {!compact && (
          <p className="mt-3.5 text-sm leading-relaxed text-fg-muted">{project.summary}</p>
        )}

        <p className="mt-4 text-[11px] text-fg-faint">
          {project.stack.slice(0, compact ? 2 : 3).join(" · ")}
        </p>
      </div>
    </Wrapper>
  );
}
