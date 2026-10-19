import type { Metadata } from "next";
import "./globals.css";
import { PreferencesProvider } from "@/components/PreferencesProvider";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  metadataBase: new URL("https://cargo-am.vercel.app"),
  title: "OneCargo — Logistics & Import Operating System",
  description: "KipinTOCH suite for import operations, quotes, container tracking, customs, and finances.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('onecargo-mode') || localStorage.getItem('onecargo-theme');
                if (saved === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#f5f6fa] dark:bg-[#0c0d12] text-slate-900 dark:text-white flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200 relative">
        {/* Ambient subtle glow for frosted glass refraction */}
        <div className="fixed top-[-10%] right-[10%] w-[38rem] h-[38rem] bg-indigo-500/10 dark:bg-indigo-500/12 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] left-[20%] w-[32rem] h-[32rem] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="fixed top-[40%] left-[-5%] w-[28rem] h-[28rem] bg-blue-500/10 dark:bg-blue-600/8 rounded-full blur-[130px] pointer-events-none -z-10" />

        <PreferencesProvider>
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {children}
          </main>
        </PreferencesProvider>
      </body>
    </html>
  );
}
