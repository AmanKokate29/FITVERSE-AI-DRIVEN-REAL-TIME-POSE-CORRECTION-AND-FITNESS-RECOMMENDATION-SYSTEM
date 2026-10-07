// Exercise database with comprehensive information
export const exerciseDatabase = [
  // Chest Exercises
  {
    id: 1,
    name: "Barbell Bench Press",
    category: "Chest",
    muscleGroups: ["Chest", "Triceps", "Shoulders"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie flat on a bench with feet firmly on the ground",
      "Grip the barbell slightly wider than shoulder-width",
      "Lower the bar to your mid-chest with control",
      "Press the bar back up until arms are fully extended",
      "Keep your shoulder blades retracted throughout"
    ],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    tips: "Keep your core tight and avoid bouncing the bar off your chest"
  },
  {
    id: 2,
    name: "Push-ups",
    category: "Chest",
    muscleGroups: ["Chest", "Triceps", "Core"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Start in a plank position with hands shoulder-width apart",
      "Lower your body until chest nearly touches the floor",
      "Keep your body in a straight line",
      "Push back up to starting position",
      "Engage your core throughout the movement"
    ],
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400",
    tips: "Don't let your hips sag or pike up"
  },
  {
    id: 3,
    name: "Dumbbell Flyes",
    category: "Chest",
    muscleGroups: ["Chest", "Shoulders"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    instructions: [
      "Lie on a flat bench holding dumbbells above your chest",
      "Lower dumbbells in an arc to sides until chest is stretched",
      "Keep a slight bend in your elbows",
      "Bring dumbbells back together above chest",
      "Squeeze chest at the top"
    ],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    tips: "Use lighter weights and focus on the stretch"
  },

  // Back Exercises
  {
    id: 4,
    name: "Pull-ups",
    category: "Back",
    muscleGroups: ["Back", "Biceps", "Core"],
    equipment: "Pull-up Bar",
    difficulty: "Intermediate",
    instructions: [
      "Hang from a pull-up bar with palms facing away",
      "Pull yourself up until chin is over the bar",
      "Keep core tight and avoid swinging",
      "Lower yourself with control",
      "Fully extend arms at the bottom"
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    tips: "If too difficult, use resistance bands for assistance"
  },
  {
    id: 5,
    name: "Barbell Rows",
    category: "Back",
    muscleGroups: ["Back", "Biceps", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Bend at hips with back straight, knees slightly bent",
      "Grip barbell with hands shoulder-width apart",
      "Pull bar to lower chest/upper abdomen",
      "Squeeze shoulder blades together",
      "Lower with control"
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    tips: "Keep your back straight and core engaged"
  },
  {
    id: 6,
    name: "Lat Pulldown",
    category: "Back",
    muscleGroups: ["Back", "Biceps"],
    equipment: "Cable Machine",
    difficulty: "Beginner",
    instructions: [
      "Sit at lat pulldown machine with thighs secured",
      "Grip bar wider than shoulder-width",
      "Pull bar down to upper chest",
      "Squeeze shoulder blades together",
      "Return to start with control"
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    tips: "Avoid leaning back too much"
  },

  // Legs Exercises
  {
    id: 7,
    name: "Barbell Squats",
    category: "Legs",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Place barbell on upper back/traps",
      "Stand with feet shoulder-width apart",
      "Lower by bending knees and hips",
      "Go down until thighs are parallel to floor",
      "Drive through heels to stand back up"
    ],
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400",
    tips: "Keep chest up and knees tracking over toes"
  },
  {
    id: 8,
    name: "Lunges",
    category: "Legs",
    muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Stand with feet hip-width apart",
      "Step forward with one leg",
      "Lower hips until both knees are at 90 degrees",
      "Push back to starting position",
      "Alternate legs"
    ],
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400",
    tips: "Keep your front knee aligned with your ankle"
  },
  {
    id: 9,
    name: "Romanian Deadlifts",
    category: "Legs",
    muscleGroups: ["Hamstrings", "Glutes", "Lower Back"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Hold barbell with overhand grip at hip level",
      "Keep back straight and knees slightly bent",
      "Lower bar by pushing hips back",
      "Feel stretch in hamstrings",
      "Return to standing by driving hips forward"
    ],
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400",
    tips: "Focus on hip hinge movement"
  },

  // Shoulders
  {
    id: 10,
    name: "Overhead Press",
    category: "Shoulders",
    muscleGroups: ["Shoulders", "Triceps", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Stand with barbell at shoulder height",
      "Press bar overhead until arms are fully extended",
      "Keep core tight and avoid arching back",
      "Lower bar to shoulders with control",
      "Breathe out on the press"
    ],
    image: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400",
    tips: "Don't lock out elbows aggressively"
  },
  {
    id: 11,
    name: "Lateral Raises",
    category: "Shoulders",
    muscleGroups: ["Shoulders"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    instructions: [
      "Stand holding dumbbells at your sides",
      "Raise arms out to sides until parallel to floor",
      "Keep slight bend in elbows",
      "Lower with control",
      "Avoid using momentum"
    ],
    image: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400",
    tips: "Use lighter weights for better form"
  },

  // Arms
  {
    id: 12,
    name: "Bicep Curls",
    category: "Arms",
    muscleGroups: ["Biceps"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    instructions: [
      "Stand with dumbbells at your sides",
      "Curl weights up towards shoulders",
      "Keep elbows stationary at sides",
      "Squeeze biceps at top",
      "Lower with control"
    ],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400",
    tips: "Don't swing the weights"
  },
  {
    id: 13,
    name: "Tricep Dips",
    category: "Arms",
    muscleGroups: ["Triceps", "Chest", "Shoulders"],
    equipment: "Parallel Bars",
    difficulty: "Intermediate",
    instructions: [
      "Support yourself on parallel bars",
      "Lower body by bending elbows",
      "Go down until upper arms are parallel to floor",
      "Push back up to starting position",
      "Keep body upright"
    ],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400",
    tips: "Lean slightly forward to target chest more"
  },

  // Core
  {
    id: 14,
    name: "Plank",
    category: "Core",
    muscleGroups: ["Core", "Shoulders"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Get into push-up position on forearms",
      "Keep body in straight line from head to heels",
      "Engage core and glutes",
      "Hold position for desired time",
      "Breathe normally"
    ],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    tips: "Don't let hips sag or pike up"
  },
  {
    id: 15,
    name: "Russian Twists",
    category: "Core",
    muscleGroups: ["Core", "Obliques"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Sit with knees bent and feet off floor",
      "Lean back slightly keeping back straight",
      "Rotate torso from side to side",
      "Touch ground on each side",
      "Can hold weight for added difficulty"
    ],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    tips: "Move with control, not momentum"
  },

  // Cardio
  {
    id: 16,
    name: "Burpees",
    category: "Cardio",
    muscleGroups: ["Full Body", "Core"],
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    instructions: [
      "Start in standing position",
      "Drop into squat and place hands on floor",
      "Jump feet back to plank position",
      "Do a push-up (optional)",
      "Jump feet forward and jump up with arms overhead"
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    tips: "Maintain a steady rhythm"
  },
  {
    id: 17,
    name: "Mountain Climbers",
    category: "Cardio",
    muscleGroups: ["Core", "Shoulders", "Legs"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Start in plank position",
      "Bring one knee towards chest",
      "Quickly switch legs",
      "Continue alternating at a quick pace",
      "Keep hips down and core engaged"
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    tips: "Speed up for cardio, slow down for core work"
  },
  {
    id: 18,
    name: "Jump Rope",
    category: "Cardio",
    muscleGroups: ["Calves", "Shoulders", "Core"],
    equipment: "Jump Rope",
    difficulty: "Beginner",
    instructions: [
      "Hold rope handles at hip level",
      "Swing rope over head using wrists",
      "Jump as rope passes under feet",
      "Land softly on balls of feet",
      "Maintain steady rhythm"
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    tips: "Start slow and build speed gradually"
  }
]

export const categories = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"]
export const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]
export const equipmentTypes = ["All", "Bodyweight", "Dumbbells", "Barbell", "Machines", "Cable Machine", "Pull-up Bar", "Parallel Bars", "Jump Rope"]
