// Dual-mode storage: routes to Supabase when signed in, localStorage when anonymous.
import { Trip } from "../model/Trip.js";
import { Activity } from "../model/Activity.js";
import { getCurrentUser } from "./auth.js";
import * as db from "./db.js";

// ---------- localStorage helpers (anonymous users) ----------

function saveLocal(trips) {
  localStorage.setItem("trips", JSON.stringify(trips));
}

function loadLocal() {
  const data = localStorage.getItem("trips");
  if (!data) return [];
  return JSON.parse(data).map(rebuildTripFromLocal);
}

// ---------- rebuild class instances ----------

// From a plain localStorage object
function rebuildTripFromLocal(plain) {
  const trip = new Trip(plain.name, plain.destination, plain.start, plain.end, plain.countryCode, plain.status);
  trip.id = plain.id;

  (plain.activities || []).forEach((act) => {
    const newAct = new Activity(act.type, act.name, act.city, act.rating, act.notes);
    newAct.id = act.id;
    newAct.coords = act.coords;
    trip.addActivity(newAct);
  });

  return trip;
}

// From a database row
function rebuildTripFromDb(row) {
  const trip = new Trip(row.name, row.destination, row.start_date, row.end_date, row.country_code, row.status);
  trip.id = row.id;

  (row.activities || []).forEach((act) => {
    const newAct = new Activity(act.type, act.name, act.city, act.rating, act.notes);
    newAct.id = act.id;
    newAct.coords = act.coords;
    trip.addActivity(newAct);
  });

  return trip;
}

// ---------- public dual-mode API ----------

export async function load() {
  const user = await getCurrentUser();
  if (!user) return loadLocal();

  const rows = await db.fetchTrips();
  return rows.map(rebuildTripFromDb);
}

// allTrips = the full current array
export async function addTrip(trip, allTrips) {
  const user = await getCurrentUser();
  if (!user) {
    saveLocal(allTrips);
    return trip;
  }
  const row = await db.insertTrip(trip);
  return rebuildTripFromDb(row);
}

export async function removeTrip(tripId, remainingTrips) {
  const user = await getCurrentUser();
  if (!user) {
    saveLocal(remainingTrips);
    return;
  }
  await db.deleteTrip(tripId);
}

// tripId = which trip to attach to (DB path); allTrips = full array (local path)
export async function addActivity(tripId, activity, allTrips) {
  const user = await getCurrentUser();
  if (!user) {
    saveLocal(allTrips);
    return activity;
  }
  const row = await db.insertActivity(tripId, activity);
  const newAct = new Activity(row.type, row.name, row.city, row.rating, row.notes);
  newAct.id = row.id;
  newAct.coords = row.coords;
  return newAct;
}

export async function removeActivity(activityId, allTrips) {
  const user = await getCurrentUser();
  if (!user) {
    saveLocal(allTrips);
    return;
  }
  await db.deleteActivity(activityId);
}

export async function editActivity(activityId, updates, allTrips) {
  const user = await getCurrentUser();
  if (!user) {
    saveLocal(allTrips);
    return;
  }
  await db.updateActivity(activityId, updates);
}

export async function migrateLocalToDb() {
  const local = loadLocal();
  if (local.length === 0) return 0;

  for (const trip of local) {
    // insert the trip, get back the DB row with its new UUID
    const row = await db.insertTrip(trip);

    // insert each of its activities against the new trip id
    for (const act of trip.activities) {
      await db.insertActivity(row.id, act);
    }
  }

  // clear local storage now that it's uploaded
  localStorage.removeItem("trips");
  return local.length;
}

export function hasLocalTrips() {
  const data = localStorage.getItem("trips");
  if (!data) return false;
  return JSON.parse(data).length > 0;
}
