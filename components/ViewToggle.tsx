"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export type ViewMode = "cards" | "table";

export default function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}) {
  const t = useTranslations("filters");
  const cardsRef = useRef<HTMLButtonElement>(null);
  const tableRef = useRef<HTMLButtonElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>(
    { left: 0, width: 0 },
  );

  useLayoutEffect(() => {
    function measure() {
      const el = view === "cards" ? cardsRef.current : tableRef.current;
      if (el) {
        setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [view, t]);

  return (
    <div className="relative inline-flex items-center gap-0.5 rounded-full border border-border bg-white p-1">
      <div
        aria-hidden="true"
        className="absolute inset-y-1 left-0 rounded-full bg-indigo motion-safe:transition-[transform,width] motion-safe:duration-[var(--duration-base)] motion-safe:ease-decel"
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: indicator.width,
        }}
      />
      <button
        ref={cardsRef}
        type="button"
        aria-pressed={view === "cards"}
        onClick={() => onChange("cards")}
        className={`relative z-10 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium motion-safe:transition-colors motion-safe:duration-[var(--duration-base)] ${
          view === "cards" ? "text-white" : "text-ink"
        }`}
      >
        {t("cards")}
      </button>
      <button
        ref={tableRef}
        type="button"
        aria-pressed={view === "table"}
        onClick={() => onChange("table")}
        className={`relative z-10 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium motion-safe:transition-colors motion-safe:duration-[var(--duration-base)] ${
          view === "table" ? "text-white" : "text-ink"
        }`}
      >
        {t("table")}
      </button>
    </div>
  );
}
