import { Reveal } from "@/components/reveal";

/** 본문 열 안의 한 장. 라벨은 제목 위에 얹는다. */
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
    <section
      id={id}
      className="scroll-mt-24 border-t border-line pt-16 pb-20 first:border-t-0 first:pt-0"
    >
      <Reveal>
        <div className="mb-12 max-w-xl">
          <p className="label-en mb-5 text-accent">{label}</p>
          <h2 className="display text-[clamp(1.75rem,3.2vw,2.5rem)]">{title}</h2>
          {lead && <p className="mt-4 text-base leading-relaxed text-fg-muted">{lead}</p>}
        </div>
      </Reveal>
      {children}
    </section>
  );
}
