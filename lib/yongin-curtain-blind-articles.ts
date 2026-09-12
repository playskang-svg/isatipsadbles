import type { Article, Section } from "./articles";
import { yonginDistricts, yonginRegionTree, YONGIN_CITY_SLUG, YONGIN_CITY_SOURCE, type YonginDistrict, type YonginDong } from "./yongin-keyword-tree";
import { linkUrl } from "./affiliate";

const INTERIOR_URL = linkUrl("repair-interior");
const LAW_SOURCE_URL = "https://www.easylaw.go.kr/CSP/CnpClsMain.laf?csmSeq=629&ccfNo=4&cciNo=2&cnpClsNo=1";
const MASTER_GUIDE_URL = "/articles/curtain-blind-installation-cost";
const PUBLISHED_AT = "2026-09-12T09:00:00.000Z";
const UPDATED_AT = "2026-09-12T09:00:00.000Z";
const accents = ["mint", "amber", "blue", "violet", "rose", "green"];

const CHECKLIST_APARTMENT = ["관리사무소 작업 가능 시간", "승강기 예약 여부", "발코니 확장 여부(창 크기 영향)", "타공 가능 여부(임대차 계약 확인)", "전동·레일 콘센트 위치"];
const CHECKLIST_LOWRISE = ["내측/외측 실측 기준", "벽·창틀 재질(시멘트·목재 등)", "무타공 제품 고정력 사전 확인", "전월세 여부와 원상복구 조건", "방문 실측 필요 여부"];

function makeSections(areaLabel: string, localNote: string, housingType: "apartment" | "lowrise", district?: { name: string; slug: string }): Section[] {
  const checklist = housingType === "apartment" ? CHECKLIST_APARTMENT : CHECKLIST_LOWRISE;
  const sections: Section[] = [
    {
      heading: `${areaLabel} 커튼·블라인드 설치, 지역 조건부터 확인하세요`,
      paragraphs: [
        localNote,
        "같은 창 크기라도 실측 방식(내측·외측), 제품 유형(롤스크린·블라인드·커튼), 타공 가능 여부, 전동·레일 기능에 따라 비용이 달라집니다. 업체에 문의할 때 이 네 가지를 먼저 정리해 전달하면 견적을 비교하기 쉽습니다.",
      ],
      checklist,
    },
    {
      heading: "무타공과 전월세 원상복구, 이것만은 확인하세요",
      paragraphs: [
        "무타공 제품은 압축봉이나 접착 브래킷처럼 벽이 아닌 구조물을 활용하는 경우가 많아 '구멍이 전혀 없다'는 뜻으로만 이해하면 안 됩니다. 접착 부위나 몰딩 주변에 흔적이 남을 수 있고, 임대차계약에 시설 변경을 제한하는 조항이 있다면 그 조항이 먼저 적용됩니다.",
        `원상복구 의무의 법적 근거와 전월세 시공 시 확인할 절차는 [커튼·블라인드 맞춤 설치 비용 총정리](${MASTER_GUIDE_URL})의 실측·타공 확인 항목에서 자세히 다룹니다. 법령 원문은 [찾기쉬운 생활법령정보 — 주택임대차 임차인의 권리·의무](${LAW_SOURCE_URL})에서 확인할 수 있습니다.`,
      ],
    },
    {
      heading: `${areaLabel} 견적, 이렇게 비교하세요`,
      paragraphs: [
        "제품 유형과 실측 치수, 타공 여부와 전동 필요 여부를 모든 업체에 동일하게 전달해야 가격과 포함 범위를 제대로 비교할 수 있습니다. 방문 실측이 무료인지, 계약하지 않으면 별도 비용이 청구되는지도 견적 단계에서 확인하세요.",
        `구매·시공 전에 다양한 공간 사례를 먼저 살펴보고 싶다면 [인테리어 사례·견적 확인](${INTERIOR_URL})에서 원하는 분위기와 예산을 구체화해 볼 수 있습니다.`,
      ],
    },
  ];

  if (district) {
    sections.push({
      heading: `${district.name}의 다른 지역 정보도 확인하세요`,
      paragraphs: [`생활권이 가까워도 단지 연식과 건물 형태에 따라 창호 조건은 달라질 수 있습니다. [${district.name} 전체 지역별 커튼·블라인드 설치 정보](/articles/${district.slug})에서 인접 행정동의 확인 사항을 이어서 볼 수 있습니다.`],
    });
  }

  return sections;
}

function makeFaq(areaLabel: string) {
  return [
    { question: `${areaLabel}에서 커튼·블라인드 견적은 어떻게 비교하나요?`, answer: `창 크기와 제품 유형뿐 아니라 타공 가능 여부와 실측 기준(내측/외측)을 모든 업체에 동일하게 전달하면 비교가 쉽습니다. 자세한 비교 기준은 [커튼·블라인드 맞춤 설치 비용 총정리](${MASTER_GUIDE_URL})에서 확인할 수 있습니다.` },
    { question: "전월세인데 무타공 시공을 하면 원상복구 걱정이 없나요?", answer: `무타공 제품도 접착 부위나 몰딩 주변에 흔적이 남을 수 있어 원상복구 의무가 자동으로 없어지지 않습니다. 시공 전 집주인 동의와 관련 절차는 [커튼·블라인드 맞춤 설치 비용 총정리](${MASTER_GUIDE_URL})에서 확인하세요.` },
  ];
}

