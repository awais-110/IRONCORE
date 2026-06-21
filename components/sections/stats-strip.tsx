"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/data";

function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCurrent(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.35,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setCurrent
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return <span ref={ref}>{current.toFixed(decimals)}</span>;
}

export function StatsStrip() {
  return (
    <section id="stats" className="border-b border-hairline bg-surface">
      <div className="site-container grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`border-hairline px-3 py-8 md:px-7 md:py-10 ${index % 2 ? "border-l" : ""} ${index > 1 ? "border-t md:border-t-0" : ""} ${index > 0 ? "md:border-l" : ""}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-3xl font-bold md:text-5xl"><Counter value={stat.value} decimals={stat.decimals} />{stat.suffix}</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
