import { getLink, linkUrl } from "./affiliate";
import { coupangUrl } from "./coupang-links";

/**
 * 키워드·검색 의도 → 제휴링크 매칭 규칙.
 *
 * 원칙 (docs/ISATIPS_AI_MASTER_OPERATING_INSTRUCTION_v1.0.md §12·13)
 * - 페이지의 검색 의도와 링크의 keywords가 맞을 때만 붙인다.
 * - 한 소제목에 제휴링크는 최대 1개.
 * - 견적(숨고 딥링크)과 자재(쿠팡 간편 링크)는 성격이 다르므로 문맥에 맞는 쪽만 노출한다.
 */

/** 수리·설치 토픽 id → 숨고 견적 딥링크 (업체 연결) */
const quoteByTopic: Record<string, string> = {
  "door-hole": "repair-soomgo-door-repair",
  "fire-door": "repair-soomgo-door-build",
  "interior-door": "repair-soomgo-door-repair",
  "bathroom-door": "repair-soomgo-door-repair",
  "door-hardware": "repair-soomgo-door-repair",
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

/** 키워드에 작업이 직접 드러나면 토픽 기본값보다 우선한다. */
const quoteByKeyword: Array<[RegExp, string]> = [
  [/도어락|번호키/u, "repair-soomgo-doorlock"],
  [/방충망/u, "repair-soomgo-screen-door"],
  [/줄눈/u, "repair-soomgo-grout"],
  [/실리콘|코킹/u, "repair-soomgo-caulk"],
  [/도배|벽지/u, "repair-soomgo-wallpaper"],
  [/싱크대(교체|공사|공장|리폼|상판)|싱크볼/u, "repair-soomgo-sink-replace"],
  [/누수/u, "repair-soomgo-leak"],
  [/욕실공사|욕실리모델링|화장실리모델링/u, "repair-soomgo-bath-remodel"],
  [/타일/u, "repair-soomgo-tile"],
  [/필름|시트지/u, "repair-soomgo-interior-film"],
  [/후드/u, "repair-soomgo-hood"],
  [/환풍기/u, "repair-soomgo-vent"],
  [/방화문|현관문|철문|대문/u, "repair-soomgo-door-build"],
];

/** 수리·설치 토픽 id → 쿠팡 자재 검색어 (직접 시공·부품 교체). 자재가 명확히 맞는 토픽만. */
const supplyByTopic: Record<string, string | undefined> = {
  "door-hardware": "방문 손잡이",
  "interior-door": "방문 손잡이",
  "entrance-steel-gate": "디지털 도어락",
  "sink-faucet": "싱크대 수전",
  "bathroom-fixture": "세면대 수전",
  "bathroom-door": "욕실 실리콘",
  "sash-folding-door": "미세방충망 롤",
  "door-hole": "방문 인테리어 필름",
};

/** 키워드에 자재가 직접 드러나면 토픽 기본값보다 우선한다. */
const supplyByKeyword: Array<[RegExp, string]> = [
  [/도어락|디지털도어락/u, "디지털 도어락"],
  [/문고리|손잡이|도어핸들/u, "방문 손잡이"],
  [/변기/u, "변기 부속 세트"],
  [/샤워/u, "샤워기 헤드"],
  [/방충망/u, "미세방충망 롤"],
  [/줄눈/u, "줄눈 보수제"],
  [/실리콘|코킹/u, "욕실 실리콘"],
  [/문풍지|외풍/u, "문풍지"],
  [/싱크|씽크|주방수전/u, "싱크대 수전"],
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
export function repairQuoteLink(topicId: string | undefined, keyword = ""): MatchedLink {
  const byKeyword = quoteByKeyword.find(([pattern]) => pattern.test(keyword))?.[1];
  return toMatch(byKeyword ?? ((topicId && quoteByTopic[topicId]) || "repair-soomgo-door-repair"));
}

/** 수리·설치 페이지의 자재 링크. 맞는 자재가 없거나 아직 발급 전이면 undefined. */
export function repairSupplyLink(topicId: string | undefined, keyword: string): MatchedLink | undefined {
  const byKeyword = supplyByKeyword.find(([pattern]) => pattern.test(keyword))?.[1];
  const query = byKeyword ?? (topicId ? supplyByTopic[topicId] : undefined);
  const url = query ? coupangUrl(query) : undefined;
  return query && url ? { key: `coupang:${query}`, url, label: query, cta: "쿠팡에서 가격 보기" } : undefined;
}

/** 자재 링크에 쓰는 쿠팡 검색어 전체. 발급 목록을 만들 때 쓴다. */
export const supplyQueries = [...new Set([...Object.values(supplyByTopic).filter(Boolean), ...supplyByKeyword.map(([, query]) => query)])] as string[];

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
