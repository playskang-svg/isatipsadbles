import type { Article, Section } from "./articles";
import {
  incheonRepairDistricts,
  incheonRepairRegionTree,
  INCHEON_REPAIR_CITY_SLUG,
  INCHEON_REPAIR_CITY_SOURCE,
  type IncheonRepairDistrict,
} from "./incheon-repair-keyword-tree";
import { linkUrl } from "./affiliate";

const INTERIOR_URL = linkUrl("repair-interior");
const PUBLISHED_AT = "2026-09-24T00:00:00.000Z";
const UPDATED_AT = "2026-09-24T00:00:00.000Z";
const accents = ["mint", "amber", "blue", "violet", "rose", "green"];

const HERO = {
  src: "/images/repair-install/home-repair-inspection.webp",
  alt: "문, 씽크대, 샷시 등 설치·수리 현장을 점검하는 작업자",
  title: "설치·수리 현장 점검",
};

const CHECKLIST_APARTMENT = ["관리사무소 작업 가능 시간", "승강기 예약 여부", "실외기실·발코니 구조", "대형 자재 반입 치수", "전동·배선 콘센트 위치"];
const CHECKLIST_MIXED = ["배관·전기 배선 노후 상태", "벽·바닥·창틀 재질", "전월세 원상복구 조건", "방문 실측 필요 여부", "골목 폭과 차량 정차 위치"];

const GUIDE_GROUPS: { heading: string; items: { label: string; slug: string }[] }[] = [
  {
    heading: "문·중문·방화문",
    items: [
      { label: "실내문 교체 비용", slug: "interior-door-replacement-cost-guide" },
      { label: "중문 설치·수리", slug: "sliding-middle-door-repair-installation" },
      { label: "방화문 수리·교체", slug: "fire-door-repair-replacement-guide" },
    ],
  },
  {
    heading: "씽크대·욕실 설비",
    items: [
      { label: "씽크대 수전 교체", slug: "kitchen-sink-faucet-replacement-guide" },
      { label: "욕실·양변기·샤워 시공", slug: "bathroom-toilet-shower-renovation-guide" },
      { label: "누수·배관 수리 견적", slug: "home-repair-plumbing-estimate-guide" },
    ],
  },
  {
    heading: "샷시·유리",
    items: [
      { label: "샷시·폴딩도어 수리", slug: "window-sash-folding-door-repair-guide" },
      { label: "맞춤 거울·유리 설치", slug: "custom-mirror-glass-installation-guide" },
      { label: "상가 자동문·유리문 수리", slug: "commercial-glass-automatic-door-repair-cost" },
    ],
  },
  {
    heading: "에어컨·벽걸이TV·커튼",
    items: [
      { label: "에어컨 이전 설치 비용", slug: "air-conditioner-moving-installation-cost" },
      { label: "벽걸이TV 설치", slug: "wall-mounted-tv-moving-installation-cost" },
      { label: "커튼·블라인드 맞춤 설치", slug: "curtain-blind-installation-cost" },
    ],
  },
];

function makeSections(areaLabel: string, localNote: string, housingType: "apartment" | "mixed", level: "city" | "district"): Section[] {
  const checklist = housingType === "apartment" ? CHECKLIST_APARTMENT : CHECKLIST_MIXED;
  const sections: Section[] = [
    {
      heading: `${areaLabel} 설치·수리, 건물 조건부터 확인하세요`,
      paragraphs: [
        localNote,
        "같은 이름의 작업이라도 건물 연식, 벽·배관 재질과 자재 반입 동선에 따라 공정과 비용이 달라집니다. 상담 전 이 조건을 먼저 정리해 두면 업체별 견적을 같은 기준으로 비교할 수 있습니다.",
      ],
      checklist,
    },
    {
      heading: "자주 찾는 설치·수리 항목",
      paragraphs: GUIDE_GROUPS.map(
        (group) => `${group.heading} — ${group.items.map((item) => `[${item.label}](/articles/${item.slug})`).join(", ")}`,
      ),
    },
    {
      heading: "사진 견적에 넣을 항목",
      paragraphs: [
        "전체 사진과 가까운 사진, 가로·세로·두께 또는 모델명, 작동 문제를 보여주는 영상, 주차·승강기·계단 조건을 같은 양식으로 여러 업체에 보내야 추가금 차이를 줄일 수 있습니다.",
        `구체적인 시공 사례와 예산을 먼저 살펴보고 싶다면 [인테리어 사례·견적 확인](${INTERIOR_URL})에서 원하는 범위를 구체화해 볼 수 있습니다.`,
      ],
      checklist: ["전체 사진과 가까운 사진", "가로·세로·두께 또는 모델명", "작동 문제를 보여주는 영상", "주차·승강기·계단", "기본 작업과 추가 가능 항목", "작업 후 보수 범위"],
    },
    {
      heading: "업체 선택과 작업 전후 기록",
      paragraphs: [
        `${areaLabel} 검색 결과의 상호나 광고 문구만 보지 말고 진단 이유, 항목별 견적, 비슷한 작업의 범위와 사후보수 접수 방법을 확인하세요. 업체가 실제 방문 가능한 지역인지도 계약 전에 확인해야 합니다.`,
        "작업 전 상태와 주변 마감을 촬영하고 견적서, 결제 내역, 일정 변경과 추가 작업 승인 내용을 보관하세요. 현장에서 범위가 달라지면 시작 전에 이유와 금액을 문서나 메시지로 남기는 편이 좋습니다.",
      ],
    },
  ];

  if (level === "district") {
    sections.push({
      heading: "인천시 다른 지역 정보도 확인하세요",
      paragraphs: [`생활권이 가까워도 건물 연식과 관리 규정에 따라 조건은 달라질 수 있습니다. [인천시 전체 지역별 설치·수리 정보](/articles/${INCHEON_REPAIR_CITY_SLUG})에서 인접 지역의 확인 사항을 이어서 볼 수 있습니다.`],
    });
  }

  return sections;
}

