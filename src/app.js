"use strict";
import { Trip } from "./model/Trip.js";
import { Activity } from "./model/Activity.js";
import { save, load } from "./data/store.js";
import { DashboardView } from "./views/DashboardView.js";
import { FormView } from "./views/FormView.js";

export class App {
  constructor() {
    this.trips = load();
    this._dashboard = new DashboardView();
    this._form = new FormView();
    this._init();
  }

  _init() {
    // Render the dashboard with this.trips
    this._dashboard.render(this.trips);
    this._form.addHandler(this._addTrip.bind(this));
  }

  _addTrip(data) {
    const trip = new Trip(data.name, data.destination, data.start, data.end);
    this.trips.push(trip);
    save(this.trips);
    this._dashboard.render(this.trips);
  }
}
