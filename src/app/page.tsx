import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { HeroStatement } from "@/components/hero-statement";
import { Identity } from "@/components/identity";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { ProjectRow } from "@/components/project-row";
import { ProjectCard } from "@/components/project-card";
import {
  workProjects,
  labProjects,
  profile,
  sectionCopy,
  skills,
} from "@/lib/data";

export default function Home() {
  return (
    <>
      <SiteNav />
      <HeroStatement />

      {/*
        왼쪽은 붙박이 신원, 오른쪽은 흐르는 작업.
        첫 화면에서 자기소개와 첫 제품이 같이 보인다 — 소개를 지나야 작업이 나오지 않는다.
      */}
      <main className="mx-auto max-w-6xl px-6 py-16 lg:grid lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-20 lg:py-20">
        <Identity />

        <div className="mt-24 lg:mt-0">
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
            <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
              {labProjects.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 2) * 0.06}>
                  <ProjectCard project={p} index={i} />
                </Reveal>
              ))}
            </div>
          </Section>

          <Section id="about" {...sectionCopy.about}>
            <Reveal>
              <div className="max-w-xl space-y-5">
                {profile.intro.map((line) => (
                  <p key={line} className="text-lg leading-relaxed text-fg">
                    {line}
                  </p>
                ))}
                {profile.bio.map((line) => (
                  <p key={line} className="text-base leading-relaxed text-fg-muted">
                    {line}
                  </p>
                ))}
                <p className="border-l-2 border-accent pl-5 text-base leading-relaxed text-fg">
                  이 사이트는 2023년에 만든 포트폴리오를 다시 지은 것입니다. 그때는 가로 스크롤을
                  강제했고 폴더를 두 번 눌러야 내용이 보였습니다. 컨셉은 남기고 그 습관만
                  버렸습니다.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-14 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                {skills.map((s) => (
                  <div key={s.group} className="border-t border-line pt-4">
                    <dt className="label mb-2 text-fg-faint">{s.group}</dt>
                    <dd className="text-sm leading-relaxed text-fg-muted">
                      {s.items.join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
