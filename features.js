const questions = [
    [
        "Your shirt has a small tear. What do you do?",
        [
            "Throw it away 🗑️",
            "Repair it 🧵",
            "Buy a new one 🛍️"
        ],
        1
    ],

    [
        "You don't wear your jeans anymore. What should you do?",
        [
            "Throw them away 🗑️",
            "Donate them ♻️",
            "Buy new ones 🛍️"
        ],
        1
    ],

    [
        "How can you make clothes last longer?",
        [
            "Take care of them 🧵",
            "Replace them often 🛍️",
            "Throw them away 🗑️"
        ],
        0
    ]
];

let n = 0;
let score = 0;

function show() {

    const currentQuestion = questions[n];

    document.getElementById("q").textContent =
        currentQuestion[0];

    document.getElementById("answers").innerHTML =
        currentQuestion[1]
            .map((answer, index) => {
                return `
                    <button onclick="answer(${index})">
                        ${answer}
                    </button>
                `;
            })
            .join("");
}

function answer(index) {

    if (index === questions[n][2]) {
        score++;
    }

    n++;

    if (n < questions.length) {

        show();

    } else {

        document.getElementById("q").textContent =
            "🌱 Game Complete!";

        document.getElementById("answers").innerHTML =
            "";

        document.getElementById("result").textContent =
            `You scored ${score}/3!`;
    }
}

function showTips() {

    document.getElementById("tipsPopup").style.display =
        "flex";
}

function closeTips() {

    document.getElementById("tipsPopup").style.display =
        "none";
}

document
    .getElementById("tipsPopup")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeTips();
        }

    });

show();