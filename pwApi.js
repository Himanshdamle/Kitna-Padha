async function pwWeeklyXp(pwAuth, clientId) {
  try {
    const res = await fetch(
      "https://api.penpencil.co/engagement/learn-to-earn/weekly-user-xp/634fb54c0c56610011d10202?startDate=2026-08-22T18:30:00.000Z&endDate=2026-09-06T18:29:59.000Z",

      {
        headers: {
          accept: "*/*",
          authorization: `Bearer ${pwAuth}`,
          "client-id": clientId,
          "client-type": "WEB",
          "content-type": "application/json",
          randomid: crypto.randomUUID(),
          "x-sdk-version": "0.0.28",
        },

        referrer: "https://www.pw.live/",
        method: "GET",
        mode: "cors",
        credentials: "omit",
      },
    );

    if (!res.ok) {
      throw new Error(`PW API returned ${res.status}`);
    }

    const body = await res.json();

    return body.data.weeklyTotalXP;
  } catch (error) {
    console.error("Failed to fetch PW weekly XP:", error);
    return null;
  }
}

async function pwAllTimeXpData(pwAuth, clientId) {
  try {
    const res = await fetch(
      "https://api.penpencil.co/engagement/learn-to-earn/profile-data/634fb88abc72420011da2fe4?startDate=2026-08-23T18:30:00.000Z&endDate=2026-09-06T18:29:59.000Z",

      {
        headers: {
          accept: "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
          authorization: `Bearer ${pwAuth}`,
          "client-id": clientId,
          "client-type": "WEB",
          "content-type": "application/json",
          priority: "u=1, i",
          randomid: crypto.randomUUID(),
          "x-sdk-version": "0.0.28",
        },

        referrer: "https://www.pw.live/",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      },
    );

    if (!res.ok) {
      throw new Error(`PW API returned ${res.status}`);
    }

    const body = await res.json();

    return body.data;
  } catch (error) {
    console.error("Failed to fetch PW weekly XP:", error);
    return null;
  }
}

async function pwStreak(pwAuth) {
  try {
    const res = await fetch(
      "https://api.penpencil.co/engagement/streak/milestone-info?requiresGoalConfig=true",

      {
        headers: {
          accept: "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
          authorization: `Bearer ${pwAuth}`,
          "client-id": clientId,
          "client-type": "WEB",
          "content-type": "application/json",
          priority: "u=1, i",
          randomid: crypto.randomUUID(),
          "x-sdk-version": "0.0.28",
        },

        referrer: "https://www.pw.live/",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      },
    );

    if (!res.ok) {
      throw new Error(`PW API returned ${res.status}`);
    }

    const body = await res.json();

    return body.data.milestoneData.streak;
  } catch (error) {
    console.error("Failed to fetch PW weekly XP:", error);
    return null;
  }
}
