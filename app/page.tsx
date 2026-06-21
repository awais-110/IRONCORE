import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { StatsStrip } from "@/components/sections/stats-strip";
import { ProgramCards } from "@/components/sections/program-cards";
import { TrainerCard } from "@/components/sections/trainer-card";
import { Timetable } from "@/components/sections/timetable";
import { CTABand } from "@/components/sections/cta-band";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { trainers } from "@/lib/data";

export const metadata: Metadata = { title: "Strength & Conditioning Gym" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: "IRONCORE",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  telephone: "+92-000-0000000",
  address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" }
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <StatsStrip />
      <section className="section-space border-b border-hairline">
        <div className="site-container">
          <SectionHeading eyebrow="Membership / 001—003" title="A plan should demand something from you." body="Three levels of support. One standard: show up, train with intent, and leave stronger than you arrived." />
          <div className="mt-14"><ProgramCards /></div>
        </div>
      </section>
      <section className="section-space border-b border-hairline">
        <div className="site-container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Coaching roster" title="People who know when to push." body="Technical eyes, direct feedback, and no borrowed motivation speeches." />
            <Button href="/trainers" variant="ghost">Full roster <ArrowRight size={16} className="ml-2" /></Button>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {trainers.map((trainer, index) => <Reveal key={trainer.slug} delay={index * 0.07}><TrainerCard trainer={trainer} /></Reveal>)}
          </div>
        </div>
      </section>
      <section className="section-space border-b border-hairline">
        <div className="site-container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="This week under load" title="Classes built around the work." body="Strength, conditioning, mobility, and hybrid sessions coached by people who know your name." />
            <Button href="/timetable" variant="ghost">Full timetable <ArrowRight size={16} className="ml-2" /></Button>
          </div>
          <div className="mt-14"><Timetable compact /></div>
        </div>
      </section>
      <section className="section-space">
        <div className="site-container grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading eyebrow="The standard" title="Results with receipts." />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <blockquote className="font-display text-3xl font-bold uppercase leading-tight md:text-5xl">“I stopped chasing motivation. The room, the plan, and the people made consistency normal.”</blockquote>
            <p className="mt-6 font-mono text-xs uppercase text-accent">Jordan K. / Member since 2024</p>
          </div>
        </div>
      </section>
      <CTABand />
    </>
  );
}
