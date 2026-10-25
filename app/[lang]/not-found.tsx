import Link from "next/link";
import { Star } from "@/components/decor";
import { getDictionary, getLocale } from "./dictionaries";

export default async function NotFound() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-5 px-5 text-center">
      <Star className="anim-bob" />
      <p dir="ltr" className="m-0 font-mono text-sm text-accent-text">404</p>
      <h1 className="m-0 font-heading text-4xl font-extrabold">{t.notFound.title}</h1>
      <p className="m-0 text-sub">{t.notFound.body}</p>
      <Link href={`/${locale}`} className="lift inline-flex min-h-[52px] items-center rounded-full bg-primary px-7 font-bold text-white no-underline">
        {t.notFound.back}
      </Link>
    </main>
  );
}
