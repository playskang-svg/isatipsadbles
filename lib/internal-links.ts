import type { Article } from "./articles";
import { suwonDistricts } from "./suwon-keyword-tree";

export type InternalLinkRecommendation = {
  article: Article;
  anchor: string;
  reason: string;
};

const coreRegionalFlow = [
  "moving-company-quote-comparison",
  "packing-moving-cost-factors",
  "moving-preparation-checklist",
  "moving-cleaning-guide",
  "rental-deposit-moving-out-checklist",
];

const curatedLinks: Record<string, string[]> = {
  "moving-preparation-checklist": ["moving-company-quote-comparison", "packing-moving-cost-factors", "moving-day-checklist", "move-in-report-address-change", "moving-cleaning-guide"],
  "moving-company-quote-comparison": ["packing-moving-cost-factors", "moving-ladder-truck-cost-guide", "elevator-moving-cost-conditions", "studio-moving-service-comparison", "moving-preparation-checklist"],
  "packing-moving-cost-factors": ["moving-company-quote-comparison", "moving-ladder-truck-cost-guide", "elevator-moving-cost-conditions", "air-conditioner-moving-installation-cost", "moving-preparation-checklist"],
  "moving-day-checklist": ["moving-preparation-checklist", "moving-cleaning-guide", "move-in-report-address-change", "rental-deposit-moving-out-checklist", "moving-with-pets"],
  "move-in-report-address-change": ["moving-day-checklist", "rental-deposit-moving-out-checklist", "moving-preparation-checklist", "moving-cleaning-guide", "moving-company-quote-comparison"],
  "moving-cleaning-guide": ["move-in-first-day-essentials", "moving-day-checklist", "easy-interior-ideas-for-beginners", "moving-with-pets", "moving-preparation-checklist"],
  "rental-deposit-moving-out-checklist": ["moving-company-quote-comparison", "moving-day-checklist", "moving-cleaning-guide", "move-in-report-address-change", "easy-interior-ideas-for-beginners"],
  "moving-with-pets": ["moving-preparation-checklist", "moving-day-checklist", "moving-cleaning-guide", "easy-interior-ideas-for-beginners", "move-in-report-address-change"],
  "easy-interior-ideas-for-beginners": ["moving-cleaning-guide", "rental-deposit-moving-out-checklist", "moving-day-checklist", "moving-preparation-checklist", "moving-with-pets"],
  "son-eomneun-nal-moving-guide": ["moving-preparation-checklist", "moving-company-quote-comparison", "packing-moving-cost-factors", "moving-day-checklist", "move-in-report-address-change"],
  "air-conditioner-moving-installation-cost": ["packing-moving-cost-factors", "moving-company-quote-comparison", "moving-ladder-truck-cost-guide", "elevator-moving-cost-conditions", "wall-mounted-tv-moving-installation-cost", "washer-dryer-moving-installation-cost"],
  "washer-dryer-moving-installation-cost": ["air-conditioner-moving-installation-cost", "moving-day-checklist", "packing-moving-cost-factors", "home-repair-plumbing-estimate-guide", "moving-company-quote-comparison", "move-in-first-day-essentials"],
  "move-in-first-day-essentials": ["moving-day-checklist", "moving-cleaning-guide", "moving-preparation-checklist", "moving-box-quantity-size-guide", "easy-interior-ideas-for-beginners"],
  "moving-waste-appliance-furniture-disposal": ["moving-preparation-checklist", "packing-moving-cost-factors", "moving-day-checklist", "studio-moving-service-comparison", "rental-deposit-moving-out-checklist"],
  "moving-ladder-truck-cost-guide": ["elevator-moving-cost-conditions", "moving-company-quote-comparison", "packing-moving-cost-factors", "wall-mounted-tv-moving-installation-cost", "air-conditioner-moving-installation-cost"],
  "elevator-moving-cost-conditions": ["moving-ladder-truck-cost-guide", "moving-company-quote-comparison", "packing-moving-cost-factors", "moving-day-checklist", "studio-moving-service-comparison"],
  "wall-mounted-tv-moving-installation-cost": ["no-drill-wall-mounted-tv-installation", "air-conditioner-moving-installation-cost", "moving-company-quote-comparison", "packing-moving-cost-factors", "easy-interior-ideas-for-beginners"],
  "no-drill-wall-mounted-tv-installation": ["wall-mounted-tv-moving-installation-cost", "easy-interior-ideas-for-beginners", "rental-deposit-moving-out-checklist", "moving-cleaning-guide", "move-in-first-day-essentials"],
  "moving-box-quantity-size-guide": ["studio-moving-service-comparison", "move-in-first-day-essentials", "moving-preparation-checklist", "packing-moving-cost-factors", "moving-day-checklist"],
  "studio-moving-service-comparison": ["moving-box-quantity-size-guide", "moving-company-quote-comparison", "packing-moving-cost-factors", "elevator-moving-cost-conditions", "moving-ladder-truck-cost-guide"],
  "interior-door-hole-repair-guide": ["interior-door-replacement-cost-guide", "door-handle-hinge-sagging-repair", "rental-deposit-moving-out-checklist", "easy-interior-ideas-for-beginners", "fire-door-repair-replacement-guide"],
  "interior-door-replacement-cost-guide": ["interior-door-hole-repair-guide", "door-handle-hinge-sagging-repair", "sliding-middle-door-repair-installation", "rental-deposit-moving-out-checklist", "easy-interior-ideas-for-beginners"],
  "fire-door-repair-replacement-guide": ["entrance-steel-gate-repair-cost", "door-handle-hinge-sagging-repair", "interior-door-replacement-cost-guide", "rental-deposit-moving-out-checklist", "moving-day-checklist"],
  "door-handle-hinge-sagging-repair": ["interior-door-hole-repair-guide", "interior-door-replacement-cost-guide", "fire-door-repair-replacement-guide", "sliding-middle-door-repair-installation", "entrance-steel-gate-repair-cost"],
  "sliding-middle-door-repair-installation": ["interior-door-replacement-cost-guide", "door-handle-hinge-sagging-repair", "commercial-glass-automatic-door-repair-cost", "easy-interior-ideas-for-beginners", "rental-deposit-moving-out-checklist"],
  "entrance-steel-gate-repair-cost": ["fire-door-repair-replacement-guide", "door-handle-hinge-sagging-repair", "commercial-glass-automatic-door-repair-cost", "interior-door-replacement-cost-guide", "rental-deposit-moving-out-checklist"],
  "commercial-glass-automatic-door-repair-cost": ["entrance-steel-gate-repair-cost", "fire-door-repair-replacement-guide", "sliding-middle-door-repair-installation", "door-handle-hinge-sagging-repair", "interior-door-replacement-cost-guide"],
};

