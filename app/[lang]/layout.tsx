import type { Metadata } from "next";
import "@fontsource-variable/vazirmatn";
import "@fontsource-variable/nunito";
import "@fontsource-variable/fredoka";
import "@fontsource-variable/geist-mono";
import "../globals.css";
import { defaultLocale, dirOf, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import { getDictionary, getLocale } from "./dictionaries";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();
  // Built by app/[lang]/og.png/route.tsx.
  const image = { url: `/${locale}/og.png`, width: 1200, height: 630, alt: t.meta.title };
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { fa: "/fa", en: "/en", "x-default": `/${defaultLocale}` },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      title: t.meta.title,
      description: t.meta.description,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      siteName: t.person.name,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description, images: [image] },
  };
}

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
