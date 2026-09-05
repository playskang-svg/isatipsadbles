import type { Article } from "./articles";
import { linkUrl } from "./affiliate";

const ADMIN_SOURCE = { label: "인천광역시 행정구역 현황(2026년 7월 1일 기준)", url: "https://www.incheon.go.kr/IC040102" };
const APARTMENT_SOURCE = { label: "인천광역시 공동주택 현황(2026년 6월 30일 기준)", url: "https://www.incheon.go.kr/build/BU050303/3080146" };
const MOVING_COMPARE = linkUrl("move-cpa-isatime");
const TWO_QUOTES = linkUrl("move-compare-2");
const PACKING_MOVE = linkUrl("move-packing");
const MOVE_REPAIR = linkUrl("repair-soomgo-leak");
const CLEANING_COMPARE = linkUrl("move-cleaning");
const INSTALL_REPAIR = linkUrl("repair-soomgo-aircon");
const TV_MOUNT = linkUrl("repair-soomgo-tv-mount");

const HERO_CITY = "/images/incheon/incheon-moving-hero.webp";
const HERO_APARTMENT = "/images/incheon/incheon-apartment-moving.webp";
const HERO_OLD_TOWN = "/images/incheon/incheon-old-town-moving.webp";

const districtTitles: Record<string, string> = {
  "incheon-ganghwa-moving": "강화군 이사 견적, 교량·마을길 때문에 무엇이 달라질까?",
  "incheon-ongjin-moving": "옹진군 섬 이사, 선박·차량 운송은 어떻게 준비할까?",
  "incheon-jemulpo-moving": "제물포구 포장이사, 골목·계단 추가금 막으려면?",
  "incheon-yeongjong-moving": "영종구 이사 견적, 교량 이동시간도 비용에 영향 줄까?",
  "incheon-michuhol-moving": "미추홀구 포장이사 견적, 골목과 신축단지 조건 비교",
  "incheon-yeonsu-moving": "연수구 아파트 이사, 송도·연수동 준비가 다른 이유",
  "incheon-namdong-moving": "남동구 이사 견적, 구월·논현 생활권별 확인사항",
  "incheon-bupyeong-moving": "부평구 포장이사, 역세권·대단지 추가금 줄이는 법",
  "incheon-gyeyang-moving": "계양구 이사 견적, 고속도로보다 먼저 볼 진입 조건",
  "incheon-seohae-moving": "서해구 이사, 청라 신도시와 가좌·석남 준비 차이",
  "incheon-geomdan-moving": "검단구 신축 아파트 이사, 입주일에 무엇을 확인할까?",
};

const areaTitles: Record<string, string> = {
  "incheon-ganghwa-eup-moving": "강화읍 이사 견적, 단독주택·아파트 준비는 어떻게 다를까?",
  "incheon-yeongheung-moving": "영흥면 이사, 교량 이동과 단독주택 짐은 어떻게 견적낼까?",
  "incheon-gaehang-dong-moving": "개항동 포장이사, 골목·경사 때문에 추가금 생길까?",
  "incheon-yeongjong-1-dong-moving": "영종1동 이사 견적, 하늘도시 아파트에서 확인할 것",
  "incheon-hagik-1-dong-moving": "학익1동 이사, 신축단지·기존 주거지 동선 비교",
  "incheon-songdo-5-dong-moving": "송도5동 아파트 이사, 엘리베이터 예약부터 확인하세요",
  "incheon-nonhyeon-2-dong-moving": "논현2동 포장이사, 대단지 차량·승강기 준비 방법",
  "incheon-cheongcheon-2-dong-moving": "청천2동 이사 견적, 재정비 대단지에서 놓치기 쉬운 것",
  "incheon-jakjeon-seoun-dong-moving": "작전서운동 이사, 생활도로·아파트 진입 조건 확인",
  "incheon-cheongna-2-dong-moving": "청라2동 아파트 이사, 지하주차장·엘리베이터 체크",
  "incheon-ara-1-dong-moving": "아라1동 신축 아파트 이사, 입주 지정일 준비 순서",
};

type ApartmentProfile = {
  name: string;
  slug: string;
  district: string;
  area: string;
  setting: string;
  access: string;
  caution: string;
};

type DistrictProfile = {
  name: string;
  slug: string;
  units: string[];
  priority: string;
  prioritySlug: string;
  character: string;
  transport: string;
  housing: string;
  moving: string;
  oldTown?: boolean;
};

const apartments: ApartmentProfile[] = [
  { name: "동인천역 파크푸르지오", slug: "dongincheon-station-park-prugio-moving", district: "제물포구", area: "개항동", setting: "동인천역 생활권과 원도심 정비 구역이 맞닿는 대단지 공동주택", access: "역세권 도로와 원도심 골목의 폭이 구간마다 달라 출발지·도착지 차량 동선을 따로 봐야 합니다.", caution: "단지 이사 예약, 승강기 사용 시간, 보양 범위와 차량 대기 위치를 관리주체에 확인하세요." },
  { name: "영종하늘도시 우미린1단지", slug: "yeongjong-umi-lin-1-moving", district: "영종구", area: "영종1동", setting: "영종하늘도시의 공동주택 중심 생활권에 있는 대단지", access: "섬 안 이동은 비교적 계획적이지만 육지 연결 교량과 공항권 교통 영향을 일정에 반영해야 합니다.", caution: "장거리 기사 이동, 교량 통과 시간, 입주 시간과 엘리베이터 예약의 여유를 함께 두세요." },
  { name: "시티오씨엘 3단지", slug: "city-ociel-3-moving", district: "미추홀구", area: "학익1동", setting: "학익·용현 생활권의 대규모 도시개발 축에 들어선 공동주택", access: "기존 주거지와 개발 구간이 이어져 공사·교통 상황에 따라 차량 접근 경로가 달라질 수 있습니다.", caution: "대형 차량 출입구, 지하주차장 높이, 입주 지정 시간과 공용부 보양 규정을 확인하세요." },
  { name: "송도 더샵 퍼스트파크", slug: "songdo-the-sharp-first-park-moving", district: "연수구", area: "송도5동", setting: "송도국제도시의 고층 공동주택 밀집 생활권에 있는 단지", access: "대로 중심의 계획도시지만 단지 규모가 커 동·출입구에 따라 작업 동선 차이가 큽니다.", caution: "엘리베이터 예약과 지하 진입 높이, 스카이라운지·커뮤니티 등 공용부 동선을 관리사무소와 맞추세요." },
  { name: "에코메트로 12단지", slug: "nonhyeon-eco-metro-12-moving", district: "남동구", area: "논현2동", setting: "논현·한화지구의 공동주택 밀집 생활권에 자리한 단지", access: "소래·논현권 간선도로와 대단지 내부 도로를 함께 이용하므로 출퇴근 혼잡을 피한 시간이 유리합니다.", caution: "단지별 이사 가능 시간과 출입구, 사다리차 사용 가능 위치를 사전에 확인하세요." },
  { name: "e편한세상 부평 그랑힐스", slug: "bupyeong-grang-hills-moving", district: "부평구", area: "청천2동", setting: "청천동 정비사업 생활권의 대규모 공동주택", access: "부평대로·산업단지·주거 골목이 만나는 지역이라 대형 차량의 최종 진입 경로가 중요합니다.", caution: "입주 예약, 상가·학교 시간대, 지하주차장 진입과 엘리베이터 배정을 함께 확인하세요." },
  { name: "계양 효성해링턴 플레이스", slug: "gyeyang-hyosung-harrington-moving", district: "계양구", area: "작전서운동", setting: "작전·서운 생활권의 공동주택과 기존 주거지가 이어지는 단지", access: "경인고속도로와 주요 간선도로 접근은 좋지만 생활도로 진입과 혼잡 시간대 확인이 필요합니다.", caution: "차량 대기 위치와 공용부 보양, 대형가전 반입 치수를 관리주체에 먼저 문의하세요." },
  { name: "청라 한양수자인 레이크블루", slug: "cheongna-hanyang-sujain-lakeblue-moving", district: "서해구", area: "청라2동", setting: "청라국제도시의 고층 공동주택과 수변 생활권에 있는 단지", access: "넓은 간선도로를 쓰지만 단지 출입구와 지하 동선에 따라 짐 운반 거리가 달라질 수 있습니다.", caution: "지하 높이 제한, 택배·이사차량 진입 동선과 엘리베이터 시간을 확인하세요." },
  { name: "검단신도시 우미린 더 시그니처", slug: "geomdan-umi-lin-signature-moving", district: "검단구", area: "아라1동", setting: "검단신도시의 신축 공동주택 중심 생활권에 자리한 단지", access: "계획도시 도로망을 이용하지만 입주·공사 차량이 겹치는 시기에는 여유 있는 도착 계획이 필요합니다.", caution: "입주지원·관리 안내의 이사 시간, 보양, 차량 등록과 하자 점검 순서를 먼저 확인하세요." },
];

