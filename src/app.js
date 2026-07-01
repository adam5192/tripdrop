"use strict";
import { Trip } from "./model/Trip.js";
import { Activity } from "./model/Activity.js";
import { save, load } from "./data/store.js";
import { DashboardView } from "./views/DashboardView.js";
import { FormView } from "./views/FormView.js";
import { TripView } from "./views/TripView.js";

export class App {
  constructor() {
    this.trips = load();
    this._dashboard = new DashboardView();
    this._form = new FormView();
    this._tripView = new TripView();
    this._init();
  }

  _init() {
    // Render the dashboard with this.trips
    this._dashboard.render(this.trips);
    this._form.addHandler(this._addTrip.bind(this));
    this._dashboard.addDeleteHandler(this._removeTrip.bind(this));
    this._dashboard.addOpenHandler(this._openTrip.bind(this));
    this._tripView.addBackHandler(this._goHome.bind(this));
  }

  _addTrip(data) {
    const trip = new Trip(data.name, data.destination, data.start, data.end);
    this.trips.push(trip);
    save(this.trips);
    this._dashboard.render(this.trips);
  }

  _removeTrip(tripID) {
    this.trips = this.trips.filter((t) => t.id !== Number(tripID));
    console.log(this.trips);
    save(this.trips);
    this._dashboard.render(this.trips);
  }

  _openTrip(tripID) {
    const trip = this.trips.find((t) => t.id === Number(tripID));
    this._tripView.render(trip);
  }

  _goHome() {
    this._dashboard.render(this.trips);
  }
}
