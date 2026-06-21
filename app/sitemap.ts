import type { MetadataRoute } from "next";
import { trainers } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pages = ["", "/programs", "/trainers", "/timetable", "/transformations", "/join", "/contact"];
  return [
    ...pages.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path ? "weekly" as const : "daily" as const, priority: path ? 0.8 : 1 })),
    ...trainers.map((trainer) => ({ url: `${base}/trainers/${trainer.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 }))
  ];
}
