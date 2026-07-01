"use strict";

export class TripView {
  constructor() {
    this._parentEl = document.querySelector("#app");
  }

  render(trip) {
    const html = `
    <button class="back-btn">Back</button>
    <h2>${trip.name}</h2>
    <p>${trip.destination}</p>

    <h3>Activities</h3>
    <div class="activity-list">
        ${trip.activities.length === 0 ? "<p>No activities yet</p>" : ""}
    </div>
    `;

    this._parentEl.innerHTML = "";
    this._parentEl.insertAdjacentHTML("beforeend", html);
  }

  addBackHandler(handler) {
    this._parentEl.addEventListener("click", (e) => {
      if (e.target.closest(".back-btn")) handler();
    });
  }
}
