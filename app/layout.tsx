import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSansDevanagari = IBM_Plex_Sans_Devanagari({
  variable: "--font-ibm-plex-sans-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Find an AA Meeting — Rajasthan",
  description:
    "Find a current Alcoholics Anonymous meeting near you in Rajasthan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${ibmPlexSansDevanagari.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink antialiased">
        <div
          className="jali-bg pointer-events-none fixed inset-0 opacity-[0.025]"
          aria-hidden="true"
        />
        {children}
      </body>
    </html>
  );
}
