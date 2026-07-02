"use strict";
import { searchPlaces } from "../data/geocode.js";

export class FormView {
  constructor() {
    this._form = document.querySelector("#trip-form");
    this._destResults = document.querySelector("#dest-results");
    this._selectedCountry = ""; // stores the country code selected

    this._addSearchHandler();
  }

  _addSearchHandler() {
    const input = document.querySelector("#trip-destination");
    let timer;

    input.addEventListener("input", () => {
      clearTimeout(timer);

      const query = input.value;
      if (!query) {
        this._destResults.innerHTML = "";
        return;
      }

      timer = setTimeout(async () => {
        const results = await searchPlaces(query);
        const countriesOnly = results.filter(
          (r) => r.addresstype === "country",
        );
        this._renderResults(countriesOnly);
      }, 500);
    });
  }

  _renderResults(results) {
    this._destResults.innerHTML = results
      .map((r) => {
        return `<li data-lat="${r.lat}" data-lon="${r.lon}" data-country="${r.address.country_code}">${r.display_name}</li>`;
      })
      .join("");

    this._destResults.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;

      document.querySelector("#trip-destination").value = li.textContent;
      this._selectedCountry = li.dataset.country;
      console.log(this._selectedCountry);
      this._destResults.innerHTML = ""; // clear list
    });
  }

  addHandler(handler) {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.querySelector("#trip-name").value;
      const destination = document.querySelector("#trip-destination").value;
      const start = document.querySelector("#trip-start").value;
      const end = document.querySelector("#trip-end").value;

      handler({
        name,
        destination,
        start,
        end,
        countryCode: this._selectedCountry,
      });

      this._form.reset();
      this._selectedCountry = "";
    });
  }
}
