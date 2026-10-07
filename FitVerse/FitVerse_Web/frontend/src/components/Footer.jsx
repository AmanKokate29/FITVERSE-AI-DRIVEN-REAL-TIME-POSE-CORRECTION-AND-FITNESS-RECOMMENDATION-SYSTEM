import { Mail, Phone, Instagram, Youtube, InstagramIcon } from 'lucide-react'

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-wide italic">FIT</span>
                <span className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-green-400 to-green-400 bg-clip-text text-transparent tracking-wide">VERSE</span>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm sm:text-base">
              Transform your body and mind with personalized fitness coaching by Sarah Johnson.
            </p>
            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button className="bg-gray-800 hover:bg-green-600 p-2 sm:p-3 rounded-full transition-colors">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="bg-gray-800 hover:bg-green-600 p-2 sm:p-3 rounded-full transition-colors">
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#home" className="text-gray-400 hover:text-green-600 transition-colors text-sm sm:text-base">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-green-600 transition-colors text-sm sm:text-base">
                  Services
                </a>
              </li>
              <li>
                <a href="#trainers" className="text-gray-400 hover:text-green-600 transition-colors text-sm sm:text-base">
                  Your Coach
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-green-600 transition-colors">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-3">
              <li className="text-gray-400">1-on-1 Coaching</li>
              <li className="text-gray-400">Online Training</li>
              <li className="text-gray-400">Nutrition Plans</li>
              <li className="text-gray-400">Home Workouts</li>
              <li className="text-gray-400">Transformation Programs</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Me</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <InstagramIcon className="h-5 w-5 text-red-600 mt-1" />
                <span className="text-gray-400">
                  @fitverse_hub_
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-100" />
                <span className="text-gray-400">
                  9021255748
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-100" />
                <span className="text-gray-400">
                  team.fitverse@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2026 FitVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
