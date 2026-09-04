const BASE_URL = "https://kitnapadhabackend-production.up.railway.app";

// ============================================================
// ELEMENTS
// ============================================================

const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");

const showLogin = document.getElementById("show-login");
const showSignup = document.getElementById("show-signup");

const loginToSignup = document.getElementById("login-to-signup");
const signupToLogin = document.getElementById("signup-to-login");

const tabIndicator = document.getElementById("tab-indicator");

const loginForm = document.getElementById("login-form");
const createAccountForm = document.getElementById("create-account-form");

const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const displayName = document.getElementById("display-name");
const username = document.getElementById("username");
const password = document.getElementById("password");

const loginButton = document.getElementById("login-button");
const createAccountButton = document.getElementById("create-account-button");

const loginError = document.getElementById("login-error");
const signupError = document.getElementById("signup-error");

const generatedId = document.getElementById("generated-id");
const accountCreated = document.getElementById("account-created");

const copyIdButton = document.getElementById("copy-id");

const toastContainer = document.getElementById("toast-container");

const passwordLength = document.getElementById("password-length");
const passwordProgress = document.getElementById("password-progress");

// ============================================================
// MODE SWITCHING
// ============================================================

function showLoginSection() {
  loginSection.classList.remove("hidden");
  signupSection.classList.add("hidden");

  tabIndicator.classList.remove("translate-x-full");

  showLogin.classList.add("text-white");
  showLogin.classList.remove("text-[#8E97BA]");

  showSignup.classList.remove("text-white");
  showSignup.classList.add("text-[#8E97BA]");

  clearAllErrors();
}

function showSignupSection() {
  loginSection.classList.add("hidden");
  signupSection.classList.remove("hidden");

  tabIndicator.classList.add("translate-x-full");

  showSignup.classList.add("text-white");
  showSignup.classList.remove("text-[#8E97BA]");

  showLogin.classList.remove("text-white");
  showLogin.classList.add("text-[#8E97BA]");

  clearAllErrors();
}

showLogin.addEventListener("click", showLoginSection);
showSignup.addEventListener("click", showSignupSection);

loginToSignup.addEventListener("click", showSignupSection);
signupToLogin.addEventListener("click", showLoginSection);

// async function isAccAlreadyExist() {
//   const isKitnaAccount = await chrome.storage.local.get("kitnaAccount");

//   if (isKitnaAccount) window.
// }

// ============================================================
// TOASTS
// ============================================================

