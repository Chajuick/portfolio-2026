import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/lib/data";

/** 케이스 스터디가 있는 프로젝트만 상세로 넘어간다. */
function hasStudy(p: Project) {
  return Boolean(p.problem || p.decisions?.length);
}

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  const detail = hasStudy(project);
  const Wrapper = detail ? Link : "div";
  const wrapperProps = detail ? { href: `/work/${project.slug}` } : {};

  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className={`group relative flex h-full flex-col rounded-2xl border border-line bg-bg-raised p-6 transition-all duration-300 ${
        detail ? "hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow)]" : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          {typeof index === "number" && (
            <span className="font-mono text-xs text-fg-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <h3 className="text-lg font-bold tracking-tight text-fg">{project.title}</h3>
        </div>
        {detail && (
          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 text-fg-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          />
        )}
      </div>

      <p className="mb-1 text-sm font-medium text-accent">{project.subtitle}</p>
      <p className="mb-5 grow text-sm leading-relaxed text-fg-muted">{project.summary}</p>

      <div className="mt-auto space-y-3">
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <li
              key={s}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-fg-muted"
            >
              {s}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-line pt-3 font-mono text-[11px] text-fg-faint">
          <span>{project.year}</span>
          {project.private ? (
            <span className="flex items-center gap-1">
              <Lock aria-hidden className="size-3" />
              비공개
            </span>
          ) : project.links?.length ? (
            <span>{project.links[0].label}</span>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
}
