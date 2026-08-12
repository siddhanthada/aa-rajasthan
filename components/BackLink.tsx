import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { hoverTransition } from "@/lib/motion";

export default function BackLink({ label }: { label: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink ${hoverTransition}`}
    >
      <ArrowLeft size={16} />
      {label}
    </Link>
  );
}
