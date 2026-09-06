const token = localStorage.getItem("TOKEN");
const clientId = "5eb393ee95fab7468a79d189";

async function scrapeStats() {
  const weekly_xp = await pwWeeklyXp(token, clientId);
  const allTimeXpData = await pwAllTimeXpData(token, clientId);
  const streak = await pwStreak(token, clientId);

  updateStats(
    {
      pw_weekly_xp: weekly_xp,
      pw_all_time_xp: allTimeXpData.totalXP,
    },

    {
      current_level: allTimeXpData.currentLevel,
      highest_level: allTimeXpData.highestLevel,
    },

    { streak: streak },
  );
}

scrapeStats();
