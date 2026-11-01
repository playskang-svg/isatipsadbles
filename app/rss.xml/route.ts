import { getPublishedArticles } from "@/lib/articles";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

/** 네이버 서치어드바이저에 제출하는 RSS. 최근 공개 글 100개만 싣는다. */
export function GET() {
  const items = [...getPublishedArticles()]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 100)
    .map((article) => {
      const url = `${SITE_URL}/articles/${encodeURI(article.slug)}`;
      return [
        "    <item>",
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid>${escapeXml(url)}</guid>`,
        `      <description>${escapeXml(article.description)}</description>`,
        `      <category>${escapeXml(article.categoryLabel)}</category>`,
        `      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${SITE_URL}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    "    <language>ko</language>",
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" },
  });
}
