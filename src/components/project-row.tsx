import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Lock } from "lucide-react";
import { ProjectMark } from "@/components/project-mark";
import type { Project } from "@/lib/data";

/**
 * 실무 항목.
 * 제목 아래에 실제 화면을 크게 깔았다. 글로 "만들었습니다"라고 쓰는 것보다
 * 만든 것을 보여주는 편이 빠르다. 구조 설명은 상세 페이지의 도형이 맡는다.
 */
export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const detail = Boolean(project.problem || project.decisions?.length);
  const Wrapper = detail ? Link : "div";
  const cover = project.shots?.[0];

  return (
    <Wrapper
      {...({ href: detail ? `/work/${project.slug}` : undefined } as { href: string })}
      className={`group relative block py-12 ${index === 0 ? "" : "border-t border-line"}`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <span className="label-en text-fg-faint transition-colors duration-500 group-hover:text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="display text-[clamp(1.5rem,3vw,2.125rem)] transition-transform duration-500 group-hover:translate-x-1">
              {project.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-accent">{project.subtitle}</p>
          </div>
        </div>
        {detail && (
          <ArrowUpRight
            aria-hidden
            className="mt-1.5 size-5 shrink-0 text-fg-faint transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
          />
        )}
      </div>

      {/*
        화면이 있으면 16:10로 크게, 없으면 낮은 띠에 구조 도형을 둔다.
        빈 판을 화면과 같은 크기로 두면 구멍처럼 보인다.
      */}
      <div
        className={`relative mt-7 grid place-items-center overflow-hidden rounded-xl border border-line bg-bg-raised ${
          cover ? "aspect-16/10" : "aspect-14/5"
        }`}
      >
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <>
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(120%_100%_at_80%_10%,var(--accent-soft),transparent_65%)]"
            />
            {/* 화면 대신 구조를 보여준다. 강조된 부분이 실제로 문제였던 지점이다. */}
            <ProjectMark
              slug={project.slug}
              index={index}
              className="relative h-3/5 w-auto transition-transform duration-700 group-hover:scale-105"
            />
          </>
        )}
      </div>

      <p className="mt-7 text-sm leading-relaxed text-fg-muted">{project.summary}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.map((t) => (
            <li
              key={t}
              className="rounded-full border border-line px-2.5 py-1 text-[11px] text-fg-muted"
            >
              {t}
            </li>
          ))}
        </ul>
        <span className="label ml-auto flex items-center gap-2 text-fg-faint">
          {project.private && <Lock aria-hidden className="size-3" />}
          {project.year}
        </span>
      </div>
    </Wrapper>
  );
}
