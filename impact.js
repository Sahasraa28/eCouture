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

// =====================================================
// E-COUTURE GLOBAL FASHION WASTE GLOBE
// =====================================================

const wasteCountries = {

  china: {
    id: "china",
    number: "01",
    name: "CHINA",
    waste: "≈ 26 MILLION",

    lat: 35.8617,
    lng: 104.1954,

    description:
      "China generates an estimated 26 million tonnes of textile and clothing waste. Extending garment life through reuse, repair and recycling can help reduce the pressure created by disposable fashion."
  },


  usa: {
    id: "usa",
    number: "02",
    name: "USA",
    waste: "≈ 17 MILLION",

    lat: 37.0902,
    lng: -95.7129,

    description:
      "The United States generates an estimated 17 million tonnes of textile and clothing waste. Rewearing clothes for longer can help challenge the culture of frequent disposal and replacement."
  },


  india: {
    id: "india",
    number: "03",
    name: "INDIA",
    waste: "≈ 7.8 MILLION",

    lat: 20.5937,
    lng: 78.9629,

    description:
      "India generates an estimated 7.8 million tonnes of textile and clothing waste. Repair, reuse and upcycling can help keep garments in use and support a more circular fashion system."
  }

};


const globeContainer =
  document.getElementById("fashionGlobe");


let fashionGlobe = null;


if (globeContainer && typeof Globe !== "undefined") {

  const globeData =
    Object.values(wasteCountries);


  fashionGlobe =
    Globe()(globeContainer)

      .width(globeContainer.clientWidth)

      .height(
        window.innerWidth <= 500
          ? 390
          : window.innerWidth <= 900
          ? 500
          : 570
      )

      .backgroundColor(
        "rgba(0,0,0,0)"
      )

      .globeImageUrl(
        "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )

      .bumpImageUrl(
        "https://unpkg.com/three-globe/example/img/earth-topology.png"
      )

      .showAtmosphere(true)

      .atmosphereColor(
        "#dce9e4"
      )

      .atmosphereAltitude(
        0.18
      )


      // =========================
      // PULSING LOCATION RINGS
      // =========================

      .ringsData(globeData)

      .ringLat("lat")

      .ringLng("lng")

      .ringColor(
        () => [
          "rgba(255,255,255,0.8)",
          "rgba(255,255,255,0)"
        ]
      )

      .ringMaxRadius(4)

      .ringPropagationSpeed(2)

      .ringRepeatPeriod(900)


      // =========================
      // CLICKABLE HTML MARKERS
      // =========================

      .htmlElementsData(globeData)

      .htmlLat("lat")

      .htmlLng("lng")

      .htmlAltitude(0.02)

      .htmlElement(country => {

        const marker =
          document.createElement("div");

        marker.className =
          "globe-marker";

        marker.innerHTML = `
          <div class="globe-marker-dot"></div>

          <div class="globe-marker-label">
            ${country.name}
          </div>
        `;


        marker.onclick = event => {

          event.stopPropagation();

          selectWasteCountry(
            country.id
          );

        };


        return marker;

      });


  // =========================
  // INITIAL VIEW
  // =========================

  fashionGlobe.pointOfView(
    {
      lat: 24,
      lng: 70,
      altitude: 2.1
    },
    0
  );


  // =========================
  // AUTO ROTATION
  // =========================

  const controls =
    fashionGlobe.controls();

  controls.autoRotate = true;

  controls.autoRotateSpeed = 0.45;

  controls.enableDamping = true;

  controls.dampingFactor = 0.08;


  // Stop rotating while user interacts

  globeContainer.addEventListener(
    "pointerdown",
    () => {
      controls.autoRotate = false;
    }
  );


  // =========================
  // RESPONSIVE GLOBE
  // =========================

  window.addEventListener(
    "resize",
    () => {

      if (!fashionGlobe) return;

      fashionGlobe.width(
        globeContainer.clientWidth
      );


      if (window.innerWidth <= 500) {

        fashionGlobe.height(390);

      }

      else if (window.innerWidth <= 900) {

        fashionGlobe.height(500);

      }

      else {

        fashionGlobe.height(570);

      }

    }
  );

}


// =====================================================
// SELECT COUNTRY
// =====================================================

function selectWasteCountry(countryId) {

  const country =
    wasteCountries[countryId];


  if (!country) return;


  // UPDATE INFORMATION

  document.getElementById(
    "countryNumber"
  ).textContent =
    country.number;


  document.getElementById(
    "countryName"
  ).textContent =
    country.name;


  document.getElementById(
    "countryWaste"
  ).textContent =
    country.waste;


  document.getElementById(
    "countryDescription"
  ).textContent =
    country.description;


  // =========================
  // UPDATE BUTTON
  // =========================

  const buttons =
    document.querySelectorAll(
      ".country-buttons button"
    );


  buttons.forEach(button => {

    button.classList.remove(
      "active"
    );

  });


  const names = {
    china: "CHINA",
    usa: "USA",
    india: "INDIA"
  };


  buttons.forEach(button => {

    if (
      button.textContent.trim() ===
      names[countryId]
    ) {

      button.classList.add(
        "active"
      );

    }

  });


  // =========================
  // ROTATE GLOBE TO COUNTRY
  // =========================

  if (fashionGlobe) {

    fashionGlobe.controls().autoRotate =
      false;


    fashionGlobe.pointOfView(

      {
        lat: country.lat,
        lng: country.lng,
        altitude: 1.65
      },

      1200

    );

  }

}
