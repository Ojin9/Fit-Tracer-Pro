// FitTracker jednoduché skriptování
class Workoutitem {
  constructor(id, date, durationMinutes) {
    this.id = id;
    this.date = new Date(date);
    this.durationMinutes = durationMinutes;
  }

  getSummary() {
    return `${this.id} | ${this.date.toLocaleDateString()} | ${this.durationMinutes} min`;
  }
}

class CardioWorkout extends Workoutitem {
  constructor(id, date, durationMinutes, heartRate) {
    super(id, date, durationMinutes);
    this.heartRate = heartRate;
  }

  calculateCalories() {
    return Math.round(((this.heartRate - 60) / 10) * this.durationMinutes);
  }

  getSummary() {
    return `${super.getSummary()} | Kardio | Tep ${this.heartRate} | Cal: ${this.calculateCalories()}`;
  }
}

class StrengthWorkout extends Workoutitem {
  constructor(id, date, durationMinutes, weight, difficulty) {
    super(id, date, durationMinutes);
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

const workoutDataList = [
  { id: "cardio-01", date: "2025-05-10", durationMinutes: 30, type: "cardio", activity: "beh", heartRate: 140 },
  { id: "strength-01", date: "2025-05-10", durationMinutes: 45, type: "strength", activity: "bench", weight: 50, difficulty: "MEDIUM" },
  { id: "cardio-02", date: "2025-05-11", durationMinutes: 20, type: "cardio", activity: "cyklistika", heartRate: 150 },
  { id: "strength-02", date: "2025-05-11", durationMinutes: 40, type: "strength", activity: "drep", weight: 80, difficulty: "HARD" }
];

const output = document.getElementById("workout-output");
const form = document.getElementById("workout-form");
const typeSelect = document.getElementById("workout-type");
const activitySelect = document.getElementById("workout-activity");
const workouts = workoutDataList.slice();

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

function renderActivityOptions(type) {
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

function activityLabel(code) {
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
  const isCardio = typeSelect && typeSelect.value === "cardio";
  const cardioFields = document.querySelectorAll(".cardio-field");
  const strengthFields = document.querySelectorAll(".strength-field");
  for (let i = 0; i < cardioFields.length; i++) {
    cardioFields[i].style.display = isCardio ? "block" : "none";
  }
  for (let i = 0; i < strengthFields.length; i++) {
    strengthFields[i].style.display = isCardio ? "none" : "block";
  }
  renderActivityOptions(typeSelect && typeSelect.value === "cardio" ? "cardio" : "strength");
}

function createWorkout(data) {
  if (data.type === "cardio") {
    return new CardioWorkout(data.id, data.date, data.durationMinutes, data.heartRate || 120);
  }
  return new StrengthWorkout(data.id, data.date, data.durationMinutes, data.weight || 0, data.difficulty || "MEDIUM");
}

function renderWorkouts() {
  if (!output) return;
  let html = "<h2>Moje tréninky</h2>";
  html += "<ul class='workout-list'>";
  for (let i = 0; i < workouts.length; i++) {
    const item = workouts[i];
    const summary = createWorkout(item).getSummary();
    const activityText = item.activity ? (activityLabel(item.activity) + ' • ') : '';
    html += `<li class='workout-item'>${activityText}${summary}</li>`;
  }
  html += "</ul>";
  output.innerHTML = html;
}

function init() {
  renderWorkouts();
  updateTypeFields();

  if (typeSelect) {
    typeSelect.addEventListener("change", updateTypeFields);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const type = data.get("type") || "cardio";
      const activity = (data.get("activity") || "jine").toString();
      const duration = Number(data.get("durationMinutes"));
      if (!duration) {
        alert("Vyplň délku.");
        return;
      }
      const workout = {
        id: type + "-" + Date.now(),
        date: new Date().toISOString().slice(0,10),
        durationMinutes: duration,
        type: type,
        activity: activity,
      };
      if (type === "cardio") {
        workout.heartRate = Number(data.get("heartRate"));
      } else {
        workout.weight = Number(data.get("weight"));
        workout.difficulty = data.get("difficulty") || "MEDIUM";
      }
      workouts.push(workout);
      renderWorkouts();
      form.reset();
      updateTypeFields();
    });
  }
}

init();
