// Workout Plans Database
export const workoutPlans = [
  {
    id: 1,
    title: "Beginner Full Body Strength",
    goal: "Build Muscle",
    level: "Beginner",
    duration: "4 weeks",
    daysPerWeek: 3,
    description: "Perfect for those new to strength training. Build a solid foundation with compound movements.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
    workouts: [
      {
        day: "Day 1: Full Body A",
        exercises: [
          { name: "Barbell Squats", sets: 3, reps: "10-12" },
          { name: "Barbell Bench Press", sets: 3, reps: "8-10" },
          { name: "Lat Pulldown", sets: 3, reps: "10-12" },
          { name: "Overhead Press", sets: 3, reps: "8-10" },
          { name: "Plank", sets: 3, reps: "30-60 sec" }
        ]
      },
      {
        day: "Day 2: Full Body B",
        exercises: [
          { name: "Romanian Deadlifts", sets: 3, reps: "10-12" },
          { name: "Dumbbell Bench Press", sets: 3, reps: "10-12" },
          { name: "Pull-ups (Assisted)", sets: 3, reps: "8-10" },
          { name: "Lateral Raises", sets: 3, reps: "12-15" },
          { name: "Russian Twists", sets: 3, reps: "20" }
        ]
      },
      {
        day: "Day 3: Full Body C",
        exercises: [
          { name: "Lunges", sets: 3, reps: "10 each leg" },
          { name: "Push-ups", sets: 3, reps: "10-15" },
          { name: "Barbell Rows", sets: 3, reps: "10-12" },
          { name: "Bicep Curls", sets: 3, reps: "12-15" },
          { name: "Mountain Climbers", sets: 3, reps: "20" }
        ]
      }
    ],
    tips: [
      "Rest 2-3 minutes between sets for compound movements",
      "Focus on proper form over weight",
      "Start with lighter weights to master technique",
      "Progress weight by 2.5-5kg when you can complete all reps easily"
    ]
  },
  {
    id: 2,
    title: "Fat Loss HIIT Program",
    goal: "Lose Weight",
    level: "Intermediate",
    duration: "6 weeks",
    daysPerWeek: 4,
    description: "High-intensity interval training combined with strength work to maximize fat burning.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    workouts: [
      {
        day: "Day 1: HIIT Cardio",
        exercises: [
          { name: "Burpees", sets: 4, reps: "30 sec on, 30 sec rest" },
          { name: "Mountain Climbers", sets: 4, reps: "30 sec on, 30 sec rest" },
          { name: "Jump Rope", sets: 4, reps: "45 sec on, 15 sec rest" },
          { name: "High Knees", sets: 4, reps: "30 sec on, 30 sec rest" }
        ]
      },
      {
        day: "Day 2: Upper Body Strength",
        exercises: [
          { name: "Barbell Bench Press", sets: 4, reps: "8-10" },
          { name: "Pull-ups", sets: 4, reps: "6-8" },
          { name: "Overhead Press", sets: 3, reps: "10-12" },
          { name: "Tricep Dips", sets: 3, reps: "10-12" },
          { name: "Bicep Curls", sets: 3, reps: "12-15" }
        ]
      },
      {
        day: "Day 3: HIIT Cardio",
        exercises: [
          { name: "Jump Squats", sets: 5, reps: "20 sec on, 40 sec rest" },
          { name: "Burpees", sets: 5, reps: "20 sec on, 40 sec rest" },
          { name: "Mountain Climbers", sets: 5, reps: "30 sec on, 30 sec rest" },
          { name: "Jumping Jacks", sets: 5, reps: "45 sec on, 15 sec rest" }
        ]
      },
      {
        day: "Day 4: Lower Body Strength",
        exercises: [
          { name: "Barbell Squats", sets: 4, reps: "10-12" },
          { name: "Romanian Deadlifts", sets: 4, reps: "10-12" },
          { name: "Lunges", sets: 3, reps: "12 each leg" },
          { name: "Leg Press", sets: 3, reps: "12-15" },
          { name: "Plank", sets: 3, reps: "45-60 sec" }
        ]
      }
    ],
    tips: [
      "Maintain calorie deficit of 300-500 calories",
      "Keep rest periods short (60-90 seconds)",
      "Stay hydrated during HIIT sessions",
      "Track your progress weekly"
    ]
  },
  {
    id: 3,
    title: "Muscle Building Split",
    goal: "Build Muscle",
    level: "Advanced",
    duration: "8 weeks",
    daysPerWeek: 5,
    description: "Intensive muscle-building program with dedicated muscle group training.",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600",
    workouts: [
      {
        day: "Day 1: Chest & Triceps",
        exercises: [
          { name: "Barbell Bench Press", sets: 4, reps: "6-8" },
          { name: "Incline Dumbbell Press", sets: 4, reps: "8-10" },
          { name: "Dumbbell Flyes", sets: 3, reps: "10-12" },
          { name: "Tricep Dips", sets: 4, reps: "8-10" },
          { name: "Skull Crushers", sets: 3, reps: "10-12" }
        ]
      },
      {
        day: "Day 2: Back & Biceps",
        exercises: [
          { name: "Deadlifts", sets: 4, reps: "6-8" },
          { name: "Pull-ups", sets: 4, reps: "8-10" },
          { name: "Barbell Rows", sets: 4, reps: "8-10" },
          { name: "Barbell Curls", sets: 4, reps: "10-12" },
          { name: "Hammer Curls", sets: 3, reps: "12-15" }
        ]
      },
      {
        day: "Day 3: Legs",
        exercises: [
          { name: "Barbell Squats", sets: 5, reps: "6-8" },
          { name: "Romanian Deadlifts", sets: 4, reps: "8-10" },
          { name: "Leg Press", sets: 4, reps: "10-12" },
          { name: "Leg Curls", sets: 3, reps: "12-15" },
          { name: "Calf Raises", sets: 4, reps: "15-20" }
        ]
      },
      {
        day: "Day 4: Shoulders & Abs",
        exercises: [
          { name: "Overhead Press", sets: 4, reps: "6-8" },
          { name: "Lateral Raises", sets: 4, reps: "12-15" },
          { name: "Face Pulls", sets: 3, reps: "15-20" },
          { name: "Hanging Leg Raises", sets: 4, reps: "12-15" },
          { name: "Russian Twists", sets: 3, reps: "20 each side" }
        ]
      },
      {
        day: "Day 5: Arms & Core",
        exercises: [
          { name: "Close-Grip Bench Press", sets: 4, reps: "8-10" },
          { name: "Preacher Curls", sets: 4, reps: "10-12" },
          { name: "Tricep Rope Pushdown", sets: 4, reps: "12-15" },
          { name: "Concentration Curls", sets: 3, reps: "12-15" },
          { name: "Plank", sets: 3, reps: "60+ sec" }
        ]
      }
    ],
    tips: [
      "Eat in calorie surplus (+300-500 calories)",
      "Get 1.6-2.2g protein per kg bodyweight",
      "Rest 2-3 minutes between heavy sets",
      "Progressive overload is key - increase weight regularly",
      "Get 7-9 hours of sleep for recovery"
    ]
  },
  {
    id: 4,
    title: "Athletic Performance",
    goal: "Endurance",
    level: "Intermediate",
    duration: "6 weeks",
    daysPerWeek: 4,
    description: "Build explosive power, speed, and endurance for athletic performance.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600",
    workouts: [
      {
        day: "Day 1: Power & Plyometrics",
        exercises: [
          { name: "Box Jumps", sets: 4, reps: "8-10" },
          { name: "Power Cleans", sets: 4, reps: "5-6" },
          { name: "Medicine Ball Slams", sets: 4, reps: "10" },
          { name: "Broad Jumps", sets: 4, reps: "6-8" },
          { name: "Kettlebell Swings", sets: 3, reps: "15" }
        ]
      },
      {
        day: "Day 2: Endurance Circuit",
        exercises: [
          { name: "Burpees", sets: 3, reps: "15" },
          { name: "Battle Ropes", sets: 3, reps: "30 sec" },
          { name: "Rowing Machine", sets: 3, reps: "500m" },
          { name: "Jump Rope", sets: 3, reps: "2 minutes" }
        ]
      },
      {
        day: "Day 3: Strength Foundation",
        exercises: [
          { name: "Barbell Squats", sets: 4, reps: "6-8" },
          { name: "Deadlifts", sets: 4, reps: "6-8" },
          { name: "Bench Press", sets: 4, reps: "6-8" },
          { name: "Pull-ups", sets: 4, reps: "Max reps" },
          { name: "Core Circuit", sets: 3, reps: "60 sec each" }
        ]
      },
      {
        day: "Day 4: Speed & Agility",
        exercises: [
          { name: "Sprint Intervals", sets: 6, reps: "100m" },
          { name: "Ladder Drills", sets: 4, reps: "60 sec" },
          { name: "Cone Drills", sets: 4, reps: "8 reps" },
          { name: "Jump Squats", sets: 4, reps: "12" },
          { name: "High Knees", sets: 4, reps: "30 sec" }
        ]
      }
    ],
    tips: [
      "Focus on explosive movements",
      "Prioritize recovery between sessions",
      "Include dynamic warm-ups",
      "Track your speed and power metrics"
    ]
  }
]

export const goals = ["All", "Build Muscle", "Lose Weight", "Endurance"]
export const levels = ["All", "Beginner", "Intermediate", "Advanced"]
export const durations = ["All", "4 weeks", "6 weeks", "8 weeks", "12 weeks"]
