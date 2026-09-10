import { profile, projects, workProjects, labProjects, craftProjects } from "@/lib/data";

/** 강조할 한 마디만 색을 바꿔 끼운다. */
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
  { label: "개인 프로젝트", value: String(labProjects.length + craftProjects.length) },
  {
    label: "공개 저장소·사이트",
    value: String(projects.filter((p) => p.links?.length).length),
  },
];

/**
 * 첫 화면의 주장.
 * 이름이 아니라 무엇을 하는 사람인지를 가장 크게 둔다 — 이름은 아래 레일이 진다.
 */
export function HeroStatement() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <p className="enter label text-fg-muted" style={{ "--enter-delay": "0s" } as React.CSSProperties}>
          {profile.role}
        </p>

        <h1
          className="enter display mt-6 max-w-4xl text-[clamp(2.25rem,6.2vw,4.75rem)]"
          style={{ "--enter-delay": "0.08s" } as React.CSSProperties}
        >
          <Tagline />
        </h1>

        <dl
          className="enter mt-14 grid grid-cols-2 gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-4"
          style={{ "--enter-delay": "0.18s" } as React.CSSProperties}
        >
          {counts.map((c) => (
            <div key={c.label} className="bg-bg px-1 py-5 sm:px-0">
              <dd className="display-en text-[clamp(1.75rem,3.5vw,2.5rem)] text-fg">{c.value}</dd>
              <dt className="label mt-2 text-fg-faint">{c.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
