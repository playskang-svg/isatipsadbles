import type { Article, Section } from "./articles";
import { suwonDistricts, suwonRegionTree } from "./suwon-keyword-tree";
import { linkUrl } from "./affiliate";
import { cleaningQuoteUrl, movingQuoteLinkForKeyword } from "./affiliate-match";

const MOVE_REPAIR_URL = linkUrl("repair-soomgo-leak");
const INSTALL_REPAIR_URL = linkUrl("repair-soomgo-aircon");
const SUWON_ADMIN_URL = "https://www.suwon.go.kr/sw-www/www05/www05-01/www05-01-08.jsp";
const PUBLISHED_AT = "2026-09-01T11:00:00.000Z";
const UPDATED_AT = "2026-09-02T00:00:00.000Z";
const REAL_MOVE_IMAGE = "/images/moving-field/living-a04-14.webp";
const REAL_TV_IMAGE = "/images/moving-field/living-a03-12.webp";
const accents = ["mint", "amber", "blue", "violet", "rose", "green"];

function makeSections(areaLabel: string, localNote: string, district?: { name: string; slug: string }): Section[] {
  const movingQuote = movingQuoteLinkForKeyword(`${areaLabel} 포장이사 견적`);
  const sections: Section[] = [
    {
      heading: `${areaLabel} 이사 견적이 달라지는 지역 조건`,
      image: { src: REAL_MOVE_IMAGE, alt: `${areaLabel} 이사 전 짐과 설치 상태를 확인하는 실제 현장 사진`, title: `${areaLabel} 이사 준비` },
      paragraphs: [
        localNote,
        "같은 평수라도 차량이 건물 앞에 설 수 있는지, 승강기를 단독으로 예약할 수 있는지, 계단이나 긴 복도를 지나야 하는지에 따라 작업시간이 달라집니다. 출발지와 도착지의 건물 전면, 주차 위치, 현관과 승강기 사진을 같은 순서로 준비하세요.",
        "견적을 받을 때는 주소만 보내지 말고 층수, 승강기 유무, 주차거리, 버릴 가구와 대형가전을 함께 적으세요. 업체마다 같은 조건을 전달해야 가격과 포함 범위를 제대로 비교할 수 있습니다.",
      ],
      checklist: ["출발지·도착지 건물 전면 사진", "층수와 승강기 예약 여부", "차량에서 현관까지 실제 거리", "사다리차 가능 공간", "폐기 가구와 특수 가전"],
    },
    {
      heading: "아파트·빌라·원룸·단독주택별 이사 준비",
      paragraphs: [
        "아파트는 관리사무소에 작업 가능 시간, 승강기 사용료, 공용부 보양과 지하주차장 높이를 확인하세요. 냉장고·소파·안마의자는 현관과 승강기 치수를 재면 현장에서 다시 해체하는 일을 줄일 수 있습니다.",
        "빌라와 다세대는 계단 폭, 전깃줄과 나무 등 사다리차 방해 요소를 봐야 합니다. 원룸은 짐이 적어도 주차가 멀거나 엘리베이터가 없으면 비용이 커질 수 있습니다. 단독주택은 마당·창고·옥상 짐을 실내 짐과 나눠 촬영하세요.",
      ],
    },
    {
      heading: `${areaLabel} 에어컨 이전 설치 비용 확인`,
      paragraphs: [
        "에어컨은 운반비만 보면 될까요? 철거와 재설치 외에도 추가 배관, 타공, 실외기 앵글, 냉매 보충과 고소 작업이 비용을 바꿉니다. 새집 실외기실이 좁거나 실외기를 외벽에 설치해야 한다면 사진으로 먼저 확인받으세요.",
        `제품 모델명과 실내기·실외기 사진을 준비한 뒤 [${areaLabel} 에어컨 설치·수리 견적 확인](${INSTALL_REPAIR_URL})에서 조건을 비교해 보세요. 기본 배관 길이, 추가 배관의 미터당 단가, 철거비와 사후보증 담당자를 각각 확인하는 것이 좋습니다.`,
      ],
      checklist: ["제품 모델명과 제조연도", "기존·새집 배관 길이", "실외기 설치 위치", "타공·앵글·위험 작업", "누수·냉방 사후보증"],
    },
    {
      heading: "이사 전 집수리·입주청소와 원상복구 순서",
      paragraphs: [
        "못 자국, 벽지 오염, 바닥 찍힘과 문손잡이 문제는 짐을 빼면 더 잘 보입니다. 다만 큰 가구 뒤의 곰팡이와 누수 흔적은 이사 전에 촬영해야 책임 범위를 확인하기 쉽습니다. 임대차 주택은 수리 범위를 임대인과 먼저 문자로 맞추세요.",
        `곰팡이나 물 자국처럼 누수가 의심되는 부분이 있다면 마감을 덮기 전에 [${areaLabel} 누수·설비 점검 견적](${MOVE_REPAIR_URL})을 받아 원인 조사 범위부터 정하세요. 도배·바닥 같은 마감 공정은 원인을 확인한 뒤에 잡아야 같은 자리를 두 번 뜯지 않습니다. 작업 면적, 자재 등급, 폐기물 처리, 출장비와 부가세 포함 여부를 같은 양식으로 적어야 비교가 쉬워집니다.`,
        `입주청소는 짐이 들어오기 전 빈집에서 끝나도록 일정을 나누세요. 면적뿐 아니라 창틀·베란다·붙박이장 내부까지 범위를 적어 [${areaLabel} 입주청소 견적](${cleaningQuoteUrl})을 확인하면 포함 항목을 비교하기 쉽습니다.`,
      ],
    },
    {
      heading: "포장이사 업체를 같은 기준으로 비교하는 법",
      paragraphs: [
        "방문견적 또는 사진견적을 받을 때 차량 톤수, 작업 인원, 포장 범위와 정리 범위를 견적서에 적으세요. 사다리차·계단 작업·장거리 운반·특수 가전 비용이 별도인지도 확인해야 당일 추가요금을 줄일 수 있습니다.",
        `같은 사진과 조건을 여러 곳에 보내려면 [${areaLabel} ${movingQuote.label} 무료 견적](${movingQuote.url})처럼 동일한 양식으로 신청할 수 있는 곳부터 확인해 보세요. 업체 수를 늘리는 것보다 같은 정보를 보내는 편이 비교에 유리합니다.`,
        "계약 전에는 사업자 정보, 피해보상 기준, 계약금과 취소 규정을 확인하세요. 귀중품·현금·계약서는 직접 운반하고, 작업 전 가구 흠집과 전자제품 작동 상태를 사진이나 영상으로 남기는 것이 좋습니다.",
      ],
      checklist: ["차량 톤수와 작업 인원", "사다리차·계단비", "가전 분해·재설치 범위", "식사비·수고비 요구 여부", "파손 접수와 보상 절차"],
    },
    {
      heading: `${areaLabel} 이사 당일 체크리스트`,
      paragraphs: [
        "출발 전에는 전기·가스·수도 계량기, 빈집 상태와 남은 짐을 촬영하세요. 새집에서는 큰 가전과 가구 위치부터 정하고, 문이 열리는 방향과 콘센트 위치를 확인한 뒤 상자를 방별로 배치하면 다시 옮기는 일을 줄일 수 있습니다.",
        "작업이 끝나면 가구와 가전의 파손, 바닥·벽·문틀 손상을 바로 확인하세요. 문제가 보이면 현장 책임자에게 알리고 사진과 대화 내용을 남기세요. 잔금은 계약한 작업 범위를 확인한 다음 지급하는 편이 안전합니다.",
      ],
    },
  ];

  if (district) {
    sections.push({
      heading: `${district.name}의 다른 동 이사 정보도 확인하세요`,
      paragraphs: [`생활권이 가까워도 건물과 단지 규정은 달라질 수 있습니다. [${district.name} 전체 지역별 이사 정보](/articles/${district.slug})에서 인접 행정동의 준비사항과 견적 포인트를 이어서 확인할 수 있습니다.`],
    });
  }

  return sections;
}

