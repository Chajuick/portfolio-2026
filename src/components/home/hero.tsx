import { MonitorStage } from "@/components/home/monitor-stage";

/** 한 줄씩 가림막 아래에서 올라온다. i는 몇 번째 줄인지. */
function Line({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <span className="v2-line block overflow-hidden pb-[0.08em]">
      <span className="block" style={{ "--i": i } as React.CSSProperties}>
        {children}
      </span>
    </span>
  );
}

/**
 * 첫 화면. 문장 하나와 모니터 하나.
 * 모니터에는 지금까지 만든 것들이 켜진다 — '화면을 만든다'는 말을 기기가 직접 보여준다.
 */
export function HomeHero({ count }: { count: number }) {
  return (
    <section className="flex min-h-[calc(100svh-4.5rem)] flex-col justify-between px-6 pb-8 sm:px-10">
      <div className="my-10 grid flex-1 items-center gap-6 lg:grid-cols-12">
        <h1 className="v2-serif order-2 text-[clamp(2.75rem,7vw,7.5rem)] leading-[1.02] font-extralight tracking-[-0.05em] text-fg lg:order-1 lg:col-span-7 xl:col-span-6">
          <Line i={0}>일상과 업무에</Line>
          <Line i={1}>
            <span className="text-accent">녹아드는</span> 화면을
          </Line>
          <Line i={2}>만듭니다.</Line>
        </h1>

        <MonitorStage className="v2-fade order-1 mx-auto w-[min(24rem,82vw)] lg:order-2 lg:col-span-5 lg:w-full lg:max-w-[34rem] xl:col-span-6 xl:max-w-[min(52rem,calc(100svh-20rem))]" />
      </div>

      <div className="v2-fade grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
        {/* 줄마다 철학 하나. 1-1 누가 써도 같게 · 1-3 사용자 곁에서 · 1-2 어제보다 나은 오늘. 넷째 줄은 누가 말하는지. */}
        <p className="text-[15px] leading-relaxed text-fg-muted">
          누가 써도 헤매지 않도록,
          <br />
          사용자 곁에서 만들어갑니다.
          <br />
          어제보다 나은 오늘을 쌓는
          <br />
          프론트엔드 개발자 <span className="text-fg">차주익</span>입니다.
        </p>
        <a
          href="#work"
          className="v2-mono group flex items-center gap-3 text-[11px] text-fg-muted uppercase transition-colors hover:text-fg sm:mr-40"
        >
          <span className="v2-sans text-[12px]">작업 보기</span>
          <span className="text-fg">({String(count).padStart(2, "0")})</span>
          <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-y-1">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}
