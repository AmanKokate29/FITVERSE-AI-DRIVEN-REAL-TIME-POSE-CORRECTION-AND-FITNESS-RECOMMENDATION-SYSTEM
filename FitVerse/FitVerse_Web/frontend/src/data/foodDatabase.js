// Common foods database with nutritional information per 100g
// Macros: protein, carbs, fats, fiber
// Micros: vitaminA (mcg), vitaminC (mg), vitaminD (mcg), calcium (mg), iron (mg), potassium (mg), sodium (mg)
export const foodDatabase = [
  // Proteins
  { id: 1, name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, vitaminA: 21, vitaminC: 0, vitaminD: 0.1, calcium: 15, iron: 1, potassium: 256, sodium: 74, category: "Protein" },
  { id: 2, name: "Salmon", calories: 208, protein: 20, carbs: 0, fats: 13, fiber: 0, vitaminA: 40, vitaminC: 0, vitaminD: 11, calcium: 9, iron: 0.3, potassium: 363, sodium: 59, category: "Protein" },
  { id: 3, name: "Tuna", calories: 130, protein: 28, carbs: 0, fats: 1, fiber: 0, vitaminA: 16, vitaminC: 0, vitaminD: 3.8, calcium: 10, iron: 1, potassium: 252, sodium: 50, category: "Protein" },
  { id: 4, name: "Eggs (1 large)", calories: 72, protein: 6, carbs: 0.4, fats: 5, fiber: 0, vitaminA: 80, vitaminC: 0, vitaminD: 1.1, calcium: 28, iron: 0.9, potassium: 69, sodium: 71, category: "Protein" },
  { id: 5, name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fats: 0.4, fiber: 0, vitaminA: 7, vitaminC: 0.5, vitaminD: 0.1, calcium: 110, iron: 0.04, potassium: 141, sodium: 36, category: "Protein" },
  { id: 6, name: "Beef Steak", calories: 271, protein: 25, carbs: 0, fats: 19, fiber: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 18, iron: 2.6, potassium: 318, sodium: 72, category: "Protein" },
  { id: 7, name: "Tofu", calories: 76, protein: 8, carbs: 1.9, fats: 4.8, fiber: 0.3, vitaminA: 5, vitaminC: 0.1, vitaminD: 0, calcium: 350, iron: 5.4, potassium: 121, sodium: 7, category: "Protein" },
  
  // Carbs
  { id: 8, name: "White Rice (cooked)", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 10, iron: 0.2, potassium: 35, sodium: 1, category: "Carbs" },
  { id: 9, name: "Brown Rice (cooked)", calories: 112, protein: 2.6, carbs: 24, fats: 0.9, fiber: 1.8, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 10, iron: 0.4, potassium: 43, sodium: 5, category: "Carbs" },
  { id: 10, name: "Oatmeal", calories: 68, protein: 2.4, carbs: 12, fats: 1.4, fiber: 1.7, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 9, iron: 0.7, potassium: 61, sodium: 49, category: "Carbs" },
  { id: 11, name: "Whole Wheat Bread (1 slice)", calories: 69, protein: 3, carbs: 12, fats: 1, fiber: 2, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 25, iron: 0.9, potassium: 81, sodium: 147, category: "Carbs" },
  { id: 12, name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3, vitaminA: 709, vitaminC: 2.4, vitaminD: 0, calcium: 30, iron: 0.6, potassium: 337, sodium: 55, category: "Carbs" },
  { id: 13, name: "Pasta (cooked)", calories: 131, protein: 5, carbs: 25, fats: 1.1, fiber: 1.8, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 7, iron: 0.5, potassium: 44, sodium: 1, category: "Carbs" },
  { id: 14, name: "Quinoa (cooked)", calories: 120, protein: 4.4, carbs: 21, fats: 1.9, fiber: 2.8, vitaminA: 1, vitaminC: 0, vitaminD: 0, calcium: 17, iron: 1.5, potassium: 172, sodium: 7, category: "Carbs" },
  
  // Fruits
  { id: 15, name: "Banana", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, fiber: 2.6, vitaminA: 3, vitaminC: 8.7, vitaminD: 0, calcium: 5, iron: 0.3, potassium: 358, sodium: 1, category: "Fruits" },
  { id: 16, name: "Apple", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4, vitaminA: 3, vitaminC: 4.6, vitaminD: 0, calcium: 6, iron: 0.1, potassium: 107, sodium: 1, category: "Fruits" },
  { id: 17, name: "Orange", calories: 47, protein: 0.9, carbs: 12, fats: 0.1, fiber: 2.4, vitaminA: 11, vitaminC: 53, vitaminD: 0, calcium: 40, iron: 0.1, potassium: 181, sodium: 0, category: "Fruits" },
  { id: 18, name: "Strawberries", calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3, fiber: 2, vitaminA: 1, vitaminC: 58.8, vitaminD: 0, calcium: 16, iron: 0.4, potassium: 153, sodium: 1, category: "Fruits" },
  { id: 19, name: "Blueberries", calories: 57, protein: 0.7, carbs: 14, fats: 0.3, fiber: 2.4, vitaminA: 3, vitaminC: 9.7, vitaminD: 0, calcium: 6, iron: 0.3, potassium: 77, sodium: 1, category: "Fruits" },
  { id: 20, name: "Avocado", calories: 160, protein: 2, carbs: 9, fats: 15, fiber: 7, vitaminA: 7, vitaminC: 10, vitaminD: 0, calcium: 12, iron: 0.6, potassium: 485, sodium: 7, category: "Fruits" },
  
  // Vegetables
  { id: 21, name: "Broccoli", calories: 34, protein: 2.8, carbs: 7, fats: 0.4, fiber: 2.6, vitaminA: 31, vitaminC: 89.2, vitaminD: 0, calcium: 47, iron: 0.7, potassium: 316, sodium: 33, category: "Vegetables" },
  { id: 22, name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2, vitaminA: 469, vitaminC: 28.1, vitaminD: 0, calcium: 99, iron: 2.7, potassium: 558, sodium: 79, category: "Vegetables" },
  { id: 23, name: "Carrots", calories: 41, protein: 0.9, carbs: 10, fats: 0.2, fiber: 2.8, vitaminA: 835, vitaminC: 5.9, vitaminD: 0, calcium: 33, iron: 0.3, potassium: 320, sodium: 69, category: "Vegetables" },
  { id: 24, name: "Tomato", calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, fiber: 1.2, vitaminA: 42, vitaminC: 13.7, vitaminD: 0, calcium: 10, iron: 0.3, potassium: 237, sodium: 5, category: "Vegetables" },
  { id: 25, name: "Cucumber", calories: 16, protein: 0.7, carbs: 3.6, fats: 0.1, fiber: 0.5, vitaminA: 5, vitaminC: 2.8, vitaminD: 0, calcium: 16, iron: 0.3, potassium: 147, sodium: 2, category: "Vegetables" },
  
  // Nuts & Seeds
  { id: 26, name: "Almonds", calories: 579, protein: 21, carbs: 22, fats: 50, fiber: 12.5, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 269, iron: 3.7, potassium: 733, sodium: 1, category: "Nuts" },
  { id: 27, name: "Peanut Butter (2 tbsp)", calories: 188, protein: 8, carbs: 7, fats: 16, fiber: 2, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 17, iron: 0.6, potassium: 214, sodium: 152, category: "Nuts" },
  { id: 28, name: "Walnuts", calories: 654, protein: 15, carbs: 14, fats: 65, fiber: 6.7, vitaminA: 1, vitaminC: 1.3, vitaminD: 0, calcium: 98, iron: 2.9, potassium: 441, sodium: 2, category: "Nuts" },
  { id: 29, name: "Chia Seeds", calories: 486, protein: 17, carbs: 42, fats: 31, fiber: 34, vitaminA: 5, vitaminC: 1.6, vitaminD: 0, calcium: 631, iron: 7.7, potassium: 407, sodium: 16, category: "Seeds" },
  
  // Dairy
  { id: 30, name: "Whole Milk (1 cup)", calories: 149, protein: 8, carbs: 12, fats: 8, fiber: 0, vitaminA: 46, vitaminC: 0, vitaminD: 1.3, calcium: 276, iron: 0.1, potassium: 322, sodium: 105, category: "Dairy" },
  { id: 31, name: "Cheddar Cheese", calories: 403, protein: 25, carbs: 1.3, fats: 33, fiber: 0, vitaminA: 265, vitaminC: 0, vitaminD: 0.6, calcium: 721, iron: 0.7, potassium: 98, sodium: 621, category: "Dairy" },
  { id: 32, name: "Cottage Cheese", calories: 98, protein: 11, carbs: 3.4, fats: 4.3, fiber: 0, vitaminA: 37, vitaminC: 0, vitaminD: 0, calcium: 83, iron: 0.1, potassium: 104, sodium: 364, category: "Dairy" },
  
  // Common Meals
  { id: 33, name: "Pizza (1 slice)", calories: 285, protein: 12, carbs: 36, fats: 10, fiber: 2, vitaminA: 35, vitaminC: 2, vitaminD: 0.2, calcium: 144, iron: 1.6, potassium: 184, sodium: 640, category: "Meals" },
  { id: 34, name: "Burger (regular)", calories: 295, protein: 17, carbs: 34, fats: 10.4, fiber: 1.5, vitaminA: 8, vitaminC: 1, vitaminD: 0.3, calcium: 96, iron: 2.7, potassium: 324, sodium: 497, category: "Meals" },
  { id: 35, name: "Protein Shake", calories: 120, protein: 24, carbs: 3, fats: 1, fiber: 1, vitaminA: 150, vitaminC: 15, vitaminD: 2.5, calcium: 300, iron: 1.8, potassium: 180, sodium: 150, category: "Supplements" },

  // Indian Foods - Rice & Biryani
  { id: 36, name: "Chicken Biryani", calories: 165, protein: 7.5, carbs: 22, fats: 5.5, fiber: 1.2, vitaminA: 45, vitaminC: 3.5, vitaminD: 0.2, calcium: 35, iron: 1.8, potassium: 215, sodium: 380, category: "Indian Rice" },
  { id: 37, name: "Veg Biryani", calories: 145, protein: 3.8, carbs: 25, fats: 4.2, fiber: 2.5, vitaminA: 85, vitaminC: 8.5, vitaminD: 0, calcium: 42, iron: 1.5, potassium: 185, sodium: 320, category: "Indian Rice" },
  { id: 38, name: "Mutton Biryani", calories: 190, protein: 8.5, carbs: 20, fats: 8.5, fiber: 1, vitaminA: 38, vitaminC: 2.8, vitaminD: 0.3, calcium: 32, iron: 2.5, potassium: 235, sodium: 420, category: "Indian Rice" },
  { id: 39, name: "Jeera Rice", calories: 142, protein: 2.8, carbs: 28, fats: 2.5, fiber: 0.8, vitaminA: 12, vitaminC: 1.2, vitaminD: 0, calcium: 18, iron: 0.6, potassium: 95, sodium: 245, category: "Indian Rice" },
  { id: 40, name: "Veg Pulao", calories: 138, protein: 3.2, carbs: 24, fats: 3.5, fiber: 2.2, vitaminA: 65, vitaminC: 6.5, vitaminD: 0, calcium: 35, iron: 1.2, potassium: 165, sodium: 285, category: "Indian Rice" },
  { id: 41, name: "Lemon Rice", calories: 135, protein: 2.5, carbs: 26, fats: 3, fiber: 1, vitaminA: 8, vitaminC: 12, vitaminD: 0, calcium: 22, iron: 0.5, potassium: 125, sodium: 310, category: "Indian Rice" },
  
  // Indian Breads
  { id: 42, name: "Roti (Chapati)", calories: 104, protein: 3.1, carbs: 18, fats: 2.4, fiber: 2.5, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 15, iron: 1.2, potassium: 95, sodium: 155, category: "Indian Bread" },
  { id: 43, name: "Naan", calories: 262, protein: 7.6, carbs: 45, fats: 5.2, fiber: 2, vitaminA: 5, vitaminC: 0, vitaminD: 0.1, calcium: 85, iron: 2.5, potassium: 145, sodium: 485, category: "Indian Bread" },
  { id: 44, name: "Butter Naan", calories: 310, protein: 7.8, carbs: 46, fats: 10.5, fiber: 1.8, vitaminA: 95, vitaminC: 0, vitaminD: 0.3, calcium: 92, iron: 2.6, potassium: 152, sodium: 525, category: "Indian Bread" },
  { id: 45, name: "Paratha (Plain)", calories: 259, protein: 5.6, carbs: 36, fats: 10.2, fiber: 3.2, vitaminA: 15, vitaminC: 0, vitaminD: 0.1, calcium: 28, iron: 1.8, potassium: 118, sodium: 365, category: "Indian Bread" },
  { id: 46, name: "Aloo Paratha", calories: 280, protein: 6.2, carbs: 38, fats: 11.5, fiber: 3.8, vitaminA: 25, vitaminC: 8.5, vitaminD: 0.1, calcium: 35, iron: 2.1, potassium: 285, sodium: 385, category: "Indian Bread" },
  { id: 47, name: "Puri", calories: 360, protein: 6.8, carbs: 42, fats: 18, fiber: 2.5, vitaminA: 8, vitaminC: 0, vitaminD: 0, calcium: 22, iron: 2.2, potassium: 105, sodium: 425, category: "Indian Bread" },
  { id: 48, name: "Bhatura", calories: 385, protein: 7.2, carbs: 48, fats: 18.5, fiber: 2, vitaminA: 12, vitaminC: 0, vitaminD: 0.1, calcium: 45, iron: 2.4, potassium: 125, sodium: 565, category: "Indian Bread" },
  
  // Dal & Lentils
  { id: 49, name: "Dal Tadka", calories: 108, protein: 6.5, carbs: 17, fats: 2.2, fiber: 4.5, vitaminA: 45, vitaminC: 3.2, vitaminD: 0, calcium: 42, iron: 2.8, potassium: 285, sodium: 325, category: "Indian Dal" },
  { id: 50, name: "Dal Makhani", calories: 142, protein: 7.2, carbs: 18, fats: 5.5, fiber: 4.8, vitaminA: 65, vitaminC: 2.5, vitaminD: 0.2, calcium: 95, iron: 3.2, potassium: 315, sodium: 385, category: "Indian Dal" },
  { id: 51, name: "Sambar", calories: 95, protein: 4.5, carbs: 16, fats: 2, fiber: 4.2, vitaminA: 125, vitaminC: 12, vitaminD: 0, calcium: 55, iron: 2.5, potassium: 345, sodium: 365, category: "Indian Dal" },
  { id: 52, name: "Rajma (Kidney Beans)", calories: 135, protein: 8.5, carbs: 22, fats: 1.5, fiber: 6.5, vitaminA: 8, vitaminC: 4.5, vitaminD: 0, calcium: 48, iron: 3.5, potassium: 425, sodium: 295, category: "Indian Dal" },
  { id: 53, name: "Chana Masala", calories: 152, protein: 8.2, carbs: 24, fats: 3.8, fiber: 6.8, vitaminA: 35, vitaminC: 6.5, vitaminD: 0, calcium: 62, iron: 3.8, potassium: 385, sodium: 425, category: "Indian Dal" },
  
  // Curries - Vegetarian
  { id: 54, name: "Palak Paneer", calories: 168, protein: 9.5, carbs: 8.5, fats: 12, fiber: 2.8, vitaminA: 485, vitaminC: 22, vitaminD: 0.1, calcium: 285, iron: 3.5, potassium: 425, sodium: 365, category: "Indian Curry" },
  { id: 55, name: "Paneer Butter Masala", calories: 195, protein: 10.5, carbs: 9.5, fats: 14, fiber: 1.8, vitaminA: 125, vitaminC: 8.5, vitaminD: 0.2, calcium: 325, iron: 1.5, potassium: 285, sodium: 425, category: "Indian Curry" },
  { id: 56, name: "Paneer Tikka Masala", calories: 185, protein: 11, carbs: 8.8, fats: 12.5, fiber: 2, vitaminA: 95, vitaminC: 12, vitaminD: 0.2, calcium: 315, iron: 1.8, potassium: 295, sodium: 445, category: "Indian Curry" },
  { id: 57, name: "Malai Kofta", calories: 215, protein: 7.5, carbs: 15, fats: 15, fiber: 2.5, vitaminA: 145, vitaminC: 6.5, vitaminD: 0.3, calcium: 185, iron: 2.2, potassium: 325, sodium: 385, category: "Indian Curry" },
  { id: 58, name: "Aloo Gobi", calories: 92, protein: 2.8, carbs: 14, fats: 3.5, fiber: 3.5, vitaminA: 15, vitaminC: 42, vitaminD: 0, calcium: 35, iron: 1.2, potassium: 425, sodium: 285, category: "Indian Curry" },
  { id: 59, name: "Baingan Bharta", calories: 88, protein: 2.2, carbs: 12, fats: 4.2, fiber: 4.5, vitaminA: 85, vitaminC: 8.5, vitaminD: 0, calcium: 42, iron: 1.5, potassium: 385, sodium: 315, category: "Indian Curry" },
  { id: 60, name: "Bhindi Masala", calories: 95, protein: 3.2, carbs: 11, fats: 5, fiber: 3.8, vitaminA: 95, vitaminC: 18, vitaminD: 0, calcium: 85, iron: 1.8, potassium: 325, sodium: 295, category: "Indian Curry" },
  
  // Curries - Non-Vegetarian
  { id: 61, name: "Butter Chicken", calories: 175, protein: 12.5, carbs: 6.5, fats: 11.5, fiber: 1.2, vitaminA: 125, vitaminC: 5.5, vitaminD: 0.3, calcium: 85, iron: 2.2, potassium: 285, sodium: 465, category: "Indian Curry" },
  { id: 62, name: "Chicken Tikka Masala", calories: 165, protein: 13.5, carbs: 7.2, fats: 10.5, fiber: 1.5, vitaminA: 95, vitaminC: 8.5, vitaminD: 0.2, calcium: 75, iron: 2.5, potassium: 315, sodium: 485, category: "Indian Curry" },
  { id: 63, name: "Chicken Curry", calories: 145, protein: 14.5, carbs: 5.8, fats: 8.5, fiber: 1.8, vitaminA: 85, vitaminC: 6.5, vitaminD: 0.2, calcium: 55, iron: 2.8, potassium: 295, sodium: 425, category: "Indian Curry" },
  { id: 64, name: "Chicken Korma", calories: 185, protein: 12.8, carbs: 8.5, fats: 12, fiber: 1.5, vitaminA: 105, vitaminC: 4.5, vitaminD: 0.3, calcium: 95, iron: 2.2, potassium: 275, sodium: 445, category: "Indian Curry" },
  { id: 65, name: "Mutton Curry", calories: 195, protein: 14.2, carbs: 6.2, fats: 13.5, fiber: 1.5, vitaminA: 45, vitaminC: 4.2, vitaminD: 0.4, calcium: 42, iron: 3.5, potassium: 325, sodium: 465, category: "Indian Curry" },
  { id: 66, name: "Fish Curry", calories: 128, protein: 15.5, carbs: 5.5, fats: 6.2, fiber: 1.2, vitaminA: 65, vitaminC: 6.5, vitaminD: 2.5, calcium: 58, iron: 1.8, potassium: 385, sodium: 425, category: "Indian Curry" },
  { id: 67, name: "Prawn Curry", calories: 135, protein: 17.2, carbs: 6.2, fats: 5.8, fiber: 1, vitaminA: 55, vitaminC: 5.5, vitaminD: 1.8, calcium: 85, iron: 2.2, potassium: 325, sodium: 545, category: "Indian Curry" },
  
  // South Indian
  { id: 68, name: "Idli (Plain)", calories: 58, protein: 2.2, carbs: 11, fats: 0.5, fiber: 0.8, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 12, iron: 0.5, potassium: 45, sodium: 125, category: "Indian South" },
  { id: 69, name: "Dosa (Plain)", calories: 86, protein: 2.8, carbs: 16, fats: 1.5, fiber: 1.2, vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 18, iron: 0.8, potassium: 65, sodium: 185, category: "Indian South" },
  { id: 70, name: "Masala Dosa", calories: 125, protein: 3.5, carbs: 22, fats: 3.2, fiber: 2.5, vitaminA: 25, vitaminC: 8.5, vitaminD: 0, calcium: 28, iron: 1.5, potassium: 285, sodium: 245, category: "Indian South" },
  { id: 71, name: "Vada", calories: 185, protein: 4.5, carbs: 18, fats: 11, fiber: 3.2, vitaminA: 5, vitaminC: 2.5, vitaminD: 0, calcium: 35, iron: 1.8, potassium: 185, sodium: 385, category: "Indian South" },
  { id: 72, name: "Upma", calories: 95, protein: 2.8, carbs: 16, fats: 2.5, fiber: 2.2, vitaminA: 35, vitaminC: 4.5, vitaminD: 0, calcium: 22, iron: 1.2, potassium: 125, sodium: 285, category: "Indian South" },
  { id: 73, name: "Uttapam", calories: 102, protein: 3.2, carbs: 18, fats: 2.2, fiber: 2.5, vitaminA: 45, vitaminC: 8.5, vitaminD: 0, calcium: 32, iron: 1.5, potassium: 185, sodium: 225, category: "Indian South" },
  
  // Snacks & Street Food
  { id: 74, name: "Samosa", calories: 262, protein: 4.5, carbs: 28, fats: 15, fiber: 3.5, vitaminA: 45, vitaminC: 6.5, vitaminD: 0, calcium: 35, iron: 1.8, potassium: 265, sodium: 485, category: "Indian Snacks" },
  { id: 75, name: "Pakora", calories: 225, protein: 5.2, carbs: 22, fats: 13.5, fiber: 3.8, vitaminA: 55, vitaminC: 8.5, vitaminD: 0, calcium: 42, iron: 2.2, potassium: 285, sodium: 425, category: "Indian Snacks" },
  { id: 76, name: "Pani Puri", calories: 145, protein: 3.5, carbs: 25, fats: 4.5, fiber: 2.5, vitaminA: 15, vitaminC: 12, vitaminD: 0, calcium: 28, iron: 1.2, potassium: 185, sodium: 565, category: "Indian Snacks" },
  { id: 77, name: "Bhel Puri", calories: 132, protein: 4.2, carbs: 24, fats: 3.2, fiber: 3.2, vitaminA: 35, vitaminC: 15, vitaminD: 0, calcium: 38, iron: 1.5, potassium: 225, sodium: 485, category: "Indian Snacks" },
  { id: 78, name: "Dhokla", calories: 108, protein: 3.8, carbs: 18, fats: 2.5, fiber: 2.8, vitaminA: 12, vitaminC: 4.5, vitaminD: 0, calcium: 32, iron: 1.2, potassium: 145, sodium: 385, category: "Indian Snacks" },
  { id: 79, name: "Kachori", calories: 285, protein: 5.5, carbs: 32, fats: 15.5, fiber: 4.2, vitaminA: 25, vitaminC: 3.5, vitaminD: 0, calcium: 42, iron: 2.5, potassium: 245, sodium: 525, category: "Indian Snacks" },
  { id: 80, name: "Chole Bhature", calories: 245, protein: 8.5, carbs: 35, fats: 11.5, fiber: 5.5, vitaminA: 45, vitaminC: 6.5, vitaminD: 0.1, calcium: 85, iron: 3.5, potassium: 425, sodium: 645, category: "Indian Snacks" },
  
  // Sweets
  { id: 81, name: "Gulab Jamun", calories: 375, protein: 4.5, carbs: 55, fats: 16, fiber: 0.5, vitaminA: 85, vitaminC: 0, vitaminD: 0.2, calcium: 125, iron: 0.8, potassium: 145, sodium: 85, category: "Indian Sweets" },
  { id: 82, name: "Jalebi", calories: 385, protein: 3.2, carbs: 68, fats: 12.5, fiber: 0.8, vitaminA: 15, vitaminC: 0, vitaminD: 0, calcium: 35, iron: 1.2, potassium: 85, sodium: 125, category: "Indian Sweets" },
  { id: 83, name: "Rasgulla", calories: 186, protein: 4.8, carbs: 35, fats: 3.5, fiber: 0, vitaminA: 45, vitaminC: 0, vitaminD: 0.1, calcium: 165, iron: 0.5, potassium: 95, sodium: 65, category: "Indian Sweets" },
  { id: 84, name: "Ladoo", calories: 425, protein: 6.5, carbs: 58, fats: 19.5, fiber: 2.5, vitaminA: 25, vitaminC: 0, vitaminD: 0, calcium: 85, iron: 2.2, potassium: 285, sodium: 95, category: "Indian Sweets" },
  { id: 85, name: "Kheer", calories: 145, protein: 3.5, carbs: 24, fats: 4.5, fiber: 0.5, vitaminA: 55, vitaminC: 0.5, vitaminD: 0.1, calcium: 95, iron: 0.5, potassium: 165, sodium: 75, category: "Indian Sweets" },
]
