export type ServiceModule = {
  /** 슬러그·조합에 쓰는 영문 id */
  id: string;
  /** 본문에서 부르는 이름. 예: 문수리 */
  name: string;
  /** 슬러그와 제목 앞에 지역과 붙는 표기. 예: 문수리 */
  keyword: string;
  /** 지역과 붙여 찾는 다른 표기. H2·보조 키워드에 나눠 쓴다. */
  keywordForms: string[];
  /** 제목 꼬리 3가지. 문제해결형·판단형·비교형 순서. */
  titleTails: [string, string, string];
  /** data/affiliate-links.json의 숨고 링크 key */
  quoteKey: string;
  /** data/soomgo-prices.json의 key. 예상금액이 없으면 생략 */
  priceKey?: string;
  hero: { src: string; alt: string };
  /** 첫 화면 즉답 3가지. 문제해결형·판단형·비교형 순서. 지역명 없이 완성된 문장 2개 이내 */
  answers: [string, string, string];
  /** 증상별 원인과 조치 표 */
  symptoms: { sign: string; cause: string; action: string }[];
  /** 수리·교체·셀프 판단 표 */
  decisions: { state: string; verdict: string; reason: string }[];
  /** 방법 비교 표 */
  options: { name: string; when: string; limit: string }[];
  /** 견적이 달라지는 항목 */
  costFactors: string[];
  self: {
    /** 셀프로 가능한 범위 한두 문장 */
    scope: string;
    steps: string[];
    /** q는 쿠팡 검색어. data/coupang-links.json의 키가 된다 */
    materials: { q: string; why: string }[];
    /** 여기서 멈추고 전문가를 부르는 기준 */
    stop: string[];
  };
  /** 견적 요청서에 넣을 사진 3장 */
  photos: [string, string, string];
  /** 견적 받을 때 물어볼 질문 */
  ask: string[];
  /** 자주 하는 실수 */
  mistakes: string[];
  faq: { q: string; a: string }[];
  /** 건물 연식별 포인트. old: 준공 25년 이상, mid: 10~25년, recent: 10년 미만 */
  ageHints: { old: string; mid: string; recent: string };
  /** 이어서 볼 서비스 id */
  related: string[];
  /** 사이트에 이미 있는 일반 가이드 슬러그 */
  guide?: string;
  /** 전기·가스·높은 곳·구조체처럼 위험이 큰 작업의 경고 */
  safety?: string;
};
