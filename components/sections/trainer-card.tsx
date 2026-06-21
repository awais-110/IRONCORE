import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Trainer } from "@/lib/data";

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <Link href={`/trainers/${trainer.slug}`} className="group block border-t border-hairline pt-4">
      <div className="mb-4 flex items-center justify-between font-mono text-xs">
        <span className="text-accent">{trainer.index}</span>
        <span className="border border-hairline-strong px-2 py-1 uppercase text-muted group-hover:border-accent group-hover:text-accent">{trainer.specialty}</span>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image src={trainer.image} alt={`${trainer.name} coaching a strength and conditioning session`} fill sizes="(max-width: 768px) 100vw, 33vw" className="image-duotone object-cover" />
      </div>
      <div className="flex items-start justify-between border-b border-hairline py-5">
        <div>
          <h3 className="font-display text-2xl font-bold uppercase">{trainer.name}</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-secondary">{trainer.shortBio}</p>
        </div>
        <ArrowUpRight className="mt-1 shrink-0 text-muted transition-colors group-hover:text-accent" size={20} />
      </div>
    </Link>
  );
}
