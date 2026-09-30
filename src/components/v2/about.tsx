import { Reveal } from "@/components/reveal";
import { profile, skills } from "@/lib/data";

/**
 * 소개는 여기서 한 번만 한다.
 * 작업 목록과 같은 12칸을 쓴다 — 왼쪽 4칸은 이름표, 오른쪽 8칸은 내용. 큰 문장만 전폭으로 연다.
 */
export function V2About() {
  const { lines, accent } = profile.belief;

  return (
    <section id="about" className="scroll-mt-20 px-6 pt-32 pb-24 sm:px-10">
      <p className="v2-mono text-[11px] text-fg-faint uppercase">About</p>

      <Reveal>
        <p className="v2-serif mt-8 text-[clamp(2rem,5.2vw,5rem)] leading-[1.15] font-extralight tracking-[-0.04em] text-fg">
          {lines.map((line) => {
            const [before, after] = line.split(accent);
            return (
              <span key={line} className="block">
                {after === undefined ? (
                  line
                ) : (
                  <>
                    {before}
                    <span className="text-accent">{accent}</span>
                    {after}
                  </>
                )}
              </span>
            );
          })}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <ol className="mt-24 border-t border-line">
          {profile.principles.map((p, i) => (
            <li key={p.title} className="grid gap-x-10 gap-y-4 border-b border-line py-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="v2-mono text-[11px] text-fg-faint">{String(i + 1).padStart(2, "0")}</p>
                {/* 쉼표 앞은 흐리게, 뒤의 핵심어만 밝게. 색을 더하지 않고 먼저 읽힐 말을 고른다. */}
                <h3 className="v2-serif mt-2 text-[clamp(1.5rem,2.2vw,2rem)] leading-tight font-light tracking-[-0.03em] text-fg-faint">
                  {p.title.split(", ")[0]},{" "}
                  <span className="text-fg">{p.title.split(", ")[1]}</span>
                </h3>
              </div>
              <p className="max-w-[60ch] text-[15px] leading-relaxed text-balance text-fg-muted lg:col-span-8 lg:pt-7">
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="grid gap-x-10 gap-y-6 border-b border-line py-10 lg:grid-cols-12">
          <p className="v2-mono text-[11px] text-fg-faint uppercase lg:col-span-4">Stack</p>
          <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4 lg:col-span-8">
            {skills.map((s) => (
              <div key={s.group}>
                <dt className="v2-mono text-[11px] text-fg-faint">{s.group}</dt>
                <dd className="mt-2 text-[13px] leading-relaxed text-fg">
                  {s.items.map((item) => (
                    <span key={item} className="block">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer noopener"
        className="v2-serif group mt-24 inline-flex items-baseline gap-3 text-[clamp(2rem,5vw,4rem)] leading-none font-light tracking-[-0.04em] text-fg"
      >
        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-bottom-left bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px]">
          github.com/Chajuick
        </span>
        <span aria-hidden className="text-accent transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
          ↗
        </span>
      </a>
    </section>
  );
}
