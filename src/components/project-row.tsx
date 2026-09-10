import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { ProjectMark } from "@/components/project-mark";
import type { Project } from "@/lib/data";

/**
 * 실무 항목. 카드 대신 한 행으로 편다.
 * 왼쪽에는 그 제품의 구조를 그린 도형을 세운다 —
 * 세 제품이 글자만으로는 서로 구분되지 않아서 형태로 구분되게 했다.
 */
export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const detail = Boolean(project.problem || project.decisions?.length);
  const Wrapper = detail ? Link : "div";

  return (
    <Wrapper
      {...({ href: detail ? `/work/${project.slug}` : undefined } as { href: string })}
      className={`group relative block py-10 ${index === 0 ? "" : "border-t border-line"}`}
    >
      {/* 호버 배경. 본문 여백 밖까지 번지게 해서 행 전체가 반응하는 것처럼 보이게 한다. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-5 -inset-y-1 -z-10 rounded-xl bg-bg-raised opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="grid gap-6 sm:grid-cols-[7rem_1fr] sm:gap-9">
        <div>
          <span className="label-en text-fg-faint transition-colors duration-500 group-hover:text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <ProjectMark slug={project.slug} index={index} className="mt-4 w-full max-w-28" />
        </div>

        <div>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 className="display text-[clamp(1.5rem,3.5vw,2.25rem)] transition-transform duration-500 group-hover:translate-x-1">
                {project.title}
              </h3>
              <p className="mt-2.5 text-sm font-medium text-accent">{project.subtitle}</p>
            </div>
            {detail && (
              <ArrowUpRight
                aria-hidden
                className="mt-1 size-5 shrink-0 text-fg-faint transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
              />
            )}
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted">{project.summary}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ul className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line px-2.5 py-1 text-[11px] text-fg-muted"
                >
                  {s}
                </li>
              ))}
            </ul>
            <span className="label ml-auto flex items-center gap-2 text-fg-faint">
              {project.private && <Lock aria-hidden className="size-3" />}
              {project.year}
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
