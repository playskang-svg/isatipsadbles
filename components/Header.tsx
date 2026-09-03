"use client";

import Link from "next/link";
import { useRef } from "react";
import { navItems, SITE_NAME } from "@/lib/site";
import { consultationUrl } from "@/lib/services";

export function Header() {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const closeMobileMenu = () => mobileMenuRef.current?.removeAttribute("open");

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} 홈`}>
          <span className="brand-mark" aria-hidden="true">+</span>
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="main-nav" aria-label="주요 메뉴">
          {navItems.map((item) => item.children ? (
            <div className="nav-group" key={item.href}>
              <Link className="nav-parent" href={item.href}>
                {item.label}<span className="nav-chevron" aria-hidden="true">⌄</span>
              </Link>
              <div className="nav-submenu" aria-label={`${item.label} 하위 메뉴`}>
                {item.children.map((child) => (
                  <Link key={child.href} href={child.href}>{child.label}</Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <details className="mobile-menu" ref={mobileMenuRef}>
          <summary aria-label="메뉴 열기">
            <span className="hamburger-lines" aria-hidden="true"><i /><i /><i /></span>
          </summary>
          <nav className="mobile-menu-panel" aria-label="모바일 주요 메뉴">
            {navItems.map((item) => (
              <div className="mobile-nav-group" key={item.href}>
                <Link href={item.href} onClick={closeMobileMenu}>{item.label}<span aria-hidden="true">→</span></Link>
                {item.children?.map((child) => (
                  <Link className="mobile-submenu-link" key={child.href} href={child.href} onClick={closeMobileMenu}>
                    <span>{child.label}</span><span aria-hidden="true">↳</span>
                  </Link>
                ))}
              </div>
            ))}
            <Link href="/about" onClick={closeMobileMenu}>사이트 소개<span aria-hidden="true">→</span></Link>
          </nav>
        </details>
        <a href={consultationUrl} className="header-cta" target="_blank" rel="sponsored noopener noreferrer">빠른견적 <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}
