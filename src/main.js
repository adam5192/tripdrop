"use strict";
import { App } from "./app.js";
import { Trip } from "./model/Trip.js";
import { save, load } from "./data/store.js";
import { Activity } from "./model/Activity.js";

// const trip1 = new Trip("Japan 2025", "Japan", "2025-01-01", "2025-01-10");

// const trip2 = new Trip("Barcelona 2024", "Spain", "2024-01-01", "2024-01-10");

// const trip3 = new Trip("Italy 2023", "Italy", "2023-01-01", "2023-01-10");

// save([trip1, trip2, trip3]);

const app = new App();
