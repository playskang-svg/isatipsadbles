import Link from "next/link";
import { navItems, SITE_NAME } from "@/lib/site";

export function Footer() {
  const footerNavItems = navItems.flatMap((item) => [item, ...(item.children ?? [])]);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark">+</span>{SITE_NAME}</div>
          <p>이사 전 한 달부터 새집 정리가 끝날 때까지, 빠뜨리기 쉬운 일을 쉬운 순서로 안내합니다.</p>
        </div>
        <div>
          <strong>주제별 보기</strong>
          <div className="footer-links">{footerNavItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
        </div>
        <div>
          <strong>안내</strong>
          <div className="footer-links"><Link href="/about">사이트 소개</Link><Link href="/editorial-policy">편집 원칙</Link></div>
        </div>
        <div>
          <strong>함께 보면 좋은 정보</strong>
          <div className="footer-links"><a href="https://gajun.kr/">가전비교연구소 · 이사 가전 고르기</a><a href="https://suriwiki.com/">수리위키 · 집 수리·설치</a><a href="https://present.tipspedia.kr/">선물저널 · 집들이 선물</a><a href="https://tipspedia.kr/">팁스피디아 · 생활꿀팁</a></div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 {SITE_NAME}</span>
        <span>계약·보증금·행정 절차는 개인 상황에 따라 달라질 수 있으므로 공식 기관에서 다시 확인하세요.</span>
        <span className="footer-disclosure">이 사이트의 일부 링크(이사 견적 비교, 숨고, 쿠팡 파트너스 등)는 제휴 링크이며, 링크를 통해 이용하시면 사이트 운영자가 소정의 수수료를 받을 수 있습니다. 글의 내용과 추천 기준은 수수료와 무관하게 작성합니다.</span>
      </div>
    </footer>
  );
}
