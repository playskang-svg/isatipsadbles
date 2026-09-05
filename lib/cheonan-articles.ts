import type { Article } from "./articles";
import { linkUrl } from "./affiliate";

const ADMIN_SOURCE = {
  label: "행정안전부 2026년 지방자치단체 행정구역 및 인구 현황(2025.12.31. 기준)",
  url: "https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1041",
};

const MOVING_COMPARE = linkUrl("move-cpa-isatime");
const TWO_QUOTES = linkUrl("move-compare-2");
const PACKING_MOVE = linkUrl("move-packing");
const CLEANING_COMPARE = linkUrl("move-cleaning");
const INSTALL_REPAIR = linkUrl("repair-soomgo-aircon");
const TV_MOUNT = linkUrl("repair-soomgo-tv-mount");

const HERO_MOVE = "/images/moving-field/living-a04-14.webp";
const HERO_TV = "/images/moving-field/living-a03-12.webp";

type Focus = "quote" | "apartment" | "studio" | "cleaning" | "aircon" | "tv";

type UnitProfile = {
  name: string;
  slug: string;
  focus: Focus;
  character: string;
  housing: string;
  access: string;
};

type DistrictProfile = {
  name: string;
  slug: string;
  character: string;
  transport: string;
  housing: string;
  moving: string;
  units: UnitProfile[];
};

const dongnamUnits: UnitProfile[] = [
  { name: "목천읍", slug: "cheonan-dongnam-mokcheon-eup-moving", focus: "apartment", character: "독립기념관과 목천 중심지, 외곽 마을이 넓게 이어지는 동부 생활권", housing: "읍내 아파트와 빌라, 단독주택·농가주택이 함께 분포합니다.", access: "읍내 공동주택은 관리 규정을, 외곽 주소는 마을길 폭과 집 앞 주차 가능 여부를 따로 확인해야 합니다." },
  { name: "풍세면", slug: "cheonan-dongnam-pungse-myeon-moving", focus: "quote", character: "산업시설과 농촌 마을, 단독주택이 나란히 있는 남부 면 지역", housing: "공동주택보다 단독·다가구와 창고가 딸린 주거를 만날 가능성이 큽니다.", access: "공장 출퇴근과 화물차 이동 시간, 마을 진입로 폭을 고려해 큰 차량의 최종 접근 경로를 확인하세요." },
  { name: "광덕면", slug: "cheonan-dongnam-gwangdeok-myeon-moving", focus: "quote", character: "광덕산 자락과 계곡, 마을이 넓게 흩어진 산지·농촌 생활권", housing: "마당·창고가 있는 단독주택과 농가주택의 외부 짐이 견적에서 빠지기 쉽습니다.", access: "경사와 굽은 마을길은 차량 크기와 환적 여부에 영향을 줄 수 있어 낮에 촬영한 진입 영상을 보내는 편이 좋습니다." },
  { name: "북면", slug: "cheonan-dongnam-buk-myeon-moving", focus: "quote", character: "천안 동북부의 산지와 하천 주변 마을이 이어지는 면 지역", housing: "단독주택·농가주택과 소규모 공동주택이 분산되어 있습니다.", access: "주소만으로 차량 진입을 판단하지 말고 다리 폭, 마을길 회차 공간과 현관까지 운반 거리를 확인하세요." },
  { name: "성남면", slug: "cheonan-dongnam-seongnam-myeon-moving", focus: "aircon", character: "농촌 마을과 산업시설이 함께 자리한 동남부 생활권", housing: "단독주택과 기숙사형·다가구 주거 등 건물 조건이 다양합니다.", access: "산업단지 주변 화물 교통과 마을 안쪽의 좁은 진입로를 구분하고, 실외기 위치가 높은 건물은 사진 견적을 받으세요." },
  { name: "수신면", slug: "cheonan-dongnam-susin-myeon-moving", focus: "cleaning", character: "산업시설과 농촌 마을이 넓은 도로를 사이에 두고 분포하는 면 지역", housing: "신축 건물과 오래된 단독주택의 청소·보수 범위가 크게 다를 수 있습니다.", access: "현관 앞 주차가 가능한지, 외부 창고·마당과 공장형 숙소 짐이 있는지를 별도 항목으로 전달하세요." },
  { name: "병천면", slug: "cheonan-dongnam-byeongcheon-myeon-moving", focus: "studio", character: "아우내장터 생활권과 학교·대학가, 주변 농촌 마을이 만나는 동부 거점", housing: "읍내형 상가주택·원룸·빌라와 외곽 단독주택이 섞여 있습니다.", access: "장날과 상가 영업 시간에는 정차 위치가 달라질 수 있고, 원룸은 계단과 복도 폭이 작업시간을 좌우합니다." },
  { name: "동면", slug: "cheonan-dongnam-dong-myeon-moving", focus: "quote", character: "천안 동쪽 경계의 농촌 마을과 산지가 넓게 이어지는 면 지역", housing: "단독주택과 농가 창고, 외부 적재물이 있는 집이 많아 실내 사진만으로는 짐을 계산하기 어렵습니다.", access: "장거리 이동과 마을길 진입, 대형 화분·농기구·창고 짐을 일반 가구와 나눠 견적서에 적으세요." },
  { name: "중앙동", slug: "cheonan-dongnam-jungang-dong-moving", focus: "quote", character: "천안역 동쪽 원도심과 전통시장·상업지가 맞닿은 도심 생활권", housing: "상가주택, 오래된 다가구·빌라와 소규모 공동주택이 촘촘합니다.", access: "시장과 상가 주변은 정차 가능 시간, 골목 폭과 계단 작업을 확인하고 트럭에서 현관까지 실제 운반 거리를 재세요." },
  { name: "문성동", slug: "cheonan-dongnam-munseong-dong-moving", focus: "cleaning", character: "천안역 원도심과 정비 구역, 저층 주거지가 함께 있는 생활권", housing: "노후 단독·다가구와 정비된 공동주택이 가까이 있어 집 상태 차이가 큽니다.", access: "구축은 기존 오염과 손상을, 정비·신축 주택은 공사 먼지와 하자를 청소 전에 나눠 촬영하세요." },
  { name: "원성1동", slug: "cheonan-dongnam-wonseong-1-dong-moving", focus: "quote", character: "원도심의 경사 있는 주택가와 생활도로가 이어지는 지역", housing: "단독·다가구, 빌라와 구축 공동주택이 섞여 있습니다.", access: "골목 경사와 계단, 전선·주차차량 때문에 사다리차 위치가 제한될 수 있어 건물 전면 사진이 중요합니다." },
  { name: "원성2동", slug: "cheonan-dongnam-wonseong-2-dong-moving", focus: "tv", character: "천안 원도심의 저층 주거와 상업 시설이 가까운 생활권", housing: "구축 빌라·아파트는 벽체 마감과 가전 설치 흔적이 집마다 다릅니다.", access: "TV 철거 전 브래킷과 벽 상태를 촬영하고 새집의 콘센트, 벽 재질과 타공 가능 여부를 확인하세요." },
  { name: "봉명동", slug: "cheonan-dongnam-bongmyeong-dong-moving", focus: "studio", character: "봉명역과 병원·상업시설 주변의 아파트, 빌라, 원룸이 섞인 생활권", housing: "소형 주택과 구축 공동주택의 계단·승강기 조건이 다양합니다.", access: "병원·상가 주변 차량 흐름과 주차 단속 구간을 고려하고, 원룸은 기사 도움과 계단 작업 포함 여부를 확인하세요." },
  { name: "일봉동", slug: "cheonan-dongnam-ilbong-dong-moving", focus: "apartment", character: "다가·용곡 생활권의 공동주택과 저층 주거지가 이어지는 남부 도심", housing: "대단지 아파트와 빌라·단독주택이 가까이 있어 같은 동 안에서도 작업 방식이 다릅니다.", access: "아파트는 승강기 예약을, 저층 주거는 골목 주차와 계단 폭을 출발지·도착지 각각 확인하세요." },
  { name: "신방동", slug: "cheonan-dongnam-sinbang-dong-moving", focus: "apartment", character: "천안 남부의 공동주택과 상업시설이 넓게 형성된 주거 생활권", housing: "아파트 비중이 높지만 단지 연식과 지하주차장·승강기 규정은 서로 다릅니다.", access: "단지 출입구, 지하 높이, 엘리베이터 배정과 대형가전 반입 치수를 관리사무소에 먼저 확인하세요." },
  { name: "청룡동", slug: "cheonan-dongnam-cheongnyong-dong-moving", focus: "cleaning", character: "청수 행정타운과 아파트, 외곽 마을이 넓게 연결된 동남부 생활권", housing: "신축·준신축 공동주택과 기존 주택의 입주 준비 항목이 다릅니다.", access: "신축은 하자 확인과 빈집 청소 시간을 먼저 확보하고, 외곽 주소는 차량 진입과 마당 짐을 별도로 점검하세요." },
  { name: "신안동", slug: "cheonan-dongnam-sinan-dong-moving", focus: "studio", character: "천안종합터미널과 신부동 상권, 안서동 대학가가 이어지는 북동 도심", housing: "원룸·오피스텔·다가구와 아파트가 섞여 소형이사 수요가 다양한 지역입니다.", access: "터미널 상권과 대학가 골목은 정차 위치가 중요하고, 원룸은 차량만 필요한지 운반 인력까지 필요한지 먼저 정하세요." },
];

