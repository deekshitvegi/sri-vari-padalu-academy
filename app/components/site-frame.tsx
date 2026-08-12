"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Camera, Menu, Phone, Play, X } from "lucide-react";
import type { AcademyDetails, NavigationItem, SiteContent } from "../data";

gsap.registerPlugin(ScrollTrigger);

function Brand({ header }: { header: SiteContent["header"] }) {
  return (
    <Link className="brand" href="/" aria-label="Sri Vari Padalu Academy home">
      <span className="brand-copy">
        <strong>{header.brandTitle}</strong>
        <small>{header.brandSubtitle}</small>
      </span>
    </Link>
  );
}

const clampByte = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

function capsuleLensMap(width: number, height: number, rimRatio = .18, magnify = .11) {
  const canvas = document.createElement("canvas");
  const w = Math.max(2, Math.round(width));
  const h = Math.max(2, Math.round(height));
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext("2d");
  if (!context) return "";
  const pixels = context.createImageData(w, h);
  const radius = h / 2;
  const rim = radius * rimRatio * 2;
  const inner = Math.max(1, radius - rim);

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const spineX = Math.max(radius, Math.min(w - radius, x));
      const dx = x - spineX;
      const dy = y - h / 2;
      const distance = Math.hypot(dx, dy);
      const offset = (y * w + x) * 4;
      let red = 128;
      let green = 128;

      if (distance > .001 && distance <= radius) {
        const nx = dx / distance;
        const ny = dy / distance;
        const gain = distance < inner
          ? -magnify * (distance / inner)
          : -magnify + (1 + magnify) * smoothstep((distance - inner) / Math.max(1, rim));
        red = 128 + nx * 127 * gain;
        green = 128 + ny * 127 * gain;
      }

      pixels.data[offset] = clampByte(red);
      pixels.data[offset + 1] = clampByte(green);
      pixels.data[offset + 2] = 0;
      pixels.data[offset + 3] = 255;
    }
  }
  context.putImageData(pixels, 0, 0);
  return canvas.toDataURL("image/png");
}

function roundedLensMap(width: number, height: number, radius: number, rimRatio = .32) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return "";
  const pixels = context.createImageData(width, height);
  const rim = radius * rimRatio;
  const inner = Math.max(1, radius - rim);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const nearestX = Math.max(radius, Math.min(width - radius, x));
      const nearestY = Math.max(radius, Math.min(height - radius, y));
      const dx = x - nearestX;
      const dy = y - nearestY;
      const distance = Math.hypot(dx, dy);
      const offset = (y * width + x) * 4;
      let red = 128;
      let green = 128;
      if (distance > .001 && distance <= radius) {
        const nx = dx / distance;
        const ny = dy / distance;
        const gain = distance < inner
          ? -.10 * (distance / inner)
          : -.10 + 1.10 * smoothstep((distance - inner) / Math.max(1, rim));
        red = 128 + nx * 127 * gain;
        green = 128 + ny * 127 * gain;
      }
      pixels.data[offset] = clampByte(red);
      pixels.data[offset + 1] = clampByte(green);
      pixels.data[offset + 2] = 0;
      pixels.data[offset + 3] = 255;
    }
  }
  context.putImageData(pixels, 0, 0);
  return canvas.toDataURL("image/png");
}

