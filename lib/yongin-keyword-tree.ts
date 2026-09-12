export type YonginDong = {
  name: string;
  slug: string;
  localNote: string;
  /** 창호 조건 체크리스트 분기 — 아파트형 대단지인지, 저층·전원주택형인지 */
  housingType: "apartment" | "lowrise";
};

export type YonginDistrict = {
  name: string;
  slug: string;
  localNote: string;
  /** 구 단위 공식 출처 — 행정구역 안내 페이지 */
  sourceLabel: string;
  sourceUrl: string;
  dongs: YonginDong[];
};

export const YONGIN_CITY_SLUG = "yongin-curtain-blind-installation-cost";
export const YONGIN_CITY_SOURCE = {
  label: "용인시청 — 행정안내도",
  url: "https://www.yongin.go.kr/home/yiIf/yiIfProd/yiIfProd07.jsp",
};

export const yonginDistricts: YonginDistrict[] = [
  {
    name: "수지구",
    slug: "yongin-suji-gu-curtain-blind",
    localNote: "수지구는 죽전·상현·성복 등 1990년대 이후 조성된 대규모 아파트 신도시가 이어져 있어, 신축 단지는 시스템 창호 규격이 통일된 경우가 많고 구축 단지는 발코니 확장 여부에 따라 실측 기준이 달라집니다.",
    sourceLabel: "용인시 수지구청 — 행정·법정구역 안내",
    sourceUrl: "https://www.sujigu.go.kr/lmth/01info0303.asp",
    dongs: [
      { name: "풍덕천1동", slug: "yongin-suji-pungdeokcheon-1-dong-curtain-blind", housingType: "apartment", localNote: "수지구청 인근의 1990년대 후반 입주 아파트가 많아 창호가 표준 규격인 경우가 대부분이라 기존 커튼봉 위치를 먼저 확인하면 실측이 수월합니다." },
      { name: "풍덕천2동", slug: "yongin-suji-pungdeokcheon-2-dong-curtain-blind", housingType: "apartment", localNote: "풍덕천 생활권 내 구축 아파트와 학원가 상가가 섞여 있어, 상가주택은 창틀 소재에 따라 무타공 압축봉의 고정력을 미리 시험해 보는 편이 안전합니다." },
      { name: "신봉동", slug: "yongin-suji-sinbong-dong-curtain-blind", housingType: "apartment", localNote: "광교산 자락의 타운하우스와 중형 단지가 섞여 있어 일반 아파트보다 창 높이와 형태가 다양해 기성품보다 맞춤 제작 비중이 높은 편입니다." },
      { name: "죽전1동", slug: "yongin-suji-jukjeon-1-dong-curtain-blind", housingType: "apartment", localNote: "죽전 생활권 중심의 대단지 아파트가 많아 동일 평형 세대라면 관리사무소에 표준 창 규격을 먼저 문의하면 견적 비교가 빨라집니다." },
      { name: "죽전2동", slug: "yongin-suji-jukjeon-2-dong-curtain-blind", housingType: "apartment", localNote: "단국대 죽전캠퍼스 인근이라 원룸·오피스텔 비중이 높아, 전월세 계약이라면 무타공 시공과 원상복구 조건을 집주인과 미리 확인하는 것이 특히 중요합니다." },
      { name: "죽전3동", slug: "yongin-suji-jukjeon-3-dong-curtain-blind", housingType: "apartment", localNote: "비교적 최근 입주한 대단지가 많아 발코니 확장 구조가 표준화된 편이라 세대별로 실측 기준을 크게 다르게 잡지 않아도 되는 경우가 많습니다." },
      { name: "동천동", slug: "yongin-suji-dongcheon-dong-curtain-blind", housingType: "apartment", localNote: "동천역 역세권의 신축 대단지가 중심이라 시스템 창호가 많고, 창틀 마감재에 따라 접착식 무타공 제품의 고정력 차이를 확인해 두는 편이 좋습니다." },
      { name: "성복동", slug: "yongin-suji-seongbok-dong-curtain-blind", housingType: "apartment", localNote: "성복역 인근 신축 고층 아파트가 많아 층고와 창 면적이 큰 세대가 흔해, 암막·차광 성능을 우선한다면 원단 폭과 무게를 먼저 계산해 보는 것이 좋습니다." },
      { name: "상현1동", slug: "yongin-suji-sanghyeon-1-dong-curtain-blind", housingType: "apartment", localNote: "광교신도시와 인접한 대단지 아파트 지역으로 준신축 세대가 많아 시스템 창호 규격에 맞는 기성 블라인드를 먼저 확인하면 비용을 아낄 수 있습니다." },
      { name: "상현2동", slug: "yongin-suji-sanghyeon-2-dong-curtain-blind", housingType: "apartment", localNote: "신축과 구축 단지가 함께 있는 구간이라 같은 동이라도 입주 연차에 따라 창호 규격이 달라질 수 있어 세대별 실측이 필요합니다." },
      { name: "상현3동", slug: "yongin-suji-sanghyeon-3-dong-curtain-blind", housingType: "apartment", localNote: "광교호수공원과 가까운 최신축 고층 단지가 많아 대형 창 시공 경험이 있는 업체인지 시공 사례를 먼저 확인하는 편이 안전합니다." },
    ],
  },
  {
    name: "기흥구",
    slug: "yongin-giheung-gu-curtain-blind",
    localNote: "기흥구는 신갈·구갈 등 구도심 저층 주거지와 동백·보정·마북 등 신도시 아파트 지구가 함께 있어, 단지 연식에 따라 창틀 구조와 실측 기준 차이가 큰 편입니다.",
    sourceLabel: "용인시 기흥구청 — 행정구역·법정구역 안내",
    sourceUrl: "https://www.giheunggu.go.kr/_lmth/01_info/info_0302.asp",
    dongs: [
      { name: "신갈동", slug: "yongin-giheung-singal-dong-curtain-blind", housingType: "lowrise", localNote: "기흥구의 구도심으로 저층 주택과 빌라가 많아 창틀이 표준 규격이 아닌 경우가 있어 방문 실측을 권장하는 지역입니다." },
      { name: "영덕1동", slug: "yongin-giheung-yeongdeok-1-dong-curtain-blind", housingType: "lowrise", localNote: "강남대 인근이라 원룸·다가구 비중이 높아, 전월세 계약이라면 압축봉이나 접착식 무타공 제품의 흔적 여부를 계약 전에 확인해 두는 것이 좋습니다." },
      { name: "영덕2동", slug: "yongin-giheung-yeongdeok-2-dong-curtain-blind", housingType: "apartment", localNote: "흥덕지구 신축 아파트가 중심이라 시스템 창호 세대가 많아 기성 사이즈 블라인드로도 시공이 가능한 경우가 많습니다." },
      { name: "구갈동", slug: "yongin-giheung-gugal-dong-curtain-blind", housingType: "apartment", localNote: "기흥역세권의 구축 아파트와 상권이 섞여 있어 상가주택은 창틀 소재가 다양해 시공 전 사진으로 먼저 확인받는 편이 안전합니다." },
      { name: "상갈동", slug: "yongin-giheung-sanggal-dong-curtain-blind", housingType: "apartment", localNote: "기흥역 인근 준신축 아파트가 많아 발코니 확장 여부에 따라 창 크기가 달라지므로 세대별 실측을 권장합니다." },
      { name: "보라동", slug: "yongin-giheung-bora-dong-curtain-blind", housingType: "lowrise", localNote: "신갈오거리 인근 저층 주거지가 많아 구축 주택은 창틀 마감이 균일하지 않을 수 있어 내측·외측 기준을 먼저 정하는 것이 중요합니다." },
      { name: "기흥동", slug: "yongin-giheung-giheung-dong-curtain-blind", housingType: "lowrise", localNote: "기흥구 행정 중심지로 아파트와 단독주택이 함께 있어 건물 형태에 따라 실측 방식과 소요 시간이 달라질 수 있습니다." },
      { name: "서농동", slug: "yongin-giheung-seonong-dong-curtain-blind", housingType: "lowrise", localNote: "저층 주거지와 소규모 공장이 인접한 지역이라 주택 창호가 표준화되지 않은 경우가 많아 방문 실측이 특히 유용합니다." },
      { name: "구성동", slug: "yongin-giheung-guseong-dong-curtain-blind", housingType: "apartment", localNote: "구성역세권 신축 대단지가 중심이라 시스템 창호 규격이 통일된 세대가 많아 견적 비교가 비교적 수월한 편입니다." },
      { name: "마북동", slug: "yongin-giheung-mabuk-dong-curtain-blind", housingType: "apartment", localNote: "흥덕지구와 가까운 신축 아파트가 많아 대형 거실창을 가진 세대가 흔해 전동 블라인드 배선 위치를 미리 확인하는 것이 좋습니다." },
      { name: "동백1동", slug: "yongin-giheung-dongbaek-1-dong-curtain-blind", housingType: "apartment", localNote: "동백지구 초기 입주 대단지가 많아 준신축 창호 규격에 맞는 제품군을 먼저 확인하면 비교 견적이 빨라집니다." },
      { name: "동백2동", slug: "yongin-giheung-dongbaek-2-dong-curtain-blind", housingType: "apartment", localNote: "동백지구 내 아파트 밀집구역으로 세대 수가 많아 같은 단지 내 시공 후기를 참고하기 좋은 지역입니다." },
      { name: "동백3동", slug: "yongin-giheung-dongbaek-3-dong-curtain-blind", housingType: "apartment", localNote: "동백호수공원과 가까운 비교적 최신축 단지가 많아 발코니 무타공 시공 사례가 다른 지역보다 자주 있는 편입니다." },
      { name: "상하동", slug: "yongin-giheung-sangha-dong-curtain-blind", housingType: "lowrise", localNote: "언남 생활권의 아파트와 빌라가 혼재해 있어 건물 유형별로 창틀 상태를 따로 확인하는 것이 안전합니다." },
      { name: "보정동", slug: "yongin-giheung-bojeong-dong-curtain-blind", housingType: "apartment", localNote: "보정역세권 카페거리 인근 아파트가 많아 상가와 가까운 저층 세대는 방음·차광 성능을 우선 고려하는 경우가 많습니다." },
    ],
  },
  {
    name: "처인구",
    slug: "yongin-cheoin-gu-curtain-blind",
    localNote: "처인구는 시청이 있는 중앙동 일대 구도심과 포곡·모현·이동·남사·양지 등 읍·면 단위 전원주택·단독주택 지역이 함께 있어, 창호가 표준화된 아파트보다 개별 실측이 특히 중요합니다.",
    sourceLabel: "용인시 처인구청 — 구청안내·일반현황",
    sourceUrl: "https://www.cheoingu.go.kr/home/townInfo.do?menu_no=963",
    dongs: [
      { name: "포곡읍", slug: "yongin-cheoin-pogok-eup-curtain-blind", housingType: "lowrise", localNote: "에버랜드 인근의 전원주택과 저층 주거지가 많아 표준 창호가 아닌 경우가 흔해 방문 실측을 권장합니다." },
      { name: "모현읍", slug: "yongin-cheoin-mohyeon-eup-curtain-blind", housingType: "lowrise", localNote: "농촌형 단독주택 비중이 높은 지역이라 창 크기와 형태가 집집마다 달라 기성품보다 맞춤 제작이 유리한 경우가 많습니다." },
      { name: "이동읍", slug: "yongin-cheoin-idong-eup-curtain-blind", housingType: "lowrise", localNote: "물류단지 인근으로 최근 아파트 신축이 진행 중이라 신축 세대는 시스템 창호, 기존 주택은 개별 실측이 필요한 경우로 나뉩니다." },
      { name: "남사읍", slug: "yongin-cheoin-namsa-eup-curtain-blind", housingType: "lowrise", localNote: "반도체 산업단지 배후 지역으로 준공업지역과 주거지가 섞여 있어 건물 유형에 따라 시공 조건을 따로 확인해야 합니다." },
      { name: "양지읍", slug: "yongin-cheoin-yangji-eup-curtain-blind", housingType: "lowrise", localNote: "저층 전원주택이 많은 지역이라 창호 규격이 다양해 기성 사이즈보다 맞춤 제작 비중이 높습니다." },
      { name: "백암면", slug: "yongin-cheoin-baegam-myeon-curtain-blind", housingType: "lowrise", localNote: "순수 농촌 지역으로 단독주택 위주라 창 크기가 표준화되어 있지 않아 방문 실측이 사실상 필수입니다." },
      { name: "원삼면", slug: "yongin-cheoin-wonsam-myeon-curtain-blind", housingType: "lowrise", localNote: "반도체 클러스터 개발이 진행 중인 지역으로 기존 농가주택과 신축 시설이 혼재해 있어 건물별 조건 차이가 큰 편입니다." },
      { name: "중앙동", slug: "yongin-cheoin-jungang-dong-curtain-blind", housingType: "lowrise", localNote: "용인시청이 있는 구도심으로 노후 저층 주택이 많아 창틀 마감과 벽 재질을 시공 전 사진으로 확인받는 편이 안전합니다." },
      { name: "역북동", slug: "yongin-cheoin-yeokbuk-dong-curtain-blind", housingType: "lowrise", localNote: "용인터미널 인근 상업지역과 주거지가 섞여 있어 상가주택은 방음·차광 목적의 시공 문의가 많은 편입니다." },
      { name: "삼가동", slug: "yongin-cheoin-samga-dong-curtain-blind", housingType: "apartment", localNote: "경전철 역세권으로 아파트 신축이 진행 중이라 신축 세대는 시스템 창호 규격을 먼저 확인하면 비교가 쉽습니다." },
      { name: "유림1동", slug: "yongin-cheoin-yurim-1-dong-curtain-blind", housingType: "lowrise", localNote: "처인구 남측 생활권의 저층 주거지가 많아 구축 주택은 창틀 소재가 균일하지 않을 수 있습니다." },
      { name: "유림2동", slug: "yongin-cheoin-yurim-2-dong-curtain-blind", housingType: "lowrise", localNote: "유림동 분동 지역으로 아파트와 산업단지가 함께 있어 세대 유형에 따라 실측 기준을 따로 잡는 것이 좋습니다." },
      { name: "동부동", slug: "yongin-cheoin-dongbu-dong-curtain-blind", housingType: "lowrise", localNote: "처인구 동측 외곽의 농가주택 밀집지역이라 창 크기가 표준화되어 있지 않아 맞춤 제작 견적을 권장합니다." },
    ],
  },
];

export const yonginDongCount = yonginDistricts.reduce((count, district) => count + district.dongs.length, 0);

if (yonginDistricts.length !== 3 || yonginDongCount !== 39) {
  throw new Error(`용인시 키워드 트리는 3개 구, 39개 행정동·읍·면이어야 합니다. 현재 ${yonginDistricts.length}개 구, ${yonginDongCount}개 지역입니다.`);
}

export const yonginRegionTree = {
  title: "용인시 3개 구·39개 행정동 커튼·블라인드 설치 정보",
  description: "구 또는 동 이름을 누르면 해당 지역의 커튼·블라인드 맞춤 설치 비용과 전월세 무타공 확인 사항을 바로 볼 수 있습니다.",
  districts: yonginDistricts.map((district) => ({
    name: district.name,
    href: `/articles/${district.slug}`,
    dongs: district.dongs.map((dong) => ({ name: dong.name, href: `/articles/${dong.slug}` })),
  })),
};
