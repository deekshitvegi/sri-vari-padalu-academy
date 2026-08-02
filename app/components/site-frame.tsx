"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUp,
  Camera,
  Menu,
  Phone,
  X,
  Play,
} from "lucide-react";
import { academy, navItems } from "../data";

gsap.registerPlugin(ScrollTrigger);

function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Sri Vari Padalu Academy home">
      <span className="brand-mark" aria-hidden="true">SVP</span>
      <span className="brand-copy">
        <strong>Sri Vari Padalu</strong>
        <small>Academy of classical arts</small>
      </span>
    </Link>
  );
}

function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="nav-shell glass">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link className="nav-cta magnetic" data-magnetic href="/admissions">
          Join the academy
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div className={`mobile-panel glass ${open ? "open" : ""}`}>
        <nav aria-label="Mobile navigation">
          {[...navItems, ["Admissions", "/admissions"] as const].map(
            ([label, href], index) => (
              <Link key={href} href={href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="footer-grid">
        <div>
          <Brand />
          <p className="footer-intro">
            Preserving the rich heritage of Bharatanatyam, Kuchipudi, and
            Carnatic music through dedicated teaching and performance.
          </p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <div className="footer-links">
            <Link href="/programs">Programs</Link>
            <Link href="/faculty">Our gurus</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/admissions">Admissions</Link>
          </div>
        </div>
        <div>
          <p className="footer-label">Visit</p>
          <p className="footer-address">{academy.address}</p>
          <a href={`tel:${academy.phoneHref}`} className="footer-phone">
            <Phone size={17} /> {academy.phone}
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Sri Vari Padalu Academy</p>
        <div className="socials">
          <a href={academy.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <Camera />
          </a>
          <a href={academy.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
            <Play />
          </a>
        </div>
      </div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const main = document.getElementById("main-content");
    if (main) main.focus({ preventScroll: true });
  }, [pathname]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduceMotion ? null : new Lenis({ duration: 1.15, smoothWheel: true });
    const updateLenis = (time: number) => lenis?.raf(time * 1000);

    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    }

    const onScroll = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? window.scrollY / distance : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 88%" },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((element) => {
          gsap.fromTo(
            Array.from(element.children),
            { opacity: 0, y: 22, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.04,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 85%" },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
          gsap.to(element, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: element.parentElement, scrub: 0.7 },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((element) => {
          gsap.fromTo(
            element,
            { clipPath: "inset(0 100% 0 0)", scale: 1.04 },
            {
              clipPath: "inset(0 0% 0 0)",
              scale: 1,
              duration: 1.15,
              ease: "expo.out",
              scrollTrigger: { trigger: element, start: "top 82%" },
            },
          );
        });

        document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((element) => {
          const move = (event: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            gsap.to(element, {
              x: (event.clientX - rect.left - rect.width / 2) * 0.16,
              y: (event.clientY - rect.top - rect.height / 2) * 0.16,
              duration: 0.3,
            });
          };
          const leave = () => gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, .35)" });
          element.addEventListener("mousemove", move);
          element.addEventListener("mouseleave", leave);
        });
      }
    });

    return () => {
      ctx.revert();
      lenis?.destroy();
      gsap.ticker.remove(updateLenis);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (event: PointerEvent) => {
      cursor.animate(
        { transform: `translate3d(${event.clientX - 10}px, ${event.clientY - 10}px, 0)` },
        { duration: 280, fill: "forwards" },
      );
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className={`loader ${loading ? "visible" : ""}`} aria-hidden={!loading}>
        <div className="loader-mark">SVP</div>
        <p>Rhythm begins in stillness</p>
        <span />
      </div>
      <div className="scroll-progress" ref={progressRef} />
      <div className="cursor-orb" ref={cursorRef} aria-hidden="true" />
      <Header />
      <main id="main-content" tabIndex={-1} key={pathname} className="page-enter">{children}</main>
      <Footer />
      <button
        className="back-to-top glass"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp />
      </button>
    </>
  );
}
