const LATIN = /^[\x00-\x7F]+$/;
const ZWNJ = String.fromCodePoint(0x200c); // zero-width non-joiner (نیم‌فاصله)

/** One word (or Latin phrase) of a right-to-left line, split into the pieces drawn side by side. */
export type RtlRun = { latin: boolean; pieces: string[] };

/**
 * Splits Persian text into the runs app/[lang]/og.png lays out right to left
 * (Satori, which draws the image, only knows left-to-right):
 * - consecutive Latin words stay together and in reading order ("Core Web Vitals"),
 * - a word joined by a ZWNJ ("حرفه‌ای") is one run of several pieces,
 * - a leading "+" ("+۷") is its own piece so it lands right of the number, as in the browser.
 */
export function rtlRuns(text: string): RtlRun[] {
  const runs: RtlRun[] = [];
  // filter(Boolean) drops the empty strings that double or trailing spaces leave behind.
  for (const word of text.split(" ").filter(Boolean)) {
    const last = runs.at(-1);
    if (LATIN.test(word)) {
      if (last?.latin) last.pieces[0] += ` ${word}`;
      else runs.push({ latin: true, pieces: [word] });
    } else {
      runs.push({ latin: false, pieces: word.startsWith("+") ? ["+", word.slice(1)] : word.split(ZWNJ) });
    }
  }
  return runs;
}
