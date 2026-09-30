"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { ProjectMark } from "@/components/project-mark";
import { worlds, worldProjects, type Project } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

/** 세계를 넘어 이어지는 번호. 세계마다 앞 세계들의 개수만큼 밀어서 시작한다. */
const starts = worlds.map((_, i) => worlds.slice(0, i).reduce((s, w) => s + w.slugs.length, 0));
const total = worlds.reduce((s, w) => s + w.slugs.length, 0);

/**
 * 작업 인덱스. 목차처럼 이름만 크게 늘어놓는다.
 *
 * 화면은 목록에 박지 않는다. 이름 위에 올라서면 그 제품 화면이 커서를 따라 떠오른다 —
 * 목록은 가볍게 읽히고, 보고 싶은 것만 크게 본다.
 * 떠오른 화면은 끌려오는 속도만큼 기운다. 손으로 잡아끄는 종이처럼.
 *
 * 마우스가 없는 기기에서는 따라다닐 커서가 없으니 줄마다 작은 화면을 붙인다.
 */
export function V2Index() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Project | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 260, damping: 28, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-1600, 1600], [-7, 7], { clamp: true });

  return (
    <section
      id="work"
      className="scroll-mt-20 px-6 pt-24 pb-10 sm:px-10"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      <header className="flex items-end justify-between gap-6 border-b border-fg pb-5">
        <h2 className="v2-serif text-[clamp(2rem,4vw,3.25rem)] leading-none font-light tracking-[-0.03em]">
          작업
        </h2>
        <p className="v2-mono text-[11px] text-fg-muted uppercase">
          Index · {pad(total)}
        </p>
      </header>

      <div className="v2-list" onPointerLeave={() => setActive(null)}>
        {worlds.map((w, wi) => (
          <div key={w.id} className="grid gap-x-10 border-b border-line py-10 lg:grid-cols-12">
            {/* 세계. 목차의 장 제목처럼 조용히 둔다. */}
            <div className="mb-6 lg:col-span-4 lg:mb-0">
              <div className="lg:sticky lg:top-24">
                <p className="v2-mono text-[11px] text-fg-faint">{pad(wi + 1)}</p>
                <h3 className="mt-2 text-[15px] font-medium text-fg">{w.name}</h3>
                <p className="mt-2 max-w-[30ch] text-[13px] leading-relaxed text-balance text-fg-muted">{w.lore}</p>
              </div>
            </div>

            <ul className="lg:col-span-8">
              {worldProjects(w).map((p, pi) => {
                const n = starts[wi] + pi + 1;
                const detail = Boolean(p.problem || p.decisions?.length);
                const cover = p.shots?.[0];
                const Row = detail ? Link : "div";
                return (
                  <li key={p.slug}>
                    <Row
                      {...((detail ? { href: `/work/${p.slug}`, transitionTypes: ["nav-forward"] } : {}) as unknown as { href: string })}
                      onPointerEnter={() => setActive(p)}
                      onFocus={() => setActive(p)}
                      onBlur={() => setActive(null)}
                      className="v2-row group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-t border-line py-5 first:border-t-0 sm:grid-cols-[2.5rem_1fr_auto]"
                    >
                      <span className="v2-mono hidden text-[11px] text-fg-faint sm:block">{pad(n)}</span>
                      <span className="min-w-0">
                        <span className="v2-serif block text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.05] font-normal tracking-[-0.035em] text-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                          {p.title}
                        </span>
                        <span className="mt-1.5 block truncate text-[13px] text-fg-muted">{p.subtitle}</span>
                      </span>
                      <span className="flex items-center gap-4">
                        {/* 터치 기기용 작은 화면 */}
                        <span className="v2-thumb relative hidden h-12 w-[4.5rem] overflow-hidden rounded-[5px] border border-line bg-bg-raised">
                          {cover ? (
                            <Image src={cover.src} alt="" fill sizes="72px" className="object-cover object-top" />
                          ) : (
                            <ProjectMark slug={p.slug} index={n - 1} className="absolute inset-0 m-auto h-3/5 w-auto" />
                          )}
                        </span>
                        <span className="text-right text-[12px] leading-relaxed text-fg-muted">
                          {p.kind === "work" ? "실무" : "개인"}
                          <br />
                          <span className="v2-mono text-[11px] text-fg-faint">{p.year.slice(0, 4)}</span>
                        </span>
                      </span>
                    </Row>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* 커서를 따라다니는 화면. 마우스가 있는 기기에서만 그린다(CSS). */}
      {!reduced && (
        <motion.div
          aria-hidden
          style={{ x: sx, y: sy, rotate }}
          className="v2-follower pointer-events-none fixed top-0 left-0 z-40"
        >
          <motion.div
            initial={false}
            animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative -mt-[7.5rem] ml-8 aspect-16/10 w-[24rem] overflow-hidden rounded-lg bg-bg-raised shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] ring-1 ring-line"
          >
            <AnimatePresence initial={false}>
              {active && (
                <motion.div
                  key={active.slug}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {active.shots?.[0] ? (
                    <Image
                      src={active.shots[0].src}
                      alt=""
                      fill
                      sizes="384px"
                      className={
                        active.shots[0].device === "mobile" ? "object-contain p-4" : "object-cover object-top"
                      }
                    />
                  ) : (
                    <ProjectMark slug={active.slug} index={0} className="absolute inset-0 m-auto h-1/2 w-auto" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
