const MAX_PHOTOS = 6;
    const MAX_TAGS = 8;
    const MAX_FILE_MB = 5;

    const form = document.getElementById("business-form");
    const btn = document.getElementById("publish-btn");
    const msg = document.getElementById("message");
    const photoInput = document.getElementById("photo-input");
    const addPhotosBtn = document.getElementById("add-photos");
    const previews = document.getElementById("previews");

    let photos = [];   // File objects, in order (first one = cover)

    function showMessage(text, type) {
      msg.textContent = text;
      msg.className = "message " + type;
    }

    /* ---------- Photos ---------- */
    addPhotosBtn.addEventListener("click", function () { photoInput.click(); });

    photoInput.addEventListener("change", function () {
      const incoming = Array.from(photoInput.files);
      photoInput.value = "";

      for (const file of incoming) {
        if (photos.length >= MAX_PHOTOS) {
          showMessage("You can add up to " + MAX_PHOTOS + " photos.", "error");
          break;
        }
        if (!file.type.startsWith("image/")) continue;
        if (file.size > MAX_FILE_MB * 1024 * 1024) {
          showMessage(file.name + " is larger than " + MAX_FILE_MB + " MB.", "error");
          continue;
        }
        photos.push(file);
      }
      renderPhotos();
    });

    function renderPhotos() {
      previews.innerHTML = "";
      photos.forEach(function (file, i) {
        const thumb = document.createElement("div");
        thumb.className = "thumb";

        const img = document.createElement("img");
        img.alt = "Photo " + (i + 1);
        img.src = URL.createObjectURL(file);
        img.onload = function () { URL.revokeObjectURL(img.src); };
        thumb.appendChild(img);

        if (i === 0) {
          const tag = document.createElement("span");
          tag.className = "cover-tag";
          tag.textContent = "COVER";
          thumb.appendChild(tag);
        }

        const remove = document.createElement("button");
        remove.type = "button";
        remove.setAttribute("aria-label", "Remove photo");
        remove.innerHTML = "&times;";
        remove.addEventListener("click", function () {
          photos.splice(i, 1);
          renderPhotos();
        });
        thumb.appendChild(remove);

        previews.appendChild(thumb);
      });
      addPhotosBtn.disabled = photos.length >= MAX_PHOTOS;
    }

    /* ---------- Submit ---------- */
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const val = function (id) { return document.getElementById(id).value.trim(); };

      const name = val("name");
      const category = val("category");
      const barangay = val("barangay");
      const address = val("address");
      const email = val("email");
      const tags = val("known").split(",").map(function (t) { return t.trim(); }).filter(Boolean);

      if (!name) return showMessage("Please enter your business name.", "error");
      if (!category) return showMessage("Please choose a category.", "error");
      if (!barangay) return showMessage("Please choose a barangay.", "error");
      if (!address) return showMessage("Please enter your street address.", "error");
      if (tags.length > MAX_TAGS) return showMessage("\"What you're known for\" can have up to " + MAX_TAGS + " items.", "error");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage("Please enter a valid email address.", "error");
      if (!val("phone") && !email && !val("web")) return showMessage("Add at least one way for people to reach you.", "error");

      const data = new FormData();
      data.append("name", name);
      data.append("category", category);
      data.append("about", val("about"));
      data.append("known", JSON.stringify(tags));
      data.append("barangay", barangay);
      data.append("address", address);
      data.append("hours", val("hours"));
      data.append("price", val("price"));
      data.append("delivery", document.getElementById("delivery").checked);
      data.append("phone", val("phone"));
      data.append("email", email);
      data.append("web", val("web"));
      photos.forEach(function (file) { data.append("photos", file); });

      btn.disabled = true;
      btn.textContent = "Publishing...";

      try {
        const res = await fetch("/api/listings", {   // change to your backend URL
          method: "POST",
          body: data
        });

        if (!res.ok) throw new Error("Could not publish your listing. Please try again.");

        showMessage("Your listing is live! Redirecting to your dashboard...", "success");
        setTimeout(function () { window.location.href = "/dashboard"; }, 1500);   // change to your page
      } catch (err) {
        showMessage(err.message, "error");
        btn.disabled = false;
        btn.textContent = "Publish my listing";
      }
    });