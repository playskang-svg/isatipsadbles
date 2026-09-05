import type { Article } from "./articles";
import { repairKeywordArticles, repairTargetKeywords, regionOf } from "./repair-keyword-pages";
import { gyeonggiCityProfiles, gyeonggiRegionTree } from "./regional-articles";
import { repairQuoteLink, repairSupplyLink, topicIdFromSlug } from "./affiliate-match";

const PUBLISHED_AT = "2026-09-03T00:00:00.000Z";
const UPDATED_AT = "2026-09-03T00:00:00.000Z";

type Destination = {
  city: string;
  cityLabel: string;
  cityHref: string;
  locality: string;
  localityHref?: string;
  siblings: { name: string; href?: string }[];
};

type PlannedRegionalArticle = {
  sourceIndex: number;
  sourceKeyword: string;
  targetKeyword: string;
  destination: Destination;
  sourceArticle: Article;
};

export type RepairRegionalIndexItem = {
  sourceKeyword: string;
  keyword: string;
  region: string;
  locality?: string;
  href: string;
  title: string;
};

function cityLabel(city: string) {
  return city.replace(/(시|군)$/u, "");
}

const destinationPool: Destination[] = gyeonggiRegionTree.districts
  .filter((district) => district.dongs.some((dong) => dong.href))
  .flatMap((district) => {
    const linkedDongs = district.dongs.filter((dong) => dong.href);
    return linkedDongs.map((dong) => ({
      city: district.name,
      cityLabel: cityLabel(district.name),
      cityHref: district.href,
      locality: dong.name,
      localityHref: dong.href,
      siblings: linkedDongs.map((item) => ({ name: item.name, href: item.href })),
    }));
  });

if (destinationPool.length === 0) throw new Error("수리·설치 지역 페이지에 배정할 공개 지역이 없습니다.");

function stableHash(value: string) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function comparableKeyword(value: string) {
  return value.replace(/\s+/gu, "").toLowerCase();
}

const originalKeywords = new Set(repairTargetKeywords.map(comparableKeyword));

function chooseDestination(keyword: string, index: number) {
  const start = (stableHash(keyword) + index * 17) % destinationPool.length;
  for (let step = 0; step < destinationPool.length; step += 1) {
    const destination = destinationPool[(start + step * 7) % destinationPool.length];
    const targetKeyword = `${destination.cityLabel}${keyword}`;
    if (!originalKeywords.has(comparableKeyword(targetKeyword))) return { destination, targetKeyword };
  }
  const destination = destinationPool[start];
  return { destination, targetKeyword: `${destination.cityLabel} ${destination.locality} ${keyword}` };
}

function intentLabel(keyword: string) {
  if (/비용|가격|견적/u.test(keyword)) return "견적";
  if (/설치|시공|공사|제작|만들기/u.test(keyword)) return "설치";
  if (/교체/u.test(keyword)) return "교체";
  if (/업체|박사|공장/u.test(keyword)) return "업체 선택";
  return "수리";
}

const plannedRegionalArticles: PlannedRegionalArticle[] = repairTargetKeywords.flatMap((keyword, index) => {
  if (regionOf(keyword)) return [];
  const selected = chooseDestination(keyword, index);
  return [{
    sourceIndex: index,
    sourceKeyword: keyword,
    targetKeyword: selected.targetKeyword,
    destination: selected.destination,
    sourceArticle: repairKeywordArticles[index],
  }];
});

function regionalSlug(plan: PlannedRegionalArticle) {
  const sourceSuffix = plan.sourceArticle.slug.replace(/^repair-keyword-\d+-/u, "");
  return `regional-repair-${String(plan.sourceIndex + 1).padStart(3, "0")}-${sourceSuffix}`;
}

