import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { TrainerCard } from "@/components/sections/trainer-card";
import { Reveal } from "@/components/motion/reveal";
import { CTABand } from "@/components/sections/cta-band";
import { trainers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Coaching Team",
  description: "Meet IRONCORE’s strength, conditioning, and mobility coaches."
};

export default function TrainersPage() {
  return (
    <>
      <PageHero index="02" eyebrow="Coaching roster" title="High standards. Clear instruction." body="Our coaches notice the details, tell you the truth, and build training that earns progress." />
      <section className="section-space">
        <div className="site-container grid gap-10 md:grid-cols-3">
          {trainers.map((trainer, index) => <Reveal key={trainer.slug} delay={index * 0.07}><TrainerCard trainer={trainer} /></Reveal>)}
        </div>
      </section>
      <CTABand />
    </>
  );
}
