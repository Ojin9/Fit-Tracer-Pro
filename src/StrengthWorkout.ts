// Silový trénink
import { Workoutitem } from "./Workoutitem";

export class StrengthWorkout extends Workoutitem {
  private weight: number;
  private difficulty: "EASY" | "MEDIUM" | "HARD";

  constructor(
    id: string,
    date: Date,
    durationMinutes: number,
    weight: number,
    difficulty: "EASY" | "MEDIUM" | "HARD"
  ) {
    super(id, date, durationMinutes);
    if (weight <= 0) {
      throw new Error("Chybná váha");
    }
    this.weight = weight;
    this.difficulty = difficulty;
  }

  calculateCalories(): number {
    const multiplier = this.difficulty === "EASY" ? 1 : this.difficulty === "MEDIUM" ? 1.5 : 2;
    return Math.round((this.weight * multiplier * this.durationMinutes) / 10);
  }

  getSummary(): string {
    return `${super.getSummary()} | Síla | ${this.weight}kg | ${this.difficulty} | Cal: ${this.calculateCalories()}`;
  }
}
