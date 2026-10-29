const form = document.getElementById("reset-form");
    const emailInput = document.getElementById("email");
    const btn = document.getElementById("submit-btn");
    const msg = document.getElementById("message");

    function showMessage(text, type) {
      msg.textContent = text;
      msg.className = "message " + type;
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!email) {
        showMessage("Please enter your email address.", "error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Sending...";

      try {
        const res = await fetch("/api/forgot-password", {   // change to your backend URL
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        if (!res.ok) throw new Error("Something went wrong. Please try again.");

        showMessage("If that email has an account, a reset link is on its way.", "success");
        form.reset();
      } catch (err) {
        showMessage(err.message, "error");
      } finally {
        btn.disabled = false;
        btn.textContent = "Send reset link";
      }
    });