export type SuwonDong = {
  name: string;
  slug: string;
  localNote: string;
};

export type SuwonDistrict = {
  name: string;
  slug: string;
  localNote: string;
  dongs: SuwonDong[];
};

export const suwonDistricts: SuwonDistrict[] = [
  {
    name: "장안구",
    slug: "suwon-jangan-gu-moving-guide",
    localNote: "광교산 자락의 주택가부터 정자동 대단지까지 주거 형태가 다양해 경사, 골목 폭, 승강기 조건을 함께 확인해야 합니다.",
    dongs: [
      { name: "파장동", slug: "suwon-jangan-pajang-dong-moving", localNote: "북수원 생활권의 아파트와 저층 주택이 섞여 있어 차량 진입 위치와 사다리차 공간을 먼저 살펴보는 편이 좋습니다." },
      { name: "율천동", slug: "suwon-jangan-yulcheon-dong-moving", localNote: "성균관대역 주변의 아파트, 원룸, 다가구주택이 함께 있어 학기 이동기에는 소형 이사 일정이 몰릴 수 있습니다." },
      { name: "정자1동", slug: "suwon-jangan-jeongja-1-dong-moving", localNote: "대단지 아파트 비중이 높아 관리사무소의 승강기 예약과 보양 기준을 계약 전에 확인하는 것이 중요합니다." },
      { name: "정자2동", slug: "suwon-jangan-jeongja-2-dong-moving", localNote: "구축 아파트와 생활 상권이 가까워 이삿짐 차량 정차 위치와 출입 가능 시간을 미리 맞춰야 합니다." },
      { name: "정자3동", slug: "suwon-jangan-jeongja-3-dong-moving", localNote: "아파트 단지가 밀집한 생활권이므로 지하주차장 높이, 승강기 사용료, 동별 진입 동선을 함께 확인하세요." },
      { name: "영화동", slug: "suwon-jangan-yeonghwa-dong-moving", localNote: "수원화성 인근의 구도심 주택과 상가가 섞여 있어 좁은 도로와 장거리 운반 가능성을 사진으로 알려야 합니다." },
      { name: "송죽동", slug: "suwon-jangan-songjuk-dong-moving", localNote: "공동주택과 저층 주거지가 이어져 있어 건물 앞 정차 가능 여부와 계단 폭이 견적 정확도에 영향을 줍니다." },
      { name: "조원1동", slug: "suwon-jangan-jowon-1-dong-moving", localNote: "아파트와 다세대주택이 함께 있어 사다리차 사용 가능 지점과 골목 주차 상황을 각각 확인해야 합니다." },
      { name: "조원2동", slug: "suwon-jangan-jowon-2-dong-moving", localNote: "대단지 중심 생활권은 승강기 작업 시간이 겹치기 쉬우므로 관리사무소 예약을 가장 먼저 잡는 편이 안전합니다." },
      { name: "연무동", slug: "suwon-jangan-yeonmu-dong-moving", localNote: "경사지와 저층 주택이 있는 구간은 계단 작업과 차량 접근 거리에 따라 인원과 작업시간이 달라질 수 있습니다." },
    ],
  },
  {
    name: "권선구",
    slug: "suwon-gwonseon-gu-moving-guide",
    localNote: "호매실 신축 대단지부터 세류·평동의 구축 주택까지 범위가 넓어 이동거리와 건물 조건을 따로 계산해야 합니다.",
    dongs: [
      { name: "세류1동", slug: "suwon-gwonseon-seryu-1-dong-moving", localNote: "아파트와 저층 주택이 혼재해 차량이 현관 가까이 접근할 수 있는지와 계단 작업 여부를 함께 확인하세요." },
      { name: "세류2동", slug: "suwon-gwonseon-seryu-2-dong-moving", localNote: "구축 주택과 골목형 생활권에서는 주차 통제 가능 시간과 짐을 옮길 실제 거리가 추가비를 좌우할 수 있습니다." },
      { name: "세류3동", slug: "suwon-gwonseon-seryu-3-dong-moving", localNote: "다가구·빌라 이사는 계단 폭과 대형가전 회전 공간을 재고, 폐기할 가구를 견적 전에 구분하는 것이 좋습니다." },
      { name: "평동", slug: "suwon-gwonseon-pyeong-dong-moving", localNote: "고색·오목천 생활권의 아파트와 저층 주택은 출발지와 도착지 사이 이동시간, 차량 진입로를 함께 봐야 합니다." },
      { name: "서둔동", slug: "suwon-gwonseon-seodun-dong-moving", localNote: "서수원 생활권의 아파트와 주택이 섞여 있어 건물 전면 도로 폭과 장거리 운반 여부를 사진으로 남기세요." },
      { name: "구운동", slug: "suwon-gwonseon-guun-dong-moving", localNote: "구축 아파트와 빌라가 이어지는 구간은 승강기 크기와 사다리차 주차 공간을 각각 확인해야 합니다." },
      { name: "금곡동", slug: "suwon-gwonseon-geumgok-dong-moving", localNote: "호매실지구 대단지 입주 경험이 많은 지역이라 단지별 보양 규정과 지하주차장 높이 확인이 우선입니다." },
      { name: "호매실동", slug: "suwon-gwonseon-homaesil-dong-moving", localNote: "신축·준신축 아파트 비중이 높아 승강기 예약, 실외기실 구조, 대형가전 반입 치수를 미리 확인하세요." },
      { name: "권선1동", slug: "suwon-gwonseon-gwonseon-1-dong-moving", localNote: "아파트·오피스텔·상가가 가까이 있어 이사 차량 정차 시간과 상가 출입 동선이 겹치지 않게 조율해야 합니다." },
      { name: "권선2동", slug: "suwon-gwonseon-gwonseon-2-dong-moving", localNote: "대단지 아파트와 주거 상권이 밀집해 동별 출입구, 보양 범위와 승강기 작업시간을 정확히 적어야 합니다." },
      { name: "곡선동", slug: "suwon-gwonseon-gokseon-dong-moving", localNote: "곡반정 생활권의 아파트와 다가구주택은 골목 진입과 사다리차 가능 여부에 따라 작업 방식이 달라집니다." },
      { name: "입북동", slug: "suwon-gwonseon-ipbuk-dong-moving", localNote: "수원 서쪽의 아파트와 저층 주거지는 이동거리와 진입로 폭, 단지 차량 등록 절차를 함께 확인해야 합니다." },
    ],
  },
  {
    name: "팔달구",
    slug: "suwon-paldal-gu-moving-guide",
    localNote: "수원역·인계동의 고밀도 주거와 수원화성 주변 구도심이 공존해 주차, 골목, 계단 조건의 차이가 큽니다.",
    dongs: [
      { name: "행궁동", slug: "suwon-paldal-haenggung-dong-moving", localNote: "수원화성 안팎의 구도심과 좁은 골목이 많아 큰 차량 진입, 장거리 운반과 주차 허용 시간을 먼저 확인하세요." },
      { name: "매교동", slug: "suwon-paldal-maegyo-dong-moving", localNote: "신축 대단지와 기존 주택이 맞닿아 있어 새 아파트 보양 규정과 출발지 골목 조건을 따로 전달해야 합니다." },
      { name: "매산동", slug: "suwon-paldal-maesan-dong-moving", localNote: "수원역 주변 상업·주거 밀집 지역은 차량 정차가 어려울 수 있어 작업 시작 시간과 운반 거리를 미리 확인하세요." },
      { name: "고등동", slug: "suwon-paldal-godeung-dong-moving", localNote: "신축 아파트와 기존 생활권이 함께 있어 승강기 예약, 입주 보양과 가전 설치 시간을 나누어 잡는 것이 좋습니다." },
      { name: "화서1동", slug: "suwon-paldal-hwaseo-1-dong-moving", localNote: "구축 주택과 아파트가 섞인 지역이라 계단 폭, 골목 주차, 사다리차 설치 지점을 현장 사진으로 확인하세요." },
      { name: "화서2동", slug: "suwon-paldal-hwaseo-2-dong-moving", localNote: "화서역 생활권의 대단지 아파트는 관리사무소 예약과 차량 출입 등록이 이사 시간표의 기준이 됩니다." },
      { name: "지동", slug: "suwon-paldal-ji-dong-moving", localNote: "전통시장과 경사지 주택가가 가까워 시장 운영시간, 골목 폭과 계단 운반 거리를 함께 확인해야 합니다." },
      { name: "우만1동", slug: "suwon-paldal-uman-1-dong-moving", localNote: "아파트·빌라와 대학가 생활권이 섞여 있어 소형 이사 수요와 주차 혼잡 시간을 고려하는 편이 좋습니다." },
      { name: "우만2동", slug: "suwon-paldal-uman-2-dong-moving", localNote: "공동주택 비중이 높은 구간은 승강기 사용시간, 보양 비용과 지하주차장 차량 높이를 먼저 확인하세요." },
      { name: "인계동", slug: "suwon-paldal-ingye-dong-moving", localNote: "오피스텔·아파트·상가가 밀집해 관리실 예약, 화물차 정차 위치와 출퇴근 혼잡 시간을 함께 조율해야 합니다." },
    ],
  },
  {
    name: "영통구",
    slug: "suwon-yeongtong-gu-moving-guide",
    localNote: "광교·영통·망포의 고층 아파트와 매탄동 생활권이 이어져 단지별 승강기·보양·실외기실 기준을 확인해야 합니다.",
    dongs: [
      { name: "매탄1동", slug: "suwon-yeongtong-maetan-1-dong-moving", localNote: "아파트와 저층 주거지가 함께 있어 출발지·도착지의 승강기 여부와 차량 정차 거리를 따로 적으세요." },
      { name: "매탄2동", slug: "suwon-yeongtong-maetan-2-dong-moving", localNote: "구축 공동주택과 빌라 이사는 대형가전 반입 치수, 계단 회전 공간과 사다리차 위치가 중요합니다." },
      { name: "매탄3동", slug: "suwon-yeongtong-maetan-3-dong-moving", localNote: "아파트와 생활 상권이 밀집해 차량 출입시간, 승강기 예약과 폐기물 배출 일정을 함께 맞춰야 합니다." },
      { name: "매탄4동", slug: "suwon-yeongtong-maetan-4-dong-moving", localNote: "대단지와 학교 주변 주거지는 등하교 시간 혼잡을 피하고 관리사무소 작업 가능 시간을 확인하는 편이 좋습니다." },
      { name: "원천동", slug: "suwon-yeongtong-woncheon-dong-moving", localNote: "광교와 아주대 생활권을 잇는 아파트·원룸 지역이라 주거 형태별 차량과 작업 인원을 구분해 비교하세요." },
      { name: "광교1동", slug: "suwon-yeongtong-gwanggyo-1-dong-moving", localNote: "고층 신축 아파트가 많아 승강기 예약, 지하주차장 높이와 실외기실 작업 규정이 견적의 핵심입니다." },
      { name: "광교2동", slug: "suwon-yeongtong-gwanggyo-2-dong-moving", localNote: "대단지 아파트와 오피스텔은 동별 하역 위치와 보양 기준이 달라 관리사무소 확인 내용을 견적서에 반영해야 합니다." },
      { name: "영통1동", slug: "suwon-yeongtong-yeongtong-1-dong-moving", localNote: "계획형 아파트 단지와 상권이 이어져 승강기 사용시간과 화물차 진입 동선을 먼저 예약해야 합니다." },
      { name: "영통2동", slug: "suwon-yeongtong-yeongtong-2-dong-moving", localNote: "아파트 밀집 생활권은 같은 날 작업팀이 몰릴 수 있어 시작 시간, 보양과 사다리차 사용 여부를 문서로 남기세요." },
      { name: "영통3동", slug: "suwon-yeongtong-yeongtong-3-dong-moving", localNote: "공동주택과 원룸·오피스텔 조건이 달라 짐 양뿐 아니라 주차거리와 엘리베이터 크기를 비교해야 합니다." },
      { name: "망포1동", slug: "suwon-yeongtong-mangpo-1-dong-moving", localNote: "신축·준신축 아파트가 많은 지역은 입주 보양, 승강기 예약과 에어컨 실외기실 구조를 먼저 확인하세요." },
      { name: "망포2동", slug: "suwon-yeongtong-mangpo-2-dong-moving", localNote: "대단지 입주가 이어진 생활권은 단지 차량 등록과 하역 위치, 가전 설치 시간을 이사 일정과 분리해 잡는 것이 좋습니다." },
    ],
  },
];

export const suwonDongCount = suwonDistricts.reduce((count, district) => count + district.dongs.length, 0);

if (suwonDistricts.length !== 4 || suwonDongCount !== 44) {
  throw new Error(`수원시 키워드 트리는 4개 구, 44개 행정동이어야 합니다. 현재 ${suwonDistricts.length}개 구, ${suwonDongCount}개 동입니다.`);
}

export const suwonRegionTree = {
  title: "수원시 4개 구·44개 행정동 이사 정보",
  description: "구 또는 동 이름을 누르면 해당 지역의 포장이사 견적, 에어컨 이전 설치와 집수리·원상복구 정보를 바로 확인할 수 있습니다.",
  districts: suwonDistricts.map((district) => ({
    name: district.name,
    href: `/articles/${district.slug}`,
    dongs: district.dongs.map((dong) => ({ name: dong.name, href: `/articles/${dong.slug}` })),
  })),
};
