import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { JoinForm } from "@/components/forms/join-form";

export const metadata: Metadata = {
  title: "Start Your Trial",
  description: "Choose your goal, membership plan, and preferred start date to begin training at IRONCORE."
};

export default function JoinPage() {
  return (
    <>
      <PageHero index="05" eyebrow="Start here" title="Make the first rep count." body="Three short steps. Tell us what you want, choose your support, and we’ll put the first session on the calendar." />
      <section className="section-space">
        <div className="site-container max-w-4xl">
          <Suspense fallback={<div className="h-[500px] animate-pulse bg-surface" />}>
            <JoinForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