function makeArticle(input: {
  slug: string;
  areaLabel: string;
  localNote: string;
  index: number;
  level: "city" | "district" | "dong";
  district?: { name: string; slug: string };
  regionTree?: Article["regionTree"];
}): Article {
  const title = input.level === "city"
    ? "수원시 포장이사 견적 비교 총정리｜장안·권선·팔달·영통구 지역별 이사 팁"
    : input.level === "district"
      ? `수원시 ${input.areaLabel} 포장이사 견적 비교｜동별 이사·에어컨 설치 체크`
      : `수원시 ${input.district?.name} ${input.areaLabel} 포장이사 견적 비교｜추가비 줄이는 이사 팁`;

  return {
    slug: input.slug,
    title,
    description: `${input.areaLabel} 포장이사 견적부터 아파트·빌라 이사, 에어컨 이전 설치, 집수리와 원상복구까지 지역 조건에 맞춰 확인하세요.`,
    category: "regional",
    categoryLabel: "지역별 정보",
    keyword: `${input.areaLabel} 포장이사 견적`,
    secondaryKeywords: [`${input.areaLabel} 이사`, `${input.areaLabel} 포장이사`, `${input.areaLabel} 이사업체`, `${input.areaLabel} 원룸이사`, `${input.areaLabel} 입주청소`, `${input.areaLabel} 에어컨 이전설치`, `${input.areaLabel} 집수리`, `${input.areaLabel} 원상복구`],
    readingTime: input.level === "dong" ? 8 : 10,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    accent: accents[input.index % accents.length],
    affiliateNotice: true,
    heroImage: { src: input.index % 4 === 2 ? REAL_TV_IMAGE : REAL_MOVE_IMAGE, alt: `${input.areaLabel} 지역 이사 정보를 위한 실제 포장이사 현장 사진`, title: `${input.areaLabel} 이사`, caption: "실제 이사 현장 사진을 활용했으며 특정 업체를 추천하는 의미는 아닙니다." },
    intro: `${input.areaLabel}에서 이사를 준비하시나요? 평수와 짐이 비슷해도 주차, 층수, 승강기와 건물 앞 도로 조건에 따라 최종 비용은 달라집니다. 지역 특성부터 견적 비교, 에어컨 설치와 원상복구까지 실제 준비 순서대로 정리했습니다.`,
    sections: makeSections(input.areaLabel, input.localNote, input.district),
    faq: [
      { question: `${input.areaLabel} 포장이사 견적은 몇 곳에서 받아야 하나요?`, answer: "보통 2~3곳이면 포함 범위와 추가비 조건을 비교하기 좋습니다. 업체 수보다 모든 업체에 같은 사진, 짐 목록과 건물 조건을 전달하는 것이 중요합니다." },
      { question: "방문견적 없이 사진만으로 계약해도 되나요?", answer: "짐이 적고 건물 조건이 단순하면 가능하지만, 대형가전·붙박이장·계단 작업이 있으면 방문견적이 안전합니다. 사진견적이라면 누락 짐과 추가요금 기준을 계약서에 적으세요." },
      { question: "에어컨 이전 설치는 이사업체에 함께 맡겨도 되나요?", answer: "협력 설치기사가 오는지, 설치 책임과 사후보증 주체가 누구인지 확인하세요. 철거와 설치 담당자가 다르면 배관과 냉매 상태를 사진으로 남기는 것이 좋습니다." },
      { question: "이사 중 파손이나 바닥 흠집을 발견하면 어떻게 하나요?", answer: "현장에서 바로 사진과 영상을 남기고 작업 책임자에게 알리세요. 계약서, 견적서와 대화 기록을 함께 보관하면 피해 사실과 보상 범위를 확인하기 쉽습니다." },
    ],
    source: { label: "수원시 행정구역 현황", url: SUWON_ADMIN_URL },
    regionTree: input.regionTree,
  };
}

