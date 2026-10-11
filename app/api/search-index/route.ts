import { getPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

const NOINDEX = { "X-Robots-Tag": "noindex" };

export function GET() {
  const items = getPublishedArticles().map(({ slug, title, description, keyword, categoryLabel }) => ({
    slug,
    title,
    description,
    keyword,
    categoryLabel,
  }));
  return Response.json(items, {
    headers: { ...NOINDEX, "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