const stopWords = new Set(["이사", "정보", "방법", "확인", "체크", "가이드", "정리", "비용", "수원시"]);

function tokenize(article: Article) {
  return new Set(
    `${article.title} ${article.keyword} ${(article.secondaryKeywords ?? []).join(" ")}`
      .match(/[가-힣A-Za-z0-9]+/g)
      ?.filter((token) => token.length >= 2 && !stopWords.has(token)) ?? [],
  );
}

function suwonHierarchyLinks(slug: string) {
  for (const district of suwonDistricts) {
    const dongIndex = district.dongs.findIndex((dong) => dong.slug === slug);
    if (dongIndex >= 0) {
      const siblings = [district.dongs[dongIndex - 1], district.dongs[dongIndex + 1]].flatMap((dong) => dong ? [dong.slug] : []);
      return [district.slug, "suwon-city-moving-guide", ...siblings];
    }
  }
  return [];
}

function preferredSlugs(article: Article) {
  const hierarchy = suwonHierarchyLinks(article.slug);
  const incheonTreeLinks = article.source?.url.includes("incheon.go.kr")
    ? [
        "incheon-moving-regional-guide",
        ...(article.regionTree?.districts.flatMap((district) => [
          district.href.replace("/articles/", ""),
          ...district.dongs.flatMap((dong) => [
            dong.href?.replace("/articles/", ""),
            ...(dong.apartments ?? []).map((apartment) => apartment.href.replace("/articles/", "")),
          ]),
        ]) ?? []),
      ].filter((slug): slug is string => Boolean(slug) && slug !== article.slug)
    : [];
  const repairKeywordGuide = article.slug.startsWith("repair-keyword-")
    ? article.breadcrumbs?.find((crumb) => crumb.href.startsWith("/articles/"))?.href.replace("/articles/", "")
    : undefined;
  const curated = curatedLinks[article.slug] ?? (article.category === "regional" ? coreRegionalFlow : []);
  return [...new Set([...hierarchy, ...incheonTreeLinks, ...(repairKeywordGuide ? [repairKeywordGuide] : []), ...curated])];
}

function reasonFor(article: Article) {
  if (article.category === "quotes") return "견적 조건과 추가요금 기준을 더 정확히 비교하려면";
  if (article.category === "planning") return "날짜와 준비 순서를 빠뜨리지 않으려면";
  if (article.category === "admin") return "전입신고·보증금과 행정 절차까지 이어서 준비하려면";
  if (article.category === "home-care") return "청소·정리와 입주 준비를 함께 챙기려면";
  if (article.category === "repair-install") return "수리와 교체 범위, 견적 항목을 이어서 비교하려면";
  return "가까운 지역의 건물 조건과 이사 방법을 함께 비교하려면";
}

export function getInternalLinkRecommendations(current: Article, published: Article[], limit = 6): InternalLinkRecommendation[] {
  const preferred = preferredSlugs(current);
  const currentTokens = tokenize(current);
  const scored = published
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => {
      const preferredIndex = preferred.indexOf(candidate.slug);
      const sharedTokens = [...tokenize(candidate)].filter((token) => currentTokens.has(token));
      const regionBonus = current.category === "regional" && candidate.category === "regional" ? 55 : 0;
      const categoryBonus = current.category === candidate.category ? 35 : 0;
      const score = (preferredIndex >= 0 ? 1000 - preferredIndex * 25 : 0) + regionBonus + categoryBonus + sharedTokens.length * 12;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || b.candidate.updatedAt.localeCompare(a.candidate.updatedAt));

  return scored.slice(0, limit).map(({ candidate }) => ({
    article: candidate,
    anchor: candidate.keyword || candidate.title,
    reason: reasonFor(candidate),
  }));
}
