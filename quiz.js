let current = 0;
let age = "";
let gender = "";

const questions = document.querySelectorAll(".question");

const scores = {
  y2k: 0,
  streetwear: 0,
  casual: 0,
  chic: 0,
  elegant: 0,
  sporty: 0,
  minimalist: 0,
  preppy: 0
};

const names = {
  y2k: "💿 Y2K",
  streetwear: "🖤 Streetwear",
  casual: "👖 Casual",
  chic: "🤍 Chic",
  elegant: "✨ Elegant",
  sporty: "🏃 Sporty",
  minimalist: "🌿 Minimalist",
  preppy: "🎀 Preppy"
};

const descriptions = {
  y2k: "You love playful, nostalgic outfits with fun details, denim, statement accessories and a confident attitude.",
  streetwear: "You love relaxed silhouettes, layers, sneakers and outfits that feel effortless and cool.",
  casual: "You prefer comfortable, practical outfits that are easy to wear while still looking stylish.",
  chic: "You like polished outfits, clean silhouettes and pieces that always look put-together.",
  elegant: "You prefer sophisticated, refined outfits with graceful silhouettes, timeless colours and beautiful details.",
  sporty: "You like comfortable, practical clothing with an active feel and easy-to-wear pieces.",
  minimalist: "You prefer simple outfits, clean lines, neutral colours and pieces that work well together.",
  preppy: "You enjoy neat, classic outfits with coordinated colours, structured pieces and timeless details."
};


/* START */

function startQuiz() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("quizQuestions").style.display = "block";
  showQuestion();
}


/* ANSWER SELECTION */

document.addEventListener("click", e => {
  const answer = e.target.closest(".answer");
  if (!answer) return;

  answer.parentElement.querySelectorAll(".answer")
    .forEach(a => a.classList.remove("selected"));

  answer.classList.add("selected");

  if (current === 0) age = answer.dataset.value;

  if (current === 1) {
    gender = answer.dataset.value;
    createQuestions();
  }
});


/* QUESTION DATA */

function createQuestions() {

  const data = {

    outfitAnswers: {
      child: [
        ["casual", "🌈 Colourful T-shirt, comfy jeans & sneakers"],
        ["sporty", "🏃 Joggers, sweatshirt & trainers"],
        ["preppy", "🎀 Polo shirt, shorts & sneakers"],
        ["elegant", "✨ Cardigan, comfortable trousers & flats"]
      ],

      teen: [
        ["casual", "👖 Straight-leg jeans, T-shirt & sneakers"],
        ["streetwear", "🖤 Oversized hoodie, cargos & sneakers"],
        ["preppy", "🎀 Knit sweater, trousers & loafers"],
        ["elegant", "✨ Button-up shirt, trousers & loafers"]
      ],

      adult: [
        ["y2k", "💿 Baggy jeans, fitted top & chunky sneakers"],
        ["streetwear", "🖤 Oversized hoodie, cargos & sneakers"],
        ["casual", "👖 Jorts, fitted top & Converse"],
        ["elegant", "✨ Flowy trousers, structured top & clean shoes"]
      ]
    },

    accessoryAnswers: {
      child: [
        ["casual", "🌈 Colourful backpack"],
        ["sporty", "🏃 Sports watch"],
        ["preppy", "🎀 Fun hair accessory or cap"],
        ["y2k", "💿 Colourful bracelet or fun sunglasses"]
      ],

      teen: [
        ["streetwear", "🖤 Crossbody bag & cap"],
        ["casual", "🎒 Canvas tote bag"],
        ["preppy", "🎀 Simple watch & classic bag"],
        ["elegant", "✨ Simple necklace or bracelet"]
      ],

      adult: [
        ["y2k", "💿 Silver chain belt & statement accessories"],
        ["streetwear", "🖤 Crossbody bag & cap"],
        ["chic", "🤍 Minimal gold jewellery"],
        ["elegant", "✨ Elegant watch & delicate jewellery"]
      ]
    },

    fitAnswers: {
      child: [
        ["casual", "Comfortable and relaxed"],
        ["sporty", "Loose and easy to move in"],
        ["preppy", "Neat and comfortable"],
        ["y2k", "Fun and colourful"]
      ],

      teen: [
        ["casual", "Relaxed and comfortable"],
        ["streetwear", "Oversized and loose"],
        ["preppy", "Neat and classic"],
        ["elegant", "Clean and structured"]
      ],

      adult: [
        ["y2k", "Baggy bottoms + fitted top"],
        ["streetwear", "Oversized everything"],
        ["casual", "Relaxed and comfortable"],
        ["chic", "Structured and fitted"],
        ["elegant", "Clean and refined"],
        ["minimalist", "Simple and streamlined"]
      ]
    },

    jacketAnswers: {
      child: [
        ["casual", "🧥 Colourful zip-up jacket"],
        ["sporty", "🏃 Lightweight sports jacket"],
        ["streetwear", "🖤 Oversized sweatshirt jacket"],
        ["preppy", "🎒 Classic cardigan"]
      ],

      teen: [
        ["casual", "👖 Denim jacket"],
        ["streetwear", "🖤 Oversized bomber jacket"],
        ["preppy", "🎀 Varsity jacket"],
        ["elegant", "✨ Structured blazer"]
      ],

      adult: [
        ["y2k", "💿 Cropped denim jacket"],
        ["streetwear", "🖤 Oversized leather bomber jacket"],
        ["chic", "🤍 Tailored blazer"],
        ["elegant", "✨ Classic structured jacket"]
      ]
    },

    colourAnswers: {
      child: [
        ["y2k", "🌈 Bright pink, blue, purple & colourful shades"],
        ["sporty", "🏃 Blue, red, black & white"],
        ["casual", "👕 Denim, green, blue & yellow"],
        ["preppy", "🎀 Navy, white, light blue & pastel"]
      ],

      teen: [
        ["streetwear", "🖤 Black, grey & dark green"],
        ["casual", "👖 Denim, white, beige & blue"],
        ["preppy", "🎀 Navy, white, burgundy & pastel"],
        ["elegant", "✨ Cream, navy, brown & neutral tones"]
      ],

      adult: [
        ["y2k", "💿 Pink, silver, denim & black"],
        ["streetwear", "🖤 Black, grey & dark green"],
        ["chic", "🤍 Cream, beige & white"],
        ["elegant", "✨ Black, cream, navy & neutral tones"],
        ["preppy", "🎀 Navy, white, burgundy & pastel"],
        ["minimalist", "🌿 White, beige, grey & soft earth tones"]
      ]
    },

    priorityAnswers: {
      child: [
        ["casual", "😊 Being comfortable"],
        ["sporty", "🏃 Being able to move around easily"],
        ["y2k", "🌈 Wearing fun and colourful clothes"],
        ["preppy", "🎒 Looking neat and put-together"]
      ],

      teen: [
        ["streetwear", "🖤 Making a statement"],
        ["casual", "😊 Feeling comfortable"],
        ["preppy", "🎀 Looking neat and coordinated"],
        ["elegant", "✨ Looking polished"]
      ],

      adult: [
        ["y2k", "💿 Looking unique & trendy"],
        ["streetwear", "🖤 Making a statement"],
        ["casual", "😊 Feeling comfortable"],
        ["chic", "🤍 Looking polished"],
        ["elegant", "✨ Looking sophisticated"],
        ["minimalist", "🌿 Keeping things simple"],
        ["sporty", "🏃 Being comfortable and active"],
        ["preppy", "🎀 Looking neat and put-together"]
      ]
    }
  };

  Object.entries(data).forEach(([id, options]) => {
    addAnswers(id, options[age]);
  });
}


