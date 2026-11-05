"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Camera, Menu, Phone, Play, X } from "lucide-react";
import type { NavigationItem, SiteContent } from "../data";
import { SiteMotion } from "./site-motion";
import { MotionToggle } from "./motion-toggle";
import { MorphingNavigation } from "./morphing-navigation";

function Brand({ header }: { header: SiteContent["header"] }) {
  return <Link className="brand" href="/" aria-label="Sri Vari Padalu Academy home">
    <span className="brand-mark" aria-hidden="true">svp</span>
    <span className="brand-copy"><strong>{header.brandTitle}</strong><small>{header.brandSubtitle}</small></span>
  </Link>;
}

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function Navigation({ items, onNavigate, mobile = false }: { items: NavigationItem[]; onNavigate?: () => void; mobile?: boolean }) {
  const pathname = usePathname();
  return <nav aria-label={mobile ? "Mobile navigation" : "Primary navigation"}>
    {items.filter((item) => item.visible).map(({ id, label, href, external }) => <Link
      key={id} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}
      aria-current={!external && isCurrent(pathname, href) ? "page" : undefined} onClick={onNavigate}
    >{label}{external && <ArrowUpRight aria-hidden="true" size={16} />}</Link>)}
  </nav>;
}

function Header({ content }: { content: Pick<SiteContent, "header" | "navigation" | "programs"> }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) { if (dialog.open) dialog.close(); return; }
    const toggle = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1100px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
      if (dialog.open) dialog.close();
      toggle?.focus();
    };
  }, [open]);

  const mobileItems = [...content.navigation];
  if (content.header.showCta && !mobileItems.some((item) => item.visible && item.href === content.header.ctaHref)) {
    mobileItems.push({ id: "header-cta", label: content.header.ctaLabel, href: content.header.ctaHref, visible: true });
  }

  return <header className="site-header">
    <div className="header-shell">
      <Brand header={content.header} />
      <div className="desktop-only"><MorphingNavigation content={content} /></div>
      {content.header.showCta && <Link className="header-join" href={content.header.ctaHref}>{content.header.ctaLabel}<ArrowUpRight size={16} aria-hidden="true" /></Link>}
      <button ref={toggleRef} className="menu-toggle" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><Menu aria-hidden="true" /></button>
    </div>
    <dialog id="mobile-navigation" className="mobile-menu" ref={dialogRef} aria-label="Website menu" onClose={() => setOpen(false)}>
      <div className="mobile-menu-heading"><span>Explore the academy</span><button onClick={() => setOpen(false)} aria-label="Close menu"><X aria-hidden="true" /></button></div>
      <Navigation items={mobileItems} mobile onNavigate={() => setOpen(false)} />
      <p>Bharatanatyam · Kuchipudi · Sangeetham</p>
    </dialog>
  </header>;
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