const districtProfiles: DistrictProfile[] = [
  { name: "강화군", slug: "incheon-ganghwa-moving", units: ["강화읍","선원면","불은면","길상면","화도면","양도면","내가면","하점면","양사면","송해면","교동면","삼산면","서도면"], priority: "강화읍", prioritySlug: "incheon-ganghwa-eup-moving", character: "도심 기능이 모인 강화읍과 농촌·해안·섬 지역이 넓게 분산된 군 지역", transport: "강화대교·초지대교를 통한 육상 이동과 면 지역의 긴 이동 거리를 함께 계산해야 합니다.", housing: "읍내 공동주택·다세대와 면 지역 단독주택·농가주택의 조건 차이가 큽니다.", moving: "큰 차량의 마을길 진입, 장거리 운행, 창고·마당 짐과 폐기물 범위를 견적서에 구체적으로 적으세요.", oldTown: true },
  { name: "옹진군", slug: "incheon-ongjin-moving", units: ["북도면","연평면","백령면","대청면","덕적면","자월면","영흥면"], priority: "영흥면", prioritySlug: "incheon-yeongheung-moving", character: "여러 섬으로 구성되어 지역별 선박·교량 접근 방식이 다른 군 지역", transport: "영흥면은 교량으로 연결되지만 다른 면은 여객선 운항과 화물 반입 조건 확인이 핵심입니다.", housing: "단독주택·펜션형 건물·소규모 공동주택 등 보관공간과 외부 짐이 많은 주거가 섞여 있습니다.", moving: "기상과 선박 운항, 차량 선적, 섬 내 하역 인력을 일반 도심 이사와 별도 항목으로 확인하세요.", oldTown: true },
  { name: "제물포구", slug: "incheon-jemulpo-moving", units: ["신포동","연안동","신흥동","도원동","율목동","동인천동","개항동","만석동","화수1·화평동","화수2동","송현1·2동","송현3동","송림1동","송림2동","송림3·5동","송림4동","송림6동","금창동"], priority: "개항동", prioritySlug: "incheon-gaehang-dong-moving", character: "2026년 출범한 원도심 중심 자치구로 항만·상업지·경사지 주거지가 가까이 맞닿은 지역", transport: "경인선 역세권과 항만 도로는 편리하지만 오래된 골목과 경사로는 차량 접근 차이가 큽니다.", housing: "노후 단독·다세대, 상가주택과 정비사업 신축 공동주택이 함께 있습니다.", moving: "골목 폭, 계단, 주차 통제와 사다리차 설치 공간을 사진으로 보내 현장 견적을 받으세요.", oldTown: true },
  { name: "영종구", slug: "incheon-yeongjong-moving", units: ["영종동","영종1동","영종2동","운서1동","운서2동","용유동"], priority: "영종1동", prioritySlug: "incheon-yeongjong-1-dong-moving", character: "2026년 출범한 공항·영종하늘도시·해안 관광지가 공존하는 섬 지역 자치구", transport: "인천대교·영종대교와 공항철도가 핵심이며 교량 정체나 기상 변수를 일정에 반영해야 합니다.", housing: "하늘도시 고층 아파트, 공항 배후 오피스텔과 용유권 단독주택의 이사 조건이 다릅니다.", moving: "육지 출발 차량의 통행 경로, 도착 가능 시간과 엘리베이터 예약 사이에 충분한 여유를 두세요." },
  { name: "미추홀구", slug: "incheon-michuhol-moving", units: ["숭의1·3동","숭의2동","숭의4동","용현1·4동","용현2동","용현3동","용현5동","학익1동","학익2동","도화1동","도화2·3동","주안1동","주안2동","주안3동","주안4동","주안5동","주안6동","주안7동","주안8동","관교동","문학동"], priority: "학익1동", prioritySlug: "incheon-hagik-1-dong-moving", character: "경인선·수인분당선 생활권과 오래된 주거지, 대규모 개발 구역이 이어지는 중심 시가지", transport: "대로 접근은 좋지만 주안·숭의·용현의 골목과 학익 개발 구간은 현장별 진입 조건이 다릅니다.", housing: "다세대·상가주택·구축 아파트와 신축 대단지가 촘촘히 섞여 있습니다.", moving: "주차 거리, 계단 작업, 재개발 주변 공사차량과 관리사무소 이사 시간을 함께 확인하세요.", oldTown: true },
  { name: "연수구", slug: "incheon-yeonsu-moving", units: ["옥련1동","옥련2동","선학동","연수1동","연수2동","연수3동","청학동","동춘1동","동춘2동","동춘3동","송도1동","송도2동","송도3동","송도4동","송도5동"], priority: "송도5동", prioritySlug: "incheon-songdo-5-dong-moving", character: "연수·동춘의 기존 계획도시와 송도국제도시의 고층 주거지가 연결된 자치구", transport: "수인분당선·인천1호선과 광역도로를 쓰며 송도는 단지 출입구별 이동 거리가 큽니다.", housing: "구축 중층 아파트부터 초고층 주상복합과 대단지까지 관리 규정이 다양합니다.", moving: "지하주차장 높이, 엘리베이터 배정, 대형가전 반입과 단지별 차량 등록을 먼저 확인하세요." },
  { name: "남동구", slug: "incheon-namdong-moving", units: ["구월1동","구월2동","구월3동","구월4동","간석1동","간석2동","간석3동","간석4동","만수1동","만수2동","만수3동","만수4동","만수5동","만수6동","장수서창동","서창2동","남촌도림동","논현1동","논현2동","논현고잔동"], priority: "논현2동", prioritySlug: "incheon-nonhyeon-2-dong-moving", character: "구월 도심, 만수·간석 주거지, 논현 신도시와 남동산업단지가 함께 있는 자치구", transport: "인천1·2호선과 수인분당선, 간선도로가 교차해 출퇴근 시간대 지역별 혼잡 차이가 큽니다.", housing: "구축 아파트·다세대와 논현·서창의 계획형 공동주택이 공존합니다.", moving: "산업단지 화물 교통, 대단지 예약, 구도심 골목 주차를 주소별로 나눠 확인하세요." },
  { name: "부평구", slug: "incheon-bupyeong-moving", units: ["부평1동","부평2동","부평3동","부평4동","부평5동","부평6동","산곡1동","산곡2동","산곡3동","산곡4동","청천1동","청천2동","갈산1동","갈산2동","삼산1동","삼산2동","부개1동","부개2동","부개3동","일신동","십정1동","십정2동"], priority: "청천2동", prioritySlug: "incheon-cheongcheon-2-dong-moving", character: "부평역 상업·교통 중심지와 산곡·청천 정비사업, 삼산 공동주택지가 이어지는 고밀 시가지", transport: "수도권 전철 1호선·인천1호선·7호선 생활권이 겹치며 역세권 도로는 시간대별 혼잡이 큽니다.", housing: "역세권 오피스텔·다세대, 구축 단지와 정비사업 대단지가 섞여 있습니다.", moving: "시장·상가 주변 통행, 학교 시간대와 대단지 입주 예약을 피해 차량 시간을 잡으세요." },
  { name: "계양구", slug: "incheon-gyeyang-moving", units: ["효성1동","효성2동","계산1동","계산2동","계산3동","계산4동","작전1동","작전2동","작전서운동","계양1동","계양2동","계양3동"], priority: "작전서운동", prioritySlug: "incheon-jakjeon-seoun-dong-moving", character: "계산·작전의 도심 주거지와 계양산, 북부 개발축이 이어지는 자치구", transport: "인천1호선과 경인고속도로·외곽 간선망 접근이 좋지만 작전·효성 생활도로는 혼잡할 수 있습니다.", housing: "구축 아파트·빌라와 정비사업·신축 공동주택이 함께 분포합니다.", moving: "고속도로 진입 시간만 보지 말고 단지까지 마지막 골목과 주차·승강기 조건을 확인하세요." },
  { name: "서해구", slug: "incheon-seohae-moving", units: ["검암경서동","연희동","청라1동","청라2동","청라3동","가정1동","가정2동","가정3동","신현원창동","석남1동","석남2동","석남3동","가좌1동","가좌2동","가좌3동","가좌4동"], priority: "청라2동", prioritySlug: "incheon-cheongna-2-dong-moving", character: "2026년 서구에서 개편된 자치구로 청라국제도시·루원시티와 가좌·석남 산업·주거지가 공존", transport: "공항철도·인천2호선·간선도로 접근은 좋지만 원창·가좌의 화물 교통과 청라 대단지 동선을 구분해야 합니다.", housing: "청라·루원 고층 공동주택과 가좌·석남의 구축 주거지가 대조적입니다.", moving: "신도시는 지하 동선과 예약, 기존 시가지는 골목·주차·사다리차 공간을 우선 확인하세요." },
  { name: "검단구", slug: "incheon-geomdan-moving", units: ["검단동","불로대곡동","원당동","당하동","오류왕길동","마전동","아라1동","아라2동"], priority: "아라1동", prioritySlug: "incheon-ara-1-dong-moving", character: "2026년 출범한 검단신도시와 기존 검단 생활권이 함께 성장하는 북부 자치구", transport: "김포 경계 간선도로와 신도시 도로를 이용하며 개발 공사와 입주 차량이 겹칠 수 있습니다.", housing: "신축 대단지 비중이 큰 아라동과 기존 단독·빌라·아파트 생활권이 나뉩니다.", moving: "입주 지정일, 공사장 우회, 지하주차장 높이와 새집 하자 점검 시간을 일정에 포함하세요." },
];

