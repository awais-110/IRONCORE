import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { TransformationGallery } from "@/components/sections/transformation-gallery";
import { CTABand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Member Transformations",
  description: "Real IRONCORE member results built through consistent strength and conditioning."
};

export default function TransformationsPage() {
  return (
    <>
      <PageHero index="04" eyebrow="Member results" title="The work leaves evidence." body="No miracle language. No hidden timelines. Just real people, stated durations, and progress earned under load." />
      <section className="section-space">
        <div className="site-container">
          <TransformationGallery />
          <p className="mt-16 border-t border-hairline pt-6 text-xs leading-5 text-muted">All members pictured have provided written consent for their images and stories to be published. Individual outcomes vary based on training consistency, nutrition, recovery, and starting point.</p>
        </div>
      </section>
      <CTABand />
    </>
  );
}
