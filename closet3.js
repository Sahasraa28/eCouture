let cameraStream = null;
let uploadedImage = null;


/* ELEMENTS */

const uploadModal = document.getElementById("uploadModal");
const viewModal = document.getElementById("viewModal");


/* UPLOAD MODAL */

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
}


/* FILE UPLOAD */

function chooseFile() {
  document.getElementById("fileInput").click();
}

document.getElementById("fileInput").onchange = event => {

  const file = event.target.files[0];

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


/* CAMERA */

async function startCamera() {

  try {

    cameraStream =
      await navigator.mediaDevices.getUserMedia({
        video: true
      });

    document.getElementById("cameraVideo").srcObject =
      cameraStream;

    document.getElementById("uploadOptions").style.display =
      "none";

    document.getElementById("cameraArea").style.display =
      "block";

  } catch (error) {

    alert("Camera permission was denied or is unavailable.");

  }
}


function capturePhoto() {

  const video = document.getElementById("cameraVideo");

  const canvas = document.createElement("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas
    .getContext("2d")
    .drawImage(
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

  cameraStream
    .getTracks()
    .forEach(track => track.stop());

  cameraStream = null;
}


/* ADD CLOTHING */

function addClothing() {

  const name =
    document.getElementById("clothingName").value.trim();

  const category =
    document.getElementById("clothingCategory").value;

  const condition =
    document.getElementById("clothingCondition").value;

  if (!uploadedImage || !name) {
    alert("Please add a photo and clothing name.");
    return;
  }

  const conditionText = {
    good: "Good Condition",
    excellent: "Excellent",
    repair: "Needs Repair"
  }[condition];

  const tagClass =
    condition === "excellent"
      ? "excellent"
      : condition === "repair"
      ? "repair"
      : "";

  const card = document.createElement("div");

  card.className = "card";

  card.innerHTML = `
    <img src="${uploadedImage}" alt="${name}">

    <h3>${name}</h3>

    <p>${category}</p>

    <span class="tag ${tagClass}">
      ${conditionText}
    </span>

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
      condition
    );

  };

  document
    .getElementById("clothingContainer")
    .appendChild(card);

  closeUploadModal();
}


/* VIEW MODAL */

function openViewModal(
  name,
  category,
  conditionText,
  image,
  condition
) {

  document.getElementById("viewName").textContent = name;
  document.getElementById("viewCategory").textContent = category;
  document.getElementById("viewCondition").textContent = conditionText;
  document.getElementById("viewImage").src = image;

  const recommendations = {

    good: `
      <div class="option">
        <h3>✨ OPTION 1 — UPSCALE</h3>
        <ol>
          <li><strong>Add a small graphic</strong> — Print or paint a simple design on the chest or back.</li>
          <li><strong>Crop the bottom</strong> — Cut it slightly shorter for a cleaner, modern fit.</li>
          <li><strong>Change the sleeves</strong> — Roll or cut the sleeves to create a fitted look.</li>
          <li><strong>Add a pocket</strong> — Sew on a small contrasting pocket.</li>
          <li><strong>Distress it lightly</strong> — Add small cuts or faded areas for a streetwear look.</li>
        </ol>
      </div>

      <div class="option">
        <h3>👗 OPTION 2 — STYLING</h3>
        <ol>
          <li><strong>Baggy jeans + chain belt</strong> — Pair with loose jeans.</li>
          <li><strong>Layered jewellery</strong> — Add a silver chain, rings and bracelet.</li>
          <li><strong>Oversized jacket</strong> — Try a zip hoodie, leather jacket or denim jacket.</li>
          <li><strong>Baggy cargos + sneakers</strong> — Create a relaxed silhouette.</li>
          <li><strong>Accessories</strong> — Add sunglasses and a crossbody bag.</li>
        </ol>
      </div>
    `,

    excellent: `
      <div class="option">
        <h3>✨ OPTION 1 — UPSCALE</h3>
        <ol>
          <li><strong>Pocket graphics</strong> — Add a star, flame, butterfly or similar graphic.</li>
          <li><strong>Contrast stitching</strong> — Use white, red or light-blue stitching.</li>
          <li><strong>Rhinestones</strong> — Add a small amount around the pockets.</li>
          <li><strong>Patchwork</strong> — Sew denim or patterned patches onto the jeans.</li>
          <li><strong>Metal details</strong> — Add a few silver studs.</li>
        </ol>
      </div>

      <div class="option">
        <h3>👖 OPTION 2 — STYLING</h3>
        <ol>
          <li><strong>Chain belt</strong> — Add a silver chain hanging from the belt loops.</li>
          <li><strong>Fitted black tee</strong> — Tuck it in slightly.</li>
          <li><strong>Chunky sneakers</strong> — Try bulky skate shoes or retro runners.</li>
          <li><strong>Silver jewellery</strong> — Add chains, rings and a watch.</li>
          <li><strong>Small shoulder bag</strong> — A compact black bag adds a Y2K finish.</li>
        </ol>
      </div>
    `,

    repair: `
      <div class="option">
        <h3>🛠️ LET'S UPSCALE</h3>
        <p>Turn the damage into part of the design.</p>

        <ol>
          <li><strong>Contrast patch</strong> — Sew a black or dark-denim patch over the hole.</li>
          <li><strong>Visible stitching</strong> — Use white, black or red thread.</li>
          <li><strong>Embroidered design</strong> — Cover the hole with a star, flame or lightning bolt.</li>
          <li><strong>Layered patch</strong> — Put patterned fabric underneath and stitch around it.</li>
          <li><strong>Intentional distressing</strong> — Reinforce the hole and add matching details.</li>
        </ol>
      </div>
    `

  };

  document.getElementById("recommendations").innerHTML =
    recommendations[condition];

  viewModal.classList.add("show");
}


function closeViewModal() {
  viewModal.classList.remove("show");
}


/* SEARCH */

document.getElementById("searchInput").oninput = function () {

  const search = this.value.toLowerCase();

  const cards = document.querySelectorAll(".card");

  let found = 0;

  cards.forEach(card => {

    const text = card.innerText.toLowerCase();

    if (text.includes(search)) {
      card.style.display = "flex";
      found++;
    } else {
      card.style.display = "none";
    }

  });

  document.getElementById("noResults").style.display =
    found ? "none" : "block";
};


/* ESCAPE */

document.onkeydown = event => {

  if (event.key === "Escape") {
    closeViewModal();
    closeUploadModal();
  }

};
