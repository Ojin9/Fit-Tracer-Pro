// Abstraktní bázová třída
class Workoutitem {
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

// Kardio trénink
class CardioWorkout extends Workoutitem {
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

// Silový trénink
class StrengthWorkout extends Workoutitem {
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

// Surová data
const workoutDataList = [
  { id: "cardio-01", date: "2025-05-10", durationMinutes: 30, type: "cardio", heartRate: 140 },
  { id: "strength-01", date: "2025-05-10", durationMinutes: 45, type: "strength", weight: 50, difficulty: "MEDIUM" },
  { id: "cardio-02", date: "2025-05-11", durationMinutes: 20, type: "cardio", heartRate: 150 },
  { id: "strength-02", date: "2025-05-11", durationMinutes: 40, type: "strength", weight: 80, difficulty: "HARD" }
];

// Vytváření instancí z dat
function createWorkout(data) {
  const date = new Date(data.date);
  if (data.type === "cardio") {
    return new CardioWorkout(data.id, date, data.durationMinutes, data.heartRate);
  } else {
    return new StrengthWorkout(data.id, date, data.durationMinutes, data.weight, data.difficulty);
  }
}

// Testování
const workouts = workoutDataList.map(createWorkout);
let totalCal = 0;

console.log("=== FitTracker Pro ===\n");
workouts.forEach((w) => {
  console.log(w.getSummary());
  totalCal += w.calculateCalories();
});

console.log(`\nCelkem kalorií: ${totalCal}`);
console.log(`Průměr: ${Math.round(totalCal / workouts.length)}`);
