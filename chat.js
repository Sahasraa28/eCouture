const buttons = document.querySelectorAll(".question");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        // Check if this question already has an answer
        let answerBox = button.nextElementSibling;

        // Close ALL other answers
        document.querySelectorAll(".answer-box").forEach(answer => {
            if (answer !== answerBox) {
                answer.remove();
            }
        });

        // If this question is already open, close it
        if (answerBox && answerBox.classList.contains("answer-box")) {
            answerBox.remove();
            return;
        }

        // Create the answer
        answerBox = document.createElement("div");
        answerBox.classList.add("answer-box");

        const answer = button.getAttribute("data-answer");

        answerBox.innerHTML = `
            <strong>eCouture</strong>
            <p>${answer}</p>
        `;

        // Put answer DIRECTLY below the clicked question
        button.insertAdjacentElement("afterend", answerBox);
    });

});
