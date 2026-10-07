import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Target, Heart, Users, Award, Zap, Shield } from 'lucide-react'

function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Results-Driven",
      description: "We focus on delivering measurable results through proven training methods and personalized programs."
    },
    {
      icon: Heart,
      title: "Client First",
      description: "Every client gets dedicated attention. We create a supportive environment where you feel motivated and empowered."
    },
    {
      icon: Users,
      title: "Personal Attention",
      description: "With years of certified coaching experience, our team stays updated with the latest fitness science to serve you better."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We leverage cutting-edge technology and training techniques to optimize your fitness journey."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Prioritizing proper form, injury prevention, and sustainable training practices for long-term health."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to maintaining the highest standards in fitness training, nutrition guidance, and client service."
    }
  ]

  const stats = [
    { number: "60+", label: "Clients Transformed" },
    { number: "3", label: "Certified Coaches" },
    { number: "8+", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" }
  ]

  const coaches = [
    {
      name: "Sarah Johnson",
      role: "Founder & Head Coach",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400",
      description: "Certified personal trainer (NASM-CPT, CSCS) with 8+ years of experience in strength and conditioning."
    },
    {
      name: "Daniel Carter",
      role: "Performance Coach",
      image: "https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=400",
      description: "Specializes in muscle-building and athletic performance programs with technique-first training."
    },
    {
      name: "Priya Mehta",
      role: "Mobility & Wellness Coach",
      image: "https://images.unsplash.com/photo-1609899537878-88d5ba429bdb?q=80&w=400",
      description: "Focuses on mobility, women fitness, and long-term sustainable movement and recovery plans."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 sm:pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center py-10 sm:py-14 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-gray-50 border border-green-100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
              About <span className="text-green-600">FitVerse</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light px-6">
              We are a certified coaching team dedicated to helping you achieve your goals through personalized training and expert guidance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-y border-gray-200 py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">{stat.number}</div>
                <div className="text-gray-600 font-medium text-sm uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="space-y-5 text-gray-700 leading-relaxed text-lg">
            <p>
              FitVerse was built from a shared passion for fitness and a mission to make professional coaching accessible to everyone. As a certified coaching team, we have helped clients transform their bodies, confidence, and daily habits.
            </p>
            <p>
              What makes our approach different is personal attention. We do not believe in cookie-cutter programs or generic advice. Every plan is built specifically for you, your body, and your goals.
            </p>
            <p>
              From calorie tracking and personalized meal plans to comprehensive workout programs, every tool on this platform is designed with real coaching experience. We apply methods that work in both real training environments and client routines.
            </p>
            <p>
              Our mission is simple: to help you become the strongest, healthiest version of yourself. Whether you are a complete beginner or an experienced athlete, our coaches are here to guide you every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-green-600 transition-colors group">
                <value.icon className="w-8 h-8 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coach Profile Section */}
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Meet Our Coaches</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <div key={coach.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-600 transition-colors group">
              <img 
                src={coach.image}
                alt={coach.name}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{coach.name}</h3>
                <p className="text-green-600 font-semibold mb-3 text-sm">{coach.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{coach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 py-16">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            To empower individuals to achieve their fitness goals through personalized coaching, innovative tools, and dedicated support that celebrates every victory along the journey.
          </p>
          <a href="/coaching" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Start Your Journey
          </a>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="border border-gray-200 rounded-2xl p-12 text-center bg-white">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Transform?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you are just starting out or looking to take your fitness to the next level, our coaches are here to support you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/coaching" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Get Started Today
            </a>
            <a href="/workout-plans" className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Explore Programs
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AboutPage
