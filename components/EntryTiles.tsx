import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Info,
  HeartHandshake,
  ListChecks,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

export default function EntryTiles() {
  const t = useTranslations("homepage");

  const tiles: {
    href: string;
    title: string;
    description: string;
    icon: LucideIcon;
    quiet?: boolean;
  }[] = [
    {
      href: "/new-to-aa",
      title: t("newToAA.title"),
      description: t("newToAA.desc"),
      icon: Info,
    },
    {
      href: "/concerned-about-someone",
      title: t("concerned.title"),
      description: t("concerned.desc"),
      icon: HeartHandshake,
    },
    {
      href: "/new-to-aa/self-check",
      title: t("notSure.title"),
      description: t("notSure.desc"),
      icon: ListChecks,
      quiet: true,
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiles.map((tile) => (
        <Link
          key={tile.href}
          href={tile.href}
          className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-colors hover:border-indigo"
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              tile.quiet ? "border border-border bg-transparent" : "bg-indigo/10"
            }`}
          >
            <tile.icon
              size={20}
              className={tile.quiet ? "text-ink-muted" : "text-indigo"}
            />
          </span>
          <span className="min-w-0">
            <span
              className={`block text-sm font-semibold ${
                tile.quiet ? "text-ink-muted" : "text-ink"
              }`}
            >
              {tile.title}
            </span>
            <span className="block truncate text-xs text-ink-muted">
              {tile.description}
            </span>
          </span>
          {!tile.quiet && (
            <ChevronRight
              size={18}
              className="ml-auto shrink-0 text-ink-muted"
            />
          )}
        </Link>
      ))}
    </div>
  );
}