const cityArticle = makeArticle({
  slug: "suwon-city-moving-guide",
  areaLabel: "수원시",
  localNote: "수원시는 장안구·권선구·팔달구·영통구의 4개 구로 나뉘며, 신축 대단지와 구도심 주택가의 작업 조건이 크게 다릅니다. 구와 행정동을 먼저 고르면 더 가까운 지역 정보를 확인할 수 있습니다.",
  index: 0,
  level: "city",
  regionTree: suwonRegionTree,
});

const districtArticles = suwonDistricts.map((district, index) => makeArticle({
  slug: district.slug,
  areaLabel: district.name,
  localNote: district.localNote,
  index: index + 1,
  level: "district",
  regionTree: {
    title: `수원시 ${district.name} 행정동별 이사 정보`,
    description: "동 이름을 누르면 해당 지역의 포장이사 견적과 주거 형태별 준비사항을 확인할 수 있습니다.",
    districts: suwonRegionTree.districts.filter((item) => item.name === district.name),
  },
}));

const dongArticles = suwonDistricts.flatMap((district, districtIndex) => district.dongs.map((dong, dongIndex) => makeArticle({
  slug: dong.slug,
  areaLabel: dong.name,
  localNote: dong.localNote,
  index: 5 + districtIndex * 12 + dongIndex,
  level: "dong",
  district: { name: district.name, slug: district.slug },
  regionTree: {
    title: `수원시 ${district.name} 행정동별 이사 정보`,
    description: `${dong.name}과 같은 ${district.name}의 행정동을 연결했습니다. 지역 이름을 누르면 상세 이사 가이드로 이동합니다.`,
    districts: suwonRegionTree.districts.filter((item) => item.name === district.name),
  },
})));

export const suwonArticles: Article[] = [cityArticle, ...districtArticles, ...dongArticles];

if (suwonArticles.length !== 49 || new Set(suwonArticles.map((article) => article.slug)).size !== 49) {
  throw new Error("수원시 지역별 콘텐츠는 시 1개, 구 4개, 행정동 44개로 구성되어야 합니다.");
}
