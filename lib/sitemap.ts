import type { MetadataRoute } from "next";
import { categoryMeta, getPublishedArticles } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  const latestUpdate = articles.reduce(
    (latest, article) => (article.updatedAt > latest ? article.updatedAt : latest),
    "2026-09-01",
  );

  const fixed = ["", "/about", "/editorial-policy"].map((path, index) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(latestUpdate),
    changeFrequency: index === 0 ? ("weekly" as const) : ("monthly" as const),
    priority: index === 0 ? 1 : 0.5,
  }));

  const posts = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categories = Object.keys(categoryMeta).map((category) => {
    const categoryArticles = articles.filter((article) => article.category === category);
    const categoryUpdate = categoryArticles.reduce(
      (latest, article) => (article.updatedAt > latest ? article.updatedAt : latest),
      categoryArticles[0]?.updatedAt ?? latestUpdate,
    );

    return {
      url: `${SITE_URL}/category/${category}`,
      lastModified: new Date(categoryUpdate),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  return [...fixed, ...categories, ...posts];
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function serializeSitemap(entries: MetadataRoute.Sitemap) {
  const urls = entries
    .map((entry) => {
      const lastModified = entry.lastModified
        ? new Date(entry.lastModified).toISOString()
        : undefined;

      return [
        "  <url>",
        `    <loc>${escapeXml(entry.url)}</loc>`,
        lastModified ? `    <lastmod>${lastModified}</lastmod>` : "",
        entry.changeFrequency
          ? `    <changefreq>${entry.changeFrequency}</changefreq>`
          : "",
        typeof entry.priority === "number"
          ? `    <priority>${entry.priority.toFixed(1)}</priority>`
          : "",
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}
