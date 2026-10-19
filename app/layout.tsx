import type { Metadata } from "next";
import "./globals.css";
import { PreferencesProvider } from "@/components/PreferencesProvider";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  metadataBase: new URL("https://cargo-am.vercel.app"),
  title: "OneCargo — Logistics & Import Operating System",
  description: "OneCargo suite for import operations, quotes, container tracking, customs, and finances.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" data-accent="amber" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedMode = localStorage.getItem('onecargo-mode') || localStorage.getItem('onecargo-theme');
                if (savedMode === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-mode', 'light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-mode', 'dark');
                }

                const savedAccent = localStorage.getItem('onecargo-accent') || 'amber';
                document.documentElement.setAttribute('data-accent', savedAccent);
                const accentColors = {
                  bronze: '#a16207',
                  indigo: '#4f46e5',
                  crimson: '#9f1239',
                  emerald: '#059669',
                  amber: '#f59e0b',
                  cyan: '#0e7490'
                };
                if (accentColors[savedAccent]) {
                  document.documentElement.style.setProperty('--primary-accent', accentColors[savedAccent]);
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#f4f6fa] dark:bg-[#08090d] text-slate-900 dark:text-white antialiased selection:bg-amber-500 selection:text-white transition-colors duration-200 relative overflow-x-hidden">
        {/* Colorful ambient orbs positioned in z-0 to shine directly behind frosted glass cards */}
        <div className="fixed top-[-5%] right-[15%] w-[42rem] h-[42rem] bg-amber-500/15 dark:bg-amber-500/18 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] left-[20%] w-[38rem] h-[38rem] bg-indigo-600/15 dark:bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="fixed top-[35%] left-[-8%] w-[32rem] h-[32rem] bg-emerald-500/12 dark:bg-emerald-500/12 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="fixed bottom-[15%] right-[-5%] w-[30rem] h-[30rem] bg-rose-500/10 dark:bg-rose-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

        <PreferencesProvider>
          <div className="relative z-10 flex flex-col md:flex-row min-h-screen w-full">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              {children}
            </main>
          </div>
        </PreferencesProvider>
      </body>
    </html>
  );
}
