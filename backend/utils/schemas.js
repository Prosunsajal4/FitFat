const loginSchema = {
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string', min: 6 },
};

const registerSchema = {
  name: { required: true, type: 'string', min: 2, max: 50 },
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string', min: 6 },
};

const workoutSchema = {
  type: { required: true, type: 'string' },
  date: { required: true, type: 'string' },
};

const progressSchema = {
  date: { required: true, type: 'string' },
};

const nutritionSchema = {
  date: { required: true, type: 'string' },
};

const mealSchema = {
  name: { required: true, type: 'string' },
  calories: { required: true, type: 'number', min: 0 },
};

module.exports = { loginSchema, registerSchema, workoutSchema, progressSchema, nutritionSchema, mealSchema };
