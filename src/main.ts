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

const output = document.getElementById("workout-output");

if (output) {
  const list = document.createElement("ul");
  list.className = "workout-list";

  workouts.forEach((w) => {
    const item = document.createElement("li");
    item.textContent = w.getSummary();
    list.appendChild(item);
    totalCal += w.calculateCalories();
  });

  const summary = document.createElement("div");
  summary.className = "workout-summary";
  summary.innerHTML = `
    <p><strong>Celkem kalorií:</strong> ${totalCal}</p>
    <p><strong>Průměr na trénink:</strong> ${Math.round(totalCal / workouts.length)}</p>
  `;

  output.appendChild(list);
  output.appendChild(summary);
} else {
  console.warn("Nelze najít element #workout-output pro zobrazení dat.");
}
