import type { Article, ArticleImage } from "./articles";
import { gyeonggiRegionTree } from "./regional-articles";
import { repairQuoteLink, repairSupplyLink } from "./affiliate-match";

const PUBLISHED_AT = "2026-09-03T00:30:00.000Z";
const UPDATED_AT = "2026-09-03T00:30:00.000Z";
const KCA_GUIDE = "https://www.kca.go.kr/home/sub.do?menukey=4005&mode=view&no=1001947436&page=9";
const FIRE_DOOR_RULE = "https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lspttninfSeq=170337";

const keywordText = `
ABS도어깨짐
ABS문구멍
실내문구멍
실내문깨짐
원룸문구멍
문구멍수리
방문구멍
방문깨짐
문복원수리
깨진방문
방화문수리
문교체
방화문교체
문고리교체비용
문짝교체비용
방화문교체비용
화장실문수리
방문수리
문교체비용
대문교체
방화문설치비용
미닫이문수리
방문교체공사
상가문교체
아파트현관문가격
방문틀교체
아파트방화문교체
화장실문보수
문턱제거
대전문수리
문수리비용
철문수리
대구방문교체
부산화장실문교체
상가유리문가격
자동문수리비용
방문짝교체
문수리업체
문수리박사
미닫이문교체
방화문설치가격
대전현관문교체
부산방문교체
대구현관문수리
부산방화문교체
방화문보수
다용도실문교체
현관문수리비용
대문수리
방문리모델링
매장문수리
목포문수리
삼성현관문
부산방화문설치
방문보수
주택현관문교체
대전방화문
대전화장실문교체
방화문수리비용
대구문교체
방문교체가격
미닫이문설치가격
문틀수리비용
문짝경첩수리
문손잡이교체방법
방화문교체가격
대구방화문교체
부천방화문수리
부천유리문수리
분당현관문수리
사무실미닫이문
대구문설치
문고리설치
문고리교체업체
서산문수리
서울자동문수리
성남유리문수리
세종문수리
대전자동문설치
문경첩교체
방문교체견적
방문교체업체
목문설치
방문부분수리
방문문짝교체
방화문공사
평택문수리
평택ABS문수리
평택문구멍수리
화장실문교체비용
평택강화도어수리
평택중문수리
평택방화문
평택강화도어
현관
현관문업체
천안중문
출입문설치
주택현관문교체비용
현관문견적
철문시공
청주현관문
평택자동문
창고문수리
제주문수리
강화유리수리
평택싱크대
평택수전교체
송탄집수리
철문교체비용
화장실문설치
철대문제작
출입문시공
평택폴딩도어
출입문공사
주택대문수리
화성방화문
강화도어유리문
철문보수
평택수도공사
현관문설치비용
진주문수리
현관문
포항변기교체
평택샷시
속초방화문
속초현관문
화장실문짝수리
현관문복원
평택문교체
집방문교체
수원중문
동탄중문
처진문수리
창원현관문교체
창원방문수리
방문만들기
천안방화문수리
창원문교체
창고문교체
화장실문수리비용
주택현관문수리
현관문수리비
현관문수리가격
춘천문수리
충주문수리
평택현관문
문틀크기
현관문교체가격
판교문수리
파주유리문수리
드레스룸문제작
평택거울
평택자동문수리
오산방화문
시흥현관문수리
수원자동문설치
오산중문
고양시자동문
동탄자동문
화성중문
이천방화문
시흥자동문
포천방화문
경기방화문
양평자동문
의정부중문
부천중문
인천현관중문
수원강화도어
성남중문
안산방화문
인천씽크대교체
샤워장공사
인천유리제작
양평싱크대
남양주씽크대공장
오산싱크대공장
광명씽크대
용인씽크대공장
이천씽크대
강남유리문수리
남양주중문
안성중문
경기광주설비업체
농가주택수리
`;

export const repairTargetKeywords = keywordText.trim().split("\n").map((keyword) => keyword.trim()).filter(Boolean);

