import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { ProgramCards } from "@/components/sections/program-cards";
import { CTABand } from "@/components/sections/cta-band";
import { programs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Membership Programs",
  description: "Choose an IRONCORE membership built around your training goals and level of coaching support."
};

const rows = [
  ["Open gym access", true, true, true],
  ["Coached classes", "2 / week", "Unlimited", "Unlimited"],
  ["Individual programming", false, "Monthly block", "Weekly update"],
  ["Coach check-ins", "Quarterly", "Monthly", "Weekly"],
  ["Recovery zone", false, true, true],
  ["Priority booking", false, false, true]
] as const;

export default function ProgramsPage() {
  return (
    <>
      <PageHero index="01" eyebrow="Membership" title="Choose your level of commitment." body="No contracts designed to trap you. Pick the coaching and access your work actually requires." />
      <section className="section-space border-b border-hairline">
        <div className="site-container"><ProgramCards /></div>
      </section>
      <section className="section-space">
        <div className="site-container">
          <p className="eyebrow">Feature matrix</p>
          <h2 className="display-title mt-5">Compare the work.</h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-y border-hairline-strong">
                  <th className="py-5 text-sm font-medium text-muted">Included</th>
                  {programs.map((program) => <th key={program.id} className="px-5 py-5 font-display text-xl uppercase">{program.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map(([feature, ...values]) => (
                  <tr key={feature} className="border-b border-hairline">
                    <td className="py-5 text-sm text-secondary">{feature}</td>
                    {values.map((value, index) => (
                      <td key={index} className="px-5 py-5 font-mono text-xs text-secondary">
                        {value === true ? <Check className="text-accent" size={17} /> : value === false ? <Minus className="text-muted" size={17} /> : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 font-mono text-xs text-muted">DROP-IN / DAY PASS — $20. First coached trial session is complimentary.</p>
        </div>
      </section>
      <CTABand />
    </>
  );
}
