export interface QuestionAnalysis {
  rawText: string;
  title: string;
  body: string;
  floor?: string;
  hasElevator?: boolean;
  loadSize?: string;
  region?: string;
  targetItems: string[];
  isCostQuestion: boolean;
  keywords: string[];
  coreProblem: string;
}

export function analyzeQuestion(rawInput: string): QuestionAnalysis {
  const lines = rawInput.trim().split("\n");
  const title = lines[0] || "";
  const body = lines.slice(1).join("\n").trim() || title;
  const fullText = `${title} ${body}`.toLowerCase();

  // 1. 층수 및 계단/엘리베이터 분석
  let floor: string | undefined;
  const floorMatch = fullText.match(/([1-9]|1[0-9]|2[0-9]|3[0-9])층/);
  if (floorMatch) {
    floor = `${floorMatch[1]}층`;
  } else if (fullText.includes("반지하") || fullText.includes("지하")) {
    floor = "지하/반지하";
  }

  let hasElevator: boolean | undefined;
  if (fullText.includes("엘베 없음") || fullText.includes("엘리베이터 없음") || fullText.includes("계단으로") || fullText.includes("계단 이용")) {
    hasElevator = false;
  } else if (fullText.includes("엘베 있음") || fullText.includes("엘리베이터 있음") || fullText.includes("엘베 이용")) {
    hasElevator = true;
  }

  // 2. 짐량 분석
  let loadSize: string | undefined;
  if (fullText.includes("원룸") || fullText.includes("단칸방") || fullText.includes("1인 가구")) {
    loadSize = "원룸(1톤 소형)";
  } else if (fullText.includes("1톤")) {
    loadSize = "1톤 트럭";
  } else if (fullText.includes("2.5톤") || fullText.includes("투룸") || fullText.includes("2룸")) {
    loadSize = "2.5톤(투룸)";
  } else if (fullText.includes("5톤") || fullText.includes("쓰리룸") || fullText.includes("3룸") || fullText.includes("아파트")) {
    loadSize = "5톤(가족/아파트)";
  }

  // 3. 지역 분석
  let region: string | undefined;
  const regions = ["천안", "수원", "인천", "화성", "동탄", "평택", "부천", "안양", "성남", "용인", "서울", "부산", "대구", "대전", "광주"];
  for (const r of regions) {
    if (fullText.includes(r.toLowerCase())) {
      region = r;
      break;
    }
  }

  // 4. 주요 대상 아이템 및 카테고리 분석
  const targetItems: string[] = [];
  const itemMap: Record<string, string[]> = {
    "에어컨": ["에어컨", "에어콘", "실외기", "냉매"],
    "벽걸이TV": ["벽걸이", "tv", "티비", "셋톱박스", "타공", "무타공"],
    "도어락/방화문": ["도어락", "번호키", "방화문", "도어클로저", "힌지", "현관문"],
    "싱크대/수전": ["싱크대", "수전", "수도꼭지", "배수구", "배수통"],
    "입주청소": ["입주청소", "이사청소", "청소비용", "원룸청소"],
    "식기세척기": ["식기세척기", "식세기", "규격장", "장공사"],
    "사다리차": ["사다리차", "사다리"],
    "보증금/행정": ["보증금", "전입신고", "확정일자", "장기수선충당금", "공과금"]
  };

  for (const [category, terms] of Object.entries(itemMap)) {
    if (terms.some(term => fullText.includes(term))) {
      targetItems.push(category);
    }
  }

  // 5. 비용 질문 여부
  const isCostQuestion = fullText.includes("비용") || fullText.includes("얼마") || fullText.includes("견적") || fullText.includes("가격") || fullText.includes("요금");

  // 6. 키워드 추출
  const keywords: string[] = [];
  if (region) keywords.push(region);
  if (loadSize) keywords.push(loadSize.split("(")[0]);
  targetItems.forEach(item => keywords.push(item));
  if (isCostQuestion) keywords.push("비용");
  if (keywords.length === 0) keywords.push("이사 견적", "이사 준비");

  // 7. 핵심 고민 요약
  const coreProblem = [
    region ? `[${region}]` : "",
    loadSize ? `${loadSize}` : "",
    floor ? `${floor}` : "",
    hasElevator === false ? "(엘리베이터 없음)" : (hasElevator === true ? "(엘리베이터 이용)" : ""),
    targetItems.length > 0 ? targetItems.join(", ") : "이사/수리 작업",
    isCostQuestion ? "예상 견적 및 추가비용 주의사항" : "진행 절차 및 가이드"
  ].filter(Boolean).join(" ");

  return {
    rawText: rawInput,
    title,
    body,
    floor,
    hasElevator,
    loadSize,
    region,
    targetItems,
    isCostQuestion,
    keywords,
    coreProblem
  };
}
