import {
  getFriendRequest,
  getSearchedFriend,
  getFriend,
  placeTopThree,
  lowerLearderboard,
} from "./dom.js";

// Get JWT token
const { token } = await chrome.storage.local.get("token");

if (!token) {
  window.location.href = "login.html";
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
  await chrome.storage.local.clear();
  window.location.href = "login.html";
  throw new Error("Authentication failed");
}

const meData = await meResponse.json();

const kitnaId = meData.kitnaId;

let currentProfile = {
  kitnaId,
  isOwnProfile: true,
};

export function triggerAllEvents() {
  logoutBtnEvent();
  updateNavPanel();
  searchFriendInput();
  checkFriendReqList();
  profileBtnEvent();
  setDisplayName();
  updateUserProfileEvent();
  uploadPfpEvent();
  refreshLeaderboardEvent();
}

/* =========================================================
   LOGOUT
========================================================= */

function logoutBtnEvent() {
  const btn = document.querySelector("#logout-btn");

  btn.addEventListener("click", async () => {
    await chrome.storage.local.clear();
    window.location.href = "login.html";
  });
}

/* =========================================================
   FRIENDS
========================================================= */

const alreadyAdded = [];

export async function allFriends() {
  const friendList = document.getElementById("friends-list");
  const message = document.querySelector("#no-friends-message");

  try {
    const response = await fetch(
      `https://kitnapadhabackend-production.up.railway.app/friends/${encodeURIComponent(kitnaId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 401) {
      await chrome.storage.local.clear();
      window.location.href = "login.html";
      return;
    }

    if (response.status === 404) {
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch friends");
    }

    const friends = await response.json();

    if (friends.length === 0) {
      message.style.display = "block";
    } else {
      message.style.display = "none";

      friends.forEach((friend) => {
        if (alreadyAdded.includes(friend.id)) return;

        alreadyAdded.push(friend.id);

        const dom = getFriend(friend);

        friendList.append(dom);
      });
    }
  } catch (error) {
    console.error("FRIENDS ERROR:", error);
  }
}

allFriends();

/* =========================================================
   SEARCH FRIEND
========================================================= */

const searchInput = document.getElementById("search-friend-id");
const searchResult = document.getElementById("friend-search-result");
const friendList = document.getElementById("friends-list");

const friendRequestListWrapper = document.getElementById(
  "friend-request-list-wrapper",
);

function searchFriendInput() {
  searchInput.addEventListener("input", () => {
    const searchedKitnaId = searchInput.value.trim();

    if (searchedKitnaId.length === 0) {
      searchResult.style.display = "none";
      friendList.style.display = "block";
      return;
    }

    if (searchedKitnaId.length < 11) return;

    searchResult.innerHTML = "";

    searchFriend(searchedKitnaId);
  });
}

/* =========================================================
   FIND USER
========================================================= */

async function findUser(kitnaIdToFind) {
  try {
    const response = await fetch(
      `https://kitnapadhabackend-production.up.railway.app/users/${encodeURIComponent(kitnaIdToFind)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 401) {
      await chrome.storage.local.clear();
      window.location.href = "login.html";
      return;
    }

    if (response.status === 404) {
      alert("User not found!");
      return;
    }

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const user = await response.json();

    return user;
  } catch (error) {
    console.error("FIND USER ERROR:", error);
  }
}

/* =========================================================
   SEARCH FRIEND
========================================================= */

