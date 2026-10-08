/* =========================================
   ECOSTREAK — AI OUTFIT CHECK-IN
========================================= */

const $ = id => document.getElementById(id);

const input = $("outfitInput");
const result = $("outfitResult");
const section = $("aiResultSection");

const storageKey = "ecoutureEcoStreak";
const closetKey = "ecoutureWardrobe";

let photo = null;
let suggestions = [];
let analysis = null;


// =========================================
// DATE HELPERS
// =========================================

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}


// =========================================
// LOCAL STORAGE
// =========================================

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

let progress = read(storageKey, {
  count: 0,
  lastCheckin: null,
  wears: {},
  history: []
});

progress.count = Number(progress.count) || 0;
progress.wears ||= {};
progress.history ||= [];


// =========================================
// DIGITAL CLOSET
// =========================================

function wardrobe() {
  const saved = read(closetKey, []);

  const defaults = [
    {
      id: "default-shirt",
      name: "Shirt",
      category: "Shirt"
    },
    {
      id: "default-jeans",
      name: "Jeans",
      category: "Jeans"
    },
    {
      id: "default-hoodie",
      name: "Hoodie",
      category: "Hoodie"
    }
  ];

  return [...defaults, ...saved];
}


// =========================================
// SAVE PROGRESS
// =========================================

function save() {
  localStorage.setItem(
    storageKey,
    JSON.stringify(progress)
  );
}


// =========================================
// UPDATE ECOSTREAK DISPLAY
// =========================================

function refresh() {
  if (
    progress.lastCheckin &&
    progress.lastCheckin !== dateKey() &&
    progress.lastCheckin !== yesterday()
  ) {
    progress.count = 0;
  }

  $("streakNumber").textContent = progress.count;

  if (progress.lastCheckin === dateKey()) {
    $("streakMessage").textContent =
      "Today's check-in is complete. Come back tomorrow!";
  } else if (progress.count > 0) {
    $("streakMessage").textContent =
      "Check in today to keep your EcoStreak alive!";
  } else {
    $("streakMessage").textContent =
      "Complete today's outfit check-in to start your streak.";
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

const challengeIndex = dayNumber % dailyChallenges.length;

if (ranked.length > 0) {
  const itemIndex = dayNumber % ranked.length;
  const selectedItem = ranked[itemIndex];

  $("ecoChallenge").textContent =
    dailyChallenges[challengeIndex].replace(
      "{item}",
      selectedItem.name
    );
} else {
  $("ecoChallenge").textContent =
    "Add clothes to your Digital Closet to unlock your daily Eco Challenge!";
}
  save();
}

refresh();


// =========================================
// CHOOSE OUTFIT PHOTO
// =========================================

/* =====================================
   TAKE PHOTO — FIXED
===================================== */

$("takePhotoButton").addEventListener("click", () => {

  if (!cameraStream || cameraVideo.videoWidth === 0) {
    alert("Camera is not ready. Please wait a moment.");
    return;
  }

  // Set canvas dimensions
  cameraCanvas.width = cameraVideo.videoWidth;
  cameraCanvas.height = cameraVideo.videoHeight;

  const ctx = cameraCanvas.getContext("2d");

  // Capture current camera frame
  ctx.drawImage(
    cameraVideo,
    0,
    0,
    cameraCanvas.width,
    cameraCanvas.height
  );

  // Convert captured frame to image
  outfitPhoto = cameraCanvas.toDataURL("image/jpeg", 0.85);

  // Display captured photo
  const previewImage = $("outfitImage");

  previewImage.onload = () => {
    $("uploadArea").style.display = "none";
    $("outfitPreview").style.display = "block";
    $("aiResultSection").style.display = "none";

    // Stop camera after photo has loaded
    stopEcoCamera();
  };

  previewImage.onerror = () => {
    alert("The captured photo could not be displayed.");
  };

  previewImage.src = outfitPhoto;

});

/* =====================================
   LIVE CAMERA — ECOSTREAK
===================================== */

const cameraSection = $("cameraSection");
const cameraVideo = $("cameraVideo");
const cameraCanvas = $("cameraCanvas");

let cameraStream = null;


// OPEN CAMERA
$("openCameraButton").addEventListener("click", async () => {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Camera access requires HTTPS or localhost.");
      return;
    }

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment"
      },
      audio: false
    });

    cameraVideo.srcObject = cameraStream;

    cameraSection.style.display = "block";

    await cameraVideo.play();

  } catch (error) {
    console.error("Camera error:", error);
    alert("Unable to open camera. Please allow camera access in your browser.");
  }
});


