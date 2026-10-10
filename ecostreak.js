
/* =========================================
   ECOSTREAK — E-COUTURE
   AI OUTFIT CHECK-IN
========================================= */

const $ = id => document.getElementById(id);

const input = $("outfitInput");
const result = $("outfitResult");
const section = $("aiResultSection");

const storageKey = "ecoutureEcoStreak";
const closetKey = "ecoutureWardrobe";

let photo = null;
let analysis = null;
let cameraStream = null;

/* =========================================
   DATE HELPERS
========================================= */

function dateKey(date = new Date()) {
  return (
    date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

function yesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return dateKey(date);
}

/* =========================================
   LOCAL STORAGE
========================================= */

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (error) {
    console.error("Storage read error:", error);
    return fallback;
  }
}

let progress = read(storageKey, {
  count: 0,
  lastCheckin: null,
  wears: {},
  history: []
});

if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
  progress = {
    count: 0,
    lastCheckin: null,
    wears: {},
    history: []
  };
}

progress.count = Number(progress.count) || 0;
progress.wears = progress.wears || {};
progress.history = Array.isArray(progress.history)
  ? progress.history
  : [];

function save() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error("Could not save EcoStreak:", error);
  }
}

/* =========================================
   DIGITAL CLOSET CONNECTION
========================================= */

function wardrobe() {
  const saved = read(closetKey, []);

  if (!Array.isArray(saved)) {
    return [];
  }

  return saved
    .filter(item => item && item.name)
    .map((item, index) => ({
      ...item,
      id: item.id ?? "garment-" + index,
      category: item.category || "Clothing"
    }));
}

/* =========================================
   UPDATE STREAK AND ECO CHALLENGE
========================================= */

function refresh() {
  if (
    progress.lastCheckin &&
    progress.lastCheckin !== dateKey() &&
    progress.lastCheckin !== yesterday()
  ) {
    progress.count = 0;
  }

  const items = wardrobe();

  const ranked = items.slice().sort(
    (a, b) =>
      (progress.wears[a.id] || 0) -
      (progress.wears[b.id] || 0)
  );

  const dailyChallenges = [
    "Style your {item} in a completely different way today!",
    "Create a new outfit using your {item} without buying anything.",
    "Give your {item} another day out!",
    "Mix your {item} with something you haven't worn recently.",
    "Create a casual look using your {item}.",
    "Make your {item} the highlight of today's outfit!",
    "Rewear your {item} with different accessories.",
    "Create a fresh look using your {item} and other clothes you own.",
    "Style your {item} for a different occasion.",
    "Build a sustainable outfit around your {item} today!"
  ];

  const today = new Date();

  const dayNumber = Math.floor(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ) / 86400000
  );

  const challengeIndex =
    dayNumber % dailyChallenges.length;

  const ecoChallenge = $("ecoChallenge");

  if (ecoChallenge) {
    if (ranked.length > 0) {
      const itemIndex = dayNumber % ranked.length;
      const selectedItem = ranked[itemIndex];

      ecoChallenge.textContent =
        dailyChallenges[challengeIndex].replace(
          "{item}",
          selectedItem.name
        );
    } else {
      ecoChallenge.textContent =
        "Add clothes to your Digital Closet to unlock your daily Eco Challenge!";
    }
  }

  const streakNumber = $("streakNumber");

  if (streakNumber) {
    streakNumber.textContent = String(progress.count);
  }

  const streakMessage = $("streakMessage");

  if (streakMessage) {
    streakMessage.textContent = progress.count > 0
      ? "Keep your EcoStreak alive!"
      : "Check in with an outfit to start your streak!";
  }

  save();
}

refresh();

/* =========================================
   PHOTO PREVIEW
========================================= */

function showOutfitPreview() {
  if (!photo) return;

  const outfitImage = $("outfitImage");
  const uploadArea = $("uploadArea");
  const outfitPreview = $("outfitPreview");

  if (outfitImage) outfitImage.src = photo;
  if (uploadArea) uploadArea.style.display = "none";
  if (outfitPreview) outfitPreview.style.display = "block";
  if (section) section.style.display = "none";
}

/* =========================================
   CHOOSE PHOTO FROM DEVICE
========================================= */

const chooseOutfitButton = $("chooseOutfitButton");

if (chooseOutfitButton && input) {
  chooseOutfitButton.addEventListener("click", () => {
    input.click();
  });

  input.addEventListener("change", () => {
    const file = input.files && input.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      photo = reader.result;
      analysis = null;
      stopEcoCamera();
      showOutfitPreview();
    };

    reader.onerror = () => {
      alert("Could not read this image.");
    };

    reader.readAsDataURL(file);
  });
}

