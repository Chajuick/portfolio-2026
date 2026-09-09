import { Reveal } from "@/components/reveal";

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
    <section id={id} className="scroll-mt-20 border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
              {label}
            </p>
            <h2 className="display text-4xl sm:text-5xl">{title}</h2>
            {lead && <p className="mt-5 text-base leading-relaxed text-fg-muted">{lead}</p>}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
