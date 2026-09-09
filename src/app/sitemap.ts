import type { MetadataRoute } from "next";
import { projects } from "@/lib/data";

const base = "https://chajuick.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const details = projects
    .filter((p) => p.problem || p.decisions?.length)
    .map((p) => ({
      url: `${base}/work/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...details,
  ];
}