type Topic = {
  id: string;
  label: string;
  object: string;
  diagnostic: string;
  repairDecision: string;
  estimateItems: string;
  completion: string;
  image: string;
  canonicalSlug: string;
};

const topics: Record<string, Topic> = {
  hole: { id: "door-hole", label: "문구멍·깨짐 복원", object: "표면재, 내부 심재, 모서리와 경첩 고정부", diagnostic: "구멍의 크기뿐 아니라 눌림과 균열이 퍼진 범위, 앞뒷면 상태를 확인해야 합니다.", repairDecision: "심재가 단단하고 국소 손상이라면 부분 복원을, 변형·수분 손상·체결부 파손이 크다면 문짝 교체를 비교합니다.", estimateItems: "보강, 면 맞춤, 색·무늬 보정, 문 탈거와 재설치, 교체 대안", completion: "복원면의 높이와 색 차이, 문 여닫힘과 재균열 가능성", image: "/images/door-repair/abs-door-hole-repair.webp", canonicalSlug: "interior-door-hole-repair-guide" },
  fire: { id: "fire-door", label: "방화문 수리·교체", object: "문짝과 문틀, 경첩, 도어클로저와 래치", diagnostic: "바닥 끌림, 자동 닫힘, 래치 체결과 문짝·문틀 변형을 함께 확인해야 합니다.", repairDecision: "부속 조정으로 성능을 유지할 수 있는지, 변형·부식·천공 때문에 전체 교체가 필요한지 전문 점검으로 구분합니다.", estimateItems: "요구 성능, 문짝·문틀, 적합한 부속, 철거·폐기, 주변 마감과 관련 서류", completion: "여러 각도에서 자동으로 닫히는지, 래치 체결과 문틀 간격", image: "/images/door-repair/fire-door-inspection.webp", canonicalSlug: "fire-door-repair-replacement-guide" },
  handle: { id: "door-hardware", label: "문고리·경첩 수리", object: "손잡이, 래치, 경첩, 나사 고정부와 문틀 받이", diagnostic: "손잡이가 헛도는지, 래치가 걸리지 않는지, 문이 어느 지점에 닿는지를 따로 봐야 합니다.", repairDecision: "같은 규격 부품 교체로 해결되는지, 문짝 내부나 문틀 고정부 보강까지 필요한지 구분합니다.", estimateItems: "부품 규격, 문 탈거, 경첩·래치 조정, 문틀 보강과 출장", completion: "손잡이 복귀, 잠금, 마찰과 나사 풀림", image: "/images/door-repair/interior-door-measurement.webp", canonicalSlug: "door-handle-hinge-sagging-repair" },
  sliding: { id: "sliding-middle-door", label: "미닫이문·중문", object: "레일, 롤러, 가이드, 스토퍼, 프레임과 유리", diagnostic: "특정 지점의 걸림, 전체 구간의 무거움, 흔들림과 문짝 정렬을 영상으로 확인해야 합니다.", repairDecision: "호환 롤러와 레일 조정으로 해결되는지, 프레임·패널 변형 때문에 세트 교체가 필요한지 비교합니다.", estimateItems: "롤러·레일·가이드, 문짝·유리, 프레임, 철거·폐기와 바닥 마감", completion: "끝까지 부드럽게 움직이는지, 이탈방지와 손 끼임", image: "/images/repair-install/window-folding-door.webp", canonicalSlug: "sliding-middle-door-repair-installation" },
  automatic: { id: "automatic-glass-door", label: "자동문·강화도어", object: "센서, 레일·롤러, 모터·제어부, 플로어힌지와 유리", diagnostic: "전원과 센서 반응, 소음 위치, 반복 개폐와 유리 균열을 나눠 확인해야 합니다.", repairDecision: "부품 수리인지 구동부 또는 유리·프레임 교체인지 구분하고 안전 기능은 임의로 해제하지 않습니다.", estimateItems: "진단, 센서·롤러·모터·힌지, 유리 제작, 야간 작업과 임시 출입 동선", completion: "안전센서, 닫힘 속도, 정렬과 보행자 통과 안전", image: "/images/door-repair/commercial-glass-door-inspection.webp", canonicalSlug: "commercial-glass-automatic-door-repair-cost" },
  glass: { id: "custom-glass-mirror", label: "유리·거울 제작", object: "유리 종류와 두께, 모서리, 타공, 프레임과 고정 부품", diagnostic: "균열과 모서리 손상, 실측 오차와 운반 동선을 제작 전에 확인해야 합니다.", repairDecision: "깨진 강화유리의 임의 접착보다 안전한 교체를 우선 검토하고 프레임 손상도 함께 봅니다.", estimateItems: "재단, 면취·타공, 필름, 운반·양중, 철거·폐기와 설치", completion: "모서리, 흔들림, 고정 부품과 벽에서 들뜬 부분", image: "/images/door-repair/commercial-glass-door-inspection.webp", canonicalSlug: "custom-mirror-glass-installation-guide" },
  entrance: { id: "entrance-steel-gate", label: "현관문·철문·대문", object: "문짝과 문틀, 경첩, 잠금장치, 부식과 바닥 단차", diagnostic: "문이 닿는 위치, 잠금 정렬, 표면 녹과 구조 부식을 구분해야 합니다.", repairDecision: "경첩·도어록·용접과 도장으로 보수할지, 문짝·문틀 전체를 교체할지 비교합니다.", estimateItems: "부속, 용접·방청·도장, 문짝·문틀, 철거·운반과 벽체 마감", completion: "닫힘과 잠금, 날카로운 모서리, 외부문의 빗물 유입", image: "/images/door-repair/fire-door-inspection.webp", canonicalSlug: "entrance-steel-gate-repair-cost" },
  bathroomDoor: { id: "bathroom-door", label: "화장실·다용도실문", object: "문 하단, 표면 들뜸, 문틀, 경첩과 습기 원인", diagnostic: "깨짐만 보지 말고 물을 먹어 부푼 범위와 환기·누수 가능성을 확인해야 합니다.", repairDecision: "국소 보수로 유지 가능한지, 내습성이 맞는 문짝과 문틀 교체가 필요한지 비교합니다.", estimateItems: "문짝, 문틀·문선, 하단 마감, 부속, 철거·폐기와 주변 타일·벽지", completion: "바닥 간격, 하단 마감, 여닫힘과 반복 습기 노출", image: "/images/repair-install/custom-door-installation.webp", canonicalSlug: "interior-door-replacement-cost-guide" },
  interior: { id: "interior-door", label: "방문 수리·교체", object: "문짝, 문틀·문선, 경첩, 손잡이와 바닥 간격", diagnostic: "표면 손상인지 문짝 변형인지, 문틀 수직과 경첩 고정부가 온전한지 확인해야 합니다.", repairDecision: "부분 보수, 문짝만 교체, 문틀까지 교체하는 세 대안을 같은 조건으로 비교합니다.", estimateItems: "문짝·문틀·문선, 맞춤 가공, 부속, 철거·폐기와 도배·바닥 마감", completion: "문틀과의 간격, 잠금, 색 차이와 주변 마감", image: "/images/door-repair/interior-door-measurement.webp", canonicalSlug: "interior-door-replacement-cost-guide" },
  sink: { id: "sink-faucet", label: "싱크대·수전", object: "상·하부장, 상판, 수전·싱크볼, 급수밸브와 배수관", diagnostic: "누수 위치와 목재 부풀음, 급배수 연결, 가전과 벽의 간섭을 확인해야 합니다.", repairDecision: "수전·트랩 같은 부품 수리인지, 손상된 장과 상판까지 교체할지 나눠 봅니다.", estimateItems: "장, 상판, 수전·싱크볼, 철거·폐기, 급배수, 실리콘과 벽 마감", completion: "냉온수 연결, 배수 속도, 누수와 문짝·서랍 간격", image: "/images/repair-install/kitchen-sink-plumbing.webp", canonicalSlug: "kitchen-sink-faucet-replacement-guide" },
  bathroom: { id: "bathroom-fixture", label: "욕실 설비·샤워장", object: "변기 급배수, 바닥, 유리, 힌지와 실리콘·방수 마감", diagnostic: "도기 흔들림·누수와 샤워 공간의 배수·유리 고정을 따로 확인해야 합니다.", repairDecision: "부속 조정과 재고정인지, 도기·유리와 바탕 공사까지 필요한지 구분합니다.", estimateItems: "제품·유리, 철거·폐기, 급배수, 타일·방수, 하드웨어와 양생", completion: "누수, 흔들림, 유리 모서리, 문 정렬과 물 빠짐", image: "/images/repair-install/bathroom-fixture-repair.webp", canonicalSlug: "bathroom-toilet-shower-renovation-guide" },
  window: { id: "sash-folding-door", label: "샷시·폴딩도어", object: "창짝과 프레임, 패킹, 잠금장치, 레일·롤러와 외부 실란트", diagnostic: "틈바람·누수·결로와 작동 불량을 구분하고 실내외 상태를 함께 확인해야 합니다.", repairDecision: "부속·패킹·실란트 보수인지, 변형된 프레임과 유리까지 교체할지 비교합니다.", estimateItems: "창호·유리, 하드웨어, 철거·폐기, 실란트, 외부 작업과 내부 마감", completion: "잠금, 배수구, 기밀, 패널 작동과 유리 고정", image: "/images/repair-install/window-folding-door.webp", canonicalSlug: "window-sash-folding-door-repair-guide" },
  plumbing: { id: "home-repair-plumbing", label: "집수리·설비", object: "누수 원인, 배관과 밸브, 철거 범위, 벽·바닥과 연결 공정", diagnostic: "물이 보이는 곳과 실제 고장 지점이 다를 수 있어 원인 조사 범위를 먼저 정해야 합니다.", repairDecision: "부분 설비 수리인지, 바탕과 마감까지 포함한 복합 공사인지 공정별로 구분합니다.", estimateItems: "진단, 설비, 철거, 자재, 벽·바닥 복구, 폐기물과 공정별 책임", completion: "누수 재확인, 가려지기 전 배관 사진, 마감과 하자 접수", image: "/images/repair-install/home-repair-inspection.webp", canonicalSlug: "home-repair-plumbing-estimate-guide" },
  custom: { id: "custom-door-install", label: "맞춤문·출입문 시공", object: "개구부, 문짝과 문틀, 벽 두께, 바닥 단차와 열림 방향", diagnostic: "폭·높이뿐 아니라 대각선, 경첩·손잡이 위치와 주변 간섭을 실측해야 합니다.", repairDecision: "기존 문틀 활용, 문짝 맞춤 제작, 개구부와 문틀 전체 공사 중 필요한 범위를 정합니다.", estimateItems: "제작 자재, 맞춤 가공, 부속, 철거·폐기, 설치와 벽·바닥 마감", completion: "수직·간격, 여닫힘, 잠금과 마감·안전", image: "/images/repair-install/custom-door-installation.webp", canonicalSlug: "custom-door-installation-construction-guide" },
};

