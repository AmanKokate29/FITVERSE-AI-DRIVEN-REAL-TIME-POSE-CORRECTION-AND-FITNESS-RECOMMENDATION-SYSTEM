import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Trainers from '../components/Trainers'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Trainers />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default HomePage
