"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { MOTION_CHANGE_EVENT } from "../motion";

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  window.addEventListener(MOTION_CHANGE_EVENT, callback);
  return () => { media.removeEventListener("change", callback); window.removeEventListener(MOTION_CHANGE_EVENT, callback); };
}

function snapshot() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "system";
  return document.documentElement.dataset.motion === "paused" ? "paused" : "full";
}

export function MotionToggle() {
  const mode = useSyncExternalStore(subscribe, snapshot, () => "full");
  useEffect(() => {
    try {
      if (localStorage.getItem("academy-motion") === "paused") {
        document.documentElement.dataset.motion = "paused";
        window.dispatchEvent(new Event(MOTION_CHANGE_EVENT));
      }
    } catch { /* Motion controls still work when browser storage is unavailable. */ }
  }, []);

  return <button className="motion-toggle" disabled={mode === "system"} aria-pressed={mode !== "full"} onClick={() => {
    const next = mode === "paused" ? "full" : "paused";
    document.documentElement.dataset.motion = next;
    try { localStorage.setItem("academy-motion", next); } catch { /* Optional persistence. */ }
    window.dispatchEvent(new Event(MOTION_CHANGE_EVENT));
  }}>{mode === "full" ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}{mode === "system" ? "Reduced motion is on" : mode === "paused" ? "Resume animations" : "Pause animations"}</button>;
}
