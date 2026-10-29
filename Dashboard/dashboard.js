/**
 * TatakLokal - Dashboard Functions
 * Strictly handles logic and behaviors for dashboard.html & dashboard.css:
 * - View / tab switching
 * - Profile saving & local storage
 * - Toast notifications
 * - Logout handler
 */

document.addEventListener("DOMContentLoaded", () => {
  const sideLinks = document.querySelectorAll("[data-tl-view]");
  const viewPanels = document.querySelectorAll(".tl-view-panel");
  const toastEl = document.getElementById("tl-toast");
  const profileForm = document.getElementById("tl-profile-form");
  const nameInput = document.getElementById("tl-name");
  const greetingNames = document.querySelectorAll(".user-greeting-name");
  const logoutButtons = [
    document.getElementById("btn-logout-sidebar"),
    document.getElementById("btn-logout-settings"),
  ];

  let toastTimer = null;

  /* ---------- Function: Show Toast Notification ---------- */
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-on");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-on");
    }, 2400);
  }

  /* ---------- Function: Switch Active View ---------- */
  function switchView(viewName) {
    const validViews = ["dashboard", "business", "messages", "settings"];
    const targetView = validViews.includes(viewName) ? viewName : "dashboard";

    // Toggle panels visibility
    viewPanels.forEach((panel) => {
      if (panel.id === `view-${targetView}`) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "true");
      }
    });

    // Update active state on sidebar buttons
    sideLinks.forEach((btn) => {
      const isActive = btn.getAttribute("data-tl-view") === targetView;
      btn.classList.toggle("is-active", isActive);
      if (isActive) {
        btn.setAttribute("aria-current", "page");
      } else {
        btn.removeAttribute("aria-current");
      }
    });

    // Update document title
    const titles = {
      dashboard: "Dashboard – TatakLokal Olongapo",
      business: "My Business – TatakLokal Olongapo",
      messages: "Messages – TatakLokal Olongapo",
      settings: "Settings – TatakLokal Olongapo",
    };
    document.title = titles[targetView] || "Dashboard – TatakLokal Olongapo";

    // Sync hash
    if (location.hash !== `#${targetView}`) {
      try {
        history.pushState(null, "", `#${targetView}`);
      } catch (e) {
        location.hash = targetView;
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Function: Load Saved User Profile ---------- */
  function loadProfile() {
    try {
      const savedName = localStorage.getItem("tl_display_name");
      if (savedName) {
        if (nameInput) nameInput.value = savedName;
        const firstName = savedName.trim().split(/\s+/)[0] || savedName;
        greetingNames.forEach((el) => {
          el.textContent = firstName;
        });
      }
    } catch (e) {
      console.warn("Could not read local storage", e);
    }
  }

  /* ---------- Function: Save User Profile ---------- */
  function saveProfile(name) {
    const trimmed = name.trim();
    if (!trimmed) {
      showToast("Please enter a display name.");
      if (nameInput) nameInput.focus();
      return;
    }

    try {
      localStorage.setItem("tl_display_name", trimmed);
    } catch (e) {
      console.warn("Could not write to local storage", e);
    }

    const firstName = trimmed.split(/\s+/)[0] || trimmed;
    greetingNames.forEach((el) => {
      el.textContent = firstName;
    });

    showToast("Profile saved.");
  }

  /* ---------- Function: Handle Logout ---------- */
  function handleLogout() {
    showToast("Logging out...");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 500);
  }

  /* ---------- Event Listeners ---------- */

  // Tab switching clicks
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-tl-view]");
    if (trigger) {
      e.preventDefault();
      const view = trigger.getAttribute("data-tl-view");
      switchView(view);
    }
  });

  // Profile form submission
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveProfile(nameInput ? nameInput.value : "");
    });
  }

  // Logout buttons
  logoutButtons.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        handleLogout();
      });
    }
  });

  // Handle browser back/forward URL hash changes
  window.addEventListener("popstate", () => {
    const hash = location.hash.replace("#", "");
    switchView(hash || "dashboard");
  });

  /* ---------- Initialization ---------- */
  loadProfile();
  const initialHash = location.hash.replace("#", "") || "dashboard";
  switchView(initialHash);
});
