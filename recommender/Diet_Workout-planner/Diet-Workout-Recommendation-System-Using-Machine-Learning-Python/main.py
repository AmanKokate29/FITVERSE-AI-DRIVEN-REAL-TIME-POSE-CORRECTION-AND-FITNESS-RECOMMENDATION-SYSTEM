from flask import Flask, render_template, request
import google.generativeai as genai
import os

# Set your API key
os.environ["GOOGLE_API_KEY"] = "API-KEY"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

app = Flask(__name__)

# Initialize the model
model = genai.GenerativeModel("models/gemini-3-flash-preview")

# Function to generate recommendations
def generate_recommendation(age, gender, height, weight, dietary_preferences, fitness_goals, activity_level,
                            lifestyle_factors, dietary_restrictions, health_conditions, budget, user_query):
    prompt = f"""
You are an expert Indian nutritionist and fitness coach. 
Create a personalized, practical, and affordable diet and workout plan tailored specifically for an Indian user.

User Profile:
- Age: {age}
- Gender: {gender}
- Height: {height}
- Weight: {weight}
- Dietary Preference: {dietary_preferences} (Vegetarian / Non-Vegetarian / Eggetarian / Vegan / Jain)
- Fitness Goal: {fitness_goals} (Weight Loss / Weight Gain / Muscle Gain / General Fitness)
- Activity Level: {activity_level} (Sedentary / Moderate / Active)
- Lifestyle Factors: {lifestyle_factors}
- Dietary Restrictions: {dietary_restrictions}
- Health Conditions: {health_conditions}
- Budget Preference: {budget} (Low / Medium / High)
- User Query: {user_query}

Instructions:
- Focus on Indian food habits and locally available ingredients.
- Include simple, affordable, and easy-to-cook meals.
- Avoid recommending expensive or foreign foods unless necessary.
- Customize based on dietary preference (veg/non-veg/etc.).
- Consider common Indian eating patterns (breakfast, lunch, dinner, snacks).
- Avoid harmful or unsafe advice.
- Keep recommendations realistic for daily Indian lifestyle.

Output Format (STRICT):

1. Diet Recommendations (Return as a list of 5)
   - Suggest 5 Indian diet styles or patterns (e.g., High Protein Indian Diet, South Indian Balanced Diet, etc.)
   - Brief explanation for each

2. Workout Plan (Return as a list of 5)
   - Include home workouts + gym options
   - Mention duration and frequency

3. Meal Plan Suggestions

   Breakfast Ideas (5 items):
   - Include Indian options like poha, upma, paratha, oats, idli, etc.

   Lunch Ideas (5 items):
   - Include roti, sabzi, dal, rice combinations

   Dinner Ideas (5 items):
   - Light and healthy Indian dinner options

4. Snacks & Additional Recommendations (Return as list)
   - Healthy Indian snacks (roasted chana, makhana, fruits, etc.)
   - Hydration tips
   - Supplement suggestions (only if safe and necessary)

5. Important Tips
   - 3-5 simple lifestyle tips (sleep, consistency, water intake, etc.)

Keep the tone simple, practical, and beginner-friendly.
Avoid complex medical terminology.
Ensure the plan is culturally relevant for an Indian user.
    """

    response = model.generate_content(prompt)
    return response.text if response else "No response from the model."

@app.route('/')
def index():
    return render_template('index.html', recommendations=None)

@app.route('/recommendations', methods=['POST'])
def recommendations():
    if request.method == "POST":
        # Collect form data
        age = request.form['age']
        gender = request.form['gender']
        height = request.form['height']
        weight = request.form['weight']
        dietary_preferences = request.form['dietary_preferences']
        fitness_goals = request.form['fitness_goals']
        activity_level = request.form['activity_level']
        lifestyle_factors = request.form['lifestyle_factors']
        dietary_restrictions = request.form['dietary_restrictions']
        health_conditions = request.form['health_conditions']
        budget = request.form['budget']
        user_query = request.form['user_query']

        # Generate recommendations using the model
        recommendations_text = generate_recommendation(
            age, gender, height, weight, dietary_preferences, fitness_goals, activity_level,
            lifestyle_factors, dietary_restrictions, health_conditions, budget, user_query
        )

        # Parse the results for display
        recommendations = {
            "diet_types": [],
            "workouts": [],
            "breakfasts": [],
            "lunches": [],
            "dinners": [],
            "snacks": [],
            "tips": []
        }

        print("text : ", recommendations_text)

        # Split and map responses based on keywords; handle various markdown styles
        import re
        current_section = None
        for line in recommendations_text.splitlines():
            stripped = line.strip()
            if not stripped:
                continue

            # detect section headings regardless of punctuation or markdown
            if re.search(r"Diet\s+Recommendations", stripped, re.I):
                current_section = "diet_types"
                continue
            if re.search(r"Workout\s+Plan", stripped, re.I) or re.search(r"Workout\s+Options", stripped, re.I):
                current_section = "workouts"
                continue
            if re.search(r"Breakfast", stripped, re.I):
                current_section = "breakfasts"
                continue
            if re.search(r"Lunch", stripped, re.I):
                current_section = "lunches"
                continue
            if re.search(r"Dinner", stripped, re.I):
                current_section = "dinners"
                continue
            if re.search(r"Snacks", stripped, re.I) or re.search(r"Additional\s+Recommendations", stripped, re.I):
                current_section = "snacks"
                continue
            if re.search(r"Important\s+Tips", stripped, re.I) or re.search(r"Lifestyle\s+Tips", stripped, re.I):
                current_section = "tips"
                continue

            # collect line into current section, stripping list markers
            if current_section:
                # remove leading bullets, numbers, asterisks, etc.
                item = re.sub(r"^[\*\-\d\.\)\s]+", "", stripped)
                # drop common header/description lines that aren't actual items
                lc = item.lower()
                if re.match(r"(specific diet|workout recommendations|meal suggestions|snacks|supplements|addition(al)? tips?|hydration|breakfast|lunch|dinner|return as list)", lc):
                    continue
                # strip trailing colons, asterisks, bold markers
                item = re.sub(r"[\*\:]+$", "", item).strip()
                if item:
                    recommendations[current_section].append(item)

        print("dict : ", recommendations)
        return render_template('recommendations.html', recommendations=recommendations)

@app.route('/diet_types')
def dummy_diet():
    # prevents 404 if a button click triggers a GET accidentally
    return ('', 204)

if __name__ == "__main__":
    app.run(debug=True)
