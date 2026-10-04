let current = 0;
let age = "";
let gender = "";
let quizAnswers = [];

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

   if (selected) {
  quizAnswers[current] = selected.textContent.trim();
}

    current++;
    showQuestion();

  } else {
    showResult();
  }
}


function previousQuestion() {

  if (current > 0) {
    current--;
    showQuestion();
  }
}

async function showResult() {

  const description =
    document.getElementById("styleDescription").value.trim();

  // Save the final written answer
  quizAnswers[current] =
    description || "No personal description provided";

  // Show loading screen
  document.getElementById("quizQuestions").style.display = "none";
  document.getElementById("result").style.display = "block";

  document.getElementById("styleName").textContent =
    "✨ AI is analysing your style...";

  document.getElementById("styleDescriptionResult").textContent =
    "Looking at your outfit choices, colours, fit and fashion preferences.";

  document.getElementById("styleCards").innerHTML = "";

  document.getElementById("userWords").textContent =
    description || "No description provided.";

  try {

    const response = await fetch("/api/analyse-style", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        age: age,
        collection: gender,
        answers: quizAnswers,
        description: description
      })

    });

    const profile = await response.json();

    if (!response.ok) {
      throw new Error(profile.error || "Style analysis failed");
    }

    // Sort styles from highest percentage to lowest
    const sorted =
      Object.entries(profile)
        .sort((a, b) => b[1] - a[1]);

const first = sorted[0];
const second = sorted[1];

const hasSecondStyle =
  second && Number(second[1]) > 0;


// Save AI style profile for Digital Closet

localStorage.setItem("userStyle", first[0]);
localStorage.setItem("userStylePercent", first[1]);
localStorage.setItem("userStyleDescription", description);

if (hasSecondStyle) {

  localStorage.setItem("userSecondStyle", second[0]);
  localStorage.setItem("userSecondStylePercent", second[1]);

} else {

  localStorage.removeItem("userSecondStyle");
  localStorage.setItem("userSecondStylePercent", "0");

}


// Display style result

if (hasSecondStyle) {

  document.getElementById("styleName").textContent =
    `${names[first[0]]} × ${names[second[0]]}`;

  document.getElementById("styleDescriptionResult").textContent =
    `${descriptions[first[0]]} Your AI analysis also found an influence of ${names[second[0]]}.`;

} else {

  document.getElementById("styleName").textContent =
    names[first[0]];

  document.getElementById("styleDescriptionResult").textContent =
    descriptions[first[0]];

}

    // Show ALL styles that received more than 0%
    const styleCards = sorted
      .filter(style => style[1] > 0)
      .map(style => `
        <div class="style-card">
          <strong>${style[1]}%</strong><br>
          ${names[style[0]]}
        </div>
      `)
      .join("");

    document.getElementById("styleCards").innerHTML =
      styleCards;

  } catch (error) {

    console.error("Style Quiz AI Error:", error);

    document.getElementById("styleName").textContent =
      "Oops!";

    document.getElementById("styleDescriptionResult").textContent =
      "The AI couldn't analyse your style. Please try the quiz again.";

  }

}


function restartQuiz() {

  current = 0;
  age = "";
  gender = "";
  quizAnswers = [];

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
