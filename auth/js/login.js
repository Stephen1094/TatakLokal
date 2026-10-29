 document
        .getElementById("login-form")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          var email = document.getElementById("email").value.trim();
          var password = document.getElementById("password").value;
          if (!email || !password) return;
          // TODO: send email + password to your backend here
          console.log("Login submitted", { email: email });
        });