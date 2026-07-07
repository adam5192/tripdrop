"use strict";

import { searchPlaces } from "../data/geocode";

export class TripView {
  constructor() {
    this._parentEl = document.querySelector("#app");
    this._countryCode = "";
    this._editingId = null;
    this._addActivitySearchHandler();
    this._addResultClickHandler();
  }

  render(trip) {
    this._countryCode = trip.countryCode;
    const html = `
    <button class="back-btn">Back</button>
    <h2>${trip.name}</h2>
    <p>${trip.destination}</p>
    <div id="map"></div>

    <h3>Activities</h3>
    <div class="activity-list">
        ${
          trip.activities.length === 0
            ? "<p>No activities yet</p>"
            : trip.activities
                .map((activity) => {
                  const isEditing = activity.id === this._editingId;

                  const nameHtml = isEditing
                    ? `
                  <input class="edit-name-input" value="${activity.name}" data-id="${activity.id}">
                  <button class="save-edit-btn" data-id="${activity.id}">Save</button>
                  `
                    : `
                  <span class="activity-card__name">${activity.name}</span>
                  <button class="edit-btn" data-id="${activity.id}">Edit</button>
                  `;

                  return `
                  <div class="activity-card" data-id="${activity.id}">
                    <div class="activity-card__header">
                        ${nameHtml}
                        <span class="activity-card__type">${activity.type}</span>
                    </div>
                    <div class="activity-card__meta">
                        <span class="activity-card__city">${activity.city}</span>
                        <span class="activity-card__rating">${"★".repeat(activity.rating)}</span>
                    </div>
                    ${activity.notes ? `<p class="activity-card__notes">${activity.notes}</p>` : ""}
                    <button class="activity-card__delete delete-act-btn" data-id="${activity.id}">Delete</button>
                </div>`;
                })
                .join("")
        }
    </div>

    <form id="activity-form">
        <div class="search-wrap">
            <input type="text" id="activity-search" placeholder="Search a place..." autocomplete="off" />
            <ul id="activity-results" class="search-results"></ul>
        </div>
        <select name="type" id="activity-type">
            <option value="" selected disabled>Activity type</option>
            <option value="Food">Food</option>
            <option value="Attraction">Attraction</option>
            <option value="Hike">Hike</option>
            <option value="Activity">Activity</option>
            <option value="Other">Other</option>
        </select>
        <input type="text" id="activity-name" placeholder="Activity" />
        <input type="text" id="activity-city" placeholder="City" />
        <select name="rating" id="activity-rating">
            <option value="" selected disabled>Select a rating</option>
            <option value="1">1★</option>
            <option value="2">2★</option>
            <option value="3">3★</option>
            <option value="4">4★</option>
            <option value="5">5★</option>
        </select>
        <input type="text" id="activity-notes" placeholder='notes' />
        <button type="submit" class='add-act-btn'>Add activity</button>
    </form>
    <p id="activity-form-error" class="form-error"></p>
    `;
    this._parentEl.innerHTML = "";
    this._parentEl.insertAdjacentHTML("beforeend", html);
  }

  addBackHandler(handler) {
    this._parentEl.addEventListener("click", (e) => {
      if (e.target.closest(".back-btn")) handler();
    });
  }

  addDeleteHandler(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".delete-act-btn");
      if (!btn) return;

      e.preventDefault();
      const id = btn.dataset.id;
      handler(id);
    });
  }

  addEditHandler(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".edit-btn");
      if (!btn) return;
      this._editingId = Number(btn.dataset.id);
      handler(); // app will re-render
    });
  }

  addSaveEditHandler(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".save-edit-btn");
      if (!btn) return;

      const id = Number(btn.dataset.id);
      const newName = document.querySelector(".edit-name-input").value;

      this._editingId = null; // exit editing mode
      handler(id, newName);
    });
  }

  addActivityHandler(handler) {
    this._parentEl.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!e.target.closest("#activity-form")) return;

      const type = document.querySelector("#activity-type").value;
      const name = document.querySelector("#activity-name").value;
      const city = document.querySelector("#activity-city").value;
      const rating = document.querySelector("#activity-rating").value;
      const notes = document.querySelector("#activity-notes").value;

      handler({ type, name, city, rating, notes, coords: this._pickedCoords });

      document.querySelector("#activity-form").reset();
    });
  }

  _addActivitySearchHandler() {
    let timer;

    this._parentEl.addEventListener("input", (e) => {
      if (e.target.id !== "activity-search") return; // only react to the search box

      clearTimeout(timer);
      const query = e.target.value;
      if (!query) {
        document.querySelector("#activity-results").innerHTML = "";
        return;
      }

      timer = setTimeout(async () => {
        const resultsEl = document.querySelector("#activity-results");
        try {
          const results = await searchPlaces(query, false, this._countryCode);
          if (results.length === 0) {
            resultsEl.innerHTML = `<li class="search-message">No places found</li>`;
            return;
          }

          resultsEl.innerHTML = results
            .map((r) => {
              const city =
                r.address.city ||
                r.address.town ||
                r.address.village ||
                r.address.municipality ||
                "";
              const name = r.display_name.split(",")[0];
              const rest = r.display_name.split(",").slice(1).join(",").trim();
              return `
              <li data-lat="${r.lat}" data-lon="${r.lon}" data-name="${r.display_name}" data-city="${city}">
                <span class="result-name">${name}</span>
                <span class="result-address">${rest}</span>
              </li>
              `;
            })
            .join("");
        } catch (err) {
          resultsEl.innerHTML = `<li class="search-message">Search failed - try again</li>`;
          console.log("Search error:", err);
        }
      }, 500);
    });
  }

  _addResultClickHandler() {
    this._parentEl.addEventListener("click", (e) => {
      const li = e.target.closest("#activity-results li");
      if (!li || li.classList.contains("search-message")) return; // dont read click on error

      // fill name field
      document.querySelector("#activity-name").value = li.dataset.name;
      document.querySelector("#activity-city").value = li.dataset.city;

      // store coords for when activity is saved
      this._pickedCoords = [Number(li.dataset.lat), Number(li.dataset.lon)];

      // clear results list
      document.querySelector("#activity-results").innerHTML = "";
    });
  }
}
