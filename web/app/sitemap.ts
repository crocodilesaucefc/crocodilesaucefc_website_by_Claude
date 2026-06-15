import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.crocodilesaucefc.com';
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/world-cup-hub`, lastModified: now, changeFrequency: 'hourly', priority: 0.8 },
  ];
}
