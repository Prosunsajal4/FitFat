const getBangladeshiDietPlan = (goal, workoutType, weight, lang) => {
  const proteinPerKg = goal === 'bulking' ? 2.2 : goal === 'cutting' ? 2.0 : 1.8;
  const targetProtein = Math.round(weight * proteinPerKg);
  const targetCalories = goal === 'bulking' ? Math.round(weight * 35) : goal === 'cutting' ? Math.round(weight * 25) : Math.round(weight * 30);

  const isBn = lang !== 'en';

  const meals = {
    Push: {
      name: isBn ? 'পুশ ডে (বুক/কাঁধ/ট্রাইসেপস)' : 'Push Day (Chest/Shoulders/Triceps)',
      breakfast: {
        name: isBn ? 'ডিম ভাজি + রুটি + কলা' : 'Egg Fry + Roti + Banana',
        items: isBn ? '৩টি ডিম ভাজি (তেল কম), ২টা আটার রুটি, ১টা কলা, ১ গ্লাস দুধ' : '3 fried eggs (less oil), 2 wheat roti, 1 banana, 1 glass milk',
        calories: 550, protein: 28, carbs: 55, fats: 22
      },
      snack1: {
        name: isBn ? 'বাদাম + দই' : 'Nuts + Yogurt',
        items: isBn ? '১ মুঠো চিনাবাদাম/কাজু বাদাম, ১ বাটি দই (চিনি ছাড়া)' : '1 handful peanuts/cashews, 1 bowl yogurt (no sugar)',
        calories: 250, protein: 12, carbs: 15, fats: 18
      },
      lunch: {
        name: isBn ? 'ভাত + মাছ + ডাল + সবজি' : 'Rice + Fish + Dal + Vegetables',
        items: isBn ? '১.৫ কাপ ভাত (সাদা/লাল), ১৫০গ্রাম রুই/কাতলা মাছ ভাজা, ১ বাটি মসুর ডাল, ১ বাটি লাউ/ঢ্যাঁড়শ ভাজি' : '1.5 cups rice (white/red), 150g Rui/Katla fish fry, 1 bowl masoor dal, 1 bowl gourd/potol curry',
        calories: 650, protein: 42, carbs: 75, fats: 18
      },
      snack2: {
        name: isBn ? 'ডিম সেদ্ধ + চা' : 'Boiled Eggs + Tea',
        items: isBn ? '২টা ডিম সেদ্ধ, ১ কাপ চা (চিনি কম/বাদ)' : '2 boiled eggs, 1 cup tea (less/no sugar)',
        calories: 180, protein: 14, carbs: 5, fats: 12
      },
      dinner: {
        name: isBn ? 'রুটি + মুরগি + সালাদ' : 'Roti + Chicken + Salad',
        items: isBn ? '২টা আটার রুটি, ১৫০গ্রাম মুরগির মাংস (কম তেলে), ১ বাটি সালাদ (শসা, টমেটো, পেঁয়াজ)' : '2 wheat roti, 150g chicken (less oil), 1 bowl salad (cucumber, tomato, onion)',
        calories: 520, protein: 38, carbs: 45, fats: 18
      },
      totals: { calories: 2150, protein: 134, carbs: 195, fats: 88 }
    },
    Pull: {
      name: isBn ? 'পুল ডে (পিঠ/বাইসেপস)' : 'Pull Day (Back/Biceps)',
      breakfast: {
        name: isBn ? 'পরোটা + ডিম + চা' : 'Paratha + Egg + Tea',
        items: isBn ? '১টা পরোটা (কম তেলে), ২টা ডিম ভাজি, ১ কাপ দুধ চা' : '1 paratha (less oil), 2 fried eggs, 1 cup milk tea',
        calories: 580, protein: 26, carbs: 50, fats: 30
      },
      snack1: {
        name: isBn ? 'কলা + বাদাম' : 'Banana + Nuts',
        items: isBn ? '২টা কলা, ১ মুঠো বাদাম মিক্স' : '2 bananas, 1 handful mixed nuts',
        calories: 280, protein: 8, carbs: 45, fats: 12
      },
      lunch: {
        name: isBn ? 'ভাত + ইলিশ মাছ + ডাল + সবজি' : 'Rice + Hilsa Fish + Dal + Vegetables',
        items: isBn ? '১.৫ কাপ ভাত, ১৫০গ্রাম ইলিশ মাছ ভাজা, ১ বাটি মুগ ডাল, ১ বাটি পালং শাক' : '1.5 cups rice, 150g Hilsa fish fry, 1 bowl moong dal, 1 bowl spinach curry',
        calories: 720, protein: 45, carbs: 70, fats: 28
      },
      snack2: {
        name: isBn ? 'চানাচুর + ডিম' : 'Chanachur + Eggs',
        items: isBn ? '১ মুঠো চানাচুর (কম), ২টা ডিম সেদ্ধ' : '1 handful chanachur (less), 2 boiled eggs',
        calories: 220, protein: 16, carbs: 18, fats: 12
      },
      dinner: {
        name: isBn ? 'ভাত + গোশত + ডাল' : 'Rice + Beef + Dal',
        items: isBn ? '১ কাপ ভাত, ১৫০গ্রাম গরুর মাংস (কম তেলে), ১ বাটি ডাল, সালাদ' : '1 cup rice, 150g beef (less oil), 1 bowl dal, salad',
        calories: 580, protein: 40, carbs: 55, fats: 22
      },
      totals: { calories: 2380, protein: 135, carbs: 238, fats: 104 }
    },
    Legs: {
      name: isBn ? 'লেগ ডে (কোয়াডস/হ্যামস্ট্রিংস/কাফস)' : 'Leg Day (Quads/Hamstrings/Calves)',
      breakfast: {
        name: isBn ? 'ওটস + ডিম + কলা' : 'Oats + Eggs + Banana',
        items: isBn ? '১ বাটি ওটস (দুধে), ৩টা ডিম সেদ্ধ, ১টা কলা, ১ চামচ মধু' : '1 bowl oats (in milk), 3 boiled eggs, 1 banana, 1 spoon honey',
        calories: 620, protein: 32, carbs: 70, fats: 22
      },
      snack1: {
        name: isBn ? 'দই + বাদাম + কলা' : 'Doi + Nuts + Banana',
        items: isBn ? '১ বাটি দই, ১ মুঠো বাদাম, ১টা কলা' : '1 bowl yogurt, 1 handful nuts, 1 banana',
        calories: 320, protein: 14, carbs: 35, fats: 18
      },
      lunch: {
        name: isBn ? 'ভাত + মুরগি + ডাল + সবজি' : 'Rice + Chicken + Dal + Vegetables',
        items: isBn ? '২ কাপ ভাত (লেগ ডে তাই বেশি), ২০০গ্রাম মুরগি ভাজা, ১ বাটি ডাল, ১ বাটি সবজি' : '2 cups rice (leg day more), 200g chicken fry, 1 bowl dal, 1 bowl vegetables',
        calories: 820, protein: 55, carbs: 95, fats: 22
      },
      snack2: {
        name: isBn ? 'প্রোটিন শেক/দুধ + ডিম' : 'Protein Shake/Milk + Eggs',
        items: isBn ? '১ গ্লাস দুধ (বা প্রোটিন শেক), ২টা ডিম সেদ্ধ, ২টা বিস্কুট' : '1 glass milk (or protein shake), 2 boiled eggs, 2 biscuits',
        calories: 280, protein: 22, carbs: 20, fats: 14
      },
      dinner: {
        name: isBn ? 'রুটি + মাছ + সালাদ' : 'Roti + Fish + Salad',
        items: isBn ? '২টা রুটি, ১৫০গ্রাম মাছ ভাজা, ১ বাটি সালাদ, ১ বাটি ডাল' : '2 roti, 150g fish fry, 1 bowl salad, 1 bowl dal',
        calories: 550, protein: 38, carbs: 50, fats: 20
      },
      totals: { calories: 2590, protein: 161, carbs: 270, fats: 96 }
    },
    Rest: {
      name: isBn ? 'রেস্ট ডে (রিকভারি)' : 'Rest Day (Recovery)',
      breakfast: {
        name: isBn ? 'রুটি + ডিম + চা' : 'Roti + Eggs + Tea',
        items: isBn ? '২টা আটার রুটি, ২টা ডিম ভাজি (কম তেলে), ১ কাপ চা' : '2 wheat roti, 2 fried eggs (less oil), 1 cup tea',
        calories: 450, protein: 22, carbs: 40, fats: 22
      },
      snack1: {
        name: isBn ? 'ফল + বাদাম' : 'Fruits + Nuts',
        items: isBn ? '১টা আপেল/পেঁপে, ১ মুঠো বাদাম' : '1 apple/papaya, 1 handful nuts',
        calories: 200, protein: 6, carbs: 30, fats: 10
      },
      lunch: {
        name: isBn ? 'ভাত + ডাল + সবজি + মাছ' : 'Rice + Dal + Vegetables + Fish',
        items: isBn ? '১ কাপ ভাত (কম), ১ বাটি ডাল, ১ বাটি সবজি, ১০০গ্রাম মাছ' : '1 cup rice (less), 1 bowl dal, 1 bowl vegetables, 100g fish',
        calories: 520, protein: 30, carbs: 60, fats: 15
      },
      snack2: {
        name: isBn ? 'দই/লসি' : 'Yogurt/Lassi',
        items: isBn ? '১ গ্লাস লসি বা ১ বাটি দই' : '1 glass lassi or 1 bowl yogurt',
        calories: 120, protein: 6, carbs: 18, fats: 3
      },
      dinner: {
        name: isBn ? 'সুপ + রুটি + সালাদ' : 'Soup + Roti + Salad',
        items: isBn ? '১ বাটি চিকেন সুপ, ১টা রুটি, ১ বাটি সালাদ' : '1 bowl chicken soup, 1 roti, 1 bowl salad',
        calories: 380, protein: 25, carbs: 35, fats: 15
      },
      totals: { calories: 1670, protein: 89, carbs: 183, fats: 65 }
    },
    Cardio: {
      name: isBn ? 'কার্ডিও ডে' : 'Cardio Day',
      breakfast: {
        name: isBn ? 'ওটস + ডিম + ফল' : 'Oats + Eggs + Fruit',
        items: isBn ? '১ বাটি ওটস (দুধে), ২টা ডিম সেদ্ধ, ১টা কলা' : '1 bowl oats (in milk), 2 boiled eggs, 1 banana',
        calories: 500, protein: 26, carbs: 60, fats: 16
      },
      snack1: {
        name: isBn ? 'নারিকল পানি + বাদাম' : 'Coconut Water + Nuts',
        items: isBn ? '১ গ্লাস নারিকল পানি, ১ মুঠো বাদাম' : '1 glass coconut water, 1 handful nuts',
        calories: 180, protein: 6, carbs: 15, fats: 12
      },
      lunch: {
        name: isBn ? 'ভাত + মাছ + ডাল + সবজি' : 'Rice + Fish + Dal + Vegetables',
        items: isBn ? '১ কাপ ভাত, ১৫০গ্রাম মাছ, ১ বাটি ডাল, ১ বাটি সবজি' : '1 cup rice, 150g fish, 1 bowl dal, 1 bowl vegetables',
        calories: 580, protein: 38, carbs: 65, fats: 16
      },
      snack2: {
        name: isBn ? 'ফল + চা' : 'Fruits + Tea',
        items: isBn ? '১টা আপেল/পেঁপে, ১ কাপ চা (চিনি ছাড়া)' : '1 apple/papaya, 1 cup tea (no sugar)',
        calories: 120, protein: 2, carbs: 25, fats: 2
      },
      dinner: {
        name: isBn ? 'সুপ + সালাদ + রুটি' : 'Soup + Salad + Roti',
        items: isBn ? '১ বাটি সুপ, ১টা রুটি, বড় সালাদ' : '1 bowl soup, 1 roti, big salad',
        calories: 350, protein: 22, carbs: 35, fats: 12
      },
      totals: { calories: 1730, protein: 94, carbs: 200, fats: 58 }
    },
    Full: {
      name: isBn ? 'ফুল বডি ডে' : 'Full Body Day',
      breakfast: {
        name: isBn ? 'পরোটা + ডিম + দুধ' : 'Paratha + Eggs + Milk',
        items: isBn ? '১টা পরোটা, ৩টা ডিম ভাজি, ১ গ্লাস দুধ' : '1 paratha, 3 fried eggs, 1 glass milk',
        calories: 650, protein: 34, carbs: 45, fats: 38
      },
      snack1: {
        name: isBn ? 'কলা + বাদাম + দই' : 'Banana + Nuts + Yogurt',
        items: isBn ? '২টা কলা, ১ মুঠো বাদাম, ১ বাটি দই' : '2 bananas, 1 handful nuts, 1 bowl yogurt',
        calories: 350, protein: 14, carbs: 50, fats: 16
      },
      lunch: {
        name: isBn ? 'ভাত + মুরগি + ডাল + সবজি' : 'Rice + Chicken + Dal + Vegetables',
        items: isBn ? '১.৫ কাপ ভাত, ২০০গ্রাম মুরগি, ১ বাটি ডাল, ১ বাটি সবজি' : '1.5 cups rice, 200g chicken, 1 bowl dal, 1 bowl vegetables',
        calories: 780, protein: 52, carbs: 85, fats: 22
      },
      snack2: {
        name: isBn ? 'ডিম + চা' : 'Eggs + Tea',
        items: isBn ? '২টা ডিম সেদ্ধ, ১ কাপ চা' : '2 boiled eggs, 1 cup tea',
        calories: 180, protein: 14, carbs: 5, fats: 12
      },
      dinner: {
        name: isBn ? 'রুটি + মাছ + সালাদ' : 'Roti + Fish + Salad',
        items: isBn ? '২টা রুটি, ১৫০গ্রাম মাছ, বড় সালাদ' : '2 roti, 150g fish, big salad',
        calories: 500, protein: 35, carbs: 45, fats: 18
      },
      totals: { calories: 2460, protein: 149, carbs: 230, fats: 106 }
    }
  };

  return meals[workoutType] || meals.Push;
};