async function searchFriend(friendKitnaId, selfSearching = false) {
  if (kitnaId === friendKitnaId || selfSearching) {
    alert("You cannot add yourself!");
    return;
  }

  try {
    const user = await findUser(friendKitnaId);

    if (!user) return;

    searchResult.style.display = "block";
    friendList.style.display = "none";
    friendRequestListWrapper.style.display = "none";

    const check = await fetch(
      `https://kitnapadhabackend-production.up.railway.app/friend-requests/status/${encodeURIComponent(
        kitnaId,
      )}/${encodeURIComponent(friendKitnaId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (check.status === 401) {
      await chrome.storage.local.clear();
      window.location.href = "login.html";
      return;
    }

    if (!check.ok) {
      throw new Error("Failed to check friendship status");
    }

    const relationship = await check.json();

    const isAlreadyRequested = relationship.status !== "none";

    searchResult.append(getSearchedFriend(user, isAlreadyRequested));
  } catch (error) {
    console.error("SEARCH FRIEND ERROR:", error);
  }
}

/* =========================================================
   SEND FRIEND REQUEST
========================================================= */

export function sendFriendRequestEvent(sendReqBtn, isAlreadyRequested) {
  sendReqBtn.addEventListener("click", async () => {
    if (isAlreadyRequested) return;

    const receiverKitnaId = sendReqBtn.getAttribute("data-kitna-id");

    const result = await sendFriendRequest(receiverKitnaId);

    if (result) {
      sendReqBtn.style.cursor = "not-allowed";
      sendReqBtn.style.opacity = "50%";
      sendReqBtn.disabled = true;
    }
  });
}

async function sendFriendRequest(receiverKitnaId) {
  try {
    const response = await fetch(
      "https://kitnapadhabackend-production.up.railway.app/friend-requests",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          receiverKitnaId,
        }),
      },
    );

    if (response.status === 401) {
      await chrome.storage.local.clear();
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      console.error("FRIEND REQUEST ERROR:", data.error);
      return;
    }

    return data;
  } catch (error) {
    console.error("NETWORK ERROR:", error);
  }
}

/* =========================================================
   FRIEND REQUEST LIST
========================================================= */

const messageBox = document.getElementById("no-requested-message-box");

const friendRequestList = document.getElementById("friend-request-list");

function checkFriendReqList() {
  const btn = document.getElementById("check-friend-request");

  const closeSvg = document.getElementById("close-svg-wrapper");

  const heartSvg = document.getElementById("heart-svg-wrapper");

  const alreadyPresent = [];

  let closeList = false;

  btn.addEventListener("click", async () => {
    closeList = !closeList;

    if (closeList) {
      friendList.style.display = "none";
      searchResult.style.display = "none";

      friendRequestListWrapper.style.display = "block";

      closeSvg.style.display = "block";
      heartSvg.style.display = "none";

      const requestedList = await listAllFriendRequest();

      if (!requestedList || requestedList.length === 0) {
        messageBox.style.display = "block";
        friendRequestList.style.display = "none";
      } else {
        messageBox.style.display = "none";
        friendRequestList.style.display = "block";

        requestedList.forEach((requested) => {
          if (alreadyPresent.includes(requested.id)) return;

          alreadyPresent.push(requested.id);

          const dom = getFriendRequest(requested);

          friendRequestList.append(dom);
        });
      }
    } else {
      friendList.style.display = "block";
      searchResult.style.display = "none";
      friendRequestListWrapper.style.display = "none";

      closeSvg.style.display = "none";
      heartSvg.style.display = "block";
    }
  });
}

/* =========================================================
   ACCEPT / REJECT FRIEND REQUEST
========================================================= */

export function requestedBtn(acceptedBtn, rejectedBtn) {
  acceptedBtn.addEventListener("click", async () => {
    const requestId = acceptedBtn.getAttribute("data-request-id");

    const success = await handleFriendRequest(requestId, true);

    if (success) {
      const wrapper = rejectedBtn.closest(".group");

      wrapper.remove();

      if (friendRequestList.innerHTML === "") {
        messageBox.style.display = "block";
      }

      await allFriends();
    }
  });

  rejectedBtn.addEventListener("click", async () => {
    const requestId = rejectedBtn.getAttribute("data-request-id");

    const success = await handleFriendRequest(requestId, false);

    if (success) {
      const wrapper = rejectedBtn.closest(".group");

      wrapper.remove();

      if (friendRequestList.innerHTML === "") {
        messageBox.style.display = "block";
      }
    }
  });
}

/* =========================================================
   GET FRIEND REQUESTS
========================================================= */

async function listAllFriendRequest() {
  try {
    const response = await fetch(
      `https://kitnapadhabackend-production.up.railway.app/friend-requests/${encodeURIComponent(kitnaId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 401) {
      await chrome.storage.local.clear();
      window.location.href = "login.html";
      return [];
    }

    const data = await response.json();

    if (!response.ok) {
      console.error("FRIEND REQUEST LIST ERROR:", data.error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("NETWORK ERROR:", error);
    return [];
  }
}

/* =========================================================
   HANDLE FRIEND REQUEST
========================================================= */

async function handleFriendRequest(requestId, isAccept = true) {
  try {
    const url = isAccept
      ? `https://kitnapadhabackend-production.up.railway.app/friend-requests/${requestId}/accept`
      : `https://kitnapadhabackend-production.up.railway.app/friend-requests/${requestId}`;

    const response = await fetch(url, {
      method: isAccept ? "POST" : "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      await chrome.storage.local.clear();
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      console.error("HANDLE REQUEST ERROR:", data.error);
      return;
    }

    return data.message;
  } catch (error) {
    console.error("NETWORK ERROR:", error);
  }
}

/* =========================================================
   PROFILE
========================================================= */

const leaderboardWrapper = document.getElementById("leaderboard-wrapper");

const userProfile = document.getElementById("user-profile");

function profileBtnEvent() {
  const profileBtn = document.getElementById("profile-button");

  const backBtn = document.getElementById("profile-back-btn");

  let isOpen = false;

  profileBtn.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      currentProfile = {
        kitnaId,
        isOwnProfile: true,
      };

      openProfile(kitnaId);

      leaderboardWrapper.style.display = "none";
      userProfile.style.display = "block";
    } else {
      leaderboardWrapper.style.display = "block";
      userProfile.style.display = "none";
    }
  });

  backBtn.addEventListener("click", () => {
    isOpen = false;

    leaderboardWrapper.style.display = "block";
    userProfile.style.display = "none";
  });
}

