"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { REPLAY_EVENT } from "@/components/boot-intro";
import { chatEntries, chatIntro, type ChatEntry } from "@/lib/chat";

/**
 * 부팅 연출에서 꺼진 chajuick이 내려와 있는 자리.
 * 누르면 다시 열리고, src/lib/chat.ts에 적어둔 답만 한다.
 *
 * 자유 입력을 두지 않았다. 포트폴리오에서 없는 말이 나가는 것보다
 * 정해둔 질문만 받는 편이 정직하다.
 */

type Message = { role: "user" | "bot"; text: string };

export function Dock() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [asked, setAsked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = useCallback(
    (entry: ChatEntry) => {
      if (busy) return;
      setBusy(true);
      // 동작이 붙은 항목은 목록에 남긴다. 다시 부를 수 있어야 하므로.
      if (!entry.action) setAsked((prev) => [...prev, entry.question]);
      setMessages((prev) => [...prev, { role: "user", text: entry.question }]);

      entry.answer.forEach((line, i) => {
        timers.current.push(
          setTimeout(
            () => {
              setMessages((prev) => [...prev, { role: "bot", text: line }]);
              if (i < entry.answer.length - 1) return;
              setBusy(false);
              if (entry.action === "replay-intro") {
                setOpen(false);
                window.dispatchEvent(new Event(REPLAY_EVENT));
              }
            },
            420 + i * 520,
          ),
        );
      });
    },
    [busy],
  );

  const remaining = chatEntries.filter((e) => !asked.includes(e.question));

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3 sm:right-7 sm:bottom-7">
      {open && (
        <div
          role="dialog"
          aria-label="chajuick 프로그램"
          className="terminal flex h-[26rem] w-[min(21rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-line bg-bg shadow-[var(--shadow)]"
        >
          <header className="flex items-center gap-2.5 border-b border-line px-3.5 py-2.5">
            <Mascot variant="mark" className="w-5" />
            <p className="font-mono text-xs text-fg">chajuick</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="닫기"
              className="ml-auto grid size-6 place-items-center rounded-md text-fg-faint transition-colors hover:bg-bg-raised hover:text-fg"
            >
              <X aria-hidden className="size-3.5" />
            </button>
          </header>

          <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto px-3.5 py-4 font-mono text-xs">
            {chatIntro.map((line) => (
              <p key={line} className="text-fg-faint">
                {line}
              </p>
            ))}

            {messages.map((m, i) => (
              <p
                key={`${m.role}-${i}`}
                className={m.role === "user" ? "text-accent" : "leading-relaxed text-fg"}
              >
                {m.role === "user" ? `> ${m.text}` : m.text}
              </p>
            ))}

            {busy && <span className="caret inline-block h-3.5 w-[7px] bg-accent" />}
          </div>

          {remaining.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-line px-3.5 py-3">
              {remaining.map((entry) => (
                <button
                  key={entry.question}
                  type="button"
                  onClick={() => ask(entry)}
                  disabled={busy}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-fg-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                >
                  {entry.question}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "chajuick 닫기" : "chajuick 열기"}
        className="group flex items-center gap-2.5 rounded-full border border-line bg-bg-raised py-2 pr-4 pl-2.5 shadow-[var(--shadow)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        <Mascot variant="mark" className="w-6" />
        <span className="font-mono text-xs text-fg-muted transition-colors group-hover:text-fg">
          chajuick
        </span>
      </button>
    </div>
  );
}
