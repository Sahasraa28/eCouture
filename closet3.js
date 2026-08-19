let cameraStream = null;
let uploadedImage = null;

const uploadModal = document.getElementById("uploadModal");
const viewModal = document.getElementById("viewModal");

document.getElementById("uploadButton").onclick = () => {
  uploadModal.classList.add("show");
};

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

  } catch {
    alert("Camera permission was denied or is unavailable.");
  }
}

function capturePhoto() {
  const video = document.getElementById("cameraVideo");
  const canvas = document.createElement("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  showPreview(canvas.toDataURL("image/jpeg"));
  stopCamera();
}

function stopCamera() {
  if (!cameraStream) return;

  cameraStream.getTracks().forEach(track => track.stop());
  cameraStream = null;
}

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
  "Jeans": [
    "Pair with a simple T-shirt.",
    "Add sneakers or boots.",
    "Finish with a jacket or crossbody bag."
  ],

  "Cargo Pants": [
    "Pair with an oversized T-shirt.",
    "Add chunky sneakers.",
    "Finish with a crossbody bag."
  ],

  "Dress": [
    "Layer with a jacket or blazer.",
    "Choose footwear that matches the occasion.",
    "Finish with a simple bag or jewellery."
  ],

  "Hoodie": [
    "Pair with relaxed jeans or trousers.",
    "Add sneakers.",
    "Layer with a jacket or crossbody bag."
  ],

  "Blazer": [
    "Pair with a simple top.",
    "Wear with jeans or tailored trousers.",
    "Finish with clean sneakers or loafers."
  ],

  "Sneakers": [
    "Pair with relaxed jeans or trousers.",
    "Let the shoes stand out.",
    "Keep the rest of the outfit simple."
  ]
};

function addClothing() {
  const name = document.getElementById("clothingName").value.trim();
  const category = document.getElementById("clothingCategory").value;
  const condition = document.getElementById("clothingCondition").value;
  const style = document.getElementById("clothingStyle").value;

  if (!uploadedImage || !name) {
    alert("Please add a photo and clothing name.");
    return;
  }

  const conditionText = {
    good: "Good Condition",
    excellent: "Excellent",
    stain: "Stain",
    hole: "Hole",
    tear: "Tear",
    faded: "Faded Colour",
    stitching: "Loose Stitching",
    zipper: "Broken Zipper",
    button: "Missing Button"
  }[condition];

  const tagClass =
    condition === "excellent"
      ? "excellent"
      : condition === "good"
      ? ""
      : "repair";

  const card = document.createElement("div");

  card.className = "card";

  card.innerHTML = `
    <img src="${uploadedImage}" alt="${name}">
    <h3>${name}</h3>
    <p>${category}</p>
    <span class="tag ${tagClass}">${conditionText}</span>
    <div class="action">
      <button>View</button>
    </div>
  `;

  card.querySelector("button").onclick = () => {
    openViewModal(
      name,
      category,
      conditionText,
      uploadedImage,
      condition,
      style
    );
  };

  document
    .getElementById("clothingContainer")
    .appendChild(card);

  closeUploadModal();
}

function openViewModal(
  name,
  category,
  conditionText,
  image,
  condition,
  style
) {
  document.getElementById("viewName").textContent = name;
  document.getElementById("viewCategory").textContent = category;
  document.getElementById("viewCondition").textContent = conditionText;
  document.getElementById("viewStyle").textContent = style;
  document.getElementById("viewImage").src = image;

  let ideas = upscale[condition] || upscale.good;

  let html = `
    <div class="option">
      <h3>✨ UPSCALE</h3>
      <ol>
        ${ideas.map(x => `<li>${x}</li>`).join("")}
      </ol>
    </div>
  `;

  const repair =
    !["good", "excellent"].includes(condition);

  if (!repair) {
    const styleIdeas =
      typeStyles[category] || styles[style];

    html += `
      <div class="option">
        <h3>👕 STYLE</h3>
        <ol>
          ${styleIdeas.map(x => `<li>${x}</li>`).join("")}
        </ol>
      </div>
    `;
  }

  document.getElementById("recommendations").innerHTML = html;
  viewModal.classList.add("show");
}

function closeViewModal() {
  viewModal.classList.remove("show");
}

document.getElementById("searchInput").oninput = function() {
  const search = this.value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  let found = 0;

  cards.forEach(card => {
    const match = card.innerText.toLowerCase().includes(search);
    card.style.display = match ? "flex" : "none";
    if (match) found++;
  });

  document.getElementById("noResults").style.display =
    found ? "none" : "block";
};

document.onkeydown = event => {
  if (event.key === "Escape") {
    closeViewModal();
    closeUploadModal();
  }
};