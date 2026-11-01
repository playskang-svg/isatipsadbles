import aptData from "@/data/apt-complexes.json";

export type City = "인천" | "천안" | "용인" | "평택";

export type Region = {
  /** 검색어에 쓰는 지역 표기. 예: 청라, 구월동, 수지 */
  label: string;
  /** 도시 + 표기. 제목 앞머리에 쓴다. 예: 인천 청라 */
  head: string;
  /** 행정구역 전체 이름 */
  full: string;
  city: City;
  /** K-apt 자료 키의 앞부분. "인천|서해구|청라동" 또는 "인천|서해구" */
  keys: string[];
  /** 사람이 쓴 지역 설명 */
  note: string;
};

type AptEntry = { n: number; e: number[]; t: [string, number][] };
const apt = aptData as unknown as Record<string, AptEntry>;
const aptKeys = Object.keys(apt);

const r = (label: string, city: City, full: string, keys: string[], note: string): Region => ({
  label,
  // "인천서구"는 검색어 표기다. 제목에서는 "인천 서구"로 쓴다.
  head: label === city ? city : label === "인천서구" ? "인천 서구" : `${city} ${label}`,
  full,
  city,
  keys,
  note,
});

export const regions: Region[] = [
  r("인천", "인천", "인천광역시", ["인천"], "원도심의 오래된 주택과 빌라부터 송도·청라·검단 신도시 고층 단지까지 건물 연식 차이가 큰 도시입니다. 같은 인천이라도 어느 구, 어느 해 지어진 집인지에 따라 수리 범위가 달라집니다."),
  r("연수구", "인천", "인천 연수구", ["인천|연수구"], "옥련·연수·동춘동의 구축 아파트와 송도동의 초고층 단지가 한 구에 있어, 같은 구 안에서도 자재 규격과 관리 규정이 크게 다릅니다."),
  r("남동구", "인천", "인천 남동구", ["인천|남동구"], "구월·만수·간석의 구축 주거지와 논현·서창의 계획형 단지가 함께 있습니다. 구축은 배관과 창호, 계획형 단지는 작업 신고와 주차 규정을 먼저 봐야 합니다."),
  r("부평", "인천", "인천 부평구", ["인천|부평구"], "역세권 오피스텔과 다세대가 많고 부개·산곡·삼산에 대단지가 모여 있습니다. 전월세 비중이 높아 원상복구 조건을 함께 따져 보는 집이 많습니다."),
  r("계양", "인천", "인천 계양구", ["인천|계양구"], "작전·효성·계산의 구축 아파트와 빌라에 정비사업 신축 단지가 더해진 지역입니다. 신축은 하자보수 접수를, 구축은 배관과 창호 상태를 먼저 확인합니다."),
  r("미추홀구", "인천", "인천 미추홀구", ["인천|미추홀구"], "주안·도화·용현·학익에 구축 아파트와 다세대, 재개발 신축이 촘촘히 섞여 있습니다. 골목이 좁은 곳은 자재 운반과 작업 차량 정차 위치까지 견적에 영향을 줍니다."),
  r("인천서구", "인천", "인천 서해구·검단구(옛 서구)", ["인천|서해구", "인천|검단구"], "2026년 7월 행정구역 개편으로 옛 서구가 서해구와 검단구로 나뉘었습니다. 청라·검단 신도시의 고층 단지와 가좌·석남의 구축 주거지가 대조적입니다."),
  r("영종도", "인천", "인천 영종구", ["인천|영종구"], "운서·운남·중산동의 대단지가 중심이고 육지에서 들어오는 작업자는 교량 이동 시간이 걸립니다. 방문 가능 요일과 출장 조건을 먼저 물어보는 편이 빠릅니다."),
  r("송도", "인천", "인천 연수구 송도동", ["인천|연수구|송도동"], "송도국제도시는 고층 아파트와 주상복합이 대부분이라 시스템 창호와 지정 자재가 많습니다. 관리사무소 작업 신고와 승강기 예약을 먼저 챙기는 지역입니다."),
  r("청라", "인천", "인천 서해구 청라동", ["인천|서해구|청라동"], "청라국제도시는 고층 대단지가 모여 있어 같은 평형이면 창호와 방충망 규격이 비슷한 경우가 많습니다. 관리규약상 외부 작업 제한이 있는지 먼저 확인하세요."),
  r("검단", "인천", "인천 검단구", ["인천|검단구"], "마전·당하·원당·불로의 기존 택지 단지와 검단신도시 신축이 함께 있습니다. 신축은 하자보수 접수 기간을, 기존 단지는 노후 부속 교체를 먼저 살핍니다."),
  r("구월동", "인천", "인천 남동구 구월동", ["인천|남동구|구월동"], "인천시청과 터미널 상권을 끼고 구축 대단지, 오피스텔, 상가주택이 함께 있습니다. 건물 형태마다 관리 주체가 달라 작업 가능 시간을 먼저 확인해야 합니다."),
  r("논현동", "인천", "인천 남동구 논현동", ["인천|남동구|논현동"], "소래포구 인근 논현지구의 계획형 아파트 단지가 중심입니다. 단지별 관리 규정과 주차 조건을 사진과 함께 알려 주면 견적이 빨라집니다."),
  r("주안", "인천", "인천 미추홀구 주안동", ["인천|미추홀구|주안동"], "주안역 주변 다세대와 구축 아파트에 재개발 신축이 더해지는 동네입니다. 오래된 건물은 공용 배관과 세대 안 설비를 나눠서 봐야 합니다."),
  r("만수동", "인천", "인천 남동구 만수동", ["인천|남동구|만수동"], "오래전 입주한 아파트 단지가 많은 주거지입니다. 설비와 문, 창호 부속이 함께 낡아 있는 경우가 많아 한 번에 묶어 견적을 받아 보는 집도 많습니다."),
  r("천안", "천안", "충남 천안시", ["천안"], "서북구 불당·쌍용·두정의 아파트 밀집지와 동남구 원도심, 읍면 단독주택의 조건이 크게 다릅니다. 건물 형태와 입주 연도를 먼저 알려야 견적이 맞아 들어갑니다."),
  r("불당동", "천안", "천안 서북구 불당동", ["천안|서북구|불당동"], "천안시청과 천안아산역 생활권의 고층 아파트와 주상복합이 모여 있습니다. 지하주차장 동선과 승강기 사용 규정이 단지마다 다릅니다."),
  r("두정동", "천안", "천안 서북구 두정동", ["천안|서북구|두정동"], "두정역 주변의 원룸과 대학가, 아파트 단지가 섞인 북부 도심입니다. 원룸은 집주인 동의와 원상복구 범위부터 확인하는 경우가 많습니다."),
  r("백석동", "천안", "천안 서북구 백석동", ["천안|서북구|백석동"], "산업시설과 대단지 공동주택, 상업시설이 맞닿아 있습니다. 출퇴근 시간에는 차량 진입이 늦어질 수 있어 작업 시간을 넉넉히 잡습니다."),
  r("신부동", "천안", "천안 동남구 신부동", ["천안|동남구|신부동"], "종합터미널과 대학가 상권을 낀 곳으로 원룸·오피스텔과 아파트가 섞여 있습니다. 소형 주택은 주차와 운반 거리가 비용에 영향을 줍니다."),
  r("봉명동", "천안", "천안 동남구 봉명동", ["천안|동남구|봉명동"], "봉명역과 병원·상업시설 주변에 아파트, 빌라, 원룸이 섞여 있습니다. 계단과 승강기 조건이 건물마다 달라 사진으로 먼저 알려 주는 편이 좋습니다."),
  r("성환", "천안", "천안 서북구 성환읍", ["천안|서북구|성환읍"], "성환역 주변 공동주택과 외곽 단독주택의 조건이 다릅니다. 외곽 주택은 출장 가능 여부와 자재 운반 경로를 먼저 물어보세요."),
  r("용인", "용인", "경기 용인시", ["용인"], "수지·기흥의 아파트 밀집지와 처인구 읍면의 저층·전원주택이 크게 다릅니다. 구와 읍면동까지 알려야 맞는 작업자를 찾기 쉽습니다."),
  r("수지", "용인", "용인 수지구", ["용인|수지구"], "풍덕천·죽전의 1990~2000년대 단지와 성복·상현의 최근 단지가 함께 있습니다. 입주 연도에 따라 창호, 문, 설비 상태가 다릅니다."),
  r("기흥", "용인", "용인 기흥구", ["용인|기흥구"], "신갈·구갈의 구도심 저층 주거와 동백·보정·마북의 아파트 지구가 함께 있습니다. 구도심 주택은 규격이 제각각이라 실측이 먼저입니다."),
  r("처인구", "용인", "용인 처인구", ["용인|처인구"], "김량장·역북의 구도심과 포곡·모현·남사 같은 읍 지역이 넓게 퍼져 있습니다. 읍면 주택은 출장 거리와 방문 가능 요일을 먼저 확인하세요."),
  r("동백", "용인", "용인 기흥구 동백동·중동", ["용인|기흥구|동백동", "용인|기흥구|중동"], "동백지구는 비슷한 시기에 입주한 대단지가 모여 있어 같은 단지 안에서 비슷한 수리가 이어지는 편입니다. 같은 단지 시공 경험이 있는지 물어보면 도움이 됩니다."),
  r("죽전", "용인", "용인 수지구 죽전동", ["용인|수지구|죽전동"], "대단지 아파트와 단국대 주변 원룸·오피스텔이 함께 있습니다. 전월세 세대는 시공 전에 집주인 동의를 받아 두는 편이 안전합니다."),
  r("상현동", "용인", "용인 수지구 상현동", ["용인|수지구|상현동"], "광교와 맞닿은 아파트 지역으로 입주 시기가 단지마다 다릅니다. 같은 동이라도 연차에 따라 먼저 볼 곳이 달라집니다."),
  r("평택", "평택", "경기 평택시", ["평택"], "고덕국제신도시의 신축 단지와 비전동·송탄·안중의 구축 주거지가 함께 있는 도시입니다. 권역이 넓어 출장 거리와 방문 일정을 먼저 맞춰야 합니다."),
  r("고덕", "평택", "평택 고덕동", ["평택||고덕동"], "삼성 평택캠퍼스 배후의 고덕국제신도시로 신축 대단지가 많습니다. 하자보수 기간 안인지 먼저 확인하고, 유상 수리는 그다음에 비교하세요."),
  r("비전동", "평택", "평택 비전동", ["평택||비전동"], "평택시청과 소사벌지구를 끼고 구축과 준신축 아파트가 함께 있는 평택 도심입니다. 단지 연식이 넓게 퍼져 있어 입주 연도를 함께 알려야 합니다."),
  r("안중", "평택", "평택 안중읍", ["평택||안중읍"], "평택 서부 안중 권역의 중심지로 아파트와 다세대, 외곽 주택이 함께 있습니다. 도심에서 오는 작업자는 출장 거리를 비용에 넣는 경우가 많습니다."),
  r("포승", "평택", "평택 포승읍", ["평택||포승읍"], "평택항과 산업단지 배후 지역으로 기숙사형 주거와 아파트가 섞여 있습니다. 바다와 가까운 곳은 금속 부속 부식도 함께 살펴보세요."),
  r("송탄", "평택", "평택 서정동·이충동·지산동 일대(옛 송탄)", ["평택||서정동", "평택||이충동", "평택||지산동", "평택||장당동", "평택||독곡동", "평택||신장동"], "서정리역과 오산공군기지 주변의 옛 송탄 권역으로 구축 아파트와 다세대가 많습니다. 오래된 건물은 설비와 창호를 함께 보는 편이 낫습니다."),
  r("팽성", "평택", "평택 팽성읍", ["평택||팽성읍"], "캠프 험프리스와 가까워 임대용 주택과 다세대가 많은 지역입니다. 임대 주택은 집주인 동의와 원상복구 범위를 먼저 정리하세요."),
];

