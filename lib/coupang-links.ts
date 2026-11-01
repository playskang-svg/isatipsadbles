import links from "@/data/coupang-links.json";
import banners from "@/data/coupang-banners.json";

const table = links as Record<string, string>;
const bannerTable = banners as Record<string, { id: string }>;

/** 쿠팡 파트너스 간편 링크. 파트너 ID AF8819972 계정의 관리 화면에서 발급한다. 아직 없으면 undefined. */
export function coupangUrl(query: string): string | undefined {
  return table[query];
}

export const COUPANG_TRACKING_CODE = "AF8819972";

/** 쿠팡 다이나믹 배너 id. 아직 없으면 undefined. */
export function coupangBannerId(key: string): string | undefined {
  return bannerTable[key]?.id;
}