const seobukUnits: UnitProfile[] = [
  { name: "성환읍", slug: "cheonan-seobuk-seonghwan-eup-moving", focus: "quote", character: "성환역을 중심으로 읍내 주거와 북부 농촌 마을이 이어지는 생활권", housing: "역 주변 공동주택·빌라와 외곽 단독주택의 짐 구성과 접근 조건이 다릅니다.", access: "철도역 주변 정차와 장날·상가 시간대를 보고, 외곽은 마을길 폭과 창고·마당 짐을 따로 확인하세요." },
  { name: "성거읍", slug: "cheonan-seobuk-seonggeo-eup-moving", focus: "apartment", character: "서북구청 주변 읍내와 산업시설, 산지 마을이 함께 있는 북부 생활권", housing: "아파트·빌라와 단독주택, 산업시설 배후 주거가 섞여 있습니다.", access: "간선도로에서 건물까지 마지막 진입 구간과 출퇴근 화물 교통을 확인하고 공동주택은 예약 규정을 먼저 물어보세요." },
  { name: "직산읍", slug: "cheonan-seobuk-jiksan-eup-moving", focus: "aircon", character: "직산역과 산업단지·읍내 주거, 농촌 마을이 넓게 이어지는 지역", housing: "아파트와 다가구, 단독주택 및 산업 배후 주거의 설치 조건이 다양합니다.", access: "실외기 위치와 배관 경로, 고소 작업 여부를 사진으로 확인하고 화물차 혼잡 시간과 이사 차량 도착 시간을 분리하세요." },
  { name: "입장면", slug: "cheonan-seobuk-ipjang-myeon-moving", focus: "quote", character: "안성 경계와 가까운 산업시설·농촌 마을 중심의 북부 면 지역", housing: "단독주택과 기숙사형·다가구 주거, 창고 짐이 함께 나올 수 있습니다.", access: "천안 도심 기준 거리만 보지 말고 출발지·도착지 전체 경로와 마을길, 산업단지 화물 교통을 함께 확인하세요." },
  { name: "성정1동", slug: "cheonan-seobuk-seongjeong-1-dong-moving", focus: "quote", character: "구축 주택과 상업시설, 공동주택이 촘촘히 섞인 서북 도심 생활권", housing: "빌라·다가구와 구축 아파트는 주차와 계단 조건이 건물마다 다릅니다.", access: "트럭이 현관 가까이 설 수 있는지, 계단 폭과 사다리차 공간이 있는지를 낮 사진으로 전달하세요." },
  { name: "성정2동", slug: "cheonan-seobuk-seongjeong-2-dong-moving", focus: "studio", character: "상업시설과 오피스텔·원룸, 다가구주택이 밀집한 도심 생활권", housing: "소형 주택이 많아 짐은 적어도 주차·엘리베이터 대기와 운반 거리가 길 수 있습니다.", access: "차량만 빌리는 용달인지 기사 운반과 포장까지 필요한지 구분하고 상가 영업시간과 정차 위치를 확인하세요." },
  { name: "쌍용1동", slug: "cheonan-seobuk-ssangyong-1-dong-moving", focus: "apartment", character: "쌍용 생활권의 아파트와 빌라, 학교·상가가 가까운 주거 지역", housing: "구축 공동주택과 저층 주거의 승강기·계단 조건이 다양합니다.", access: "학교 등하교와 상가 이용 시간대를 피하고 단지별 엘리베이터, 보양과 차량 진입 규정을 확인하세요." },
  { name: "쌍용2동", slug: "cheonan-seobuk-ssangyong-2-dong-moving", focus: "apartment", character: "아파트 단지와 생활 편의시설이 밀집한 서부 주거 생활권", housing: "대단지 아파트는 같은 동에서도 출입구와 해당 동까지 이동 거리가 다릅니다.", access: "지하주차장 높이, 승강기 예약, 이사차량 대기 위치와 냉장고·소파 반입 치수를 함께 확인하세요." },
  { name: "쌍용3동", slug: "cheonan-seobuk-ssangyong-3-dong-moving", focus: "tv", character: "공동주택과 저층 주거가 안정적으로 형성된 쌍용 생활권", housing: "구축 아파트는 기존 TV 브래킷과 벽 마감, 콘센트 위치가 집마다 다릅니다.", access: "이사업체의 운반 범위와 전문기사의 철거·재설치 범위를 나누고 관리사무소의 타공 규정을 확인하세요." },
  { name: "백석동", slug: "cheonan-seobuk-baekseok-dong-moving", focus: "aircon", character: "산업시설과 대단지 공동주택, 상업시설이 맞닿은 서부 생활권", housing: "아파트와 산업시설 배후 주거가 가까워 출퇴근 시간 차량 흐름 차이가 큽니다.", access: "에어컨 실외기실과 배관 경로를 먼저 확인하고 산업단지 화물 교통과 단지 이사시간이 겹치지 않게 잡으세요." },
  { name: "불당1동", slug: "cheonan-seobuk-buldang-1-dong-moving", focus: "apartment", character: "천안시청과 상업·업무시설, 고층 공동주택이 모인 서부 중심 생활권", housing: "아파트와 주상복합은 보양, 지하 진입과 승강기 배정 규정이 세분화되어 있습니다.", access: "단지명과 동·출입구를 정확히 전달하고 관리사무소 예약, 차량 높이와 대형가전 반입 경로를 확인하세요." },
  { name: "불당2동", slug: "cheonan-seobuk-buldang-2-dong-moving", focus: "apartment", character: "신축·준신축 고층 주거와 상업시설이 밀집하고 천안아산역 생활권과 가까운 지역", housing: "대단지 아파트와 주상복합은 지하 동선과 엘리베이터 사용 기준이 서로 다릅니다.", access: "광역교통 이용 시간과 단지 이사 예약을 함께 보고, 입주청소·가전 설치가 이삿짐 반입과 겹치지 않게 조정하세요." },
  { name: "부성1동", slug: "cheonan-seobuk-buseong-1-dong-moving", focus: "studio", character: "두정역·대학가와 원룸, 아파트, 상업시설이 이어지는 북부 도심 생활권", housing: "원룸·오피스텔과 공동주택이 섞여 소형이사부터 가족이사까지 조건이 다양합니다.", access: "대학가 골목과 역세권 정차 위치, 계단·엘리베이터를 확인하고 용달의 기사 도움 범위를 계약서에 적으세요." },
  { name: "부성2동", slug: "cheonan-seobuk-buseong-2-dong-moving", focus: "cleaning", character: "성성동 신축 주거와 차암·신당 일대 산업시설이 함께 있는 북서 생활권", housing: "신축 대단지와 산업시설 배후 주거의 청소·설치 일정이 서로 다릅니다.", access: "신축은 하자점검·청소·짐 반입 순서를 나누고, 산업시설 주변은 화물 교통과 단지 차량 예약 시간을 함께 확인하세요." },
];

