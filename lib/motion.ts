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

// Page-load sequence timing (ms): nav fades in first, then the homepage
// tiles stagger in, then the filter block, then the result cards/rows —
// each stage starts a beat after the previous one *begins* (not after it
// fully finishes) so the sequence still reads top-to-bottom without the
// whole page taking over a second to settle. Values are derived from the
// duration tokens in globals.css.
export const TILE_STAGGER = 30;
export const TILES_START = 60;
export const FILTERS_START = 130;
export const CARDS_START = 190;
