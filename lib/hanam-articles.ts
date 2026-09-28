import type { Article } from "./articles";

const SOURCE = { label: "하남시청 위치·면적·행정구역", url: "https://www.hanam.go.kr/www/contents.do?key=155" };
const DATE = "2026-09-28";
const CITY_SLUG = "hanam-moving-regional-guide";

// 하남시청의 14개 행정동 기준. 읍·면은 없으며 법정동과 혼동하지 않는다.
const dongs = [
  { name: "천현동", slug: "cheonhyeon", legal: "천현·하산곡·상산곡·배알미동과 창우동 일부", question: "단독주택·창고 짐을 견적에 빠뜨리지 않으려면?", detail: "집 안의 짐과 마당·창고·부속 공간의 짐을 분리해 촬영하고, 차량이 실제로 설 수 있는 지점을 지도와 현장 사진으로 확인하세요.", checklist: ["마당·창고·옥외 물품 목록", "화물차 정차 지점", "좁은 진입로의 차량 통과 여부"] },
  { name: "신장1동", slug: "sinjang-1", legal: "신장동 일부", question: "집 앞 정차가 어려운 이사는 어떻게 비교할까요?", detail: "견적을 받을 때 건물 출입구와 화물차 정차 지점 사이의 거리를 재세요. 같은 짐이라도 긴 운반 거리와 계단 작업은 작업 방식에 영향을 줍니다.", checklist: ["건물 앞 정차 가능 시간", "차량에서 현관까지 거리", "계단과 승강기 치수"] },
  { name: "신장2동", slug: "sinjang-2", legal: "신장동·창우동 일부와 당정동", question: "주소의 법정동과 행정동이 다르면 무엇을 확인할까요?", detail: "견적서에는 행정동 이름만 쓰지 말고 도로명주소와 건물명을 적으세요. 창우동·당정동 주소도 신장2동 관할에 포함될 수 있어 실제 출입구를 기준으로 동선을 확인해야 합니다.", checklist: ["도로명주소와 건물명", "차량 진입 출입구", "관리사무소 이사 예약"] },
  { name: "덕풍1동", slug: "deokpung-1", legal: "덕풍동 일부", question: "계단·사다리차 비용은 어떻게 확인할까요?", detail: "층수만 전달하지 말고 계단 폭, 창문 앞 작업 공간과 전선 등 장애물을 사진으로 보내세요. 사다리차 사용 가능 여부는 현장에서 확인해야 합니다.", checklist: ["계단 폭과 꺾이는 구간", "사다리차 작업 공간", "차량 주차 위치"] },
  { name: "덕풍2동", slug: "deokpung-2", legal: "덕풍동 일부", question: "기존 집 원상복구와 이사 일정을 어떻게 맞출까요?", detail: "큰 가구를 빼기 전에 벽·바닥과 설비 상태를 촬영하고, 짐을 뺀 뒤 추가 사진을 남기세요. 수리 범위는 임대인과 먼저 확인해 이사 당일 작업과 겹치지 않게 잡습니다.", checklist: ["이사 전후 하자 사진", "임대인과 수리 범위 확인", "폐가구 처리 일정"] },
  { name: "덕풍3동", slug: "deokpung-3", legal: "덕풍동 일부", question: "공동주택 이사 때 예약할 것은 무엇인가요?", detail: "출발지와 도착지 관리사무소에 승강기 사용 시간, 공용부 보양, 하역 장소를 각각 확인하세요. 단지가 다르면 규정도 별개입니다.", checklist: ["양쪽 승강기 예약", "보양 범위와 비용", "하역 장소와 차량 높이"] },
  { name: "미사1동", slug: "misa-1", legal: "망월동 일부와 미사동", question: "대단지 이사 견적에서 빠지기 쉬운 항목은?", detail: "동·라인별 하역 위치와 지하주차장 차량 높이를 관리사무소에 확인하세요. 같은 단지에서도 입구와 승강기까지의 거리가 달라질 수 있습니다.", checklist: ["동·라인별 하역 위치", "승강기 사용 가능 시간", "지하주차장 차량 제한"] },
  { name: "미사2동", slug: "misa-2", legal: "망월동 일부와 선동", question: "이사와 입주청소를 같은 날 진행해도 될까요?", detail: "짐 반입 전에 빈집 청소와 검수를 끝낼 수 있도록 시간을 분리하세요. 선동 주소도 미사2동 관할에 포함될 수 있으므로 계약서에는 실제 도로명주소를 적습니다.", checklist: ["청소 종료·검수 시간", "짐 반입 가능 시간", "실제 도로명주소"] },
  { name: "미사3동", slug: "misa-3", legal: "풍산동", question: "풍산동 주소의 행정동은 무엇인가요?", detail: "풍산동의 행정동 명칭은 2023년 미사3동으로 바뀌었습니다. 업체 예약에는 도로명주소와 풍산동 주소를 그대로 전달하고, 관리사무소 규정과 실외기 설치 위치를 확인하세요.", checklist: ["풍산동 도로명주소", "승강기·보양 규정", "실외기실과 배관 경로"] },
  { name: "감북동", slug: "gambuk", legal: "감북동·감일동 일부와 광암동 일부", question: "여러 법정동이 섞인 주소는 어떻게 견적을 받나요?", detail: "행정동 표기보다 실제 건물 위치와 접근로가 중요합니다. 지도 핀과 진입로 사진을 업체에 보내고 차량이 현관 가까이 설 수 있는지 확인하세요.", checklist: ["정확한 주소와 지도 핀", "진입로 폭", "현관 앞 하역 가능 여부"] },
  { name: "감일동", slug: "gamil", legal: "감일동과 감이동 일부", question: "새 아파트 입주 때 어떤 순서로 예약하나요?", detail: "단지의 입주 가능 시간과 승강기 예약을 먼저 확인한 뒤 청소, 가전 설치, 짐 반입 시간을 배치하세요. 감이동 주소도 포함될 수 있어 단지명과 도로명주소를 함께 전달합니다.", checklist: ["입주 가능 시간", "승강기·보양 예약", "청소·가전 설치·이사 순서"] },
  { name: "위례동", slug: "wirye", legal: "학암동과 감이동 일부", question: "같은 위례 생활권이라도 주소 확인이 필요한 이유는?", detail: "생활권 이름만으로 업체에 주소를 전달하지 마세요. 하남시 학암동·감이동에 해당하는 실제 주소와 단지 출입구를 기준으로 이동 거리와 관리 규정을 확인합니다.", checklist: ["하남시 도로명주소", "단지 출입구", "도착지 관리 규정"] },
  { name: "춘궁동", slug: "chungung", legal: "춘궁동·교산동·하사창동·상사창동 등", question: "부속 공간과 접근로는 어떻게 견적에 반영하나요?", detail: "주택이나 부속 공간의 짐은 실내 짐과 따로 목록을 만드세요. 진입로가 좁거나 정차 지점이 멀다면 소형 차량 환적이 필요한지 업체에 현장 사진으로 확인받습니다.", checklist: ["부속 공간 짐 목록", "차량 진입로", "정차 지점에서 집까지 거리"] },
  { name: "초이동", slug: "choi", legal: "초이동·초일동 등", question: "큰 가구가 현관을 통과하지 못하면 어떻게 하나요?", detail: "냉장고·소파의 폭과 현관·복도·승강기 치수를 먼저 비교하세요. 분해 운반이나 창문 반입이 필요할 가능성이 있으면 작업 방법과 추가 비용 조건을 견적서에 적습니다.", checklist: ["대형 가구·가전 치수", "현관·복도 폭", "분해·재조립 포함 여부"] },
] as const;

