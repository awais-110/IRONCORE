"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { useMemo, useState } from "react";
import { classes } from "@/lib/data";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const types = ["All", "Strength", "Conditioning", "Mobility", "Hybrid"];

export function Timetable({ compact = false }: { compact?: boolean }) {
  const [type, setType] = useState("All");
  const [day, setDay] = useState("Monday");
  const filtered = useMemo(() => classes.filter((item) => type === "All" || item.type === type), [type]);

  const Card = ({ item }: { item: (typeof classes)[number] }) => (
    <article className="border-l-2 border-accent bg-surface p-4 transition-colors hover:bg-raised">
      <p className="font-mono text-[11px] text-muted">{item.start}—{item.end}</p>
      <h3 className="mt-2 font-display text-lg font-bold uppercase">{item.name}</h3>
      <Link href={`/trainers/${item.trainerSlug}`} className="mt-1 block text-xs text-secondary hover:text-accent">{item.trainer}</Link>
      <div className="mt-4 flex items-center justify-between">
        <span className="flex gap-0.5" aria-label={`Intensity ${item.intensity} of 3`}>
          {[1, 2, 3].map((level) => <Flame key={level} size={13} className={level <= item.intensity ? "fill-accent text-accent" : "text-hairline-strong"} />)}
        </span>
        {item.spotsLeft <= 5 ? <span className="font-mono text-[10px] uppercase text-accent">{item.spotsLeft} spots</span> : null}
      </div>
    </article>
  );

  return (
    <div>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {types.map((item) => (
          <button key={item} onClick={() => setType(item)} className={`shrink-0 border px-4 py-2 font-mono text-[11px] uppercase tracking-wider ${type === item ? "border-accent bg-accent-tint text-accent" : "border-hairline text-muted hover:border-hairline-strong"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="hidden grid-cols-7 gap-px bg-hairline lg:grid">
        {days.map((item) => (
          <div key={item} className="min-h-[340px] bg-bg">
            <p className="border-b border-hairline p-3 font-mono text-[10px] uppercase text-muted">{item.slice(0, 3)}</p>
            <div className="grid gap-px bg-hairline">
              {filtered.filter((entry) => entry.day === item).slice(0, compact ? 1 : 9).map((entry) => <Card key={entry.id} item={entry} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="lg:hidden">
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {days.map((item) => (
            <button key={item} onClick={() => setDay(item)} className={`shrink-0 border-b-2 px-2 py-2 font-mono text-[11px] uppercase ${day === item ? "border-accent text-primary" : "border-transparent text-muted"}`}>{item.slice(0, 3)}</button>
          ))}
        </div>
        <div className="grid gap-2">
          {filtered.filter((entry) => entry.day === day).map((entry) => <Card key={entry.id} item={entry} />)}
        </div>
      </div>
    </div>
  );
}
