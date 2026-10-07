import { useState, useEffect } from 'react'
import { Search, X, Apple } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { foodDatabase } from '../data/foodDatabase'

const CalorieTrackerPage = () => {
  // Food search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [servingSize, setServingSize] = useState(100)

  // Search for food
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      return
    }
    
    const results = foodDatabase.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSearchResults(results)
  }, [searchQuery])

  // Select food from search
  const selectFood = (food) => {
    setSelectedFood(food)
    setShowSearch(false)
  }

  // Calculate nutrients for selected food
  const getNutrients = () => {
    if (!selectedFood) {
      return {
        calories: 0,
        macros: { protein: 0, carbs: 0, fats: 0, fiber: 0 },
        micros: { vitaminA: 0, vitaminC: 0, vitaminD: 0, calcium: 0, iron: 0, potassium: 0, sodium: 0 }
      }
    }

    const multiplier = servingSize / 100

    return {
      calories: Math.round(selectedFood.calories * multiplier),
      macros: {
        protein: parseFloat((selectedFood.protein * multiplier).toFixed(2)),
        carbs: parseFloat((selectedFood.carbs * multiplier).toFixed(2)),
        fats: parseFloat((selectedFood.fats * multiplier).toFixed(2)),
        fiber: parseFloat((selectedFood.fiber * multiplier).toFixed(2))
      },
      micros: {
        vitaminA: parseFloat((selectedFood.vitaminA * multiplier).toFixed(2)),
        vitaminC: parseFloat((selectedFood.vitaminC * multiplier).toFixed(2)),
        vitaminD: parseFloat((selectedFood.vitaminD * multiplier).toFixed(2)),
        calcium: parseFloat((selectedFood.calcium * multiplier).toFixed(2)),
        iron: parseFloat((selectedFood.iron * multiplier).toFixed(2)),
        potassium: parseFloat((selectedFood.potassium * multiplier).toFixed(2)),
        sodium: parseFloat((selectedFood.sodium * multiplier).toFixed(2))
      }
    }
  }

  const nutrients = getNutrients()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 sm:pt-28 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 py-10 sm:py-14 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-gray-50 border border-green-100">
            <div className="inline-block mb-3">
              <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide">
                Nutrition Analysis Tool
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-3">
              <span className="text-gray-900">Food</span>{' '}
              <span className="text-green-600">Nutrition</span>{' '}
              <span className="text-gray-900">Finder</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Search any food to discover its complete macronutrient and micronutrient profile instantly
            </p>
          </div>

          {/* Food Nutrition Finder */}
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search and Selection Card */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column: Food Search */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Apple className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold">Search Food</h2>
                  </div>

                  {/* Food Search */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter Food Name
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setShowSearch(true)
                        }}
                        onFocus={() => setShowSearch(true)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                        placeholder="Search for food... (e.g., Chicken, Rice, Apple)"
                      />
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearch && searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                        {searchResults.map((food) => (
                          <button
                            key={food.id}
                            onClick={() => selectFood(food)}
                            className="w-full text-left px-4 py-2.5 hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{food.name}</p>
                                <p className="text-xs text-gray-500">{food.category}</p>
                              </div>
                              <span className="text-xs font-semibold text-green-600">{food.calories} cal</span>
                            </div>
                            <div className="flex gap-3 mt-1 text-xs text-gray-600">
                              <span>P: {food.protein}g</span>
                              <span>C: {food.carbs}g</span>
                              <span>F: {food.fats}g</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Food Card */}
                  {selectedFood && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{selectedFood.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{selectedFood.category}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFood(null)
                            setServingSize(100)
                            setSearchQuery('')
                          }}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Serving Size */}
                      <div className="mb-3">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Serving Size (grams)
                        </label>
                        <input
                          type="number"
                          value={servingSize}
                          onChange={(e) => setServingSize(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-base font-semibold"
                          placeholder="100"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Nutritional values are per 100g. Adjust serving size to see updated values.</p>
                      </div>

                      {/* Quick Info */}
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Total Calories</p>
                        <p className="text-4xl font-bold text-green-600">{nutrients.calories}</p>
                        <p className="text-xs text-gray-500 mt-1">kcal per {servingSize}g</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Nutritional Information */}
                <div className="space-y-6">
                  {!selectedFood ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center py-10">
                        <Search className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-base">Search and select a food to view</p>
                        <p className="text-gray-400 text-xs mt-1">its complete nutritional profile</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 h-full flex flex-col justify-center">
                      <div className="space-y-4">
                        {/* Total Calories */}
                        <div className="text-center pb-3 border-b border-green-200">
                          <p className="text-xs text-gray-600 mb-1">Total Calories per {servingSize}g</p>
                          <p className="text-4xl font-bold text-green-600">{nutrients.calories}</p>
                          <p className="text-sm text-gray-500 font-medium">kcal</p>
                          <p className="text-xs text-gray-400 mt-2">Calorie Density: {(nutrients.calories / servingSize * 100).toFixed(1)} kcal/100g</p>
                        </div>

                        {/* Calorie Breakdown */}
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">Calorie Sources</p>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs text-gray-500">Protein</p>
                                <p className="text-xs text-blue-600 font-bold">{(() => {
                                  const totalMacroCals = (nutrients.macros.protein * 4) + (nutrients.macros.carbs * 4) + (nutrients.macros.fats * 9);
                                  return ((nutrients.macros.protein * 4) / totalMacroCals * 100).toFixed(0);
                                })()}%</p>
                              </div>
                              <p className="text-lg font-bold text-blue-600">{(nutrients.macros.protein * 4).toFixed(0)}</p>
                              <p className="text-xs text-gray-400">kcal</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-orange-200">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs text-gray-500">Carbs</p>
                                <p className="text-xs text-orange-600 font-bold">{(() => {
                                  const totalMacroCals = (nutrients.macros.protein * 4) + (nutrients.macros.carbs * 4) + (nutrients.macros.fats * 9);
                                  return ((nutrients.macros.carbs * 4) / totalMacroCals * 100).toFixed(0);
                                })()}%</p>
                              </div>
                              <p className="text-lg font-bold text-orange-600">{(nutrients.macros.carbs * 4).toFixed(0)}</p>
                              <p className="text-xs text-gray-400">kcal</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-yellow-200">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs text-gray-500">Fats</p>
                                <p className="text-xs text-yellow-600 font-bold">{(() => {
                                  const totalMacroCals = (nutrients.macros.protein * 4) + (nutrients.macros.carbs * 4) + (nutrients.macros.fats * 9);
                                  return ((nutrients.macros.fats * 9) / totalMacroCals * 100).toFixed(0);
                                })()}%</p>
                              </div>
                              <p className="text-lg font-bold text-yellow-600">{(nutrients.macros.fats * 9).toFixed(0)}</p>
                              <p className="text-xs text-gray-400">kcal</p>
                            </div>
                          </div>
                        </div>

                        {/* Macros Grid */}
                        <div className="pt-3 border-t border-green-200">
                          <p className="text-sm font-bold text-gray-900 mb-2">Macronutrients</p>
                          <div className="grid grid-cols-4 gap-2">
                            <div className="text-center bg-white rounded-lg p-2.5 border border-blue-200">
                              <p className="text-xl font-bold text-blue-600">{nutrients.macros.protein.toFixed(1)}</p>
                              <p className="text-xs text-blue-600 font-medium mt-0.5">Protein</p>
                              <p className="text-xs text-gray-400">grams</p>
                            </div>
                            <div className="text-center bg-white rounded-lg p-2.5 border border-orange-200">
                              <p className="text-xl font-bold text-orange-600">{nutrients.macros.carbs.toFixed(1)}</p>
                              <p className="text-xs text-orange-600 font-medium mt-0.5">Carbs</p>
                              <p className="text-xs text-gray-400">grams</p>
                            </div>
                            <div className="text-center bg-white rounded-lg p-2.5 border border-yellow-200">
                              <p className="text-xl font-bold text-yellow-600">{nutrients.macros.fats.toFixed(1)}</p>
                              <p className="text-xs text-yellow-600 font-medium mt-0.5">Fats</p>
                              <p className="text-xs text-gray-400">grams</p>
                            </div>
                            <div className="text-center bg-white rounded-lg p-2.5 border border-green-200">
                              <p className="text-xl font-bold text-green-600">{nutrients.macros.fiber.toFixed(1)}</p>
                              <p className="text-xs text-green-600 font-medium mt-0.5">Fiber</p>
                              <p className="text-xs text-gray-400">grams</p>
                            </div>
                          </div>
                        </div>

                        {/* Macro Distribution Bar */}
                        <div className="pt-3 border-t border-green-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Macro Distribution</p>
                          <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-100 shadow-inner">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600"
                              style={{ width: `${(() => {
                                const totalMacroCals = (nutrients.macros.protein * 4) + (nutrients.macros.carbs * 4) + (nutrients.macros.fats * 9);
                                return ((nutrients.macros.protein * 4) / totalMacroCals * 100).toFixed(0);
                              })()}%` }}
                            ></div>
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-orange-600"
                              style={{ width: `${(() => {
                                const totalMacroCals = (nutrients.macros.protein * 4) + (nutrients.macros.carbs * 4) + (nutrients.macros.fats * 9);
                                return ((nutrients.macros.carbs * 4) / totalMacroCals * 100).toFixed(0);
                              })()}%` }}
                            ></div>
                            <div 
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600"
                              style={{ width: `${(() => {
                                const totalMacroCals = (nutrients.macros.protein * 4) + (nutrients.macros.carbs * 4) + (nutrients.macros.fats * 9);
                                return ((nutrients.macros.fats * 9) / totalMacroCals * 100).toFixed(0);
                              })()}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-xs text-gray-600">Protein {(() => {
                                const totalMacroCals = (nutrients.macros.protein * 4) + (nutrients.macros.carbs * 4) + (nutrients.macros.fats * 9);
                                return ((nutrients.macros.protein * 4) / totalMacroCals * 100).toFixed(0);
                              })()}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              <span className="text-xs text-gray-600">Carbs {(() => {
                                const totalMacroCals = (nutrients.macros.protein * 4) + (nutrients.macros.carbs * 4) + (nutrients.macros.fats * 9);
                                return ((nutrients.macros.carbs * 4) / totalMacroCals * 100).toFixed(0);
                              })()}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <span className="text-xs text-gray-600">Fats {(() => {
                                const totalMacroCals = (nutrients.macros.protein * 4) + (nutrients.macros.carbs * 4) + (nutrients.macros.fats * 9);
                                return ((nutrients.macros.fats * 9) / totalMacroCals * 100).toFixed(0);
                              })()}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Micronutrients Card */}
            {selectedFood && (
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <div className="w-5 h-5 bg-purple-600 rounded"></div>
                  </div>
                  Micronutrients - Daily Value %
                </h3>

                <div className="space-y-5">
                  {/* Vitamins Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-purple-600 rounded"></div>
                      <h4 className="text-base font-bold text-gray-800">Vitamins</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {/* Vitamin A */}
                      <div className="bg-white border border-purple-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-xs font-bold text-purple-700">Vitamin A</p>
                            <p className="text-xs text-purple-500 italic">Vision & immunity</p>
                          </div>
                          <p className="text-sm font-bold text-purple-600">{nutrients.micros.vitaminA.toFixed(2)} mcg</p>
                        </div>
                        <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((nutrients.micros.vitaminA / 800) * 100, 100)}%` }}
                          >
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">{((nutrients.micros.vitaminA / 800) * 100).toFixed(0)}% of Daily Value</p>
                          <p className="text-xs text-gray-400">800 mcg</p>
                        </div>
                      </div>

                      {/* Vitamin C */}
                      <div className="bg-white border border-orange-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-xs font-bold text-orange-700">Vitamin C</p>
                            <p className="text-xs text-orange-500 italic">Antioxidant & collagen</p>
                          </div>
                          <p className="text-sm font-bold text-orange-600">{nutrients.micros.vitaminC.toFixed(2)} mg</p>
                        </div>
                        <div className="w-full bg-orange-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((nutrients.micros.vitaminC / 80) * 100, 100)}%` }}
                          >
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">{((nutrients.micros.vitaminC / 80) * 100).toFixed(0)}% of Daily Value</p>
                          <p className="text-xs text-gray-400">80 mg</p>
                        </div>
                      </div>

                      {/* Vitamin D */}
                      <div className="bg-white border border-yellow-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-xs font-bold text-yellow-700">Vitamin D</p>
                            <p className="text-xs text-yellow-500 italic">Bone health</p>
                          </div>
                          <p className="text-sm font-bold text-yellow-600">{nutrients.micros.vitaminD.toFixed(2)} mcg</p>
                        </div>
                        <div className="w-full bg-yellow-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((nutrients.micros.vitaminD / 15) * 100, 100)}%` }}
                          >
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">{((nutrients.micros.vitaminD / 15) * 100).toFixed(0)}% of Daily Value</p>
                          <p className="text-xs text-gray-400">15 mcg</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Minerals Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-blue-600 rounded"></div>
                      <h4 className="text-base font-bold text-gray-800">Minerals</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {/* Calcium */}
                      <div className="bg-white border border-blue-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-xs font-bold text-blue-700">Calcium</p>
                            <p className="text-xs text-blue-500 italic">Bone & teeth</p>
                          </div>
                          <p className="text-sm font-bold text-blue-600">{nutrients.micros.calcium.toFixed(2)} mg</p>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((nutrients.micros.calcium / 1000) * 100, 100)}%` }}
                          >
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">{((nutrients.micros.calcium / 1000) * 100).toFixed(0)}% of Daily Value</p>
                          <p className="text-xs text-gray-400">1000 mg</p>
                        </div>
                      </div>

                      {/* Iron */}
                      <div className="bg-white border border-red-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-xs font-bold text-red-700">Iron</p>
                            <p className="text-xs text-red-500 italic">Oxygen transport</p>
                          </div>
                          <p className="text-sm font-bold text-red-600">{nutrients.micros.iron.toFixed(2)} mg</p>
                        </div>
                        <div className="w-full bg-red-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((nutrients.micros.iron / 13) * 100, 100)}%` }}
                          >
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">{((nutrients.micros.iron / 13) * 100).toFixed(0)}% of Daily Value</p>
                          <p className="text-xs text-gray-400">13 mg</p>
                        </div>
                      </div>

                      {/* Potassium */}
                      <div className="bg-white border border-green-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-xs font-bold text-green-700">Potassium</p>
                            <p className="text-xs text-green-500 italic">Heart & muscles</p>
                          </div>
                          <p className="text-sm font-bold text-green-600">{nutrients.micros.potassium.toFixed(2)} mg</p>
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((nutrients.micros.potassium / 3000) * 100, 100)}%` }}
                          >
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">{((nutrients.micros.potassium / 3000) * 100).toFixed(0)}% of Daily Value</p>
                          <p className="text-xs text-gray-400">3000 mg</p>
                        </div>
                      </div>

                      {/* Sodium */}
                      <div className="bg-white border border-gray-300 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-xs font-bold text-gray-700">Sodium</p>
                            <p className="text-xs text-gray-500 italic">Fluid balance</p>
                          </div>
                          <p className="text-sm font-bold text-gray-600">{nutrients.micros.sodium.toFixed(2)} mg</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-gray-500 to-gray-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((nutrients.micros.sodium / 2300) * 100, 100)}%` }}
                          >
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">{((nutrients.micros.sodium / 2300) * 100).toFixed(0)}% of Daily Value</p>
                          <p className="text-xs text-gray-400">2300 mg max</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nutritional Guidance Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-6 border border-blue-200">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                </div>
                Daily Nutritional Guidance
              </h3>

              <div className="space-y-6">
                {/* Macronutrient Guidelines */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-blue-600 rounded"></div>
                    <h4 className="text-base font-bold text-gray-800">Macronutrient Recommendations</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <p className="font-bold text-sm text-gray-800">Protein</p>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        <span className="font-semibold text-blue-600">0.8-2.2g per kg body weight</span> (varies by activity level)
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Sedentary: 0.8-1.0g/kg</li>
                        <li>Active: 1.2-1.6g/kg</li>
                        <li>Athletes: 1.6-2.2g/kg</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <p className="font-bold text-sm text-gray-800">Carbohydrates</p>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        <span className="font-semibold text-orange-600">45-65% of total daily calories</span>
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Focus on complex carbs</li>
                        <li>Include whole grains, fruits</li>
                        <li>Limit refined sugars</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <p className="font-bold text-sm text-gray-800">Fats</p>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        <span className="font-semibold text-yellow-600">20-35% of total daily calories</span>
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Prioritize unsaturated fats</li>
                        <li>Omega-3 & Omega-6 essential</li>
                        <li>Limit saturated & trans fats</li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <p className="font-bold text-sm text-gray-800">Fiber</p>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        <span className="font-semibold text-green-600">25-30g per day</span>
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                        <li>Women: 25g daily</li>
                        <li>Men: 30-38g daily</li>
                        <li>Aids digestion & satiety</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Calorie Guidelines by Goal */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-green-600 rounded"></div>
                    <h4 className="text-base font-bold text-gray-800">Calorie Goals by Objective</h4>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                      <p className="font-bold text-sm text-gray-800 mb-1">Weight Loss</p>
                      <p className="text-xs text-gray-600">Deficit of <span className="font-semibold text-red-600">300-500 calories/day</span> below maintenance</p>
                      <p className="text-xs text-gray-500 mt-2">Safe rate: 0.5-1kg per week</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="font-bold text-sm text-gray-800 mb-1">Maintenance</p>
                      <p className="text-xs text-gray-600">Match your <span className="font-semibold text-blue-600">TDEE</span> (Total Daily Energy Expenditure)</p>
                      <p className="text-xs text-gray-500 mt-2">Stable bodyweight</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                      <p className="font-bold text-sm text-gray-800 mb-1">Muscle Gain</p>
                      <p className="text-xs text-gray-600">Surplus of <span className="font-semibold text-green-600">200-400 calories/day</span> above maintenance</p>
                      <p className="text-xs text-gray-500 mt-2">With strength training</p>
                    </div>
                  </div>
                </div>

                {/* Hydration & Meal Timing */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-cyan-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                      <p className="font-bold text-sm text-gray-800">Hydration</p>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                      <li><span className="font-semibold text-cyan-600">2.5-3.5 liters/day</span> for adults</li>
                      <li>More during exercise & hot weather</li>
                      <li>Monitor urine color (pale yellow)</li>
                      <li>Water, herbal tea, infused water</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <p className="font-bold text-sm text-gray-800">Meal Timing</p>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc">
                      <li>Eat <span className="font-semibold text-purple-600">3-5 balanced meals</span> daily</li>
                      <li>Don't skip breakfast</li>
                      <li>Pre/post workout nutrition matters</li>
                      <li>Avoid late-night heavy meals</li>
                    </ul>
                  </div>
                </div>

                {/* Important Note */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <div className="text-emerald-600 text-lg mt-0.5">💪</div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-800 mb-1">Ready for Personalized Guidance?</p>
                      <p className="text-xs text-emerald-700">
                        These are general guidelines. For customized nutrition advice tailored to your age, gender, activity level, health conditions, and specific fitness goals, consult with our <span className="font-bold text-emerald-900">FitVerse Coaches</span> for a personalized plan!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CalorieTrackerPage
