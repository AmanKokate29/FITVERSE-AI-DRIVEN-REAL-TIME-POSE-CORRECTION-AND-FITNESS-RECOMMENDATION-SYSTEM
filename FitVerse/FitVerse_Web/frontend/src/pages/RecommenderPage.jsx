import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function RecommenderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Workout and Diet Recommender</h1>
            <p className="text-gray-600 text-base sm:text-lg">This page is reserved for future development.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default RecommenderPage
