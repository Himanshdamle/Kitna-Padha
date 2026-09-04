const state = {
  active: `
<div class="menuOptionWrapper-ul4UIH">
  <div
    class="menuOption-roXoAE active-uRr3Qh hoverClass-fO3ZAD"
    role="button"
    tabindex="0"
  >
    <div class="optionWrapper-ABIt_X">

      <div class="leftOptions-EPvME7">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666666"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm466 0q-47 47-113 47-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113q0 66-47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q440-607 440-640t-23.5-56.5Q393-720 360-720t-56.5 23.5Q280-673 280-640t23.5 56.5Q327-560 360-560t56.5-23.5ZM360-240Zm0-400Z"/></svg>
      </div>

      <div
        class="_root_sutcz_1 _small_sutcz_67 _semi-bold_sutcz_26 _none_sutcz_19 optionTitle-rK0pYW isActive-VORNXF"
        data-color-scheme="light"
        style="color: var(--primary-color);"
      >
        Study
      </div>

      <div class="rightOptions-QSQx_f"></div>

    </div>
  </div>

  <div class="motionDiv-RClaLw" style="opacity: 1;"></div>
</div>
    `,

  deActive: `
    <div class="menuOptionWrapper-ul4UIH">
  <div class="menuOption-roXoAE" role="button" tabindex="0">
    <div class="optionWrapper-ABIt_X">

      <div class="leftOptions-EPvME7">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666666"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm466 0q-47 47-113 47-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113q0 66-47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q440-607 440-640t-23.5-56.5Q393-720 360-720t-56.5 23.5Q280-673 280-640t23.5 56.5Q327-560 360-560t56.5-23.5ZM360-240Zm0-400Z"/></svg>
      </div>

      <div
        class="_root_sutcz_1 _small_sutcz_67 _medium_sutcz_29 _none_sutcz_19 optionTitle-rK0pYW"
        data-color-scheme="light"
        style="color: var(--static-color-black);"
      >
        Group
      </div>

      <div class="rightOptions-QSQx_f"></div>

    </div>
  </div>
</div>
`,
};

function loadDOM() {
  createGroupBtnInSidebar();
}

function addElIn(wrapperSelector, element, callback) {
  const wrapper = document.querySelector(wrapperSelector);

  if (wrapper) {
    wrapper.prepend(element);

    callback();
  }
}

function createGroupBtnInSidebar() {
  const friendsGroup = document.createElement("div");

  friendsGroup.id = "pw-friends-group";

  friendsGroup.innerHTML = `
<div class="_root_sutcz_1 _tiny_sutcz_71 _medium_sutcz_29 _none_sutcz_19 categoryTitle-LFjfvE"
     data-color-scheme="light"
     style="color: var(--static-color-grey-2);">
  Friends Group
</div>
`;

  friendsGroup.innerHTML += state.deActive;
  friendsGroup.style.width = "100%";

  addElIn(".contentWrapper-MS0SwH", friendsGroup, groupSidebarBtn, 1000);
}
