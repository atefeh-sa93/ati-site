import { Activity } from "@/components/activity";
import { Contact, Footer } from "@/components/contact";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
import { Writing } from "@/components/writing";
import { getDictionary, getLocale } from "./dictionaries";

export default async function Home() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <div className="mx-auto flex max-w-[1160px] flex-col gap-5 px-5 pt-6 pb-12">
      <Header t={t} locale={locale} />
      <main className="flex flex-col gap-5">
        <Hero t={t} locale={locale} />
        <Work t={t} />
        <Activity t={t} />
        <Writing t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}
