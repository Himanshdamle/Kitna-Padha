console.log("🔥 PW Friends Extension connected!");
console.log("( V1.0 )");

function scrapeStats() {
  const weeklyXP = document.querySelector(".div2-CFqxQS")?.textContent.trim();

  const currentStreak = document
    .querySelector(".streakCount-OM16rw")
    ?.textContent.trim();

  if (!weeklyXP || !currentStreak) {
    return false;
  }

  updateStats(Number(weeklyXP), Number(currentStreak));

  return true;
}

if (!scrapeStats()) {
  const observer = new MutationObserver(() => {
    if (scrapeStats()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
