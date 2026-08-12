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

  return (
    <div className="relative inline-flex items-center rounded-full border border-border bg-white p-1">
      <div
        className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-indigo transition-transform duration-150 ease-out ${
          view === "table" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
        }`}
        aria-hidden="true"
      />
      <button
        type="button"
        aria-pressed={view === "cards"}
        onClick={() => onChange("cards")}
        className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          view === "cards" ? "text-white" : "text-ink"
        }`}
      >
        {t("cards")}
      </button>
      <button
        type="button"
        aria-pressed={view === "table"}
        onClick={() => onChange("table")}
        className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          view === "table" ? "text-white" : "text-ink"
        }`}
      >
        {t("table")}
      </button>
    </div>
  );
}
