import Link from "next/link";
import {
  Info,
  HeartHandshake,
  ListChecks,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

const TILES: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  quiet?: boolean;
}[] = [
  {
    href: "/new-to-aa",
    title: "New to AA",
    description: "What to expect at your first meeting",
    icon: Info,
  },
  {
    href: "/concerned-about-someone",
    title: "Concerned about someone",
    description: "If someone you care about drinks",
    icon: HeartHandshake,
  },
  {
    href: "/new-to-aa/self-check",
    title: "Not sure?",
    description: "A few quiet questions, no pressure",
    icon: ListChecks,
    quiet: true,
  },
];

export default function EntryTiles() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {TILES.map((tile) => (
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
