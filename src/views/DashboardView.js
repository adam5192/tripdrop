"use strict";

export class DashboardView {
  constructor() {
    this._parentEl = document.querySelector("#app");
  }

  render(trips) {
    const html = trips
      .map((trip) => {
        return `
                <div class="trip-card" data-id="${trip.id}">
                    <h3>${trip.name}</h3>
                    <h3>${trip.start}-${trip.end}</h3>
                    <!-- whatever else -->
                    <button class="delete-btn" data-id="${trip.id}">Delete</button>
                    -----------------------------
                </div>
            `;
      })
      .join("");

    this._parentEl.innerHTML = ""; // clear old content
    this._parentEl.insertAdjacentHTML("beforeend", html);
  }

  addDeleteHandler(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".delete-btn");
      if (!btn) return;

      const id = btn.dataset.id;
      handler(id);
    });
  }

  addOpenHandler(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const card = e.target.closest(".trip-card");

      if (!card) return;
      if (e.target.closest(".delete-btn")) return;

      const id = card.dataset.id;
      handler(id);
    });
  }
}
