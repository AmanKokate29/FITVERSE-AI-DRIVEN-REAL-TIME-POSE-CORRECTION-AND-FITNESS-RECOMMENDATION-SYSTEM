// Meal Plans and Recipes Database
export const mealPlans = [
  {
    id: 1,
    title: "Muscle Building Meal Plan",
    goal: "Build Muscle",
    calories: 2800,
    macros: { protein: 210, carbs: 350, fats: 80 },
    description: "High-protein, high-calorie Indian meal plan designed to support muscle growth and recovery.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
    meals: [
      {
        type: "Breakfast",
        name: "Paneer Paratha with Curd",
        calories: 550,
        protein: 35,
        carbs: 70,
        fats: 15,
        ingredients: [
          "2 whole wheat parathas",
          "100g paneer (cottage cheese)",
          "1 cup curd (dahi)",
          "1 banana",
          "1 tbsp ghee"
        ],
        instructions: "Cook parathas stuffed with paneer, serve with curd and banana on the side."
      },
      {
        type: "Snack",
        name: "Protein Lassi & Almonds",
        calories: 300,
        protein: 25,
        carbs: 35,
        fats: 5,
        ingredients: [
          "1 cup curd",
          "1 scoop whey protein",
          "10 almonds",
          "1 tsp honey"
        ],
        instructions: "Blend curd with protein powder and honey. Serve with almonds."
      },
      {
        type: "Lunch",
        name: "Chicken Tikka with Brown Rice & Dal",
        calories: 700,
        protein: 60,
        carbs: 85,
        fats: 15,
        ingredients: [
          "200g chicken breast (tikka)",
          "1.5 cups brown rice",
          "1 cup moong dal",
          "Mixed vegetables (sabzi)",
          "1 tbsp olive oil"
        ],
        instructions: "Grill chicken tikka, cook rice and dal. Serve with sautéed vegetables."
      },
      {
        type: "Snack",
        name: "Protein Shake with Dates",
        calories: 400,
        protein: 40,
        carbs: 45,
        fats: 8,
        ingredients: [
          "2 scoops whey protein",
          "4-5 dates",
          "2 cups milk",
          "1 tbsp peanut butter"
        ],
        instructions: "Blend all ingredients until smooth."
      },
      {
        type: "Dinner",
        name: "Fish Curry with Roti & Vegetables",
        calories: 650,
        protein: 45,
        carbs: 70,
        fats: 20,
        ingredients: [
          "200g fish (surmai/rawas)",
          "2 whole wheat rotis",
          "Mixed vegetable curry",
          "1 tbsp coconut oil",
          "Spices (turmeric, cumin)"
        ],
        instructions: "Prepare fish curry with spices. Serve with rotis and vegetable sabzi."
      },
      {
        type: "Evening Snack",
        name: "Paneer Cubes & Sprouts",
        calories: 200,
        protein: 15,
        carbs: 10,
        fats: 12,
        ingredients: [
          "100g paneer cubes",
          "1/2 cup moong sprouts",
          "Chat masala"
        ],
        instructions: "Season paneer and sprouts with chat masala."
      }
    ],
    shoppingList: [
      "Chicken breast (1.4kg)",
      "Fish fillets (1kg)",
      "Paneer (750g)",
      "Eggs (2 dozen)",
      "Curd/Dahi (2kg)",
      "Milk (4L)",
      "Whole wheat flour (2kg)",
      "Brown rice (2kg)",
      "Moong dal (1kg)",
      "Moong sprouts",
      "Mixed vegetables",
      "Bananas",
      "Dates",
      "Almonds (250g)",
      "Whey protein (1 tub)",
      "Peanut butter",
      "Ghee",
      "Coconut oil",
      "Indian spices",
      "Honey"
    ]
  },
  {
    id: 2,
    title: "Fat Loss Meal Plan",
    goal: "Lose Weight",
    calories: 1800,
    macros: { protein: 140, carbs: 150, fats: 60 },
    description: "Calorie-controlled, high-protein Indian meal plan to promote fat loss while preserving muscle mass.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    meals: [
      {
        type: "Breakfast",
        name: "Moong Dal Cheela with Vegetables",
        calories: 350,
        protein: 30,
        carbs: 30,
        fats: 10,
        ingredients: [
          "1 cup moong dal batter",
          "Onions, tomatoes, capsicum",
          "1 tsp oil",
          "Green chutney"
        ],
        instructions: "Make cheela (savory pancake) with dal batter and vegetables. Serve with chutney."
      },
      {
        type: "Snack",
        name: "Buttermilk & Roasted Chana",
        calories: 180,
        protein: 5,
        carbs: 25,
        fats: 8,
        ingredients: [
          "1 glass buttermilk (chaas)",
          "30g roasted chana",
          "Cumin powder"
        ],
        instructions: "Season buttermilk with cumin. Enjoy with roasted chana."
      },
      {
        type: "Lunch",
        name: "Grilled Chicken Salad with Quinoa",
        calories: 450,
        protein: 45,
        carbs: 30,
        fats: 15,
        ingredients: [
          "150g grilled chicken",
          "Mixed greens, cucumber, tomato",
          "1/2 cup quinoa",
          "Lemon-mint dressing",
          "2 tbsp curd"
        ],
        instructions: "Grill chicken with Indian spices. Toss with vegetables and quinoa. Add curd dressing."
      },
      {
        type: "Snack",
        name: "Protein Smoothie",
        calories: 200,
        protein: 25,
        carbs: 15,
        fats: 5,
        ingredients: [
          "1 scoop whey protein",
          "1 cup unsweetened almond milk",
          "1/2 banana",
          "Ice"
        ],
        instructions: "Blend until smooth."
      },
      {
        type: "Dinner",
        name: "Tandoori Fish & Steamed Vegetables",
        calories: 400,
        protein: 35,
        carbs: 35,
        fats: 12,
        ingredients: [
          "200g fish (basa/pomfret)",
          "2 cups steamed vegetables",
          "1/2 cup brown rice",
          "Tandoori masala",
          "Lemon wedges"
        ],
        instructions: "Marinate fish in tandoori masala and grill. Serve with steamed vegetables and brown rice."
      },
      {
        type: "Evening Snack",
        name: "Low-Fat Curd with Cinnamon",
        calories: 120,
        protein: 15,
        carbs: 10,
        fats: 3,
        ingredients: [
          "150g low-fat curd",
          "Cinnamon powder",
          "Stevia (optional)"
        ],
        instructions: "Top curd with cinnamon and sweetener if desired."
      }
    ],
    shoppingList: [
      "Chicken breast (1kg)",
      "Fish fillets (1kg)",
      "Low-fat curd (1kg)",
      "Almond milk (2L)",
      "Moong dal (500g)",
      "Quinoa (500g)",
      "Brown rice (1kg)",
      "Mixed greens",
      "Onions, tomatoes, capsicum",
      "Cucumbers",
      "Mixed vegetables",
      "Bananas",
      "Lemons",
      "Roasted chana (200g)",
      "Whey protein",
      "Tandoori masala",
      "Indian spices",
      "Green chutney",
      "Cumin powder"
    ]
  },
  {
    id: 3,
    title: "Balanced Nutrition Plan",
    goal: "Maintain",
    calories: 2200,
    macros: { protein: 150, carbs: 250, fats: 70 },
    description: "Well-balanced Indian meal plan for maintaining weight and overall health.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
    meals: [
      {
        type: "Breakfast",
        name: "Poha with Peanuts & Tea",
        calories: 450,
        protein: 20,
        carbs: 45,
        fats: 20,
        ingredients: [
          "1.5 cups poha (flattened rice)",
          "2 tbsp peanuts",
          "1 boiled egg",
          "Curry leaves, mustard seeds",
          "1 cup tea with milk"
        ],
        instructions: "Cook poha with peanuts and spices. Serve with boiled egg and tea."
      },
      {
        type: "Snack",
        name: "Mixed Nuts & Seasonal Fruit",
        calories: 250,
        protein: 8,
        carbs: 30,
        fats: 12,
        ingredients: [
          "30g mixed nuts (almonds, walnuts, cashews)",
          "1 apple or seasonal fruit"
        ],
        instructions: "Enjoy nuts with fruit."
      },
      {
        type: "Lunch",
        name: "Rajma Chawal with Salad",
        calories: 500,
        protein: 35,
        carbs: 55,
        fats: 15,
        ingredients: [
          "1 cup rajma (kidney beans)",
          "1 cup basmati rice",
          "Mixed vegetable salad",
          "1 small chapati",
          "1 tbsp ghee"
        ],
        instructions: "Prepare rajma curry. Serve with rice, chapati, and fresh salad."
      },
      {
        type: "Snack",
        name: "Peanut Chikki & Buttermilk",
        calories: 200,
        protein: 8,
        carbs: 28,
        fats: 8,
        ingredients: [
          "2 pieces peanut chikki",
          "1 glass buttermilk"
        ],
        instructions: "Enjoy chikki with refreshing buttermilk."
      },
      {
        type: "Dinner",
        name: "Egg Bhurji with Roti & Vegetables",
        calories: 600,
        protein: 50,
        carbs: 65,
        fats: 18,
        ingredients: [
          "4 eggs",
          "Onions, tomatoes, green chilies",
          "2 whole wheat rotis",
          "Mixed vegetable sabzi",
          "1 tbsp oil"
        ],
        instructions: "Prepare egg bhurji with spices. Serve with rotis and vegetable curry."
      },
      {
        type: "Evening Snack",
        name: "Fruit Raita",
        calories: 200,
        protein: 15,
        carbs: 25,
        fats: 5,
        ingredients: [
          "150g low-fat curd",
          "Pomegranate, grapes, apple",
          "Black salt, roasted cumin"
        ],
        instructions: "Mix fruits with curd and season with spices."
      }
    ],
    shoppingList: [
      "Eggs (2 dozen)",
      "Curd (1.5kg)",
      "Milk (2L)",
      "Rajma (500g)",
      "Poha (500g)",
      "Basmati rice (1kg)",
      "Whole wheat flour (2kg)",
      "Mixed vegetables",
      "Onions, tomatoes",
      "Green chilies",
      "Curry leaves",
      "Seasonal fruits (apples, pomegranate, grapes)",
      "Mixed nuts (250g)",
      "Peanuts (200g)",
      "Peanut chikki",
      "Ghee",
      "Mustard seeds",
      "Cumin seeds",
      "Indian spices",
      "Tea leaves"
    ]
  },
  {
    id: 4,
    title: "Vegetarian Meal Plan",
    goal: "Build Muscle",
    calories: 2600,
    macros: { protein: 150, carbs: 320, fats: 75 },
    description: "Plant-based high-protein Indian meal plan for muscle building without meat.",
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600",
    meals: [
      {
        type: "Breakfast",
        name: "Paneer Bhurji with Paratha",
        calories: 500,
        protein: 30,
        carbs: 55,
        fats: 18,
        ingredients: [
          "150g paneer",
          "2 whole wheat parathas",
          "Onions, tomatoes, capsicum",
          "1 tbsp ghee",
          "1 banana"
        ],
        instructions: "Scramble paneer with vegetables. Serve with parathas and banana."
      },
      {
        type: "Snack",
        name: "Protein Shake with Badam",
        calories: 350,
        protein: 25,
        carbs: 45,
        fats: 10,
        ingredients: [
          "1 scoop plant protein",
          "1 banana",
          "1 cup soy milk",
          "10 soaked almonds (badam)",
          "1 tbsp peanut butter"
        ],
        instructions: "Blend all ingredients until smooth."
      },
      {
        type: "Lunch",
        name: "Dal Khichdi with Curd & Papad",
        calories: 600,
        protein: 30,
        carbs: 80,
        fats: 18,
        ingredients: [
          "1 cup mixed dal (moong, masoor)",
          "1 cup rice",
          "1 cup curd",
          "2 papads",
          "Ghee, vegetables",
          "Pickle"
        ],
        instructions: "Cook khichdi with dal and rice. Serve with curd, roasted papad, and pickle."
      },
      {
        type: "Snack",
        name: "Hummus with Cucumber & Carrot",
        calories: 250,
        protein: 10,
        carbs: 30,
        fats: 10,
        ingredients: [
          "1/2 cup hummus (chickpea dip)",
          "Carrot sticks, cucumber slices",
          "2 whole wheat crackers"
        ],
        instructions: "Dip vegetables in hummus. Enjoy with crackers."
      },
      {
        type: "Dinner",
        name: "Chole (Chickpea Curry) with Roti",
        calories: 650,
        protein: 35,
        carbs: 85,
        fats: 15,
        ingredients: [
          "1.5 cups chole (chickpeas)",
          "2 whole wheat rotis",
          "Onion-tomato gravy",
          "Spinach curry",
          "1 tbsp oil"
        ],
        instructions: "Prepare chole masala. Serve with rotis and palak sabzi."
      },
      {
        type: "Evening Snack",
        name: "Dates & Almond Milk",
        calories: 250,
        protein: 10,
        carbs: 35,
        fats: 10,
        ingredients: [
          "5-6 dates",
          "1 cup almond milk",
          "1 tbsp almond butter"
        ],
        instructions: "Enjoy dates with almond milk and butter."
      }
    ],
    shoppingList: [
      "Paneer (1kg)",
      "Curd (2kg)",
      "Soy milk (2L)",
      "Almond milk (1L)",
      "Plant protein powder",
      "Mixed dal (1kg)",
      "Chickpeas (1kg)",
      "Basmati rice (1kg)",
      "Whole wheat flour (2kg)",
      "Poha",
      "Mixed vegetables",
      "Onions, tomatoes, capsicum",
      "Spinach",
      "Carrots, cucumbers",
      "Bananas",
      "Dates",
      "Almonds (250g)",
      "Peanut butter",
      "Almond butter",
      "Hummus",
      "Papads",
      "Pickle",
      "Ghee",
      "Indian spices"
    ]
  }
]

export const mealGoals = ["All", "Build Muscle", "Lose Weight", "Maintain"]
export const dietTypes = ["All", "Standard", "Vegetarian", "High Protein", "Low Carb"]
