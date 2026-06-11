import { workoutDataList, WorkoutData } from "./data";
import { CardioWorkout } from "./CardioWorkout";
import { StrengthWorkout } from "./StrengthWorkout";
import { Workoutitem } from "./Workoutitem";

const workouts: WorkoutData[] = [...workoutDataList];
const output = document.getElementById("workout-output") as HTMLElement | null;
const form = document.getElementById("workout-form") as HTMLFormElement | null;
const typeSelect = document.getElementById("workout-type") as HTMLSelectElement | null;
const activitySelect = document.getElementById("workout-activity") as HTMLSelectElement | null;

const cardioActivities = [
  { value: "beh", label: "Běh" },
  { value: "cyklistika", label: "Cyklistika" },
  { value: "plavani", label: "Plavání" },
  { value: "jine", label: "Jiné" },
];

const strengthActivities = [
  { value: "bench", label: "Bench" },
  { value: "drep", label: "Dřep" },
  { value: "mrtvy-tah", label: "Mrtvý tah" },
  { value: "jine", label: "Jiné" },
];

function renderActivityOptions(type: WorkoutData["type"]) {
  if (!activitySelect) return;
  const options = type === "cardio" ? cardioActivities : strengthActivities;
  const currentValue = activitySelect.value;
  activitySelect.innerHTML = "";
  options.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    activitySelect.appendChild(option);
  });
  if (options.some((item) => item.value === currentValue)) {
    activitySelect.value = currentValue;
  }
}

function activityLabel(code?: string) {
  switch (code) {
    case "beh":
      return "Běh";
    case "plavani":
      return "Plavání";
    case "cyklistika":
      return "Cyklistika";
    case "bench":
      return "Bench";
    case "drep":
      return "Dřep";
    case "mrtvy-tah":
      return "Mrtvý tah";
    default:
      return "Jiné";
  }
}

function updateTypeFields() {
  if (!typeSelect) return;
  const isCardio = typeSelect.value === "cardio";
  const cardioFields = document.querySelectorAll<HTMLElement>(".cardio-field");
  const strengthFields = document.querySelectorAll<HTMLElement>(".strength-field");

  cardioFields.forEach((field) => {
    field.hidden = !isCardio;
  });
  strengthFields.forEach((field) => {
    field.hidden = isCardio;
  });

  renderActivityOptions(typeSelect.value as WorkoutData["type"]);
}

function createWorkout(item: WorkoutData): Workoutitem {
  const date = new Date(item.date);
  if (item.type === "cardio") {
    return new CardioWorkout(item.id, date, item.durationMinutes, item.heartRate || 120);
  }
  return new StrengthWorkout(item.id, date, item.durationMinutes, item.weight || 0, item.difficulty || "MEDIUM");
}

function getSummary(item: WorkoutData) {
  return createWorkout(item).getSummary();
}

function renderWorkouts() {
  if (!output) return;

  let html = "";
  html += "<h2>Moje tréninky</h2>";
  html += "<ul class='workout-list'>";
  for (const item of workouts) {
    const act = item.activity ? activityLabel(item.activity) + ' • ' : '';
    html += `<li class='workout-item'><strong>${item.type}</strong>: ${act}${getSummary(item)}</li>`;
  }
  html += "</ul>";
  output.innerHTML = html;
}

function handleForm() {
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const type = formData.get("type") as WorkoutData["type"];
    const duration = Number(formData.get("durationMinutes"));
    const activity = (formData.get("activity") as WorkoutData["activity"]) || "jine";
    if (Number.isNaN(duration) || duration <= 0) {
      alert("Vyplň prosím správně délku.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const newWorkout: WorkoutData = {
      id: `${type}-${Date.now()}`,
      date: today,
      durationMinutes: duration,
      type,
      activity,
    };
    if (type === "cardio") {
      newWorkout.heartRate = Number(formData.get("heartRate"));
    } else {
      newWorkout.weight = Number(formData.get("weight"));
      newWorkout.difficulty = formData.get("difficulty") as WorkoutData["difficulty"];
    }
    workouts.push(newWorkout);
    renderWorkouts();
    form.reset();
    updateTypeFields();
  });
}

function init() {
  renderWorkouts();
  updateTypeFields();
  handleForm();
  if (typeSelect) {
    typeSelect.addEventListener("change", updateTypeFields);
  }
}

init();