const sizer = document.getElementById("display-name-sizer");
const displayNameInput = document.getElementById("display-name");
function setDisplayNameSize() {
  sizer.textContent = displayNameInput.value || "Display name";

  displayNameInput.style.width = `${sizer.offsetWidth + 2}px`;
}

function setDisplayName() {
  displayNameInput.addEventListener("input", setDisplayNameSize);
}

/* =========================================================
   VIEW FRIEND PROFILE
========================================================= */

export function viewFriendProfileEvent(btn) {
  btn.addEventListener("click", () => {
    const friendKitnaId = btn.getAttribute("data-kitna-id");

    openProfile(friendKitnaId);

    leaderboardWrapper.style.display = "none";
    userProfile.style.display = "block";
  });
}

/* =========================================================
   OPEN PROFILE
========================================================= */

async function openProfile(profileKitnaId) {
  const isOwnProfile = profileKitnaId === kitnaId;

  currentProfile = {
    kitnaId: profileKitnaId,
    isOwnProfile,
  };

  await fillUserProfile(profileKitnaId);

  setProfileMode(isOwnProfile);
}

/* =========================================================
   FILL PROFILE
========================================================= */

async function fillUserProfile(profileKitnaId) {
  try {
    const userData = await findUser(profileKitnaId);

    if (!userData) {
      console.error("User not found:", profileKitnaId);

      return;
    }

    // Header
    document.querySelector("#display-name").value = `${userData.display_name}`;
    setDisplayNameSize();

    // Username
    document.querySelector("#display-username").textContent =
      `@${userData.username}`;

    // Kitna ID
    document.querySelector("#kp-id").textContent = `ID: ${userData.kitna_id}`;

    // Profile picture
    document.querySelector("#display-pfp").src = userData.pfp
      ? `https://kitnapadhabackend-production.up.railway.app${userData.pfp}`
      : "assets/default_pfp.png";

    // Streak
    document.querySelector("#current-streak").textContent =
      ` ${userData.current_streak}`;

    document.querySelector("#highest-streak").textContent =
      ` ${userData.highest_streak}`;

    // XP
    document.querySelector("#weekly-xp").textContent =
      ` ${userData.weekly_xp.toLocaleString("en-IN")}`;

    document.querySelector("#all-time-xp").textContent =
      ` ${userData.all_time_xp.toLocaleString("en-IN")}`;

    // Profile information
    document.querySelector("#thoughts").value = userData.thoughts || "";

    document.querySelector("#exams").value = userData.exams || "";

    document.querySelector("#targeting").value = userData.targeting || "";
  } catch (error) {
    console.error("FAILED TO LOAD PROFILE:", error);
  }
}

/* =========================================================
   PROFILE MODE
========================================================= */

function setProfileMode(isOwnProfile) {
  const profilePicture = document.querySelector("#profile-picture");

  const profilePictureLabel = document.querySelector(
    'label[for="profile-picture"]',
  );

  const changeOverlay = profilePictureLabel.querySelector("span");

  const thoughts = document.querySelector("#thoughts");

  const exams = document.querySelector("#exams");

  const targeting = document.querySelector("#targeting");

  const displayName = document.querySelector("#display-name");

  const saveChanges = document.querySelector("#save-changes");

  if (isOwnProfile) {
    // Enable PFP changing
    profilePicture.disabled = false;

    profilePictureLabel.classList.add("cursor-pointer");

    profilePictureLabel.classList.remove("cursor-default");

    changeOverlay.classList.remove("hidden");

    saveChanges.classList.remove("hidden");

    // Enable editing
    thoughts.readOnly = false;
    exams.readOnly = false;
    targeting.readOnly = false;
    displayName.readOnly = false;
  } else {
    // Disable PFP changing
    profilePicture.disabled = true;

    profilePictureLabel.classList.remove("cursor-pointer");

    profilePictureLabel.classList.add("cursor-default");

    changeOverlay.classList.add("hidden");

    saveChanges.classList.add("hidden");

    // Make fields read-only
    thoughts.readOnly = true;
    exams.readOnly = true;
    targeting.readOnly = true;
    displayName.readOnly = true;
  }
}