const districtProfiles: DistrictProfile[] = [
  {
    name: "동남구",
    slug: "cheonan-dongnam-gu-moving",
    character: "천안역 원도심과 청수·신방의 공동주택지, 목천·병천·광덕 등 넓은 읍·면 지역이 함께 있는 구",
    transport: "천안역·종합터미널 주변 도심 교통과 동부·남부 읍면의 장거리 이동을 같은 기준으로 계산하기 어렵습니다.",
    housing: "원도심 빌라·상가주택, 신축 아파트, 농촌 단독주택까지 주거 형태가 다양합니다.",
    moving: "원도심은 골목·계단을, 아파트는 승강기 예약을, 읍면은 마을길과 외부 창고 짐을 우선 확인하세요.",
    units: dongnamUnits,
  },
  {
    name: "서북구",
    slug: "cheonan-seobuk-gu-moving",
    character: "불당·백석·두정의 도심 주거와 성환·직산·입장의 읍면·산업 생활권이 이어지는 구",
    transport: "천안아산역과 수도권 전철 생활권, 산업단지 화물 교통, 북부 읍면의 이동시간이 함께 작용합니다.",
    housing: "고층 주상복합·대단지 아파트, 대학가 원룸과 북부 단독주택이 공존합니다.",
    moving: "도심은 지하 진입과 엘리베이터를, 대학가는 정차·계단을, 읍면은 장거리와 마을 진입을 나눠 확인하세요.",
    units: seobukUnits,
  },
];

