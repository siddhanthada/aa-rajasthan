import { useTranslations } from "next-intl";
import { Heart, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Container from "./Container";

export default function Footer() {
  const t = useTranslations("footer");
  const tHomepage = useTranslations("homepage");
  const tNav = useTranslations("nav");

  const footerLinks = [
    { href: "/new-to-aa", label: tHomepage("newToAA.title") },
    { href: "/concerned-about-someone", label: tHomepage("concerned.title") },
    { href: "/about-aa", label: tNav("aboutAA") },
  ];

  return (
    <footer className="bg-indigo py-8">
      <Container className="flex flex-col gap-3">
        <p className="text-sm text-white">{t("tagline")}</p>

        <div className="flex flex-wrap gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-white/80 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a
            href="tel:+911414000000"
            className="text-sm font-medium text-white"
          >
            {t("helpline", { number: "+91 141 400 0000" })}
          </a>
          <span className="text-xs text-white/70">{t("privacy")}</span>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <a
            href="https://www.siddhant.design/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 text-xs text-white/50 hover:text-white/70"
          >
            <span>Made with</span>
            <Heart size={12} className="fill-current" />
            <span>by Siddhant</span>
            <ExternalLink size={10} className="ml-1" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
