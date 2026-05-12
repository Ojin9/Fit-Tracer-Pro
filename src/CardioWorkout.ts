// Kardio trénink
import { Workoutitem } from "./Workoutitem";

export class CardioWorkout extends Workoutitem {
  private heartRate: number;

  constructor(id: string, date: Date, durationMinutes: number, heartRate: number) {
    super(id, date, durationMinutes);
    if (heartRate <= 0 || heartRate > 220) {
      throw new Error("Chybná tepová frekvence");
    }
    this.heartRate = heartRate;
  }

  calculateCalories(): number {
    return Math.round(((this.heartRate - 60) / 10) * this.durationMinutes);
  }

  getSummary(): string {
    return `${super.getSummary()} | Kardio | BPM: ${this.heartRate} | Cal: ${this.calculateCalories()}`;
  }
}
