import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { mealPlans } from '../data/mealPlans'
import { ChevronDown, ChevronUp, Flame, Target, Scale, ShoppingCart } from 'lucide-react'

function MealPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [expandedMeals, setExpandedMeals] = useState({})

  const toggleMeal = (mealIndex) => {
    setExpandedMeals(prev => ({
      ...prev,
      [mealIndex]: !prev[mealIndex]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Header */}
      <div className="pt-24 sm:pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center py-10 sm:py-14 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-gray-50 border border-green-100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
              Meal Plans & <span className="text-green-600">Nutrition</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light px-6">
              Fuel your fitness journey with expertly crafted meal plans
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Meal Plans Grid */}
          <div className="space-y-4 sm:space-y-6">
            {mealPlans.map(plan => (
              <div key={plan.id} className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Plan Header */}
                <div className="lg:flex">
                  {/* Image */}
                  <div className="lg:w-1/3 lg:flex-shrink-0">
                    <img src={plan.image} alt={plan.title} className="w-full h-56 sm:h-64 lg:h-72 object-cover" />
                  </div>
                  
                  {/* Content */}
                  <div className="lg:w-2/3 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                      <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.title}</h2>
                        <p className="text-gray-600 text-sm sm:text-base">{plan.description}</p>
                      </div>
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold self-start">
                        {plan.goal}
                      </span>
                    </div>

                    {/* Macros Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Calories</p>
                          <p className="font-semibold text-sm text-gray-900">{plan.calories}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Protein</p>
                          <p className="font-semibold text-sm text-gray-900">{plan.macros.protein}g</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Carbs</p>
                          <p className="font-semibold text-sm text-gray-900">{plan.macros.carbs}g</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Fats</p>
                          <p className="font-semibold text-sm text-gray-900">{plan.macros.fats}g</p>
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      {selectedPlan === plan.id ? (
                        <>
                          Hide Details <ChevronUp className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          View Full Plan <ChevronDown className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedPlan === plan.id && (
                  <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                    {/* Daily Meals */}
                    <h4 className="text-xl font-bold mb-6 text-gray-900">Daily Meal Schedule</h4>
                    <div className="space-y-4">
                      {plan.meals.map((meal, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-600 hover:shadow-md transition-all">
                          <button
                            onClick={() => toggleMeal(idx)}
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <span className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide">
                                {meal.type}
                              </span>
                              <div className="text-left">
                                <span className="font-bold text-gray-900 text-base block">{meal.name}</span>
                                <span className="text-sm text-gray-500">{meal.calories} calories</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {expandedMeals[idx] ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                          </button>

                          {expandedMeals[idx] && (
                            <div className="px-5 py-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
                              {/* Macros */}
                              <div className="mb-6">
                                <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Nutritional Information</h6>
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="bg-white rounded-lg p-4 border-2 border-green-100 hover:border-green-300 transition-colors">
                                    <div className="text-xs font-medium text-gray-600 mb-1">Protein</div>
                                    <div className="text-2xl font-bold text-green-600">{meal.protein}<span className="text-sm text-gray-500">g</span></div>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 border-2 border-blue-100 hover:border-blue-300 transition-colors">
                                    <div className="text-xs font-medium text-gray-600 mb-1">Carbs</div>
                                    <div className="text-2xl font-bold text-blue-600">{meal.carbs}<span className="text-sm text-gray-500">g</span></div>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 border-2 border-orange-100 hover:border-orange-300 transition-colors">
                                    <div className="text-xs font-medium text-gray-600 mb-1">Fats</div>
                                    <div className="text-2xl font-bold text-orange-600">{meal.fats}<span className="text-sm text-gray-500">g</span></div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-5">
                                {/* Ingredients */}
                                <div>
                                  <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-green-600 rounded"></span>
                                    Ingredients
                                  </h6>
                                  <ul className="space-y-2.5 bg-white rounded-lg p-4 border border-gray-200">
                                    {meal.ingredients.map((ingredient, i) => (
                                      <li key={i} className="text-gray-700 text-sm flex items-start gap-3">
                                        <span className="text-green-600 text-lg leading-none">✓</span>
                                        <span className="leading-relaxed">{ingredient}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Instructions */}
                                <div>
                                  <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-green-600 rounded"></span>
                                    Preparation
                                  </h6>
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <p className="text-gray-700 text-sm leading-relaxed">{meal.instructions}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Shopping List */}
                    <div className="mt-8 bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="bg-green-600 p-2 rounded-lg">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">Weekly Shopping List</h4>
                          <p className="text-xs text-gray-600">All ingredients you'll need for the week</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {plan.shoppingList.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200 hover:border-green-300 transition-colors">
                            <span className="text-green-600 text-lg flex-shrink-0">✓</span>
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Nutrition Tips */}
          <div className="mt-16 bg-white border border-gray-200 rounded-xl p-8 lg:p-10">
            <h3 className="text-2xl lg:text-3xl font-bold mb-8 text-gray-900">Nutrition Tips for Success</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <h4 className="font-semibold mb-3 text-lg text-gray-900 flex items-center gap-2">
                  <span className="text-green-600">→</span>
                  Meal Prep Strategy
                </h4>
                <p className="text-gray-600 leading-relaxed">Prepare meals in advance on weekends. Cook proteins, grains, and vegetables in bulk to save time during the week.</p>
              </div>
              <div className="group">
                <h4 className="font-semibold mb-3 text-lg text-gray-900 flex items-center gap-2">
                  <span className="text-green-600">→</span>
                  Stay Hydrated
                </h4>
                <p className="text-gray-600 leading-relaxed">Drink at least 8-10 glasses of water daily. Increase intake during workouts and hot weather.</p>
              </div>
              <div className="group">
                <h4 className="font-semibold mb-3 text-lg text-gray-900 flex items-center gap-2">
                  <span className="text-green-600">→</span>
                  Flexible Substitutions
                </h4>
                <p className="text-gray-600 leading-relaxed">Feel free to swap similar ingredients based on preference or availability while maintaining similar macro profiles.</p>
              </div>
              <div className="group">
                <h4 className="font-semibold mb-3 text-lg text-gray-900 flex items-center gap-2">
                  <span className="text-green-600">→</span>
                  Timing Matters
                </h4>
                <p className="text-gray-600 leading-relaxed">Eat protein and carbs within 2 hours post-workout for optimal recovery and muscle growth.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MealPlansPage
