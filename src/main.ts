import { workoutDataList } from "./data";
import { CardioWorkout } from "./CardioWorkout";
import { StrengthWorkout } from "./StrengthWorkout";
import { Workoutitem } from "./Workoutitem";

function createWorkout(data: any): Workoutitem {
  const date = new Date(data.date);
  if (data.type === "cardio") {
    return new CardioWorkout(data.id, date, data.durationMinutes, data.heartRate);
  } else {
    return new StrengthWorkout(data.id, date, data.durationMinutes, data.weight, data.difficulty);
  }
}

const workouts: Workoutitem[] = workoutDataList.map(createWorkout);
let totalCal = 0;

console.log("=== FitTracker Pro ===\n");
workouts.forEach((w) => {
  console.log(w.getSummary());
  totalCal += w.calculateCalories();
});

console.log(`\nCelkem kalorií: ${totalCal}`);
console.log(`Průměr: ${Math.round(totalCal / workouts.length)}`);
