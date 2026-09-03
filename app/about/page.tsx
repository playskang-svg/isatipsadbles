import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "사이트 소개", description: "이사준비백서가 어떤 기준으로 이사 정보를 만들고 전달하는지 소개합니다.", alternates: { canonical: "/about" }, openGraph: { type: "website", title: "사이트 소개", description: "이사준비백서가 어떤 기준으로 이사 정보를 만들고 전달하는지 소개합니다.", url: "/about" } };

export default function AboutPage() {
  return <><header className="listing-hero"><div className="narrow-container"><p className="eyebrow">ABOUT US</p><h1>이사 전 한 달부터<br/>새집 정리까지 함께합니다.</h1><p>광고성 최저가보다 실제로 확인할 조건, 남겨야 할 기록과 공식 기관에서 다시 확인할 정보를 정리합니다.</p></div></header><section className="section"><div className="narrow-container prose-page"><h2>왜 이 사이트를 만들었나요?</h2><p>이사는 견적, 계약, 포장, 청소, 행정업무와 보증금이 한꺼번에 움직이는 큰일입니다. 정보는 많지만 언제 무엇을 해야 하는지 찾기 어렵습니다. 이곳에서는 날짜와 상황에 맞춰 한 번에 하나씩 실행할 수 있도록 내용을 나눕니다.</p><h2>어떤 글을 쓰나요?</h2><p>이사 준비 체크리스트, 포장이사 비용, 업체 비교, 전입신고, 공과금, 보증금, 청소와 반려동물 적응을 다룹니다. 제도 정보는 공식 출처로 연결하고 개인마다 다른 부분은 조건을 분명히 설명합니다.</p><h2>우리의 약속</h2><ul><li>근거 없는 최저가와 업체 순위를 만들지 않습니다.</li><li>변동 가능한 절차는 확인 날짜와 공식 출처를 살핍니다.</li><li>광고와 편집 내용을 구분합니다.</li><li>잘못된 내용은 확인 후 바로 고칩니다.</li></ul><Link href="/editorial-policy" className="primary-button dark-button">편집 원칙 자세히 보기</Link></div></section></>;
}
