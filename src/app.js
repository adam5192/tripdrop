"use strict";
import { Trip } from "./model/Trip.js";
import { Activity } from "./model/Activity.js";
import { save, load } from "./data/store.js";
import { DashboardView } from "./views/DashboardView.js";
import { FormView } from "./views/FormView.js";
import { TripView } from "./views/TripView.js";
import { MapView } from "./views/MapView.js";
import { ModalView } from "./views/ModalView.js";
import { AuthView } from "./views/AuthView.js";
import { getCurrentUser } from "./data/auth.js";

export class App {
  constructor() {
    this.trips = load();
    this._dashboard = new DashboardView();
    this._authView = new AuthView();
    this._form = new FormView();
    this._tripView = new TripView();
    this._mapView = new MapView();
    this._modal = new ModalView();
    this._tripFormEl = document.querySelector("#trip-form");

    this._activeFilter = "All"; // Tag/activity type filtering
    this._init();
  }

  async _init() {
    // Render the dashboard with this.trips
    this._dashboard.render(this.trips);
    this._form.addHandler(this._addTrip.bind(this));
    this._dashboard.addDeleteHandler(this._removeTrip.bind(this));
    this._dashboard.addOpenHandler(this._openTrip.bind(this));
    this._tripView.addBackHandler(this._goHome.bind(this));
    this._tripView.addActivityHandler(this._addActivitySubmit.bind(this));
    this._tripView.addDeleteHandler(this._removeActivity.bind(this));
    this._tripView.addEditHandler(this._renderActiveTrip.bind(this));
    this._tripView.addSaveEditHandler(this._saveActivityEdit.bind(this));
    this._tripView.addCancelEditHandler(this._renderActiveTrip.bind(this));
    this._tripView.addFilterHandler(this._setFilter.bind(this));
    this._authView.addSignInHandler(() => this._authView.openModal());
    this._authView.addSignOutHandler(this._handleSignOut.bind(this));
    this._authView.addModalHandlers({
      onSubmit: this._handleAuthSubmit.bind(this),
      onToggle: () => {},
    });

    const user = await getCurrentUser();
    this._authView.renderAuthArea(user);
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
      return;
    }
    if (new Date(data.end) < new Date(data.start)) {
      this._form.showError("End data can't be before start date!");
      return;
    }

    // Create trip once validation passed
    const trip = new Trip(data.name, data.destination, data.start, data.end, data.countryCode);
    this.trips.push(trip);
    save(this.trips);
    this._dashboard.render(this.trips);
  }

  async _removeTrip(tripID) {
    const trip = this.trips.find((t) => t.id === Number(tripID));
    const confirmed = await this._modal.confirm(`Delete "${trip.name}"? This can't be undone.`);
    if (!confirmed) return;

    this.trips = this.trips.filter((t) => t.id !== Number(tripID));
    save(this.trips);
    this._dashboard.render(this.trips);
  }

  _openTrip(tripID) {
    this._activeTrip = this.trips.find((t) => t.id === Number(tripID));
    this._activeFilter = "All";
    this._tripFormEl.classList.add("hidden");
    this._renderActiveTrip();
  }

  _addActivitySubmit(data) {
    if (!data.name.trim()) {
      document.querySelector("#activity-form-error").textContent = "Please enter an activity!";
      return;
    }

    const act = new Activity(data.type, data.name, data.city, Number(data.rating), data.notes);
    act.coords = data.coords || null;
    this._activeTrip.addActivity(act);
    save(this.trips);
    this._renderActiveTrip();
  }

  async _removeActivity(actID) {
    const activity = this._activeTrip.activities.find((a) => a.id === Number(actID));
    const confirmed = await this._modal.confirm(`Delete "${activity.name}"?`);
    if (!confirmed) return;

    this._activeTrip.activities = this._activeTrip.activities.filter((a) => a.id !== Number(actID));
    save(this.trips);
    this._renderActiveTrip();
  }

  _saveActivityEdit(id, updated) {
    const activity = this._activeTrip.activities.find((a) => a.id === id);

    activity.name = updated.name;
    activity.type = updated.type;
    activity.rating = updated.rating;
    activity.notes = updated.notes;

    save(this.trips);
    this._renderActiveTrip();
  }

  _goHome() {
    this._tripFormEl.classList.remove("hidden");
    this._dashboard.render(this.trips);
  }

  _getVisibleActivities() {
    if (this._activeFilter === "All") return this._activeTrip.activities;
    return this._activeTrip.activities.filter((a) => a.type === this._activeFilter);
  }

  _setFilter(filter) {
    this._activeFilter = filter;
    this._renderActiveTrip();
  }

  _renderActiveTrip() {
    const visible = this._getVisibleActivities();
    this._tripView.render(this._activeTrip, this._activeFilter, visible);
    this._mapView.render(visible);
  }

  async _handleSignOut() {
    await signOut();
    this._authView.renderAuthArea(null);
  }

  async _handleAuthSubmit(email, password, isSignUp) {
    try {
      const user = isSignUp ? await signUp(email, password) : await signIn(email, password);

      this._authView.closeModal();
      this._authView.renderAuthArea(user);
    } catch (err) {
      this._authView.showError(err.message);
    }
  }
}
