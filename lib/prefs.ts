/** Client-side helper: remembers a preference for a year (read by public/index.html and the theme script). */
export function savePreference(name: "lang" | "theme", value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}
