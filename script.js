```javascript
/*
  O/U PREDICTOR
  Frontend prediction display

  Later this file can be connected to your backend API.
*/


const matches = [

  {
    id: 1,
    league: "Premier League",
    home: "Arsenal",
    away: "Chelsea",
    time: "20:00",

    over05: 96,
    over15: 84,
    over25: 68,
    over35: 44,

    under15: 16,
    under25: 32,
    under35: 56
  },

  {
    id: 2,
    league: "La Liga",
    home: "Barcelona",
    away: "Sevilla",
    time: "18:30",

    over05: 97,
    over15: 88,
    over25: 73,
    over35: 49,

    under15: 12,
    under25: 27,
    under35: 51
  },

  {
    id: 3,
    league: "Serie A",
    home: "Inter Milan",
    away: "Roma",
    time: "19:45",

    over05: 94,
    over15: 79,
    over25: 61,
    over35: 37,

    under15: 21,
    under25: 39,
    under35: 63
  },

  {
    id: 4,
    league: "Bundesliga",
    home: "Bayern Munich",
    away: "Dortmund",
    time: "17:30",

    over05: 98,
    over15: 91,
    over25: 76,
    over35: 55,

    under15: 9,
    under25: 24,
    under35: 45
  }

];


/* -------------------------------
   DOM ELEMENTS
-------------------------------- */

const matchesList = document.getElementById("matchesList");
const emptyState = document.getElementById("emptyState");
const matchCount = document.getElementById("matchCount");

const filters = document.querySelectorAll(".filter");

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");


/* -------------------------------
   MOBILE MENU
-------------------------------- */

menuBtn.addEventListener("click", () => {

  navMenu.classList.toggle("open");

});


/* -------------------------------
   CREATE PREDICTION
-------------------------------- */

function createPrediction(label, value, type) {

  const valueClass =
    type === "over"
      ? "over-value"
      : "under-value";

  return `
    <div class="prediction">

      <span class="prediction-label">
        ${label}
      </span>

      <strong class="prediction-value ${valueClass}">
        ${value}%
      </strong>

      <small>
        Model estimate
      </small>

    </div>
  `;
}


/* -------------------------------
   CREATE MATCH CARD
-------------------------------- */

function createMatchCard(match) {

  return `

    <article
      class="match-card"
      data-match-id="${match.id}"
    >

      <div class="match-top">

        <span class="league">
          🏆 ${match.league}
        </span>

        <span class="match-time">
          ${match.time}
        </span>

      </div>


      <div class="teams">

        <div class="team">
          ${match.home}
        </div>

        <div class="vs">
          VS
        </div>

        <div class="team">
          ${match.away}
        </div>

      </div>


      <div class="predictions">

        ${createPrediction(
          "OVER 0.5",
          match.over05,
          "over"
        )}

        ${createPrediction(
          "OVER 1.5",
          match.over15,
          "over"
        )}

        ${createPrediction(
          "OVER 2.5",
          match.over25,
          "over"
        )}

        ${createPrediction(
          "OVER 3.5",
          match.over35,
          "over"
        )}

        ${createPrediction(
          "UNDER 1.5",
          match.under15,
          "under"
        )}

        ${createPrediction(
          "UNDER 2.5",
          match.under25,
          "under"
        )}

        ${createPrediction(
          "UNDER 3.5",
          match.under35,
          "under"
        )}

      </div>

    </article>

  `;
}


/* -------------------------------
   DISPLAY MATCHES
-------------------------------- */

function displayMatches(list = matches) {

  matchesList.innerHTML = "";

  if (list.length === 0) {

    emptyState.classList.remove("hidden");

    matchCount.textContent = "0";

    return;
  }

  emptyState.classList.add("hidden");

  matchCount.textContent = list.length;

  list.forEach(match => {

    matchesList.innerHTML += createMatchCard(match);

  });

}


/* -------------------------------
   FILTERS
-------------------------------- */

filters.forEach(button => {

  button.addEventListener("click", () => {

    filters.forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const filter = button.dataset.filter;

    const cards =
      document.querySelectorAll(".match-card");


    cards.forEach(card => {

      if (filter === "all") {

        card.classList.remove("hidden");

        return;
      }


      const predictions =
        card.querySelectorAll(".prediction");


      predictions.forEach(prediction => {

        const label =
          prediction
            .querySelector(".prediction-label")
            .textContent
            .toLowerCase();


        if (
          filter === "over" &&
          label.includes("over")
        ) {

          prediction.classList.remove("hidden");

        }

        else if (
          filter === "under" &&
          label.includes("under")
        ) {

          prediction.classList.remove("hidden");

        }

        else {

          prediction.classList.add("hidden");

        }

      });

    });

  });

});


/* -------------------------------
   START WEBSITE
-------------------------------- */

displayMatches();


/*
  ------------------------------------
  FUTURE API CONNECTION
  ------------------------------------

  When your backend is ready, replace
  the demo data with something similar:

  async function loadRealMatches() {

    try {

      const response = await fetch(
        "YOUR-BACKEND-URL/api/matches"
      );

      if (!response.ok) {
        throw new Error("Failed to load matches");
      }

      const data = await response.json();

      displayMatches(data);

    } catch (error) {

      console.error(error);

    }

  }

  loadRealMatches();

*/
```

