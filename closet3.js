
const userStyle = localStorage.getItem("userStyle");
const secondStyle = localStorage.getItem("userSecondStyle");
const stylePercent = localStorage.getItem("userStylePercent");
const secondStylePercent = localStorage.getItem("userSecondStylePercent");

const savedStyleElement = document.getElementById("savedStyle");

if (userStyle && savedStyleElement) {
  savedStyleElement.innerHTML = `
    <strong>${stylePercent}% ${userStyle.toUpperCase()}</strong>
    &nbsp; + &nbsp;
    <strong>${secondStylePercent}% ${(secondStyle || "").toUpperCase()}</strong>
  `;
}

let cameraStream = null;
let uploadedImage = null;
let currentGarment = null;

const uploadModal = document.getElementById("uploadModal");
const viewModal = document.getElementById("viewModal");

const uploadButton = document.getElementById("uploadButton");

if (uploadButton) {
  uploadButton.onclick = () => {
    uploadModal.classList.add("show");
  };
}

function closeUploadModal() {
  stopCamera();
  uploadModal.classList.remove("show");
  document.getElementById("uploadOptions").style.display = "grid";
  document.getElementById("cameraArea").style.display = "none";
  document.getElementById("uploadForm").style.display = "none";
  document.getElementById("clothingName").value = "";
  uploadedImage = null;
}

function chooseFile() {
  document.getElementById("fileInput").click();
}

document.getElementById("fileInput").onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => showPreview(e.target.result);
  reader.readAsDataURL(file);
};

function showPreview(image) {
  uploadedImage = image;
  document.getElementById("previewImage").src = image;
  document.getElementById("uploadOptions").style.display = "none";
  document.getElementById("cameraArea").style.display = "none";
  document.getElementById("uploadForm").style.display = "block";
}

async function startCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    document.getElementById("cameraVideo").srcObject = cameraStream;
    document.getElementById("uploadOptions").style.display = "none";
    document.getElementById("cameraArea").style.display = "block";

  } catch (error) {
    alert("Camera permission was denied or is unavailable.");
  }
}