const unitByName = new Map(districtProfiles.flatMap((district) => district.units.map((unit) => [unit.name, { district, unit }] as const)));

function relatedUnits(district: DistrictProfile, unit: UnitProfile): UnitProfile[] {
  const sameFocus = district.units.filter((candidate) => candidate.name !== unit.name && candidate.focus === unit.focus);
  const complementary = district.units.filter((candidate) => candidate.name !== unit.name && candidate.focus !== unit.focus);
  return [...sameFocus, ...complementary].slice(0, 2);
}

function regionTreeForDistrict(district: DistrictProfile): NonNullable<Article["regionTree"]> {
  return {
    title: `${district.name} 읍·면·동 이사 정보`,
    description: `${district.name}의 ${district.units.length}개 읍·면·동을 누르면 주거 형태와 이사 종류에 맞춘 상세 가이드로 이동합니다.`,
    districts: [{ name: district.name, href: `/articles/${district.slug}`, dongs: district.units.map((unit) => ({ name: unit.name, href: `/articles/${unit.slug}` })) }],
  };
}

const cheonanRegionTree: NonNullable<Article["regionTree"]> = {
  title: "천안시 2개 구·31개 읍·면·동 이사 정보",
  description: "동남구와 서북구, 4개 읍·8개 면·19개 행정동을 모두 연결했습니다. 지역 이름을 누르면 건물·교통·이사 종류별 확인사항을 볼 수 있습니다.",
  districts: districtProfiles.map((district) => ({
    name: district.name,
    href: `/articles/${district.slug}`,
    dongs: district.units.map((unit) => ({ name: unit.name, href: `/articles/${unit.slug}` })),
  })),
};

