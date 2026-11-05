export const MOTION_CHANGE_EVENT = "academy-motion-change";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.motion === "paused"
  );
}
