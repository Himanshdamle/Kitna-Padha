import {
  requestedBtn,
  sendFriendRequestEvent,
  viewFriendProfileEvent,
} from "./events.js";

function strToDom(staticHTML) {
  const temp = document.createElement("div");

  temp.innerHTML = staticHTML;

  return temp.firstElementChild;
}

export function getSearchedFriend(friend, isAlreadyRequested) {
  const twClassNotRequested =
    "cursor-pointer hover:scale-105 transition-all duration-250 ease-in-out".split(
      " ",
    );

  const twClassRequested = "cursor-not-allowed opacity-50".split(" ");

  const str = `
    <div
      class="group flex flex-row items-center justify-between w-full rounded-xl p-2"
    >
      <div class="flex items-center gap-3 w-max">

        <div
          class="friend-avatar flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#AFBFFF]/50"
          aria-hidden="true"
        >
          <img
            class="friend-pfp h-full w-full rounded-full object-cover"
          />
        </div>

        <div class="flex flex-col items-start justify-start gap-0.5">
          <span class="friend-name text-xl font-semibold truncate" style="width=90px"></span>

          <span class="friend-xp text-xs font-semibold">
            ${friend.weekly_xp.toLocaleString("en-IN")} XP
          </span>
        </div>

      </div>

      <button
        id="send-friend-request"
        type="button"
        class="rounded-full bg-[#AFBFFF]/80 hover:bg-[#AFBFFF] p-2"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 6.25V23.75M6.25 15H23.75"
            stroke="#0B0045"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

    </div>
  `;

  const dom = strToDom(str);

  // USER DATA → inserted safely
  const nameEl = dom.querySelector(".friend-name");
  const pfpEl = dom.querySelector(".friend-pfp");
  const button = dom.querySelector("#send-friend-request");

  nameEl.textContent = friend.display_name;
  nameEl.style.textAlign = "left";

  pfpEl.src = friend.pfp
    ? `https://kitnapadhabackend-production.up.railway.app${friend.pfp}`
    : "assets/default_pfp.png";

  pfpEl.alt = friend.display_name;

  button.dataset.kitnaId = friend.kitna_id;

  button.setAttribute(
    "aria-label",
    `Send friend request to ${friend.display_name}`,
  );

  if (isAlreadyRequested) {
    button.classList.add(...twClassRequested);
  } else {
    button.classList.add(...twClassNotRequested);
  }

  sendFriendRequestEvent(button, isAlreadyRequested);

  return dom;
}

export function getFriendRequest(requested) {
  const str = `
    <div
      type="button"
      class="group cursor-pointer flex flex-row items-center justify-between w-full p-2"
    >

      <div class="flex items-center gap-3 w-max">

        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#AFBFFF]/50"
          aria-hidden="true"
        >
          <img
            class="friend-request-pfp h-full w-full rounded-full object-cover"
          />
        </div>

        <div class="flex flex-col items-start justify-start gap-0.5">

          <span
            class="friend-request-name text-xl truncate font-semibold"
            style="width: 70px"
          ></span>

          <span
            class="friend-request-xp text-xs font-semibold"
          ></span>

        </div>

      </div>

      <div
        class="relative flex overflow-hidden rounded-full bg-[#5A4BDA]/50"
        role="group"
        aria-label="Friend request actions"
      >

        <span
          class="absolute left-1/2 top-1/2 z-10 h-[120%] w-[1px] -translate-x-1/2 -translate-y-1/2 rotate-[24deg] bg-[#D8DFFF]"
          aria-hidden="true"
        ></span>

        <button
          type="button"
          aria-label="Accept friend request"
          class="flex flex-1 items-center justify-center py-2 px-3.5 cursor-pointer accepted-btn"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5501 18L3.8501 12.3L5.2751 10.875L9.5501 15.15L18.7251 5.97498L20.1501 7.39998L9.5501 18Z"
              fill="#BAFFDE"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Reject friend request"
          class="flex flex-1 items-center justify-center py-2 px-3.5 cursor-pointer rejected-btn"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
              fill="#FFD8D8"
            />
          </svg>
        </button>

      </div>

    </div>
  `;

  const dom = strToDom(str);

  // Safely insert backend data
  const pfp = dom.querySelector(".friend-request-pfp");
  const name = dom.querySelector(".friend-request-name");
  const xp = dom.querySelector(".friend-request-xp");

  pfp.src = requested.pfp
    ? `https://kitnapadhabackend-production.up.railway.app${requested.pfp}`
    : "assets/default_pfp.png";

  pfp.alt = requested.username;

  name.textContent = requested.display_name;
  name.style.textAlign = "left";
  xp.textContent = `${requested.weekly_xp.toLocaleString("en-IN")} XP`;

  const acceptedBtn = dom.querySelector(".accepted-btn");
  const rejectedBtn = dom.querySelector(".rejected-btn");

  acceptedBtn.dataset.requestId = requested.id;
  rejectedBtn.dataset.requestId = requested.id;

  requestedBtn(acceptedBtn, rejectedBtn);

  return dom;
}

