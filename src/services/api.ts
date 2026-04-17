const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.2.129:8001';

export interface UserInfo {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activity_level: number;
  goal: string;
}

export interface FoodRecord {
  id?: number;
  date: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  time?: string;
}

export interface FoodRecord前端 {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  time: string;
}

export interface ExerciseRecord {
  id?: number;
  date: string;
  exercise_name: string;
  sets: number;
  reps: string;
  weight?: number;
  muscle_group: string;
  completed: number;
  calories_burned?: number;
}

export interface WaterRecord {
  id?: number;
  date: string;
  hour?: string;
  amount: number;
}

export interface DailySummary {
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_water: number;
  workout_completed: number;
  total_workout_exercises: number;
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

function toApiFoodRecord(record: FoodRecord前端): FoodRecord {
  return {
    id: record.id,
    date: new Date().toISOString().split('T')[0],
    food_name: record.name,
    calories: record.calories,
    protein: record.protein,
    carbs: record.carbs,
    fat: record.fat,
    meal_type: record.mealType,
  };
}

function fromApiFoodRecord(record: FoodRecord): FoodRecord前端 {
  return {
    id: record.id || 0,
    name: record.food_name,
    calories: record.calories,
    protein: record.protein,
    carbs: record.carbs,
    fat: record.fat,
    mealType: record.meal_type,
    time: record.time || '',
  };
}

export const api = {
  user: {
    get: () => fetchApi<UserInfo>('/users/'),
    update: (data: Partial<UserInfo>) =>
      fetchApi<UserInfo>('/users/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  food: {
    getByDate: async (date: string): Promise<FoodRecord前端[]> => {
      const records = await fetchApi<FoodRecord[]>(`/food-records/date/${date}`);
      return records.map(fromApiFoodRecord);
    },
    getRange: async (startDate: string, endDate: string): Promise<Record<string, FoodRecord前端[]>> => {
      const records = await fetchApi<FoodRecord[]>(`/food-records/?start_date=${startDate}&end_date=${endDate}`);
      const grouped: Record<string, FoodRecord前端[]> = {};
      records.forEach(record => {
        const dateKey = record.date;
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(fromApiFoodRecord(record));
      });
      return grouped;
    },
    create: async (record: FoodRecord前端): Promise<FoodRecord前端> => {
      const created = await fetchApi<FoodRecord>('/food-records/', {
        method: 'POST',
        body: JSON.stringify(toApiFoodRecord(record)),
      });
      return fromApiFoodRecord(created);
    },
    delete: (id: number) =>
      fetchApi<void>(`/food-records/${id}`, { method: 'DELETE' }),
  },

  exercise: {
    getByDate: (date: string) =>
      fetchApi<ExerciseRecord[]>(`/exercise-records/date/${date}`),
    getCompleted: (date: string) =>
      fetchApi<string[]>(`/exercise-records/completed/${date}`),
    create: (record: ExerciseRecord) =>
      fetchApi<ExerciseRecord>('/exercise-records/', {
        method: 'POST',
        body: JSON.stringify(record),
      }),
    saveDaily: (date: string, exercises: { exercise_name: string; sets: number; reps: string; weight: number; muscle_group: string; completed: number }[], totalCalories?: number, inclineMinutes?: number) =>
      fetchApi<{ saved: boolean; date: string; count: number }>('/exercise-records/daily', {
        method: 'POST',
        body: JSON.stringify({ date, exercises, totalCalories, inclineMinutes }),
      }),
    toggleCompleted: (date: string, exerciseName: string) =>
      fetchApi<{ exercise_name: string; completed: number }>(`/exercise-records/toggle/${date}/${encodeURIComponent(exerciseName)}`, {
        method: 'POST',
      }),
    markCompleted: (id: number) =>
      fetchApi<void>(`/exercise-records/${id}/complete`, { method: 'PATCH' }),
    delete: (id: number) =>
      fetchApi<void>(`/exercise-records/${id}`, { method: 'DELETE' }),
  },

  water: {
    getByDate: (date: string) =>
      fetchApi<{ date: string; total: number; records: WaterRecord[] }>(`/water-records/date/${date}`),
    getRange: (startDate: string, endDate: string) =>
      fetchApi<WaterRecord[]>(`/water-records/?start_date=${startDate}&end_date=${endDate}`),
    create: (record: WaterRecord) =>
      fetchApi<WaterRecord>('/water-records/', {
        method: 'POST',
        body: JSON.stringify(record),
      }),
    toggleHour: (date: string, hour: string, amount: number = 250) =>
      fetchApi<{ added?: boolean; deleted?: boolean }>('/water-records/hour', {
        method: 'POST',
        body: JSON.stringify({ date, hour, amount }),
      }),
    delete: (id: number) =>
      fetchApi<void>(`/water-records/${id}`, { method: 'DELETE' }),
  },

  summary: {
    getByDate: (date: string) =>
      fetchApi<DailySummary>(`/summary/date/${date}`),
    getRange: (startDate: string, endDate: string) =>
      fetchApi<DailySummary[]>(`/summary/range?start_date=${startDate}&end_date=${endDate}`),
  },
};
