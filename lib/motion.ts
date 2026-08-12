// Shared motion class fragments. Durations reference the CSS custom
// properties declared in globals.css so there's one source of truth;
// everything is gated behind motion-safe: (prefers-reduced-motion:
// no-preference) so reduced-motion users still get instant color/opacity
// feedback without any transform/slide/scale.

export const hoverTransition =
  "motion-safe:transition-colors motion-safe:duration-[var(--duration-base)] motion-safe:ease-standard";

export const pressable =
  "active:opacity-85 motion-safe:transition-[background-color,border-color,color,transform] motion-safe:duration-[var(--duration-base)] motion-safe:ease-standard motion-safe:active:duration-[var(--duration-fast)] motion-safe:active:scale-[0.97]";

export const tileHover =
  "motion-safe:transition-[border-color,transform] motion-safe:duration-[var(--duration-base)] motion-safe:ease-standard motion-safe:hover:-translate-y-0.5";
