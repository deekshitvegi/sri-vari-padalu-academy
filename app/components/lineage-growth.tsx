"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  MousePointer2,
  Orbit,
} from "lucide-react";
import { useEffect, useRef } from "react";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

type CanvasSet = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

function createCanvas(): CanvasSet | null {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  return context ? { canvas, context } : null;
}

export function LineageGrowth() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const context = canvas.getContext("2d");
    const maskSet = createCanvas();
    const revealSet = createCanvas();
    if (!context || !maskSet || !revealSet) return;

    const { canvas: mask, context: maskContext } = maskSet;
    const { canvas: reveal, context: revealContext } = revealSet;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let lastScrollStamp = -1;

    const configureContext = (target: CanvasRenderingContext2D) => {
      target.setTransform(dpr, 0, 0, dpr, 0, 0);
      target.lineCap = "round";
      target.lineJoin = "round";
    };

    const stamp = (
      x: number,
      y: number,
      radius: number,
      opacity = 0.5,
    ) => {
      const gradient = maskContext.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255,255,255,${opacity})`);
      gradient.addColorStop(0.38, `rgba(255,255,255,${opacity * 0.96})`);
      gradient.addColorStop(0.74, `rgba(255,255,255,${opacity * 0.32})`);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      maskContext.globalCompositeOperation = "source-over";
      maskContext.fillStyle = gradient;
      maskContext.beginPath();
      maskContext.arc(x, y, radius, 0, Math.PI * 2);
      maskContext.fill();
    };

    const resize = () => {
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = Math.min(window.innerHeight, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      [canvas, mask, reveal].forEach((target) => {
        target.width = Math.round(width * dpr);
        target.height = Math.round(height * dpr);
      });
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      configureContext(context);
      configureContext(maskContext);
      configureContext(revealContext);

      if (reducedMotion) {
        stamp(width * 0.64, height * 0.59, Math.min(width, height) * 0.36, 0.55);
      }
    };

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      progressRef.current = clamp(-rect.top / distance);
      section.style.setProperty(
        "--lineage-progress",
        progressRef.current.toFixed(3),
      );
    };

    const pointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const stageTop = Math.max(rect.top, 0);
      if (
        event.clientY < stageTop ||
        event.clientY > stageTop + height ||
        event.clientX < rect.left ||
        event.clientX > rect.right
      ) {
        pointer.active = false;
        return;
      }
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - stageTop;
      pointer.active = true;
    };

    const pointerLeave = () => {
      pointer.active = false;
    };

    const fieldCenter = () => ({
      x: width < 720 ? width * 0.55 : width * 0.67,
      y: width < 720 ? height * 0.64 : height * 0.56,
    });

    const drawRhythmRings = (
      target: CanvasRenderingContext2D,
      alpha: number,
      strong = false,
    ) => {
      const center = fieldCenter();
      const progress = progressRef.current;
      const baseRadius = Math.min(width, height) * 0.13;
      const ringCount = width < 720 ? 5 : 7;

      target.save();
      target.translate(center.x, center.y);
      target.rotate(progress * 0.16);
      for (let ring = 0; ring < ringCount; ring += 1) {
        const radius =
          baseRadius +
          ring * Math.min(width, height) * 0.078 +
          progress * ring * 4;
        target.beginPath();
        target.setLineDash(
          ring % 2 === 0 ? [2, 10 + ring * 2] : [18 + ring * 3, 12],
        );
        target.lineDashOffset = progress * (ring % 2 === 0 ? 40 : -32);
        target.strokeStyle = strong
          ? `rgba(239,190,92,${alpha * (0.82 - ring * 0.06)})`
          : `rgba(239,215,169,${alpha * (0.54 - ring * 0.045)})`;
        target.lineWidth = strong ? 1.45 : 0.8;
        target.arc(0, 0, radius, 0, Math.PI * 2);
        target.stroke();

        const beatCount = 8 + ring * 4;
        for (let beat = 0; beat < beatCount; beat += 1) {
          const angle = (beat / beatCount) * Math.PI * 2;
          const beatX = Math.cos(angle) * radius;
          const beatY = Math.sin(angle) * radius;
          target.beginPath();
          target.fillStyle =
            beat % 4 === 0
              ? `rgba(239,190,92,${alpha * 0.9})`
              : `rgba(255,240,210,${alpha * 0.56})`;
          target.arc(
            beatX,
            beatY,
            beat % 4 === 0 ? (strong ? 2.2 : 1.5) : 0.9,
            0,
            Math.PI * 2,
          );
          target.fill();
        }
      }
      target.restore();
      target.setLineDash([]);
    };

    const drawKolamField = (
      target: CanvasRenderingContext2D,
      alpha: number,
      strong = false,
    ) => {
      const center = fieldCenter();
      const spacing = clamp(Math.min(width, height) * 0.075, 42, 68);
      const columns = width < 720 ? 7 : 11;
      const rows = width < 720 ? 9 : 9;
      const startX = center.x - ((columns - 1) * spacing) / 2;
      const startY = center.y - ((rows - 1) * spacing) / 2;
      const loop = spacing * 0.42;

      target.save();
      target.translate(center.x, center.y);
      target.rotate(-0.055 + progressRef.current * 0.08);
      target.translate(-center.x, -center.y);

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = startX + column * spacing;
          const y = startY + row * spacing;
          const parity = (row + column) % 2 === 0 ? 1 : -1;

          target.beginPath();
          target.fillStyle = `rgba(255,236,198,${alpha * 0.64})`;
          target.arc(x, y, strong ? 1.75 : 1.1, 0, Math.PI * 2);
          target.fill();

          target.beginPath();
          target.moveTo(x - loop, y);
          target.bezierCurveTo(
            x - loop,
            y - loop * parity,
            x - loop * parity,
            y - loop,
            x,
            y - loop,
          );
          target.bezierCurveTo(
            x + loop * parity,
            y - loop,
            x + loop,
            y - loop * parity,
            x + loop,
            y,
          );
          target.bezierCurveTo(
            x + loop,
            y + loop * parity,
            x + loop * parity,
            y + loop,
            x,
            y + loop,
          );
          target.bezierCurveTo(
            x - loop * parity,
            y + loop,
            x - loop,
            y + loop * parity,
            x - loop,
            y,
          );
          target.strokeStyle = strong
            ? `rgba(255,221,146,${alpha * 0.92})`
            : `rgba(234,217,186,${alpha * 0.52})`;
          target.lineWidth = strong ? 1.7 : 0.9;
          target.stroke();
        }
      }
      target.restore();
    };

    const drawAmbientGlow = () => {
      const center = fieldCenter();
      const glow = context.createRadialGradient(
        center.x,
        center.y,
        0,
        center.x,
        center.y,
        Math.max(width, height) * 0.58,
      );
      glow.addColorStop(0, "rgba(117,52,34,0.34)");
      glow.addColorStop(0.42, "rgba(72,31,30,0.18)");
      glow.addColorStop(1, "rgba(8,6,7,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      drawAmbientGlow();
      drawRhythmRings(context, 0.16);
      drawKolamField(context, 0.13);

      if (!reducedMotion) {
        maskContext.globalCompositeOperation = "destination-out";
        maskContext.fillStyle = pointer.active
          ? "rgba(0,0,0,0.004)"
          : "rgba(0,0,0,0.01)";
        maskContext.fillRect(0, 0, width, height);

        if (pointer.active) {
          stamp(
            pointer.x,
            pointer.y,
            clamp(width * 0.125, 94, 205),
            0.38,
          );
        }

        const scrollProgress = progressRef.current;
        const scrollStep = Math.floor(scrollProgress * 90);
        if (scrollProgress > 0.015 && scrollStep !== lastScrollStamp) {
          const center = fieldCenter();
          const angle = scrollProgress * Math.PI * 2.6;
          const radius = Math.min(width, height) * (0.11 + scrollProgress * 0.31);
          stamp(
            center.x + Math.cos(angle) * radius,
            center.y + Math.sin(angle) * radius * 0.68,
            clamp(width * 0.09, 72, 150),
            0.28,
          );
          lastScrollStamp = scrollStep;
        }
      }

      revealContext.clearRect(0, 0, width, height);
      revealContext.shadowColor = "rgba(239, 180, 70, 0.34)";
      revealContext.shadowBlur = 14;
      drawRhythmRings(revealContext, 0.95, true);
      drawKolamField(revealContext, 0.92, true);
      revealContext.shadowBlur = 0;
      revealContext.globalCompositeOperation = "destination-in";
      revealContext.drawImage(mask, 0, 0, width, height);
      revealContext.globalCompositeOperation = "source-over";
      context.drawImage(reveal, 0, 0, width, height);

      if (pointer.active && !reducedMotion) {
        const halo = context.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          70,
        );
        halo.addColorStop(0, "rgba(239,190,92,0.12)");
        halo.addColorStop(1, "rgba(239,190,92,0)");
        context.fillStyle = halo;
        context.beginPath();
        context.arc(pointer.x, pointer.y, 70, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    updateProgress();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateProgress, { passive: true });
    section.addEventListener("pointermove", pointerMove);
    section.addEventListener("pointerdown", pointerMove);
    section.addEventListener("pointerleave", pointerLeave);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateProgress);
      section.removeEventListener("pointermove", pointerMove);
      section.removeEventListener("pointerdown", pointerMove);
      section.removeEventListener("pointerleave", pointerLeave);
    };
  }, []);

  return (
    <section className="lineage-hero rhythm-hero" ref={sectionRef}>
      <div className="lineage-stage">
        <div className="rhythm-atmosphere" aria-hidden="true" />
        <canvas className="lineage-living rhythm-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="lineage-shade rhythm-shade" aria-hidden="true" />
        <div className="lineage-grain" aria-hidden="true" />

        <div className="lineage-content">
          <p className="eyebrow lineage-kicker">
            Classical arts · Secunderabad
          </p>
          <h1>
            Rhythm becomes
            <span>a living language.</span>
          </h1>
          <p className="lineage-copy">
            Bharatanatyam, Kuchipudi, and Carnatic music taught with patience,
            precision, and respect for the traditions that shape them.
          </p>
          <div className="lineage-actions">
            <Link className="button-link lineage-primary" href="/admissions">
              <span>Begin your journey</span>
              <ArrowRight size={18} />
            </Link>
            <Link className="lineage-text-link" href="/programs">
              Explore the traditions <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="lineage-instruction glass">
          <MousePointer2 aria-hidden="true" />
          <div>
            <span>Move through the rhythm</span>
            <small>Touch or scroll on mobile</small>
          </div>
        </div>

        <div className="lineage-chapter glass">
          <Orbit aria-hidden="true" />
          <p>
            <span>01 · Tala</span>
            Pattern becomes practice. Practice becomes expression.
          </p>
        </div>

        <a
          className="lineage-scroll"
          href="#introduction"
          aria-label="Scroll to discover the academy"
        >
          <ArrowDown />
          <span>Scroll to follow the rhythm</span>
        </a>
      </div>
    </section>
  );
}
