import { useState } from 'react'
import { Calendar, Target, TrendingUp, Award, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { workoutPlans } from '../data/workoutPlans'

const WorkoutPlansPage = () => {
  const [expandedPlan, setExpandedPlan] = useState(null)

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-700'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'Advanced': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getGoalIcon = (goal) => {
    switch(goal) {
      case 'Build Muscle': return '💪'
      case 'Lose Weight': return '🔥'
      case 'Endurance': return '⚡'
      default: return '🎯'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 sm:pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center py-10 sm:py-14 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-gray-50 border border-green-100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
              Workout <span className="text-green-600">Plans</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light px-6">
              Choose from our expertly designed training programs tailored to your goals
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Plans Grid */}
          <div className="space-y-3 sm:space-y-4">
            {workoutPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Plan Header */}
                <div className="lg:flex">
                  {/* Image */}
                  <div className="lg:w-1/3">
                    <img
                      src={plan.image}
                      alt={plan.title}
                      className="w-full h-40 sm:h-48 lg:h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="lg:w-2/3 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                      <div className="flex-1">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{plan.title}</h2>
                        <p className="text-gray-600 text-xs sm:text-sm">{plan.description}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getLevelColor(plan.level)}`}>
                        {plan.level}
                      </span>
                    </div>

                    {/* Plan Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-600">Goal</p>
                          <p className="font-semibold text-sm text-gray-900">{getGoalIcon(plan.goal)} {plan.goal}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="font-semibold text-sm text-gray-900">{plan.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-600">Frequency</p>
                          <p className="font-semibold text-sm text-gray-900">{plan.daysPerWeek} days/week</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-600">Workouts</p>
                          <p className="font-semibold text-sm text-gray-900">{plan.workouts.length} sessions</p>
                        </div>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                      className="w-full btn-primary py-2 flex items-center justify-center gap-2"
                    >
                      {expandedPlan === plan.id ? (
                        <>
                          Hide Details <ChevronUp className="h-5 w-5" />
                        </>
                      ) : (
                        <>
                          View Full Program <ChevronDown className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedPlan === plan.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {/* Workouts */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-4">Weekly Schedule</h3>
                      <div className="space-y-4">
                        {plan.workouts.map((workout, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 shadow">
                            <h4 className="font-bold text-lg text-green-600 mb-3">{workout.day}</h4>
                            <div className="space-y-2">
                              {workout.exercises.map((exercise, exIdx) => (
                                <div key={exIdx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                  <span className="font-medium text-gray-900">{exercise.name}</span>
                                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                    {exercise.sets} sets × {exercise.reps}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                        💡 Expert Tips
                      </h4>
                      <ul className="space-y-2">
                        {plan.tips.map((tip, idx) => (
                          <li key={idx} className="text-blue-700 flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default WorkoutPlansPage
