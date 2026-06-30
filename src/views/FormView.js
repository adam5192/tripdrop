"use strict";

export class FormView {
  constructor() {
    this._form = document.querySelector("#trip-form");
  }

  addHandler(handler) {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.querySelector("#trip-name").value;
      const destination = document.querySelector("#trip-destination").value;
      const start = document.querySelector("#trip-start").value;
      const end = document.querySelector("#trip-end").value;

      handler({ name, destination, start, end });

      this._form.reset();
    });
  }
}
