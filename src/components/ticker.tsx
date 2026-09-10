const ITEMS = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind",
  "Motion",
  "Multi-tenant",
  "MES",
  "Accounting SaaS",
  "Design System",
  "three.js",
];

/**
 * 히어로와 본문 사이를 끊어주는 띠.
 * JS 없이 CSS만으로 흐르고, 같은 목록을 두 벌 이어 붙여 이음매를 없앴다.
 */
export function Ticker() {
  return (
    <div className="group relative overflow-hidden border-t border-line py-4">
      <div className="ticker flex w-max group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-12 pr-12">
            {ITEMS.map((item) => (
              <li key={item} className="label-en flex items-center gap-12 text-fg-faint">
                {item}
                <span aria-hidden className="size-1 rounded-full bg-accent" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