// STOP CAMERA
function stopEcoCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  cameraVideo.srcObject = null;
  cameraSection.style.display = "none";
}


// TAKE PHOTO
$("takePhotoButton").addEventListener("click", () => {
  if (!cameraStream || !cameraVideo.videoWidth) {
    alert("Camera is not ready yet.");
    return;
  }

  cameraCanvas.width = cameraVideo.videoWidth;
  cameraCanvas.height = cameraVideo.videoHeight;

  const context = cameraCanvas.getContext("2d");

  context.drawImage(
    cameraVideo,
    0,
    0,
    cameraCanvas.width,
    cameraCanvas.height
  );

  outfitPhoto = cameraCanvas.toDataURL("image/jpeg", 0.8);

  $("outfitImage").src = outfitPhoto;

  $("uploadArea").style.display = "none";
  $("outfitPreview").style.display = "block";

  $("aiResultSection").style.display = "none";

  stopEcoCamera();
});


// CLOSE CAMERA
$("closeCameraButton").addEventListener("click", () => {
  stopEcoCamera();
});


// STOP CAMERA WHEN LEAVING PAGE
window.addEventListener("pagehide", stopEcoCamera);

// =========================================
// SAFE TEXT DISPLAY
// =========================================

function element(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}


// =========================================
// AI OUTFIT ANALYSIS
// =========================================

$("analyseOutfitButton").addEventListener("click", async () => {
  if (!photo) return;

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
    element("p", " AI is analysing your outfit...")
  );

  try {
    const response = await fetch("/api/ecostreak-analyse", {
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
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Analysis failed"
      );
    }

    analysis = data;
    suggestions = [];

    renderMatches();

  } catch (err) {
    console.error("EcoStreak:", err);

    result.replaceChildren(
      element(
        "p",
        "AI could not analyse this photo. Please try again."
      )
    );
  }
});


// =========================================
// DISPLAY AI CLOSET MATCHES
// =========================================

function renderMatches() {
  result.replaceChildren();

  result.append(
    element("h3", "AI Outfit Check")
  );

  result.append(
    element(
      "p",
      analysis.description || "Your outfit was analysed."
    )
  );

  result.append(
    element(
      "p",
      "Select the garments you are actually wearing. AI suggestions are not guaranteed matches."
    )
  );

  const items = wardrobe();

  const suggestedIds = new Set(
    (analysis.matches || []).map(
      match => String(match.id)
    )
  );

  if (!suggestedIds.size) {
    result.append(
      element(
        "p",
        "No confident closet matches suggested. You can select your garments manually."
      )
    );
  }

  const container = document.createElement("div");

  container.style.cssText =
    "display:grid;gap:12px;margin:18px 0";

  const ordered = items.slice().sort(
    (a, b) =>
      Number(suggestedIds.has(b.id)) -
      Number(suggestedIds.has(a.id))
  );

  for (const item of ordered) {
    const label = document.createElement("label");

    label.style.cssText =
      "display:flex;gap:12px;align-items:center;cursor:pointer";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = item.id;
    cb.checked = false;

    label.append(
      cb,
      element(
        "span",
        `${item.name} (${item.category})${
          suggestedIds.has(item.id)
            ? " — AI possible match"
            : ""
        }`
      )
    );

    container.append(label);
  }

  result.append(container);

  if (analysis.tip) {
    result.append(
      element(
        "p",
        ` Styling idea: ${analysis.tip}`
      )
    );
  }

  const button = element(
    "button",
    "CONFIRM MY OUTFIT"
  );

  button.type = "button";

  button.style.cssText =
    "background:#efc1bc;color:#253c35;border:0;border-radius:30px;padding:14px 24px;font-weight:bold;cursor:pointer";

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


// =========================================
// CONFIRM DAILY OUTFIT
// =========================================

function confirmOutfit(ids) {
  if (progress.lastCheckin === dateKey()) {
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
      ` ${progress.count} DAY ECOSTREAK!`
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
    .filter(item => ids.includes(item.id))
    .forEach(item => {
      result.append(
        element(
          "p",
          `${item.name}: worn ${progress.wears[item.id]} time(s)`
        )
      );
    });
}
