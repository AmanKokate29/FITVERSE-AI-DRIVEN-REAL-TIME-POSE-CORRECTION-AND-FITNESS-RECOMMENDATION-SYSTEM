import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Target, Calendar, CheckCircle, Send, Loader2 } from 'lucide-react'

function CoachingPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    fitnessLevel: '',
    fitnessGoal: '',
    preferredTime: '',
    additionalInfo: '',
  })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    const body = new FormData()
    body.append('entry.1231231068', formData.fullName)
    body.append('entry.958619376', formData.email)
    body.append('entry.1957091212', formData.phone)
    body.append('entry.178512116', formData.fitnessLevel)
    body.append('entry.62809357', formData.fitnessGoal)
    body.append('entry.610765752', formData.preferredTime)
    body.append('entry.100696879', formData.additionalInfo)

    try {
      await fetch(
        'https://docs.google.com/forms/d/e/1FAIpQLSe7ss9DofZqRej9jTg7IB4C9O9p9xM5CMRyL0carefVoUXN5g/formResponse',
        { method: 'POST', body, mode: 'no-cors' }
      )
      setStatus('success')
      setFormData({ fullName: '', email: '', phone: '', fitnessLevel: '', fitnessGoal: '', preferredTime: '', additionalInfo: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
  const selectClass = "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition appearance-none"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 sm:pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center py-10 sm:py-14 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-gray-50 border border-green-100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
              Personal Coaching & <span className="text-green-600">Consultation</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light px-6">
              Take your fitness journey to the next level with personalized coaching from me — your dedicated trainer
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Benefits */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose My Coaching?</h2>
            
            <div className="space-y-5">
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Personalized Programs</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Custom workout and nutrition plans tailored to your specific goals, fitness level, and lifestyle.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Expert Guidance</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Work directly with me — a certified trainer who provides ongoing support, motivation, and accountability.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Flexible Scheduling</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Choose between online and in-person sessions that fit your schedule and preferences.</p>
                </div>
              </div>
            </div>

            {/* Coaching Types */}
            <div className="mt-10 border border-gray-200 rounded-xl p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-5">Coaching Options</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm"><strong className="text-gray-900">1-on-1 Training:</strong> Individual attention and customized workouts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm"><strong className="text-gray-900">Online Coaching:</strong> Train from anywhere with virtual guidance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm"><strong className="text-gray-900">Nutrition Coaching:</strong> Personalized meal plans and dietary guidance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700 text-sm"><strong className="text-gray-900">Group Sessions:</strong> Train with others for motivation and fun</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Custom Form */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request a Consultation</h2>
              <p className="text-gray-500 text-sm mb-6">Fill out the form below and I'll get back to you within 24 hours.</p>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600 text-sm mb-6">Your consultation request has been submitted. I'll reach out to you soon.</p>
                  <button onClick={() => setStatus('idle')} className="text-green-600 font-medium text-sm hover:underline">
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Your full name" className={inputClass} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Your phone number" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Fitness Level <span className="text-red-500">*</span></label>
                      <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange} required className={selectClass}>
                        <option value="" disabled>Select level</option>
                        <option value="Beginner - New to fitness">Beginner</option>
                        <option value="Intermediate - Regular exerciser">Intermediate</option>
                        <option value="Advanced - Experienced athlete/Lifter">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Fitness Goal <span className="text-red-500">*</span></label>
                      <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange} required className={selectClass}>
                        <option value="" disabled>Select goal</option>
                        <option value="Fat Loss">Fat Loss</option>
                        <option value="Muscle Building">Muscle Building</option>
                        <option value="General Fitness">General Fitness</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Preferred Time for Contact <span className="text-red-500">*</span></label>
                    <select name="preferredTime" value={formData.preferredTime} onChange={handleChange} required className={selectClass}>
                      <option value="" disabled>Select time</option>
                      <option value="Morning (8am - 12pm)">Morning (8am - 12pm)</option>
                      <option value="Afternoon (12pm - 5pm)">Afternoon (12pm - 5pm)</option>
                      <option value="Evening (5pm - 8pm)">Evening (5pm - 8pm)</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Additional Information</label>
                    <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4} placeholder="Tell me about your goals, injuries, or anything else I should know..." className={inputClass + " resize-none"} />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3.5 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {status === 'submitting' ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Request Consultation</>
                    )}
                  </button>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-4 border-green-600 pl-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">How much does coaching cost?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Pricing varies based on the type of coaching and frequency. We'll discuss options during your free consultation call.</p>
            </div>
            <div className="border-l-4 border-green-600 pl-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Can I switch between online and in-person?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Yes! The hybrid coaching option allows flexibility to combine both online and in-person sessions.</p>
            </div>
            <div className="border-l-4 border-green-600 pl-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">What if I have injuries or limitations?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">I'm experienced in working with various limitations and will create a safe, effective program for you.</p>
            </div>
            <div className="border-l-4 border-green-600 pl-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">How long are coaching sessions?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Typical sessions are 45-60 minutes, but I can customize duration based on your needs and goals.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CoachingPage
