import { Workoutitem } from "./Workoutitem.js";

export class CardioWorkout extends Workoutitem {
  constructor(id, date, durationMinutes, heartRate) {
    super(id, date, durationMinutes);
    if (heartRate <= 0 || heartRate > 220) {
      throw new Error("Chybná tepová frekvence");
    }
    this.heartRate = heartRate;
  }

  calculateCalories() {
    return Math.round(((this.heartRate - 60) / 10) * this.durationMinutes);
  }

  getSummary() {
    return `${super.getSummary()} | Kardio | BPM: ${this.heartRate} | Cal: ${this.calculateCalories()}`;
  }
}
