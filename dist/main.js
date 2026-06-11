// FitTracker – bundle (sjednoceno s src/main.ts)

// ── Bázová třída (abstraktní vzor) ────────────────────────────────────────────
class Workoutitem {
  constructor(id, date, durationMinutes) {
    if (!id || durationMinutes <= 0) {
      throw new Error("Chybná data – id nesmí být prázdné a délka musí být kladná.");
    }
    this.id = id;
    this.date = new Date(date);
    this.durationMinutes = durationMinutes;
  }

  getSummary() {
    return `${this.id} | ${this.date.toLocaleDateString()} | ${this.durationMinutes} min`;
  }
}

// ── Kardio trénink ─────────────────────────────────────────────────────────────
class CardioWorkout extends Workoutitem {
  constructor(id, date, durationMinutes, heartRate) {
    super(id, date, durationMinutes);
    if (heartRate <= 0 || heartRate > 220) {
      throw new Error("Chybná tepová frekvence – musí být 1–220 BPM.");
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

// ── Silový trénink ─────────────────────────────────────────────────────────────
class StrengthWorkout extends Workoutitem {
  constructor(id, date, durationMinutes, weight, difficulty) {
    super(id, date, durationMinutes);
    if (weight <= 0) {
      throw new Error("Chybná váha – musí být kladné číslo.");
    }
    this.weight = weight;
    this.difficulty = difficulty;
  }

  calculateCalories() {
    const multiplier = this.difficulty === "EASY" ? 1 : this.difficulty === "MEDIUM" ? 1.5 : 2;
    return Math.round((this.weight * multiplier * this.durationMinutes) / 10);
  }

  getSummary() {
    return `${super.getSummary()} | Síla | ${this.weight} kg | ${this.difficulty} | Cal: ${this.calculateCalories()}`;
  }
}

// ── Vzorová data ───────────────────────────────────────────────────────────────
const workoutDataList = [
  { id: "cardio-01",   date: "2025-05-10", durationMinutes: 30, type: "cardio",   activity: "beh",        heartRate: 140 },
  { id: "strength-01", date: "2025-05-10", durationMinutes: 45, type: "strength", activity: "bench",      weight: 50, difficulty: "MEDIUM" },
  { id: "cardio-02",   date: "2025-05-11", durationMinutes: 20, type: "cardio",   activity: "cyklistika", heartRate: 150 },
  { id: "strength-02", date: "2025-05-11", durationMinutes: 40, type: "strength", activity: "drep",       weight: 80, difficulty: "HARD" },
];

// ── DOM reference ──────────────────────────────────────────────────────────────
const output       = document.getElementById("workout-output");
const form         = document.getElementById("workout-form");
const typeSelect   = document.getElementById("workout-type");
const activitySelect = document.getElementById("workout-activity");
const workouts     = workoutDataList.slice();

// ── Seznamy aktivit ────────────────────────────────────────────────────────────
const cardioActivities = [
  { value: "beh",        label: "Běh" },
  { value: "cyklistika", label: "Cyklistika" },
  { value: "plavani",    label: "Plavání" },
  { value: "jine",       label: "Jiné" },
];

const strengthActivities = [
  { value: "bench",      label: "Bench" },
  { value: "drep",       label: "Dřep" },
  { value: "mrtvy-tah",  label: "Mrtvý tah" },
  { value: "jine",       label: "Jiné" },
];

// ── Pomocné funkce ─────────────────────────────────────────────────────────────
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
    case "beh":       return "Běh";
    case "plavani":   return "Plavání";
    case "cyklistika":return "Cyklistika";
    case "bench":     return "Bench";
    case "drep":      return "Dřep";
    case "mrtvy-tah": return "Mrtvý tah";
    default:          return "Jiné";
  }
}

// Přepínání viditelnosti polí přes CSS třídu .hidden (přebije display:grid)
function updateTypeFields() {
  if (!typeSelect) return;
  const isCardio = typeSelect.value === "cardio";
  document.querySelectorAll(".cardio-field").forEach((el) => {
    el.classList.toggle("hidden", !isCardio);
  });
  document.querySelectorAll(".strength-field").forEach((el) => {
    el.classList.toggle("hidden", isCardio);
  });
  renderActivityOptions(isCardio ? "cardio" : "strength");
}

function createWorkout(data) {
  if (data.type === "cardio") {
    return new CardioWorkout(data.id, data.date, data.durationMinutes, data.heartRate || 120);
  }
  return new StrengthWorkout(data.id, data.date, data.durationMinutes, data.weight || 0, data.difficulty || "MEDIUM");
}

// ── Vykreslení seznamu tréninků ────────────────────────────────────────────────
function renderWorkouts() {
  if (!output) return;
  let html = "<h2>Moje tréninky</h2><ul class='workout-list'>";
  for (const item of workouts) {
    const actText = item.activity ? activityLabel(item.activity) + " • " : "";
    const summary = createWorkout(item).getSummary();
    html += `<li class='workout-item'><strong>${item.type === "cardio" ? "Kardio" : "Síla"}</strong>: ${actText}${summary}</li>`;
  }
  html += "</ul>";
  output.innerHTML = html;
}

// ── Inicializace ───────────────────────────────────────────────────────────────
function init() {
  renderWorkouts();
  updateTypeFields();

  if (typeSelect) {
    typeSelect.addEventListener("change", updateTypeFields);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data     = new FormData(form);
      const type     = (data.get("type") || "cardio").toString();
      const activity = (data.get("activity") || "jine").toString();
      const duration = Number(data.get("durationMinutes"));

      if (!duration || duration <= 0) {
        alert("Vyplň prosím správně délku tréninku.");
        return;
      }

      const workout = {
        id:              type + "-" + Date.now(),
        date:            new Date().toISOString().slice(0, 10),
        durationMinutes: duration,
        type:            type,
        activity:        activity,
      };

      if (type === "cardio") {
        workout.heartRate = Number(data.get("heartRate"));
        if (workout.heartRate <= 0 || workout.heartRate > 220) {
          alert("Tepová frekvence musí být v rozsahu 1–220 BPM.");
          return;
        }
      } else {
        workout.weight = Number(data.get("weight"));
        workout.difficulty = (data.get("difficulty") || "MEDIUM").toString();
        if (workout.weight <= 0) {
          alert("Váha musí být kladné číslo.");
          return;
        }
      }

      workouts.push(workout);
      renderWorkouts();
      form.reset();
      updateTypeFields();
    });
  }
}

init();
