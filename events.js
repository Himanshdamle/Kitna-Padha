function groupSidebarBtn() {
  const dom = document.querySelector("#pw-friends-group");

  dom.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "openFriendsGroup",
    });
  });
}

async function getKitnaId(token) {
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

  return kitnaId;
}

async function getUserData(kitnaId, token) {
  const userResponse = await fetch(
    `https://kitnapadhabackend-production.up.railway.app/users/${encodeURIComponent(kitnaId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (userResponse.status === 401) {
    await chrome.storage.local.clear();
    loadDOM();
    return;
  }

  if (userResponse.status === 404) {
    return;
  }

  if (!userResponse.ok) {
    throw new Error("Search failed");
  }

  const user = await userResponse.json();

  return user;
}

async function updateStreak_XP(kitna_id, token, updated) {
  const response = await fetch(
    `https://kitnapadhabackend-production.up.railway.app/users/${kitna_id}/stats`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(updated),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  loadDOM();
}

async function updateStats(newWeeklyXP, currentStreak) {
  try {
    const { token } = await chrome.storage.local.get("token");

    const kitnaId = await getKitnaId(token);
    const user = await getUserData(kitnaId, token);

    let { all_time_xp, weekly_xp, highest_streak } = user;

    if (newWeeklyXP >= weekly_xp) {
      const gained_xp = newWeeklyXP - weekly_xp;

      all_time_xp += gained_xp;
    } else {
      all_time_xp += newWeeklyXP;
    }

    const update = {
      weekly_xp: newWeeklyXP,
      all_time_xp,

      current_streak: currentStreak,
      highest_streak: Math.max(currentStreak, highest_streak),
    };

    await updateStreak_XP(kitnaId, token, update);

    console.log("Stats updated:", update);
  } catch (error) {
    console.error("Failed to update stats:", error);
  }
}
