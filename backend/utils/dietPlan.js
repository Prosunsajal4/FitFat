const getBangladeshiDietPlan = (goal, workoutType, weight) => {
  const proteinPerKg = goal === 'bulking' ? 2.2 : goal === 'cutting' ? 2.0 : 1.8;
  const targetProtein = Math.round(weight * proteinPerKg);
  const targetCalories = goal === 'bulking' ? Math.round(weight * 35) : goal === 'cutting' ? Math.round(weight * 25) : Math.round(weight * 30);

  const meals = {
    Push: {
      name: 'Push Day (Chest/Shoulders/Triceps)',
      breakfast: {
        name: 'ডিম ভাজি + রুটি + কলা',
        items: '3টি ডিম ভাজি (তেল কম), ২টা আটার রুটি, ১টা কলা, ১ গ্লাস দুধ',
        calories: 550, protein: 28, carbs: 55, fats: 22
      },
      snack1: {
        name: 'বাদাম + দই',
        items: '১ মুঠো চিনাবাদাম/কাজু বাদাম, ১ বাটি দই (চিনি ছাড়া)',
        calories: 250, protein: 12, carbs: 15, fats: 18
      },
      lunch: {
        name: 'ভাত + মাছ + ডাল + সবজি',
        items: '১.৫ কাপ ভাত (সাদা/লাল), ১৫০গ্রাম রুই/কাতলা মাছ ভাজা, ১ বাটি মসুর ডাল, ১ বাটি লাউ/ঢ্যাঁড়শ ভাজি',
        calories: 650, protein: 42, carbs: 75, fats: 18
      },
      snack2: {
        name: 'ডিম সেদ্ধ + চা',
        items: '২টা ডিম সেদ্ধ, ১ কাপ চা (চিনি কম/বাদ)',
        calories: 180, protein: 14, carbs: 5, fats: 12
      },
      dinner: {
        name: 'রুটি + মুরগি + সালাদ',
        items: '২টা আটার রুটি, ১৫০গ্রাম মুরগির মাংস (কম তেলে), ১ বাটি সালাদ (শসা, টমেটো, পেঁয়াজ)',
        calories: 520, protein: 38, carbs: 45, fats: 18
      },
      totals: { calories: 2150, protein: 134, carbs: 195, fats: 88 }
    },
    Pull: {
      name: 'Pull Day (Back/Biceps)',
      breakfast: {
        name: 'পরোটা + ডিম + চা',
        items: '১টা পরোটা (কম তেলে), ২টা ডিম ভাজি, ১ কাপ দুধ চা',
        calories: 580, protein: 26, carbs: 50, fats: 30
      },
      snack1: {
        name: 'কলা + বাদাম',
        items: '২টা কলা, ১ মুঠো বাদাম মিক্স',
        calories: 280, protein: 8, carbs: 45, fats: 12
      },
      lunch: {
        name: 'ভাত + ইলিশ মাছ + ডাল + সবজি',
        items: '১.৫ কাপ ভাত, ১৫০গ্রাম ইলিশ মাছ ভাজা, ১ বাটি মুগ ডাল, ১ বাটি পালং শাক',
        calories: 720, protein: 45, carbs: 70, fats: 28
      },
      snack2: {
        name: 'চানাচুর + ডিম',
        items: '১ মুঠো চানাচুর (কম), ২টা ডিম সেদ্ধ',
        calories: 220, protein: 16, carbs: 18, fats: 12
      },
      dinner: {
        name: 'ভাত + গোশত + ডাল',
        items: '১ কাপ ভাত, ১৫০গ্রাম গরুর মাংস (কম তেলে), ১ বাটি ডাল, সালাদ',
        calories: 580, protein: 40, carbs: 55, fats: 22
      },
      totals: { calories: 2380, protein: 135, carbs: 238, fats: 104 }
    },
    Legs: {
      name: 'Leg Day (Quads/Hamstrings/Calves)',
      breakfast: {
        name: 'ওটস + ডিম + কলা',
        items: '১ বাটি ওটস (দুধে), ৩টা ডিম সেদ্ধ, ১টা কলা, ১ চামচ মধু',
        calories: 620, protein: 32, carbs: 70, fats: 22
      },
      snack1: {
        name: 'দই + বাদাম + কলা',
        items: '১ বাটি দই, ১ মুঠো বাদাম, ১টা কলা',
        calories: 320, protein: 14, carbs: 35, fats: 18
      },
      lunch: {
        name: 'ভাত + মুরগি + ডাল + সবজি',
        items: '২ কাপ ভাত (লেগ ডে তাই বেশি), ২০০গ্রাম মুরগি ভাজা, ১ বাটি ডাল, ১ বাটি সবজি',
        calories: 820, protein: 55, carbs: 95, fats: 22
      },
      snack2: {
        name: 'প্রোটিন শেক/দুধ + ডিম',
        items: '১ গ্লাস দুধ (বা প্রোটিন শেক), ২টা ডিম সেদ্ধ, ২টা বিস্কুট',
        calories: 280, protein: 22, carbs: 20, fats: 14
      },
      dinner: {
        name: 'রুটি + মাছ + সালাদ',
        items: '২টা রুটি, ১৫০গ্রাম মাছ ভাজা, ১ বাটি সালাদ, ১ বাটি ডাল',
        calories: 550, protein: 38, carbs: 50, fats: 20
      },
      totals: { calories: 2590, protein: 161, carbs: 270, fats: 96 }
    },
    Rest: {
      name: 'Rest Day (Recovery)',
      breakfast: {
        name: 'রুটি + ডিম + চা',
        items: '২টা আটার রুটি, ২টা ডিম ভাজি (কম তেলে), ১ কাপ চা',
        calories: 450, protein: 22, carbs: 40, fats: 22
      },
      snack1: {
        name: 'ফল + বাদাম',
        items: '১টা আপেল/পেঁপে, ১ মুঠো বাদাম',
        calories: 200, protein: 6, carbs: 30, fats: 10
      },
      lunch: {
        name: 'ভাত + ডাল + সবজি + মাছ',
        items: '১ কাপ ভাত (কম), ১ বাটি ডাল, ১ বাটি সবজি, ১০০গ্রাম মাছ',
        calories: 520, protein: 30, carbs: 60, fats: 15
      },
      snack2: {
        name: 'দই/লসি',
        items: '১ গ্লাস লসি বা ১ বাটি দই',
        calories: 120, protein: 6, carbs: 18, fats: 3
      },
      dinner: {
        name: 'সুপ + রুটি + সালাদ',
        items: '১ বাটি চিকেন সুপ, ১টা রুটি, ১ বাটি সালাদ',
        calories: 380, protein: 25, carbs: 35, fats: 15
      },
      totals: { calories: 1670, protein: 89, carbs: 183, fats: 65 }
    },
    Cardio: {
      name: 'Cardio Day',
      breakfast: {
        name: 'ওটস + ডিম + ফল',
        items: '১ বাটি ওটস (দুধে), ২টা ডিম সেদ্ধ, ১টা কলা',
        calories: 500, protein: 26, carbs: 60, fats: 16
      },
      snack1: {
        name: 'নারিকল পানি + বাদাম',
        items: '১ গ্লাস নারিকল পানি, ১ মুঠো বাদাম',
        calories: 180, protein: 6, carbs: 15, fats: 12
      },
      lunch: {
        name: 'ভাত + মাছ + ডাল + সবজি',
        items: '১ কাপ ভাত, ১৫০গ্রাম মাছ, ১ বাটি ডাল, ১ বাটি সবজি',
        calories: 580, protein: 38, carbs: 65, fats: 16
      },
      snack2: {
        name: 'ফল + চা',
        items: '১টা আপেল/পেঁপে, ১ কাপ চা (চিনি ছাড়া)',
        calories: 120, protein: 2, carbs: 25, fats: 2
      },
      dinner: {
        name: 'সুপ + সালাদ + রুটি',
        items: '১ বাটি সুপ, ১টা রুটি, বড় সালাদ',
        calories: 350, protein: 22, carbs: 35, fats: 12
      },
      totals: { calories: 1730, protein: 94, carbs: 200, fats: 58 }
    },
    Full: {
      name: 'Full Body Day',
      breakfast: {
        name: 'পরোটা + ডিম + দুধ',
        items: '১টা পরোটা, ৩টা ডিম ভাজি, ১ গ্লাস দুধ',
        calories: 650, protein: 34, carbs: 45, fats: 38
      },
      snack1: {
        name: 'কলা + বাদাম + দই',
        items: '২টা কলা, ১ মুঠো বাদাম, ১ বাটি দই',
        calories: 350, protein: 14, carbs: 50, fats: 16
      },
      lunch: {
        name: 'ভাত + মুরগি + ডাল + সবজি',
        items: '১.৫ কাপ ভাত, ২০০গ্রাম মুরগি, ১ বাটি ডাল, ১ বাটি সবজি',
        calories: 780, protein: 52, carbs: 85, fats: 22
      },
      snack2: {
        name: 'ডিম + চা',
        items: '২টা ডিম সেদ্ধ, ১ কাপ চা',
        calories: 180, protein: 14, carbs: 5, fats: 12
      },
      dinner: {
        name: 'রুটি + মাছ + সালাদ',
        items: '২টা রুটি, ১৫০গ্রাম মাছ, বড় সালাদ',
        calories: 500, protein: 35, carbs: 45, fats: 18
      },
      totals: { calories: 2460, protein: 149, carbs: 230, fats: 106 }
    }
  };

  return meals[workoutType] || meals.Push;
};

module.exports = { getBangladeshiDietPlan };