function capturePhoto() {
  const video = document.getElementById("cameraVideo");

  if (!video.videoWidth || !video.videoHeight) {
    alert("Please wait for the camera to start.");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(
    video, 0, 0, canvas.width, canvas.height
  );

  showPreview(canvas.toDataURL("image/jpeg"));
  stopCamera();
}

function stopCamera() {
  if (!cameraStream) return;

  cameraStream.getTracks().forEach(track => track.stop());
  cameraStream = null;
}

/* CLOTHING RECOMMENDATIONS */

const upscale = {
  good: [
    "Add embroidery or a small decorative design.",
    "Change buttons, trims or another small detail.",
    "Alter the shape, length or sleeves."
  ],
  excellent: [
    "Add subtle embroidery or decorative stitching.",
    "Replace buttons or other small details.",
    "Add a small patch or personalised detail."
  ],
  stain: [
    "Treat the stain using a method suitable for the fabric.",
    "Cover the remaining mark with embroidery or a patch.",
    "Turn the affected area into a design feature."
  ],
  hole: [
    "Cover the hole with a contrasting fabric patch.",
    "Use visible stitching as a design detail.",
    "Add embroidery around the damaged area."
  ],
  tear: [
    "Reinforce the tear with decorative stitching.",
    "Add a fabric patch over or underneath it.",
    "Turn the tear into intentional distressing."
  ],
  faded: [
    "Refresh the colour using suitable fabric dye.",
    "Create an intentional faded or tie-dye effect.",
    "Add embroidery, patches or graphics."
  ],
  stitching: [
    "Reinforce the loose stitching with stronger thread.",
    "Use contrasting thread to make the repair decorative.",
    "Add a small patch over the weak area."
  ],
  zipper: [
    "Replace the zipper with a new one.",
    "Use a contrasting zipper as a design detail.",
    "Add a decorative zipper pull."
  ],
  button: [
    "Replace the missing button with a contrasting one.",
    "Replace all buttons with a matching set.",
    "Use unique buttons for a personalised look."
  ]
};

const styles = {
  Casual: [
    "Pair it with relaxed everyday pieces.",
    "Add comfortable sneakers or simple footwear.",
    "Finish with a practical accessory."
  ],
  Streetwear: [
    "Pair it with oversized or relaxed pieces.",
    "Add chunky sneakers.",
    "Finish with a crossbody bag or statement accessory."
  ],
  Y2K: [
    "Pair it with fitted or cropped pieces.",
    "Add chunky shoes or sneakers.",
    "Finish with a small bag or statement accessories."
  ],
  Vintage: [
    "Pair it with classic denim or neutral pieces.",
    "Add vintage-inspired footwear.",
    "Use accessories to complete the retro look."
  ],
  Minimalist: [
    "Keep the outfit simple and neutral.",
    "Pair it with clean, simple shoes.",
    "Use minimal accessories."
  ],
  Elegant: [
    "Pair it with tailored or polished pieces.",
    "Choose simple, refined footwear.",
    "Add subtle jewellery or a structured bag."
  ],
  Preppy: [
    "Pair it with structured or classic pieces.",
    "Add loafers or clean sneakers.",
    "Finish with simple accessories."
  ],
  Sporty: [
    "Pair it with relaxed athletic pieces.",
    "Add comfortable sneakers.",
    "Finish with a cap or practical bag."
  ]
};

const typeStyles = {
  Jeans: [
    "Pair with a simple T-shirt.",
    "Add sneakers or boots.",
    "Finish with a jacket or crossbody bag."
  ],
  "Cargo Pants": [
    "Pair with an oversized T-shirt.",
    "Add chunky sneakers.",
    "Finish with a crossbody bag."
  ],
  Dress: [
    "Layer with a jacket or blazer.",
    "Choose footwear that matches the occasion.",
    "Finish with a simple bag or jewellery."
  ],
  Hoodie: [
    "Pair with relaxed jeans or trousers.",
    "Add sneakers.",
    "Layer with a jacket or crossbody bag."
  ],
  Blazer: [
    "Pair with a simple top.",
    "Wear with jeans or tailored trousers.",
    "Finish with clean sneakers or loafers."
  ],
  Sneakers: [
    "Pair with relaxed jeans or trousers.",
    "Let the shoes stand out.",
    "Keep the rest of the outfit simple."
  ]
};

/* DIGITAL CLOSET STORAGE */

const WARDROBE_KEY = "ecoutureWardrobe";

function getSavedWardrobe() {
  try {
    const items = JSON.parse(
      localStorage.getItem(WARDROBE_KEY) || "[]"
    );
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Wardrobe read error:", error);
    return [];
  }
}

function saveWardrobe(items) {
  try {
    localStorage.setItem(WARDROBE_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error("Wardrobe save error:", error);
    alert("Could not save clothing. Try using a smaller photo.");
    return false;
  }
}

const conditionLabels = {
  good: "Good Condition",
  excellent: "Excellent",
  stain: "Stain",
  hole: "Hole",
  tear: "Tear",
  faded: "Faded Colour",
  stitching: "Loose Stitching",
  zipper: "Broken Zipper",
  button: "Missing Button"
};

/* CREATE CLOTHING CARD */

function createClothingCard(item) {
  const container = document.getElementById("clothingContainer");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "card";

  const tagClass =
    item.conditionCode === "excellent"
      ? "excellent"
      : item.conditionCode === "good"
      ? ""
      : "repair";

  const img = document.createElement("img");
  img.src = item.image || "";
  img.alt = item.name || "Clothing";

  const heading = document.createElement("h3");
  heading.textContent = item.name || "Clothing";

  const category = document.createElement("p");
  category.textContent = item.category || "Clothing";

  const tag = document.createElement("span");
  tag.className = "tag " + tagClass;
  tag.textContent = item.condition || "";

  const action = document.createElement("div");
  action.className = "action";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "View";

  button.onclick = () => {
    openViewModal(
      item.name,
      item.category,
      item.condition,
      item.image,
      item.conditionCode,
      item.style
    );
  };

  action.appendChild(button);
  card.append(img, heading, category, tag, action);
  container.appendChild(card);
}

/* ADD NEW CLOTHING */

function addClothing() {
  const name = document.getElementById("clothingName").value.trim();
  const category = document.getElementById("clothingCategory").value;
  const condition = document.getElementById("clothingCondition").value;
  const style = document.getElementById("clothingStyle").value;

  if (!uploadedImage || !name) {
    alert("Please add a photo and clothing name.");
    return;
  }

  const item = {
    id: "garment-" + Date.now() + "-" +
      Math.random().toString(36).slice(2, 8),
    name: name,
    category: category,
    condition: conditionLabels[condition] || condition,
    conditionCode: condition,
    style: style,
    image: uploadedImage
  };

  const saved = getSavedWardrobe();
  saved.push(item);

  if (!saveWardrobe(saved)) return;

  createClothingCard(item);
  closeUploadModal();
}

/* RESTORE SAVED CLOTHES AND SYNC WITH ECOSTREAK */

function restoreDigitalCloset() {
  const container = document.getElementById("clothingContainer");
  if (!container) return;

  const saved = getSavedWardrobe();

  const existingCards = Array.from(
    container.querySelectorAll(".card")
  );

  existingCards.forEach((card, index) => {
    const name = card.querySelector("h3")?.textContent.trim();
    const category =
      card.querySelector("p")?.textContent.trim() || "Clothing";
    const image =
      card.querySelector("img")?.getAttribute("src") || "";

    if (!name) return;

    const exists = saved.some(item =>
      item.name === name &&
      item.category === category &&
      item.image === image
    );

    if (!exists) {
      saved.push({
        id: "existing-" + index + "-" +
          name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: name,
        category: category,
        condition:
          card.querySelector(".tag")?.textContent.trim() || "",
        conditionCode: "good",
        style: "Casual",
        image: image
      });
    }
  });

  if (existingCards.length) {
    saveWardrobe(saved);
  }

  saved.forEach(item => {
    if (!item || !item.name || !item.image) return;

    const alreadyVisible = Array.from(
      container.querySelectorAll(".card")
    ).some(card =>
      card.querySelector("h3")?.textContent.trim() === item.name &&
      card.querySelector("p")?.textContent.trim() === item.category &&
      card.querySelector("img")?.getAttribute("src") === item.image
    );

    if (!alreadyVisible) {
      createClothingCard(item);
    }
  });
}

/* VIEW CLOTHING MODAL */

function openViewModal(
  name,
  category,
  conditionText,
  image,
  condition,
  style
) {
  document.getElementById("viewName").textContent = name || "";
  document.getElementById("viewCategory").textContent = category || "";
  document.getElementById("viewCondition").textContent =
    conditionText || "";
  document.getElementById("viewStyle").textContent = style || "";
  document.getElementById("viewImage").src = image || "";

  currentGarment = {
    name,
    category,
    conditionText,
    image,
    condition,
    style
  };

  document.getElementById("recommendations").innerHTML = `
    <div class="option garment-doctor">
      <p style="
        font-size:12px;
        letter-spacing:2px;
        font-weight:bold;
        margin-bottom:8px;
      ">
        E-COUTURE AI VISION
      </p>

      <h3>AI TAILOR</h3>

      <p>
        Let AI examine this garment and discover how
        you could rescue, transform and rewear it.
      </p>

      <button onclick="scanGarment()" style="margin-top:15px;">
        SCAN THIS GARMENT
      </button>
    </div>
  `;

  viewModal.classList.add("show");
}

function closeViewModal() {
  viewModal.classList.remove("show");
}

/* AI GARMENT IMAGE CONVERSION */

async function getGarmentImageData(image) {
  if (!image) {
    throw new Error("No garment image available");
  }

  if (image.startsWith("data:image/")) {
    return image;
  }

  const response = await fetch(image);

  if (!response.ok) {
    throw new Error("Could not load garment image");
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/* AI TAILOR - SCAN GARMENT */

async function scanGarment() {
  if (!currentGarment) return;

  const recommendations =
    document.getElementById("recommendations");

  recommendations.innerHTML = `
    <div class="option garment-doctor">
      <p style="
        font-size:12px;
        letter-spacing:2px;
        font-weight:bold;
      ">
        E-COUTURE AI VISION
      </p>

      <h3>AI VISION SCANNING</h3>

      <p>
        Analysing garment...
        Examining visible condition...
        Finding rescue possibilities...
      </p>
    </div>
  `;

  try {
    const imageData = await getGarmentImageData(
      currentGarment.image
    );

    const response = await fetch("/api/garment-doctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: imageData,
        name: currentGarment.name,
        category: currentGarment.category
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Garment analysis failed");
    }

    recommendations.innerHTML = `
      <div class="option garment-doctor">
        <p style="
          font-size:12px;
          letter-spacing:2px;
          font-weight:bold;
        ">
          E-COUTURE AI VISION
        </p>

        <h3>AI GARMENT ANALYSIS</h3>

        <p>
          <strong>GARMENT</strong>
          ${data.garment || ""}
        </p>

        <p>
          <strong>COLOUR</strong>
          ${data.colour || ""}
        </p>

        <p>
          <strong>VISIBLE CONDITION</strong>
          ${data.condition || ""}
        </p>

        <p>
          <strong>VISIBLE OBSERVATIONS</strong>
          ${data.observation || ""}
        </p>

        <p>
          <strong>AI VERDICT</strong>
          ${data.verdict || ""}
        </p>

        <div class="tailor-actions">
          <button onclick="askTailor('repair')">
            REPAIR
          </button>

          <button onclick="askTailor('restyle')">
            RESTYLE
          </button>

          <button onclick="askTailor('upcycle')">
            UPCYCLE
          </button>
        </div>

        <div id="tailorResult"></div>
      </div>
    `;

  } catch (error) {
    console.error("AI TAILOR Error:", error);

    recommendations.innerHTML = `
      <div class="option garment-doctor">
        <h3>AI TAILOR</h3>
        <p>
          The garment could not be analysed.
          Please try again.
        </p>
        <button onclick="scanGarment()">
          TRY AGAIN
        </button>
      </div>
    `;
  }
}

/* AI TAILOR ACTIONS */

async function askTailor(action) {
  if (!currentGarment) return;

  const result = document.getElementById("tailorResult");
  if (!result) return;

  const actionNames = {
    repair: "Repair Plan",
    restyle: "Restyle Idea",
    upcycle: "Upcycle Idea"
  };

  result.innerHTML = `
    <div class="tailor-result">
      <h3>Creating Your ${actionNames[action]}...</h3>
      <p>AI Tailor is working on your garment.</p>
    </div>
  `;

  try {
    const mainStyle = localStorage.getItem("userStyle");
    const secondaryStyle = localStorage.getItem("userSecondStyle");

    const imageData = await getGarmentImageData(
      currentGarment.image
    );

    const response = await fetch("/api/ai-tailor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: action,
        image: imageData,
        name: currentGarment.name,
        category: currentGarment.category,
        condition: currentGarment.conditionText,
        mainStyle: mainStyle,
        secondStyle: secondaryStyle
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI Tailor request failed");
    }

    result.innerHTML = `
      <div class="tailor-result">
        <p class="tailor-label">
          E-COUTURE AI TAILOR
        </p>

        <h3>${actionNames[action]}</h3>

        <p>
          ${String(data.recommendation || "").replace(/\n/g, "<br>")}
        </p>
      </div>
    `;

  } catch (error) {
    console.error("AI Tailor Error:", error);

    result.innerHTML = `
      <div class="tailor-result">
        <p>
          AI Tailor couldn't create this suggestion.
          Please try again.
        </p>
      </div>
    `;
  }
}

/* AI PERSONAL STYLIST */

function initialiseAIStylist() {
  const aiStyleButton = document.getElementById("aiStyleButton");
  if (!aiStyleButton) return;

  aiStyleButton.addEventListener("click", async () => {
    const occasion =
      document.getElementById("occasion").value.trim();

    const aiResult = document.getElementById("aiResult");

    if (!occasion) {
      aiResult.innerHTML = `
        <p>
          Please tell your AI stylist what you're dressing for.
        </p>
      `;
      return;
    }

    const mainStyle =
      localStorage.getItem("userStyle") || "Casual";

    const secondaryStyle =
      localStorage.getItem("userSecondStyle") || "";

    const clothingCards = document.querySelectorAll(
      "#clothingContainer .card"
    );

    const wardrobe = [];

    clothingCards.forEach(card => {
      const name =
        card.querySelector("h3")?.textContent.trim();

      const category =
        card.querySelector("p")?.textContent.trim();

      const condition =
        card.querySelector(".tag")?.textContent.trim();

      if (name) {
        wardrobe.push({
          name,
          category,
          condition
        });
      }
    });

    if (wardrobe.length === 0) {
      aiResult.innerHTML = `
        <p>
          Add some clothing to your Digital Wardrobe first.
        </p>
      `;
      return;
    }

    aiResult.innerHTML = `
      <p>
        Your AI Personal Stylist is creating your look...
      </p>
    `;

    try {
      const response = await fetch("/api/style-me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          occasion,
          wardrobe,
          mainStyle,
          secondStyle: secondaryStyle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI styling request failed");
      }

      aiResult.innerHTML = `
        <p class="ai-result-label">
          E-COUTURE AI PERSONAL STYLIST
        </p>

        <h3>Your ${occasion} Look</h3>

        <p>
          ${String(data.recommendation || "").replace(/\n/g, "<br>")}
        </p>

        <p class="ai-sustainability-note">
          Styled using pieces already in your Digital Wardrobe.
        </p>
      `;

    } catch (error) {
      console.error("AI Personal Stylist Error:", error);

      aiResult.innerHTML = `
        <p>
          Your AI stylist is temporarily unavailable.
          Please try again.
        </p>
      `;
    }
  });
}

/* START DIGITAL CLOSET */

function initialiseDigitalCloset() {
  restoreDigitalCloset();
  initialiseAIStylist();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initialiseDigitalCloset
  );
} else {
  initialiseDigitalCloset();
}
