const buttons = document.querySelectorAll(".question");
const chatBox = document.getElementById("chatMessages");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const answer = button.getAttribute("data-answer");

    const message = document.createElement("div");
    message.classList.add("message", "bot");

    message.innerHTML = "<strong>eCouture</strong><p>" + answer + "</p>";

    chatBox.appendChild(message);
  });
});
