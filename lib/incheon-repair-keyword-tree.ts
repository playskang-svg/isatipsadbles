export type IncheonRepairDistrict = {
  name: string;
  slug: string;
  localNote: string;
  housingType: "apartment" | "mixed";
};

export const INCHEON_REPAIR_CITY_SLUG = "incheon-repair-install-cost-guide";
export const INCHEON_REPAIR_CITY_SOURCE = {
  label: "인천광역시 행정구역 현황(2026년 7월 1일 기준)",
  url: "https://www.incheon.go.kr/IC040102",
};

export const incheonRepairDistricts: IncheonRepairDistrict[] = [
  {
    name: "강화군",
    slug: "incheon-ganghwa-repair-install",
    localNote:
      "강화읍의 공동주택·상가주택과 면 지역의 단독·농가주택이 함께 있어, 읍내는 표준 규격 시공이 많지만 면 지역은 배관·전기 배선이 오래돼 방문 확인 없이는 자재와 공정을 정하기 어렵습니다.",
    housingType: "mixed",
  },
  {
    name: "옹진군",
    slug: "incheon-ongjin-repair-install",
    localNote:
      "여러 섬으로 나뉜 지역이라 자재 반입이 여객선 운항 일정에 좌우되고, 해풍·습기로 창호·금속 부속의 부식 속도가 빨라 육지보다 점검·교체 주기를 짧게 잡는 편이 안전합니다.",
    housingType: "mixed",
  },
  {
    name: "제물포구",
    slug: "incheon-jemulpo-repair-install",
    localNote:
      "노후 단독·다세대와 상가주택이 밀집한 원도심이라 배관·전기 노후 정도가 세대마다 다르고, 좁은 골목은 자재 운반 방식과 작업 차량 정차 위치를 먼저 확인해야 추가금을 줄일 수 있습니다.",
    housingType: "mixed",
  },
  {
    name: "영종구",
    slug: "incheon-yeongjong-repair-install",
    localNote:
      "하늘도시 대단지 아파트가 많아 시스템 창호·표준 규격 시공이 흔하지만, 육지에서 자재를 들여오는 이동 시간과 관리사무소의 작업 가능 시간을 함께 예약해야 일정이 밀리지 않습니다.",
    housingType: "apartment",
  },
  {
    name: "미추홀구",
    slug: "incheon-michuhol-repair-install",
    localNote:
      "구축 아파트·다세대와 재개발 구역, 신축 대단지가 촘촘히 섞여 있어 건물 연식에 따라 배관·전기 상태 차이가 크고, 공사장 주변은 자재 반입 동선을 미리 확인하는 편이 좋습니다.",
    housingType: "mixed",
  },
  {
    name: "연수구",
    slug: "incheon-yeonsu-repair-install",
    localNote:
      "구축 중층 아파트부터 송도의 초고층 주상복합까지 관리 규정이 다양해, 승강기 예약과 실외기실·발코니 구조를 단지별로 따로 확인해야 견적 조건을 정확히 비교할 수 있습니다.",
    housingType: "apartment",
  },
  {
    name: "남동구",
    slug: "incheon-namdong-repair-install",
    localNote:
      "구월·만수의 구축 주거지와 논현·서창의 계획형 공동주택이 함께 있어, 같은 구 안에서도 건물 연식과 단지 규정 차이가 커 지역명만으로 시공 조건을 단정하기 어렵습니다.",
    housingType: "mixed",
  },
  {
    name: "부평구",
    slug: "incheon-bupyeong-repair-install",
    localNote:
      "역세권 오피스텔·다세대 비중이 높아 전월세 계약이 많고, 원상복구 조건을 임대인과 미리 확인해야 무타공·부분 시공 범위를 두고 다툴 일이 줄어듭니다.",
    housingType: "mixed",
  },
  {
    name: "계양구",
    slug: "incheon-gyeyang-repair-install",
    localNote:
      "구축 아파트·빌라와 정비사업 신축 단지가 함께 늘어서 있어, 신축은 하자보수 기간 내 접수 절차를, 구축은 배관·창호 노후 상태를 먼저 확인하는 쪽으로 점검 항목이 갈립니다.",
    housingType: "mixed",
  },
  {
    name: "서해구",
    slug: "incheon-seohae-repair-install",
    localNote:
      "청라·루원의 고층 신축 단지와 가좌·석남의 구축 주거지가 대조적이라, 같은 구 안이라도 표준 시스템 창호 시공과 개별 실측 시공을 나눠 견적을 받는 편이 비교하기 쉽습니다.",
    housingType: "mixed",
  },
  {
    name: "검단구",
    slug: "incheon-geomdan-repair-install",
    localNote:
      "신축 대단지 비중이 큰 아라동과 기존 단독·빌라 생활권이 나뉘어 있어, 입주 지정일이 몰리는 시기에는 설치 예약이 밀릴 수 있으니 일정 여유를 두고 문의하는 편이 좋습니다.",
    housingType: "apartment",
  },
];

export const incheonRepairDistrictCount = incheonRepairDistricts.length;

if (incheonRepairDistrictCount !== 11) {
  throw new Error(`인천시 설치·수리 키워드 트리는 11개 군·구여야 합니다. 현재 ${incheonRepairDistrictCount}개입니다.`);
}

export const incheonRepairRegionTree = {
  title: "인천시 11개 군·구 설치·수리 정보",
  description: "군 또는 구 이름을 누르면 해당 지역의 문·중문·씽크대·욕실·샷시·에어컨 설치와 수리 확인 사항을 바로 볼 수 있습니다.",
  districts: incheonRepairDistricts.map((district) => ({
    name: district.name,
    href: `/articles/${district.slug}`,
    dongs: [] as { name: string; href?: string }[],
  })),
};