const apartmentByArea = new Map<string, ApartmentProfile[]>();
for (const apartment of apartments) apartmentByArea.set(apartment.area, [...(apartmentByArea.get(apartment.area) ?? []), apartment]);

const CHOSEONG = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"];
const JUNGSEONG = ["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"];
const JONGSEONG = ["","k","k","ks","n","nj","nh","t","l","lk","lm","lb","ls","lt","lp","lh","m","p","ps","t","t","ng","t","t","k","t","p","h"];

function romanizeName(value: string) {
  const result = [...value].map((character) => {
    const code = character.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const offset = code - 0xac00;
      const initial = Math.floor(offset / 588);
      const medial = Math.floor((offset % 588) / 28);
      const final = offset % 28;
      return `${CHOSEONG[initial]}${JUNGSEONG[medial]}${JONGSEONG[final]}`;
    }
    return /[A-Za-z0-9]/.test(character) ? character.toLowerCase() : "-";
  }).join("");
  return result.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function unitSlug(profile: DistrictProfile, name: string) {
  if (name === profile.priority) return profile.prioritySlug;
  const districtKey = profile.slug.replace(/^incheon-/, "").replace(/-moving$/, "");
  return `incheon-${districtKey}-${romanizeName(name)}-moving`;
}

function dongItems(profile: DistrictProfile) {
  return profile.units.map((name) => ({
    name,
    href: `/articles/${unitSlug(profile, name)}`,
    apartments: (apartmentByArea.get(name) ?? []).map((item) => ({ name: item.name, href: `/articles/${item.slug}` })),
  }));
}

const incheonRegionTree: NonNullable<Article["regionTree"]> = {
  title: "인천광역시 2군·9구 지역 키워드트리",
  description: "2026년 7월 1일 행정체계 기준입니다. 11개 구·군과 158개 읍·면·동 페이지가 모두 연결되어 있습니다.",
  districts: districtProfiles.map((profile) => ({ name: profile.name, href: `/articles/${profile.slug}`, dongs: dongItems(profile) })),
};

function heroFor(profile: DistrictProfile, title: string) {
  return { src: profile.oldTown ? HERO_OLD_TOWN : HERO_CITY, alt: `${profile.name}의 주거지와 이삿짐 이동을 표현한 일러스트`, title };
}

function districtTree(profile: DistrictProfile): NonNullable<Article["regionTree"]> {
  return { title: `${profile.name} 읍·면·동 찾기`, description: `${profile.name}의 공식 행정구역을 확인하고 공개된 지역 가이드와 주요 아파트 이사 페이지로 이동하세요.`, districts: [{ name: profile.name, href: `/articles/${profile.slug}`, dongs: dongItems(profile) }] };
}

