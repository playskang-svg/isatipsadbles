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
  url: "https://Ocayn.info/t8gy97bt69",
};

const packingSpecialist: MovingService = {
  eyebrow: "PACKING MOVE",
  title: "포장이사 전문 상담이 필요하다면",
  description: "짐의 양, 이동 거리와 건물 조건을 알려주고 내 상황에 맞는 포장이사 범위를 확인해 보세요.",
  buttonLabel: "포장이사 전문 상담",
  url: "https://Ocayn.info/t7rujwdigl",
};

const cleaningSpecialist: MovingService = {
  eyebrow: "MOVE-IN CLEANING",
  title: "이사청소 범위와 일정을 먼저 확인하세요",
  description: "평수뿐 아니라 창틀·베란다·붙박이장 등 포함 범위를 확인하고 전문 상담을 받아보세요.",
  buttonLabel: "이사청소 전문 상담",
  url: "https://Ocayn.info/t8g28gdow0",
};

const interiorGuide: MovingService = {
  eyebrow: "HOME INTERIOR",
  title: "구매와 시공 전에 우리 집에 맞는 사례를 비교하세요",
  description: "다양한 공간 사례와 유익한 정보를 살펴보고, 가구 구매나 시공 상담 전에 원하는 분위기와 예산을 구체화해 보세요.",
  buttonLabel: "인테리어 사례·견적 확인",
  url: "https://Ocayn.info/t8gcget9ab",
};

const repairInstallationQuotes: MovingService = {
  eyebrow: "REPAIR · INSTALL",
  title: "수리 범위와 교체 범위를 같은 조건으로 비교하세요",
  description: "손상 부위와 전체 사진을 준비하고 자재, 철거·폐기와 마감 범위를 나눠 견적을 확인해 보세요.",
  buttonLabel: "설치·수리 견적 비교",
  url: "http://app.ac/jjw6cka73",
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
  "interior-door-hole-repair-guide": repairInstallationQuotes,
  "interior-door-replacement-cost-guide": repairInstallationQuotes,
  "fire-door-repair-replacement-guide": repairInstallationQuotes,
  "door-handle-hinge-sagging-repair": repairInstallationQuotes,
  "sliding-middle-door-repair-installation": repairInstallationQuotes,
  "entrance-steel-gate-repair-cost": repairInstallationQuotes,
  "commercial-glass-automatic-door-repair-cost": repairInstallationQuotes,
  "custom-door-installation-construction-guide": repairInstallationQuotes,
  "kitchen-sink-faucet-replacement-guide": repairInstallationQuotes,
  "bathroom-toilet-shower-renovation-guide": repairInstallationQuotes,
  "window-sash-folding-door-repair-guide": repairInstallationQuotes,
  "custom-mirror-glass-installation-guide": repairInstallationQuotes,
  "home-repair-plumbing-estimate-guide": repairInstallationQuotes,
};

export function getMovingService(slug: string) {
  return serviceByArticle[slug] ?? (slug.startsWith("repair-keyword-") ? repairInstallationQuotes : undefined);
}
