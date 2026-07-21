"use strict";
import { Trip } from "./model/Trip.js";
import { Activity } from "./model/Activity.js";
import {
  load,
  addTrip,
  removeTrip,
  addActivity,
  removeActivity,
  editActivity,
  hasLocalTrips,
  migrateLocalToDb,
} from "./data/store.js";
import { DashboardView } from "./views/DashboardView.js";
import { FormView } from "./views/FormView.js";
import { TripView } from "./views/TripView.js";
import { MapView } from "./views/MapView.js";
import { ModalView } from "./views/ModalView.js";
import { AuthView } from "./views/AuthView.js";
import { getCurrentUser, signIn, signUp, signOut } from "./data/auth.js";

export class App {
  constructor() {
    this.trips = [];
    this._dashboard = new DashboardView();
    this._authView = new AuthView();
    this._form = new FormView();
    this._tripView = new TripView();
    this._mapView = new MapView();
    this._modal = new ModalView();
    this._tripFormEl = document.querySelector("#trip-form");

    this._activeFilter = "All";
    this._init();
  }

  async _init() {
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

    // load trips (async — routes to DB or localStorage)
    this.trips = await load();
    this._dashboard.render(this.trips);
  }

  async _addTrip(data) {
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
      this._form.showError("End date can't be before start date!");
      return;
    }

    const trip = new Trip(data.name, data.destination, data.start, data.end, data.countryCode);

    try {
      const savedTrip = await addTrip(trip, [...this.trips, trip]);
      this.trips.push(savedTrip);
      this._dashboard.render(this.trips);
    } catch (err) {
      this._form.showError("Couldn't save trip — try again");
      console.error(err);
    }
  }

  async _removeTrip(tripID) {
    const trip = this.trips.find((t) => String(t.id) === String(tripID));
    const confirmed = await this._modal.confirm(`Delete "${trip.name}"? This can't be undone.`);
    if (!confirmed) return;

    this.trips = this.trips.filter((t) => String(t.id) !== String(tripID));

    try {
      await removeTrip(tripID, this.trips);
      this._dashboard.render(this.trips);
    } catch (err) {
      console.error(err);
    }
  }

  _openTrip(tripID) {
    this._activeTrip = this.trips.find((t) => String(t.id) === String(tripID));
    this._activeFilter = "All";
    this._form.clearError();
    this._tripFormEl.classList.add("hidden");
    this._renderActiveTrip();
  }

  async _addActivitySubmit(data) {
    if (!data.name.trim()) {
      document.querySelector("#activity-form-error").textContent = "Please enter an activity!";
      return;
    }

    const act = new Activity(data.type, data.name, data.city, Number(data.rating), data.notes);
    act.coords = data.coords || null;

    try {
      const savedAct = await addActivity(this._activeTrip.id, act, this.trips);
      this._activeTrip.addActivity(savedAct);
      this._renderActiveTrip();
    } catch (err) {
      console.error(err);
    }
  }

  async _removeActivity(actID) {
    const activity = this._activeTrip.activities.find((a) => String(a.id) === String(actID));
    const confirmed = await this._modal.confirm(`Delete "${activity.name}"?`);
    if (!confirmed) return;

    this._activeTrip.activities = this._activeTrip.activities.filter((a) => String(a.id) !== String(actID));

    try {
      await removeActivity(actID, this.trips);
      this._renderActiveTrip();
    } catch (err) {
      console.error(err);
    }
  }

  async _saveActivityEdit(id, updated) {
    const activity = this._activeTrip.activities.find((a) => String(a.id) === String(id));

    activity.name = updated.name;
    activity.type = updated.type;
    activity.rating = updated.rating;
    activity.notes = updated.notes;

    try {
      await editActivity(id, updated, this.trips);
      this._renderActiveTrip();
    } catch (err) {
      console.error(err);
    }
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
    // reload trips for anonymous mode (localStorage)
    this.trips = await load();
    this._dashboard.render(this.trips);
  }

  async _handleAuthSubmit(email, password, isSignUp) {
    try {
      if (isSignUp) {
        const { needsConfirmation } = await signUp(email, password);
        if (needsConfirmation) {
          this._authView.showMessage("Check your email to confirm your account, then sign in.");
          return;
          // if confirmation is off, fall through to sign in
        }
      }

      const user = await signIn(email, password);
      this._authView.closeModal();
      this._authView.renderAuthArea(user);

      // offer to migrate local trips
      if (hasLocalTrips()) {
        const confirmed = await this._modal.confirm(
          "You have trips saved on this device. Upload them to your account?",
        );
        if (confirmed) {
          await migrateLocalToDb();
        }
      }

      // load trips for signed-in mode
      this.trips = await load();
      this._dashboard.render(this.trips);
    } catch (err) {
      this._authView.showError(err.message);
    }
  }
}
