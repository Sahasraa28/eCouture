const buttons = document.querySelectorAll(".question");
buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        const question = button.dataset.answer;
        askquestion(question)
    });
});