const getDietTips = (goal, workoutType, lang) => {
  const isBn = lang !== 'en';

  const tips = {
    bulking: isBn ? [
      'প্রতিদিন ৫০০ ক্যালোরি বেশি খাও',
      'প্রোটিন বেশি নাও (মাছ, মুরগি, ডিম, দুধ)',
      'ভাতের পরিমাণ বাড়িয়ে দাও',
      'ঘুমানোর আগে দুধ + কলা খাও',
      'দিনে ৩-৪ লিটার পানি খাও'
    ] : [
      'Eat 500 more calories daily',
      'Eat more protein (fish, chicken, eggs, milk)',
      'Increase rice portion',
      'Drink milk + banana before sleep',
      'Drink 3-4 liters of water daily'
    ],
    cutting: isBn ? [
      'ভাতের পরিমাণ কমাও (১ কাপ)',
      'তেল কম ব্যবহার করো',
      'চিনি/মিষ্টি এড়িয়ে চলো',
      'সবজি বেশি খাও',
      'রাতে ভাতের বদলে রুটি খাও'
    ] : [
      'Reduce rice portion (1 cup)',
      'Use less oil',
      'Avoid sugar/sweets',
      'Eat more vegetables',
      'Eat roti instead of rice at night'
    ],
    maintenance: isBn ? [
      'সুষম খাবার খাও',
      'প্রতিদিন ৩ লিটার পানি',
      'নিয়মিত ব্যায়াম করো',
      'পর্যাপ্ত ঘুমাও (৭-৮ ঘণ্টা)',
      'প্রক্রিয়াজাত খাবার এড়িয়ে চলো'
    ] : [
      'Eat balanced meals',
      'Drink 3 liters water daily',
      'Exercise regularly',
      'Sleep enough (7-8 hours)',
      'Avoid processed foods'
    ]
  };

  return tips[goal] || tips.maintenance;
};

module.exports = { getBangladeshiDietPlan, getDietTips };