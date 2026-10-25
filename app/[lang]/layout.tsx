import type { Metadata } from "next";
import "@fontsource-variable/vazirmatn";
import "@fontsource-variable/nunito";
import "@fontsource-variable/fredoka";
import "@fontsource-variable/geist-mono";
import "../globals.css";
import { dirOf, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { getDictionary, getLocale } from "./dictionaries";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { fa: "/fa", en: "/en", "x-default": "/fa" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      title: t.meta.title,
      description: t.meta.description,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      siteName: t.person.name,
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
  };
}

// Runs before first paint: applies the saved theme (or the OS preference) so there's no flash.
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);var t=m?m[1]:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir={dirOf(locale)} data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh overflow-x-hidden text-[17px] leading-[1.7] antialiased">{children}</body>
    </html>
  );
}