const byLabel = new Map(regions.map((region) => [region.label, region]));

export function getRegion(label: string): Region {
  const region = byLabel.get(label);
  if (!region) throw new Error(`[local-repair] 지역 정의 없음: ${label}`);
  return region;
}

/** 평택은 구가 없어 키가 "평택|평택시|동"이다. "평택||동" 표기를 풀어 준다. */
function matches(key: string, prefix: string) {
  if (prefix.includes("||")) {
    const [city, dong] = prefix.split("||");
    const [c, , d] = key.split("|");
    return c === city && d === dong;
  }
  return key === prefix || key.startsWith(`${prefix}|`);
}

export type RegionStats = {
  count: number;
  eras: number[];
  top: [string, number][];
};

const ERA_LABELS = ["1990년 이전", "1990년대", "2000년대", "2010년대", "2020년 이후"];
const THIS_YEAR = 2026;

export function statsOf(region: Pick<Region, "keys">, limit = 8): RegionStats {
  const entries = aptKeys.filter((key) => region.keys.some((prefix) => matches(key, prefix))).map((key) => apt[key]);
  const eras = [0, 0, 0, 0, 0];
  let count = 0;
  const all: [string, number][] = [];
  for (const entry of entries) {
    count += entry.n;
    entry.e.forEach((value, index) => { eras[index] += value; });
    all.push(...entry.t);
  }
  all.sort((a, b) => a[1] - b[1]);
  const top: [string, number][] = [];
  const step = Math.max(1, (all.length - 1) / Math.max(1, limit - 1));
  for (let index = 0; index < limit && Math.round(index * step) < all.length; index += 1) {
    const item = all[Math.round(index * step)];
    if (!top.some((row) => row[0] === item[0])) top.push(item);
  }
  return { count, eras, top };
}

