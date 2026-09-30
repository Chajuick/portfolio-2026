"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDE_MS, slides } from "@/components/home/slides";

const Monitor3D = dynamic(() => import("@/components/home/monitor-3d"), { ssr: false });

const pad = (n: number) => String(n).padStart(2, "0");

/** 3D를 켜도 되는 환경인가. 아니면 2D 모니터로 충분하다. */
function canUse3D() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // 터치 기기에서는 3D 묶음을 받는 비용에 비해 얻는 게 적다.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

/** 2D 디스플레이. 3D가 뜨기 전, 그리고 3D를 못 쓰는 기기에서 같은 화면을 보여준다. 3D와 같은 모양이다. */
function FlatMonitor({ index }: { index: number }) {
  return (
    <div className="w-[88%]">
      <div className="rounded-[8px] bg-[#050506] p-[1.3%] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] ring-[1.5px] ring-[#c9ccd2]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-[#0c0d10]">
          {slides.map((s, i) => (
            <Image
              key={s.slug}
              src={s.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 480px, 80vw"
              priority={i === 0}
              className={`object-cover object-top transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
      <div className="mx-auto h-[2.6rem] w-[26%] bg-gradient-to-b from-[#9ea2a9] to-[#d3d6db]" />
      <div className="mx-auto h-[0.3rem] w-[30%] rounded-[1px] bg-[#c9ccd2]" />
    </div>
  );
}

/**
 * 첫 화면의 모니터. 화면에 만든 것들이 차례로 켜진다.
 *
 * 처음엔 2D 모니터가 서 있다. 페이지가 다 뜨고 브라우저가 한가해지면 그때 3D를 불러와
 * 준비되는 순간 겹쳐 바꾼다 — 첫 화면이 3D 묶음을 기다리지 않는다.
 * 넘김 버튼이나 점은 두지 않는다. 캐러셀이 아니라 켜져 있는 모니터로 읽히게.
 * 화면 밖으로 나가거나 탭이 가려지면 넘김도 그리기도 멈춘다.
 */
export function MonitorStage({ className = "" }: { className?: string }) {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [want3D, setWant3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!canUse3D()) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const start = () => setWant3D(true);
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(start, 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let onScreen = true;
    const update = () => setVisible(onScreen && document.visibilityState === "visible");
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [visible]);

  const onReady = useCallback(() => setReady(true), []);
  const current = slides[index];
  const open = useCallback(() => {
    if (current.detail) router.push(`/work/${current.slug}`, { transitionTypes: ["nav-forward"] });
  }, [current, router]);

  return (
    <div ref={box} className={className}>
      <div className="relative aspect-square">
        <div
          className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <FlatMonitor index={index} />
        </div>

        {want3D && (
          <div
            aria-hidden
            className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          >
            <Monitor3D active={visible} index={index} onReady={onReady} onOpen={open} />
          </div>
        )}
      </div>

      {/* 지금 켜진 화면이 무엇인지. 누르면 그 작업으로 간다. */}
      <Link
        href={current.detail ? `/work/${current.slug}` : "#work"}
        transitionTypes={current.detail ? ["nav-forward"] : undefined}
        className="group mx-auto -mt-2 flex w-fit items-baseline gap-3 text-[13px]"
        aria-live="polite"
      >
        <span className="v2-mono text-[11px] text-fg-faint">
          {pad(index + 1)} / {pad(slides.length)}
        </span>
        <span className="text-fg transition-colors group-hover:text-accent">{current.title}</span>
        <span className="hidden text-fg-muted sm:inline">{current.subtitle}</span>
      </Link>
    </div>
  );
}
