import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CalorieTrackerPage from './pages/CalorieTrackerPage'
import WorkoutPlansPage from './pages/WorkoutPlansPage'
import MealPlansPage from './pages/MealPlansPage'
import CoachingPage from './pages/CoachingPage'
import AboutPage from './pages/AboutPage'
import PoseCorrectionPage from './pages/PoseCorrectionPage'
import RecommenderPage from './pages/RecommenderPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calorie-tracker" element={<CalorieTrackerPage />} />
        <Route path="/workout-plans" element={<WorkoutPlansPage />} />
        <Route path="/meal-plans" element={<MealPlansPage />} />
        <Route path="/coaching" element={<CoachingPage />} />
        <Route path="/pose-correction" element={<PoseCorrectionPage />} />
        <Route path="/recommender" element={<RecommenderPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  )
}

export default App