const focusContent: Record<Focus, {
  title: (name: string) => string;
  keyword: (name: string) => string;
  secondary: (name: string) => string[];
  heading: string;
  answer: (name: string) => string;
  action: string;
  checklist: string[];
  ctaLabel: string;
  ctaUrl: string;
  faq: (name: string) => { question: string; answer: string };
}> = {
  quote: {
    title: (name) => `천안 ${name} 포장이사 견적, 당일 추가금 막으려면 무엇을 확인할까?`,
    keyword: (name) => `천안 ${name} 포장이사 견적`,
    secondary: (name) => [`${name} 이사`, `${name} 이사업체`, `${name} 포장이사`],
    heading: "포장이사 견적은 같은 조건으로 비교하세요",
    answer: (name) => `${name} 포장이사 견적은 평수보다 방별 짐, 양쪽 건물의 주차·층수·승강기와 작업 장비를 같은 기준으로 전달해야 비교할 수 있습니다. 총액만 보면 빠진 인원이나 사다리차를 찾기 어렵습니다.`,
    action: "방·베란다·창고를 같은 순서로 촬영하고 버릴 짐, 대형가전, 분해가 필요한 가구를 표시하세요.",
    checklist: ["방별 짐과 대형가전 사진", "출발지·도착지 주차 위치", "승강기·계단·사다리차", "대기·보관·폐기물 조건"],
    ctaLabel: "포장이사 2곳 견적 비교",
    ctaUrl: TWO_QUOTES,
    faq: (name) => ({ question: `${name} 포장이사 견적은 몇 곳을 비교하면 되나요?`, answer: "업체 수보다 같은 짐과 건물 조건을 전달하는 것이 중요합니다. 2~3곳의 포함·별도 항목을 같은 표로 비교하면 차이를 찾기 쉽습니다." }),
  },
  apartment: {
    title: (name) => `천안 ${name} 아파트 이사, 엘리베이터 예약 전에 볼 4가지`,
    keyword: (name) => `천안 ${name} 아파트 이사`,
    secondary: (name) => [`${name} 포장이사`, `${name} 이사 견적`, `${name} 입주이사`],
    heading: "아파트 이사는 관리사무소 확인이 먼저입니다",
    answer: (name) => `${name} 아파트 이사는 단지별 이사 가능 시간, 엘리베이터 배정, 공용부 보양, 차량 등록과 지하주차장 높이를 먼저 확인해야 합니다. 같은 지역이라도 단지 규정은 서로 다를 수 있습니다.`,
    action: "관리사무소 안내를 받은 뒤 해당 동 출입구와 트럭 대기 위치, 현관·복도·승강기 치수를 촬영하세요.",
    checklist: ["이사 가능 날짜·시간", "엘리베이터 예약과 사용료", "지하 높이·차량 등록", "보양·사다리차 규정"],
    ctaLabel: "포장이사 전문 견적 확인",
    ctaUrl: PACKING_MOVE,
    faq: (name) => ({ question: `${name} 아파트 엘리베이터 사용료는 얼마인가요?`, answer: "단지와 작업 시간에 따라 달라질 수 있어 고정 금액으로 단정할 수 없습니다. 관리사무소에 예약 가능 시간, 사용료와 보양 범위를 함께 확인하세요." }),
  },
  studio: {
    title: (name) => `천안 ${name} 원룸이사, 용달과 반포장 중 무엇이 맞을까?`,
    keyword: (name) => `천안 ${name} 원룸이사`,
    secondary: (name) => [`${name} 용달이사`, `${name} 소형이사`, `${name} 반포장이사`],
    heading: "용달·일반·반포장을 필요한 작업으로 구분하세요",
    answer: (name) => `${name} 원룸이사는 차량만 필요한지, 기사 운반이 필요한지, 포장까지 맡길지를 먼저 정해야 합니다. 같은 용달이라도 계단, 가전 연결과 대기시간 포함 여부가 다를 수 있습니다.`,
    action: "침대·냉장고·세탁기처럼 혼자 들기 어려운 짐과 포장 가능한 시간을 적고 차량·인력·포장 범위를 나눠 견적을 받으세요.",
    checklist: ["차량만 또는 기사 도움 포함", "계단·승강기·주차 거리", "포장·정리 범위", "대형가전 분리·연결 담당"],
    ctaLabel: "이사업체 견적 비교",
    ctaUrl: MOVING_COMPARE,
    faq: (name) => ({ question: `${name} 원룸이사는 용달이 가장 저렴한가요?`, answer: "직접 포장하고 운반을 도울 수 있다면 차량 중심 방식이 유리할 수 있지만 인력·계단·대기를 추가하면 달라집니다. 필요한 작업을 모두 넣은 총조건으로 비교하세요." }),
  },
  cleaning: {
    title: (name) => `천안 ${name} 입주청소, 이사 전 빈집 시간은 어떻게 잡을까?`,
    keyword: (name) => `천안 ${name} 입주청소`,
    secondary: (name) => [`${name} 이사청소`, `${name} 입주 준비`, `${name} 청소 견적`],
    heading: "입주청소는 범위와 빈집 시간을 먼저 정하세요",
    answer: (name) => `${name} 입주청소는 짐이 들어오기 전 빈집에서 진행해야 창틀·수납장·바닥을 확인하기 쉽습니다. 신축은 공사 먼지와 하자를, 구축은 생활 오염과 기존 손상을 구분해 기록하세요.`,
    action: "면적만 말하지 말고 창틀, 베란다, 수납장과 오염 사진을 보내 포함·별도 작업, 재청소 조건을 문서로 받으세요.",
    checklist: ["청소 전 하자·기존 손상 사진", "창틀·베란다·수납장 범위", "폐기물·스티커 제거 여부", "청소 종료와 짐 반입 사이 여유"],
    ctaLabel: "이사·입주청소 견적 비교",
    ctaUrl: CLEANING_COMPARE,
    faq: (name) => ({ question: `${name} 입주청소를 이사 당일에 해도 되나요?`, answer: "현장과 일정에 따라 가능하지만 청소와 짐 반입이 겹치면 작업 구역이 가려지고 재오염될 수 있습니다. 빈집 청소가 끝난 뒤 짐을 들이는 순서가 실용적입니다." }),
  },
  aircon: {
    title: (name) => `천안 ${name} 에어컨 이전설치, 추가비용이 생기는 조건`,
    keyword: (name) => `천안 ${name} 에어컨 이전설치`,
    secondary: (name) => [`${name} 에어컨 설치`, `${name} 에어컨 이전 비용`, `${name} 설치 견적`],
    heading: "철거·운반·재설치와 추가 작업을 나누세요",
    answer: (name) => `${name} 에어컨 이전설치는 제품 형태, 배관과 전선 길이, 실외기 위치, 타공·앵글·고소 작업에 따라 조건이 달라집니다. 철거·운반·설치 담당자와 사후보증 주체도 확인해야 합니다.`,
    action: "제품 모델명, 기존 배관 상태와 새집의 실내기·실외기 예정 위치를 사진으로 보내 기본 포함 범위와 추가 판단 기준을 물어보세요.",
    checklist: ["제품 모델명과 철거 여부", "실내기·실외기 위치", "배관·전선·타공 조건", "앵글·고소 작업과 사후보증"],
    ctaLabel: "설치·수리 견적 비교",
    ctaUrl: INSTALL_REPAIR,
    faq: (name) => ({ question: `${name} 에어컨 이전설치 비용은 왜 달라지나요?`, answer: "제품 형태, 배관과 전선 길이, 실외기 위치, 타공·앵글·고소 작업 등 현장 조건에 따라 달라집니다. 기본 포함 범위와 추가 작업 기준을 확인하세요." }),
  },
  tv: {
    title: (name) => `천안 ${name} 벽걸이TV 이전설치, 철거 전 확인할 벽체 조건`,
    keyword: (name) => `천안 ${name} 벽걸이TV 이전설치`,
    secondary: (name) => [`${name} TV 설치`, `${name} 무타공 TV`, `${name} 설치 수리`],
    heading: "벽걸이TV는 철거·운반·설치 책임을 나누세요",
    answer: (name) => `${name} 벽걸이TV 이전설치는 기존 브래킷 철거, 새집 벽체와 타공 규정 확인이 먼저입니다. 이사업체가 운반만 하는지 전문기사가 철거·재설치까지 맡는지 구분하세요.`,
    action: "TV 모델과 크기, 브래킷, 기존 설치 사진, 새집 벽면과 콘센트 위치를 준비하고 무타공 방식이 필요한지도 미리 알리세요.",
    checklist: ["TV 모델·크기", "브래킷 재사용 가능 여부", "새집 벽체·타공 규정", "철거·운반·설치 책임자"],
    ctaLabel: "벽걸이TV 설치·철거 견적 비교",
    ctaUrl: TV_MOUNT,
    faq: (name) => ({ question: `${name} 벽걸이TV 브래킷을 재사용할 수 있나요?`, answer: "TV와 브래킷 규격, 벽체와 설치 방식에 따라 달라집니다. 모델명과 기존 설치 사진을 전문기사에게 보여주고 호환성을 확인하세요." }),
  },
};

