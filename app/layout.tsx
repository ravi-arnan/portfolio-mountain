import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/providers/Preloader";
import PageTransition from "@/components/providers/PageTransition";
import Cursor from "@/components/ui/Cursor";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ExperienceCanvas from "@/components/experience/ExperienceCanvas";
import Instruments from "@/components/ui/Instruments";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ravi Arnan",
  url: siteUrl,
  jobTitle: "Developer & Designer",
  sameAs: ["https://github.com/CHANGE_ME", "https://www.linkedin.com/in/CHANGE_ME"],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Ravi Arnan — Developer & Designer", template: "%s — Ravi Arnan" },
  description: "Portfolio of Ravi Arnan, a developer and designer building immersive, performant web experiences.",
  openGraph: { type: "website", siteName: "Ravi Arnan" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll>
          <Preloader />
          <PageTransition />
          <Cursor />
          <ExperienceCanvas />
          <Header />
          <Instruments />
          <div id="main" className="relative z-10">{children}</div>
          <Footer />
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
