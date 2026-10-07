import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  const images = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [images.length])

  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToSlide = (index) => {
    setCurrentImageIndex(index)
  }

  return (
    <section id="home" className="pt-16 sm:pt-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
    
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Transform Your
              <span className="text-green-600"> Body & Mind</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-1000 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              I'm Sarah Johnson — your dedicated fitness coach. Experience personalized training programs designed to help you achieve your fitness goals faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="/coaching" className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
                Start Your Journey
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
            
            {/* Brand Slogan */}
            <div className="pt-8 sm:pt-12">
              <div className="border-l-4 border-green-600 pl-4 sm:pl-6">
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold">
                  <span className="text-gray-900">Explore</span>
                  <span className="text-green-600">→</span>
                  <span className="text-gray-900">Train</span>
                  <span className="text-green-600">→</span>
                  <span className="text-gray-900">Transform</span>
                </div>
                <p className="text-center lg:text-left mt-3 text-sm sm:text-base font-bold text-gray-700 tracking-wider">
                  IN THE <span className="text-green-600">FITVERSE</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Content - Image Slideshow */}
          <div className="relative w-full max-w-md mx-auto lg:max-w-full">
            {/* Decorative border frame */}
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-green-200/40 via-emerald-100/20 to-transparent blur-sm hidden sm:block" />
            <div className="relative aspect-square rounded-2xl bg-gray-200 overflow-hidden shadow-xl ring-1 ring-gray-200/60">
              {/* Subtle gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5 z-[5] pointer-events-none" />

              {/* Images */}
              {images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Fitness Training ${index + 1}`} 
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    index === currentImageIndex 
                      ? 'translate-x-0 opacity-100' 
                      : index < currentImageIndex 
                        ? '-translate-x-full opacity-0' 
                        : 'translate-x-full opacity-0'
                  }`}
                />
              ))}

              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-200 z-10 hover:scale-105"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-200 z-10 hover:scale-105"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'w-6 bg-white' 
                        : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
