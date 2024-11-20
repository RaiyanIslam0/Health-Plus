// // utils/calorieCalculator.js
// function calculateCaloriesAndMacros({
//   gender,
//   weight,
//   height,
//   age,
//   activityLevel,
//   goalWeight,
//   poundsPerWeek,
// }) {
//   let bmr;
//   if (gender.toLowerCase() === "male") {
//     bmr = 10 * weight + 6.25 * height - 5 * age + 5;
//   } else {
//     bmr = 10 * weight + 6.25 * height - 5 * age - 161;
//   }

//   const activityFactors = {
//     sedentary: 1.2,
//     lightlyactive: 1.375,
//     moderatelyactive: 1.55,
//     veryactive: 1.725,
//     superactive: 1.9,
//   };

//   const tdee = bmr * activityFactors[activityLevel.toLowerCase()];
//   const caloriesPerKg = 7700;
//   const calorieAdjustment = (caloriesPerKg * poundsPerWeek) / 7;
//   const dailyCalories = tdee - calorieAdjustment;

//   const macros = {
//     protein: Math.round((dailyCalories * 0.3) / 4),
//     carbs: Math.round((dailyCalories * 0.4) / 4),
//     fat: Math.round((dailyCalories * 0.3) / 9),
//   };

//   return {
//     dailyCalories: Math.round(dailyCalories),
//     macros,
//   };
// }

// module.exports = { calculateCaloriesAndMacros };
