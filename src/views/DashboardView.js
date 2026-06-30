"use strict";

export class DashboardView {
  constructor() {
    this._parentEl = document.querySelector("#app");
  }

  render(trips) {
    const html = trips
      .map((trip) => {
        return `
                <div class="trip-card">
                    <h3>${trip.name}</h3>
                    <h3>${trip.start}-${trip.end}</h3>
                    <!-- whatever else -->
                    -----------------------------
                </div>
            `;
      })
      .join("");

    this._parentEl.innerHTML = ""; // clear old content
    this._parentEl.insertAdjacentHTML("beforeend", html);
  }
}
