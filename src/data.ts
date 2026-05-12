export interface WorkoutData {
  id: string;
  date: string;
  durationMinutes: number;
  type: "cardio" | "strength";
  heartRate?: number;
  weight?: number;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}

export const workoutDataList: WorkoutData[] = [
  { id: "cardio-01", date: "2025-05-10", durationMinutes: 30, type: "cardio", heartRate: 140 },
  { id: "strength-01", date: "2025-05-10", durationMinutes: 45, type: "strength", weight: 50, difficulty: "MEDIUM" },
  { id: "cardio-02", date: "2025-05-11", durationMinutes: 20, type: "cardio", heartRate: 150 },
  { id: "strength-02", date: "2025-05-11", durationMinutes: 40, type: "strength", weight: 80, difficulty: "HARD" }
];