function topicFor(keyword: string): Topic {
  if (/싱크|씽크|수전/.test(keyword)) return topics.sink;
  if (/샤워|변기/.test(keyword)) return topics.bathroom;
  if (/샷시|폴딩/.test(keyword)) return topics.window;
  if (/수도|설비|집수리|농가주택/.test(keyword)) return topics.plumbing;
  if (/방화문/.test(keyword)) return topics.fire;
  if (/자동문|강화도어/.test(keyword)) return topics.automatic;
  if (/유리|거울/.test(keyword)) return topics.glass;
  if (/화장실문|다용도실문/.test(keyword)) return topics.bathroomDoor;
  if (/미닫이|중문/.test(keyword)) return topics.sliding;
  if (/문고리|손잡이|경첩|처진문|문틀크기|문턱/.test(keyword)) return topics.handle;
  if (/구멍|깨짐|깨진|복원/.test(keyword)) return topics.hole;
  if (/현관|철문|대문|창고문/.test(keyword)) return topics.entrance;
  if (/설치|시공|공사|제작|만들기/.test(keyword)) return topics.custom;
  return topics.interior;
}

const regionalAliases: Array<[RegExp, string]> = [
  [/^경기광주/, "광주시"], [/^고양시/, "고양시"], [/^남양주/, "남양주시"], [/^의정부/, "의정부시"],
  [/^부천/, "부천시"], [/^분당|^판교|^성남/, "성남시"], [/^평택|^송탄/, "평택시"], [/^화성|^동탄/, "화성시"],
  [/^수원/, "수원시"], [/^파주/, "파주시"], [/^오산/, "오산시"], [/^시흥/, "시흥시"], [/^이천/, "이천시"],
  [/^포천/, "포천시"], [/^양평/, "양평군"], [/^안산/, "안산시"], [/^광명/, "광명시"], [/^용인/, "용인시"], [/^안성/, "안성시"],
];

