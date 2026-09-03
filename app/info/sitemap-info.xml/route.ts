import { getSitemapEntries, serializeSitemap } from "@/lib/sitemap";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(serializeSitemap(getSitemapEntries()), {
    status: 200,
    headers: {
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
