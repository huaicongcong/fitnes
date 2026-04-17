from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List

class UserBase(BaseModel):
    weight: Optional[float] = 75
    height: Optional[float] = 176
    age: Optional[int] = 28
    gender: Optional[str] = "male"
    activity_level: Optional[float] = 1.55
    goal: Optional[str] = "减脂增肌"

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class FoodRecordBase(BaseModel):
    date: date
    food_name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    meal_type: str

class FoodRecordCreate(FoodRecordBase):
    pass

class FoodRecordResponse(FoodRecordBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ExerciseRecordBase(BaseModel):
    date: date
    exercise_name: str
    sets: int
    reps: str
    weight: Optional[float] = 0
    muscle_group: str
    completed: int = 0

class ExerciseRecordCreate(ExerciseRecordBase):
    pass

class ExerciseRecordResponse(ExerciseRecordBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class WaterRecordBase(BaseModel):
    date: date
    amount: int
    hour: Optional[str] = None

class WaterRecordCreate(WaterRecordBase):
    pass

class WaterRecordResponse(WaterRecordBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DailyWaterResponse(BaseModel):
    date: date
    total: int
    records: List[WaterRecordResponse]

class DailySummaryResponse(BaseModel):
    date: date
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    total_water: int
    workout_completed: int
    total_workout_exercises: int

class WorkoutSummaryResponse(BaseModel):
    date: date
    muscle_group: str
    exercises: List[ExerciseRecordResponse]
    completed_count: int
    total_count: int
