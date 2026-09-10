/**
 * 제품마다 그 제품의 구조를 그린 도형.
 *
 * 장식이 아니라 정보다 — 케이스 스터디에 적어둔 아키텍처를 그림으로 옮긴 것이고,
 * 강조색이 칠해진 부분이 그 제품에서 실제로 문제였던 지점이다.
 *
 * 셋이 한 벌로 읽히도록 규칙을 공유한다.
 * 100×100 화판, 선 굵기 2.5, 구조는 line-strong, 초점 하나만 accent.
 */

const SHARED = {
  viewBox: "0 0 100 100",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** 회사마다 봉인된 칸. 한 칸이 새면 끝나는 구조. */
function IsolationMark() {
  const cells = [
    { x: 8, y: 8, on: true },
    { x: 54, y: 8, on: false },
    { x: 8, y: 54, on: false },
    { x: 54, y: 54, on: false },
  ];

  return (
    <>
      {cells.map((c) => (
        <g key={`${c.x}-${c.y}`}>
          <rect
            x={c.x}
            y={c.y}
            width="38"
            height="38"
            rx="9"
            fill={c.on ? "var(--accent-soft)" : "var(--bg-sunken)"}
            stroke={c.on ? "var(--accent)" : "var(--line-strong)"}
            strokeWidth={SHARED.strokeWidth}
          />
          <circle
            cx={c.x + 19}
            cy={c.y + 19}
            r="4"
            fill={c.on ? "var(--accent)" : "var(--fg-faint)"}
            className={
              c.on
                ? "origin-center transition-transform duration-500 group-hover:scale-150"
                : undefined
            }
            style={c.on ? { transformBox: "fill-box" } : undefined}
          />
        </g>
      ))}
    </>
  );
}

/** 공통 뼈대 하나에서 갈라져 나온 고객사별 파생. */
function BranchMark() {
  const branches = [16, 38, 60, 82];

  return (
    <>
      <path
        d="M20 10V90"
        stroke="var(--line-strong)"
        strokeWidth="3.5"
        strokeLinecap={SHARED.strokeLinecap}
      />
      {branches.map((y, i) => {
        const on = i === 1;
        return (
          <g
            key={y}
            className="transition-transform duration-500 group-hover:translate-x-1"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <path
              d={`M20 ${y}H${on ? 76 : 66}`}
              stroke={on ? "var(--accent)" : "var(--line-strong)"}
              strokeWidth={SHARED.strokeWidth}
              strokeLinecap={SHARED.strokeLinecap}
            />
            <circle
              cx={on ? 82 : 72}
              cy={y}
              r="5"
              fill={on ? "var(--accent)" : "var(--bg-sunken)"}
              stroke={on ? "var(--accent)" : "var(--line-strong)"}
              strokeWidth={SHARED.strokeWidth}
            />
          </g>
        );
      })}
    </>
  );
}

/** 버전 단위로 쌓이는 도면. 맨 앞 한 장이 밖으로 나간 오프라인 데모. */
function LayerMark() {
  const sheets = [
    { x: 40, y: 12, on: false },
    { x: 28, y: 26, on: false },
    { x: 16, y: 40, on: true },
  ];

  return (
    <>
      {sheets.map((s, i) => (
        <rect
          key={s.x}
          x={s.x}
          y={s.y}
          width="44"
          height="48"
          rx="7"
          fill={s.on ? "var(--accent-soft)" : "var(--bg-sunken)"}
          stroke={s.on ? "var(--accent)" : "var(--line-strong)"}
          strokeWidth={SHARED.strokeWidth}
          className="transition-transform duration-500 group-hover:-translate-y-1"
          style={{ transitionDelay: `${(sheets.length - i) * 70}ms` }}
        />
      ))}
    </>
  );
}

/** 사람이 승인한 문서만 관문을 지나 답변의 근거가 된다. */
function GateMark() {
  const docs = [14, 41, 68];

  return (
    <>
      {docs.map((y, i) => {
        const on = i === 1;
        return (
          <rect
            key={y}
            x="6"
            y={y}
            width="28"
            height="18"
            rx="4"
            fill={on ? "var(--accent-soft)" : "var(--bg-sunken)"}
            stroke={on ? "var(--accent)" : "var(--line-strong)"}
            strokeWidth={SHARED.strokeWidth}
          />
        );
      })}

      {/* 관문. 승인되지 않은 것은 여기서 멈춘다. */}
      <path
        d="M52 8V92"
        stroke="var(--line-strong)"
        strokeWidth={SHARED.strokeWidth}
        strokeDasharray="6 6"
        strokeLinecap={SHARED.strokeLinecap}
      />

      <path
        d="M34 50H74"
        stroke="var(--accent)"
        strokeWidth={SHARED.strokeWidth}
        strokeLinecap={SHARED.strokeLinecap}
        className="transition-transform duration-500 group-hover:translate-x-1"
      />
      <circle
        cx="84"
        cy="50"
        r="9"
        fill="var(--accent-soft)"
        stroke="var(--accent)"
        strokeWidth={SHARED.strokeWidth}
      />
    </>
  );
}

/** 말한 것을 AI가 항목으로 나눠 적는다. */
function VoiceMark() {
  const bars = [
    [10, 16],
    [18, 30],
    [26, 44],
    [34, 26],
    [42, 12],
  ];
  const rows = [30, 46, 62];

  return (
    <>
      {bars.map(([x, h]) => (
        <path
          key={x}
          d={`M${x} ${50 - h / 2}V${50 + h / 2}`}
          stroke="var(--line-strong)"
          strokeWidth={SHARED.strokeWidth}
          strokeLinecap={SHARED.strokeLinecap}
        />
      ))}

      <path
        d="M54 50H64"
        stroke="var(--accent)"
        strokeWidth={SHARED.strokeWidth}
        strokeLinecap={SHARED.strokeLinecap}
        className="transition-transform duration-500 group-hover:translate-x-1"
      />

      {rows.map((y, i) => {
        const on = i === 0;
        return (
          <rect
            key={y}
            x="70"
            y={y}
            width="24"
            height="9"
            rx="3"
            fill={on ? "var(--accent-soft)" : "var(--bg-sunken)"}
            stroke={on ? "var(--accent)" : "var(--line-strong)"}
            strokeWidth={SHARED.strokeWidth}
          />
        );
      })}
    </>
  );
}

/** 도형이 없는 항목은 번호만 크게 세운다. */
function IndexMark({ index }: { index: number }) {
  return (
    <text
      x="50"
      y="50"
      textAnchor="middle"
      dominantBaseline="central"
      fill="var(--line)"
      fontSize="52"
      fontWeight="700"
    >
      {String(index + 1).padStart(2, "0")}
    </text>
  );
}

const MARKS: Record<string, () => React.ReactElement> = {
  donidora: IsolationMark,
  "focuswin-mes": BranchMark,
  "doc-saas": LayerMark,
  "ai-operator": GateMark,
  bizai: VoiceMark,
};

export function ProjectMark({
  slug,
  index,
  className = "",
}: {
  slug: string;
  index: number;
  className?: string;
}) {
  const Mark = MARKS[slug];

  return (
    <svg viewBox={SHARED.viewBox} className={className} aria-hidden>
      {Mark ? <Mark /> : <IndexMark index={index} />}
    </svg>
  );
}
