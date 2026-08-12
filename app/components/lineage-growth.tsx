"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function LineageGrowth({
  eyebrow,
  title,
  accent,
  copy,
  realImage,
  sculptureImage,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  copy: string;
  realImage: string;
  sculptureImage: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let frame = 0;
    let targetX = finePointer ? .38 : .5;
    let targetY = finePointer ? .43 : .42;
    let currentX = targetX;
    let currentY = targetY;
    let targetSize = finePointer ? 0 : clamp(window.innerWidth * .46, 190, 310);
    let currentSize = targetSize;
    let targetGazeX = 0;
    let targetGazeY = 0;
    let currentGazeX = 0;
    let currentGazeY = 0;

    const render = () => {
      currentX += (targetX - currentX) * .14;
      currentY += (targetY - currentY) * .14;
      currentSize += (targetSize - currentSize) * .14;
      currentGazeX += (targetGazeX - currentGazeX) * .18;
      currentGazeY += (targetGazeY - currentGazeY) * .18;
      section.style.setProperty("--reveal-x", `${(currentX * 100).toFixed(2)}%`);
      section.style.setProperty("--reveal-y", `${(currentY * 100).toFixed(2)}%`);
      section.style.setProperty("--reveal-size", `${currentSize.toFixed(1)}px`);
      section.style.setProperty("--gaze-x", currentGazeX.toFixed(3));
      section.style.setProperty("--gaze-y", currentGazeY.toFixed(3));
      frame = requestAnimationFrame(render);
    };

    const pointer = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      targetX = clamp((event.clientX - rect.left) / rect.width);
      targetY = clamp((event.clientY - rect.top) / rect.height);
      targetSize = clamp(rect.width * .22, 220, 390);
      const figure = stage.querySelector<HTMLElement>(".dancer-tableau-stone .trio-figure-1");
      const figureRect = figure?.getBoundingClientRect();
      const eyeCenterX = figureRect ? figureRect.left + figureRect.width * .537 : rect.left + rect.width * .5;
      const eyeCenterY = figureRect ? figureRect.top + figureRect.height * .145 : rect.top + rect.height * .24;
      const gazeRangeX = Math.max((figureRect?.width ?? rect.width) * .22, 1);
      const gazeRangeY = Math.max((figureRect?.height ?? rect.height) * .18, 1);
      targetGazeX = clamp((event.clientX - eyeCenterX) / gazeRangeX, -1, 1);
      targetGazeY = clamp((event.clientY - eyeCenterY) / gazeRangeY, -1, 1);
      section.dataset.pointerActive = "true";
    };
    const calibrate = () => {
      const layers = stage.querySelectorAll<HTMLElement>(".dancer-gaze-layer");
      layers.forEach((layer) => {
        const figure = layer.querySelector<HTMLElement>(".trio-figure-1");
        const image = layer.classList.contains("dancer-gaze-live")
          ? stage.querySelector<HTMLImageElement>(".dancer-tableau-live .trio-figure-1 img")
          : stage.querySelector<HTMLImageElement>(".dancer-tableau-stone .trio-figure-1 img");
        if (!figure || !image || !image.naturalWidth || !image.naturalHeight) return;
        const figureRect = figure.getBoundingClientRect();
        const scale = Math.min(figureRect.width / image.naturalWidth, figureRect.height / image.naturalHeight);
        const renderedWidth = image.naturalWidth * scale;
        const renderedHeight = image.naturalHeight * scale;
        const offsetX = (figureRect.width - renderedWidth) / 2;
        const offsetY = figureRect.height - renderedHeight;
        const rig = layer.querySelector<HTMLElement>(".dancer-eye-rig");
        if (!rig) return;
        rig.style.width = `${renderedWidth}px`;
        rig.style.height = `${renderedHeight}px`;
        rig.style.left = `${offsetX + renderedWidth / 2}px`;
        rig.style.bottom = `${figureRect.height - offsetY - renderedHeight}px`;
      });
    };
    const leave = () => { if (finePointer) { targetSize = 0; targetGazeX = 0; targetGazeY = 0; section.dataset.pointerActive = "false"; } };
    const scroll = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight - innerHeight, 1);
      const progress = clamp(-rect.top / distance);
      section.style.setProperty("--hero-progress", progress.toFixed(3));
      if (!finePointer) {
        targetX = .28 + progress * .42;
        targetY = .34 + progress * .18;
        targetSize = clamp(stage.clientWidth * .5, 190, 330);
      }
    };
    const resize = () => { if (!finePointer) targetSize = clamp(stage.clientWidth * .5, 190, 330); calibrate(); scroll(); };

    window.addEventListener("pointermove", pointer, { passive: true });
    stage.addEventListener("pointerdown", pointer);
    stage.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);
    stage.querySelectorAll<HTMLImageElement>(".trio-figure-1 img").forEach((image) => image.addEventListener("load", calibrate));
    calibrate(); scroll(); frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", pointer);
      stage.removeEventListener("pointerdown", pointer);
      stage.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
      stage.querySelectorAll<HTMLImageElement>(".trio-figure-1 img").forEach((image) => image.removeEventListener("load", calibrate));
    };
  }, []);

  return (
    <section className="image-reveal-hero" ref={sectionRef}>
      <div className="image-reveal-stage" ref={stageRef}>
        <div className="image-reveal-aurora" aria-hidden="true" />
        <div className="dancer-tableau dancer-tableau-stone" aria-hidden="true"><div className="trio-figure trio-figure-1"><Image src={sculptureImage} alt="" fill priority unoptimized sizes="(max-width: 620px) 116vw, (max-width: 900px) 78vw, 64vw" /></div></div>
        <div className="dancer-tableau dancer-tableau-live" aria-hidden="true"><div className="trio-figure trio-figure-1"><Image src={realImage} alt="" fill priority unoptimized sizes="(max-width: 620px) 116vw, (max-width: 900px) 78vw, 64vw" /></div></div>
        <div className="dancer-gaze-layer dancer-gaze-stone" aria-hidden="true">
          <div className="trio-figure trio-figure-1">
            <div className="dancer-eye-rig"><span className="living-eye living-eye-left"><i /></span><span className="living-eye living-eye-right"><i /></span></div>
          </div>
        </div>
        <div className="dancer-gaze-layer dancer-gaze-live" aria-hidden="true">
          <div className="trio-figure trio-figure-1">
            <div className="dancer-eye-rig"><span className="living-eye living-eye-left"><i /></span><span className="living-eye living-eye-right"><i /></span></div>
          </div>
        </div>
        <div className="image-reveal-lens" aria-hidden="true" />
        <div className="image-reveal-shade" aria-hidden="true" />
        <div className="image-reveal-grain" aria-hidden="true" />
        <div className="image-reveal-copy liquid-glass">
          <p className="kicker">{eyebrow}</p><h1>{title}<span>{accent}</span></h1><p>{copy}</p>
          <div className="image-reveal-actions"><Link className="button-link image-reveal-primary" href="/admissions">Begin your journey <ArrowRight size={17} /></Link><Link className="image-reveal-secondary" href="/programs">Explore programs <ArrowRight size={16} /></Link></div>
        </div>
        <a className="image-reveal-scroll" href="#introduction" aria-label="Scroll to discover the academy"><ArrowDown /><span>Scroll to discover</span></a>
      </div>
    </section>
  );
}
