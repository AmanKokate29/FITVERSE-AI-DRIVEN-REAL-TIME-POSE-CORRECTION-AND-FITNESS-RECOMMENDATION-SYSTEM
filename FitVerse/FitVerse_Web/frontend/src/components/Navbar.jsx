import { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setIsPremiumOpen(false)
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/calorie-tracker', label: 'Nutrition Finder' },
    { to: '/workout-plans', label: 'Workouts' },
    { to: '/meal-plans', label: 'Meal Plans' },
    { to: '/coaching', label: 'Coaching' },
  ]

  const premiumLinks = [
    { to: '/pose-correction', label: 'Pose Correction' },
    { to: '/recommender', label: 'Workout and Diet Recommender' },
  ]

  const trailingLinks = [
    { to: '/about', label: 'About' },
  ]

  const isActive = (path) => location.pathname === path
  const isPremiumActive = premiumLinks.some((link) => isActive(link.to))

  return (
    <nav className="bg-black/85 backdrop-blur-md shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand Text */}
          <Link to="/" className="flex items-center h-16 sm:h-20 group">
            <div className="flex items-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wide italic">FIT</span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-green-400 to-green-400 bg-clip-text text-transparent tracking-wide">VERSE</span>
            </div>
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-6 w-16 sm:w-20 h-0.5 bg-gradient-to-r from-green-400 to-transparent rounded-full"></div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-md font-medium transition-all duration-200 text-sm xl:text-base ${
                  isActive(link.to)
                    ? 'text-green-400'
                    : 'text-gray-300 hover:text-green-400 hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></span>
                )}
              </Link>
            ))}

            <div className="relative group">
              <button
                type="button"
                className={`relative px-3 py-2 rounded-md font-medium transition-all duration-200 text-sm xl:text-base inline-flex items-center gap-1 ${
                  isPremiumActive
                    ? 'text-green-400'
                    : 'text-gray-300 hover:text-green-400 hover:bg-white/5'
                }`}
              >
                Premium Features
                <ChevronDown className="h-4 w-4" />
                {isPremiumActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></span>
                )}
              </button>

              <div className="absolute left-0 top-full mt-2 w-52 bg-black/95 border border-gray-800 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {premiumLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      isActive(link.to)
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-gray-300 hover:text-green-400 hover:bg-gray-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {trailingLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-md font-medium transition-all duration-200 text-sm xl:text-base ${
                  isActive(link.to)
                    ? 'text-green-400'
                    : 'text-gray-300 hover:text-green-400 hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-gray-300 hover:text-green-400 p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-800 bg-black/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-green-400 bg-green-400/10 border-l-2 border-green-400'
                      : 'text-gray-300 hover:text-green-400 hover:bg-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => setIsPremiumOpen(!isPremiumOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isPremiumActive
                    ? 'text-green-400 bg-green-400/10 border-l-2 border-green-400'
                    : 'text-gray-300 hover:text-green-400 hover:bg-gray-900'
                }`}
              >
                <span>Premium Features</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isPremiumOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPremiumOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-2">
                  {premiumLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => {
                        setIsOpen(false)
                        setIsPremiumOpen(false)
                      }}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(link.to)
                          ? 'text-green-400 bg-green-400/10'
                          : 'text-gray-300 hover:text-green-400 hover:bg-gray-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              {trailingLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-green-400 bg-green-400/10 border-l-2 border-green-400'
                      : 'text-gray-300 hover:text-green-400 hover:bg-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
