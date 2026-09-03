export const SITE_NAME = "이사준비백서";
export const SITE_DESCRIPTION =
  "포장이사 견적부터 원룸이사, 입주청소, 에어컨·TV 이전설치, 전입신고와 지역별 이사까지 실제 준비에 필요한 정보를 정리합니다.";

export const SITE_KEYWORDS = [
  "이사", "이사 준비", "이사 체크리스트", "포장이사", "포장이사 비용", "포장이사 견적", "포장이사 업체",
  "이사업체", "이사업체 비교", "이사 견적 비교", "원룸이사", "용달이사", "반포장이사", "아파트 이사",
  "입주이사", "입주청소", "이사청소", "에어컨 이전설치", "에어컨 설치 비용", "벽걸이TV 이전설치",
  "무타공 TV 설치", "인터넷 이전설치", "이사 준비물", "이사박스", "폐가전 처리", "폐가구 처리",
  "전입신고", "주소 이전", "도시가스 이전", "이사 원상복구", "이사 하자보수", "지역별 이사 정보",
];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://isatips.adbles.com";

export const navItems = [
  { label: "이사 준비", href: "/category/planning" },
  {
    label: "견적·업체",
    href: "/category/quotes",
    children: [
      { label: "지역별 정보", href: "/category/regional" },
    ],
  },
  { label: "수리·설치", href: "/category/repair-install" },
  { label: "행정·공과금", href: "/category/admin" },
  { label: "청소·정리", href: "/category/home-care" },
];
