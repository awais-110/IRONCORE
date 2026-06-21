"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { programs } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function ProgramCards({ limit }: { limit?: number }) {
  const [annual, setAnnual] = useState(false);
  const items = limit ? programs.slice(0, limit) : programs;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-hairline pb-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">Billing cadence</p>
        <div className="flex border border-hairline" aria-label="Billing cadence">
          <button onClick={() => setAnnual(false)} className={`px-4 py-2 font-mono text-xs uppercase ${!annual ? "bg-primary text-bg" : "text-muted"}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`px-4 py-2 font-mono text-xs uppercase ${annual ? "bg-primary text-bg" : "text-muted"}`}>Annual</button>
        </div>
      </div>
      <div className="grid gap-px bg-hairline lg:grid-cols-3">
        {items.map((program, index) => (
          <Reveal key={program.id} delay={index * 0.07}>
            <article className={`group relative flex min-h-[490px] flex-col bg-surface p-6 transition-all duration-300 ease-impact hover:-translate-y-1 hover:bg-raised md:p-8 ${program.featured ? "border-t-2 border-accent" : "border-t-2 border-transparent"}`}>
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-accent">{program.index}</span>
                {program.featured ? <span className="border border-accent px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">Most committed</span> : null}
              </div>
              <h3 className="mt-10 font-display text-3xl font-bold uppercase">{program.name}</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-secondary">{program.description}</p>
              <p className="mt-7 font-mono text-4xl font-bold">
                ${annual ? program.annual : program.monthly}
                <span className="ml-2 text-xs font-normal text-muted">/ {annual ? "YEAR" : "MONTH"}</span>
              </p>
              {annual ? <p className="mt-2 font-mono text-[10px] uppercase text-accent">Two months included</p> : null}
              <ul className="mt-8 grid gap-3">
                {program.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-secondary">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" /> {feature}
                  </li>
                ))}
              </ul>
              <Button href={`/join?plan=${program.id}`} variant={program.featured ? "primary" : "outline"} className="mt-auto w-full">Choose {program.name}</Button>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
