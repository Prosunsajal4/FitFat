export function validateWorkoutInput(data) {
  const errors = {};
  if (!data.type) errors.type = 'Workout type is required';
  if (!data.date) errors.date = 'Date is required';
  if (data.exercises) {
    data.exercises.forEach((ex, i) => {
      if (!ex.name) errors[`exercise_${i}`] = `Exercise ${i + 1} name is required`;
      if (ex.sets) {
        ex.sets.forEach((s, j) => {
          if (s.weight && isNaN(Number(s.weight))) {
            errors[`set_${i}_${j}`] = 'Weight must be a number';
          }
          if (s.reps && (isNaN(Number(s.reps)) || Number(s.reps) <= 0)) {
            errors[`set_${i}_${j}`] = 'Reps must be a positive number';
          }
        });
      }
    });
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateProgressInput(data) {
  const errors = {};
  if (!data.date) errors.date = 'Date is required';
  if (data.weight && (isNaN(Number(data.weight)) || Number(data.weight) <= 0)) {
    errors.weight = 'Invalid weight';
  }
  if (data.bodyFat && (isNaN(Number(data.bodyFat)) || Number(data.bodyFat) < 0 || Number(data.bodyFat) > 60)) {
    errors.bodyFat = 'Body fat must be between 0 and 60';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateNutritionInput(data) {
  const errors = {};
  if (!data.date) errors.date = 'Date is required';
  if (data.meals) {
    data.meals.forEach((meal, i) => {
      if (!meal.name) errors[`meal_${i}`] = 'Meal name is required';
      if (meal.calories && isNaN(Number(meal.calories))) {
        errors[`meal_cal_${i}`] = 'Calories must be a number';
      }
    });
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
