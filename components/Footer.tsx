import { useTranslations } from "next-intl";
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
      </Container>
    </footer>
  );
}