const cityArticle: Article = {
  slug: "cheonan-moving-regional-guide",
  title: "천안 포장이사 견적, 동남구·서북구 어디부터 확인할까?",
  description: "천안시 동남구·서북구와 4읍·8면·19행정동을 연결하고 원도심, 신축 아파트, 대학가 원룸, 읍면 단독주택의 이사 조건을 정리했습니다.",
  category: "regional", categoryLabel: "지역별 정보", keyword: "천안 포장이사 견적", secondaryKeywords: ["천안 이사", "천안 포장이사", "천안 이사업체", "천안 원룸이사", "천안 입주청소", "천안 에어컨 이전설치"], readingTime: 11,
  publishedAt: "2026-09-02T00:00:00.000Z", updatedAt: "2026-09-02T00:00:00.000Z", accent: "amber", affiliateNotice: true,
  heroImage: { src: HERO_MOVE, alt: "천안 지역 이사 정보를 위한 실제 포장이사 현장 사진", title: "천안 이사 가이드", caption: "실제 이사 현장 사진을 활용했으며 특정 업체를 추천하는 의미는 아닙니다." },
  intro: "천안 이사는 같은 시 안에서도 조건이 크게 다릅니다. 천안역 원도심은 골목과 계단, 불당·성성·청수의 공동주택은 승강기와 지하 진입, 병천·광덕·입장 같은 읍면은 이동거리와 마을길을 먼저 확인해야 합니다. 현재 주소가 속한 구와 읍·면·동을 눌러 필요한 이사 유형을 확인하세요.",
  breadcrumbs: [{ name: "지역별 정보", href: "/category/regional" }],
  regionTree: cheonanRegionTree,
  sections: [
    { heading: "천안은 2개 구·4개 읍·8개 면·19개 행정동입니다", paragraphs: ["행정안전부의 2025년 말 기준 행정구역 자료에 따르면 천안시는 동남구와 서북구 아래 4개 읍, 8개 면, 19개 행정동으로 구성됩니다. 견적·청소·설치 예약에는 도로명 전체 주소와 건물명, 동·호수를 함께 전달하세요.", "동남구는 원도심과 넓은 동부·남부 읍면을, 서북구는 신도심·산업 생활권과 북부 읍면을 함께 포함합니다. 시 평균보다 출발지와 도착지의 실제 건물 조건이 견적에 더 직접적으로 영향을 줍니다."] },
    { heading: "원도심·신축 주거·읍면은 견적 질문이 다릅니다", image: { src: HERO_MOVE, alt: "이삿짐 상자와 TV 설치 도구가 놓인 실제 이사 현장", title: "현장 조건 확인" }, paragraphs: ["중앙·문성·원성처럼 원도심은 골목 폭, 계단과 정차 위치를 먼저 봅니다. 불당·쌍용·신방·청룡 같은 공동주택은 관리사무소 예약과 지하주차장 높이, 승강기 배정이 중요합니다.", `목천·병천·성환·직산 등 읍면은 도심에서의 이동시간과 마을길, 창고·마당 짐을 따로 알려야 합니다. 조건을 정리한 뒤 [천안 이사업체 견적을 비교](${MOVING_COMPARE})하면 빠진 작업을 찾기 쉽습니다.`] },
    { heading: "포장이사·일반이사·원룸이사를 어떻게 고를까요?", paragraphs: ["포장이사는 포장과 운반, 정리 범위가 넓어 시간이 부족하거나 가족 짐이 많은 경우 검토할 수 있습니다. 일반·반포장은 직접 포장 가능한 범위와 업체가 맡을 운반·가구 작업을 나눠야 합니다.", "원룸 용달은 짐이 적다는 이유만으로 항상 가장 저렴한 것은 아닙니다. 기사 도움, 계단, 운반 거리와 대기를 추가하면 조건이 달라지므로 필요한 작업을 모두 포함한 총견적으로 비교하세요."], checklist: ["짐의 양과 직접 포장 가능 시간", "운반 인력과 계단 작업", "가구 분해·가전 연결", "양쪽 주차·승강기 조건"] },
    { heading: "입주청소와 에어컨·TV 설치는 이삿짐과 시간을 나누세요", image: { src: HERO_TV, alt: "벽걸이TV 이전설치 상태를 확인하는 실제 현장 사진", title: "TV 설치 확인" }, paragraphs: ["입주청소는 빈집에서 하자와 오염을 확인한 뒤 짐을 들이는 순서가 좋습니다. 청소 범위는 면적뿐 아니라 창틀, 베란다, 수납장과 오염 상태로 비교하세요.", `에어컨과 벽걸이TV는 이사업체가 운반만 하고 전문 설치가 별도일 수 있습니다. 제품 모델과 새집 설치 위치를 준비해 [설치·수리 견적을 비교](${INSTALL_REPAIR})하고 책임 범위를 문서로 남기세요.`] },
    { heading: "천안 지역 페이지를 사용하는 순서", paragraphs: ["먼저 동남구 또는 서북구 페이지에서 구 전체의 이동·주거 특성을 확인하세요. 다음으로 읍·면·동 페이지에서 현재 필요한 포장이사, 원룸이사, 청소, 에어컨 또는 TV 이전설치 질문을 확인하면 됩니다.", "각 상세 글은 상위 구와 같은 구에서 주거 형태·작업 조건이 비슷한 지역, 관련 서비스 글로 연결됩니다. 실제 이동경로는 출발지와 도착지의 전체 주소로 확인하세요."] },
  ],
  faq: [
    { question: "천안시는 동남구와 서북구로 나뉘나요?", answer: "네. 천안시는 동남구와 서북구의 2개 일반구 아래 4개 읍, 8개 면, 19개 행정동으로 구성됩니다." },
    { question: "천안 시내에서 시내로 이사해도 거리 비용이 중요한가요?", answer: "거리뿐 아니라 양쪽 건물의 주차, 계단·승강기, 차량 진입과 대기시간이 작업 조건을 바꿀 수 있습니다. 출발지와 도착지 정보를 따로 전달하세요." },
    { question: "천안 읍면 지역은 무엇을 더 확인해야 하나요?", answer: "도심에서의 이동시간, 마을길 폭, 대형 차량 회차와 집 앞 주차, 마당·창고·외부 적재물을 확인하세요. 필요하면 소형 차량 환적 여부도 물어보세요." },
  ],
  source: ADMIN_SOURCE,
};