function showToast(message, type = "error") {
  const toast = document.createElement("div");

  const isSuccess = type === "success";

  toast.className = `
    pointer-events-auto
    flex
    w-full
    max-w-sm
    items-start
    gap-3
    rounded-2xl
    border
    px-4
    py-3.5
    shadow-2xl
    backdrop-blur-xl
    translate-y-[-10px]
    opacity-0
    transition-all
    duration-300
    ${
      isSuccess
        ? "border-emerald-400/20 bg-[#071B16]/95 text-emerald-200"
        : "border-red-400/20 bg-[#1C090D]/95 text-red-200"
    }
  `;

  const icon = document.createElement("div");

  icon.className = `
    mt-0.5
    flex
    h-7
    w-7
    shrink-0
    items-center
    justify-center
    rounded-lg
    text-xs
    font-bold
    ${
      isSuccess
        ? "bg-emerald-400/10 text-emerald-300"
        : "bg-red-400/10 text-red-300"
    }
  `;

  icon.textContent = isSuccess ? "✓" : "!";

  const text = document.createElement("p");

  text.className = "text-sm font-medium leading-5";

  text.textContent = message;

  toast.append(icon, text);
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-[-10px]", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("translate-y-[-10px]", "opacity-0");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// ============================================================
// FIELD ERRORS
// ============================================================

function setFieldError(input, errorElement, message) {
  input.classList.remove("border-[#40368F]");
  input.classList.remove("focus:border-[#7B6EFF]");

  input.classList.add("border-red-500/70");
  input.classList.add("focus:border-red-400");

  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}

function clearFieldError(input, errorElement) {
  input.classList.remove("border-red-500/70");
  input.classList.remove("focus:border-red-400");

  input.classList.add("border-[#40368F]");
  input.classList.add("focus:border-[#7B6EFF]");

  errorElement.textContent = "";
  errorElement.classList.add("hidden");
}

function clearAllErrors() {
  clearFieldError(
    loginUsername,
    document.getElementById("login-username-error"),
  );

  clearFieldError(
    loginPassword,
    document.getElementById("login-password-error"),
  );

  clearFieldError(displayName, document.getElementById("display-name-error"));

  clearFieldError(username, document.getElementById("username-error"));

  clearFieldError(password, document.getElementById("password-error"));

  loginError.classList.add("hidden");
  signupError.classList.add("hidden");
}

function showGeneralError(element, message) {
  element.textContent = message;
  element.classList.remove("hidden");
}

// ============================================================
// BUTTON LOADING
// ============================================================

function setButtonLoading(button, loading, loadingText) {
  button.disabled = loading;

  const content = button.querySelector(".button-content");

  if (!content) return;

  if (loading) {
    content.innerHTML = `
      <span
        class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      ></span>

      <span>${loadingText}</span>
    `;
  } else {
    content.textContent = button === loginButton ? "Log in" : "Create account";
  }
}

// ============================================================
// PASSWORD VISIBILITY
// ============================================================

function setupPasswordToggle(input, button) {
  button.addEventListener("click", () => {
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    button.textContent = isPassword ? "Hide" : "Show";
  });
}

setupPasswordToggle(
  loginPassword,
  document.getElementById("toggle-login-password"),
);

setupPasswordToggle(
  password,
  document.getElementById("toggle-signup-password"),
);

// ============================================================
// PASSWORD LENGTH UI
// ============================================================

password.addEventListener("input", () => {
  const length = password.value.length;

  passwordLength.textContent = `${length} / 8`;

  const progress = Math.min((length / 8) * 100, 100);

  passwordProgress.style.width = `${progress}%`;

  if (length >= 8) {
    passwordLength.classList.remove("text-[#626A91]");
    passwordLength.classList.add("text-emerald-400");

    passwordProgress.classList.remove("bg-[#5A4BDA]");
    passwordProgress.classList.add("bg-emerald-400");
  } else {
    passwordLength.classList.remove("text-emerald-400");
    passwordLength.classList.add("text-[#626A91]");

    passwordProgress.classList.remove("bg-emerald-400");
    passwordProgress.classList.add("bg-[#5A4BDA]");
  }
});

// ============================================================
// INPUT CLEANUP
// ============================================================

username.addEventListener("input", () => {
  username.value = username.value.toLowerCase().replace(/\s/g, "");
});

loginUsername.addEventListener("input", () => {
  loginUsername.value = loginUsername.value.toLowerCase().replace(/\s/g, "");
});

// ============================================================
// VALIDATION
// ============================================================

function validateSignup() {
  let valid = true;

  clearAllErrors();

  const displayNameValue = displayName.value.trim();
  const usernameValue = username.value.trim().toLowerCase();
  const passwordValue = password.value;

  const displayNameError = document.getElementById("display-name-error");

  const usernameError = document.getElementById("username-error");

  const passwordError = document.getElementById("password-error");

  // Display name
  if (!displayNameValue) {
    setFieldError(
      displayName,
      displayNameError,
      "Please enter your display name.",
    );

    valid = false;
  } else if (displayNameValue.length > 40) {
    setFieldError(
      displayName,
      displayNameError,
      "Display name must be 40 characters or fewer.",
    );

    valid = false;
  }

  // Username
  if (!usernameValue) {
    setFieldError(username, usernameError, "Please choose a username.");

    valid = false;
  } else if (usernameValue.length < 3) {
    setFieldError(
      username,
      usernameError,
      "Username must be at least 3 characters.",
    );

    valid = false;
  } else if (usernameValue.length > 24) {
    setFieldError(
      username,
      usernameError,
      "Username must be 24 characters or fewer.",
    );

    valid = false;
  } else if (!/^[a-z0-9_]+$/.test(usernameValue)) {
    setFieldError(
      username,
      usernameError,
      "Use only lowercase letters, numbers and underscores.",
    );

    valid = false;
  }

  // Password
  if (!passwordValue) {
    setFieldError(password, passwordError, "Please create a password.");

    valid = false;
  } else if (passwordValue.length < 8) {
    setFieldError(
      password,
      passwordError,
      "Password must be at least 8 characters.",
    );

    valid = false;
  }

  return valid;
}

function validateLogin() {
  let valid = true;

  clearAllErrors();

  const usernameValue = loginUsername.value.trim();
  const passwordValue = loginPassword.value;

  const usernameError = document.getElementById("login-username-error");

  const passwordError = document.getElementById("login-password-error");

  if (!usernameValue) {
    setFieldError(loginUsername, usernameError, "Please enter your username.");

    valid = false;
  }

  if (!passwordValue) {
    setFieldError(loginPassword, passwordError, "Please enter your password.");

    valid = false;
  }

  return valid;
}

// ============================================================
// SAFE JSON RESPONSE
// ============================================================

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  return {
    error: "The server returned an unexpected response.",
  };
}

