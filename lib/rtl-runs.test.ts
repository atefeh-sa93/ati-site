import { describe, expect, it } from "vitest";
import fa from "@/app/[lang]/dictionaries/fa.json";
import { rtlRuns } from "./rtl-runs";

// Built from its code point so the invisible character is unmistakable in the test.
const ZWNJ = String.fromCodePoint(0x200c);

describe("rtlRuns", () => {
  it("makes one run per Persian word", () => {
    expect(rtlRuns("مهندس ارشد")).toEqual([
      { latin: false, pieces: ["مهندس"] },
      { latin: false, pieces: ["ارشد"] },
    ]);
  });

  it("keeps a ZWNJ-joined word in one run, split into its pieces", () => {
    expect(rtlRuns(`تجربهٔ حرفه${ZWNJ}ای`)).toEqual([
      { latin: false, pieces: ["تجربهٔ"] },
      { latin: false, pieces: ["حرفه", "ای"] },
    ]);
  });

  it("keeps consecutive Latin words together, in reading order", () => {
    expect(rtlRuns("بهبود Core Web Vitals")).toEqual([
      { latin: false, pieces: ["بهبود"] },
      { latin: true, pieces: ["Core Web Vitals"] },
    ]);
  });

  it("starts a new Latin run after a Persian word", () => {
    expect(rtlRuns("React و Next.js")).toEqual([
      { latin: true, pieces: ["React"] },
      { latin: false, pieces: ["و"] },
      { latin: true, pieces: ["Next.js"] },
    ]);
  });

  it("splits a leading + off the number", () => {
    expect(rtlRuns("+۷ سال")).toEqual([
      { latin: false, pieces: ["+", "۷"] },
      { latin: false, pieces: ["سال"] },
    ]);
    expect(rtlRuns("+۱M")).toEqual([{ latin: false, pieces: ["+", "۱M"] }]);
  });

  it("ignores extra spaces instead of drawing empty words", () => {
    expect(rtlRuns(" مهندس  ارشد ")).toEqual([
      { latin: false, pieces: ["مهندس"] },
      { latin: false, pieces: ["ارشد"] },
    ]);
  });

  it("never produces an empty piece for the real Persian card text", () => {
    const texts = [
      fa.hero.badge,
      fa.person.name,
      fa.person.role,
      ...fa.impact.items.flatMap((item) => [item.label, `${item.prefix}${item.value}${item.suffix}`.trim()]),
    ];
    for (const text of texts) {
      for (const run of rtlRuns(text)) {
        expect(run.pieces.every((piece) => piece.length > 0), `empty piece in "${text}"`).toBe(true);
      }
    }
  });
});