const cityArticle: Article = {
  slug: "incheon-moving-regional-guide",
  title: "인천광역시 이사 지역별 정보｜2군·9구 최신 키워드트리",
  description: "2026년 개편된 인천 2군·9구를 기준으로 섬·원도심·신도시의 이사 조건과 구·동·주요 아파트 가이드를 계층적으로 연결했습니다.",
  category: "regional", categoryLabel: "지역별 정보", keyword: "인천 이사", secondaryKeywords: ["인천 이사업체", "인천 포장이사", "인천 지역별 이사"], readingTime: 10,
  publishedAt: "2026-09-02T00:00:00.000Z", updatedAt: "2026-09-02T00:00:00.000Z", accent: "blue", affiliateNotice: true,
  heroImage: { src: HERO_CITY, alt: "인천의 섬·원도심·신도시를 연결하는 이삿짐 이동 일러스트", title: "인천 이사 가이드" },
  intro: "인천 이사는 같은 시 안에서도 조건이 크게 다릅니다. 영종·옹진·강화는 교량과 선박 일정을, 제물포·미추홀 원도심은 골목과 계단을, 송도·청라·검단의 대단지는 엘리베이터와 지하 진입 규정을 먼저 확인해야 합니다. 2026년 7월 1일 개편된 2군·9구 기준으로 목적 지역을 찾으세요.",
  regionTree: incheonRegionTree,
  sections: [
    { heading: "2026년 인천 행정구역은 2군·9구입니다", paragraphs: ["인천광역시는 2026년 7월 1일부터 강화군·옹진군과 제물포구·영종구·미추홀구·연수구·남동구·부평구·계양구·서해구·검단구 체계로 운영됩니다. 과거 중구·동구·서구 주소만 기억하면 검색과 행정 확인이 어긋날 수 있으므로 새 구 이름을 먼저 확인하세요.", "이 페이지에서 공식 행정구역의 1읍·19면·138동 전체 상세 글로 이동할 수 있습니다. 각 글은 포장이사·청소·설치·소형이사 등 서로 다른 실제 검색 질문과 구·군별 이동 조건을 결합했습니다."] },
    { heading: "섬·원도심·신도시별로 견적 질문이 달라집니다", image: { src: HERO_OLD_TOWN, alt: "인천 원도심의 골목과 이삿짐 차량을 단순화한 일러스트", title: "원도심 이사" }, paragraphs: ["섬 지역은 교량·선박·장거리 인력 이동, 원도심은 골목 폭·경사·계단·주차, 신도시는 관리사무소 예약·지하 높이·엘리베이터 배정이 핵심 변수입니다. 출발지와 도착지 조건을 각각 사진으로 남기세요.", `조건을 같은 양식으로 전달한 뒤 [인천 이사업체 견적을 비교](${MOVING_COMPARE})하면 총액뿐 아니라 빠진 장비와 작업 범위를 찾기 쉽습니다.`] },
    { heading: "입주청소는 빈집 시간과 하자 점검 순서를 맞추세요", paragraphs: ["신축·구축 모두 청소 범위와 오염 상태는 현장마다 다릅니다. 짐 반입 전에 청소가 끝나도록 시간을 분리하고, 신축은 하자 사진을 청소 전후로 남겨 보수 대상과 생활 오염을 구분하세요.", `면적·창틀·베란다·붙박이장 내부 등 같은 조건으로 [이사·입주청소 견적을 비교](${CLEANING_COMPARE})하고 포함 범위를 문서로 받는 편이 안전합니다.`] },
    { heading: "에어컨·TV·커튼은 이삿짐과 설치를 분리해 확인하세요", paragraphs: ["이사업체가 운반만 담당하고 전문 설치는 별도인 품목이 있습니다. 에어컨 배관, 벽걸이TV 벽체, 커튼 레일과 블라인드 실측은 새집 조건을 확인한 뒤 일정과 책임 주체를 나누세요.", `현장 조건이 필요한 작업은 제품명·사진·벽체와 배관 경로를 준비해 [설치·수리 견적을 비교](${INSTALL_REPAIR})할 수 있습니다.`] },
    { heading: "인천 지역 페이지를 사용하는 순서", paragraphs: ["먼저 구·군 페이지에서 교통과 주거 유형을 확인하고, 동·읍·면 페이지에서 포장이사·입주청소·에어컨·소형이사·TV 설치처럼 현재 필요한 문제를 확인하세요. 주요 아파트 페이지는 관리사무소에 물어볼 질문을 단지 유형에 맞게 정리합니다.", "모든 지역 페이지는 상위 구·군과 같은 행정구역의 다른 지역으로 연결됩니다. 실제 인접 여부와 이동 경로는 전체 도로명 주소와 지도를 기준으로 다시 확인하세요."], checklist: ["현재 주소와 2026년 구 명칭 대조", "출발지·도착지 차량 진입 사진", "엘리베이터·사다리차·선박 여부", "청소와 설치 작업 시간 분리", "견적의 포함·별도 항목 기록"] },
  ],
  faq: [
    { question: "인천 서구가 서해구와 검단구로 바뀌었나요?", answer: "2026년 7월 1일 행정체계 개편으로 기존 서구 지역은 서해구와 검단구로 나뉘었습니다. 계약서와 서비스 신청에는 현재 공식 주소를 확인해 적으세요." },
    { question: "영종도 이사는 일반 인천 이사와 무엇이 다른가요?", answer: "육지에서 들어갈 때 교량 통행 경로와 정체, 공항권 교통, 작업팀 이동 시간을 고려해야 합니다. 출발지·도착지 작업 가능 시간 사이에 여유를 두세요." },
    { question: "인천의 모든 읍·면·동 페이지가 연결되어 있나요?", answer: "네. 2026년 7월 1일 공식 행정체계의 1읍·19면·138동이 모두 구·군 키워드트리에 연결되어 있습니다. 실제 도로명 주소와 지리적 인접 여부는 별도로 확인하세요." },
  ], source: ADMIN_SOURCE,
};

function makeDistrictArticle(profile: DistrictProfile, index: number): Article {
  return {
    slug: profile.slug,
    title: districtTitles[profile.slug],
    description: `${profile.name}의 행정동 목록과 ${profile.character}의 이사 조건, 차량·엘리베이터·청소·설치 확인사항을 정리했습니다.`,
    category: "regional", categoryLabel: "지역별 정보", keyword: `${profile.name} 이사`, secondaryKeywords: [`${profile.name} 포장이사`, `${profile.name} 이사 견적`, `${profile.name} 입주청소`], readingTime: 8,
    publishedAt: "2026-09-02T00:00:00.000Z", updatedAt: "2026-09-02T00:00:00.000Z", accent: ["mint","amber","blue","violet","rose","green"][index % 6], affiliateNotice: true,
    heroImage: heroFor(profile, `${profile.name} 이사`), regionTree: districtTree(profile),
    intro: `${profile.name}은 ${profile.character}입니다. 따라서 주소만 전달하기보다 주거 형태와 마지막 차량 진입 구간, 공동주택 예약 또는 섬 이동 조건을 함께 설명해야 실제 작업 방식에 가까운 견적을 받을 수 있습니다.`,
    sections: [
      { heading: `${profile.name}에서 먼저 볼 지역 구조`, paragraphs: [`${profile.character}입니다. 공식 행정구역은 ${profile.units.length}개 읍·면·동으로 구성되며, 이 페이지 위 키워드트리에서 전체 이름을 확인할 수 있습니다.`, `${profile.transport} [포장이사 2곳 견적을 같은 조건으로 비교](${TWO_QUOTES})할 때 출발지와 도착지의 층수·주차·이동시간을 따로 적으세요.`] },
      { heading: "주거 형태와 건물 조건", paragraphs: [`${profile.housing} 같은 동 안에서도 아파트 단지와 단독·다세대는 승강기, 사다리차, 포장 범위가 달라집니다.`, `${profile.moving} 관리사무소가 있는 건물은 이사 가능 시간, 엘리베이터 사용료, 보양과 차량 등록을 직접 확인해야 합니다.`], checklist: ["건물 유형과 층수", "차량이 설 수 있는 실제 위치", "엘리베이터 예약·보양", "대형 가구 반입 치수"] },
      { heading: "입주청소와 하자·원상복구 순서", paragraphs: ["청소는 짐 반입 전에 끝내고, 벽·바닥·창호 상태는 물건으로 가리기 전에 촬영하세요. 임대주택은 기존 하자와 새 오염을 구분해 임대인 또는 중개인에게 공유하는 편이 좋습니다.", `[이사·입주청소 견적 비교](${CLEANING_COMPARE})에서는 면적뿐 아니라 창틀, 베란다, 붙박이장 내부와 오염 상태를 같은 조건으로 전달하세요.`] },
      { heading: "에어컨·TV 등 설치 작업 연결", paragraphs: ["이삿짐 운반과 전문 설치의 담당자가 다르면 철거·운반·재설치 사이의 책임 범위를 문서로 나누세요. 신축은 벽체와 배관 경로, 구축은 전기 용량과 기존 타공 흔적을 확인합니다.", `[설치·수리 견적 비교](${INSTALL_REPAIR}) 전 제품 모델명, 설치 위치와 벽·배관 사진을 준비하면 현장 추가 작업 가능성을 판단하기 쉽습니다.`] },
      { heading: "주변 지역과 다음 단계", paragraphs: [`[${profile.priority} 상세 가이드](/articles/${profile.prioritySlug})에서 ${profile.name} 안의 대표 생활권 조건을 더 구체적으로 확인할 수 있습니다. 구 경계를 넘는 지역은 위 키워드트리와 하단 연관 글에서 이어집니다.`, "최종 계약 전에는 차량·인원·장비, 대기와 추가요금, 파손 접수 절차가 견적서에 모두 적혀 있는지 확인하세요."] },
    ],
    faq: [
      { question: `${profile.name} 이사 견적에 무엇을 먼저 알려야 하나요?`, answer: `출발지·도착지의 건물 유형, 층수, 엘리베이터와 주차, 짐 목록을 같은 양식으로 전달하세요. ${profile.moving}` },
      { question: `${profile.name} 입주청소는 이사 당일 해도 되나요?`, answer: "가능 여부는 일정과 현장에 따라 다르지만 청소와 짐 반입이 겹치면 작업 품질과 하자 확인이 어려워질 수 있습니다. 가능한 한 빈집 시간을 분리하세요." },
      { question: `${profile.name}의 다른 읍·면·동 페이지도 있나요?`, answer: `네. 위 ${profile.name} 키워드트리에서 공식 읍·면·동 전체 상세 페이지로 이동할 수 있습니다. 각 글은 서로 다른 이사·청소·설치 질문을 중심으로 구성했습니다.` },
    ], source: ADMIN_SOURCE,
  };
}

