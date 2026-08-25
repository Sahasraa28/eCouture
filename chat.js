const buttons = document.querySelectorAll(".question");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const answer = button.getAttribute("data-answer");

    const message = document.createElement("div");
    message.classList.add("message", "bot");

    message.innerHTML = "<strong>eCouture</strong><p>" + answer + "</p>";

    button.insertAdjacentElement("afterend", message);
  });
});
