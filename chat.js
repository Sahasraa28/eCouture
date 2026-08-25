const buttons = document.querySelectorAll(".question");

buttons.forEach(button => {
    button.addEventListener("click", () => {

        // Close any currently open answer
        document.querySelectorAll(".answer-box").forEach(answer => {
            answer.remove();
        });

        // Create the answer box
        const answerBox = document.createElement("div");
        answerBox.className = "answer-box";

        const answer = button.getAttribute("data-answer");

        answerBox.innerHTML = `
            <strong>eCouture</strong>
            <p>${answer}</p>
        `;

        // Put it directly underneath THIS question
        button.parentNode.insertBefore(answerBox, button.nextSibling);
    });
});