function makeAreaArticle(profile: DistrictProfile, index: number): Article {
  const localApartments = apartmentByArea.get(profile.priority) ?? [];
  return {
    slug: profile.prioritySlug,
    title: areaTitles[profile.prioritySlug],
    description: `${profile.name} ${profile.priority} 이사를 준비할 때 확인할 교통·건물 조건, 포장이사·청소·설치 순서와 주변 지역 내부링크를 정리했습니다.`,
    category: "regional", categoryLabel: "지역별 정보", keyword: `${profile.priority} 이사`, secondaryKeywords: [`${profile.priority} 포장이사`, `${profile.priority} 이사 견적`, `${profile.priority} 입주청소`], readingTime: 7,
    publishedAt: "2026-09-02T00:00:00.000Z", updatedAt: "2026-09-02T00:00:00.000Z", accent: ["blue","green","amber","mint","violet","rose"][index % 6], affiliateNotice: true,
    heroImage: heroFor(profile, `${profile.priority} 이사`),
    regionTree: { title: `${profile.priority}에서 이어지는 지역`, description: "상위 구·군과 같은 생활권의 주요 아파트, 다음으로 확인할 인천 지역을 연결합니다.", districts: [{ name: profile.name, href: `/articles/${profile.slug}`, dongs: [{ name: profile.priority, href: `/articles/${profile.prioritySlug}`, apartments: localApartments.map((item) => ({ name: item.name, href: `/articles/${item.slug}` })) }] }] },
    intro: `${profile.priority}은 ${profile.character} 안에서 대표적으로 먼저 살펴볼 생활권입니다. ${profile.transport} 이사 차량의 시작점부터 현관까지 실제 동선을 확인하고, 주거 형태에 맞춰 승강기·사다리차·청소·설치를 분리해 계획하세요.`,
    sections: [
      { heading: `${profile.priority} 지역 특성과 이사 동선`, paragraphs: [`${profile.transport} 지도상 도로가 넓어 보여도 단지 출입구, 시장·학교, 마을길이나 공사 구간 때문에 마지막 진입이 달라질 수 있습니다.`, `현장 사진을 같은 방식으로 전달해 [포장이사 전문 상담을 확인](${PACKING_MOVE})하고 차량·인원·장비가 계약서에 표시되는지 보세요.`] },
      { heading: "거주 형태별 준비 포인트", paragraphs: [`${profile.housing} 아파트는 관리 예약과 지하 높이, 빌라·단독은 계단과 주차 거리, 상가주택은 영업·하역 시간을 먼저 확인하세요.`, "냉장고·소파·침대는 현관과 계단, 승강기 치수를 재고 분해 여부를 견적서에 남기세요."], checklist: ["도로에서 현관까지 운반 거리", "승강기 또는 계단 작업", "사다리차 설치 가능 공간", "관리사무소·이웃 안내"] },
      { heading: "집수리·복원과 청소는 짐보다 먼저", paragraphs: ["도배·바닥·실리콘·타공 복원은 짐이 들어오면 작업 범위가 가려질 수 있습니다. 기존 집 원상복구와 새집 하자 보수의 책임자를 나눠 사진과 합의 내용을 보관하세요.", `물 자국이나 곰팡이처럼 누수가 의심되면 마감을 덮기 전에 [누수·설비 점검 견적](${MOVE_REPAIR})을 받아보세요. 수리가 필요한 위치, 크기와 마감재 사진을 함께 준비하면 원인 조사 범위를 정하기 쉽습니다.`] },
      { heading: "에어컨·TV·생활설치 일정", paragraphs: ["설치기사가 이삿짐 작업 중 같은 공간을 쓰면 대기나 파손 위험이 커질 수 있습니다. 큰 가구 배치가 끝난 뒤 벽체·전원·배관을 확인할 수 있도록 시간을 분리하세요.", `[설치·수리 견적을 비교](${INSTALL_REPAIR})할 때 제품 모델과 철거 여부, 새집 설치 위치를 함께 전달하세요.`] },
      { heading: "주변 지역 내부링크", paragraphs: [`상위 정보는 [${profile.name} 이사 가이드](/articles/${profile.slug})에서 확인할 수 있습니다. 구 경계를 넘는 지역과 주요 공동주택은 위 키워드트리와 하단 연관 글에서 이어집니다.`, localApartments.length ? `${profile.priority}의 검토된 주요 공동주택 ${localApartments.map((item) => item.name).join(", ")}은 별도 단지 체크리스트로 연결했습니다.` : "이 지역은 공동주택 이름만으로 페이지를 만들지 않고 관리·교통 차별 정보가 검증된 단지부터 연결합니다."] },
    ],
    faq: [
      { question: `${profile.priority}에서 사다리차가 꼭 필요한가요?`, answer: "층수만으로 결정할 수 없습니다. 엘리베이터 크기, 창문, 전선·나무, 차량 설치 공간과 관리 규정을 현장 사진으로 확인해야 합니다." },
      { question: `${profile.priority} 이사 전 관리사무소에 무엇을 물어보나요?`, answer: "이사 가능 시간, 엘리베이터 예약·사용료, 보양, 차량 진입과 사다리차 위치를 확인하세요. 관리사무소가 없는 건물은 임대인·관리인과 주차·계단 사용을 협의하세요." },
      { question: "청소와 설치를 같은 날 해도 되나요?", answer: "공간과 작업 동선이 겹치지 않으면 가능하지만 대기와 재오염이 생길 수 있습니다. 청소 완료, 큰 짐 배치, 전문 설치 순으로 시간대를 나누는 편이 실용적입니다." },
    ], source: ADMIN_SOURCE,
  };
}

