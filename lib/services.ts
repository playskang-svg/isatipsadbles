import { linkUrl } from "@/lib/affiliate";
import { repairQuoteLink, topicIdFromSlug } from "@/lib/affiliate-match";

export type MovingService = {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  url: string;
};

export const consultationUrl = "https://isatips.dbsn.kr";

const twoQuoteComparison: MovingService = {
  eyebrow: "MOVE SMART",
  title: "한 곳만 보지 말고 2곳 견적을 비교하세요",
  description: "같은 이사 조건을 전달하고 작업 범위와 추가 비용을 나란히 확인해 보세요.",
  buttonLabel: "이사 2곳 견적 비교",
  url: linkUrl("move-compare-2"),
};

const packingSpecialist: MovingService = {
  eyebrow: "PACKING MOVE",
  title: "포장이사 전문 상담이 필요하다면",
  description: "짐의 양, 이동 거리와 건물 조건을 알려주고 내 상황에 맞는 포장이사 범위를 확인해 보세요.",
  buttonLabel: "포장이사 전문 상담",
  url: linkUrl("move-packing"),
};

const cleaningSpecialist: MovingService = {
  eyebrow: "MOVE-IN CLEANING",
  title: "이사청소 범위와 일정을 먼저 확인하세요",
  description: "평수뿐 아니라 창틀·베란다·붙박이장 등 포함 범위를 확인하고 전문 상담을 받아보세요.",
  buttonLabel: "이사청소 전문 상담",
  url: linkUrl("move-cleaning"),
};

const interiorGuide: MovingService = {
  eyebrow: "HOME INTERIOR",
  title: "구매와 시공 전에 우리 집에 맞는 사례를 비교하세요",
  description: "다양한 공간 사례와 유익한 정보를 살펴보고, 가구 구매나 시공 상담 전에 원하는 분위기와 예산을 구체화해 보세요.",
  buttonLabel: "인테리어 사례·견적 확인",
  url: linkUrl("repair-interior"),
};

/** 수리·설치 CTA는 글의 토픽에 맞는 견적 딥링크로 연결한다. */
function repairQuotes(topicId?: string): MovingService {
  const quote = repairQuoteLink(topicId);
  const subject = quote.label.replace(/^숨고 /u, "");
  return {
    eyebrow: "REPAIR · INSTALL",
    title: "수리 범위와 교체 범위를 같은 조건으로 비교하세요",
    description: "손상 부위와 전체 사진을 준비하고 자재, 철거·폐기와 마감 범위를 나눠 견적을 확인해 보세요.",
    buttonLabel: `${subject} 견적 비교`,
    url: quote.url,
  };
}

const studioMove: MovingService = {
  eyebrow: "STUDIO MOVE",
  title: "원룸·용달은 짐의 양보다 작업 방식으로 비교하세요",
  description: "차량만 부를지, 포장과 정리까지 맡길지에 따라 금액이 달라집니다. 계단·주차 조건을 함께 전달하세요.",
  buttonLabel: "원룸·용달 이사 견적 비교",
  url: linkUrl("move-cpa-isabang-oneroom"),
};

const tvMountInstall: MovingService = {
  eyebrow: "TV MOUNT",
  title: "벽걸이TV는 벽체 종류부터 확인하세요",
  description: "TV 모델과 브래킷, 설치할 벽면 사진을 준비하면 타공 가능 여부와 무타공 대안을 함께 확인할 수 있습니다.",
  buttonLabel: "벽걸이TV 설치·철거 견적 비교",
  url: linkUrl("repair-soomgo-tv-mount"),
};

const airconTvInstall: MovingService = {
  eyebrow: "AIRCON · TV",
  title: "에어컨·벽걸이TV는 운반과 설치를 나눠 확인하세요",
  description: "제품 모델명, 기존 배관 길이와 새집 설치 위치 사진을 준비하면 추가 배관·타공 비용을 미리 가늠할 수 있습니다.",
  buttonLabel: "에어컨 설치·수리 견적 비교",
  url: linkUrl("repair-soomgo-aircon"),
};

const washerInstall: MovingService = {
  eyebrow: "APPLIANCE",
  title: "세탁기·건조기는 급배수와 설치 공간을 먼저 재세요",
  description: "제품 규격, 수전 위치, 배수 방식과 문 열림 방향을 확인한 뒤 설치 범위를 견적서에 적으세요.",
  buttonLabel: "세탁기 설치·수리 견적 비교",
  url: linkUrl("repair-soomgo-washer"),
};

// ── 숨고(링크프라이스) 전문가 견적 — 요율 최대 44.1%, 집수리 콘텐츠 주력 ──
const doorRepair: MovingService = {
  eyebrow: "DOOR REPAIR",
  title: "문 상태를 사진으로 보내고 수리 견적을 받으세요",
  description: "타공·처짐·경첩 손상은 부분 수리로 끝나는 경우가 많습니다. 손상 부위와 문 전체 사진을 준비해 수리와 교체를 같은 조건으로 비교해 보세요.",
  buttonLabel: "문 수리 전문가 견적 받기",
  url: linkUrl("repair-soomgo-door-repair"),
};

const doorInstall: MovingService = {
  eyebrow: "DOOR INSTALL",
  title: "도어 교체는 규격과 마감 범위를 먼저 확인하세요",
  description: "문틀 재사용 여부, 철거·폐기 포함 여부에 따라 금액이 크게 달라집니다. 실측 후 견적을 비교하세요.",
  buttonLabel: "도어 시공 견적 비교",
  url: linkUrl("repair-soomgo-door-build"),
};

