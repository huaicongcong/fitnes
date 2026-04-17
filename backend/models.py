from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    weight = Column(Float, default=75)
    height = Column(Float, default=176)
    age = Column(Integer, default=28)
    gender = Column(String, default="male")
    activity_level = Column(Float, default=1.55)
    goal = Column(String, default="减脂增肌")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    food_records = relationship("FoodRecord", back_populates="user")
    exercise_records = relationship("ExerciseRecord", back_populates="user")
    water_records = relationship("WaterRecord", back_populates="user")

class FoodRecord(Base):
    __tablename__ = "food_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    date = Column(Date)
    food_name = Column(String)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    meal_type = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="food_records")

class ExerciseRecord(Base):
    __tablename__ = "exercise_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    date = Column(Date)
    exercise_name = Column(String)
    sets = Column(Integer)
    reps = Column(String)
    weight = Column(Float)
    muscle_group = Column(String)
    completed = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="exercise_records")

class WaterRecord(Base):
    __tablename__ = "water_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    date = Column(Date)
    hour = Column(String, nullable=True)
    amount = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="water_records")