type UnitFocus = {
  title: (name: string) => string;
  keyword: (name: string) => string;
  secondary: (name: string) => string[];
  heading: string;
  answer: (name: string) => string;
  action: (name: string) => string;
  ctaLabel: string;
  ctaUrl: string;
  checklist: string[];
  faqQuestion: (name: string) => string;
  faqAnswer: string;
};

const unitFocuses: UnitFocus[] = [
  {
    title: (name) => `${name} 포장이사 견적, 추가금 막으려면 무엇을 확인할까?`,
    keyword: (name) => `${name} 포장이사 견적`,
    secondary: (name) => [`${name} 이사`, `${name} 포장이사`, `${name} 이사업체`],
    heading: "포장이사 견적에서 빠지기 쉬운 조건",
    answer: (name) => `${name} 포장이사 견적은 짐의 양보다 출발지와 도착지의 차량 진입, 승강기·계단, 대기 가능성을 같은 기준으로 전달하는 것이 먼저입니다. 총액만 비교하면 장비와 인원이 빠진 견적을 구분하기 어렵습니다.`,
    action: () => "방·베란다·창고를 같은 순서로 촬영하고, 버릴 물건과 가져갈 물건을 나눈 뒤 두 집의 층수와 주차 위치를 별도로 적으세요.",
    ctaLabel: "포장이사 2곳 견적 비교",
    ctaUrl: TWO_QUOTES,
    checklist: ["방별 짐 사진과 대형가전 수량", "출발지·도착지 층수와 주차", "승강기·계단·사다리차", "대기·보관·추가 작업 조건"],
    faqQuestion: (name) => `${name} 포장이사 견적은 몇 곳을 비교하면 되나요?`,
    faqAnswer: "업체 수보다 모든 업체에 같은 짐과 건물 조건을 전달하는 것이 중요합니다. 실무적으로는 2~3곳의 포함·별도 항목을 같은 표로 비교하면 차이를 찾기 쉽습니다.",
  },
  {
    title: (name) => `${name} 입주청소와 이사, 빈집 시간은 어떻게 잡을까?`,
    keyword: (name) => `${name} 입주청소`,
    secondary: (name) => [`${name} 이사`, `${name} 이사청소`, `${name} 입주 준비`],
    heading: "입주청소 범위와 빈집 시간 정하기",
    answer: (name) => `${name} 입주청소는 짐이 들어오기 전 빈집 상태에서 진행해야 창틀·수납장·바닥을 확인하기 쉽습니다. 신축은 공사 먼지와 하자를, 구축은 생활 오염과 기존 손상을 구분해 사진으로 남기세요.`,
    action: () => "면적만 전달하지 말고 베란다, 창틀, 붙박이장 내부와 오염 상태를 보여주고 포함 작업·추가 작업을 문서로 나누세요.",
    ctaLabel: "이사·입주청소 견적 비교",
    ctaUrl: CLEANING_COMPARE,
    checklist: ["청소 시작 전 하자 사진", "창틀·베란다·수납장 포함 여부", "폐기물과 스티커 제거 범위", "청소 종료와 짐 반입 사이 여유"],
    faqQuestion: (name) => `${name} 입주청소를 이사 당일에 해도 되나요?`,
    faqAnswer: "가능 여부는 현장과 일정에 따라 다르지만 청소와 짐 반입이 겹치면 작업 구역이 가려지고 재오염될 수 있습니다. 빈집 청소가 끝난 뒤 짐을 들이는 순서가 실용적입니다.",
  },
  {
    title: (name) => `${name} 에어컨 이전설치, 이사 일정과 어떻게 맞출까?`,
    keyword: (name) => `${name} 에어컨 이전설치`,
    secondary: (name) => [`${name} 이사`, `${name} 에어컨 설치`, `${name} 설치 견적`],
    heading: "에어컨 철거·운반·재설치 범위 나누기",
    answer: (name) => `${name} 에어컨 이전설치는 철거, 운반, 재설치 담당자가 같지 않을 수 있습니다. 새집의 실외기 위치, 배관 경로, 전원과 타공 가능 여부를 확인한 뒤 작업 순서와 책임 범위를 나누세요.`,
    action: () => "제품 모델명, 기존 배관 상태, 새집 실내기·실외기 예정 위치를 사진으로 보내고 추가 배관이나 전기 작업이 필요한 조건을 먼저 물어보세요.",
    ctaLabel: "설치·수리 견적 비교",
    ctaUrl: INSTALL_REPAIR,
    checklist: ["제품 모델명과 철거 여부", "실내기·실외기 설치 위치", "배관 길이와 타공 가능성", "이삿짐 작업과 설치 시간 분리"],
    faqQuestion: (name) => `${name} 에어컨 이전설치 비용은 왜 달라지나요?`,
    faqAnswer: "제품 형태, 배관과 전선 길이, 실외기 위치, 타공·앵글·고소 작업 등 현장 조건에 따라 달라질 수 있습니다. 고정 금액보다 기본 포함 범위와 추가 작업 기준을 확인하세요.",
  },
  {
    title: (name) => `${name} 원룸·소형이사, 용달과 반포장은 어떻게 고를까?`,
    keyword: (name) => `${name} 원룸이사`,
    secondary: (name) => [`${name} 이사`, `${name} 용달이사`, `${name} 반포장이사`],
    heading: "용달·일반·반포장이사를 고르는 기준",
    answer: (name) => `${name} 원룸·소형이사는 차량만 필요한지, 운반 인력이 필요한지, 포장까지 맡길지를 먼저 정해야 합니다. 같은 ‘용달’이라도 기사 도움과 계단 작업 포함 여부가 다를 수 있습니다.`,
    action: () => "침대·냉장고·세탁기처럼 혼자 들기 어려운 짐, 엘리베이터 유무, 포장 가능한 시간을 적고 필요한 작업만 견적에 포함하세요.",
    ctaLabel: "이사업체 견적 비교",
    ctaUrl: MOVING_COMPARE,
    checklist: ["차량만 또는 운반 인력 포함", "포장·정리 도움 범위", "계단·승강기와 주차 거리", "대형가전 연결·분리 담당"],
    faqQuestion: (name) => `${name} 원룸이사는 용달이 가장 저렴한가요?`,
    faqAnswer: "직접 포장하고 운반을 도울 수 있다면 차량 중심 방식이 유리할 수 있지만, 인력·계단·대기 작업을 추가하면 달라집니다. 필요한 작업을 모두 넣은 총조건으로 비교하세요.",
  },
  {
    title: (name) => `${name} 벽걸이TV 이전설치, 철거·벽체 확인은 언제 할까?`,
    keyword: (name) => `${name} 벽걸이TV 이전설치`,
    secondary: (name) => [`${name} 이사`, `${name} TV 설치`, `${name} 설치 수리`],
    heading: "벽걸이TV 철거와 새집 벽체 확인",
    answer: (name) => `${name} 벽걸이TV 이전설치는 운반보다 기존 브래킷 철거, 새집 벽체와 타공 규정 확인이 먼저입니다. 이사업체가 운반만 담당하는지 전문기사가 철거·재설치까지 맡는지 구분하세요.`,
    action: () => "TV 크기와 모델, 브래킷 종류, 기존 설치 사진, 새집 벽면과 콘센트 위치를 준비하고 무타공 방식이 필요한지도 미리 알리세요.",
    ctaLabel: "벽걸이TV 설치·철거 견적 비교",
    ctaUrl: TV_MOUNT,
    checklist: ["TV 모델과 화면 크기", "브래킷 재사용 가능 여부", "새집 벽체와 타공 규정", "철거·운반·설치 책임자"],
    faqQuestion: (name) => `${name} 벽걸이TV 브래킷을 재사용할 수 있나요?`,
    faqAnswer: "TV와 브래킷 규격, 벽체와 설치 방식에 따라 달라집니다. 모델명과 기존 설치 사진을 전문기사에게 보여주고 호환성과 필요한 부품을 확인하세요.",
  },
];