const namedRegions = ["경기광주", "고양시", "남양주", "의정부", "부천", "분당", "판교", "성남", "평택", "송탄", "화성", "동탄", "수원", "파주", "오산", "시흥", "이천", "포천", "양평", "안산", "광명", "용인", "안성", "대전", "대구", "부산", "목포", "서산", "서울", "세종", "천안", "청주", "제주", "진주", "포항", "속초", "창원", "춘천", "충주", "인천", "강남", "경기"];

export function regionOf(keyword: string) {
  return namedRegions.find((region) => keyword.startsWith(region));
}

function regionTreeFor(keyword: string, topic: Topic): Article["regionTree"] {
  const city = regionalAliases.find(([pattern]) => pattern.test(keyword))?.[1];
  if (!city) return undefined;
  const district = gyeonggiRegionTree.districts.find((item) => item.name === city);
  if (!district) return undefined;
  return {
    title: `${city} ${topic.label} 관련 지역 정보`,
    description: `${keyword}의 핵심 판단 기준을 확인한 뒤 ${city} 하위 지역의 건물·주차·작업 동선 정보를 이어서 살펴보세요.`,
    districts: [{ ...district, dongs: district.dongs.slice(0, 6) }],
  };
}

function intentOf(keyword: string) {
  if (/방법/.test(keyword)) return "method";
  if (/비용|가격|견적/.test(keyword)) return "cost";
  if (/업체|박사|공장/.test(keyword)) return "provider";
  if (/설치|시공|공사|제작|만들기/.test(keyword)) return "install";
  if (/교체/.test(keyword)) return "replace";
  if (/수리|보수|복원|깨짐|구멍|처진/.test(keyword)) return "repair";
  return "overview";
}

