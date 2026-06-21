import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { MapEmbed } from "@/components/ui/map-embed";

export const metadata: Metadata = { title: "Contact", description: "Contact IRONCORE or visit the gym." };

export default function ContactPage() {
  return (
    <>
      <PageHero index="06" eyebrow="Contact" title="Ask a direct question." body="Membership, coaching, class fit, or first-session nerves. Send the useful details and we’ll answer plainly." />
      <section className="section-space">
        <div className="site-container grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">The gym floor</p>
            <div className="mt-8 grid gap-6 text-secondary">
              <p className="flex gap-4"><MapPin className="text-accent" /> Karachi, Pakistan</p>
              <p className="flex items-center gap-4"><Phone className="text-accent" /> (000) 000-0000</p>
              <p className="flex items-center gap-4"><Mail className="text-accent" /> hello@ironcore.example</p>
              <p className="flex gap-4"><Clock3 className="text-accent" /> Mon–Fri 05:00–22:00<br />Sat–Sun 07:00–18:00</p>
            </div>
            <MapEmbed className="mt-10 aspect-[4/3]" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">Send a message</p>
            <h2 className="display-title mt-5">We answer within one business day.</h2>
            <div className="mt-10"><ContactForm /></div>
          </div>
        </div>
      </section>
    </>
  );
}
