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
      </div>
      <div className="container footer-bottom">
        <span>© 2026 {SITE_NAME}</span>
        <span>계약·보증금·행정 절차는 개인 상황에 따라 달라질 수 있으므로 공식 기관에서 다시 확인하세요.</span>
      </div>
    </footer>
  );
}