/* ADD ANSWERS */

function addAnswers(id, options) {

  const box = document.getElementById(id);
  box.innerHTML = "";

  options.forEach(([style, text]) => {

    const div = document.createElement("div");

    div.className = "answer";
    div.dataset.style = style;
    div.textContent = text;

    box.appendChild(div);
  });
}


/* SHOW QUESTION */

function showQuestion() {

  questions.forEach((q, i) => {
    q.classList.toggle("active", i === current);
  });

  document.getElementById("progress").style.width =
    ((current + 1) / questions.length) * 100 + "%";

  document.getElementById("nextButton").textContent =
    current === questions.length - 1
      ? "See My Style ✨"
      : "Next →";
}


/* NEXT */

function nextQuestion() {

  const selected =
    questions[current].querySelector(".selected");

  if (current < questions.length - 1) {

    if (!selected) {
      alert("Please choose an answer first! 💗");
      return;
    }

    if (current >= 2 && selected.dataset.style) {
      scores[selected.dataset.style]++;
    }

    current++;
    showQuestion();

  } else {
    showResult();
  }
}


/* BACK */

function previousQuestion() {

  if (current > 0) {
    current--;
    showQuestion();
  }
}


/* RESULT */

function showResult() {

  const description =
    document.getElementById("styleDescription").value.trim();

  const sorted =
    Object.entries(scores)
      .sort((a, b) => b[1] - a[1]);

  const first = sorted[0];
  const second = sorted[1];

  const total =
    Object.values(scores)
      .reduce((a, b) => a + b, 0);

  const firstPercent =
    Math.round(first[1] / total * 100);

  const secondPercent =
    Math.round(second[1] / total * 100);

  const other =
    100 - firstPercent - secondPercent;

  document.getElementById("styleName").textContent =
    `${names[first[0]]} × ${names[second[0]]}`;

  document.getElementById("styleDescriptionResult").textContent =
    `${descriptions[first[0]]} You also have a touch of ${names[second[0]]} in your wardrobe preferences.`;

  document.getElementById("styleCards").innerHTML = `
    <div class="style-card">
      <strong>${firstPercent}%</strong><br>
      ${names[first[0]]}
    </div>

    <div class="style-card">
      <strong>${secondPercent}%</strong><br>
      ${names[second[0]]}
    </div>

    <div class="style-card">
      <strong>${other}%</strong><br>
      Other styles
    </div>
  `;

  document.getElementById("userWords").textContent =
    description || "You didn't add a description.";

  document.getElementById("quizQuestions").style.display = "none";
  document.getElementById("result").style.display = "block";
}


/* RESTART */

function restartQuiz() {

  current = 0;
  age = "";
  gender = "";

  Object.keys(scores).forEach(style => {
    scores[style] = 0;
  });

  document.querySelectorAll(".answer")
    .forEach(a => a.classList.remove("selected"));

  document.getElementById("styleDescription").value = "";

  document.getElementById("result").style.display = "none";
  document.getElementById("intro").style.display = "block";
  document.getElementById("quizQuestions").style.display = "none";

  document.getElementById("progress").style.width = "0%";
}
