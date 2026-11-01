import type { Metadata } from "next";
import "@fontsource-variable/vazirmatn";
import "@fontsource-variable/nunito";
import "@fontsource-variable/fredoka";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import { NotFoundView } from "@/components/not-found-view";
import { themeScript } from "@/lib/theme";
import en from "./[lang]/dictionaries/en.json";
import fa from "./[lang]/dictionaries/fa.json";

/*
 * Exported as out/404.html, which GitHub Pages serves for every unknown URL.
 * It renders outside app/[lang]/layout.tsx, so the locale isn't known on the server:
 * both versions are rendered and this script shows one before first paint —
 * Persian for /fa/… URLs, or when Persian was picked before and the URL isn't /en/….
 */
const localeScript = `(function(){try{var p=location.pathname;var fa=/\\/fa(\\/|$)/.test(p)||(!/\\/en(\\/|$)/.test(p)&&/(?:^|; )lang=fa/.test(document.cookie));if(fa){var h=document.documentElement;h.lang='fa';h.dir='rtl'}}catch(e){}})()`;

export const metadata: Metadata = {
  title: "404 — Page not found",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
      </head>
      <body className="min-h-dvh overflow-x-hidden text-[17px] leading-[1.7] antialiased">
        <div data-locale="en">
          <NotFoundView t={en.notFound} locale="en" />
        </div>
        <div data-locale="fa" lang="fa" dir="rtl">
          <NotFoundView t={fa.notFound} locale="fa" />
        </div>
      </body>
    </html>
  );
}
