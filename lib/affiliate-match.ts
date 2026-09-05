import { getLink, linkUrl } from "./affiliate";

/**
 * 키워드·검색 의도 → 제휴링크 매칭 규칙.
 *
 * 원칙 (docs/ISATIPS_AI_MASTER_OPERATING_INSTRUCTION_v1.0.md §12·13)
 * - 페이지의 검색 의도와 링크의 keywords가 맞을 때만 붙인다.
 * - 한 소제목에 제휴링크는 최대 1개.
 * - 견적(업체 연결)과 자재(직접 시공)는 성격이 다르므로 문맥에 맞는 쪽만 노출한다.
 */

/** 수리·설치 토픽 id → 숨고 견적 딥링크 (업체 연결) */
const quoteByTopic: Record<string, string> = {
  "door-hole": "repair-soomgo-door-repair",
  "fire-door": "repair-soomgo-door-repair",
  "interior-door": "repair-soomgo-door-repair",
  "bathroom-door": "repair-soomgo-door-repair",
  "door-hardware": "repair-soomgo-doorlock",
  "sliding-middle-door": "repair-soomgo-middle-door",
  "entrance-steel-gate": "repair-soomgo-door-build",
  "custom-door-install": "repair-soomgo-door-build",
  "automatic-glass-door": "repair-soomgo-glass",
  "custom-glass-mirror": "repair-soomgo-glass",
  "sink-faucet": "repair-soomgo-plumbing",
  "bathroom-fixture": "repair-soomgo-plumbing",
  "sash-folding-door": "repair-soomgo-sash",
  "home-repair-plumbing": "repair-soomgo-leak",
};

/** 수리·설치 토픽 id → 오늘의집 자재 딥링크 (직접 시공·부품 교체). 자재가 명확히 맞는 토픽만. */
const supplyByTopic: Record<string, string | undefined> = {
  "door-hardware": "repair-ohouse-door-handle",
  "interior-door": "repair-ohouse-door-handle",
  "entrance-steel-gate": "repair-ohouse-doorlock",
  "sink-faucet": "repair-ohouse-kitchen-faucet",
  "bathroom-fixture": "repair-ohouse-bath-faucet",
  "bathroom-door": "repair-ohouse-silicone",
  "sash-folding-door": "repair-ohouse-screen-door",
  "door-hole": "repair-ohouse-sheet",
};

/** 키워드에 자재가 직접 드러나면 토픽 기본값보다 우선한다. */
const supplyByKeyword: Array<[RegExp, string]> = [
  [/도어락|디지털도어락/u, "repair-ohouse-doorlock"],
  [/문고리|손잡이|도어핸들/u, "repair-ohouse-door-handle"],
  [/변기/u, "repair-ohouse-toilet-parts"],
  [/샤워/u, "repair-ohouse-showerhead"],
  [/방충망/u, "repair-ohouse-screen-door"],
  [/줄눈/u, "repair-ohouse-grout"],
  [/실리콘|코킹/u, "repair-ohouse-silicone"],
  [/문풍지|외풍/u, "repair-ohouse-draft-strip"],
  [/싱크|씽크|주방수전/u, "repair-ohouse-kitchen-faucet"],
];

/** 글 슬러그 끝에 붙은 토픽 id를 읽는다. (repair-keyword-081-interior-door → interior-door) */
export function topicIdFromSlug(slug: string): string | undefined {
  const match = /^(?:repair-keyword|regional-repair)-\d+-(.+)$/u.exec(slug);
  return match?.[1];
}

export type MatchedLink = { key: string; url: string; label: string; cta: string };

function toMatch(key: string): MatchedLink {
  const link = getLink(key);
  return { key, url: link.url, label: link.label, cta: link.cta };
}

/** 수리·설치 페이지의 업체 견적 링크 */
export function repairQuoteLink(topicId: string | undefined): MatchedLink {
  return toMatch((topicId && quoteByTopic[topicId]) || "repair-soomgo-door-repair");
}

/** 수리·설치 페이지의 자재 링크. 맞는 자재가 없으면 undefined. */
export function repairSupplyLink(topicId: string | undefined, keyword: string): MatchedLink | undefined {
  const byKeyword = supplyByKeyword.find(([pattern]) => pattern.test(keyword))?.[1];
  const key = byKeyword ?? (topicId ? supplyByTopic[topicId] : undefined);
  return key ? toMatch(key) : undefined;
}

/** 에어컨·벽걸이TV·세탁기 설치 견적 */
export const airconQuoteUrl = linkUrl("repair-soomgo-aircon");
export const tvMountQuoteUrl = linkUrl("repair-soomgo-tv-mount");
export const washerQuoteUrl = linkUrl("repair-soomgo-washer");
/** 집수리·원상복구(누수·설비 복합공정) 견적 */
export const homeRepairQuoteUrl = linkUrl("repair-soomgo-leak");
/** 입주·이사청소 견적 (텐핑 CPA, 건당 정액) */
export const cleaningQuoteUrl = linkUrl("move-cleaning");

/**
 * 지역 페이지의 이사 견적 링크는 그 페이지의 1순위 키워드에 맞춘다.
 * (포장이사 → 모두이사, 이사업체 비교 → 위매치, 원룸 → 이사방 원룸·용달, 그 외 → 이사마켓)
 */
export function movingQuoteLinkForKeyword(keyword: string): MatchedLink {
  if (/원룸|오피스텔|용달|소형/u.test(keyword)) return toMatch("move-cpa-isabang-oneroom");
  if (/업체\s*비교|업체비교/u.test(keyword)) return toMatch("move-cpa-wematch");
  if (/포장이사/u.test(keyword)) return toMatch("move-packing");
  return toMatch("move-compare-2");
}
