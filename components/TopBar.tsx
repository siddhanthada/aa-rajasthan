"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Menu, X, Phone } from "lucide-react";
import Container from "./Container";

function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(nextLocale: "en" | "hi") {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-0.5">
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          locale === "en"
            ? "bg-white/20 text-white"
            : "text-white/60 hover:text-white/85"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchTo("hi")}
        aria-pressed={locale === "hi"}
        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          locale === "hi"
            ? "bg-white/20 text-white"
            : "text-white/60 hover:text-white/85"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}

export default function TopBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("findAMeeting") },
    { href: "/about-aa", label: t("aboutAA") },
  ];

  return (
    <div className="sticky top-0 z-40 shrink-0 bg-indigo">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="jali-topbar"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M24 0 L48 24 L24 48 L0 24 Z M24 10 L38 24 L24 38 L10 24 Z"
              fill="none"
              stroke="#F7F4EE"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#jali-topbar)"
          opacity="0.15"
        />
      </svg>

      <Container className="relative flex h-[68px] items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-terracotta text-[13px] font-semibold text-white">
            AA
          </span>
          <span className="text-base font-semibold text-white">
            Rajasthan
          </span>
        </Link>

        <button
          type="button"
          aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="text-white md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className="hidden flex-1 items-center justify-center gap-12 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[12px] font-medium uppercase tracking-[0.04em] text-white transition-opacity ${
                  active
                    ? "underline decoration-2 underline-offset-[2px] opacity-100"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href="tel:+911414000000"
            aria-label={t("helpline")}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-terracotta px-3 py-2 text-[13px] font-semibold text-white sm:px-4"
          >
            <Phone size={14} />
            <span className="hidden sm:inline">+91 141 400 0000</span>
          </a>
          <LanguageToggle />
        </div>
      </Container>

      {mobileOpen && (
        <nav className="w-full bg-indigo md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-8 py-4 text-sm font-medium text-white ${
                pathname === link.href ? "bg-white/12" : "opacity-70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