// ============================================================
// SIGNUP
// ============================================================

createAccountForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateSignup()) {
    showToast("Please fix the highlighted fields.");
    return;
  }

  const displayNameValue = displayName.value.trim();
  const usernameValue = username.value.trim().toLowerCase();
  const passwordValue = password.value;

  setButtonLoading(createAccountButton, true, "Creating account...");

  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        displayName: displayNameValue,
        username: usernameValue,
        password: passwordValue,
      }),
    });

    const data = await parseResponse(response);

    // Username already exists
    if (response.status === 409) {
      setFieldError(
        username,
        document.getElementById("username-error"),
        "That username already exists. Try another one.",
      );

      showToast("That username is already taken.");

      username.focus();

      return;
    }

    if (!response.ok) {
      showGeneralError(
        signupError,
        data.error || "Could not create your account.",
      );

      showToast(data.error || "Could not create your account.");

      return;
    }

    // Save authentication
    await chrome.storage.local.set({
      kitnaAccount: true,
      kitnaId: data.kitnaId,
      token: data.token,
    });

    // Show generated ID briefly
    generatedId.textContent = data.kitnaId;
    accountCreated.classList.remove("hidden");

    showToast(
      "Account created successfully. Welcome to Kitna Padha!",
      "success",
    );
  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    showGeneralError(signupError, "Could not connect to Kitna Padha server.");

    showToast("Could not connect to the Kitna Padha server.");
  } finally {
    setButtonLoading(createAccountButton, false);
  }
});

// ============================================================
// LOGIN
// ============================================================

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateLogin()) {
    showToast("Please enter your username and password.");
    return;
  }

  const usernameValue = loginUsername.value.trim().toLowerCase();

  const passwordValue = loginPassword.value;

  setButtonLoading(loginButton, true, "Logging in...");

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue,
      }),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      const message =
        response.status === 401
          ? "Invalid username or password."
          : data.error || "Login failed.";

      showGeneralError(loginError, message);

      showToast(message);

      loginPassword.focus();

      return;
    }

    if (!data.token) {
      throw new Error("Server did not return an authentication token.");
    }

    await chrome.storage.local.set({
      token: data.token,
      kitnaAccount: true,
    });

    showToast("Logged in successfully. Welcome back!", "success");

    window.location.href = "group.html";
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    showGeneralError(loginError, "Could not connect to Kitna Padha server.");

    showToast("Could not connect to the Kitna Padha server.");
  } finally {
    setButtonLoading(loginButton, false);
  }
});

// ============================================================
// COPY KITNA ID
// ============================================================

copyIdButton.addEventListener("click", async () => {
  const id = generatedId.textContent.trim();

  if (!id) return;

  try {
    await navigator.clipboard.writeText(id);

    copyIdButton.textContent = "Copied!";

    showToast("Your Kitna Padha ID was copied.", "success");

    window.location.href = "group.html";

    setTimeout(() => {
      copyIdButton.textContent = "Copy";
    }, 1500);
  } catch (error) {
    console.error("COPY ERROR:", error);

    showToast("Could not copy the ID.");
  }
});

// ============================================================
// CLEAR FIELD ERRORS WHEN USER TYPES
// ============================================================

displayName.addEventListener("input", () => {
  clearFieldError(displayName, document.getElementById("display-name-error"));
});

username.addEventListener("input", () => {
  clearFieldError(username, document.getElementById("username-error"));

  signupError.classList.add("hidden");
});

password.addEventListener("input", () => {
  clearFieldError(password, document.getElementById("password-error"));

  signupError.classList.add("hidden");
});

loginUsername.addEventListener("input", () => {
  clearFieldError(
    loginUsername,
    document.getElementById("login-username-error"),
  );

  loginError.classList.add("hidden");
});

loginPassword.addEventListener("input", () => {
  clearFieldError(
    loginPassword,
    document.getElementById("login-password-error"),
  );

  loginError.classList.add("hidden");
});
