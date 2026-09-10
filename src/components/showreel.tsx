"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * 히어로의 화면. 실제 제품이 한 장씩 넘어간다.
 *
 * 이 사람의 주제가 "화면"이라, 첫 화면에 진짜 화면을 두는 것이 가장 짧은 설명이다.
 * 넘어가는 동안 이미지는 전부 DOM에 있고 투명도만 바뀐다 — 전환에 끊김이 없어야 한다.
 */

const INTERVAL = 4200;

type Slide = {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  href?: string;
};

export function Showreel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const current = slides[index];

  return (
    <div
      className="w-full"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* 화면 틀. 신호등 점 세 개 대신 주소창 자리만 둔다. */}
      <div className="overflow-hidden rounded-xl border border-line bg-bg-raised shadow-[var(--shadow)] sm:rounded-2xl">
        <div className="flex h-9 items-center gap-3 border-b border-line px-4 sm:h-11">
          <span aria-hidden className="h-4 w-28 rounded-full bg-bg-sunken sm:w-44" />
          <span className="label ml-auto hidden text-fg-faint sm:block">
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        <div className="relative aspect-16/10">
          {slides.map((slide, i) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 760px, 100vw"
              className={`object-cover object-top transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      {/*
        지금 무엇을 보고 있는지. 화면만 넘기면 무슨 제품인지 알 수 없다.
        key에 index를 물려 이미지와 같은 길이로 함께 바뀌게 한다 —
        글자만 즉시 바뀌면 페이드가 도는 동안 화면과 이름이 어긋난다.
      */}
      <div className="mt-5 flex items-start justify-between gap-6">
        <div key={index} className="caption-swap">
          <p className="text-base font-bold text-fg">
            {current.href ? (
              <Link href={current.href} className="group inline-flex items-center gap-1.5">
                {current.title}
                <ArrowUpRight
                  aria-hidden
                  className="size-4 text-fg-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
              </Link>
            ) : (
              current.title
            )}
          </p>
          <p className="mt-1 text-sm text-fg-muted">{current.subtitle}</p>
        </div>

        <ul className="flex shrink-0 items-center gap-1.5 pt-2">
          {slides.map((slide, i) => (
            <li key={slide.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${slide.title} 보기`}
                aria-current={i === index}
                className={`block h-1 rounded-full transition-all duration-500 ${
                  i === index ? "w-7 bg-accent" : "w-2.5 bg-line hover:bg-fg-faint"
                }`}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
