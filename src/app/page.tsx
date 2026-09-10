import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { Ticker } from "@/components/ticker";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { ProjectRow } from "@/components/project-row";
import { ProjectCard } from "@/components/project-card";
import {
  workProjects,
  labProjects,
  craftProjects,
  profile,
  sectionCopy,
  skills,
} from "@/lib/data";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Ticker />

        <Section id="work" {...sectionCopy.work}>
          <div>
            {workProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <ProjectRow project={p} index={i} />
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="lab" {...sectionCopy.lab}>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {labProjects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="craft" {...sectionCopy.craft}>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {craftProjects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                <ProjectCard project={p} index={i} compact />
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="about" {...sectionCopy.about}>
          <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
            <Reveal>
              <div className="space-y-5 text-base leading-relaxed text-fg-muted">
                {profile.bio.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <p className="border-l-2 border-accent pl-5 text-fg">
                  이 사이트는 2023년에 만든 포트폴리오를 다시 지은 것입니다. 그때는 가로 스크롤을
                  강제했고 폴더를 두 번 눌러야 내용이 보였습니다. 컨셉은 남기고 그 습관만
                  버렸습니다.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="space-y-7">
                {skills.map((s) => (
                  <div key={s.group} className="border-t border-line pt-4">
                    <dt className="label mb-3 text-fg-faint">{s.group}</dt>
                    <dd className="text-sm leading-relaxed text-fg-muted">
                      {s.items.join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
