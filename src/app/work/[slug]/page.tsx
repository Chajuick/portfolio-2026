import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, Lock } from "lucide-react";
import { TopRow } from "@/components/home/top-row";
import { V2Footer } from "@/components/v2/footer";
import { Reveal } from "@/components/reveal";
import { DeviceFrame } from "@/components/device-frame";
import { ProjectMark } from "@/components/project-mark";
import { projects, worldOf } from "@/lib/data";

/** 케이스 스터디가 있는 것만 상세를 만든다. */
const studies = projects.filter((p) => p.problem || p.decisions?.length);

const pad = (n: number) => String(n).padStart(2, "0");

export function generateStaticParams() {
  return studies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

/** 본문의 한 장. 왼쪽에 작은 이름표, 오른쪽에 내용 — 메인의 목차와 같은 격자다. */
function Chapter({ label, ko, children }: { label: string; ko: string; children: React.ReactNode }) {
  return (
    <Reveal as="section">
      <div className="grid gap-x-10 gap-y-5 border-t border-line py-12 lg:grid-cols-12">
        <h2 className="v2-mono text-[11px] text-fg-faint uppercase lg:col-span-3">
          {label} <span className="v2-sans ml-1 text-[12px]">{ko}</span>
        </h2>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </Reveal>
  );
}

/**
 * 작업 상세. 문제 → 판단 → 결과 순서로 읽힌다.
 * 메인과 같은 규칙을 쓴다: 가는 세리프 제목, 모노 이름표, 강조색 하나.
 */
export default async function WorkDetail({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = studies.findIndex((p) => p.slug === slug);
  const project = studies[index];
  if (!project) notFound();

  const world = worldOf(project.slug);
  const number = projects.findIndex((p) => p.slug === project.slug) + 1;
  const next = studies[(index + 1) % studies.length];
  const shots = project.shots ?? [];
  const desktopShots = shots.filter((s) => s.device === "desktop");
  const mobileShots = shots.filter((s) => s.device === "mobile");

  return (
    <div className="v2">
      <TopRow />

      <main className="px-6 pt-14 pb-10 sm:px-10">
        <Link
          href="/#work"
          transitionTypes={["nav-back"]}
          className="v2-mono group inline-flex items-center gap-2 text-[11px] text-fg-muted uppercase transition-colors hover:text-fg"
        >
          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          <span className="v2-sans text-[12px]">목록으로</span>
        </Link>

        {/*
          머리. 넘어오는 장이 다 걷힐 즈음 차례로 들어선다 — 번호, 제목(마스크 아래에서), 부제와 정보.
          메인 히어로와 같은 v2-line을 써서, 사이트 어디서나 제목이 같은 방식으로 등장한다.
        */}
        <header className="mt-12 grid gap-x-10 gap-y-10 border-b border-fg pb-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="v2-fade v2-mono text-[11px] text-fg-muted uppercase">
              No.{pad(number)} · <span className="v2-sans text-[12px]">{world.name}</span> ·{" "}
              <span className="v2-sans text-[12px]">{project.kind === "work" ? "실무" : "개인"}</span>
            </p>
            <h1 className="v2-serif mt-6 text-[clamp(2.75rem,7vw,6.5rem)] leading-[1] font-extralight tracking-[-0.05em]">
              <span className="v2-line block overflow-hidden pb-[0.08em]">
                <span className="block" style={{ "--i": 3 } as React.CSSProperties}>
                  {project.title}
                </span>
              </span>
            </h1>
            <p className="v2-fade mt-6 max-w-[40ch] text-lg leading-relaxed text-fg-muted">{project.subtitle}</p>
          </div>

          <dl className="v2-fade grid content-end gap-6 text-[13px] lg:col-span-4">
            <div>
              <dt className="text-[12px] text-fg-faint">맡은 일</dt>
              <dd className="mt-1.5 leading-relaxed text-fg">{project.role}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-fg-faint">기간</dt>
              <dd className="mt-1.5 text-fg">{project.year}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-fg-faint">기술</dt>
              <dd className="mt-1.5 leading-relaxed text-fg-muted">{project.stack.join(" · ")}</dd>
            </div>
          </dl>
        </header>

        {/* 숫자 */}
        {project.metrics && (
          <ul className="grid gap-8 border-b border-line py-10 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <li key={m.label}>
                <p className="v2-serif text-[clamp(2rem,4vw,3rem)] leading-none font-light tracking-[-0.04em]">
                  {m.value}
                </p>
                <p className="mt-3 text-[13px] text-fg-muted">{m.label}</p>
              </li>
            ))}
          </ul>
        )}

        {/* 요약 */}
        <Reveal>
          <p className="v2-serif max-w-[34ch] py-16 text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.35] font-light tracking-[-0.03em] text-balance">
            {project.summary}
          </p>
        </Reveal>

        {/* 화면. 본문 폭보다 넓게 제 크기로 보인다. */}
        {shots.length > 0 && (
          <Reveal as="section">
            <div className="mx-auto max-w-5xl space-y-8 pb-16">
              {desktopShots.map((shot) => (
                <DeviceFrame key={shot.src} shot={shot} />
              ))}
              {mobileShots.length > 0 && (
                <div className="flex flex-wrap gap-5">
                  {mobileShots.map((shot) => (
                    <DeviceFrame key={shot.src} shot={shot} />
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        )}

        {project.problem && (
          <Chapter label="Problem" ko="문제">
            <p className="max-w-[60ch] text-[17px] leading-relaxed text-fg">{project.problem}</p>
          </Chapter>
        )}

        {project.decisions?.length ? (
          <Chapter label="Decisions" ko="판단">
            <div className="mb-8 flex justify-end">
              {/* 이 제품의 구조. 강조된 부분이 실제로 문제였던 지점이다. */}
              <ProjectMark slug={project.slug} index={index} className="w-16" />
            </div>
            <ol className="space-y-10">
              {project.decisions.map((d, i) => (
                <li key={d.title} className="grid gap-3 sm:grid-cols-[3rem_1fr]">
                  <span className="v2-mono pt-1 text-[11px] text-fg-faint">{pad(i + 1)}</span>
                  <div>
                    <h3 className="v2-serif text-[clamp(1.35rem,2.2vw,1.75rem)] leading-snug font-normal tracking-[-0.03em]">
                      {d.title}
                    </h3>
                    <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-fg-muted">{d.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Chapter>
        ) : null}

        {project.outcome && (
          <Chapter label="Outcome" ko="결과">
            <p className="max-w-[60ch] text-[17px] leading-relaxed text-fg">{project.outcome}</p>
          </Chapter>
        )}

        <Chapter label="Links" ko="링크">
          {project.private ? (
            <p className="flex items-start gap-2.5 text-sm text-fg-muted">
              <Lock aria-hidden className="mt-0.5 size-4 shrink-0" />
              {project.private}
            </p>
          ) : project.links?.length ? (
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {project.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="v2-serif group inline-flex items-baseline gap-2 text-2xl font-light tracking-[-0.03em] text-fg"
                  >
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-bottom-left bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                      {l.label}
                    </span>
                    <ArrowUpRight aria-hidden className="size-4 text-accent" />
                    <span className="sr-only">(새 탭에서 열림)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Chapter>

        {/* 다음 작업 */}
        {next.slug !== project.slug && (
          <Link
            href={`/work/${next.slug}`}
            transitionTypes={["nav-forward"]}
            className="group mt-6 flex items-end justify-between gap-6 border-t border-fg pt-8 pb-10"
          >
            <div>
              <p className="v2-mono text-[11px] text-fg-faint uppercase">Next</p>
              <p className="v2-serif mt-3 text-[clamp(2rem,5vw,4rem)] leading-none font-extralight tracking-[-0.045em] transition-transform duration-500 group-hover:translate-x-2">
                {next.title}
              </p>
            </div>
            <span
              aria-hidden
              className="mb-2 text-2xl text-fg-faint transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent"
            >
              →
            </span>
          </Link>
        )}
      </main>

      <V2Footer />
    </div>
  );
}
