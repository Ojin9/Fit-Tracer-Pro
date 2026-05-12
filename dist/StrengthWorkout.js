import { Workoutitem } from "./Workoutitem.js";

export class StrengthWorkout extends Workoutitem {
  constructor(id, date, durationMinutes, weight, difficulty) {
    super(id, date, durationMinutes);
    if (weight <= 0) {
      throw new Error("Chybná váha");
    }
    this.weight = weight;
    this.difficulty = difficulty;
  }

  calculateCalories() {
    const multiplier = this.difficulty === "EASY" ? 1 : this.difficulty === "MEDIUM" ? 1.5 : 2;
    return Math.round((this.weight * multiplier * this.durationMinutes) / 10);
  }

  getSummary() {
    return `${super.getSummary()} | Síla | ${this.weight}kg | ${this.difficulty} | Cal: ${this.calculateCalories()}`;
  }
}
