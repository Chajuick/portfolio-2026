import Image from "next/image";
import type { Shot } from "@/lib/data";

/**
 * 실제 화면을 기기 테두리 안에 넣는다.
 * 스크린샷을 맨몸으로 놓으면 페이지의 일부인지 캡처인지 구분이 안 된다.
 */
export function DeviceFrame({ shot }: { shot: Shot }) {
  const caption = shot.caption && (
    <figcaption className="label mt-3 text-fg-faint">{shot.caption}</figcaption>
  );

  if (shot.device === "mobile") {
    return (
      <figure className="w-full max-w-[210px]">
        <div className="rounded-[1.9rem] border-[5px] border-line-strong bg-bg-raised p-1">
          <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.5rem]">
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="210px"
              className="object-cover object-top"
            />
          </div>
        </div>
        {caption}
      </figure>
    );
  }

  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-xl border border-line bg-bg-raised shadow-[var(--shadow)]">
        {/* 주소창 자리. 신호등 점 세 개는 흔해서 뺐다. */}
        <div className="flex h-9 items-center justify-center border-b border-line px-4">
          <span aria-hidden className="h-4 w-1/3 max-w-44 rounded-full bg-bg-sunken" />
        </div>
        <div className="relative aspect-16/10">
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(min-width: 1024px) 928px, 100vw"
            className="object-cover object-top"
          />
        </div>
      </div>
      {caption}
    </figure>
  );
}