function makeRegionalArticle(plan: PlannedRegionalArticle): Article {
  const { destination, sourceArticle, sourceKeyword, targetKeyword } = plan;
  const profile = gyeonggiCityProfiles[destination.city] ?? [
    `${destination.city} 안에서도 주거 형태와 건물 진입 조건은 현장마다 다릅니다.`,
    "주차 위치, 계단과 승강기, 자재 반입 동선을 사진으로 확인해야 작업 범위를 비교하기 쉽습니다.",
  ];
  const intent = intentLabel(sourceKeyword);
  const topicId = topicIdFromSlug(sourceArticle.slug);
  const quote = repairQuoteLink(topicId);
  const supply = repairSupplyLink(topicId, sourceKeyword);
  const localLinks = [
    { name: destination.locality, href: destination.localityHref },
    ...destination.siblings.filter((item) => item.name !== destination.locality).slice(0, 5),
  ];

  return {
    slug: regionalSlug(plan),
    title: `${targetKeyword}, ${destination.locality} ${intent} 전 확인사항`,
    description: `${destination.city} ${destination.locality}에서 ${sourceKeyword} 상담을 준비할 때 확인할 손상 범위, 건물 동선, 사진 견적과 완료 검수 항목을 정리했습니다.`,
    category: "regional",
    categoryLabel: "지역별 정보",
    keyword: targetKeyword,
    secondaryKeywords: [`${destination.locality} ${sourceKeyword}`, `${destination.city} ${sourceKeyword}`, `${targetKeyword} 견적`, `${targetKeyword} 업체`],
    readingTime: 7,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    accent: sourceArticle.accent,
    affiliateNotice: true,
    heroImage: sourceArticle.heroImage,
    breadcrumbs: [
      { name: "지역별 정보", href: "/category/regional" },
      { name: destination.city, href: destination.cityHref },
      { name: sourceKeyword, href: `/articles/${sourceArticle.slug}` },
    ],
    regionTree: {
      title: `${destination.city} ${sourceKeyword} 지역 연결 정보`,
      description: `${destination.locality}의 현장 조건을 확인한 뒤 ${destination.city}의 공개 지역 정보와 기본 ${sourceKeyword} 가이드를 함께 살펴보세요.`,
      districts: [{ name: destination.city, href: destination.cityHref, dongs: localLinks }],
    },
    intro: `${targetKeyword}을 알아볼 때는 지역 평균가격보다 실제 손상과 건물 조건을 먼저 확인해야 합니다. ${destination.locality}의 주차·승강기·계단과 작업시간을 사진으로 보여주고, ${sourceKeyword}의 수리·교체 범위를 같은 조건으로 비교하세요.`,
    sections: [
      {
        heading: `${destination.locality}에서 먼저 확인할 작업 조건`,
        paragraphs: [
          profile[0],
          `${profile[1]} ${destination.locality}이라는 지역명만으로 서비스 가능 여부나 출장 조건을 단정할 수 없으므로 상담할 업체마다 직접 확인하세요.`,
        ],
        checklist: ["건물 전면과 주차 위치", "현관·복도·계단 폭", "승강기 사용 가능 시간", "자재와 철거물 운반 동선", "작업 가능한 날짜와 시간"],
      },
      {
        heading: `${targetKeyword} 증상과 손상 범위를 구분하세요`,
        paragraphs: [
          sourceArticle.intro,
          `전체 모습, 손상 부위, 작동 영상과 치수를 함께 보내세요. ${destination.locality} 현장에서도 같은 이름의 작업이라도 자재와 파손 범위에 따라 부분 수리와 전체 교체 판단이 달라질 수 있습니다.`,
          ...(supply
            ? [`부속 교체로 끝날 수 있는 상태라면 규격을 먼저 확인하고 [${supply.label.replace(/^오늘의집 /u, "")} 제품 종류](${supply.url})를 비교해 보세요. 고정부나 바탕이 손상됐다면 자재만 바꿔도 같은 증상이 다시 나타날 수 있습니다.`]
            : []),
        ],
      },
      {
        heading: "일반 수리 기준과 지역 현장 조건을 함께 비교하세요",
        paragraphs: [
          `[${sourceKeyword} 기본 점검 가이드](/articles/${sourceArticle.slug})에서 수리·교체 기준과 완료 검수 항목을 먼저 확인하세요. 이 지역 페이지에서는 ${destination.city}의 주차, 운반과 작업시간 조건을 추가로 적용하면 됩니다.`,
          `기본 가이드와 지역 페이지의 역할을 나누면 같은 문장을 반복해서 읽지 않고도 ${sourceKeyword} 자체의 판단 기준과 ${destination.locality} 현장 변수를 차례로 확인할 수 있습니다.`,
        ],
      },
      {
        heading: `${destination.city} 사진 견적에 넣을 항목`,
        paragraphs: [
          "사진 견적에는 작업 대상의 전체 크기, 손상 부위, 제품 표시나 부속 규격, 바닥과 벽 상태를 넣으세요. 차량이 설 수 있는 위치부터 작업 장소까지의 이동 거리도 보여주면 현장 추가 항목을 줄이는 데 도움이 됩니다.",
          `서비스 가능 범위와 기본·추가 작업을 확인하려면 같은 사진과 조건으로 [${quote.label.replace(/^숨고 /u, "")} 견적을 받아](${quote.url}) 비교해 보세요. 자재, 철거, 폐기, 주변 마감과 부가세 포함 여부를 항목별로 적어야 합니다.`,
        ],
        checklist: ["전체 사진과 가까운 사진", "가로·세로·두께 또는 모델명", "작동 문제를 보여주는 영상", "주차·승강기·계단", "기본 작업과 추가 가능 항목", "작업 후 보수 범위"],
      },
      {
        heading: "업체 선택과 작업 전 기록",
        paragraphs: [
          `${targetKeyword} 검색 결과의 상호나 광고 문구만 보지 말고 진단 이유, 항목별 견적, 비슷한 작업의 범위와 사후보수 접수 방법을 확인하세요. 업체가 ${destination.locality}까지 실제 방문 가능한지도 계약 전에 확인해야 합니다.`,
          "작업 전 상태와 주변 마감을 촬영하고 견적서, 결제 상대, 일정 변경과 추가 작업 승인 내용을 보관하세요. 현장에서 범위가 달라지면 시작 전에 이유와 금액을 문서나 메시지로 남기는 편이 좋습니다.",
        ],
      },
      {
        heading: "완료 직후 확인할 항목",
        paragraphs: [
          "처음 문제가 나타났던 동작을 여러 번 반복해 보고 여닫힘, 잠금, 흔들림, 누수, 소음과 주변 마감을 확인하세요. 교체한 자재나 부품이 견적서 내용과 같은지도 살펴봅니다.",
          `작업 전후 사진과 영수증을 함께 보관하세요. ${destination.city}나 ${destination.locality}이라는 이유만으로 정해진 고정가격은 없으며 실제 자재, 손상과 현장 접근 조건에 따라 견적이 달라질 수 있습니다.`,
        ],
      },
    ],
    faq: [
      { question: `${targetKeyword}은 사진만으로 견적을 확정할 수 있나요?`, answer: "사진은 범위를 좁히는 데 도움이 되지만 내부 손상과 설치 바탕, 운반 동선은 현장에서 달라질 수 있습니다. 확정 견적의 조건과 추가 작업 기준을 확인하세요." },
      { question: `${destination.locality}이면 출장비가 정해져 있나요?`, answer: "지역명만으로 정해지지 않습니다. 업체의 서비스 범위, 이동거리, 주차와 운반 조건에 따라 달라질 수 있으므로 상담할 때 포함 여부를 확인하세요." },
      { question: `${sourceKeyword}은 수리와 교체 중 무엇이 나은가요?`, answer: "손상 범위, 고정부와 바탕 상태, 예상 사용기간, 마감 차이와 재발 가능성을 함께 비교해야 합니다. 부분 수리와 전체 교체의 포함 항목을 같은 기준으로 받아보세요." },
      { question: "지역 업체를 비교할 때 무엇을 준비해야 하나요?", answer: "전체·상세 사진, 치수, 작동 영상, 건물 전면과 주차·승강기·계단 정보, 원하는 작업 범위를 같은 양식으로 보내세요." },
    ],
    source: sourceArticle.source,
  };
}