export function getFriend(friend) {
  const str = `
    <button
      type="button"
      class="group view-friend-profile cursor-pointer flex flex-row items-center justify-between w-full rounded-xl p-2 transition-colors hover:bg-[#5A4BDA]/20 focus:outline-none focus:ring-2 focus:ring-[#5A4BDA]"
    >

      <div class="flex items-center gap-3 w-max">

        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#AFBFFF]/50"
          aria-hidden="true"
        >
          <img
            class="friend-pfp h-full w-full rounded-full object-cover"
          />
        </div>

        <div class="flex flex-col items-start justify-start gap-0.5">

          <span class="friend-name text-xl font-semibold truncate" style="width: 130px"></span>

          <div
            class="flex flex-row items-center w-max gap-2"
          >
            <div class="flex flex-row gap-0.5 items-center">
              <img
                src="assets/xp.png"
                alt="Study streak"
                class="h-3.5 w-3.5 object-contain"
              />
              <span class="friend-xp text-xs font-semibold"></span>
            </div>

            <div class="bg-[#C2BAFF] rounded-full w-0.5 h-0.5"></div>
                
            <div class="flex flex-row gap-0.5 items-center">
              <img
                src="assets/orange_streak.png"
                alt="Study streak"
                class="h-3.5 w-3.5 object-contain"
              />
              <span class="friend-streak text-xs font-semibold"
                >${friend.current_streak ?? 0}</span
              >
            </div>
          </div>

        </div>

      </div>

    </button>
  `;

  const dom = strToDom(str);

  const pfp = dom.querySelector(".friend-pfp");
  const name = dom.querySelector(".friend-name");
  const xp = dom.querySelector(".friend-xp");

  pfp.src = friend.pfp
    ? `https://kitnapadhabackend-production.up.railway.app${friend.pfp}`
    : "assets/default_pfp.png";

  pfp.alt = friend.display_name;

  name.textContent = friend.display_name;
  name.style.textAlign = "left";
  xp.textContent = `${(friend.weekly_xp ?? 0).toLocaleString("en-IN")}`;

  dom.dataset.kitnaId = friend.kitna_id;

  dom.setAttribute(
    "aria-label",
    `View ${friend.display_name}'s study statistics`,
  );

  viewFriendProfileEvent(dom);

  return dom;
}

export function placeTopThree(student, rank) {
  if (rank > 4) return;

  const str = `
    <div
      class="flex w-[28%] max-w-[145px] flex-col items-center justify-end"
    >

      <button
        class="cursor-pointer flex flex-col gap-1.5 mb-1 items-center justify-center view-friend-profile-btn"
        data-kitna-id="${student.kitna_id}"
      >

        <div
          class="mb-[-4px] flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8DFFF] sm:h-14 sm:w-14"
        >
          <img
            class="student-pfp h-full w-full rounded-full object-cover"
          />
        </div>

        <span
          class="student-name truncate text-xs font-semibold sm:text-sm text-[#D8DFFF]"
          style="width: 100px"
          ></span>

      </button>

      <div
        class="relative flex w-full items-center justify-center rounded-t-xl bg-gradient-to-b from-[#2F2874] to-[#3322C7] text-[#D8DFFF]"
      >

        <span class="rank text-3xl font-bold sm:text-4xl"></span>

        <span
          class="xp absolute top-1 text-center font-medium w-full"
        ></span>

      </div>

    </div>
  `;

  const dom = strToDom(str);

  const pfp = dom.querySelector(".student-pfp");
  const name = dom.querySelector(".student-name");
  const rankEl = dom.querySelector(".rank");
  const xp = dom.querySelector(".xp");
  const levelBar = dom.querySelector(".relative.flex");

  pfp.src = student.pfp
    ? `https://kitnapadhabackend-production.up.railway.app${student.pfp}`
    : "assets/default_pfp.png";

  pfp.alt = student.display_name;

  name.textContent = student.display_name;
  rankEl.textContent = rank;
  xp.textContent = `${student.weekly_xp.toLocaleString("en-IN")} XP`;

  levelBar.style.height = `${250 - 50 * (rank - 1)}px`;

  levelBar.setAttribute("aria-label", `${student.display_name} ranked ${rank}`);

  viewFriendProfileEvent(dom.querySelector(".view-friend-profile-btn"));

  return dom;
}

export function lowerLearderboard(student, rank) {
  const str = `
    <div
      class="flex items-center gap-4 rounded-2xl border border-[#5A4BDA]/20 bg-[#AFBFFF]/5 px-5 py-3"
    >

      <span
        class="rank w-8 text-center text-lg font-bold text-[#B8B0FF]"
      ></span>

      <img
        class="student-pfp h-11 w-11 rounded-full object-cover"
      />

      <div class="w-32 min-w-0">

        <p class="student-name truncate font-semibold text-[#D8DFFF]" style="max-width: 100px"></p>

        <p class="student-xp text-sm text-[#B8B0FF]"></p>

      </div>

    </div>
  `;

  const dom = strToDom(str);

  const rankEl = dom.querySelector(".rank");
  const pfp = dom.querySelector(".student-pfp");
  const name = dom.querySelector(".student-name");
  const xp = dom.querySelector(".student-xp");

  rankEl.textContent = rank;

  pfp.src = student.pfp
    ? `https://kitnapadhabackend-production.up.railway.app${student.pfp}`
    : "assets/default_pfp.png";

  pfp.alt = `${student.display_name}'s profile picture`;

  name.textContent = student.display_name;
  xp.textContent = `${student.weekly_xp.toLocaleString("en-IN")} XP`;

  return dom;
}