function LiquidGlassFilters() {
  const barMapRef = useRef<SVGFEImageElement>(null);
  const surfaceMapRef = useRef<SVGFEImageElement>(null);

  useEffect(() => {
    const supported = CSS.supports("backdrop-filter", "url(#liquid-support-test)");
    document.documentElement.dataset.liquidLens = supported ? "true" : "false";
    surfaceMapRef.current?.setAttribute("href", roundedLensMap(640, 360, 42, .46));

    const shell = document.querySelector<HTMLElement>(".header-shell");
    const updateBarLens = () => {
      if (!shell || !barMapRef.current) return;
      const rect = shell.getBoundingClientRect();
      const width = Math.max(2, Math.ceil(rect.width));
      const height = Math.max(2, Math.ceil(rect.height));
      barMapRef.current.setAttribute("width", String(width));
      barMapRef.current.setAttribute("height", String(height));
      barMapRef.current.setAttribute(
        "href",
        capsuleLensMap(width, height, .46, .10),
      );
    };

    updateBarLens();
    const observer = new ResizeObserver(updateBarLens);
    if (shell) observer.observe(shell);
    window.addEventListener("resize", updateBarLens);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateBarLens);
    };
  }, []);

  return (
    <svg className="liquid-filter-defs" aria-hidden="true">
      <defs>
        <filter id="liquid-bar-lens" x="-25%" y="-25%" width="150%" height="150%">
          <feFlood floodColor="rgb(128,128,0)" result="neutral" />
          <feImage ref={barMapRef} x="0" y="0" width="1200" height="72" preserveAspectRatio="none" result="image" />
          <feComposite in="image" in2="neutral" operator="over" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="28" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="liquid-surface-lens" x="-25%" y="-25%" width="150%" height="150%">
          <feFlood floodColor="rgb(128,128,0)" result="neutral" />
          <feImage ref={surfaceMapRef} x="0" y="0" width="640" height="360" preserveAspectRatio="none" result="image" />
          <feComposite in="image" in2="neutral" operator="over" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

function LiquidNavigation({ navigation }: { navigation: NavigationItem[] }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const moveIndicator = (target: HTMLElement | null, immediate = false) => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator || !target) return;
    const navRect = nav.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    indicator.style.setProperty("--indicator-x", `${targetRect.left - navRect.left}px`);
    indicator.style.setProperty("--indicator-width", `${targetRect.width}px`);
    indicator.dataset.ready = "true";
    indicator.dataset.immediate = immediate ? "true" : "false";
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLElement>('a[aria-current="page"]');
    const update = () => moveIndicator(active, true);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    window.addEventListener("resize", update);
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, [pathname]);

  const restoreActive = () => {
    const active = navRef.current?.querySelector<HTMLElement>('a[aria-current="page"]') ?? null;
    moveIndicator(active);
  };

  return (
    <nav className="liquid-nav" aria-label="Primary navigation" ref={navRef} onPointerLeave={restoreActive}>
      <span className="liquid-nav-indicator" ref={indicatorRef} aria-hidden="true" />
      {navigation.filter((item) => item.visible).map(({ id, label, href, external }) => (
        <Link
          key={id}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className={href === "/" ? pathname === "/" ? "is-active" : "" : pathname.startsWith(href) ? "is-active" : ""}
          aria-current={href === "/" ? pathname === "/" ? "page" : undefined : pathname.startsWith(href) ? "page" : undefined}
          onPointerEnter={(event) => moveIndicator(event.currentTarget)}
          onFocus={(event) => moveIndicator(event.currentTarget)}
          onBlur={restoreActive}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Header({ content }: { content: Pick<SiteContent, "header" | "navigation"> }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-shell liquid-glass">
        <Brand header={content.header} />
        <div className="desktop-only"><LiquidNavigation navigation={content.navigation} /></div>
        {content.header.showCta && <Link className={`header-join ${pathname.startsWith(content.header.ctaHref) ? "is-active" : ""}`} href={content.header.ctaHref}>
          {content.header.ctaLabel} <ArrowUpRight />
        </Link>}
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div id="mobile-navigation" className={`mobile-menu liquid-glass ${open ? "is-open" : ""}`}>
        <nav aria-label="Mobile navigation">
          {[...content.navigation.filter((item) => item.visible), ...(content.header.showCta && !content.navigation.some((item) => item.href === content.header.ctaHref) ? [{ id: "header-cta", label: content.header.ctaLabel, href: content.header.ctaHref, visible: true }] : [])].map(({ id, label, href, external }, index) => (
            <Link
              key={id}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className={href === "/" ? pathname === "/" ? "is-active" : "" : pathname.startsWith(href) ? "is-active" : ""}
              aria-current={href === "/" ? pathname === "/" ? "page" : undefined : pathname.startsWith(href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
              <ArrowUpRight />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer({ academy, header, footer, navigation }: { academy: AcademyDetails; header: SiteContent["header"]; footer: SiteContent["footer"]; navigation: NavigationItem[] }) {
  return (
    <footer className="site-footer">
      <div className="footer-hero">
        <p className="kicker">{footer.eyebrow}</p>
        <h2>{footer.title}</h2>
        <Link className="orb-link" href={footer.ctaHref}>{footer.ctaLabel} <ArrowUpRight /></Link>
      </div>
      <div className="footer-grid liquid-glass">
        <div>
          <Brand header={header} />
          <p>{academy.description}</p>
        </div>
        <div>
          <span className="footer-label">{footer.exploreLabel}</span>
          {navigation.filter((item) => item.visible && item.href !== "/").slice(0, 5).map((item) => <Link key={item.id} href={item.href}>{item.label}</Link>)}
        </div>
        <div>
          <span className="footer-label">{footer.visitLabel}</span>
          <p>{academy.address}</p>
          <a href={`tel:${academy.phoneHref}`}><Phone /> {academy.phone}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {footer.copyright}</span>
        <span>© {new Date().getFullYear()} Sri Vari Padalu Academy</span>
        <div>
          <a href={academy.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Camera /></a>
          <a href={academy.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><Play /></a>
        </div>
      </div>
    </footer>
  );
}

export function SiteFrame({ children, content }: { children: React.ReactNode; content: Pick<SiteContent, "academy" | "header" | "footer" | "navigation"> }) {
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);
  const adminRoute = pathname.startsWith("/admin") || pathname.startsWith("/fullyeditmode");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduced ? null : new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1,
      anchors: { offset: -110, duration: 1 },
    });
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const updateProgress = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty("--progress", `${distance > 0 ? window.scrollY / distance : 0}`);
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 34 }, {
          autoAlpha: 1, y: 0, duration: .8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
        gsap.fromTo(Array.from(el.children), { autoAlpha: 0, y: 26 }, {
          autoAlpha: 1, y: 0, duration: .72, stagger: .07, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.fromTo(el, { yPercent: -4 }, {
          yPercent: 5, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: .8 },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-scale-image]").forEach((el) => {
        gsap.fromTo(el, { scale: 1.1 }, {
          scale: 1, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: .8 },
        });
      });
    });

    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      lenis?.destroy();
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", updateProgress);
    };
  }, [pathname]);

  return (
    <>
      <LiquidGlassFilters />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {!adminRoute && <><div className="ambient-field" aria-hidden="true"><i /><i /><i /></div><div className="scroll-progress" ref={progressRef} /><Header content={content} /></>}
      <main id="main-content" tabIndex={-1} key={pathname}>{children}</main>
      {!adminRoute && <Footer academy={content.academy} header={content.header} footer={content.footer} navigation={content.navigation} />}
    </>
  );
}