export const hanamRegionTree: NonNullable<Article["regionTree"]> = {
  title: "하남시 14개 행정동 이사 키워드트리",
  description: "하남시에는 읍·면이 없고 14개 행정동이 있습니다. 동 이름을 누르면 해당 주소·건물 조건에 맞춘 이사 준비사항을 확인할 수 있습니다.",
  districts: [{ name: "하남시", href: `/articles/${CITY_SLUG}`, dongs: dongs.map((dong) => ({ name: dong.name, href: `/articles/hanam-${dong.slug}-moving-guide` })) }],
};

const city: Article = {
  slug: CITY_SLUG,
  title: "하남시 이사 지역별 정보｜14개 행정동 키워드트리와 견적 체크",
  description: "하남시 14개 행정동을 공식 행정구역 기준으로 연결했습니다. 미사·감일·위례와 신장·덕풍 등에서 이사 견적 전 확인할 주소, 주차, 승강기 조건을 살펴보세요.",
  category: "regional", categoryLabel: "지역별 정보", keyword: "하남시 이사", secondaryKeywords: ["하남 포장이사", "하남 행정동", "하남 이사 견적"], readingTime: 6,
  publishedAt: DATE, updatedAt: DATE, accent: "mint", regionTree: hanamRegionTree,
  breadcrumbs: [{ name: "지역별 정보", href: "/category/regional" }, { name: "경기도", href: "/articles/gyeonggi-moving-regional-guide" }],
  intro: "하남시에서 이사를 준비한다면 먼저 실제 도로명주소와 건물 조건을 확인하세요. 하남시는 14개 행정동으로 구성되며 읍·면은 없습니다. 위 키워드트리에서 동을 고른 뒤 출발지와 도착지의 주차, 승강기, 작업 시간을 같은 양식으로 비교하면 됩니다.",
  sections: [
    { heading: "행정동과 법정동을 구분해 주소를 전달하세요", paragraphs: ["미사3동은 풍산동, 위례동은 학암동을 포함합니다. 이처럼 생활권 이름과 주소의 동 표기가 다를 수 있으므로 업체에는 도로명주소, 건물명, 출입구를 함께 전달하세요.", "위 키워드트리는 하남시청의 행정동 14곳을 기준으로 만들었습니다. 실제 관할과 도로명주소는 하남시청 자료와 주소 조회에서 확인하세요."] },
    { heading: "견적 전 양쪽 건물에서 확인할 것", paragraphs: ["미사·감일 등 공동주택에서는 승강기 예약, 보양, 지하주차장 차량 높이와 하역 위치를 관리사무소에 확인하세요. 신장·덕풍 등의 주택은 계단 폭과 차량 정차 거리, 천현·춘궁 등에서는 부속 공간 짐과 접근로를 별도로 살펴보세요.", "조건을 확인한 뒤 [포장이사 견적 비교 체크리스트](/articles/moving-company-quote-comparison)에 같은 사진과 목록을 넣어 여러 업체에 보내세요."], checklist: ["출발지·도착지 도로명주소", "짐 목록과 대형 가전 치수", "차량 정차 위치", "승강기·사다리차 가능 여부", "청소와 설치 일정"] },
    { heading: "청소와 설치는 짐 반입 시간에 맞추세요", paragraphs: ["입주청소는 빈집 상태에서 마치고 검수한 뒤 짐을 들이는 순서가 편합니다. 에어컨·세탁기·벽걸이TV는 운반과 설치 책임을 구분하고, [에어컨 이전설치 비용 항목](/articles/air-conditioner-moving-installation-cost)을 확인해 별도 견적에 반영하세요."] },
  ],
  faq: [{ question: "하남시에 읍·면이 있나요?", answer: "없습니다. 하남시청 기준 14개 행정동으로 구성됩니다." }, { question: "풍산동은 왜 키워드트리에 없나요?", answer: "풍산동은 법정동이며 행정동 명칭은 2023년부터 미사3동입니다. 풍산동 주소의 이사 정보는 미사3동 글에서 확인하세요." }],
  source: SOURCE,
};

