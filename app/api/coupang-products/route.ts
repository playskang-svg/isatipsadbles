import { searchCoupangProduct } from "@/lib/coupang";
import { getShoppingGuide } from "@/lib/shopping";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("article") ?? "";
  const guide = getShoppingGuide(slug);

  if (!guide) {
    return Response.json({ error: "지원하지 않는 글입니다." }, { status: 400, headers: { "X-Robots-Tag": "noindex, nofollow" } });
  }

  try {
    const items = [];
    for (const suggestion of guide.suggestions) {
      const product = await searchCoupangProduct(suggestion.keyword);
      items.push({ ...suggestion, product });
    }

    return Response.json(
      { title: guide.title, description: guide.description, items },
      { headers: { "Cache-Control": "public, max-age=900, s-maxage=21600, stale-while-revalidate=86400", "X-Robots-Tag": "noindex, nofollow" } },
    );
  } catch (error) {
    console.error("Coupang product lookup failed", error instanceof Error ? error.message : "Unknown error");
    return Response.json(
      { error: "상품 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
    );
  }
}
