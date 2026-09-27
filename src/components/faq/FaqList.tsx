"use client";

import { useId, useState } from "react";
import type { FaqEntry } from "@/data/types";

/**
 * Accordion with a smooth open/close: each answer sits in a grid row that
 * animates between 0fr and 1fr (height: auto can't be transitioned
 * directly). Answers stay in the HTML at all times, so search engines and
 * AI assistants still read them. The first question starts open.
 */
export function FaqList({ entries }: { entries: FaqEntry[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  function toggle(index: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="mx-auto mt-8 max-w-[880px] divide-y divide-border-light overflow-hidden rounded-[var(--radius-card)] bg-bg-card ring-1 ring-border-light md:mt-10 lg:mt-12">
      {entries.map((entry, index) => {
        const isOpen = open.has(index);
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={entry.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left font-semibold leading-6 transition-colors hover:bg-bg-light focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-sky"
              >
                {entry.q}
                <span aria-hidden="true" className="relative h-5 w-5 shrink-0">
                  <span className="absolute left-0.5 top-1/2 h-[3px] w-4 -translate-y-1/2 rounded-sm bg-accent-warm" />
                  <span
                    className={`absolute left-1/2 top-0.5 h-4 w-[3px] -translate-x-1/2 rounded-sm bg-accent-warm transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-6 text-text-on-light-muted">{entry.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