function titleFor(keyword: string, intent: string) {
  if (intent === "method") return `${keyword}, 직접 작업 전 규격과 안전 확인법`;
  if (intent === "cost") return `${keyword}, 견적이 달라지는 항목은 무엇일까?`;
  if (intent === "provider") return `${keyword}, 업체 선택 전 확인할 작업 범위`;
  if (intent === "install") return `${keyword}, 설치 전 실측과 견적 체크리스트`;
  if (intent === "replace") return `${keyword}, 교체 전에 수리 가능성부터 확인하세요`;
  if (intent === "repair") return `${keyword}, 원인 진단부터 견적 비교까지`;
  return `${keyword}, 수리·교체 전에 확인할 핵심 기준`;
}

function imageFor(keyword: string, topic: Topic): ArticleImage {
  return {
    src: topic.image,
    alt: `${keyword} 상담 전 ${topic.object} 상태를 확인하는 현장`,
    title: `${keyword} 현장 점검`,
    caption: `${keyword}은 증상 한 가지보다 손상 범위와 설치 환경을 함께 확인해야 작업 범위를 정확히 정할 수 있습니다.`,
  };
}

function specialContext(keyword: string) {
  if (/ABS/.test(keyword)) return "ABS도어는 표면 시트와 내부 심재의 손상 범위를 나눠 보고, 비슷한 색과 무늬로 어느 정도까지 복원 가능한지 확인해야 합니다.";
  if (/화장실|다용도실/.test(keyword)) return "습기가 많은 공간은 하단 부풀음과 표면 들뜸, 누수·환기 원인을 남겨두면 같은 손상이 반복될 수 있습니다.";
  if (/상가|매장|사무실/.test(keyword)) return "영업 공간은 작업 중 출입 통제, 임시 동선과 가능한 작업시간을 미리 정해야 안전과 영업 차질을 함께 관리할 수 있습니다.";
  if (/원룸/.test(keyword)) return "임대 원룸은 작업 전에 임대인과 복원 기준을 맞추고 전후 사진과 작업 내역을 보관하는 편이 좋습니다.";
  if (/아파트/.test(keyword)) return "공동주택은 관리사무소의 작업시간, 엘리베이터 보양과 폐기물 반출 규정을 먼저 확인하세요.";
  if (/주택|농가/.test(keyword)) return "단독·농가주택은 바닥 수평, 오래된 바탕과 배관, 대문 폭과 자재 반입 동선을 현장에서 확인해야 합니다.";
  if (/삼성현관문|문수리박사/.test(keyword)) return "이 검색어는 업체명·제품명으로도 쓰일 수 있으므로 이름만으로 서비스 범위나 품질을 단정하지 말고 실제 사업자 정보와 견적 항목을 확인해야 합니다.";
  return "같은 이름의 작업이라도 자재, 손상 범위와 현장 접근 조건에 따라 필요한 공정과 견적이 달라질 수 있습니다.";
}

