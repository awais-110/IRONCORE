import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Instagram, Check } from "lucide-react";
import { trainers, classes } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { CTABand } from "@/components/sections/cta-band";

export function generateStaticParams() {
  return trainers.map((trainer) => ({ slug: trainer.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const trainer = trainers.find((item) => item.slug === params.slug);
  if (!trainer) return {};
  return {
    title: trainer.name,
    description: `${trainer.name} — IRONCORE ${trainer.specialty} coach. ${trainer.shortBio}`
  };
}

export default function TrainerPage({ params }: { params: { slug: string } }) {
  const trainer = trainers.find((item) => item.slug === params.slug);
  if (!trainer) notFound();
  const trainerClasses = classes.filter((item) => item.trainerSlug === trainer.slug);
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: trainer.name,
    jobTitle: `${trainer.specialty} Coach`,
    worksFor: { "@type": "HealthClub", name: "IRONCORE" }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <section className="border-b border-hairline pt-28">
        <div className="site-container grid min-h-[80vh] gap-10 py-10 lg:grid-cols-12 lg:items-end">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface lg:col-span-5 lg:h-[68vh] lg:w-full">
            <Image src={trainer.image} alt={`${trainer.name} coaching on the IRONCORE gym floor`} fill priority sizes="(max-width: 1024px) 100vw, 42vw" className="image-duotone object-cover" />
          </div>
          <div className="pb-5 lg:col-span-6 lg:col-start-7">
            <p className="font-mono text-xs text-accent">{trainer.index} / COACHING ROSTER</p>
            <h1 className="hero-title mt-5">{trainer.name}</h1>
            <span className="mt-6 inline-block border border-accent px-3 py-2 font-mono text-xs uppercase text-accent">{trainer.specialty}</span>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-secondary">{trainer.bio}</p>
            <a href="#" className="mt-7 inline-flex items-center gap-2 text-sm text-muted hover:text-accent"><Instagram size={17} /> {trainer.instagram}</a>
          </div>
        </div>
      </section>
      <section className="section-space border-b border-hairline">
        <div className="site-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Coaching philosophy</p>
          </div>
          <blockquote className="font-display text-4xl font-bold uppercase leading-tight lg:col-span-7 lg:text-6xl">“{trainer.quote}”</blockquote>
        </div>
      </section>
      <section className="section-space border-b border-hairline">
        <div className="site-container grid gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Qualifications</p>
            <h2 className="display-title mt-5">Earned, not implied.</h2>
            <ul className="mt-8 grid gap-4">
              {trainer.certifications.map((item) => <li key={item} className="flex gap-3 border-b border-hairline pb-4 text-secondary"><Check className="shrink-0 text-accent" size={18} /> {item}</li>)}
            </ul>
          </div>
          <div>
            <p className="eyebrow">On the timetable</p>
            <div className="mt-8 grid gap-px bg-hairline">
              {trainerClasses.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-surface p-5">
                  <div><p className="font-display text-xl font-bold uppercase">{item.name}</p><p className="mt-1 text-xs text-muted">{item.day}</p></div>
                  <p className="font-mono text-xs text-accent">{item.start}—{item.end}</p>
                </div>
              ))}
            </div>
            <Button href="/join" className="mt-8">Train with {trainer.name.split(" ")[0]}</Button>
          </div>
        </div>
      </section>
      <CTABand />
    </>
  );
}
