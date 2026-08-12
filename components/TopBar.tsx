"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Menu, X, Phone } from "lucide-react";
import Container from "./Container";
import { pressable } from "@/lib/motion";

function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const enRef = useRef<HTMLButtonElement>(null);
  const hiRef = useRef<HTMLButtonElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>(
    { left: 0, width: 0 },
  );

  useLayoutEffect(() => {
    function measure() {
      const el = locale === "en" ? enRef.current : hiRef.current;
      if (el) {
        setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [locale]);

  function switchTo(nextLocale: "en" | "hi") {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="relative flex items-center gap-0.5 rounded-full bg-white/10 p-0.5">
      <div
        aria-hidden="true"
        className="absolute inset-y-0.5 left-0 rounded-full bg-white/20 motion-safe:transition-[transform,width] motion-safe:duration-[var(--duration-base)] motion-safe:ease-decel"
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: indicator.width,
        }}
      />
      <button
        ref={enRef}
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        className={`relative z-10 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium motion-safe:transition-colors motion-safe:duration-[var(--duration-base)] ${
          locale === "en" ? "text-white" : "text-white/60 hover:text-white/85"
        }`}
      >
        EN
      </button>
      <button
        ref={hiRef}
        type="button"
        onClick={() => switchTo("hi")}
        aria-pressed={locale === "hi"}
        className={`relative z-10 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium motion-safe:transition-colors motion-safe:duration-[var(--duration-base)] ${
          locale === "hi" ? "text-white" : "text-white/60 hover:text-white/85"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}

function NavTabs({
  navLinks,
  pathname,
}: {
  navLinks: { href: string; label: string }[];
  pathname: string;
}) {
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>(
    { left: 0, width: 0 },
  );
  const activeIndex = navLinks.findIndex((l) => l.href === pathname);

  useLayoutEffect(() => {
    function measure() {
      const el = linkRefs.current[activeIndex === -1 ? 0 : activeIndex];
      if (el) {
        setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex, navLinks.length]);

  return (
    <nav className="relative hidden flex-1 items-center justify-center gap-10 md:flex">
      {navLinks.map((link, i) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            href={link.href}
            className={`text-[14px] font-semibold motion-safe:transition-opacity motion-safe:duration-[var(--duration-base)] ${
              active ? "text-white" : "text-white/70 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <div
        aria-hidden="true"
        className="absolute -bottom-2 left-0 h-[3px] rounded-full bg-terracotta motion-safe:transition-[transform,width] motion-safe:duration-[var(--duration-base)] motion-safe:ease-decel"
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: indicator.width,
        }}
      />
    </nav>
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

      <Container className="relative flex h-[68px] items-center gap-6">
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
          className="rounded-md text-white motion-safe:transition-colors motion-safe:duration-[var(--duration-base)] md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <NavTabs navLinks={navLinks} pathname={pathname} />

        <div className="ml-auto flex items-center gap-4">
          <a
            href="tel:+911414000000"
            aria-label={t("helpline")}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-terracotta px-3 py-2 text-[13px] font-semibold text-white sm:px-4 ${pressable}`}
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
              className={`block px-8 py-4 text-sm font-medium text-white motion-safe:transition-colors motion-safe:duration-[var(--duration-base)] ${
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
