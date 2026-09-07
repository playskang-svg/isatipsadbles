import fs from "node:fs";
import path from "node:path";
import type { Article } from "../../lib/articles";
import type { QuestionAnalysis } from "./analyzer";

export interface GeneratedPostResult {
  article: Article;
  canonicalUrl: string;
  isNew: boolean;
}

export function generateAndSavePost(analysis: QuestionAnalysis, customTopic?: { title?: string; keyword?: string; category?: any }): GeneratedPostResult {
  const dateStr = "2026-09-07";
  const rawKeyword = customTopic?.keyword || analysis.keywords.join(" ") || "이사 견적 비교";
  
  // URL 슬러그 생성 (가독성 높은 영문 단어 매핑)
  const slugSuffix = Date.now().toString(36).slice(-4);
  const termMap: Record<string, string> = {
    "식기세척기": "dishwasher",
    "싱크대": "sink",
    "수전": "faucet",
    "도어락": "doorlock",
    "방화문": "firedor",
    "에어컨": "aircon",
    "벽걸이tv": "tv-mount",
    "입주청소": "movein-clean",
    "사다리차": "ladder-truck",
    "원룸": "oneroom",
    "비용": "cost",
    "견적": "quote",
    "이사": "moving",
    "천안": "cheonan",
    "수원": "suwon",
    "인천": "incheon"
  };

  let slugTerms: string[] = [];
  const lowerKw = rawKeyword.toLowerCase();
  for (const [kr, en] of Object.entries(termMap)) {
    if (lowerKw.includes(kr)) {
      slugTerms.push(en);
    }
  }
  if (slugTerms.length === 0) slugTerms = ["moving-guide"];
  const slug = `${slugTerms.slice(0, 3).join("-")}-guide-${slugSuffix}`;

  const category = customTopic?.category || "quotes";
  const categoryLabels: Record<string, string> = {
    planning: "이사 준비",
    quotes: "견적·비용",
    "repair-install": "수리·설치",
    admin: "행정·공과금",
    "home-care": "청소·정리",
    regional: "지역 정보"
  };

  const title = customTopic?.title || `${rawKeyword} 상세 가이드: 조건별 비용과 주의사항 총정리`;
  const description = `${analysis.coreProblem}에 관한 현실적인 견적 기준, 사다리차 및 엘리베이터 작업 조건, 현장 추가비용 예방 체크리스트를 정리했습니다.`;

  // 질문자의 세부 상황을 녹여낸 전문 섹션 구성
  const floorNotice = analysis.floor 
    ? `${analysis.floor}의 경우 ${analysis.hasElevator === false ? "엘리베이터가 없어 사다리차(또는 계단 작업비)가 필수적으로 발생합니다." : "엘리베이터 사용료 및 예약 가능 시간을 관리사무소에 사전 확인해야 합니다."}`
    : "층수와 엘리베이터 유무에 따라 장비 비용 차이가 10만 원 이상 벌어질 수 있습니다.";

  const loadNotice = analysis.loadSize
    ? `${analysis.loadSize} 기준 평균 작업 인원은 1~2명이며, 기사님 단순 운송인지 동승/운반 도움인지에 따라 견적이 크게 달라집니다.`
    : "짐의 실제 부피(가전, 가구 수량)를 사전에 명확히 고지해야 당일 추가 요금 시비가 없습니다.";

  const newArticle: Article = {
    slug,
    title,
    description,
    category,
    categoryLabel: categoryLabels[category] || "이사 정보",
    keyword: rawKeyword,
    secondaryKeywords: [
      `${rawKeyword} 견적`,
      `${rawKeyword} 추가비용`,
      `${rawKeyword} 체크리스트`
    ],
    readingTime: 8,
    publishedAt: dateStr,
    updatedAt: dateStr,
    accent: "blue",
    intro: `${analysis.coreProblem} 상황에서는 시작 전 정확한 작업 기준과 비용 항목을 문서로 확인해두지 않으면 당일 현장에서 예상치 못한 추가금이 발생하기 쉽습니다. ${floorNotice} 아래 4단계 가이드와 체크리스트를 바탕으로 손해 없는 안전한 진행 방법을 확인하세요.`,
    sections: [
      {
        heading: "1. 기본 견적 산정 기준과 평균 비용 구조",
        paragraphs: [
          `${loadNotice} 일반적으로 기본 운임 외에 진입로 상태, 대기 시간, 작업 인력 추가 여부에 따라 기본 견적이 책정됩니다.`,
          "구두로만 대략적인 금액을 확인하고 당일 현장에서 짐을 실을 때 '생각보다 짐이 많다'거나 '동선이 길다'며 추가금을 요구하는 사례가 빈번하므로, 반드시 주요 가구/가전 사진을 미리 공유하고 확정 견적을 받아두어야 합니다."
        ],
        checklist: [
          "주요 가전·가구 규격 및 수량 사전 전송",
          "작업 인원 수(기사 단독 또는 인부 1인 추가) 확정",
          "운반 도움 방식(단순 차량 운송 vs 집 안까지 반입) 명시"
        ]
      },
      {
        heading: "2. 층수, 엘리베이터 및 사다리차 진입 조건 확인",
        paragraphs: [
          `${floorNotice}`,
          "사다리차를 이용할 경우 전선, 조경수, 주차장 진입로 폭 등 장애물 유무에 따라 작업 가능 여부가 갈립니다. 만약 사다리차 진입이 불가능한 현장이라면 계단 인력 작업비(층당 추가금)가 붙게 되므로 출발지와 도착지의 건물 환경을 사전에 정밀하게 전달해야 합니다."
        ],
        checklist: [
          "관리사무소 엘리베이터 사용료 및 보양 규정 확인",
          "창문/베란다 사다리차 거치 가능 여부 확인",
          "계단 작업 시 층수별 인건비 가산 기준 사전 협의"
        ]
      },
      {
        heading: "3. 당일 추가요금 분쟁을 예방하는 3대 계약 원칙",
        paragraphs: [
          "가장 많은 분쟁은 '특수 가전(벽걸이TV, 에어컨, 식기세척기 등) 철거 및 재설치' 범위가 불분명할 때 발생합니다. 일반 이사업체는 단순 이동만 지원하고 재설치는 별도 전문 기사 비용이 청구되는 경우가 대부분입니다.",
          "따라서 계약서 특약 사항에 폐기물 배출 지원 여부, 파손 배상 책임 한도, 대기 시간 발생 시 시간당 요금 등을 명확히 기재해두는 것이 안전합니다."
        ],
        checklist: [
          "특수 가전 단순 운반인지 분해·설치 포함인지 구분",
          "현장 대기 발생 시 요금 기준 사전 조율",
          "업체 적재물 배상책임보험 가입 여부 확인"
        ]
      },
      {
        heading: "4. 단계별 실행 일정 및 체크리스트",
        paragraphs: [
          "작업 최소 1~2주 전에는 2곳 이상의 플랫폼이나 전문 업체를 통해 동일한 조건으로 비교 견적을 수렴하세요. 최저가만 고집하기보다는 작업 범위가 구체적으로 적힌 업체를 선택하는 것이 결과적으로 추가금을 아끼는 길입니다.",
          "작업 당일에는 시작 전과 완료 후 가전·가구 상태 및 건물 벽면의 사진을 촬영해 기록을 남겨두면 파손 시 원활한 보상을 받을 수 있습니다."
        ],
        checklist: [
          "작업 7일 전 동일 조건 복수 견적 비교",
          "작업 전 주요 물품 사진 촬영 및 기록",
          "작업 완료 후 파손 여부 즉시 현장 점검"
        ]
      }
    ],
    faq: [
      {
        question: "방문견적 없이 사진만으로 확정 금액 계약이 가능한가요?",
        answer: "소형 짐이나 1톤 내외인 경우 방별 사진과 동선 사진을 상세히 공유하면 확정 견적이 가능합니다. 단, 공유되지 않은 잔짐이 많을 경우 당일 추가금이 생길 수 있으니 서랍 속 짐까지 빠짐없이 안내해야 합니다."
      },
      {
        question: "엘리베이터가 없는 고층의 경우 사다리차가 무조건 저렴한가요?",
        answer: "3층 이상부터는 인부들이 계단으로 짐을 나르는 인건비가 사다리차 1회 대여비보다 비싸지거나 작업 시간이 2배 이상 걸립니다. 따라서 통상 3층 이상은 사다리차 진입이 가능하다면 사다리차를 쓰는 것이 안전하고 경제적입니다."
      }
    ]
  };

  // lib/kin-generated-articles.ts 파일에 영구 추가
  saveArticleToFile(newArticle);

  return {
    article: newArticle,
    canonicalUrl: `https://isatips.adbles.com/articles/${newArticle.slug}`,
    isNew: true
  };
}

function saveArticleToFile(article: Article): void {
  const filePath = path.resolve(process.cwd(), "lib/kin-generated-articles.ts");
  let content = fs.readFileSync(filePath, "utf-8");

  // 이미 존재하는 슬러그인지 확인
  if (content.includes(`slug: "${article.slug}"`)) {
    return;
  }

  // Article JSON을 포맷팅하여 kinGeneratedArticles 배열에 추가
  const articleCode = `  ${JSON.stringify(article, null, 2).replace(/\n/g, "\n  ")},`;
  
  if (content.includes("export const kinGeneratedArticles: Article[] = [")) {
    content = content.replace(
      "export const kinGeneratedArticles: Article[] = [",
      `export const kinGeneratedArticles: Article[] = [\n${articleCode}`
    );
  } else {
    content = `import type { Article } from "./articles";\n\nexport const kinGeneratedArticles: Article[] = [\n${articleCode}\n];\n`;
  }

  fs.writeFileSync(filePath, content, "utf-8");
}
