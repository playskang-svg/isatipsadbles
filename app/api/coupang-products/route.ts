import { CoupangCredentialsMissingError, hasCoupangCredentials, searchCoupangProduct } from "@/lib/coupang";
import { getShoppingGuide } from "@/lib/shopping";

const NOINDEX = { "X-Robots-Tag": "noindex, nofollow" };
const CACHE_OK = "public, max-age=900, s-maxage=21600, stale-while-revalidate=86400";
// 자격증명이 없을 때는 짧게만 캐시한다. 키를 등록하면 바로 반영돼야 한다.
const CACHE_DEGRADED = "public, max-age=60, s-maxage=60";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("article") ?? "";

  // 값은 노출하지 않고 설정 여부만 알려주는 진단용 응답.
  if (url.searchParams.get("diag") === "1") {
    return Response.json(
      { credentialsConfigured: hasCoupangCredentials() },
      { headers: { ...NOINDEX, "Cache-Control": "no-store" } },
    );
  }

  const guide = getShoppingGuide(slug);
  if (!guide) {
    return Response.json({ error: "지원하지 않는 글입니다." }, { status: 400, headers: NOINDEX });
  }

  if (!hasCoupangCredentials()) {
    console.error("Coupang credentials missing on this runtime. wrangler secret put COUPANG_ACCESS_KEY / COUPANG_SECRET_KEY");
    return Response.json(
      { title: guide.title, description: guide.description, items: guide.suggestions.map((s) => ({ ...s, product: null })), degraded: "credentials_missing" },
      { headers: { ...NOINDEX, "Cache-Control": CACHE_DEGRADED } },
    );
  }

  // 제안 키워드마다 순차 호출하면 항목 수만큼 지연이 쌓이고, 하나만 실패해도
  // 전체가 502로 떨어졌다. 병렬로 부르고 실패한 항목만 product: null로 남긴다.
  const results = await Promise.allSettled(
    guide.suggestions.map((suggestion) => searchCoupangProduct(suggestion.keyword, slug)),
  );

  const items = guide.suggestions.map((suggestion, index) => {
    const result = results[index];
    if (result.status === "fulfilled") return { ...suggestion, product: result.value };
    console.error(`Coupang lookup failed for "${suggestion.keyword}":`, result.reason instanceof Error ? result.reason.message : "Unknown error");
    return { ...suggestion, product: null };
  });

  const credentialsRejected = results.some(
    (r) => r.status === "rejected" && r.reason instanceof CoupangCredentialsMissingError,
  );
  const allFailed = results.every((r) => r.status === "rejected");

  if (credentialsRejected || allFailed) {
    return Response.json(
      { title: guide.title, description: guide.description, items, degraded: credentialsRejected ? "credentials_missing" : "lookup_failed" },
      { headers: { ...NOINDEX, "Cache-Control": CACHE_DEGRADED } },
    );
  }

  return Response.json(
    { title: guide.title, description: guide.description, items },
    { headers: { ...NOINDEX, "Cache-Control": CACHE_OK } },
  );
}