/* =========================================================
   UPDATE PROFILE
========================================================= */

function updateUserProfileEvent() {
  const saveChanges = document.querySelector("#save-changes");

  let startSaving = false;

  saveChanges.addEventListener("click", async () => {
    if (startSaving) return;

    startSaving = true;

    try {
      await updateUserProfile();
    } finally {
      startSaving = false;
    }
  });
}

async function updateUserProfile() {
  try {
    const thoughts = document.querySelector("#thoughts").value;

    const exams = document.querySelector("#exams").value;

    const targeting = document.querySelector("#targeting").value;

    const response = await fetch(
      `https://kitnapadhabackend-production.up.railway.app/users/${encodeURIComponent(kitnaId)}/profile`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          thoughts,
          exams,
          targeting,
          display_name: displayNameInput.value,
        }),
      },
    );

    if (response.status === 401) {
      await chrome.storage.local.clear();
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error("FAILED TO SAVE PROFILE:", error);
  }
}

/* =========================================================
   LEADERBOARD
========================================================= */

async function refreshLeaderboardEvent() {
  const leaderboard = await loadLeaderboard(kitnaId);

  const leaderboardPodium = document.getElementById("leaderboard-podium");

  const lowerLearderboardWrapper = document.getElementById("lower-leaderboard");

  const message = document.getElementById("no-friends-message-leaderboard");

  if (!leaderboard || leaderboard.length <= 1) {
    message.style.display = "block";

    leaderboardPodium.style.display = "none";

    lowerLearderboardWrapper.style.display = "none";

    return;
  }

  message.style.display = "none";

  leaderboardPodium.style.display = "flex";

  lowerLearderboardWrapper.style.display = "none";

  const leaderboardLength = leaderboard.length;

  const totalIteration = leaderboardLength < 3 ? leaderboardLength : 3;

  for (let index = 0; index < totalIteration; index++) {
    const student = leaderboard[index];

    if (!student) return;

    const dom = placeTopThree(student, index + 1);

    leaderboardPodium.append(dom);
  }

  const leftStudents = leaderboard.slice(3, leaderboardLength);

  if (leftStudents.length !== 0) {
    lowerLearderboardWrapper.style.display = "block";

    leftStudents.forEach((student, index) => {
      const dom = lowerLearderboard(student, index + 4);

      lowerLearderboardWrapper.append(dom);
    });
  }
}

async function loadLeaderboard(profileKitnaId) {
  try {
    const response = await fetch(
      `https://kitnapadhabackend-production.up.railway.app/leaderboard/${encodeURIComponent(profileKitnaId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 401) {
      await chrome.storage.local.clear();
      window.location.href = "login.html";
      return [];
    }

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }

    const leaderboard = await response.json();

    return leaderboard;
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);

    return [];
  }
}

/* =========================================================
   NAV PANEL
========================================================= */

async function updateNavPanel() {
  const userData = await findUser(kitnaId);

  if (!userData) return;

  document.querySelector("#streak-value").textContent = userData.current_streak;

  document.querySelector("#xp-value").textContent = userData.weekly_xp;

  const pfpStr = userData.pfp
    ? `https://kitnapadhabackend-production.up.railway.app${userData.pfp}`
    : "assets/default_pfp.png";

  document.querySelector("#profile-image").src = pfpStr;
}

/* =========================================================
   PROFILE PICTURE
========================================================= */

function uploadPfpEvent() {
  const profilePicture = document.querySelector("#profile-picture");

  const profilePicturePreview = document.querySelector("#display-pfp");

  profilePicture.addEventListener("change", async () => {
    const file = profilePicture.files[0];

    if (!file) return;

    // Instant preview
    profilePicturePreview.src = URL.createObjectURL(file);

    await uploadPFP(file);

    updateNavPanel();
  });
}

async function uploadPFP(file) {
  try {
    if (!kitnaId) {
      console.error("No kitnaId found");

      return;
    }

    const formData = new FormData();

    formData.append("pfp", file);

    const response = await fetch(
      `https://kitnapadhabackend-production.up.railway.app/users/${encodeURIComponent(kitnaId)}/pfp`,
      {
        method: "PATCH",

        // IMPORTANT:
        // Do NOT manually set Content-Type here.
        // Browser adds the multipart/form-data boundary.
        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      },
    );

    if (response.status === 401) {
      await chrome.storage.local.clear();
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error("FAILED TO UPLOAD PFP:", error);
  }
}
