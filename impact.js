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

async function changeWaste(period) {

  const wasteData = {

    hour: {
      number: "≈ 10,500",
      amount: "10,500",
      unit: "TONNES PER HOUR",
      periodText: "one hour"
    },

    day: {
      number: "≈ 252,000",
      amount: "252,000",
      unit: "TONNES PER 24 HOURS",
      periodText: "24 hours"
    },

    month: {
      number: "≈ 7.7 MILLION",
      amount: "7.7 million",
      unit: "TONNES PER MONTH",
      periodText: "one month"
    },

    year: {
      number: "92 MILLION",
      amount: "92 million",
      unit: "TONNES PER YEAR",
      periodText: "one year"
    }

  };


  const selected = wasteData[period];


  // Update waste number
  document.getElementById("wasteNumber").textContent =
    selected.number;

  document.getElementById("wasteUnit").textContent =
    selected.unit;


  // Change highlighted button
  const buttons =
    document.querySelectorAll(".time-buttons button");

  buttons.forEach(button => {
    button.classList.remove("active");
  });

  const selectedButton = document.querySelector(
    `.time-buttons button[onclick="changeWaste('${period}')"]`
  );

  if (selectedButton) {
    selectedButton.classList.add("active");
  }


  // Show loading message
  const analysisBox =
    document.getElementById("impactAnalysis");

  analysisBox.textContent =
    "AI is analysing this impact...";


  // Ask Gemini to analyse the impact
  try {

    const response = await fetch("/api/impact-analysis", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        period: selected.periodText,
        amount: selected.amount
      })

    });


    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.error);
    }


    analysisBox.textContent = data.analysis;


  } catch (error) {

    console.error("Impact analysis error:", error);

    analysisBox.textContent =
      "AI analysis is temporarily unavailable. Please try again.";

  }

}