function areaContext(profile: DistrictProfile, name: string) {
  if (profile.name === "옹진군") return { label: "섬 지역 운송", text: "옹진군은 섬별 접근 방식이 다르므로 여객선 운항, 차량 선적 가능 여부와 섬 안 하역 인력을 이사 날짜 전에 따로 확인해야 합니다.", image: HERO_OLD_TOWN };
  if (profile.name === "강화군" && name !== "강화읍") return { label: "면 지역 차량 진입", text: "강화군 면 지역은 주소에 따라 마을길 폭과 집 앞 주차 가능 여부가 달라질 수 있습니다. 대형 차량 대신 소형 차량 환적이 필요한지 현장 사진으로 확인하세요.", image: HERO_OLD_TOWN };
  if (profile.name === "영종구") return { label: "교량 이동과 도착시간", text: "영종구는 육지에서 들어오는 차량의 교량 이동시간과 도착지 작업 가능 시간을 함께 맞춰야 합니다. 공항권 교통 변수까지 고려해 예약 사이에 여유를 두세요.", image: HERO_CITY };
  if (/^(송도|청라|아라)/.test(name)) return { label: "계획도시 공동주택", text: "공동주택으로 이사한다면 단지별 엘리베이터 배정, 지하주차장 높이, 차량 등록과 공용부 보양을 관리사무소에 확인하세요. 같은 동 안에서도 단지 규정은 다를 수 있습니다.", image: HERO_APARTMENT };
  if (profile.oldTown) return { label: "원도심 최종 진입", text: "원도심 생활권은 큰 도로보다 건물 앞 마지막 진입 구간이 중요합니다. 골목 폭, 경사, 계단과 실제 주차 위치를 낮 시간에 촬영해 견적에 반영하세요.", image: HERO_OLD_TOWN };
  return { label: "도시 생활권 건물 조건", text: "간선도로 접근성과 별개로 건물 앞 주차, 승강기 크기와 현관까지 운반 거리가 작업시간을 좌우합니다. 주소별 조건을 관리주체와 현장에서 확인하세요.", image: HERO_CITY };
}

function makeAdditionalUnitArticle(profile: DistrictProfile, name: string, districtIndex: number, unitIndex: number): Article {
  const focus = unitFocuses[(districtIndex * 3 + unitIndex) % unitFocuses.length];
  const context = areaContext(profile, name);
  const slug = unitSlug(profile, name);
  const localApartments = apartmentByArea.get(name) ?? [];
  const previous = profile.units[(unitIndex - 1 + profile.units.length) % profile.units.length];
  const next = profile.units[(unitIndex + 1) % profile.units.length];
  return {
    slug,
    title: focus.title(name),
    description: `${profile.name} ${name}에서 이사할 때 ${focus.heading}, 차량·건물 조건과 일정 순서를 실제 확인 질문 중심으로 정리했습니다.`,
    category: "regional", categoryLabel: "지역별 정보", keyword: focus.keyword(name), secondaryKeywords: focus.secondary(name), readingTime: 7,
    publishedAt: "2026-09-02T00:00:00.000Z", updatedAt: "2026-09-02T00:00:00.000Z", accent: ["blue","green","amber","mint","violet","rose"][(districtIndex + unitIndex) % 6], affiliateNotice: true,
    heroImage: { src: context.image, alt: `${profile.name} ${name}에서 이사 차량과 건물 진입 조건을 확인하는 일러스트`, title: `${name} 이사` },
    regionTree: {
      title: `${name}과 같은 ${profile.name} 지역`,
      description: "상위 구·군과 같은 행정구역의 앞뒤 지역을 연결했습니다. 실제 지리적 인접 여부는 주소와 지도를 다시 확인하세요.",
      districts: [{ name: profile.name, href: `/articles/${profile.slug}`, dongs: [previous, name, next].map((unit) => ({ name: unit, href: `/articles/${unitSlug(profile, unit)}`, apartments: (apartmentByArea.get(unit) ?? []).map((item) => ({ name: item.name, href: `/articles/${item.slug}` })) })) }],
    },
    intro: `${name} 이사는 지역명만으로 가격을 정할 수 없습니다. ${profile.transport} 이 페이지에서는 ${focus.heading}과 ${context.label}, 건물별 확인사항을 순서대로 정리합니다.`,
    sections: [
      { heading: `${name}은 ${profile.name}의 공식 행정구역입니다`, paragraphs: [`2026년 7월 1일 인천광역시 행정체계에서 ${name}은 ${profile.name}에 속합니다. 행정동 이름과 실제 도로명 주소의 법정동 표기가 다를 수 있으므로 견적·예약에는 전체 주소와 건물명을 함께 전달하세요.`, `${profile.character}인 만큼 ${profile.moving}`] },
      { heading: focus.heading, paragraphs: [focus.answer(name), `${focus.action(name)} 조건을 정리한 뒤 [${focus.ctaLabel}](${focus.ctaUrl})에서 같은 기준으로 확인하세요.`], checklist: focus.checklist },
      { heading: `${context.label}에서 놓치기 쉬운 점`, paragraphs: [context.text, "확인되지 않은 지역 평균가격이나 고정 작업비를 기준으로 계약하지 마세요. 실제 비용은 짐, 건물, 이동거리, 작업 인원과 장비 조건에 따라 달라질 수 있습니다."] },
      { heading: "이사 전날과 당일 확인 순서", paragraphs: ["전날에는 업체명·담당자·시작시간·주소를 다시 맞추고 귀중품과 하루치 생활용품을 따로 보관하세요. 기존 집과 새집의 벽·바닥·가전 상태도 짐이 가리기 전에 촬영합니다.", "작업 종료 전에는 상자 수, 가구·가전 파손, 조립과 설치 범위를 확인하고 추가 작업이 있었다면 이유와 금액이 기록됐는지 살펴보세요."], checklist: ["담당자·시간·두 주소 재확인", "귀중품·서류 직접 운반", "벽·바닥·가전 상태 촬영", "추가 작업 승인 기록"] },
      { heading: `${name}에서 다음으로 확인할 지역`, paragraphs: [`상위 구조와 ${profile.units.length}개 읍·면·동 전체 목록은 [${profile.name} 이사 가이드](/articles/${profile.slug})에서 확인할 수 있습니다. 같은 구·군의 다른 지역과 주요 아파트는 위 키워드트리와 하단 연관 글로 이어집니다.`, localApartments.length ? `${name}의 검토된 주요 공동주택 ${localApartments.map((item) => item.name).join(", ")}은 단지별 관리 확인사항을 별도 페이지에 정리했습니다.` : "특정 아파트의 엘리베이터 사용료나 이사 가능시간은 고정 정보로 단정하지 않고 해당 관리사무소의 최신 안내를 확인해야 합니다."] },
    ],
    faq: [
      { question: focus.faqQuestion(name), answer: focus.faqAnswer },
      { question: `${name} 이사에서 사다리차가 꼭 필요한가요?`, answer: "층수만으로 정할 수 없습니다. 승강기 크기, 창문, 전선·나무, 차량 설치 공간과 건물 관리 규정을 사진으로 확인한 뒤 결정하세요." },
      { question: `${name} 주변 지역 글은 어디에서 찾나요?`, answer: `위 키워드트리와 ${profile.name} 허브에서 공식 읍·면·동 전체 페이지로 이동할 수 있습니다. 목록 순서는 행정구역 표기 순서이며 실제 인접 여부는 지도로 다시 확인하세요.` },
    ], source: ADMIN_SOURCE,
  };
}

