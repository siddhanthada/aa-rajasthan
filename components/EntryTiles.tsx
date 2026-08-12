import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Info,
  HeartHandshake,
  ListChecks,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { tileHover, TILES_START, TILE_STAGGER } from "@/lib/motion";

export default function EntryTiles() {
  const t = useTranslations("homepage");

  const tiles: {
    href: string;
    title: string;
    description: string;
    icon: LucideIcon;
    accent?: "indigo" | "terracotta";
  }[] = [
    {
      href: "/new-to-aa",
      title: t("newToAA.title"),
      description: t("newToAA.desc"),
      icon: Info,
      accent: "indigo",
    },
    {
      href: "/concerned-about-someone",
      title: t("concerned.title"),
      description: t("concerned.desc"),
      icon: HeartHandshake,
      accent: "terracotta",
    },
    {
      href: "/new-to-aa/self-check",
      title: t("notSure.title"),
      description: t("notSure.desc"),
      icon: ListChecks,
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {tiles.map((tile, index) => (
        <Link
          key={tile.href}
          href={tile.href}
          className={`group flex rounded-xl border border-border bg-white p-4 animate-fade-rise ${tileHover} ${
            tile.accent === undefined
              ? "col-span-2 items-center gap-3 sm:col-span-1"
              : "flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3"
          } ${
            tile.accent === "indigo"
              ? "border-l-[3px] border-l-indigo hover:border-indigo"
              : tile.accent === "terracotta"
                ? "border-l-[3px] border-l-terracotta hover:border-terracotta"
                : "hover:border-indigo"
          }`}
          style={{ animationDelay: `${TILES_START + index * TILE_STAGGER}ms` }}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg motion-safe:transition-colors motion-safe:duration-[var(--duration-base)] motion-safe:ease-standard ${
              tile.accent === "indigo"
                ? "bg-indigo"
                : tile.accent === "terracotta"
                  ? "bg-terracotta"
                  : "border border-border bg-transparent group-hover:border-indigo"
            }`}
          >
            <tile.icon
              size={20}
              className={tile.accent ? "text-white" : "text-ink-muted"}
            />
          </span>
          <span className="min-w-0">
            <span
              className={`block text-sm font-semibold ${
                tile.accent ? "text-ink" : "text-ink-muted"
              }`}
            >
              {tile.title}
            </span>
            <span
              className={`truncate text-xs text-ink-muted ${
                tile.accent ? "hidden sm:block" : "block"
              }`}
            >
              {tile.description}
            </span>
          </span>
          {tile.accent && (
            <ChevronRight
              size={18}
              className="hidden shrink-0 text-ink-muted sm:ml-auto sm:block"
            />
          )}
        </Link>
      ))}
    </div>
  );
}
