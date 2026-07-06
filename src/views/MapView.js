"use strict";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export class MapView {
  constructor() {
    this._map = null;
  }

  render(activities = [], countryCoords = null) {
    // remove existing map first - re-render
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
    this._map = L.map("map");
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: "© OpenStreetMap contributors © CARTO",
      },
    ).addTo(this._map);

    // drop pins for activities that have coords
    const withCoords = activities.filter((a) => a.coords);

    withCoords.forEach((a) => {
      L.marker(a.coords).addTo(this._map).bindPopup(`${a.name} (${a.type})`);
    });

    // decide what area to show
    if (withCoords.length > 0) {
      // fit map to show all pins
      const bounds = withCoords.map((a) => a.coords);
      this._map.fitBounds(bounds, { padding: [50, 50] });
    } else if (countryCoords) {
      // no pins yet: center on country
      this._map.setView(countryCoords, 5);
    } else {
      //fallback
      this._map.setView([20, 0], 2);
    }
  }
}
