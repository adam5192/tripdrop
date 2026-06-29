export class Activity {
  constructor(type, name, city, rating, notes = "") {
    this.id = Date.now();
    this.date = new Date();
    this.coords = null;
    this.type = type;
    this.name = name;
    this.city = city;
    this.rating = rating;
    this.notes = notes;
  }

  getSummary() {
    return `${this.name} | ${this.type} | ${this.rating}*`;
  }
}
