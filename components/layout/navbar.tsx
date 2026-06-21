"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  ["Programs", "/programs"],
  ["Trainers", "/trainers"],
  ["Timetable", "/timetable"],
  ["Transformations", "/transformations"],
  ["Contact", "/contact"]
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const background = useTransform(scrollY, [0, 80], ["rgba(10,10,11,0)", "rgba(10,10,11,0.96)"]);
  const borderColor = useTransform(scrollY, [0, 80], ["rgba(42,42,45,0)", "rgba(42,42,45,1)"]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.header style={{ background, borderColor }} className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-sm">
        <nav className="site-container flex h-20 items-center justify-between" aria-label="Main navigation">
          <Link href="/" className="font-display text-2xl font-bold tracking-[0.04em]" onClick={() => setOpen(false)}>
            IRON<span className="text-accent">CORE</span>
          </Link>
          <div className="hidden items-center gap-7 lg:flex">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium text-secondary transition-colors hover:text-primary">
                {label}
              </Link>
            ))}
            <Button href="/join" className="min-h-10 px-5">Join now</Button>
          </div>
          <button
            className="grid size-11 place-items-center border border-hairline lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 flex bg-bg pt-24 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="site-container flex flex-1 flex-col justify-center pb-12">
              {links.map(([label, href], index) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={href}
                    className="block border-t border-hairline py-4 font-display text-4xl font-bold uppercase"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <Button href="/join" className="mt-8 w-full" onClick={() => setOpen(false)}>Start your trial</Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