function makeArticle(input: {
  slug: string;
  areaLabel: string;
  localNote: string;
  index: number;
  level: "city" | "district" | "dong";
  housingType: "apartment" | "lowrise";
  district?: { name: string; slug: string };
  regionTree?: Article["regionTree"];
  source: { label: string; url: string };
}): Article {
  const title = input.level === "city"
    ? "용인시 커튼·블라인드 맞춤 설치 비용｜수지·기흥·처인구 지역별 정보"
    : input.level === "district"
      ? `용인시 ${input.areaLabel} 커튼·블라인드 설치 비용｜행정동별 확인 사항`
      : `용인시 ${input.district?.name} ${input.areaLabel} 커튼·블라인드 설치 비용｜무타공·실측 확인`;

  return {
    slug: input.slug,
    title,
    description: `${input.areaLabel} 커튼·블라인드 맞춤 설치 비용과 무타공 시공, 전월세 원상복구 확인 사항을 지역 조건에 맞춰 정리했습니다.`,
    category: "regional",
    categoryLabel: "지역별 정보",
    keyword: `${input.areaLabel} 커튼 블라인드 설치`,
    secondaryKeywords: [`${input.areaLabel} 블라인드 설치`, `${input.areaLabel} 커튼 설치 비용`, `${input.areaLabel} 무타공 블라인드`, `${input.areaLabel} 롤스크린 설치`],
    readingTime: input.level === "dong" ? 6 : 7,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    accent: accents[input.index % accents.length],
    affiliateNotice: true,
    intro: `${input.areaLabel}에서 커튼·블라인드 맞춤 설치를 준비하시나요? 창 크기가 같아도 실측 방식, 제품 유형과 타공 여부에 따라 비용이 달라집니다. 전월세라면 원상복구 확인까지 지역 조건에 맞춰 정리했습니다.`,
    sections: makeSections(input.areaLabel, input.localNote, input.housingType, input.district),
    faq: makeFaq(input.areaLabel),
    source: input.source,
    regionTree: input.regionTree,
  };
}

const cityArticle = makeArticle({
  slug: YONGIN_CITY_SLUG,
  areaLabel: "용인시",
  localNote: "용인시는 수지·기흥의 대규모 아파트 신도시와 처인구의 구도심·읍면 전원주택 지역이 함께 있어, 지역과 주거 형태에 따라 커튼·블라인드 실측 기준과 무타공 시공 가능 여부가 크게 달라집니다. 구와 행정동을 먼저 고르면 더 가까운 지역 정보를 확인할 수 있습니다.",
  index: 0,
  level: "city",
  housingType: "apartment",
  regionTree: yonginRegionTree,
  source: YONGIN_CITY_SOURCE,
});

const districtArticles = yonginDistricts.map((district: YonginDistrict, index: number) => makeArticle({
  slug: district.slug,
  areaLabel: district.name,
  localNote: district.localNote,
  index: index + 1,
  level: "district",
  housingType: district.dongs.filter((d) => d.housingType === "apartment").length >= district.dongs.length / 2 ? "apartment" : "lowrise",
  regionTree: {
    title: `용인시 ${district.name} 행정동별 커튼·블라인드 설치 정보`,
    description: "동 이름을 누르면 해당 지역의 커튼·블라인드 설치 비용과 확인 사항을 볼 수 있습니다.",
    districts: yonginRegionTree.districts.filter((item) => item.name === district.name),
  },
  source: { label: district.sourceLabel, url: district.sourceUrl },
}));

const dongArticles = yonginDistricts.flatMap((district: YonginDistrict, districtIndex: number) => district.dongs.map((dong: YonginDong, dongIndex: number) => makeArticle({
  slug: dong.slug,
  areaLabel: dong.name,
  localNote: dong.localNote,
  index: 5 + districtIndex * 15 + dongIndex,
  level: "dong",
  housingType: dong.housingType,
  district: { name: district.name, slug: district.slug },
  regionTree: {
    title: `용인시 ${district.name} 행정동별 커튼·블라인드 설치 정보`,
    description: `${dong.name}과 같은 ${district.name}의 행정동을 연결했습니다. 지역 이름을 누르면 상세 정보로 이동합니다.`,
    districts: yonginRegionTree.districts.filter((item) => item.name === district.name),
  },
  source: { label: district.sourceLabel, url: district.sourceUrl },
})));

export const yonginCurtainBlindArticles: Article[] = [cityArticle, ...districtArticles, ...dongArticles];

if (yonginCurtainBlindArticles.length !== 43 || new Set(yonginCurtainBlindArticles.map((article) => article.slug)).size !== 43) {
  throw new Error("용인시 커튼·블라인드 지역별 콘텐츠는 시 1개, 구 3개, 행정동 39개로 구성되어야 합니다.");
}
