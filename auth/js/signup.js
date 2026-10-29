const form = document.getElementById("signup-form");
    const btn = document.getElementById("submit-btn");
    const msg = document.getElementById("message");
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showMessage(text, type) {
      msg.textContent = text;
      msg.className = "message " + type;
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirm = document.getElementById("confirm").value;

      if (!name || !email || !password || !confirm) {
        showMessage("Please fill in all fields.", "error");
        return;
      }
      if (!EMAIL_RE.test(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }
      if (password.length < 8) {
        showMessage("Password must be at least 8 characters.", "error");
        return;
      }
      if (password !== confirm) {
        showMessage("Passwords do not match.", "error");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Creating account...";

      try {
        const res = await fetch("/api/signup", {   // change to your backend URL
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        if (!res.ok) throw new Error("Could not create your account. Please try again.");

        showMessage("Account created! Redirecting to log in...", "success");
        setTimeout(function () { window.location.href = "login.html"; }, 1500);
      } catch (err) {
        showMessage(err.message, "error");
        btn.disabled = false;
        btn.textContent = "Create account";
      }
    });