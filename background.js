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
