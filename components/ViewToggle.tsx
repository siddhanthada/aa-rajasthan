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
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-white p-1">
      <button
        type="button"
        aria-pressed={view === "cards"}
        onClick={() => onChange("cards")}
        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          view === "cards" ? "bg-indigo text-white" : "text-ink hover:bg-paper"
        }`}
      >
        {t("cards")}
      </button>
      <button
        type="button"
        aria-pressed={view === "table"}
        onClick={() => onChange("table")}
        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          view === "table" ? "bg-indigo text-white" : "text-ink hover:bg-paper"
        }`}
      >
        {t("table")}
      </button>
    </div>
  );
}
