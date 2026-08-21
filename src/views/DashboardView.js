"use strict";

import { formatDate, bandIndex } from "../helpers/utils";

export class DashboardView {
  constructor() {
    this._parentEl = document.querySelector("#app");
  }

  render(trips) {
    const cards = trips
      .map((trip) => {
        return `
                <div class="trip-card" data-id="${trip.id}">
                    <div class="trip-card__band trip-card__band--${bandIndex(trip.id)}"></div>
                    <div class="trip-card__body">
                        <div class="trip-card__header">
                            <h3 class="trip-card__name">${trip.name}</h3>
                            <h3 class="trip-card__count">${trip.activities.length} activities</h3>
                        </div>
                        <p class="trip-card__dates">${formatDate(trip.start)} - ${formatDate(trip.end)}</p>
                        <div class="trip-card__foot">
                            <button class="trip-card__delete delete-btn" data-id="${trip.id}">Delete</button>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    const html = `<div class="trip-grid">${cards}</div>`;
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