/* =========================================
   LIVE CAMERA
========================================= */

const cameraSection = $("cameraSection");
const cameraVideo = $("cameraVideo");
const cameraCanvas = $("cameraCanvas");

function stopEcoCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => {
      track.stop();
    });

    cameraStream = null;
  }

  if (cameraVideo) {
    cameraVideo.pause();
    cameraVideo.srcObject = null;
  }

  if (cameraSection) {
    cameraSection.style.display = "none";
  }
}

/* OPEN CAMERA */

const openCameraButton = $("openCameraButton");

if (openCameraButton) {
  openCameraButton.addEventListener("click", async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert(
          "Camera access requires HTTPS or localhost. Please open your deployed E-Couture website."
        );
        return;
      }

      stopEcoCamera();

      cameraStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

      cameraVideo.srcObject = cameraStream;
      cameraSection.style.display = "block";

      await cameraVideo.play();

    } catch (error) {
      console.error("EcoStreak camera error:", error);

      stopEcoCamera();

      alert(
        "Could not open the camera: " +
        (error.message || error.name)
      );
    }
  });
}

/* TAKE PHOTO */

const takePhotoButton = $("takePhotoButton");

if (takePhotoButton) {
  takePhotoButton.addEventListener("click", () => {
    if (
      !cameraStream ||
      !cameraVideo.videoWidth ||
      !cameraVideo.videoHeight
    ) {
      alert(
        "Camera is not ready. Please wait a moment."
      );
      return;
    }

    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;

    const context = cameraCanvas.getContext("2d");

    if (!context) {
      alert(
        "Photo capture is unavailable in this browser."
      );
      return;
    }

    context.drawImage(
      cameraVideo,
      0,
      0,
      cameraCanvas.width,
      cameraCanvas.height
    );

    photo = cameraCanvas.toDataURL(
      "image/jpeg",
      0.85
    );

    analysis = null;

    stopEcoCamera();
    showOutfitPreview();
  });
}

/* CLOSE CAMERA */

const closeCameraButton = $("closeCameraButton");

if (closeCameraButton) {
  closeCameraButton.addEventListener(
    "click",
    stopEcoCamera
  );
}

window.addEventListener(
  "pagehide",
  stopEcoCamera
);

/* =========================================
   CHANGE OUTFIT PHOTO
========================================= */

const changeOutfitButton = $("changeOutfitButton");

if (changeOutfitButton) {
  changeOutfitButton.addEventListener("click", () => {
    stopEcoCamera();

    photo = null;
    analysis = null;

    if (input) input.value = "";

    const outfitImage = $("outfitImage");

    if (outfitImage) {
      outfitImage.removeAttribute("src");
    }

    if ($("outfitPreview")) {
      $("outfitPreview").style.display = "none";
    }

    if ($("uploadArea")) {
      $("uploadArea").style.display = "flex";
    }

    if (section) {
      section.style.display = "none";
    }

    if (result) {
      result.replaceChildren();
    }
  });
}

/* =========================================
   SAFE TEXT DISPLAY
========================================= */

function element(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

/* =========================================
   AI OUTFIT ANALYSIS
========================================= */

const analyseOutfitButton = $("analyseOutfitButton");

if (analyseOutfitButton) {
  analyseOutfitButton.addEventListener("click", async () => {
    if (!photo) {
      alert("Please add an outfit photo first.");
      return;
    }

    if (!section || !result) return;

    section.style.display = "block";

    if (progress.lastCheckin === dateKey()) {
      result.replaceChildren(
        element(
          "p",
          "You have already checked in today. Come back tomorrow!"
        )
      );
      return;
    }

    result.replaceChildren(
      element(
        "p",
        "AI is analysing your outfit..."
      )
    );

    try {
      const response = await fetch(
        "/api/ecostreak-analyse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image: photo,
            wardrobe: wardrobe().map(
              ({ id, name, category }) => ({
                id,
                name,
                category
              })
            )
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Analysis failed"
        );
      }

      analysis = data;
      renderMatches();

    } catch (error) {
      console.error("EcoStreak AI error:", error);

      result.replaceChildren(
        element(
          "p",
          "AI could not analyse this photo. Please try again."
        )
      );
    }
  });
}

/* =========================================
   DISPLAY AI CLOSET MATCHES
========================================= */