function makeApartmentArticle(apartment: ApartmentProfile, index: number): Article {
  const district = districtProfiles.find((item) => item.name === apartment.district)!;
  return {
    slug: apartment.slug,
    title: `${apartment.name} 이사, 엘리베이터·차량 예약은 어떻게 할까?`,
    description: `${apartment.name} 이사 전 관리사무소에 확인할 엘리베이터, 차량 진입, 보양, 입주청소와 설치 순서를 정리했습니다.`,
    category: "regional", categoryLabel: "지역별 정보", keyword: `${apartment.name} 이사`, secondaryKeywords: [`${apartment.name} 입주`, `${apartment.area} 포장이사`, `${apartment.district} 아파트 이사`], readingTime: 7,
    publishedAt: "2026-09-02T00:00:00.000Z", updatedAt: "2026-09-02T00:00:00.000Z", accent: ["mint","blue","violet","amber","green","rose"][index % 6], affiliateNotice: true,
    heroImage: { src: HERO_APARTMENT, alt: `${apartment.name}와 같은 고층 공동주택의 이삿짐 운반 일러스트`, title: "아파트 이사" },
    intro: `${apartment.name}은 ${apartment.setting}입니다. 단지의 실제 이사 규정과 비용은 시기·동·관리 기준에 따라 달라질 수 있으므로, 이 글은 확인해야 할 질문을 정리합니다. 특정 사용료나 가능 시간을 단정하지 말고 관리사무소의 최신 안내를 우선하세요.`,
    sections: [
      { heading: `${apartment.name}에서 먼저 확인할 동선`, paragraphs: [`${apartment.access} 출입구에서 해당 동까지의 경로, 트럭 대기 위치와 지하주차장 높이를 사진 또는 단지 안내로 확인하세요.`, `${apartment.caution} 같은 조건으로 [이사업체 견적을 비교](${MOVING_COMPARE})해야 차량·인원 차이를 판단할 수 있습니다.`] },
      { heading: "관리사무소에 물어볼 6가지", paragraphs: ["이사 가능 요일과 시간, 엘리베이터 예약, 사용료 여부, 공용부 보양, 차량 등록, 사다리차 가능 위치를 확인하세요. 규정은 바뀔 수 있으므로 계약 직전 다시 확인하는 편이 안전합니다.", "냉장고·소파·침대 프레임은 현관문, 복도와 승강기 치수를 대조하고 분해·재조립 책임을 견적서에 적으세요."], checklist: ["예약 가능한 날짜·시간", "승강기 배정과 사용료", "공용부 보양 범위", "지하 높이·차량 등록", "사다리차 가능 위치", "폐기물 배출 장소"] },
      { heading: "입주청소와 하자 사진 순서", paragraphs: ["빈집 상태에서 벽·바닥·창호·수납장과 설비를 촬영한 뒤 청소 범위를 확인하세요. 신축은 공사 먼지와 하자, 구축은 생활 오염과 기존 손상을 구분해 기록합니다.", `[이사·입주청소 견적을 비교](${CLEANING_COMPARE})할 때 면적만 보내지 말고 베란다, 창틀, 붙박이장과 오염 사진을 함께 전달하세요.`] },
      { heading: "에어컨·벽걸이TV·커튼 설치", paragraphs: ["관리사무소의 타공·실외기·보양 규정과 전기·배관 위치를 확인하세요. 이사업체의 운반 범위와 전문 설치기사의 철거·재설치 범위를 분리하면 책임이 명확해집니다.", `[설치·수리 견적을 비교](${INSTALL_REPAIR})하기 전 제품 모델, 기존 설치 상태와 새 위치 사진을 준비하세요.`] },
      { heading: "같은 생활권과 주변 단지 연결", paragraphs: [`지역 전체 조건은 [${apartment.area} 이사 가이드](/articles/${district.prioritySlug})에서 확인하세요. 상위 ${apartment.district} 허브와 다른 생활권의 단지 페이지는 하단 연관 글에서 이어집니다.`, "단지 이름이 달라도 엘리베이터 예약, 지하 높이, 보양과 차량 동선을 같은 기준으로 비교하면 관리 조건의 차이를 찾기 쉽습니다."] },
    ],
    faq: [
      { question: `${apartment.name} 엘리베이터 사용료는 얼마인가요?`, answer: "단지의 최신 관리 규정과 작업 시간에 따라 달라질 수 있어 이 글에서 금액을 단정하지 않습니다. 예약 전 관리사무소에 사용료, 보양과 배정 시간을 직접 확인하세요." },
      { question: "사다리차를 사용할 수 있나요?", answer: "동 위치, 조경·전선, 차량 설치 공간과 단지 규정에 따라 달라집니다. 이사업체와 관리사무소 양쪽에 현장 사진을 보여주고 가능 여부와 대체 방식을 확인하세요." },
      { question: "입주청소는 언제 예약하면 좋나요?", answer: "하자 확인과 보수 일정을 먼저 보고 짐 반입 전에 빈집 청소 시간을 확보하세요. 청소와 이사가 같은 공간에서 겹치지 않도록 여유를 두는 것이 좋습니다." },
    ], source: APARTMENT_SOURCE,
  };
}

const additionalUnitArticles = districtProfiles.flatMap((profile, districtIndex) =>
  profile.units.flatMap((name, unitIndex) => name === profile.priority ? [] : [makeAdditionalUnitArticle(profile, name, districtIndex, unitIndex)]),
);

export const incheonArticles: Article[] = [
  cityArticle,
  ...districtProfiles.map(makeDistrictArticle),
  ...districtProfiles.map(makeAreaArticle),
  ...additionalUnitArticles,
  ...apartments.map(makeApartmentArticle),
];

const officialUnitCount = districtProfiles.reduce((count, profile) => count + profile.units.length, 0);
if (officialUnitCount !== 158) throw new Error(`Expected 158 Incheon units, got ${officialUnitCount}`);
if (incheonArticles.length !== 179) throw new Error(`Expected 179 Incheon articles, got ${incheonArticles.length}`);
if (new Set(incheonArticles.map((article) => article.slug)).size !== incheonArticles.length) throw new Error("Duplicate Incheon article slug detected");
