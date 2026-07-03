"use strict";
// import L from "leaflet";
// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";

export class MapView {
  constructor() {
    this._map = null;
  }

  render(coords = [51.505, -0.09]) {
    // remove existing map first - re-render
    // if (this._map) {
    //   this._map.remove();
    //   this._map = null;
    // }
    // this._map = L.map("map").setView(coords, 6);
    // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //   attribution: "© OpenStreetMap contributors",
    // }).addTo(this._map);
  }
}
