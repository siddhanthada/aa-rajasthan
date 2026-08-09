"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, DoorOpen } from "lucide-react";

const QUICK_EXIT_URL = "https://www.google.com";

const LEARN_LINKS = [
  { href: "/learn/new-to-aa", label: "New to AA" },
  { href: "/learn/concerned-about-someone", label: "Concerned about someone" },
  { href: "/learn/about-aa", label: "About AA" },
];

function quickExit() {
  window.location.replace(QUICK_EXIT_URL);
}

function QuickExitButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Quickly leave this site"
      onClick={quickExit}
      className={className}
    >
      <DoorOpen size={20} />
    </button>
  );
}

function LearnDropdown({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1 text-sm font-medium text-white transition-colors ${
          active
            ? "rounded-full bg-white/12 px-3.5 py-1.5 opacity-100"
            : "px-3.5 py-1.5 opacity-70 hover:opacity-100"
        }`}
      >
        Learn
        <ChevronDown size={14} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-white p-1"
        >
          {LEARN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-ink hover:bg-paper"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const learnActive = pathname.startsWith("/learn");

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
          <Link
            href="/"
            className={`text-sm font-medium text-white transition-colors ${
              pathname === "/"
                ? "rounded-full bg-white/12 px-3.5 py-1.5 opacity-100"
                : "px-3.5 py-1.5 opacity-70 hover:opacity-100"
            }`}
          >
            Find a meeting
          </Link>
          <LearnDropdown active={learnActive} />
        </nav>

        <div className="relative ml-auto flex items-center gap-4">
          <a
            href="tel:+911414000000"
            className="rounded-lg bg-terracotta px-4 py-2 text-sm font-semibold text-white"
          >
            Helpline
          </a>
          <QuickExitButton className="hidden text-white md:block" />
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
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`block px-4 py-4 text-sm font-medium text-white ${
              pathname === "/" ? "bg-white/12" : "opacity-70"
            }`}
          >
            Find a meeting
          </Link>
          <div className="px-4 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-white/50">
            Learn
          </div>
          {LEARN_LINKS.map((link) => (
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

      <QuickExitButton className="fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-indigo text-white md:hidden" />
    </div>
  );
}
