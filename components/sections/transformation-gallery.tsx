"use client";

import { useState } from "react";
import { transformations } from "@/lib/data";
import { TransformationSlider } from "@/components/sections/transformation-slider";

const goals = ["All", "Strength", "Recomposition", "Athletic Performance"];

export function TransformationGallery() {
  const [goal, setGoal] = useState("All");
  const filtered = transformations.filter((entry) => goal === "All" || entry.goal === goal);

  return (
    <>
      <div className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {goals.map((item) => (
          <button key={item} onClick={() => setGoal(item)} className={`shrink-0 border px-4 py-2 font-mono text-[11px] uppercase ${goal === item ? "border-accent bg-accent-tint text-accent" : "border-hairline text-muted"}`}>{item}</button>
        ))}
      </div>
      <div className="grid gap-12 md:grid-cols-2">
        {filtered.map((entry) => <TransformationSlider key={entry.id} entry={entry} />)}
      </div>
    </>
  );
}
