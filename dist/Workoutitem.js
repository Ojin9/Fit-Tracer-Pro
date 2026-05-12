export class Workoutitem {
  constructor(id, date, durationMinutes) {
    if (!id || durationMinutes <= 0) {
      throw new Error("Chybná data");
    }
    this.id = id;
    this.date = date;
    this.durationMinutes = durationMinutes;
  }

  getSummary() {
    return `${this.id} | ${this.date.toLocaleDateString()} | ${this.durationMinutes}min`;
  }
}
