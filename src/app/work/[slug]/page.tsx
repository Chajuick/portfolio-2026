import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/data";

export function generateStaticParams() {
  return projects
    .filter((p) => p.problem || p.decisions?.length)
    .map((p) => ({ slug: p.slug }));
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
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 pt-12 pb-24">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs text-fg-muted transition-colors hover:text-accent"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          목록으로
        </Link>

        <header className="mt-8 border-b border-line pb-10">
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
            {project.year}
          </p>
          <h1 className="display text-5xl sm:text-6xl">{project.title}</h1>
          <p className="mt-4 text-lg text-fg-muted">{project.subtitle}</p>

          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="mb-1.5 font-mono text-[11px] tracking-[0.15em] text-fg-faint uppercase">
                맡은 일
              </dt>
              <dd className="text-sm text-fg">{project.role}</dd>
            </div>
            <div>
              <dt className="mb-1.5 font-mono text-[11px] tracking-[0.15em] text-fg-faint uppercase">
                기술
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-fg-muted"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          {project.metrics && (
            <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {project.metrics.map((m) => (
                <li key={m.label} className="bg-bg-raised px-5 py-4">
                  <p className="display text-2xl text-fg">{m.value}</p>
                  <p className="mt-1 font-mono text-[11px] text-fg-faint">{m.label}</p>
                </li>
              ))}
            </ul>
          )}
        </header>

        <article className="mt-12 space-y-14">
          <Reveal>
            <p className="text-xl leading-relaxed text-fg">{project.summary}</p>
          </Reveal>

          {project.problem && (
            <Reveal>
              <section>
                <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
                  문제
                </h2>
                <p className="text-base leading-relaxed text-fg-muted">{project.problem}</p>
              </section>
            </Reveal>
          )}

          {project.decisions?.length ? (
            <section>
              <Reveal>
                <h2 className="mb-6 font-mono text-xs tracking-[0.2em] text-accent uppercase">
                  판단
                </h2>
              </Reveal>
              <ol className="space-y-8">
                {project.decisions.map((d, i) => (
                  <Reveal key={d.title} delay={i * 0.06}>
                    <li className="border-l-2 border-line pl-6 transition-colors hover:border-accent">
                      <h3 className="mb-2.5 text-lg font-bold tracking-tight text-fg">
                        <span className="mr-2 font-mono text-sm text-fg-faint">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {d.title}
                      </h3>
                      <p className="text-base leading-relaxed text-fg-muted">{d.body}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </section>
          ) : null}

          {project.outcome && (
            <Reveal>
              <section>
                <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
                  결과
                </h2>
                <p className="text-base leading-relaxed text-fg-muted">{project.outcome}</p>
              </section>
            </Reveal>
          )}

          <Reveal>
            <footer className="rounded-2xl border border-line bg-bg-raised p-6">
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-fg transition-colors hover:border-line-strong hover:text-accent"
                      >
                        {l.label}
                        <ArrowUpRight aria-hidden className="size-3.5" />
                        <span className="sr-only">(새 탭에서 열림)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </footer>
          </Reveal>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
