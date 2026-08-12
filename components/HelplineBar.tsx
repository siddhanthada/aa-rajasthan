import { useTranslations } from "next-intl";
import { hoverTransition, pressable } from "@/lib/motion";

export default function HelplineBar() {
  const t = useTranslations("footer");

  return (
    <a
      href="tel:+911414000000"
      className={`shrink-0 rounded-lg border border-indigo px-4 py-2.5 text-sm font-semibold text-indigo hover:bg-indigo/5 ${hoverTransition} ${pressable}`}
    >
      {t("helpline", { number: "+91 141 400 0000" })}
    </a>
  );
}
