import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/data";

/** 케이스 스터디가 있는 것만 상세를 만든다. */
const studies = projects.filter((p) => p.problem || p.decisions?.length);

export function generateStaticParams() {
  return studies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function WorkDetail({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = studies.findIndex((p) => p.slug === slug);
  const project = studies[index];
  if (!project) notFound();

  const next = studies[(index + 1) % studies.length];

  return (
    <>
      <SiteNav />

      <main className="mx-auto max-w-3xl px-6 pt-10 pb-24">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 text-xs text-fg-muted transition-colors hover:text-accent"
        >
          <ArrowLeft
            aria-hidden
            className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1"
          />
          목록으로
        </Link>

        <header className="enter mt-10 border-b border-line pb-12">
          <p className="label text-accent">{project.year}</p>
          <h1 className="display mt-5 text-[clamp(2.5rem,8vw,4.5rem)]">{project.title}</h1>
          <p className="mt-5 text-lg text-fg-muted">{project.subtitle}</p>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="label mb-2 text-fg-faint">맡은 일</dt>
              <dd className="text-sm leading-relaxed text-fg">{project.role}</dd>
            </div>
            <div>
              <dt className="label mb-2 text-fg-faint">기술</dt>
              <dd className="text-sm leading-relaxed text-fg-muted">
                {project.stack.join(" · ")}
              </dd>
            </div>
          </dl>

          {project.metrics && (
            <ul className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <li key={m.label}>
                  <p className="display text-[clamp(1.75rem,4vw,2.5rem)] text-fg">{m.value}</p>
                  <p className="label mt-3 text-fg-faint">{m.label}</p>
                </li>
              ))}
            </ul>
          )}
        </header>

        <article className="mt-14 space-y-16">
          <Reveal>
            <p className="text-xl leading-relaxed text-fg text-balance">{project.summary}</p>
          </Reveal>

          {project.problem && (
            <Reveal as="section">
              <h2 className="label mb-5 text-accent">문제</h2>
              <p className="text-base leading-relaxed text-fg-muted">{project.problem}</p>
            </Reveal>
          )}

          {project.decisions?.length ? (
            <section>
              <Reveal>
                <h2 className="label mb-8 text-accent">판단</h2>
              </Reveal>
              <ol className="space-y-10">
                {project.decisions.map((d, i) => (
                  <Reveal key={d.title} as="li" delay={i * 0.06}>
                    <div className="group border-t border-line pt-6 transition-colors duration-500 hover:border-line-strong">
                      <span className="label-en text-fg-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-4 text-lg font-bold tracking-tight text-fg">{d.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-fg-muted">{d.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {project.outcome && (
            <Reveal as="section">
              <h2 className="label mb-5 text-accent">결과</h2>
              <p className="text-base leading-relaxed text-fg-muted">{project.outcome}</p>
            </Reveal>
          )}

          <Reveal>
            <div className="border-t border-line pt-6">
              {project.private ? (
                <p className="flex items-start gap-2.5 text-sm text-fg-muted">
                  <Lock aria-hidden className="mt-0.5 size-4 shrink-0" />
                  {project.private}
                </p>
              ) : project.links?.length ? (
                <ul className="flex flex-wrap gap-3">
                  {project.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-fg transition-colors duration-300 hover:border-line-strong hover:text-accent"
                      >
                        {l.label}
                        <ArrowUpRight
                          aria-hidden
                          className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                        <span className="sr-only">(새 탭에서 열림)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Reveal>
        </article>

        {next.slug !== project.slug && (
          <Link
            href={`/work/${next.slug}`}
            className="group mt-20 flex items-end justify-between gap-6 border-t border-line pt-8"
          >
            <div>
              <p className="label text-fg-faint">다음</p>
              <p className="display mt-3 text-2xl transition-transform duration-500 group-hover:translate-x-1 sm:text-3xl">
                {next.title}
              </p>
            </div>
            <ArrowRight
              aria-hidden
              className="mb-2 size-5 shrink-0 text-fg-faint transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent"
            />
          </Link>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
