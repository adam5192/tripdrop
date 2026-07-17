import "leaflet/dist/leaflet.css";
import { App } from "./app.js";
import { fetchTrips, insertTrip } from "./data/db.js";
window.fetchTrips = fetchTrips;
window.insertTrip = insertTrip;

const app = new App();
