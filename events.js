function groupSidebarBtn() {
  const dom = document.querySelector("#pw-friends-group");

  dom.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "openFriendsGroup",
    });
  });
}

async function updateStats(weeklyXP, currentStreak) {
  try {
    const { token } = await chrome.storage.local.get("token");

    if (!token) {
      loadDOM();
      throw new Error("No authentication token found");
    }

    // Get logged-in user's identity from the backend
    const meResponse = await fetch(
      "https://kitnapadhabackend-production.up.railway.app/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!meResponse.ok) {
      throw new Error("Authentication failed");
    }

    const meData = await meResponse.json();

    const kitnaId = meData.kitnaId;

    const response = await fetch(
      `https://kitnapadhabackend-production.up.railway.app/users/${kitnaId}/stats`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          weekly_xp: weeklyXP,
          all_time_xp: weeklyXP,

          current_streak: currentStreak,
          highest_streak: currentStreak,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    loadDOM();

    console.log("Stats updated:", data);
  } catch (error) {
    console.error("Failed to update stats:", error);
  }
}
