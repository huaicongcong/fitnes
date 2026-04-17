from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime
from typing import List, Optional
from collections import defaultdict

from .database import engine, Base, get_db
from .models import User, FoodRecord, ExerciseRecord, WaterRecord
from .schemas import (
    UserCreate, UserUpdate, UserResponse,
    FoodRecordCreate, FoodRecordResponse,
    ExerciseRecordCreate, ExerciseRecordResponse,
    WaterRecordCreate, WaterRecordResponse,
    DailySummaryResponse
)

app = FastAPI(title="健身追踪 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "健身追踪 API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/users/", response_model=UserResponse)
def create_or_update_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).first()
    if db_user:
        for key, value in user.model_dump(exclude_unset=True).items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
        return db_user
    else:
        db_user = User(**user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

@app.get("/users/", response_model=UserResponse)
def get_user(db: Session = Depends(get_db)):
    db_user = db.query(User).first()
    if not db_user:
        db_user = User()
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    return db_user

@app.post("/food-records/", response_model=FoodRecordResponse)
def create_food_record(record: FoodRecordCreate, db: Session = Depends(get_db)):
    db_record = FoodRecord(**record.model_dump(), user_id=1)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.get("/food-records/", response_model=List[FoodRecordResponse])
def get_food_records(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(FoodRecord)
    if start_date:
        query = query.filter(FoodRecord.date >= start_date)
    if end_date:
        query = query.filter(FoodRecord.date <= end_date)
    return query.order_by(FoodRecord.date.desc()).all()

@app.get("/food-records/date/{record_date}", response_model=List[FoodRecordResponse])
def get_food_records_by_date(record_date: date, db: Session = Depends(get_db)):
    return db.query(FoodRecord).filter(FoodRecord.date == record_date).all()

@app.delete("/food-records/{record_id}")
def delete_food_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(FoodRecord).filter(FoodRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="记录不存在")
    db.delete(db_record)
    db.commit()
    return {"message": "删除成功"}

@app.post("/exercise-records/", response_model=ExerciseRecordResponse)
def create_exercise_record(record: ExerciseRecordCreate, db: Session = Depends(get_db)):
    db_record = ExerciseRecord(**record.model_dump(), user_id=1)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.get("/exercise-records/", response_model=List[ExerciseRecordResponse])
def get_exercise_records(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ExerciseRecord)
    if start_date:
        query = query.filter(ExerciseRecord.date >= start_date)
    if end_date:
        query = query.filter(ExerciseRecord.date <= end_date)
    return query.order_by(ExerciseRecord.date.desc()).all()

@app.get("/exercise-records/date/{record_date}", response_model=List[ExerciseRecordResponse])
def get_exercise_records_by_date(record_date: date, db: Session = Depends(get_db)):
    return db.query(ExerciseRecord).filter(ExerciseRecord.date == record_date).all()

@app.get("/exercise-records/completed/{record_date}")
def get_completed_exercises(record_date: date, db: Session = Depends(get_db)):
    records = db.query(ExerciseRecord).filter(
        ExerciseRecord.date == record_date,
        ExerciseRecord.completed == 1
    ).all()
    return [r.exercise_name for r in records]

@app.post("/exercise-records/toggle/{record_date}/{exercise_name}")
def toggle_exercise_completed(record_date: date, exercise_name: str, db: Session = Depends(get_db)):
    existing = db.query(ExerciseRecord).filter(
        ExerciseRecord.date == record_date,
        ExerciseRecord.exercise_name == exercise_name
    ).first()
    if existing:
        existing.completed = 1 if existing.completed == 0 else 0
        db.commit()
        return {"exercise_name": exercise_name, "completed": existing.completed}
    return {"error": "Exercise not found"}, 404

@app.patch("/exercise-records/{record_id}/complete")
def mark_exercise_completed(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(ExerciseRecord).filter(ExerciseRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="记录不存在")
    db_record.completed = 1
    db.commit()
    return {"message": "标记完成"}

@app.delete("/exercise-records/{record_id}")
def delete_exercise_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(ExerciseRecord).filter(ExerciseRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="记录不存在")
    db.delete(db_record)
    db.commit()
    return {"message": "删除成功"}

@app.post("/water-records/", response_model=WaterRecordResponse)
def create_water_record(record: WaterRecordCreate, db: Session = Depends(get_db)):
    existing = db.query(WaterRecord).filter(
        WaterRecord.date == record.date,
        WaterRecord.hour == record.hour
    ).first()
    if existing:
        existing.amount = record.amount
        db.commit()
        db.refresh(existing)
        return existing
    db_record = WaterRecord(**record.model_dump(), user_id=1)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.get("/water-records/", response_model=List[WaterRecordResponse])
def get_water_records(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(WaterRecord)
    if start_date:
        query = query.filter(WaterRecord.date >= start_date)
    if end_date:
        query = query.filter(WaterRecord.date <= end_date)
    return query.order_by(WaterRecord.date.desc()).all()

@app.get("/water-records/date/{record_date}")
def get_water_records_by_date(record_date: date, db: Session = Depends(get_db)):
    records = db.query(WaterRecord).filter(WaterRecord.date == record_date).all()
    total = sum(r.amount for r in records)
    return {"date": record_date, "total": total, "records": records}

@app.delete("/water-records/{record_id}")
def delete_water_record(record_id: int, db: Session = Depends(get_db)):
    db_record = db.query(WaterRecord).filter(WaterRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="记录不存在")
    db.delete(db_record)
    db.commit()
    return {"message": "删除成功"}

@app.post("/water-records/hour")
def toggle_water_hour(data: dict, db: Session = Depends(get_db)):
    record_date_str = data.get("date")
    hour = data.get("hour")
    amount = data.get("amount", 250)
    record_date = datetime.strptime(record_date_str, "%Y-%m-%d").date() if isinstance(record_date_str, str) else record_date_str
    existing = db.query(WaterRecord).filter(
        WaterRecord.date == record_date,
        WaterRecord.hour == hour
    ).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"deleted": True, "hour": hour}
    db_record = WaterRecord(date=record_date, hour=hour, amount=amount, user_id=1)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return {"added": True, "record": db_record}

@app.post("/exercise-records/daily")
def save_daily_workout(data: dict, db: Session = Depends(get_db)):
    record_date_str = data.get("date")
    record_date = datetime.strptime(record_date_str, "%Y-%m-%d").date() if isinstance(record_date_str, str) else record_date_str
    exercises = data.get("exercises", [])
    deleted = db.query(ExerciseRecord).filter(ExerciseRecord.date == record_date).delete()
    db.commit()
    for ex in exercises:
        db_record = ExerciseRecord(
            date=record_date,
            exercise_name=ex.get("exercise_name", ""),
            sets=ex.get("sets", 4),
            reps=ex.get("reps", "10"),
            weight=ex.get("weight", 0),
            muscle_group=ex.get("muscle_group", ""),
            completed=ex.get("completed", 0),
            user_id=1
        )
        db.add(db_record)
    db.commit()
    return {"saved": True, "date": record_date, "count": len(exercises)}

@app.get("/summary/date/{record_date}", response_model=DailySummaryResponse)
def get_daily_summary(record_date: date, db: Session = Depends(get_db)):
    food_records = db.query(FoodRecord).filter(FoodRecord.date == record_date).all()
    exercise_records = db.query(ExerciseRecord).filter(ExerciseRecord.date == record_date).all()
    water_records = db.query(WaterRecord).filter(WaterRecord.date == record_date).all()

    total_calories = sum(r.calories for r in food_records)
    total_protein = sum(r.protein for r in food_records)
    total_carbs = sum(r.carbs for r in food_records)
    total_fat = sum(r.fat for r in food_records)
    total_water = sum(r.amount for r in water_records)
    workout_completed = sum(1 for r in exercise_records if r.completed == 1)

    return DailySummaryResponse(
        date=record_date,
        total_calories=total_calories,
        total_protein=total_protein,
        total_carbs=total_carbs,
        total_fat=total_fat,
        total_water=total_water,
        workout_completed=workout_completed,
        total_workout_exercises=len(exercise_records)
    )

@app.get("/summary/range")
def get_range_summary(
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: Session = Depends(get_db)
):
    food_records = db.query(FoodRecord).filter(
        FoodRecord.date >= start_date,
        FoodRecord.date <= end_date
    ).all()
    water_records = db.query(WaterRecord).filter(
        WaterRecord.date >= start_date,
        WaterRecord.date <= end_date
    ).all()

    daily_data = defaultdict(lambda: {
        "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "water": 0
    })

    for r in food_records:
        daily_data[r.date]["calories"] += r.calories
        daily_data[r.date]["protein"] += r.protein
        daily_data[r.date]["carbs"] += r.carbs
        daily_data[r.date]["fat"] += r.fat

    for r in water_records:
        daily_data[r.date]["water"] += r.amount

    return [{"date": d, **data} for d, data in sorted(daily_data.items())]