export function dominantEra(stats: RegionStats): string {
  const max = Math.max(...stats.eras);
  return ERA_LABELS[stats.eras.indexOf(max)];
}

export function ageOf(year: number): number {
  return THIS_YEAR - year;
}

export function ageBucket(year: number): "old" | "mid" | "recent" {
  const age = ageOf(year);
  if (age >= 25) return "old";
  if (age >= 10) return "mid";
  return "recent";
}

/** 단지가 가장 많이 몰린 연식대 */
export function mainBucket(stats: RegionStats): "old" | "mid" | "recent" {
  const old = stats.eras[0] + stats.eras[1];
  const mid = stats.eras[2] + stats.eras[3];
  const recent = stats.eras[4];
  if (old >= mid && old >= recent) return "old";
  if (recent > mid) return "recent";
  return "mid";
}

/** 동 허브 페이지 대상: K-apt 단지가 충분한 동 */
export type DongEntry = { city: City; gu: string; dong: string; key: string; entry: AptEntry };

export const dongEntries: DongEntry[] = aptKeys
  .map((key) => {
    const [city, gu, dong] = key.split("|");
    return { city: city as City, gu, dong, key, entry: apt[key] };
  })
  .filter((item) => item.entry.n >= 8)
  .sort((a, b) => b.entry.n - a.entry.n);

export { ERA_LABELS };

/** 여러 동을 묶은 지역의 동별 단지 수. 많은 순서. */
export function dongBreakdown(region: Pick<Region, "keys">): { dong: string; count: number; era: string }[] {
  return aptKeys
    .filter((key) => region.keys.some((prefix) => matches(key, prefix)))
    .map((key) => {
      const entry = apt[key];
      const max = Math.max(...entry.e);
      return { dong: key.split("|")[2], count: entry.n, era: ERA_LABELS[entry.e.indexOf(max)] };
    })
    .sort((a, b) => b.count - a.count);
}

/** 같은 구의 다른 동. 단지 수가 많은 순서. */
export function siblingDongs(city: City, gu: string, dong: string): { dong: string; count: number }[] {
  return aptKeys
    .filter((key) => key.startsWith(`${city}|${gu}|`) && !key.endsWith(`|${dong}`))
    .map((key) => ({ dong: key.split("|")[2], count: apt[key].n }))
    .sort((a, b) => b.count - a.count);
}
