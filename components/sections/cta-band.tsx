import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABand() {
  return (
    <section className="border-y border-accent bg-accent text-bg">
      <div className="site-container flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em]">Your first session starts here</p>
          <h2 className="mt-3 font-display text-4xl font-bold uppercase md:text-6xl">Stop negotiating with the work.</h2>
        </div>
        <Button href="/join" className="shrink-0 border-bg bg-bg text-primary hover:bg-transparent hover:text-bg">Start your trial <ArrowRight size={16} className="ml-3" /></Button>
      </div>
    </section>
  );
}
