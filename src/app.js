"use strict";
import { Trip } from "./model/Trip.js";
import { Activity } from "./model/Activity.js";
import { save, load } from "./data/store.js";
import { DashboardView } from "./views/DashboardView.js";
import { FormView } from "./views/FormView.js";
import { TripView } from "./views/TripView.js";
import { MapView } from "./views/MapView.js";

export class App {
  constructor() {
    this.trips = load();
    this._dashboard = new DashboardView();
    this._form = new FormView();
    this._tripView = new TripView();
    this._mapView = new MapView();
    this._init();
  }

  _init() {
    // Render the dashboard with this.trips
    this._dashboard.render(this.trips);
    this._form.addHandler(this._addTrip.bind(this));
    this._dashboard.addDeleteHandler(this._removeTrip.bind(this));
    this._dashboard.addOpenHandler(this._openTrip.bind(this));
    this._tripView.addBackHandler(this._goHome.bind(this));
    this._tripView.addActivityHandler(this._addActivitySubmit.bind(this));
    this._tripView.addDeleteHandler(this._removeActivity.bind(this));
    this._tripView.addEditHandler(this._rerenderTrip.bind(this));
    this._tripView.addSaveEditHandler(this._saveActivityEdit.bind(this));
  }

  _addTrip(data) {
    // Clear previous errors
    this._form.clearError();

    if (!data.name.trim()) {
      this._form.showError("Please enter a trip name");
      return;
    }
    if (!data.start || !data.end) {
      this._form.showError("Please select both start and end dates");
      returnl;
    }
    if (new Date(data.end) < new Date(data.start)) {
      this._form.showError("End data can't be before start date!");
      return;
    }

    // Create trip once validation passed
    const trip = new Trip(
      data.name,
      data.destination,
      data.start,
      data.end,
      data.countryCode,
    );
    this.trips.push(trip);
    save(this.trips);
    this._dashboard.render(this.trips);
  }

  _removeTrip(tripID) {
    this.trips = this.trips.filter((t) => t.id !== Number(tripID));
    save(this.trips);
    this._dashboard.render(this.trips);
  }

  _openTrip(tripID) {
    this._activeTrip = this.trips.find((t) => t.id === Number(tripID));
    this._tripView.render(this._activeTrip);
    this._mapView.render(this._activeTrip.activities);
  }

  _addActivitySubmit(data) {
    if (!data.name.trim()) {
      document.querySelector("#activity-form-error").textContent =
        "Please enter an activity!";
      return;
    }

    const act = new Activity(
      data.type,
      data.name,
      data.city,
      Number(data.rating),
      data.notes,
    );
    act.coords = data.coords || null;
    this._activeTrip.addActivity(act);
    save(this.trips);
    this._tripView.render(this._activeTrip);
    this._mapView.render(this._activeTrip.activities);
  }

  _removeActivity(actID) {
    this._activeTrip.activities = this._activeTrip.activities.filter(
      (a) => a.id !== Number(actID),
    );
    save(this.trips);
    this._tripView.render(this._activeTrip);
    this._mapView.render(this._activeTrip.activities);
  }

  _rerenderTrip() {
    this._tripView.render(this._activeTrip);
    this._mapView.render(this._activeTrip.activities);
  }

  _saveActivityEdit(id, newName) {
    const activity = this._activeTrip.activities.find((a) => a.id === id);
    activity.name = newName;
    save(this.trips);
    this._tripView.render(this._activeTrip);
    this._mapView.render(this._activeTrip.activities);
  }

  _goHome() {
    this._dashboard.render(this.trips);
  }
}
