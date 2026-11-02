import { describe, expect, it } from "vitest";
import { defaultLocale, dirOf, hasLocale, locales, otherLocale } from "./i18n";

// describe() groups related tests; it() is one test; expect(actual).toBe(expected) is the check.

describe("locales", () => {
  it("supports exactly Persian and English", () => {
    // toEqual compares contents (arrays, objects); toBe compares single values.
    expect(locales).toEqual(["fa", "en"]);
  });

  it("defaults to English", () => {
    expect(defaultLocale).toBe("en");
  });
});

describe("hasLocale", () => {
  it("accepts the supported locales", () => {
    expect(hasLocale("fa")).toBe(true);
    expect(hasLocale("en")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(hasLocale("de")).toBe(false);
    expect(hasLocale("")).toBe(false);
    // URLs are case-sensitive, so /FA/ is not a valid locale prefix.
    expect(hasLocale("FA")).toBe(false);
  });
});

describe("dirOf", () => {
  it("is right-to-left for Persian", () => {
    expect(dirOf("fa")).toBe("rtl");
  });

  it("is left-to-right for English", () => {
    expect(dirOf("en")).toBe("ltr");
  });
});

describe("otherLocale", () => {
  it("swaps between the two languages", () => {
    expect(otherLocale("fa")).toBe("en");
    expect(otherLocale("en")).toBe("fa");
  });
});