const middleDoor: MovingService = {
  eyebrow: "MIDDLE DOOR",
  title: "중문은 현관 폭과 개폐 방식부터 정하세요",
  description: "슬라이딩·스윙·폴딩에 따라 시공 난이도와 비용이 달라집니다. 현관 사진과 실측값으로 상담해 보세요.",
  buttonLabel: "중문 시공 견적 받기",
  url: linkUrl("repair-soomgo-middle-door"),
};

const glassWork: MovingService = {
  eyebrow: "GLASS & MIRROR",
  title: "유리·거울은 맞춤 제작 견적이 정확합니다",
  description: "두께, 강화 여부, 타공과 설치 위치에 따라 단가가 달라집니다. 치수와 설치 위치 사진을 준비하세요.",
  buttonLabel: "유리·거울 제작 견적",
  url: linkUrl("repair-soomgo-glass"),
};

const plumbingWork: MovingService = {
  eyebrow: "PLUMBING",
  title: "수전·배관 교체는 기존 규격 확인이 먼저입니다",
  description: "제품 구입 전에 배관 간격과 벽 타입을 확인하세요. 설치까지 함께 맡기면 재작업이 줄어듭니다.",
  buttonLabel: "수도·수전 설치 견적",
  url: linkUrl("repair-soomgo-plumbing"),
};

const leakWork: MovingService = {
  eyebrow: "LEAK DETECTION",
  title: "누수는 원인 탐지와 보수 공사를 나눠 보세요",
  description: "천장·바닥 누수는 탐지 비용과 공사 비용이 별도인 경우가 많습니다. 책임 소재까지 문서로 남기세요.",
  buttonLabel: "누수 탐지 견적 받기",
  url: linkUrl("repair-soomgo-leak"),
};

const sashWork: MovingService = {
  eyebrow: "WINDOW & SASH",
  title: "창호는 단열 등급과 철거 범위를 함께 비교하세요",
  description: "샷시 교체는 철거·폐기·마감이 금액을 좌우합니다. 창 크기와 층수를 알려주고 견적을 받아보세요.",
  buttonLabel: "창호·샷시 견적 비교",
  url: linkUrl("repair-soomgo-sash"),
};

const applianceInstall: MovingService = {
  eyebrow: "APPLIANCE",
  title: "세탁기·건조기 설치는 운반과 설치를 나눠 확인하세요",
  description: "이사업체 운반 범위와 전문 설치 범위가 다릅니다. 제품 모델과 설치 위치 사진을 준비하세요.",
  buttonLabel: "설치 전문가 견적 받기",
  url: linkUrl("repair-soomgo-washer"),
};

export const serviceByArticle: Partial<Record<string, MovingService>> = {
  "moving-preparation-checklist": twoQuoteComparison,
  "moving-company-quote-comparison": twoQuoteComparison,
  "packing-moving-cost-factors": packingSpecialist,
  "moving-day-checklist": twoQuoteComparison,
  "moving-cleaning-guide": cleaningSpecialist,
  "rental-deposit-moving-out-checklist": twoQuoteComparison,
  "easy-interior-ideas-for-beginners": interiorGuide,
  "son-eomneun-nal-moving-guide": twoQuoteComparison,
  "interior-door-hole-repair-guide": repairQuotes("door-hole"),
  "interior-door-replacement-cost-guide": repairQuotes("interior-door"),
  "fire-door-repair-replacement-guide": repairQuotes("fire-door"),
  "door-handle-hinge-sagging-repair": repairQuotes("door-hardware"),
  "sliding-middle-door-repair-installation": repairQuotes("sliding-middle-door"),
  "entrance-steel-gate-repair-cost": repairQuotes("entrance-steel-gate"),
  "commercial-glass-automatic-door-repair-cost": repairQuotes("automatic-glass-door"),
  "custom-door-installation-construction-guide": repairQuotes("custom-door-install"),
  "kitchen-sink-faucet-replacement-guide": repairQuotes("sink-faucet"),
  "bathroom-toilet-shower-renovation-guide": repairQuotes("bathroom-fixture"),
  "window-sash-folding-door-repair-guide": repairQuotes("sash-folding-door"),
  "custom-mirror-glass-installation-guide": repairQuotes("custom-glass-mirror"),
  "home-repair-plumbing-estimate-guide": repairQuotes("home-repair-plumbing"),
  "washer-dryer-moving-installation-cost": washerInstall,
  "air-conditioner-moving-installation-cost": airconTvInstall,
  "wall-mounted-tv-moving-installation-cost": tvMountInstall,
  "no-drill-wall-mounted-tv-installation": tvMountInstall,
  "studio-moving-service-comparison": studioMove,
  "moving-ladder-truck-cost-guide": twoQuoteComparison,
  "elevator-moving-cost-conditions": twoQuoteComparison,
};

export function getMovingService(slug: string): MovingService | undefined {
  const direct = serviceByArticle[slug];
  if (direct) return direct;
  // repair-keyword-001-door-hole / regional-repair-001-door-hole → "door-hole"
  const topicId = topicIdFromSlug(slug);
  return topicId ? repairQuotes(topicId) : undefined;
}
