import { Dumbbell, Heart, Users, Trophy, Calendar, Target, Clock, Home } from 'lucide-react'

const Services = () => {
  const services = [
    {
      icon: <Target className="h-10 w-10" />,
      title: "12 Week Full Coaching Package",
      subtitle: "3 Month Transformation Program",
      description: "Complete online coaching for full body transformation.",
      features: [
        "Customized training program",
        "Personalized nutrition plan",
        "24/7 coach support",
        "Training video critique and form correction",
        "Weekly progress review and updates"
      ]
    },
    {
      icon: <Trophy className="h-10 w-10" />,
      title: "24 Week Full Coaching Package",
      subtitle: "6 Month Total Transformation",
      description: "Extended coaching for deeper fat loss, muscle growth, and sustainable habits.",
      features: [
        "Customized training program",
        "Personalized nutrition plan",
        "24/7 coach support",
        "Training video critique and form correction",
        "Weekly progress review and updates",
        "Long term progress strategy"
      ]
    },
    {
      icon: <Dumbbell className="h-10 w-10" />,
      title: "Online Training Only",
      subtitle: "3 Month Program",
      description: "Structured training support without nutrition coaching.",
      features: [
        "Customized training program",
        "24/7 coach support",
        "Training video critique and form correction",
        "Weekly progress review and updates"
      ]
    },
    {
      icon: <Home className="h-10 w-10" />,
      title: "Home Workout Programs",
      subtitle: "Monthly Plan",
      description: "Equipment free routines designed for home fitness.",
      features: [
        "Equipment free routines",
        "Simple structured workouts",
        "Progressive difficulty levels",
        "Time efficient sessions"
      ]
    }
  ]

  return (
    <section id="services" className="py-20 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Coaching Packages
          </span>
          <h2 className="section-title">Transform Your Body</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Choose the perfect coaching package tailored to your fitness goals and commitment level.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-green-500 transition-all duration-300 hover:shadow-xl flex flex-col"
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-green-50 text-green-600">
                  {service.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold mb-1 text-gray-900">
                {service.title}
              </h3>
              
              <p className="text-sm font-semibold text-green-600 mb-3">
                {service.subtitle}
              </p>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              
              {/* Features List */}
              <ul className="space-y-2 mb-6 flex-grow">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-xs text-gray-700">
                    <span className="text-green-600 mr-2 mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
