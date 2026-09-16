chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "openFriendsGroup") {
    chrome.storage.local.get("kitnaAccount", (result) => {
      if (result.kitnaAccount) {
        chrome.tabs.create({
          url: chrome.runtime.getURL("group.html"),
        });
      } else {
        chrome.tabs.create({
          url: chrome.runtime.getURL("login.html"),
        });
      }
    });
  }
});

// Is user online or offline in pw
// Is user online or offline in PW

let currentPWState = false;
let presenceInterval = null;

async function sendPWPresence(online) {
  const { token } = await chrome.storage.local.get("token");

  if (!token) {
    window.location.href = "login.html";
    throw new Error("No authentication token found");
  }

  try {
    await fetch(
      "https://kitnapadhabackend-production.up.railway.app/presence/pw",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          online,
        }),
      },
    );
  } catch (error) {
    console.error("Failed to update PW presence:", error);
  }
}

function startPresenceHeartbeat() {
  if (presenceInterval) return;

  // Tell backend immediately
  sendPWPresence(true);

  // Then every 30 seconds.
  // Reason: if chrome crashes
  presenceInterval = setInterval(() => {
    sendPWPresence(true);
  }, 30000);
}

function stopPresenceHeartbeat() {
  if (!presenceInterval) return;

  clearInterval(presenceInterval);
  presenceInterval = null;

  // Tell backend immediately
  sendPWPresence(false);
}

async function updatePWState(windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    currentPWState = false;
    stopPresenceHeartbeat();
    return;
  }

  const window = await chrome.windows.get(windowId, {
    populate: true,
  });

  const activeTab = window.tabs?.find((tab) => tab.active);

  const onPW = activeTab?.url?.includes("pw.live") ?? false;

  // Nothing changed → don't restart anything
  if (onPW === currentPWState) return;

  currentPWState = onPW;

  if (currentPWState) {
    startPresenceHeartbeat();
  } else {
    stopPresenceHeartbeat();
  }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updatePWState(activeInfo.windowId);
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  await updatePWState(windowId);
});
