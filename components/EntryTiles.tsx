import Link from "next/link";
import { Info, HeartHandshake, ChevronRight, type LucideIcon } from "lucide-react";

const TILES: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
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
];

export default function EntryTiles() {
  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row">
      {TILES.map((tile) => (
        <Link
          key={tile.href}
          href={tile.href}
          className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-white p-4 transition-colors hover:border-indigo"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo/10">
            <tile.icon size={20} className="text-indigo" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink">
              {tile.title}
            </span>
            <span className="block truncate text-xs text-ink-muted">
              {tile.description}
            </span>
          </span>
          <ChevronRight size={18} className="ml-auto shrink-0 text-ink-muted" />
        </Link>
      ))}
    </div>
  );
}