function renderMatches() {
  if (!result || !analysis) return;

  result.replaceChildren();

  result.append(
    element("h3", "AI Outfit Check")
  );

  /* DETECTED CLOTHES */

  const detectedHeading = element(
    "h4",
    "DETECTED IN YOUR PHOTO"
  );

  detectedHeading.style.cssText =
    "margin:22px 0 8px;letter-spacing:1.5px;font-size:13px;color:#d5e4dc";

  result.append(detectedHeading);

  result.append(
    element(
      "p",
      analysis.description || "Your outfit was analysed."
    )
  );

  /* DIGITAL CLOSET MATCHES */

  const closetHeading = element(
    "h4",
    "POSSIBLE DIGITAL CLOSET MATCHES"
  );

  closetHeading.style.cssText =
    "margin:26px 0 8px;letter-spacing:1.5px;font-size:13px;color:#d5e4dc";

  result.append(closetHeading);

  const items = wardrobe();

  const suggestedIds = new Set(
    (
      Array.isArray(analysis.matches)
        ? analysis.matches
        : []
    )
      .filter(match =>
        match && match.id != null
      )
      .map(match => String(match.id))
  );

  const matched = items.filter(item =>
    suggestedIds.has(String(item.id))
  );

  const container = document.createElement("div");

  container.style.cssText =
    "display:grid;gap:14px;margin:18px 0";

  /* SHOW AI MATCHES OR ALL SAVED CLOTHES */

  if (items.length > 0) {
    if (matched.length > 0) {
      result.append(
        element(
          "p",
          "AI found possible matches in your Digital Closet. Select only the garments you're actually wearing."
        )
      );
    } else {
      result.append(
        element(
          "p",
          "AI couldn't identify an exact match. Select the clothes you actually wore from your Digital Closet below."
        )
      );
    }

    /* SHOW MATCHED ITEMS FIRST */

    const matchedIds = new Set(
      matched.map(item => String(item.id))
    );

    const sortedItems = [
      ...matched,
      ...items.filter(item =>
        !matchedIds.has(String(item.id))
      )
    ];

    for (const item of sortedItems) {
      const label = document.createElement("label");

      label.style.cssText =
        "display:flex;gap:12px;align-items:center;cursor:pointer";

      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.value = String(item.id);
      checkbox.checked = false;

      const isMatch =
        matchedIds.has(String(item.id));

      const itemText =
        `${item.name} (${item.category || "Clothing"})` +
        (isMatch ? " — possible AI match" : "");

      label.append(
        checkbox,
        element("span", itemText)
      );

      container.append(label);
    }

  } else {
    result.append(
      element(
        "p",
        "No saved garments were found for EcoStreak. Open Digital Closet and add or save your clothing first."
      )
    );
  }

  result.append(container);

  /* STYLING SUGGESTION */

  if (analysis.tip) {
    const tipHeading = element(
      "h4",
      "STYLING SUGGESTION"
    );

    tipHeading.style.cssText =
      "margin:26px 0 8px;letter-spacing:1.5px;font-size:13px;color:#d5e4dc";

    result.append(tipHeading);

    result.append(
      element("p", analysis.tip)
    );
  }

  /* CONFIRM OUTFIT */

  if (items.length > 0) {
    const button = element(
      "button",
      "CONFIRM MY OUTFIT"
    );

    button.type = "button";

    button.style.cssText =
      "background:#efc1bc;color:#253c35;border:0;border-radius:30px;padding:14px 24px;font-weight:bold;cursor:pointer;margin-top:16px";

    button.addEventListener("click", () => {
      const chosen = [
        ...container.querySelectorAll("input:checked")
      ].map(el => el.value);

      if (!chosen.length) {
        alert(
          "Please select at least one garment you actually wore."
        );
        return;
      }

      confirmOutfit(chosen);
    });

    result.append(button);
  }
}

/* =========================================
   CONFIRM DAILY OUTFIT
========================================= */

function confirmOutfit(ids) {
  if (progress.lastCheckin === dateKey()) {
    return;
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return;
  }

  progress.count =
    progress.lastCheckin === yesterday()
      ? progress.count + 1
      : 1;

  progress.lastCheckin = dateKey();

  ids.forEach(id => {
    progress.wears[id] =
      (progress.wears[id] || 0) + 1;
  });

  progress.history.push({
    date: dateKey(),
    garmentIds: ids
  });

  refresh();

  result.replaceChildren(
    element(
      "h3",
      "OUTFIT CONFIRMED!"
    ),
    element(
      "p",
      "Your confirmed garments have been recorded in your wear history. Keep rewearing!"
    )
  );

  const heading = element(
    "h3",
    "Garment Wear History"
  );

  heading.style.marginTop = "20px";
  result.append(heading);

  wardrobe()
    .filter(item =>
      ids.includes(String(item.id))
    )
    .forEach(item => {
      result.append(
        element(
          "p",
          `${item.name}: worn ${
            progress.wears[item.id]
          } time(s)`
        )
      );
    });
}
