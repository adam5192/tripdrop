"use strict";
import { searchPlaces } from "../data/geocode.js";
import { COUNTRIES } from "../data/countries.js";

export class FormView {
  constructor() {
    this._form = document.querySelector("#trip-form");
    this._destResults = document.querySelector("#dest-results");
    this._selectedCountry = ""; // stores the country code selected

    this._addSearchHandler();
  }

  showError(message, type = 0) {
    document.querySelector("#trip-form-error").textContent = message;
  }

  clearError() {
    document.querySelector("#trip-form-error").textContent = "";
  }

  _addSearchHandler() {
    const input = document.querySelector("#trip-destination");

    input.addEventListener("input", () => {
      const query = input.value.toLowerCase();
      if (!query) {
        this._destResults.innerHTML = "";
        return;
      }

      const matches = COUNTRIES.filter((c) =>
        c.name.toLowerCase().startsWith(query),
      ).slice(0, 5);

      this._renderResults(matches);
    });
  }

  _renderResults(results) {
    this._destResults.innerHTML = results
      .map((c) => `<li data-country="${c.code}">${c.name}</li>`)
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
