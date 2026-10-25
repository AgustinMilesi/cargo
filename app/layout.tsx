import type { Metadata } from "next";
import "./globals.css";
import { PreferencesProvider } from "@/components/PreferencesProvider";
import { Sidebar } from "@/components/Sidebar";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://cargo-am.vercel.app"),
  title: {
    default: "VOUT Cargo · Global Freight & Import Operations System",
    template: "%s · VOUT Cargo",
  },
  description:
    "Autonomous enterprise logistics suite for real-time international container tracking, customs clearance dispatching, quote estimation, and fleet finance auditing.",
  applicationName: "VOUT Cargo",
  keywords: [
    "Freight Logistics",
    "Container Tracking",
    "Customs Dispatch",
    "Supply Chain OS",
    "Ocean Freight",
    "Air Cargo",
    "Next.js",
    "Prisma",
    "Agustín Milesi",
  ],
  authors: [{ name: "Agustín Milesi", url: "https://github.com/AgustinMilesi" }],
  creator: "Agustín Milesi",
  publisher: "VOUT Ecosystem",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "VOUT Cargo · Global Freight & Import Operations System",
    description:
      "Enterprise logistics platform for container tracking, customs clearance, quote management, and fleet finance audits.",
    url: "https://cargo-am.vercel.app",
    siteName: "VOUT Cargo",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VOUT Cargo · Global Logistics OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VOUT Cargo · Global Freight & Import Operations System",
    description:
      "Track containers, manage international customs clearance, and audit logistics profitability.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "VOUT Cargo",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Agustín Milesi",
    url: "https://github.com/AgustinMilesi",
  },
  description:
    "Autonomous enterprise logistics suite for real-time container tracking, customs dispatching, and supply chain ledger auditing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" data-accent="lime" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedMode = localStorage.getItem('vout-cargo-mode') || localStorage.getItem('onecargo-mode') || 'dark';
                if (savedMode === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-mode', 'light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-mode', 'dark');
                }

                const savedAccent = localStorage.getItem('vout-cargo-accent') || localStorage.getItem('onecargo-accent') || 'lime';
                document.documentElement.setAttribute('data-accent', savedAccent);
                const accentColors = {
                  lime: '#C6F827',
                  emerald: '#10B981',
                  indigo: '#6366F1',
                  rose: '#F43F5E',
                  amber: '#F59E0B',
                  cyan: '#06B6D4',
                  violet: '#8B5CF6'
                };
                if (accentColors[savedAccent]) {
                  document.documentElement.style.setProperty('--primary-accent', accentColors[savedAccent]);
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-page)] nautical-dot-matrix text-slate-100 antialiased selection:bg-[var(--primary-accent)] selection:text-[var(--primary-accent-text)] transition-colors duration-200 relative overflow-x-hidden">
        {/* Subtle obsidian ambient depth */}
        <div className="fixed top-[-10%] right-[10%] w-[42rem] h-[42rem] bg-[var(--primary-accent)]/5 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* Skip to Content for Keyboard Users (WCAG 2.2 SC 2.4.1) */}
        <a href="#main-content" className="sr-only skip-link">
          Saltar al contenido principal / Skip to main content
        </a>

        <PreferencesProvider>
          <div className="relative z-10 flex flex-col md:flex-row min-h-screen w-full">
            <Sidebar />
            <main id="main-content" role="main" tabIndex={-1} className="flex-1 flex flex-col min-w-0 outline-none">
              {children}
            </main>
          </div>
          <CookieBanner />
        </PreferencesProvider>
      </body>
    </html>
  );
}