function makeDistrictArticle(district: DistrictProfile, index: number): Article {
  const districtTitle = district.name === "동남구"
    ? "천안 동남구 포장이사 견적, 원도심·읍면에서 달라지는 조건"
    : "천안 서북구 포장이사 견적, 아파트·원룸에서 확인할 조건";
  return {
    slug: district.slug,
    title: districtTitle,
    description: `${district.name} ${district.units.length}개 읍·면·동을 연결하고 아파트, 원룸, 원도심, 단독주택 이사에서 확인할 차량·승강기·청소·설치 조건을 정리했습니다.`,
    category: "regional", categoryLabel: "지역별 정보", keyword: `천안 ${district.name} 포장이사 견적`, secondaryKeywords: [`${district.name} 이사`, `${district.name} 이사업체`, `${district.name} 원룸이사`, `${district.name} 입주청소`, "천안 이사"], readingTime: 9,
    publishedAt: "2026-09-02T00:00:00.000Z", updatedAt: "2026-09-02T00:00:00.000Z", accent: index === 0 ? "green" : "blue", affiliateNotice: true,
    heroImage: { src: HERO_MOVE, alt: `${district.name} 이사 준비에 활용한 실제 포장이사 현장 사진`, title: `${district.name} 이사` },
    intro: `${district.name}은 ${district.character}입니다. ${district.transport} 이 페이지에서 ${district.units.length}개 읍·면·동을 찾고, 아파트·빌라·원룸·단독주택별로 먼저 확인할 조건을 정리할 수 있습니다.`,
    breadcrumbs: [
      { name: "지역별 정보", href: "/category/regional" },
      { name: "천안시", href: "/articles/cheonan-moving-regional-guide" },
    ],
    regionTree: regionTreeForDistrict(district),
    sections: [
      { heading: `${district.name} 이사는 생활권부터 구분하세요`, paragraphs: [`${district.character}입니다. ${district.housing}`, district.moving] },
      { heading: "포장이사 견적에 전달할 건물·차량 조건", paragraphs: ["평수만 말하지 말고 방별 짐, 대형가전, 버릴 물건과 양쪽 건물의 층수·승강기·주차를 같은 양식으로 전달하세요. 읍면은 마을길과 외부 창고 짐을, 도심은 골목과 대기 가능 시간을 추가합니다.", `차량·인원·장비·가전 설치와 추가 작업을 한 줄씩 나눈 뒤 [포장이사 2곳 견적을 비교](${TWO_QUOTES})하세요.`], checklist: ["방별 짐과 대형 물품", "출발지·도착지 주차", "승강기·계단·사다리차", "장거리·대기·보관 조건"] },
      { heading: "주거 형태별 이사 준비", paragraphs: ["아파트는 관리사무소 예약, 지하 높이와 승강기 치수를 확인하세요. 빌라·다가구는 계단과 골목 주차를, 원룸은 기사 도움과 포장 범위를, 단독주택은 마당·창고·옥상 짐을 따로 기록합니다.", "같은 지역이라도 건물 연식과 관리 규정이 다르므로 특정 지역 평균가격보다 실제 주소와 사진으로 받은 견적을 우선하세요."] },
      { heading: "청소와 가전 설치는 별도 일정으로 확인하세요", image: { src: HERO_TV, alt: `${district.name} 이사 중 벽걸이TV 설치 상태를 확인하는 실제 사진`, title: "설치 작업 확인" }, paragraphs: ["청소는 짐 반입 전 빈집에서 진행하고, 에어컨·벽걸이TV·커튼은 이사업체의 운반 범위와 전문기사의 설치 범위를 나누세요.", `창틀·수납장·오염 사진으로 [이사·입주청소 견적을 비교](${CLEANING_COMPARE})하고, 제품 모델과 새 위치 사진으로 [설치·수리 견적을 비교](${INSTALL_REPAIR})할 수 있습니다.`] },
      { heading: `${district.name}에서 다음 지역 찾기`, paragraphs: [`위 목록에서 ${district.units.map((unit) => unit.name).join(", ")} 상세 글로 이동할 수 있습니다.`, "상위 [천안시 이사 지역별 정보](/articles/cheonan-moving-regional-guide)에서는 동남구와 서북구 전체 구조와 이사 종류별 선택 기준을 함께 확인할 수 있습니다."] },
    ],
    faq: [
      { question: `${district.name} 포장이사 비용은 지역만으로 알 수 있나요?`, answer: "지역명만으로 고정할 수 없습니다. 짐, 이동거리, 양쪽 건물의 주차·승강기·계단, 인원과 장비 조건에 따라 달라질 수 있습니다." },
      { question: `${district.name} 읍면동 페이지는 모두 연결되어 있나요?`, answer: `네. 위 지역 목록에서 ${district.units.length}개 읍·면·동 상세 가이드로 이동할 수 있습니다.` },
      { question: "아파트 이사와 원룸이사는 무엇부터 다르게 정하나요?", answer: "아파트는 관리사무소 예약과 승강기·지하 동선을, 원룸은 차량만 필요한지 운반 인력과 포장까지 필요한지를 먼저 정하세요." },
    ],
    source: ADMIN_SOURCE,
  };
}

