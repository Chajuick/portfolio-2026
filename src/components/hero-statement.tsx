import { Showreel } from "@/components/showreel";
import { profile, projects, workProjects, labProjects } from "@/lib/data";

/** 강조할 한 마디만 색을 바꿔 끼운다. 한 화면에 강조는 하나면 충분하다. */
function Tagline() {
  const [before, after] = profile.tagline.split(profile.taglineAccent);
  return (
    <>
      {before}
      <span className="text-accent">{profile.taglineAccent}</span>
      {after}
    </>
  );
}

/** 숫자는 세어서 만든다. 손으로 적어두면 프로젝트가 늘 때마다 틀린 값이 남는다. */
const counts = [
  { label: "실무 제품", value: String(workProjects.length) },
  { label: "고객사 시스템", value: "4곳" },
  { label: "개인 프로젝트", value: String(labProjects.length) },
  { label: "공개 저장소·사이트", value: String(projects.filter((p) => p.links?.length).length) },
];

/** 화면이 있는 제품만, 실무부터 차례로 무대에 올린다. */
const slides = projects
  .filter((p) => p.shots?.[0]?.device === "desktop")
  .sort((a, b) => Number(b.kind === "work") - Number(a.kind === "work"))
  .slice(0, 8)
  .map((p) => ({
    src: p.shots![0].src,
    alt: p.shots![0].alt,
    title: p.title,
    subtitle: p.subtitle,
    href: p.problem || p.decisions?.length ? `/work/${p.slug}` : undefined,
  }));

/**
 * 첫 화면.
 * 이름이 아니라 주장을 가장 크게 두고, 그 옆에서 실제 제품 화면이 넘어간다.
 * 무대는 테마와 무관하게 어둡다 — 제품 화면은 어두운 바닥 위에서 가장 잘 보인다.
 */
export function HeroStatement() {
  return (
    <section className="stage stage-glow relative overflow-hidden bg-bg text-fg">
      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-16 sm:pt-24 sm:pb-20">
        <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
          <div>
            <p
              className="enter label text-fg-muted"
              style={{ "--enter-delay": "0s" } as React.CSSProperties}
            >
              {profile.role}
            </p>

            <h1
              className="enter display mt-6 text-[clamp(2.25rem,4.4vw,3.5rem)]"
              style={{ "--enter-delay": "0.08s" } as React.CSSProperties}
            >
              <Tagline />
            </h1>

            <p
              className="enter mt-7 max-w-md text-base leading-relaxed text-fg-muted"
              style={{ "--enter-delay": "0.16s" } as React.CSSProperties}
            >
              제조·회계 도메인의 B2B SaaS를 만듭니다. 고객사 네 곳의 시스템과 회계 제품 한 곳이
              제가 짠 화면 위에서 돌아갑니다.
            </p>
          </div>

          <div className="enter" style={{ "--enter-delay": "0.24s" } as React.CSSProperties}>
            <Showreel slides={slides} />
          </div>
        </div>

        <dl
          className="enter mt-16 grid grid-cols-2 gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-4"
          style={{ "--enter-delay": "0.34s" } as React.CSSProperties}
        >
          {counts.map((c) => (
            <div key={c.label} className="bg-bg px-1 py-5 sm:px-0">
              <dd className="display text-[clamp(1.5rem,3vw,2.25rem)] text-fg">{c.value}</dd>
              <dt className="label mt-2 text-fg-faint">{c.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