export const repairRegionalArticles: Article[] = plannedRegionalArticles.map(makeRegionalArticle);

const generatedBySourceIndex = new Map(plannedRegionalArticles.map((plan, index) => [plan.sourceIndex, repairRegionalArticles[index]]));

export const repairKeywordArticlesWithRegionalLinks: Article[] = repairKeywordArticles.map((article, index) => {
  const plan = plannedRegionalArticles.find((item) => item.sourceIndex === index);
  const regionalArticle = generatedBySourceIndex.get(index);
  if (!plan || !regionalArticle) return article;

  const localLinks = [
    { name: `${plan.destination.locality} ${plan.sourceKeyword}`, href: `/articles/${regionalArticle.slug}` },
    ...plan.destination.siblings.filter((item) => item.name !== plan.destination.locality).slice(0, 5),
  ];

  return {
    ...article,
    regionTree: {
      title: `${plan.destination.city} ${plan.sourceKeyword} 지역별 정보`,
      description: `${plan.sourceKeyword} 기본 판단을 확인한 뒤 연결된 ${plan.destination.locality} 지역 페이지와 주변 공개 지역 정보를 이어서 살펴보세요.`,
      districts: [{ name: plan.destination.city, href: plan.destination.cityHref, dongs: localLinks }],
    },
  };
});

export const repairRegionalIndex: RepairRegionalIndexItem[] = repairTargetKeywords.map((sourceKeyword, index) => {
  const explicitRegion = regionOf(sourceKeyword);
  if (explicitRegion) {
    const sourceArticle = repairKeywordArticles[index];
    return {
      sourceKeyword,
      keyword: sourceKeyword,
      region: explicitRegion,
      href: `/articles/${sourceArticle.slug}`,
      title: sourceArticle.title,
    };
  }

  const article = generatedBySourceIndex.get(index);
  const plan = plannedRegionalArticles.find((item) => item.sourceIndex === index);
  if (!article || !plan) throw new Error(`${sourceKeyword} 지역 페이지가 생성되지 않았습니다.`);
  return {
    sourceKeyword,
    keyword: article.keyword,
    region: plan.destination.city,
    locality: plan.destination.locality,
    href: `/articles/${article.slug}`,
    title: article.title,
  };
});

if (repairRegionalIndex.length !== repairTargetKeywords.length) throw new Error("수리·설치 지역 연결 수가 타깃 키워드 수와 다릅니다.");
if (new Set(repairRegionalIndex.map((item) => item.href)).size !== repairRegionalIndex.length) throw new Error("중복된 수리·설치 지역 연결 URL이 있습니다.");
if (new Set(repairRegionalArticles.map((article) => article.slug)).size !== repairRegionalArticles.length) throw new Error("중복된 신규 지역 수리·설치 URL이 있습니다.");
