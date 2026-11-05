"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MOTION_CHANGE_EVENT, prefersReducedMotion } from "../motion";

const motion = { enter: 650, fast: 220, distance: 24, easing: "cubic-bezier(.22, 1, .36, 1)" };

/** Native animations keep the server-rendered content visible before hydration. */
export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/fullyeditmode")) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const scope = document.getElementById("main-content");
    if (!scope) return;
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    const parallax = Array.from(scope.querySelectorAll<HTMLImageElement>(".archive-sticky > img, .about-image-break > img"));

    const enter = (element: Element, delay = 0) => {
      const animation = element.animate([
        { opacity: 0, transform: `translateY(${motion.distance}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: motion.enter, delay, easing: motion.easing, fill: "backwards" });
      animations.add(animation);
      void animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    };
    const updateParallax = () => {
      if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        parallax.forEach((image) => {
          const rect = image.parentElement!.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > innerHeight) return;
          const offset = Math.max(-24, Math.min(24, (innerHeight / 2 - rect.top - rect.height / 2) * .045));
          image.style.transform = `translateY(${offset}px) scale(1.08)`;
        });
      });
    };
    const setup = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      cancelAnimationFrame(frame);
      parallax.forEach((image) => { image.style.transform = ""; });
      if (prefersReducedMotion()) return;
      scope.querySelectorAll(".image-reveal-copy > *, .page-hero-content > *").forEach((element, index) => enter(element, index * 70));
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Array.from(entry.target.parentElement?.children ?? []).indexOf(entry.target);
          enter(entry.target, Math.min(index, 3) * 60);
          observer?.unobserve(entry.target);
        });
      }, { threshold: .12 });
      scope.querySelectorAll(".section-heading, .manifesto > div, .program-band, .faculty-row, .schedule-visual, .schedule-preview-copy, .program-detail-copy, .faculty-profile > div:last-child, .story-chapter, .step-card, .option-grid article, .event-card, .cta-glow, .forms-list article, .builder-block").forEach((element) => observer!.observe(element));
      updateParallax();
    };
    setup();
    reduced.addEventListener("change", setup);
    window.addEventListener(MOTION_CHANGE_EVENT, setup);
    window.addEventListener("scroll", updateParallax, { passive: true });
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      cancelAnimationFrame(frame);
      parallax.forEach((image) => { image.style.transform = ""; });
      reduced.removeEventListener("change", setup);
      window.removeEventListener(MOTION_CHANGE_EVENT, setup);
      window.removeEventListener("scroll", updateParallax);
    };
  }, [pathname]);
  return null;
}
