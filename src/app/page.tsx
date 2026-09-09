import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/project-card";
import { workProjects, labProjects, craftProjects, profile, skills } from "@/lib/data";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />

        <Section
          id="work"
          label="Work"
          title="실무에서 만든 것"
          lead="B2B 제조·회계·문서관리 SaaS의 프론트엔드를 맡고 있습니다. 고객사 정보와 인프라 정보는 뺐고, 무엇을 왜 그렇게 만들었는지만 적었습니다."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {workProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.07}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </div>
        </Section>

        <Section
          id="lab"
          label="Lab"
          title="만들고 싶어서 만든 것"
          lead="대부분 제가 실제로 쓰려고 만들었습니다. 그래서 기능보다 '이걸 왜 아무도 이렇게 안 만들었지'에서 출발한 것이 많습니다."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {labProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </div>
        </Section>

        <Section
          id="craft"
          label="Craft"
          title="그냥 재밌어서 만든 것"
          lead="쓸모를 따지지 않고 만든 것들입니다."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {craftProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="about" label="About" title="소개">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <Reveal>
              <div className="space-y-5 text-base leading-relaxed text-fg-muted">
                {profile.bio.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <p className="border-l-2 border-accent pl-5 text-fg">
                  이 사이트는 2023년에 만든 포트폴리오를 다시 지은 것입니다. 그때는 가로 스크롤을
                  강제하고 폴더 아이콘을 두 번 눌러야 내용이 보였습니다. 보여주고 싶은 게 아니라
                  숨겨둔 셈이었죠. 컨셉은 살리고 그 습관만 버렸습니다.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="space-y-6">
                {skills.map((s) => (
                  <div key={s.group}>
                    <dt className="mb-2.5 font-mono text-xs tracking-[0.15em] text-fg-faint uppercase">
                      {s.group}
                    </dt>
                    <dd>
                      <ul className="flex flex-wrap gap-1.5">
                        {s.items.map((i) => (
                          <li
                            key={i}
                            className="rounded-full border border-line px-3 py-1 text-sm text-fg-muted"
                          >
                            {i}
                          </li>
                        ))}
                      </ul>
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
