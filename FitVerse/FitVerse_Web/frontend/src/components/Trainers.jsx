import { Award, CheckCircle, Dumbbell, Heart, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const Trainers = () => {
  const trainers = [
    {
      name: 'Sarah Johnson',
      specialty: 'Strength & Conditioning',
      image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400',
      experience: '8 Years',
      certifications: 'NASM-CPT, CSCS',
      clientsTransformed: '20+',
      bio: 'Helps clients build sustainable strength and confidence through progressive training.',
      highlights: [
        'Body transformation programs',
        'Functional strength focus',
        'Habit-based nutrition coaching'
      ]
    },
    {
      name: 'Daniel Carter',
      specialty: 'Muscle Building & Athletic Performance',
      image: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=400',
      experience: '9 Years',
      certifications: 'NSCA-CPT, USAW Level 1',
      clientsTransformed: '25+',
      bio: 'Guides clients through structured strength and performance programs with measurable progress.',
      highlights: [
        'Lean muscle development plans',
        'Athletic performance training',
        'Technique-first strength coaching'
      ]
    },
    {
      name: 'Priya Mehta',
      specialty: 'Mobility & Women Fitness',
      image: 'https://images.unsplash.com/photo-1609899537878-88d5ba429bdb?q=80&w=400',
      experience: '7 Years',
      certifications: 'ISSA-CPT, Yoga Alliance RYT-200',
      clientsTransformed: '18+',
      bio: 'Combines strength, mobility, and mindful movement to improve long-term performance.',
      highlights: [
        'Injury-aware programming',
        'Mobility and recovery plans',
        'Women-specific coaching support'
      ]
    }
  ]

  return (
    <section id="trainers" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Coaching Team
          </span>
          <h2 className="section-title">Meet Your Coaches</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Train with certified professionals, each focused on different goals and coaching styles.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <article
              key={trainer.name}
              className="group border-2 border-gray-200 rounded-2xl p-5 hover:border-green-600 transition-colors"
            >
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">{trainer.experience} Experience</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-bold text-gray-900">{trainer.name}</h3>
                <p className="text-green-600 font-medium text-sm">{trainer.specialty}</p>
                <p className="text-gray-600 text-sm">Certified: {trainer.certifications}</p>
                <p className="text-green-600 font-semibold text-sm">{trainer.clientsTransformed} Clients Transformed</p>
                <p className="text-gray-600 text-sm leading-relaxed">{trainer.bio}</p>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{trainer.highlights[0]}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Dumbbell className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{trainer.highlights[1]}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{trainer.highlights[2]}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 text-xs">
                  <Users className="h-4 w-4 text-green-600" />
                  <span>Accepting New Clients</span>
                </div>
                <Link
                  to="/coaching"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-all duration-300"
                >
                  Work With Us
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Trainers
