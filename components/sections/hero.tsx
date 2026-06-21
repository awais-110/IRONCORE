"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StaticBarbell } from "@/components/three/static-barbell";

const BarbellScene = dynamic(() => import("@/components/three/barbell-scene"), {
  ssr: false,
  loading: () => <StaticBarbell />
});

export function Hero() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const motionReduced = mounted && Boolean(reduced);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-hairline">
      <div className="grid-noise pointer-events-none absolute inset-0" />
      <div className="plate-sheen pointer-events-none absolute right-[-12%] top-[8%] hidden h-[84%] w-[66%] lg:block" />
      <motion.div
        className="absolute right-[-6vw] top-[11%] hidden h-[78%] w-[60%] lg:block xl:right-[-8vw]"
        initial={{ opacity: 0, x: motionReduced ? 0 : 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: motionReduced ? 0 : 0.2, duration: motionReduced ? 0.01 : 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {motionReduced ? <StaticBarbell /> : <BarbellScene />}
      </motion.div>
      <div className="site-container relative z-10 flex min-h-[100svh] flex-col justify-center pb-24 pt-28 md:pb-24 md:pt-32">
        <motion.div
          className="max-w-[560px] lg:w-[46%]"
          initial={{ opacity: 0, y: motionReduced ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: motionReduced ? 0 : 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow mb-5">Strength & conditioning / Est. 2014</p>
          <h1 className="hero-title text-balance">The bar<br />doesn’t lie.</h1>
          <p className="mt-7 max-w-[400px] text-base leading-7 text-secondary md:text-lg">Serious coaching, intelligent programming, and a room built for honest work.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/join">Start your trial</Button>
            <Button href="/programs" variant="outline">View programs</Button>
          </div>
        </motion.div>
      </div>
      <a href="#stats" className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Scroll <ArrowDown size={14} className="text-accent" />
      </a>
    </section>
  );
}
