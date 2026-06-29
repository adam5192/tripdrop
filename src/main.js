import { App } from "./app.js";
import { Trip } from "./model/Trip.js";
import { save, load } from "./data/store.js";
import { Activity } from "./model/Activity.js";

const app = new App();

const testTrips = [new Trip("Japan 2025", "Japan", "2025-01-01", "2025-01-10")];

save(testTrips);
const trips = load();

console.log(trips[0].getDuration());

const activity1 = new Activity("food", "yummy", "kyoto", 5, "YUMMMM");
trips[0].addActivity(activity1);

console.log(trips);
