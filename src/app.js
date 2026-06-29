"use strict";
import { Trip } from "./model/Trip";
import { Activity } from "./model/Activity";

export class App {
  constructor() {
    console.log("Hello");

    const Barca = new Trip(
      "Barca 2025",
      "Barcelona",
      "2026-02-05",
      "2026-02-12",
      "done",
    );

    console.log(Barca);

    const barcaVsReal = new Activity(
      "sports",
      "Barca Match",
      "Barcelona",
      "5",
      "VISCA BARCAAAAA",
    );

    Barca.addActivity(barcaVsReal);

    console.log(Barca);
  }
}