const dongArticles: Article[] = dongs.map((dong, index) => {
  const slug = `hanam-${dong.slug}-moving-guide`;
  return {
    slug,
    title: `하남시 ${dong.name} 이사 준비｜${dong.question}`,
    description: `하남시 ${dong.name} 이사 전 ${dong.legal} 주소와 건물 조건을 확인하고, ${dong.checklist.join("·")}를 견적서에 반영하는 방법입니다.`,
    category: "regional", categoryLabel: "지역별 정보", keyword: `하남 ${dong.name} 이사`, secondaryKeywords: [`${dong.name} 포장이사`, `${dong.name} 이사 견적`], readingTime: 4,
    publishedAt: DATE, updatedAt: DATE, accent: ["mint", "amber", "blue", "violet"][index % 4],
    breadcrumbs: [{ name: "지역별 정보", href: "/category/regional" }, { name: "하남시", href: `/articles/${CITY_SLUG}` }],
    intro: `${dong.name} 이사에서 먼저 확인할 것은 정확한 주소와 건물 접근 조건입니다. 하남시청 행정구역 기준으로 ${dong.name}은 ${dong.legal}을 포함합니다. ${dong.detail}`,
    sections: [
      { heading: `${dong.name} 이사 견적 전 현장 확인`, paragraphs: [dong.detail, "출발지와 도착지를 각각 촬영하고 층수, 주차 위치, 승강기 사용 여부를 기록하세요. 업체마다 같은 자료를 보내야 차량·인원·추가 작업 조건을 비교할 수 있습니다."], checklist: [...dong.checklist] },
      { heading: "계약서와 당일 일정에 반영할 것", paragraphs: ["차량·작업 인원, 계단 또는 사다리차 작업, 가전 분해·설치, 대기와 추가요금 조건을 문서로 받으세요. [포장이사 견적 비교 기준](/articles/moving-company-quote-comparison)을 보면 빠진 항목을 확인할 수 있습니다.", "이사 전에는 관리사무소나 건물 관리자에게 작업 시간과 공용부 보양을 확인하세요. 입주청소와 가전 설치는 짐 반입 전후로 나눠 예약하면 동선이 겹치는 일을 줄일 수 있습니다."] },
      { heading: "하남시의 다른 행정동 찾기", paragraphs: [`[하남시 14개 행정동 키워드트리](/articles/${CITY_SLUG})에서 다른 동의 주소 범위와 이사 준비사항을 확인하세요. 이사 당일에는 [계량기·하자·열쇠 인계 체크리스트](/articles/moving-day-checklist)를 함께 사용하세요.`] },
    ],
    faq: [{ question: `${dong.name} 이사 견적에는 어떤 주소를 적나요?`, answer: "도로명주소와 건물명, 실제 출입구를 적으세요. 행정동과 법정동 명칭이 다른 주소도 있으므로 생활권 이름만으로 전달하지 않는 편이 좋습니다." }, { question: "사다리차나 승강기 비용은 정해져 있나요?", answer: "건물 규정, 층수, 작업 공간과 업체 계약 범위에 따라 달라집니다. 현장 조건을 확인한 뒤 포함 여부와 추가요금 기준을 견적서에 적으세요." }],
    source: SOURCE,
  };
});

if (dongs.length !== 14 || new Set(dongs.map((dong) => dong.name)).size !== 14) throw new Error("하남시 행정동은 14개여야 합니다.");

export const hanamArticles: Article[] = [city, ...dongArticles];
