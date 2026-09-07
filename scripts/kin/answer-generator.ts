import type { Article } from "../../lib/articles";
import type { QuestionAnalysis } from "./analyzer";

export interface GeneratedAnswer {
  text: string;
  articleUrl: string;
  articleSlug: string;
  articleTitle: string;
  charCountWithoutLink: number;
}

export function generateKinAnswer(analysis: QuestionAnalysis, article: Article): GeneratedAnswer {
  const articleUrl = `https://isatips.adbles.com/articles/${article.slug}`;

  // 1. 질문자의 구체적 조건에 따른 핵심 결론 문장
  let directConclusion = "";
  if (analysis.isCostQuestion) {
    if (analysis.loadSize?.includes("원룸") || analysis.loadSize?.includes("1톤")) {
      if (analysis.hasElevator === false && analysis.floor) {
        directConclusion = `질문하신 ${analysis.floor} 엘리베이터 없는 조건의 1톤 원룸 이사는 기본 차량 운송(약 5~8만 원) 외에 ${analysis.floor} 계단 작업비 또는 사다리차 비용(통상 8~12만 원)과 기사님 수작업 인건비가 추가되어, 짐을 직접 다 싸두신 일반이사 기준 총 견적은 약 18만~25만 원 선으로 형성됩니다. 반포장이사로 진행하실 경우 28만~35만 원 안팎을 예상하셔야 합니다.`;
      } else {
        directConclusion = `질문하신 1톤 원룸 이사의 경우 기사님과 함께 짐을 나르는 일반이사 기준 약 15만~20만 원, 포장과 정리를 기사님이 함께 도와주는 반포장이사는 25만~32만 원 수준이 일반적인 시세입니다.`;
      }
    } else {
      directConclusion = `질문하신 ${analysis.coreProblem} 건은 기본 작업 인원과 진입 장비(사다리차/엘리베이터) 사용 여부에 따라 견적 차이가 10만~20만 원 이상 크게 벌어집니다.`;
    }
  } else {
    directConclusion = `문의하신 ${analysis.coreProblem} 작업은 사전에 작업 범위와 특수 조건(철거, 재설치, 폐기물 처리)을 명확히 합의하지 않으면 현장에서 당일 추가 요금 분쟁이 빈번하게 발생합니다.`;
  }

  // 2. 실전 주의사항 및 팁 (정보 밀도 높은 본문)
  const floorTip = analysis.hasElevator === false && analysis.floor
    ? `특히 ${analysis.floor}처럼 엘리베이터가 없는 환경에서는 작업 당일 '사다리차 거치 불가(전선, 진입로 협소 등)' 상황이 발생할 경우 인부 1인이 현장에서 추가 투입되어 10만 원 이상의 추가 인건비가 즉시 청구될 수 있으니 사전에 창문 앞 사다리차 진입 가능 여부를 로드뷰나 사진으로 업체에 정확히 고지해야 합니다.`
    : `작업 현장의 주차 동선이 길거나 차량 진입이 어려운 경우에도 미터당 추가금이 붙을 수 있으므로 건물 입구와 트럭 정차 위치를 미리 알려주는 것이 안전합니다.`;

  const contractTip = `견적을 받으실 때는 단순히 총액만 비교하지 마시고, ① 기사님 1인 단독 작업인지 상하차 도움 인력이 포함된 것인지, ② 큰 가구/가전 외에 잔짐 박스가 몇 개까지 기본 범위인지, ③ 현장 대기 시간 발생 시 추가 요금 규정이 어떻게 되는지 3가지를 문자나 견적서에 반드시 명시해 두세요.`;

  // 3. isatips 유입 극대화 브릿지 & 고클릭 CTA (Lead Magnet 구조)
  let leadMagnetTitle = "층수·조건별 표준 단가표 & 현장 추가비용 방지 체크리스트";
  let leadMagnetHook = "업체와 통화하거나 방문견적 받으실 때 항목별로 바로 대조해보실 수 있는 체크리스트";

  if (analysis.isCostQuestion) {
    leadMagnetTitle = "이사 조건별 상세 견적표 & 추가요금 분쟁 예방 체크리스트";
    leadMagnetHook = "당일 현장에서 기사님이 추가금을 요구할 때 반박할 수 있는 실제 계약 특약 문구와 기준표";
  } else if (analysis.targetItems.some(i => i.includes("식기세척기") || i.includes("에어컨") || i.includes("싱크대"))) {
    leadMagnetTitle = `${analysis.targetItems.join(", ")} 이전설치 단계별 절차 및 원상복구 가이드`;
    leadMagnetHook = "설치 기사 부르기 전에 반드시 확인해야 할 배관/타공 규격과 자재비 누락 방지 체크표";
  }

  const bridgeSentence = `특히 계약하시기 전이나 당일 작업 시작 전에 ${leadMagnetHook}를 꼭 확인해두셔야 불필요한 바가지를 피할 수 있습니다.\n아래 정리글에 항목별로 한눈에 보실 수 있게 표로 잘 정리되어 있으니, 견적 결정하시기 전에 반드시 읽어보시고 진행하세요.`;

  const linkBlock = `▼ ${leadMagnetTitle} 확인하기\n${articleUrl}`;

  const fullAnswer = [
    "■ 질문 조건 기반 예상 견적 및 비용 범위",
    directConclusion,
    "",
    "■ 현장 작업 시 주의해야 할 핵심 요인",
    floorTip,
    "",
    "■ 계약 전 반드시 확인해야 할 3대 필수 사항",
    contractTip,
    "",
    "■ 계약 전 필수 확인 가이드 (체크리스트 & 표준 기준표)",
    bridgeSentence,
    "",
    linkBlock
  ].join("\n");

  const charCountWithoutLink = fullAnswer.replace(articleUrl, "").trim().length;

  return {
    text: fullAnswer,
    articleUrl,
    articleSlug: article.slug,
    articleTitle: article.title,
    charCountWithoutLink
  };
}
