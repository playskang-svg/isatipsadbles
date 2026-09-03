export type ShoppingSuggestion = {
  label: string;
  keyword: string;
  note: string;
};

export type ShoppingGuide = {
  title: string;
  description: string;
  suggestions: ShoppingSuggestion[];
};

export const shoppingGuides: Record<string, ShoppingGuide> = {
  "moving-preparation-checklist": {
    title: "이사 준비를 시작할 때 필요한 물품",
    description: "상자마다 방과 내용물을 표시하면 포장과 새집 정리가 한결 수월해집니다.",
    suggestions: [
      { label: "이사박스", keyword: "튼튼한 이사박스", note: "책과 생활용품을 나눠 담을 때" },
      { label: "포장 테이프", keyword: "이사 포장 테이프", note: "상자 바닥과 입구를 단단히 고정할 때" },
      { label: "유성 네임펜", keyword: "굵은 유성 네임펜 세트", note: "방·내용물·취급주의를 크게 표시할 때" },
    ],
  },
  "moving-company-quote-comparison": {
    title: "방문 견적을 받을 때 유용한 물품",
    description: "짐의 크기와 계약 조건을 빠짐없이 기록하면 업체별 총비용을 같은 기준으로 비교할 수 있습니다.",
    suggestions: [
      { label: "휴대용 줄자", keyword: "휴대용 자동 줄자", note: "대형 가구와 출입구 폭을 확인할 때" },
      { label: "클립보드", keyword: "A4 클립보드", note: "업체별 견적서를 현장에서 정리할 때" },
      { label: "서류 보관 파일", keyword: "A4 서류 보관 파일", note: "계약서와 영수증을 한곳에 보관할 때" },
    ],
  },
  "packing-moving-cost-factors": {
    title: "짐 부피와 파손 위험을 줄이는 포장용품",
    description: "부피가 큰 침구는 압축하고 깨지기 쉬운 물건은 완충재로 분리해 포장하세요.",
    suggestions: [
      { label: "압축팩", keyword: "이불 의류 압축팩", note: "침구와 계절옷의 부피를 줄일 때" },
      { label: "에어캡", keyword: "이사 포장 에어캡 뽁뽁이", note: "유리와 소형 가전을 보호할 때" },
      { label: "취급주의 스티커", keyword: "이사 취급주의 스티커", note: "깨지기 쉬운 상자를 구분할 때" },
    ],
  },
  "moving-day-checklist": {
    title: "이사 당일 바로 꺼내 쓸 준비물",
    description: "트럭에 싣지 않을 당일 가방을 따로 만들고 통신·간단한 조립·소분에 필요한 물건을 챙기세요.",
    suggestions: [
      { label: "보조배터리", keyword: "대용량 고속충전 보조배터리", note: "연락과 이체가 많은 이사 당일에" },
      { label: "가정용 공구세트", keyword: "가정용 공구세트", note: "가구 조립과 간단한 설치에" },
      { label: "다용도 지퍼백", keyword: "다용도 지퍼백 세트", note: "나사·열쇠·리모컨을 잃어버리지 않게" },
    ],
  },
  "move-in-report-address-change": {
    title: "주소 변경 서류를 정리하는 물품",
    description: "전입신고 확인서, 정산 내역과 주소 변경 증빙을 일정 기간 모아두면 누락을 확인하기 쉽습니다.",
    suggestions: [
      { label: "서류 파일백", keyword: "A4 서류 파일백", note: "신고서와 정산 영수증을 함께 보관할 때" },
      { label: "라벨기", keyword: "휴대용 블루투스 라벨기", note: "새집 수납함과 서류철을 표시할 때" },
      { label: "우편물 정리함", keyword: "벽걸이 우편물 정리함", note: "주소 변경 전후 우편물을 분리할 때" },
    ],
  },
  "moving-cleaning-guide": {
    title: "입주청소 검수에 필요한 청소도구",
    description: "업체 청소 후에도 바로 확인할 수 있도록 표면별 기본 도구를 준비해 두세요.",
    suggestions: [
      { label: "극세사 걸레", keyword: "극세사 청소 걸레 세트", note: "가구 안쪽과 창틀의 잔먼지를 확인할 때" },
      { label: "고무장갑", keyword: "청소용 고무장갑", note: "세제와 오염물로부터 손을 보호할 때" },
      { label: "틈새 청소솔", keyword: "창틀 틈새 청소솔 세트", note: "창틀·배수구·모서리를 마무리할 때" },
    ],
  },
  "rental-deposit-moving-out-checklist": {
    title: "퇴거 기록과 서류 보관에 유용한 물품",
    description: "집 상태, 계량기, 열쇠 인계와 비용 정산 기록을 한곳에 보관해 두세요.",
    suggestions: [
      { label: "서류 보관함", keyword: "계약서 서류 보관함", note: "임대차계약서와 정산 자료를 모을 때" },
      { label: "휴대용 줄자", keyword: "휴대용 자동 줄자", note: "수리 부위와 원상복구 범위를 기록할 때" },
      { label: "열쇠 라벨", keyword: "열쇠 이름표 라벨", note: "열쇠와 출입카드를 구분해 인계할 때" },
    ],
  },
  "moving-with-pets": {
    title: "반려동물과 안전하게 이동하는 준비물",
    description: "익숙한 냄새가 묻은 물건과 안전한 이동수단을 미리 준비하고 새집에서는 천천히 적응시켜 주세요.",
    suggestions: [
      { label: "반려동물 이동장", keyword: "반려동물 안전 이동장", note: "낯선 이동 중 안전한 공간을 만들 때" },
      { label: "배변패드", keyword: "반려동물 배변패드", note: "이동 전후 긴장으로 생길 수 있는 실수에 대비할 때" },
      { label: "차량용 안전벨트", keyword: "반려동물 차량용 안전벨트", note: "차량 안에서 갑작스러운 움직임을 막을 때" },
    ],
  },
  "easy-interior-ideas-for-beginners": {
    title: "작은 변화부터 시작하는 인테리어 준비물",
    description: "공간을 정확히 재고 조명과 이동 가능한 소품부터 바꾸면 큰 공사 없이도 분위기를 조절할 수 있습니다.",
    suggestions: [
      { label: "레이저 줄자", keyword: "가정용 레이저 거리측정기", note: "가구와 공간 치수를 빠르게 확인할 때" },
      { label: "무타공 후크", keyword: "인테리어 무타공 후크", note: "벽 손상을 줄이며 소품을 배치할 때" },
      { label: "간접조명", keyword: "인테리어 LED 간접조명", note: "공간의 밝기와 분위기를 나눠 조절할 때" },
    ],
  },
};

export function getShoppingGuide(slug: string) {
  return shoppingGuides[slug];
}
