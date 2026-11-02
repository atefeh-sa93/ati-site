import { readFile } from "node:fs/promises";
import { join } from "node:path";
import * as fontkit from "fontkit";
import type { Font } from "fontkit";
import { ImageResponse } from "next/og";
import { hasLocale, locales } from "@/lib/i18n";
import { rtlRuns } from "@/lib/rtl-runs";
import { site } from "@/lib/site";
import en from "../dictionaries/en.json";
import fa from "../dictionaries/fa.json";

/*
 * Social preview card (LinkedIn, Telegram, Slack…), rendered once per locale at build time.
 * A route handler named og.png (instead of opengraph-image) so the static file keeps its
 * extension and GitHub Pages serves it as image/png. Linked from the layout's metadata.
 */
export const dynamic = "force-static";
const OG_SIZE = { width: 1200, height: 630 };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const COLORS = { primary: "#6c4df5", plum: "#2a1b3d", sun: "#ffc93c", teal: "#3dd6b5", lilac: "#ede7ff" };

// ImageResponse needs static ttf/otf/woff files, so these come from the non-variable @fontsource packages.
const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

/**
 * Satori lays text out left-to-right only, so Persian is placed run by run (see rtlRuns)
 * in a row-reverse flex row, and each run's pieces are reversed the same way.
 *
 * Satori also sizes Persian words by their unjoined letter forms, leaving a gap after each
 * one, so every piece gets its real shaped width from fontkit.
 */
function Rtl({ text, size, font, wrap = true }: { text: string; size: number; font: Font; wrap?: boolean }) {
  // Latin fallback glyphs ("+", "M") come from another font, so those pieces keep Satori's own
  // measurement. (No `width: undefined` either: Satori trips over undefined style values.)
  const style = (part: string) =>
    [...part].every((char) => font.hasGlyphForCodePoint(char.codePointAt(0)!))
      ? { width: (font.layout(part).advanceWidth / font.unitsPerEm) * size }
      : {};

  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", flexWrap: wrap ? "wrap" : "nowrap", columnGap: size * 0.28 }}>
      {rtlRuns(text).map((run, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "row-reverse" }}>
          {run.latin
            ? run.pieces[0]
            : run.pieces.map((part, j) => (
                <span key={j} style={style(part)}>
                  {part}
                </span>
              ))}
        </div>
      ))}
    </div>
  );
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const rtl = hasLocale(lang) && lang === "fa";
  const t = rtl ? fa : en;
  const number = new Intl.NumberFormat(rtl ? "fa-IR" : "en-US");
  const url = site.url.replace(/^https?:\/\//, "");
  const align = rtl ? "flex-end" : "flex-start";

  const [heading, body, persian, persianBold] = await Promise.all([
    font("fredoka", "fredoka-latin-700-normal.woff"),
    font("nunito", "nunito-latin-600-normal.woff"),
    font("vazirmatn", "vazirmatn-arabic-400-normal.woff"),
    font("vazirmatn", "vazirmatn-arabic-800-normal.woff"),
  ]);
  const shaping = { 400: fontkit.create(persian) as Font, 800: fontkit.create(persianBold) as Font };
  // Persian text goes through <Rtl>; size and weight must match the surrounding style.
  const text = (value: string, size: number, weight: 400 | 800, wrap = false) =>
    rtl ? <Rtl text={value} size={size} font={shaping[weight]} wrap={wrap} /> : value;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: rtl ? "row-reverse" : "row",
          gap: 32,
          padding: 48,
          background: "#fbf7ff",
          fontFamily: rtl ? "Vazirmatn" : "Nunito",
        }}
      >
        {/* Intro card */}
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: align,
            justifyContent: "space-between",
            padding: "52px 56px",
            borderRadius: 40,
            background: COLORS.primary,
            color: "white",
            overflow: "hidden",
          }}
        >
          <svg width="300" height="300" viewBox="0 0 220 220" style={{ position: "absolute", bottom: -90, [rtl ? "left" : "right"]: -70, opacity: 0.25 }}>
            <circle cx="110" cy="110" r="100" fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="6 12" />
            <circle cx="110" cy="110" r="60" fill="none" stroke="#fff" strokeWidth={3} />
          </svg>
          <svg width="84" height="84" viewBox="0 0 64 64" style={{ position: "absolute", top: 44, [rtl ? "left" : "right"]: 48 }}>
            <path d="M32 4l6 20 20 2-16 12 6 20-16-12-16 12 6-20L6 26l20-2z" fill={COLORS.sun} stroke={COLORS.plum} strokeWidth={2.5} strokeLinejoin="round" />
          </svg>

          <div
            style={{
              display: "flex",
              flexDirection: rtl ? "row-reverse" : "row",
              alignItems: "center",
              gap: 12,
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.15)",
              fontSize: 24,
              fontWeight: rtl ? 400 : 600,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 999, background: COLORS.teal }} />
            {text(t.hero.badge, 24, 400)}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: align, gap: 8 }}>
            <div style={{ display: "flex", fontFamily: rtl ? "Vazirmatn" : "Fredoka", fontWeight: rtl ? 800 : 700, fontSize: rtl ? 84 : 92, lineHeight: 1.1 }}>
              {text(t.person.name, 84, 800)}
            </div>
            <div style={{ display: "flex", fontSize: 38, color: COLORS.lilac, fontWeight: rtl ? 400 : 600 }}>{text(t.person.role, 38, 400)}</div>
          </div>

          <div style={{ fontFamily: "Nunito", fontWeight: 600, fontSize: 26, color: COLORS.lilac, opacity: 0.9 }}>{url}</div>
        </div>

        {/* Impact card */}
        <div
          style={{
            width: 330,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 30,
            padding: "40px 36px",
            borderRadius: 40,
            background: COLORS.sun,
            color: COLORS.plum,
          }}
        >
          {t.impact.items.map((item) => (
            <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: align }}>
              <div style={{ display: "flex", fontFamily: rtl ? "Vazirmatn" : "Fredoka", fontWeight: rtl ? 800 : 700, fontSize: 52, lineHeight: 1.1 }}>
                {text(`${item.prefix}${number.format(item.value)}${item.suffix}`.trim(), 52, 800)}
              </div>
              <div style={{ display: "flex", fontSize: 22, fontWeight: rtl ? 400 : 600 }}>{text(item.label, 22, 400, true)}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fredoka", data: heading, weight: 700, style: "normal" },
        { name: "Nunito", data: body, weight: 600, style: "normal" },
        { name: "Vazirmatn", data: persian, weight: 400, style: "normal" },
        { name: "Vazirmatn", data: persianBold, weight: 800, style: "normal" },
      ],
    },
  );
}
