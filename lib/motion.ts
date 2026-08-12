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
// each stage's start delay is computed from when the previous one visibly
// finishes, so the whole thing reads top-to-bottom rather than firing at
// once. Values are derived from the duration tokens in globals.css.
const NAV_DURATION = 200; // matches --duration-base
export const TILE_STAGGER = 80;
export const TILES_START = NAV_DURATION;
const TILE_DURATION = 280; // matches --duration-slow
const TILES_COUNT = 3;
export const FILTERS_START =
  TILES_START + (TILES_COUNT - 1) * TILE_STAGGER + TILE_DURATION;
export const CARDS_START = FILTERS_START + TILE_DURATION;
