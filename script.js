const API_URL = "https://football-over-under-api.onrender.com/api/matches";

const matchesList = document.getElementById("matchesList");
const emptyState = document.getElementById("emptyState");
const matchCount = document.getElementById("matchCount");

const filters = document.querySelectorAll(".filter");

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");


/* ==============================
   MOBILE MENU
============================== */

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}


/* ==============================
   FORMAT MATCH TIME
============================== */

function formatMatchTime(dateString) {

  if (!dateString) {
    return "Time unavailable";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}


/* ==============================
   CREATE PREDICTION
============================== */

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
        ${Number(value || 0)}%
      </strong>

      <small>
        Model estimate
      </small>

    </div>
  `;
}


/* ==============================
   CREATE MATCH CARD
============================== */

function createMatchCard(match) {

  return `
    <article
      class="match-card"
      data-match-id="${match.id}"
    >

      <div class="match-top">

        <span class="league">
          🏆 ${match.league || "Football"}
        </span>

        <span class="match-time">
          ${formatMatchTime(match.time)}
        </span>

      </div>


      <div class="teams">

        <div class="team">
          ${match.home || "Home Team"}
        </div>

        <div class="vs">
          VS
        </div>

        <div class="team">
          ${match.away || "Away Team"}
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


/* ==============================
   DISPLAY MATCHES
============================== */

function displayMatches(matches) {

  matchesList.innerHTML = "";

  if (!matches || matches.length === 0) {

    emptyState.classList.remove("hidden");

    matchCount.textContent = "0";

    return;
  }

  emptyState.classList.add("hidden");

  matchCount.textContent = matches.length;

  matches.forEach(match => {

    matchesList.insertAdjacentHTML(
      "beforeend",
      createMatchCard(match)
    );

  });
}


/* ==============================
   LOAD REAL MATCHES
============================== */

async function loadMatches() {

  matchesList.innerHTML = `
    <div class="empty-state">
      <div>⚽</div>
      <h3>Loading matches...</h3>
      <p>Getting today's football fixtures.</p>
    </div>
  `;

  try {

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        "Server returned " + response.status
      );
    }

    const data = await response.json();

    console.log("API response:", data);


    if (!data.success) {

      throw new Error(
        data.message || "Unable to load matches"
      );

    }


    displayMatches(data.matches || []);


  } catch (error) {

    console.error("Match loading error:", error);

    matchCount.textContent = "0";

    matchesList.innerHTML = `
      <div class="empty-state">

        <div>⚠️</div>

        <h3>
          Unable to load matches
        </h3>

        <p>
          Please refresh the page and try again.
        </p>

      </div>
    `;

  }
}


/* ==============================
   FILTERS
============================== */

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

      const predictions =
        card.querySelectorAll(".prediction");


      if (filter === "all") {

        predictions.forEach(prediction => {
          prediction.classList.remove("hidden");
        });

        return;
      }


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

        } else if (
          filter === "under" &&
          label.includes("under")
        ) {

          prediction.classList.remove("hidden");

        } else {

          prediction.classList.add("hidden");

        }

      });

    });

  });

});


/* ==============================
   AUTO REFRESH
============================== */

/*
   Check for new fixtures every 10 minutes.
*/

setInterval(() => {

  loadMatches();

}, 10 * 60 * 1000);


/* ==============================
   START
============================== */

loadMatches();

