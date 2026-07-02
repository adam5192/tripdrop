export class Trip {
  constructor(
    name,
    destination,
    start,
    end,
    countryCode = "",
    status = "planned",
  ) {
    this.id = Date.now();
    this.name = name;
    this.destination = destination;
    this.countryCode = countryCode;
    this.start = new Date(start);
    this.end = new Date(end);
    this.status = status;
    this.activities = [];
  }

  addActivity(activity) {
    this.activities.push(activity);
  }

  getDuration() {
    return Math.abs(this.end - this.start) / (1000 * 60 * 60 * 24);
  }
}
