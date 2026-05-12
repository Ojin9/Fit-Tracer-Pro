// Abstraktní bázová třída
export abstract class Workoutitem {
  protected id: string;
  protected date: Date;
  protected durationMinutes: number;

  constructor(id: string, date: Date, durationMinutes: number) {
    if (!id || durationMinutes <= 0) {
      throw new Error("Chybná data");
    }
    this.id = id;
    this.date = date;
    this.durationMinutes = durationMinutes;
  }

  abstract calculateCalories(): number;

  getSummary(): string {
    return `${this.id} | ${this.date.toLocaleDateString()} | ${this.durationMinutes}min`;
  }
}