function actionText(intent: string, keyword: string) {
  if (intent === "method") return `${keyword}을 직접 하기 전 제품 설명서와 규격을 확인하고, 유리·방화문·중량문 또는 추가 타공이 필요한 작업은 전문 점검을 우선하세요.`;
  if (intent === "cost") return `${keyword}은 한 금액만 묻기보다 기본 작업과 추가 가능 항목, 자재·철거·마감의 포함 여부를 같은 표로 비교해야 합니다.`;
  if (intent === "provider") return `${keyword} 검색 결과의 상호나 광고 문구보다 진단 근거, 항목별 견적, 작업 사례와 사후보수 접수 방법을 확인하세요.`;
  if (intent === "install") return `${keyword}은 제작이나 부품 주문 전에 실측 책임과 설치 바탕, 주변 마감 범위를 확정해야 재작업을 줄일 수 있습니다.`;
  if (intent === "replace") return `${keyword}을 결정하기 전 부속 또는 부분 수리 대안과 전체 교체 견적을 같은 포함 범위로 비교하세요.`;
  return `${keyword}은 증상을 임시로 가리는 작업보다 원인과 손상 범위를 먼저 확인한 뒤 필요한 부분만 수리하는 것이 중요합니다.`;
}

function makeKeywordArticle(keyword: string, index: number): Article {
  const topic = topicFor(keyword);
  const intent = intentOf(keyword);
  const region = regionOf(keyword);
  const regionalText = region
    ? `${region}에서 ${topic.label} 견적을 받을 때도 실제 서비스 가능 여부, 출장 조건, 주차·승강기와 폐기물 반출 동선을 업체마다 확인해야 합니다. 확인되지 않은 지역 고정가격은 기준으로 삼지 마세요.`
    : "지역 업체를 비교할 때는 서비스 가능 범위와 출장 조건, 주차·승강기와 폐기물 반출 동선을 같은 정보로 전달하세요.";
  const ambiguous = /삼성현관문|문수리박사/.test(keyword);
  const quote = repairQuoteLink(topic.id);
  const supply = repairSupplyLink(topic.id, keyword);

  return {
    slug: `repair-keyword-${String(index + 1).padStart(3, "0")}-${topic.id}`,
    title: titleFor(keyword, intent),
    description: `${keyword} 검색자가 확인해야 할 손상 원인, 수리·교체 기준, 사진 견적 준비와 작업 완료 검수 항목을 정리했습니다.`,
    category: "repair-install",
    categoryLabel: "수리·설치",
    keyword,
    secondaryKeywords: [topic.label, `${topic.label} 비용`, `${topic.label} 견적`, region ? `${region} 수리업체` : "수리업체 선택"],
    readingTime: 7,
    publishedAt: PUBLISHED_AT,
    updatedAt: UPDATED_AT,
    accent: ["amber", "mint", "blue", "violet", "green", "rose"][index % 6],
    affiliateNotice: true,
    heroImage: imageFor(keyword, topic),
    breadcrumbs: [
      { name: "수리·설치", href: "/category/repair-install" },
      { name: topic.label, href: `/articles/${topic.canonicalSlug}` },
    ],
    regionTree: regionTreeFor(keyword, topic),
    intro: `${keyword}을 알아볼 때 가장 먼저 할 일은 ${topic.object}의 상태를 한 장면에 담는 것입니다. ${topic.diagnostic} ${specialContext(keyword)} ${actionText(intent, keyword)}`,
    sections: [
      {
        heading: `${keyword}, 먼저 어떤 상태인지 구분하세요`,
        paragraphs: [
          `${topic.diagnostic} 문이나 설비 전체가 보이는 사진과 문제가 나타나는 순간의 가까운 사진·영상을 함께 준비하면 상담 단계의 오해를 줄일 수 있습니다.`,
          `${specialContext(keyword)} 안전상 위험이 있거나 사용 중 손상이 커진다면 억지로 작동시키지 말고 접근을 막은 뒤 점검을 받으세요.`,
        ],
      },
      {
        heading: "사진 견적에 필요한 치수와 현장 정보",
        paragraphs: [
          `${topic.object}이 한 화면에 보이도록 촬영하고 자를 대어 폭·높이와 손상 범위를 표시하세요. 바닥, 벽, 주변 가구와 연결 부품도 함께 보여야 작업 공간과 간섭을 판단할 수 있습니다.`,
          `${regionalText} 엘리베이터와 계단, 차량이 설 수 있는 위치, 작업 가능한 시간도 알려주면 현장 추가 항목을 줄이는 데 도움이 됩니다.`,
        ],
        checklist: ["전체 모습과 손상 부위", "가로·세로 또는 제품 규격", "작동 영상", "바닥·벽·연결 부품", "주차·운반 동선", "희망 작업 범위"],
      },
      {
        heading: `${intent === "replace" ? "수리와 교체" : "필요한 작업 범위"}를 결정하는 기준`,
        paragraphs: [
          `${topic.repairDecision} 겉으로 보이는 증상만 가리는 방식보다 원인이 남아 다시 문제가 생길 가능성까지 물어보세요.`,
          `관련 기본 판단은 [${topic.label} 종합 가이드](/articles/${topic.canonicalSlug})에서 이어서 확인할 수 있습니다. 현재 페이지의 ${keyword} 조건과 종합 가이드의 수리·교체 기준을 함께 사용하세요.`,
          ...(supply
            ? [`부속만 바꾸면 되는 상태라면 규격을 먼저 재고 [${supply.label.replace(/^오늘의집 /u, "")} 제품 종류](${supply.url})를 살펴보세요. 다만 규격이 맞지 않거나 고정부·바탕이 손상됐다면 자재 교체만으로는 같은 문제가 다시 생길 수 있습니다.`]
            : []),
        ],
      },
      {
        heading: `${keyword} 견적서에서 빠지기 쉬운 항목`,
        paragraphs: [
          `견적에는 ${topic.estimateItems}을 구분해 적으세요. 기본 작업과 현장에서 추가될 수 있는 항목, 추가 작업 전 승인 방법도 확인해야 합니다.`,
          `${actionText(intent, keyword)} 가격은 업체·자재·현장 조건에 따라 달라질 수 있으므로 확인되지 않은 고정금액이나 지역 평균가를 사실처럼 믿지 않는 편이 좋습니다.`,
          `같은 사진과 치수를 여러 곳에 보내 비교하려면 [${quote.label.replace(/^숨고 /u, "")} 견적을 받아](${quote.url}) 항목별 금액을 나란히 확인해 보세요. 한 곳의 금액만으로는 무엇이 빠졌는지 판단하기 어렵습니다.`,
        ],
      },
      {
        heading: "업체를 비교할 때 가격 외에 볼 것",
        paragraphs: [
          `${ambiguous ? "특정 상호나 제품으로 보이는 검색어라면 공식 사업자 정보와 실제 계약 상대를 먼저 확인하세요. " : ""}진단 이유를 설명하는지, 비슷한 작업 사례의 범위가 현재 현장과 맞는지, 자재와 부품을 구체적으로 적는지 살펴보세요.`,
          "작업자와 결제 상대가 다른 경우 책임 주체를 확인하고 견적서·영수증·변경 승인 기록을 보관하세요. 사후보수 대상과 제외 조건, 접수 방법도 작업 전에 확인합니다.",
        ],
      },
      {
        heading: "작업 완료 직후 검수할 사항",
        paragraphs: [
          `${topic.completion}을 직접 확인하세요. 문제가 나타났던 동작을 여러 번 재현하고 새로운 소음, 흔들림, 누수나 마감 손상이 없는지 살펴봅니다.`,
          "작업 전후 사진과 교체 부품·자재 내역을 같은 폴더에 보관하세요. 현장에서 범위가 바뀌었다면 변경 이유와 금액, 보수 책임이 작업서에 반영됐는지 확인합니다.",
        ],
        checklist: ["원래 증상 해결 여부", "여닫힘·작동·잠금", "흔들림·누수·소음", "주변 마감", "철거물 정리", "작업서·영수증·보수 연락처"],
      },
    ],
    faq: [
      { question: `${keyword}은 사진만으로 견적을 확정할 수 있나요?`, answer: `사진은 범위를 좁히는 데 도움이 되지만 ${topic.object}의 실제 상태와 현장 접근 조건에 따라 달라질 수 있습니다. 확정 견적의 조건과 현장 추가 기준을 확인하세요.` },
      { question: `${keyword}은 수리와 교체 중 무엇이 나은가요?`, answer: `${topic.repairDecision} 비용뿐 아니라 예상 사용기간, 마감 차이와 반복 고장 가능성을 함께 비교하세요.` },
      { question: `${keyword} 업체를 고를 때 무엇을 물어봐야 하나요?`, answer: `진단 이유, ${topic.estimateItems}, 작업시간, 완료 검수와 사후보수 범위를 항목별로 물어보세요.` },
      { question: "지역에 따라 비용이 정해져 있나요?", answer: "지역명만으로 고정되지 않습니다. 출장, 주차·운반, 작업시간, 자재와 실제 손상 범위에 따라 달라질 수 있으므로 같은 현장 정보를 보내 비교하세요." },
    ],
    source: { label: topic === topics.fire ? "국가법령정보센터 건축물 방화구조 관련 규칙" : "한국소비자원 주택 인테리어 피해예방 안내", url: topic === topics.fire ? FIRE_DOOR_RULE : KCA_GUIDE },
  };
}

export const repairKeywordArticles: Article[] = repairTargetKeywords.map(makeKeywordArticle);

if (new Set(repairTargetKeywords).size !== repairTargetKeywords.length) throw new Error("중복된 수리·설치 타깃 키워드가 있습니다.");
if (new Set(repairKeywordArticles.map((article) => article.slug)).size !== repairKeywordArticles.length) throw new Error("중복된 수리·설치 URL이 있습니다.");
