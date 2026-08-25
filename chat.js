const buttons = document.querySelectorAll(".question");

buttons.forEach(button => {
    button.addEventListener("click", function () {

        // Close any answer that is currently open
        document.querySelectorAll(".answer-box").forEach(answer => {
            answer.remove();
        });

        // Create the answer box
        const answerBox = document.createElement("div");
        answerBox.classList.add("answer-box");

        // Get the answer from the question
        const answer = button.getAttribute("data-answer");

        answerBox.innerHTML = `
            <strong>eCouture</strong>
            <p>${answer}</p>
        `;

        // Place the answer directly below the clicked question
        button.insertAdjacentElement("afterend", answerBox);
    });
});
