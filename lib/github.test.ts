import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getContributionLevels } from "./github";

/*
 * getContributionLevels talks to GitHub with fetch() and reads GITHUB_TOKEN.
 * Tests must not hit the real network (slow, flaky, needs a token), so:
 * - vi.stubGlobal replaces fetch with a fake (a "mock") whose answer each test chooses,
 * - vi.stubEnv sets or clears the token,
 * - vi.spyOn(console, "warn") records warnings instead of printing them.
 */

// A GraphQL answer shaped like GitHub's: weeks of days, each with a contribution level.
function calendar(levels: string[]) {
  const weeks = [];
  for (let i = 0; i < levels.length; i += 7) {
    weeks.push({ contributionDays: levels.slice(i, i + 7).map((contributionLevel) => ({ contributionLevel })) });
  }
  return { data: { user: { contributionsCollection: { contributionCalendar: { weeks } } } } };
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

let fetchMock: ReturnType<typeof vi.fn>;
let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("GITHUB_TOKEN", "test-token");
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  // Put the real fetch, env and console back so tests can't affect each other.
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("getContributionLevels", () => {
  it("uses sample data without calling GitHub when there is no token", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");

    const result = await getContributionLevels("atefeh-sa93");

    expect(result.live).toBe(false);
    expect(result.levels).toHaveLength(28);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("asks GitHub's GraphQL API for the user's calendar", async () => {
    fetchMock.mockResolvedValue(json(calendar(Array(28).fill("NONE"))));

    await getContributionLevels("atefeh-sa93");

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.github.com/graphql");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("bearer test-token");
    expect(JSON.parse(init.body).variables).toEqual({ login: "atefeh-sa93" });
  });

  it("maps GitHub's level names to 0–4 and keeps only the last 28 days", async () => {
    const older = Array(7).fill("FOURTH_QUARTILE"); // a week that should be cut off
    const recent = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE", "NONE", "NONE"];
    fetchMock.mockResolvedValue(json(calendar([...older, ...recent, ...recent, ...recent, ...recent])));

    const result = await getContributionLevels("atefeh-sa93");

    expect(result.live).toBe(true);
    expect(result.levels).toHaveLength(28);
    expect(result.levels.slice(0, 7)).toEqual([0, 1, 2, 3, 4, 0, 0]);
    expect(warn).not.toHaveBeenCalled();
  });

  it("treats an unknown level name as 0", async () => {
    fetchMock.mockResolvedValue(json(calendar([...Array(27).fill("NONE"), "SOMETHING_NEW"])));

    const result = await getContributionLevels("atefeh-sa93");

    expect(result.levels.at(-1)).toBe(0);
  });

  it("falls back to sample data and warns on an HTTP error", async () => {
    fetchMock.mockResolvedValue(json({ message: "Bad credentials" }, 401));

    const result = await getContributionLevels("atefeh-sa93");

    expect(result.live).toBe(false);
    expect(result.levels).toHaveLength(28);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("HTTP 401"));
  });

  it("falls back to sample data and warns when the network fails", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    const result = await getContributionLevels("atefeh-sa93");

    expect(result.live).toBe(false);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("fetch failed"));
  });

  it("falls back to sample data when GitHub returns no calendar", async () => {
    // e.g. a misspelled username: GraphQL answers 200 with user: null and an errors list.
    fetchMock.mockResolvedValue(json({ data: { user: null }, errors: [{ message: "Could not resolve to a User" }] }));

    const result = await getContributionLevels("no-such-user");

    expect(result.live).toBe(false);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("empty response"));
  });
});
