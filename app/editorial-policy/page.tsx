import type { Metadata } from "next";

export const metadata: Metadata = { title: "편집 원칙", description: "이사준비백서의 출처 확인, 업데이트, 광고 구분 원칙입니다.", alternates: { canonical: "/editorial-policy" }, openGraph: { type: "website", title: "편집 원칙", description: "이사준비백서의 출처 확인, 업데이트, 광고 구분 원칙입니다.", url: "/editorial-policy" } };

export default function EditorialPolicyPage() {
  return <><header className="listing-hero"><div className="narrow-container"><p className="eyebrow">EDITORIAL POLICY</p><h1>정확하고 쓸모 있는 글을<br/>만드는 기준</h1><p>마지막 업데이트: 2026년 9월 1일</p></div></header><section className="section"><div className="narrow-container prose-page"><h2>1. 공식 출처를 먼저 확인합니다</h2><p>전입신고, 공과금, 임대차와 보증금처럼 조건이 바뀔 수 있는 내용은 정부와 공공기관 자료를 우선 확인합니다. 독자가 최신 내용을 다시 확인할 수 있도록 원문 링크를 제공합니다.</p><h2>2. 업체 광고와 생활 정보를 구분합니다</h2><p>비용은 지역, 날짜, 짐과 건물 조건에 따라 달라집니다. 확인하지 않은 업체를 최고라고 평가하거나 근거 없는 최저가를 제시하지 않습니다.</p><h2>3. 날짜와 수정 이력을 관리합니다</h2><p>각 글에 업데이트 날짜를 표시합니다. 중요한 절차나 제도 변경을 확인하면 관련 글을 검토하고 낡은 설명을 고칩니다.</p><h2>4. 광고는 분명히 표시합니다</h2><p>쿠팡 파트너스 상품 링크와 이사·청소 상담 제휴 링크에는 광고 또는 수수료 관계를 표시합니다. 광고 여부가 편집 내용과 확인 기준을 바꾸지 않도록 합니다.</p><h2>5. 오류 제보를 환영합니다</h2><p>공식 자료와 다른 내용을 발견하면 해당 글의 제목과 근거를 함께 알려주세요. 확인 후 필요한 수정과 날짜 업데이트를 진행합니다.</p></div></section></>;
}
