const Chat = require('../models/Chat');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_NEW;

const callGeminiAPI = async (prompt, systemPrompt = '') => {
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.95,
          topK: 40
        }
      })
    }
  );

  const data = await response.json();

  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error(data.error?.message || 'Gemini API error');
};

const generateWorkoutPlan = async (req, res) => {
  try {
    const { goal, weight, height, age, experience, equipment } = req.body;

    const systemPrompt = `You are a professional fitness trainer and nutrition coach. Create detailed, personalized workout plans based on user goals and body stats. Be specific with exercises, sets, reps, and rest periods. Always respond in valid JSON format.`;

    const prompt = `Create a detailed weekly workout plan for someone with the following profile:
- Goal: ${goal}
- Weight: ${weight}kg
- Height: ${height}cm
- Age: ${age}
- Experience level: ${experience}
- Available equipment: ${equipment || 'full gym'}

Please provide a 7-day workout plan with day names (Push, Pull, Legs, Rest, etc.) and for each workout day include exercises with name, sets, reps, and notes. Format the response as a JSON array like:
[{"day": "Push", "exercises": [{"name": "Bench Press", "sets": 4, "reps": "8-10", "notes": "Compound movement"}]}]`;

    const planText = await callGeminiAPI(prompt, systemPrompt);

    let parsedPlan;
    try {
      parsedPlan = JSON.parse(planText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      parsedPlan = parseWorkoutPlan(planText);
    }

    res.json({
      plan: parsedPlan,
      rawPlan: planText
    });
  } catch (error) {
    console.error('Gemini API Error:', error);

    const fallbackPlan = generateFallbackPlan(req.body);
    res.json({
      plan: fallbackPlan,
      rawPlan: 'Generated fallback plan due to API error',
      isFallback: true
    });
  }
};

const parseWorkoutPlan = (planText) => {
  const days = [];
  const lines = planText.split('\n');
  let currentDay = null;

  lines.forEach(line => {
    const dayMatch = line.match(/^(Day\s*\d+|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Push|Pull|Legs|Rest|Upper|Lower|Full):?/i);

    if (dayMatch) {
      if (currentDay) days.push(currentDay);
      currentDay = {
        day: dayMatch[1],
        exercises: []
      };
    } else if (currentDay && line.trim()) {
      const exerciseMatch = line.match(/^[-•*]?\s*(\d+\.)?\s*([^:]+):?\s*(.+)/i);
      if (exerciseMatch) {
        const repsMatch = line.match(/(\d+)-(\d+)\s*(reps|rep)/i) || line.match(/(\d+)\s*(reps|rep)/i);
        const setsMatch = line.match(/(\d+)\s*sets?/i);

        currentDay.exercises.push({
          name: exerciseMatch[2].trim(),
          sets: setsMatch ? parseInt(setsMatch[1]) : 3,
          reps: repsMatch ? repsMatch[1] : '8-12',
          notes: exerciseMatch[3].trim()
        });
      }
    }
  });

  if (currentDay) days.push(currentDay);

  return days.length > 0 ? days : generateFallbackPlan({});
};

const generateFallbackPlan = (profile) => {
  const { goal, experience } = profile;
  const setsMultiplier = experience === 'beginner' ? 1 : experience === 'intermediate' ? 1.5 : 2;

  const plans = {
    bulking: [
      { day: 'Push', exercises: [
        { name: 'Bench Press', sets: Math.round(4 * setsMultiplier), reps: '8-10', notes: 'Compound movement' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', notes: 'Upper chest focus' },
        { name: 'Overhead Press', sets: 3, reps: '8-10', notes: 'Shoulders' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', notes: 'Triceps' },
        { name: 'Lateral Raises', sets: 3, reps: '15-20', notes: 'Shoulder isolation' }
      ]},
      { day: 'Pull', exercises: [
        { name: 'Deadlift', sets: Math.round(4 * setsMultiplier), reps: '5-8', notes: 'Compound movement' },
        { name: 'Barbell Rows', sets: 4, reps: '8-10', notes: 'Back thickness' },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', notes: 'Lat width' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', notes: 'Rear delts' },
        { name: 'Barbell Curls', sets: 3, reps: '10-12', notes: 'Biceps' }
      ]},
      { day: 'Legs', exercises: [
        { name: 'Squats', sets: Math.round(4 * setsMultiplier), reps: '8-10', notes: 'King of leg exercises' },
        { name: 'Romanian Deadlift', sets: 3, reps: '10-12', notes: 'Hamstrings' },
        { name: 'Leg Press', sets: 3, reps: '12-15', notes: 'Quadriceps' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', notes: 'Hamstring isolation' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', notes: 'Calves' }
      ]},
      { day: 'Rest', exercises: [] },
      { day: 'Upper Body', exercises: [
        { name: 'Dumbbell Press', sets: 4, reps: '8-10', notes: 'Chest' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', notes: 'Back & Biceps' },
        { name: 'Military Press', sets: 3, reps: '8-10', notes: 'Shoulders' },
        { name: 'Dumbbell Rows', sets: 3, reps: '10-12', notes: 'Back' },
        { name: 'Cable Curls & Extensions', sets: 3, reps: '12', notes: 'Arms' }
      ]},
      { day: 'Lower Body', exercises: [
        { name: 'Front Squats', sets: 4, reps: '8-10', notes: 'Quads focus' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12', notes: 'Unilateral' },
        { name: 'Hip Thrusts', sets: 3, reps: '10-12', notes: 'Glutes' },
        { name: 'Calf Raises', sets: 4, reps: '15-20', notes: 'Calves' },
        { name: 'Plank', sets: 3, reps: '60s', notes: 'Core' }
      ]},
      { day: 'Rest', exercises: [] },
      { day: 'Rest', exercises: [] }
    ],
    cutting: [
      { day: 'Push', exercises: [
        { name: 'Bench Press', sets: 3, reps: '10-12', notes: 'Compound' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '12-15', notes: 'Upper chest' },
        { name: 'Cable Flys', sets: 3, reps: '15-20', notes: 'Chest isolation' },
        { name: 'Overhead Press', sets: 3, reps: '10-12', notes: 'Shoulders' },
        { name: 'Tricep Dips', sets: 3, reps: '12-15', notes: 'Triceps' }
      ]},
      { day: 'Pull', exercises: [
        { name: 'Pull-ups', sets: 4, reps: '8-12', notes: 'Compound back' },
        { name: 'Barbell Rows', sets: 3, reps: '10-12', notes: 'Back' },
        { name: 'Lat Pulldowns', sets: 3, reps: '12-15', notes: 'Lats' },
        { name: 'Hammer Curls', sets: 3, reps: '12-15', notes: 'Biceps' },
        { name: 'Cable Face Pulls', sets: 3, reps: '15-20', notes: 'Rear delts' }
      ]},
      { day: 'Legs', exercises: [
        { name: 'Walking Lunges', sets: 4, reps: '12-15', notes: 'Compound' },
        { name: 'Leg Press', sets: 3, reps: '15-20', notes: 'Volume' },
        { name: 'Romanian Deadlift', sets: 3, reps: '12-15', notes: 'Hamstrings' },
        { name: 'Leg Curls', sets: 3, reps: '15-20', notes: 'Isolation' },
        { name: 'Calf Raises', sets: 4, reps: '20-25', notes: 'High rep' }
      ]},
      { day: 'Rest', exercises: [] },
      { day: 'Full Body', exercises: [
        { name: 'Goblet Squats', sets: 4, reps: '12-15', notes: 'Lower body' },
        { name: 'Push-ups', sets: 4, reps: '15-20', notes: 'Upper body' },
        { name: 'Inverted Rows', sets: 3, reps: '12-15', notes: 'Back' },
        { name: 'Plank', sets: 3, reps: '45-60s', notes: 'Core' },
        { name: 'Kettlebell Swings', sets: 3, reps: '20', notes: 'Cardio & strength' }
      ]},
      { day: 'Upper Body', exercises: [
        { name: 'Dumbbell Press', sets: 3, reps: '12-15', notes: 'Chest' },
        { name: 'Dumbbell Rows', sets: 4, reps: '10-12', notes: 'Back' },
        { name: 'Lateral Raises', sets: 4, reps: '15-20', notes: 'Shoulders' },
        { name: 'Preacher Curls', sets: 3, reps: '12-15', notes: 'Biceps' },
        { name: 'Skull Crushers', sets: 3, reps: '12-15', notes: 'Triceps' }
      ]},
      { day: 'Active Recovery', exercises: [
        { name: 'Light Cardio', sets: 1, reps: '30 min', notes: 'Walking or cycling' },
        { name: 'Stretching', sets: 1, reps: '15 min', notes: 'Full body' }
      ]}
    ],
    strength: [
      { day: 'Upper Body Push', exercises: [
        { name: 'Bench Press', sets: 5, reps: '5', notes: 'Main compound' },
        { name: 'Overhead Press', sets: 5, reps: '5', notes: 'Strength' },
        { name: 'Incline Bench', sets: 4, reps: '6-8', notes: 'Variation' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '8-10', notes: 'Isolation' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', notes: 'Accessory' }
      ]},
      { day: 'Lower Body', exercises: [
        { name: 'Barbell Squats', sets: 5, reps: '5', notes: 'Primary' },
        { name: 'Deadlift', sets: 5, reps: '3-5', notes: 'Power' },
        { name: 'Front Squats', sets: 3, reps: '6-8', notes: 'Variation' },
        { name: 'Leg Curls', sets: 3, reps: '10-12', notes: 'Hamstrings' },
        { name: 'Calf Raises', sets: 4, reps: '10-12', notes: 'Calves' }
      ]},
      { day: 'Upper Body Pull', exercises: [
        { name: 'Barbell Rows', sets: 5, reps: '5', notes: 'Main compound' },
        { name: 'Pull-ups', sets: 4, reps: '6-8', notes: 'Bodyweight' },
        { name: 'Lat Pulldowns', sets: 3, reps: '8-10', notes: 'Volume' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', notes: 'Rear delts' },
        { name: 'Barbell Curls', sets: 3, reps: '10-12', notes: 'Biceps' }
      ]},
      { day: 'Rest', exercises: [] },
      { day: 'Full Body', exercises: [
        { name: 'Deadlift', sets: 5, reps: '3', notes: 'Power' },
        { name: 'Bench Press', sets: 4, reps: '6', notes: 'Strength' },
        { name: 'Barbell Rows', sets: 4, reps: '6', notes: 'Back' },
        { name: 'Overhead Press', sets: 4, reps: '6', notes: 'Shoulders' },
        { name: 'Squats', sets: 4, reps: '6', notes: 'Legs' }
      ]},
      { day: 'Rest', exercises: [] },
      { day: 'Accessory', exercises: [
        { name: 'Dumbbell Press', sets: 3, reps: '10-12', notes: 'Chest' },
        { name: 'Cable Rows', sets: 3, reps: '10-12', notes: 'Back' },
        { name: 'Leg Press', sets: 3, reps: '12-15', notes: 'Legs' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', notes: 'Back' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', notes: 'Shoulders' }
      ]}
    ],
    fat_loss: [
      { day: 'Full Body A', exercises: [
        { name: 'Goblet Squats', sets: 4, reps: '12-15', notes: 'Compound leg' },
        { name: 'Push-ups', sets: 4, reps: '10-15', notes: 'Upper body' },
        { name: 'Dumbbell Rows', sets: 4, reps: '10-12', notes: 'Back' },
        { name: 'Kettlebell Swings', sets: 4, reps: '15-20', notes: 'Cardio & strength' },
        { name: 'Plank', sets: 3, reps: '45s', notes: 'Core' }
      ]},
      { day: 'Cardio & Core', exercises: [
        { name: 'HIIT Sprints', sets: 1, reps: '20 min', notes: 'Intense cardio' },
        { name: 'Mountain Climbers', sets: 3, reps: '30s', notes: 'Core cardio' },
        { name: 'Bicycle Crunches', sets: 3, reps: '20', notes: 'Core' },
        { name: 'Russian Twists', sets: 3, reps: '20 each', notes: 'Obliques' },
        { name: 'Leg Raises', sets: 3, reps: '15', notes: 'Lower abs' }
      ]},
      { day: 'Upper Body', exercises: [
        { name: 'Dumbbell Press', sets: 4, reps: '10-12', notes: 'Chest' },
        { name: 'Bent Over Rows', sets: 4, reps: '10-12', notes: 'Back' },
        { name: 'Shoulder Press', sets: 3, reps: '12-15', notes: 'Shoulders' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', notes: 'Arms' },
        { name: 'Tricep Extensions', sets: 3, reps: '12-15', notes: 'Arms' }
      ]},
      { day: 'Active Rest', exercises: [
        { name: 'Walking', sets: 1, reps: '30-45 min', notes: 'Light cardio' },
        { name: 'Stretching', sets: 1, reps: '15 min', notes: 'Flexibility' }
      ]},
      { day: 'Full Body B', exercises: [
        { name: 'Lunges', sets: 4, reps: '12 each', notes: 'Legs' },
        { name: 'Incline Push-ups', sets: 4, reps: '10-15', notes: 'Upper body' },
        { name: 'Lat Pulldowns', sets: 4, reps: '10-12', notes: 'Back' },
        { name: 'Jump Squats', sets: 3, reps: '15', notes: 'Plyometric' },
        { name: 'Plank with Shoulder Taps', sets: 3, reps: '30s', notes: 'Core stability' }
      ]},
      { day: 'Cardio', exercises: [
        { name: 'Circuit Training', sets: 1, reps: '30 min', notes: 'Full body' },
        { name: 'Burpees', sets: 3, reps: '15', notes: 'Explosive' },
        { name: 'Jump Rope', sets: 3, reps: '3 min', notes: 'Cardio' },
        { name: 'Box Jumps', sets: 3, reps: '12', notes: 'Power' }
      ]},
      { day: 'Rest', exercises: [] }
    ],
    maintenance: [
      { day: 'Push', exercises: [
        { name: 'Bench Press', sets: 3, reps: '8-10', notes: 'Chest' },
        { name: 'Incline Press', sets: 3, reps: '10-12', notes: 'Upper chest' },
        { name: 'Shoulder Press', sets: 3, reps: '8-10', notes: 'Shoulders' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12', notes: 'Triceps' },
        { name: 'Lateral Raises', sets: 3, reps: '15', notes: 'Delts' }
      ]},
      { day: 'Pull', exercises: [
        { name: 'Pull-ups', sets: 3, reps: '8-12', notes: 'Back' },
        { name: 'Barbell Rows', sets: 3, reps: '8-10', notes: 'Back' },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', notes: 'Lats' },
        { name: 'Face Pulls', sets: 3, reps: '15', notes: 'Rear delts' },
        { name: 'Curls', sets: 3, reps: '12', notes: 'Biceps' }
      ]},
      { day: 'Legs', exercises: [
        { name: 'Squats', sets: 4, reps: '8-10', notes: 'Main compound' },
        { name: 'Deadlift', sets: 3, reps: '8-10', notes: 'Posterior chain' },
        { name: 'Leg Press', sets: 3, reps: '12', notes: 'Quads' },
        { name: 'Leg Curls', sets: 3, reps: '12', notes: 'Hamstrings' },
        { name: 'Calf Raises', sets: 4, reps: '15', notes: 'Calves' }
      ]},
      { day: 'Rest', exercises: [] },
      { day: 'Upper Body', exercises: [
        { name: 'Dumbbell Press', sets: 3, reps: '10-12', notes: 'Chest' },
        { name: 'Cable Rows', sets: 3, reps: '10-12', notes: 'Back' },
        { name: 'Arnold Press', sets: 3, reps: '10-12', notes: 'Shoulders' },
        { name: 'Hammer Curls', sets: 3, reps: '12', notes: 'Biceps' },
        { name: 'Tricep Dips', sets: 3, reps: '12', notes: 'Triceps' }
      ]},
      { day: 'Lower Body', exercises: [
        { name: 'Front Squats', sets: 3, reps: '10', notes: 'Quads' },
        { name: 'Romanian Deadlift', sets: 3, reps: '10-12', notes: 'Hamstrings' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '12 each', notes: 'Unilateral' },
        { name: 'Hip Thrusts', sets: 3, reps: '12', notes: 'Glutes' },
        { name: 'Calf Raises', sets: 4, reps: '15', notes: 'Calves' }
      ]},
      { day: 'Rest', exercises: [] }
    ]
  };

  return plans[goal] || plans.maintenance;
};

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const user = await User.findById(req.user._id);
    const recentWorkouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(5);

    const nutrition = await Nutrition.findOne({
      user: req.user._id,
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    let context = `You are FitFat, an AI fitness coach. You are helpful, motivating, and knowledgeable about fitness, nutrition, and training. `;
    context += `User profile: ${user?.name || 'Fitness enthusiast'}, Goal: ${user?.goal || 'maintenance'}, Experience: ${user?.experience || 'beginner'}. `;
    context += `Stats - Streak: ${user?.stats?.streak || 0} days, Total workouts: ${user?.stats?.totalWorkouts || 0}, Level: ${user?.stats?.level || 1}. `;

    if (user?.body?.weight) {
      context += `Body stats - Weight: ${user.body.weight}kg, Body Fat: ${user.body.bodyFat || 'unknown'}%. `;
    }

    if (recentWorkouts.length > 0) {
      context += `Recent workouts: `;
      recentWorkouts.forEach(w => {
        context += `${w.name} (${new Date(w.date).toLocaleDateString()}), `;
      });
    }

    if (nutrition) {
      context += `Today's nutrition: ${nutrition.totalCalories} calories, ${nutrition.totalProtein}g protein, ${nutrition.waterIntake} glasses of water. `;
    }

    context += `\n\nUser asks: ${message}\n\nProvide a helpful, concise response with fitness advice. Use emojis sparingly.`;

    const response = await callGeminiAPI(context);

    let chatHistory = await Chat.findOne({ user: req.user._id });
    if (!chatHistory) {
      chatHistory = await Chat.create({ user: req.user._id, messages: [] });
    }

    chatHistory.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    );

    if (chatHistory.messages.length > 50) {
      chatHistory.messages = chatHistory.messages.slice(-50);
    }

    chatHistory.lastMessageAt = new Date();
    await chatHistory.save();

    res.json({ response });
  } catch (error) {
    console.error('Chat Error:', error);

    const fallbackResponses = [
      "Keep pushing! Every workout counts towards your goals. 💪",
      "Remember: consistency beats intensity. Small steps every day lead to big results!",
      "Stay focused on your journey. The only bad workout is the one that didn't happen.",
      "Your body can do it, your mind needs to believe it. You've got this! 🔥",
      "Progress isn't always visible, but it's always happening. Trust the process!"
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    let chatHistory = await Chat.findOne({ user: req.user._id });
    if (chatHistory) {
      chatHistory.messages.push(
        { role: 'user', content: req.body.message },
        { role: 'assistant', content: randomResponse }
      );
      await chatHistory.save();
    }

    res.json({ response: randomResponse, isFallback: true });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const chatHistory = await Chat.findOne({ user: req.user._id });
    res.json(chatHistory?.messages || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const clearChatHistory = async (req, res) => {
  try {
    await Chat.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recentWorkouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(7);

    const recommendations = [];

    const today = new Date();
    const dayOfWeek = today.getDay();

    const workoutDays = {
      0: 'Rest',
      1: 'Push',
      2: 'Pull',
      3: 'Legs',
      4: 'Upper',
      5: 'Lower',
      6: 'Full Body'
    };

    recommendations.push({
      type: 'suggestion',
      message: `Today is a good day for ${workoutDays[dayOfWeek] || 'training'}!`,
      priority: 'high'
    });

    if (recentWorkouts.length > 0) {
      const lastWorkout = recentWorkouts[0];
      const daysSinceLastWorkout = Math.floor((today - new Date(lastWorkout.date)) / (1000 * 60 * 60 * 24));

      if (daysSinceLastWorkout > 2) {
        recommendations.push({
          type: 'warning',
          message: `It's been ${daysSinceLastWorkout} days since your last workout. Time to get back in the gym!`,
          priority: 'high'
        });
      }

      const muscleGroups = {};
      recentWorkouts.forEach(w => {
        w.exercises.forEach(e => {
          const muscle = e.muscleGroup || 'other';
          muscleGroups[muscle] = (muscleGroups[muscle] || 0) + (e.sets * e.reps);
        });
      });

      const sortedMuscles = Object.entries(muscleGroups).sort((a, b) => a[1] - b[1]);

      if (sortedMuscles.length > 0 && sortedMuscles[0][1] < sortedMuscles[sortedMuscles.length - 1][1] * 0.3) {
        recommendations.push({
          type: 'balance',
          message: `Your ${sortedMuscles[0][0]} muscles might be underworked. Consider adding more exercises for that area.`,
          priority: 'medium'
        });
      }
    }

    if (user?.stats?.streak && user.stats.streak >= 7) {
      recommendations.push({
        type: 'achievement',
        message: `Amazing! You've hit a ${user.stats.streak}-day streak! Keep it up! 🔥`,
        priority: 'low'
      });
    }

    res.json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  generateWorkoutPlan,
  chatWithAI,
  getChatHistory,
  clearChatHistory,
  getRecommendations
};