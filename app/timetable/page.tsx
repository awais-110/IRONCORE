import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Timetable } from "@/components/sections/timetable";
import { CTABand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Class Timetable",
  description: "Browse IRONCORE strength, conditioning, mobility, and hybrid classes."
};

export default function TimetablePage() {
  return (
    <>
      <PageHero index="03" eyebrow="Weekly schedule" title="Put the work on your calendar." body="Filter by training style, find your coach, and choose the hour you refuse to negotiate away." />
      <section className="section-space">
        <div className="site-container"><Timetable /></div>
      </section>
      <CTABand />
    </>
  );
}
