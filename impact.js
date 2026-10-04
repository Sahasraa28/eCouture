const faders = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

faders.forEach(el => observer.observe(el));

// =========================
// IMPACT MONITOR
// =========================

function changeWaste(period) {

  const wasteData = {
    hour: {
      number: "≈ 10,500",
      unit: "TONNES PER HOUR"
    },

    day: {
      number: "≈ 252,000",
      unit: "TONNES PER 24 HOURS"
    },

    month: {
      number: "≈ 7.7 MILLION",
      unit: "TONNES PER MONTH"
    },

    year: {
      number: "92 MILLION",
      unit: "TONNES PER YEAR"
    }
  };

  document.getElementById("wasteNumber").textContent =
    wasteData[period].number;

  document.getElementById("wasteUnit").textContent =
    wasteData[period].unit;


  // Change which button is highlighted
  const buttons = document.querySelectorAll(".time-buttons button");

  buttons.forEach(button => {
    button.classList.remove("active");
  });

  const selectedButton = document.querySelector(
    `.time-buttons button[onclick="changeWaste('${period}')"]`
  );

  selectedButton.classList.add("active");
}