function makeFaq(areaLabel: string) {
  return [
    { question: `${areaLabel}에서 설치·수리 견적은 어떻게 비교하나요?`, answer: "작업 대상의 전체·상세 사진, 치수나 모델명, 건물 조건(승강기·주차·골목)을 모든 업체에 동일하게 전달하면 기본 작업과 추가 항목을 비교하기 쉽습니다." },
    { question: "사진만으로 정확한 견적을 받을 수 있나요?", answer: "사진은 범위를 좁히는 데 도움이 되지만 내부 배관, 벽 재질과 반입 동선은 현장에서 달라질 수 있습니다. 확정 견적의 조건과 추가 작업 기준을 먼저 확인하세요." },
    { question: "전월세인데 시공하면 원상복구 걱정은 없나요?", answer: "무타공·부분 시공도 흔적이 남을 수 있어 원상복구 의무가 자동으로 없어지지 않습니다. 임대차계약의 시설 변경 조항을 먼저 확인하고 임대인과 협의하세요." },
  ];
}

function makeArticle(input: {
  slug: string;
  areaLabel: string;
  localNote: string;
  index: number;
  level: "city" | "district";
  housingType: "apartment" | "mixed";
}): Article {
  const title = input.level === "city"
    ? "인천시 설치·수리 비용 총정리｜11개 군·구 지역별 확인 사항"
    : `인천시 ${input.areaLabel} 설치·수리 비용｜문·씽크대·에어컨 확인 사항`;

  return {
    slug: input.slug,
    title,
    description: `${input.areaLabel}에서 문·중문·씽크대·욕실·샷시·에어컨 설치와 수리를 준비할 때 건물 조건, 사진 견적과 업체 선택 확인사항을 정리했습니다.`,
    category: "regional",
    categoryLabel: "지역별 정보",
    keyword: `${input.areaLabel} 설치 수리`,
    secondaryKeywords: [`${input.areaLabel} 집수리`, `${input.areaLabel} 문수리`, `${input.areaLabel} 에어컨 설치`, `${input.areaLabel} 씽크대 교체`],
    readingTime: input.level === "city" ? 8 : 7,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    accent: accents[input.index % accents.length],
    affiliateNotice: true,
    heroImage: HERO,
    breadcrumbs: input.level === "city"
      ? [{ name: "지역별 정보", href: "/category/regional" }]
      : [
          { name: "지역별 정보", href: "/category/regional" },
          { name: "인천시 설치·수리", href: `/articles/${INCHEON_REPAIR_CITY_SLUG}` },
        ],
    intro: `${input.areaLabel}에서 문, 중문, 씽크대·욕실 설비, 샷시, 에어컨 같은 설치·수리를 준비하시나요? 같은 이름의 작업이라도 건물 연식과 반입 조건에 따라 비용이 달라지므로, 지역 조건과 항목별 확인사항을 함께 정리했습니다.`,
    sections: makeSections(input.areaLabel, input.localNote, input.housingType, input.level),
    faq: makeFaq(input.areaLabel),
    source: INCHEON_REPAIR_CITY_SOURCE,
    regionTree: incheonRepairRegionTree,
  };
}

const cityArticle = makeArticle({
  slug: INCHEON_REPAIR_CITY_SLUG,
  areaLabel: "인천시",
  localNote:
    "인천시는 원도심의 노후 단독·다세대부터 송도·청라·검단 같은 신축 대단지, 영종·옹진의 섬 지역까지 주거 형태가 다양해 지역과 건물 연식에 따라 설치·수리 조건이 크게 달라집니다. 군·구를 먼저 고르면 더 가까운 지역 정보를 확인할 수 있습니다.",
  index: 0,
  level: "city",
  housingType: "apartment",
});

const districtArticles = incheonRepairDistricts.map((district: IncheonRepairDistrict, index: number) =>
  makeArticle({
    slug: district.slug,
    areaLabel: district.name,
    localNote: district.localNote,
    index: index + 1,
    level: "district",
    housingType: district.housingType,
  }),
);

export const incheonRepairArticles: Article[] = [cityArticle, ...districtArticles];

if (incheonRepairArticles.length !== 12 || new Set(incheonRepairArticles.map((article) => article.slug)).size !== 12) {
  throw new Error("인천시 설치·수리 지역별 콘텐츠는 시 1개, 군·구 11개로 구성되어야 합니다.");
}
