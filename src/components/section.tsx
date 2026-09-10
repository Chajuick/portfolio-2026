import { Reveal } from "@/components/reveal";

/**
 * 섹션 머리글.
 * 라벨은 왼쪽 열에 고정해두고 내용만 흐르게 한다 — 지금 어느 장을 보고 있는지 계속 보인다.
 */
export function Section({
  id,
  label,
  title,
  lead,
  children,
}: {
  id: string;
  label: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:grid lg:grid-cols-[8rem_1fr] lg:gap-14">
        <p className="label-en mb-8 text-accent lg:sticky lg:top-24 lg:mb-0 lg:self-start">
          {label}
        </p>

        <div>
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <h2 className="display text-[clamp(2rem,5vw,3.25rem)]">{title}</h2>
              {lead && <p className="mt-5 text-base leading-relaxed text-fg-muted">{lead}</p>}
            </div>
          </Reveal>
          {children}
        </div>
      </div>
    </section>
  );
}
