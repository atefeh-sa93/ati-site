import { NotFoundView } from "@/components/not-found-view";
import { getDictionary, getLocale } from "./dictionaries";

export default async function NotFound() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return <NotFoundView t={t.notFound} locale={locale} />;
}
