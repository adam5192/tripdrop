// THIS FILE IS FOR LOCALSTORAGE read/write
import { Trip } from "../model/Trip.js";
import { Activity } from "../model/Activity.js";

export function save(trips) {
  const data = JSON.stringify(trips);
  localStorage.setItem("trips", data);
}

export function load() {
  const data = localStorage.getItem("trips");
  if (!data) return [];

  const plainTrips = JSON.parse(data);

  const trips = plainTrips.map((plain) => {
    const trip = new Trip(
      plain.name,
      plain.destination,
      plain.start,
      plain.end,
      plain.status,
    );
    trip.id = plain.id;
    plain.activities.forEach((act) => {
      const newAct = new Activity(
        act.type,
        act.name,
        act.city,
        act.rating,
        act.notes,
      );
      newAct.id = act.id;
      trip.addActivity(newAct);
    });
    return trip;
  });

  return trips;
}
