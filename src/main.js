"use strict";
import { App } from "./app.js";
import { Trip } from "./model/Trip.js";
import { save, load } from "./data/store.js";
import { Activity } from "./model/Activity.js";
import "leaflet/dist/leaflet.css";

const app = new App();
