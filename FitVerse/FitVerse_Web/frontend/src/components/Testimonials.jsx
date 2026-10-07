import { Star } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Jessica Williams",
      role: "Marketing Executive",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
      rating: 5,
      text: "Coach Sarah transformed my life! I've lost 30 pounds and gained so much confidence. Her personalized approach and constant support made all the difference."
    },
    {
      name: "David Martinez",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      rating: 5,
      text: "Best coaching experience ever. Sarah's personalized training programs helped me achieve my strength goals faster than I thought possible. Highly recommend!"
    },
    {
      name: "Amanda Lee",
      role: "Entrepreneur",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      rating: 5,
      text: "Sarah's coaching is top-notch. I feel more balanced, energized, and healthy than ever before. She truly cares about each client's journey. Thank you FitVerse!"
    }
  ]

  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Success Stories
          </span>
          <h2 className="section-title">What My Clients Say</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Real results from real people who've transformed their lives with my coaching.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-green-600 text-green-600" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-700 text-base leading-relaxed mb-8">
                "{testimonial.text}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 text-lg">Ready to start your transformation?</p>
          <button className="btn-primary">
            Work With Us
          </button>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
