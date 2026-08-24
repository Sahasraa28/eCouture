const buttons = document.querySelectorAll(".question");
const chatMessages = document.querySelector("#chatMessages");

buttons.forEach(function(button) {
    button.addEventListener("click", function() {

        const question = button.textContent.trim();
        const answer = button.dataset.answer;

        askQuestion(question, answer);
    });
});


function askQuestion(question, answer) {

    // Show the user's question
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user");

    userMessage.innerHTML = `
        <p>${question}</p>
    `;

    chatMessages.appendChild(userMessage);


    // Show eCouture's answer
    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot");

    botMessage.innerHTML = `
        <strong>eCouture</strong>
        <p>${answer}</p>
    `;

    chatMessages.appendChild(botMessage);


    // Scroll to the newest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