function makeUnitArticle(district: DistrictProfile, unit: UnitProfile, districtIndex: number, unitIndex: number): Article {
  const focus = focusContent[unit.focus];
  const related = relatedUnits(district, unit);
  return {
    slug: unit.slug,
    title: focus.title(unit.name),
    description: `${district.name} ${unit.name}의 ${unit.character}에서 ${focus.heading}, 차량 진입과 주거 형태별 이사 준비를 확인합니다.`,
    category: "regional", categoryLabel: "지역별 정보", keyword: focus.keyword(unit.name), secondaryKeywords: [...focus.secondary(unit.name), `${district.name} 이사`, "천안 이사"], readingTime: 8,
    publishedAt: "2026-09-02T00:00:00.000Z", updatedAt: "2026-09-02T00:00:00.000Z", accent: ["amber", "green", "blue", "violet", "mint", "rose"][(districtIndex * 3 + unitIndex) % 6], affiliateNotice: true,
    heroImage: { src: unit.focus === "tv" ? HERO_TV : HERO_MOVE, alt: `${district.name} ${unit.name} 이사 준비에 활용한 실제 현장 사진`, title: `${unit.name} 이사`, caption: "실제 이사 현장 사진을 활용했으며 특정 업체를 추천하는 의미는 아닙니다." },
    breadcrumbs: [
      { name: "지역별 정보", href: "/category/regional" },
      { name: "천안시", href: "/articles/cheonan-moving-regional-guide" },
      { name: district.name, href: `/articles/${district.slug}` },
    ],
    regionTree: {
      title: `${unit.name}과 같은 ${district.name} 지역`,
      description: "상위 구와 주거 형태·작업 조건이 비슷한 지역을 연결했습니다. 실제 이동경로는 출발지와 도착지의 전체 주소로 확인하세요.",
      districts: [{ name: district.name, href: `/articles/${district.slug}`, dongs: [unit, ...related].map((item) => ({ name: item.name, href: `/articles/${item.slug}` })) }],
    },
    intro: `${unit.name} 이사에서 가장 먼저 볼 것은 지역 평균가격이 아니라 건물과 차량 조건입니다. ${unit.character}인 만큼 ${unit.access} 이 글에서 ${focus.heading}과 주거 형태별 준비, 당일 확인 순서를 바로 정리할 수 있습니다.`,
    sections: [
      { heading: `${unit.name} 지역 특성과 이사 동선`, paragraphs: [`${unit.name}은 ${unit.character}입니다. ${unit.housing}`, `${unit.access} 견적에는 전체 도로명 주소, 건물명, 층수와 실제 주차 위치를 함께 전달하세요.`] },
      { heading: focus.heading, paragraphs: [focus.answer(unit.name), `${unit.name}에서는 ${focus.action} 조건을 정리한 뒤 [${focus.ctaLabel}](${focus.ctaUrl})에서 같은 기준으로 확인하세요.`], checklist: focus.checklist },
      { heading: "아파트·빌라·원룸·단독주택별 확인사항", paragraphs: [`${unit.name}에는 ${unit.housing} 아파트는 엘리베이터 예약·보양·지하 높이를, 빌라는 계단 폭과 사다리차 공간을, 원룸은 기사 도움과 포장 범위를 먼저 확인하세요. 단독주택은 마당·창고·옥상 짐을 실내 짐과 나눠 적습니다.`, `${unit.name}에서도 건물마다 조건이 다릅니다. 특히 ${unit.access} 확인되지 않은 지역 평균가격이나 고정 추가비보다 실제 주소와 현장 사진이 반영된 견적을 기준으로 계약하세요.`] },
      { heading: "이사 전날과 당일 체크리스트", paragraphs: [`${unit.name} 이사 전날에는 업체명·담당자·시작시간과 두 주소를 다시 맞추세요. ${unit.character}이라는 점을 고려해 차량 대기 위치와 마지막 진입 구간도 재확인하고, 귀중품·계약서·하루치 생활용품은 직접 들고 갈 가방에 넣으세요.`, `${unit.name} 현장의 작업이 끝나기 전 상자 수, 가구·가전 파손, 조립과 설치 범위를 확인하세요. ${unit.housing} 건물 밖이나 공용부에 남은 짐이 없는지 살피고, 추가 작업은 시작 전 승인 내용과 금액 기록을 대조합니다.`], checklist: [`${unit.name} 담당자·시간·주소 재확인`, "귀중품·서류 직접 운반", "벽·바닥·가전 촬영", "추가 작업 승인 기록"] },
      { heading: `${unit.name}에서 다음으로 확인할 지역`, paragraphs: [`${unit.name}의 상위 [${district.name} 이사 가이드](/articles/${district.slug})에서 ${district.units.length}개 읍·면·동 전체 목록을 확인할 수 있습니다. 같은 구에서 이사 조건이 비슷한 ${related.map((item) => item.name).join("과 ")} 글도 위 지역 연결에서 바로 이동할 수 있습니다.`, `${unit.name}에서 천안 전체 구조와 동남구·서북구 비교가 필요하다면 [천안시 이사 지역별 정보](/articles/cheonan-moving-regional-guide)를 확인하세요. 관련 서비스 가이드는 하단 연관 글로 이어집니다.`] },
    ],
    faq: [
      focus.faq(unit.name),
      { question: `${unit.name} 이사에서 사다리차가 꼭 필요한가요?`, answer: `${unit.name}에서도 층수만으로 정할 수 없습니다. 승강기 크기, 창문, 전선·나무, 차량 설치 공간과 건물 관리 규정을 사진으로 확인한 뒤 결정하세요.` },
      { question: `${unit.name} 이사 비용을 줄이려면 무엇부터 해야 하나요?`, answer: `${unit.name}의 건물·차량 조건을 확인한 뒤 버릴 물건을 먼저 줄이고 모든 업체에 같은 정보를 전달하세요. 날짜만 바꾸기보다 차량·인원·장비와 포함 작업이 같은 견적인지 확인하는 것이 중요합니다.` },
    ],
    source: ADMIN_SOURCE,
  };
}

export const cheonanArticles: Article[] = [
  cityArticle,
  ...districtProfiles.map(makeDistrictArticle),
  ...districtProfiles.flatMap((district, districtIndex) => district.units.map((unit, unitIndex) => makeUnitArticle(district, unit, districtIndex, unitIndex))),
];

const officialUnitCount = districtProfiles.reduce((count, district) => count + district.units.length, 0);
if (officialUnitCount !== 31) throw new Error(`Expected 31 Cheonan units, got ${officialUnitCount}`);
if (cheonanArticles.length !== 34) throw new Error(`Expected 34 Cheonan articles, got ${cheonanArticles.length}`);
if (new Set(cheonanArticles.map((article) => article.slug)).size !== cheonanArticles.length) throw new Error("Duplicate Cheonan article slug detected");
if (unitByName.size !== 31) throw new Error("Duplicate Cheonan unit name detected");
