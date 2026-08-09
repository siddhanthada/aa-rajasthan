"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Find a meeting" },
  { href: "/new-to-aa", label: "New to AA" },
  { href: "/concerned-about-someone", label: "Concerned about someone" },
  { href: "/about", label: "About AA" },
];

function NavLink({
  href,
  label,
  active,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium text-white transition-colors ${
        active
          ? "rounded-full bg-white/12 px-3.5 py-1.5 opacity-100"
          : "px-3.5 py-1.5 opacity-70 hover:opacity-100"
      } ${className}`}
    >
      {label}
    </Link>
  );
}

export default function TopBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative shrink-0 bg-indigo">
      <div className="relative flex h-16 items-center gap-8 px-4 sm:px-6">
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

        <Link
          href="/"
          className="relative shrink-0 text-base font-semibold text-white"
        >
          AA Rajasthan
        </Link>

        <nav className="relative hidden flex-1 items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </nav>

        <div className="relative ml-auto flex items-center gap-4">
          <a
            href="tel:+911414000000"
            className="rounded-lg bg-terracotta px-4 py-2 text-sm font-semibold text-white"
          >
            Helpline
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="text-white md:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button type="button" className="text-sm text-white">
            EN | HI
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="w-full bg-indigo md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-4 text-sm font-medium text-white ${
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
