"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import type { transformations } from "@/lib/data";

type Entry = (typeof transformations)[number];

export function TransformationSlider({ entry }: { entry: Entry }) {
  const [position, setPosition] = useState(50);
  const [showAfter, setShowAfter] = useState(true);

  return (
    <article>
      <div className="relative aspect-[4/5] overflow-hidden border border-hairline bg-surface">
        <Image src={entry.before} alt={`${entry.name} before beginning their ${entry.weeks}-week training program`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover grayscale" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image src={entry.after} alt={`${entry.name} after completing their ${entry.weeks}-week training program`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover grayscale" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-px bg-accent" style={{ left: `${position}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center border border-accent bg-bg text-accent">
            <ArrowLeftRight size={17} />
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          aria-label={`Compare before and after photos for ${entry.name}`}
        />
        <span className="absolute bottom-3 left-3 bg-bg px-2 py-1 font-mono text-[10px] uppercase">After</span>
        <span className="absolute bottom-3 right-3 bg-bg px-2 py-1 font-mono text-[10px] uppercase">Before</span>
      </div>
      <button
        className="mt-3 w-full border border-hairline px-4 py-3 font-mono text-[10px] uppercase text-muted hover:border-accent hover:text-accent"
        onClick={() => {
          setShowAfter((value) => !value);
          setPosition(showAfter ? 0 : 100);
        }}
      >
        Show {showAfter ? "before" : "after"} image
      </button>
      <div className="border-b border-hairline py-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase text-primary">{entry.weeks} weeks — {entry.name}</p>
          <span className="border border-hairline px-2 py-1 font-mono text-[10px] uppercase text-muted">{entry.goal}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-secondary">“{entry.quote}”</p>
      </div>
    </article>
  );
}
