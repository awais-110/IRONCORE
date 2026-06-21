import Link from "next/link";
import { Instagram, MapPin, Phone, Clock3 } from "lucide-react";
import { NewsletterForm } from "@/components/sections/newsletter-form";
import { MapEmbed } from "@/components/ui/map-embed";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="site-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div>
          <Link href="/" className="font-display text-2xl font-bold">IRON<span className="text-accent">CORE</span></Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-secondary">Serious strength and conditioning for people willing to do honest work.</p>
          <a className="mt-6 inline-flex items-center gap-2 text-sm text-secondary hover:text-accent" href="#" aria-label="IRONCORE on Instagram">
            <Instagram size={18} /> @ironcore.training
          </a>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Explore</p>
          <div className="mt-5 grid gap-3 text-sm text-secondary">
            <Link href="/programs">Programs</Link>
            <Link href="/trainers">Trainers</Link>
            <Link href="/timetable">Timetable</Link>
            <Link href="/transformations">Transformations</Link>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Find us</p>
          <div className="mt-5 grid gap-4 text-sm text-secondary">
            <p className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-accent" size={17} /> Karachi, Pakistan</p>
            <p className="flex items-center gap-3"><Phone className="text-accent" size={17} /> (000) 000-0000</p>
            <p className="flex gap-3"><Clock3 className="mt-0.5 text-accent" size={17} /> Mon–Fri 05:00–22:00<br />Sat–Sun 07:00–18:00</p>
            <MapEmbed className="aspect-[5/3]" />
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Stay accountable</p>
          <p className="mt-5 text-sm leading-6 text-secondary">One useful training note each week. No noise.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="site-container flex flex-col gap-3 py-6 font-mono text-[11px] uppercase tracking-wider text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 IRONCORE. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <span>Built by Awaisify Digital</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
