"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Camera, Phone, Play } from "lucide-react";
import type { SiteContent } from "../data";
import { SiteMotion } from "./site-motion";
import { MotionToggle } from "./motion-toggle";
import { MorphingNavigation } from "./morphing-navigation";

function Brand({ header }: { header: SiteContent["header"] }) {
  return <Link className="brand" href="/" aria-label="Sri Vari Padalu Academy home">
    <span className="brand-copy"><strong>{header.brandTitle}</strong><small>{header.brandSubtitle}</small></span>
  </Link>;
}

function Header({ content }: { content: Pick<SiteContent, "header" | "navigation" | "programs"> }) {
  return <header className="site-header"><div className="header-shell"><MorphingNavigation content={content} /></div></header>;
}
function Footer({ content }: { content: Pick<SiteContent, "academy" | "header" | "footer" | "navigation"> }) {
  const { academy, header, footer, navigation } = content;
  return <footer className="site-footer">
    <div className="footer-hero"><div><p className="kicker">{footer.eyebrow}</p><h2>{footer.title}</h2></div><Link className="footer-action" href={footer.ctaHref}>{footer.ctaLabel}<ArrowUpRight aria-hidden="true" /></Link></div>
    <div className="footer-grid">
      <div><Brand header={header} /><p>{academy.description}</p><div className="footer-socials"><a href={academy.instagram} target="_blank" rel="noreferrer" aria-label="Academy on Instagram"><Camera aria-hidden="true" /></a><a href={academy.youtube} target="_blank" rel="noreferrer" aria-label="Academy on YouTube"><Play aria-hidden="true" /></a></div></div>
      <div><span className="footer-label">{footer.exploreLabel}</span>{navigation.filter((item) => item.visible && item.href !== "/").map((item) => <Link key={item.id} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>{item.label}</Link>)}</div>
      <div><span className="footer-label">{footer.visitLabel}</span><p>{academy.address}</p><a href={`tel:${academy.phoneHref}`}><Phone size={16} aria-hidden="true" />{academy.phone}</a><a className="footer-email" href={`mailto:${academy.email}`}>{academy.email}</a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {footer.copyright}</span><MotionToggle /><span>Classical arts · Secunderabad</span></div>
  </footer>;
}

export function SiteFrame({ children, content }: { children: React.ReactNode; content: Pick<SiteContent, "academy" | "header" | "footer" | "navigation" | "programs"> }) {
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);
  const adminRoute = pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/fullyeditmode";

  useEffect(() => {
    if (adminRoute || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current?.style.setProperty("--progress", `${distance > 0 ? window.scrollY / distance : 0}`);
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); };
  }, [pathname, adminRoute]);

  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    {!adminRoute && <><div className="scroll-progress" ref={progressRef} aria-hidden="true" /><Header content={content} /></>}
    <main id="main-content" tabIndex={-1} key={pathname}>{children}</main>
    <SiteMotion />
    {!adminRoute && <Footer content={content} />}
  </>;
}
