import { cacheLife } from "next/cache";

export type Level = 0 | 1 | 2 | 3 | 4;

const LEVELS: Record<string, Level> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// Shown when no GITHUB_TOKEN is set (local dev) or the API call fails.
const SAMPLE: Level[] = [0, 1, 0, 2, 1, 0, 3, 1, 0, 2, 4, 1, 2, 3, 1, 0, 2, 0, 3, 1, 0, 2, 4, 3, 1, 0, 2, 4];

type CalendarResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: { contributionDays: { contributionLevel: string }[] }[];
        };
      };
    };
  };
};

/**
 * Contribution levels for the last 28 days.
 * Cached for a few hours, so the page stays static and GitHub isn't hit on every request.
 */
export async function getContributionLevels(login: string): Promise<{ levels: Level[]; live: boolean }> {
  "use cache";
  cacheLife("hours");

  const token = process.env.GITHUB_TOKEN;
  if (!token) return { levels: SAMPLE, live: false };

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar { weeks { contributionDays { contributionLevel } } }
            }
          }
        }`,
        variables: { login },
      }),
    });
    if (!res.ok) return { levels: SAMPLE, live: false };

    const json = (await res.json()) as CalendarResponse;
    const weeks = json.data?.user?.contributionsCollection.contributionCalendar.weeks ?? [];
    const days = weeks.flatMap((w) => w.contributionDays).slice(-28);
    if (days.length === 0) return { levels: SAMPLE, live: false };

    return { levels: days.map((d) => LEVELS[d.contributionLevel] ?? 0), live: true };
  } catch {
    return { levels: SAMPLE, live: false };
  }
}
