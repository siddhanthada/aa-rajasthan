import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/learn/new-to-aa", label: "New to AA" },
  { href: "/learn/concerned-about-someone", label: "Concerned about someone" },
  { href: "/learn/about-aa", label: "About AA" },
];

export default function Footer() {
  return (
    <footer className="bg-indigo py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 sm:px-6">
        <p className="text-sm text-white">
          AA Rajasthan — a community-maintained meeting directory
        </p>

        <div className="flex flex-wrap gap-6">
          {FOOTER_LINKS.map((link) => (
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
            Helpline: +91 141 400 0000
          </a>
          <span className="text-xs text-white/70">
            No account needed. We don&rsquo;t track who searches here.
          </span>
        </div>
      </div>
    </footer>
  );
}
