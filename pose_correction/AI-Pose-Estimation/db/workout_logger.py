import json
import os
from datetime import datetime, timedelta

class WorkoutLogger:
    def __init__(self, db_file='db/workouts.json'):
        self.db_file = db_file
        self.workouts = []
        self._load_data()
    
    def _load_data(self):
        """Load workouts from JSON file"""
        if os.path.exists(self.db_file):
            try:
                with open(self.db_file, 'r') as f:
                    self.workouts = json.load(f)
            except:
                self.workouts = []
    
    def _save_data(self):
        """Save workouts to JSON file"""
        os.makedirs(os.path.dirname(self.db_file), exist_ok=True)
        with open(self.db_file, 'w') as f:
            json.dump(self.workouts, f, indent=2)
    
    def log_workout(self, exercise_type, sets, reps, duration_seconds, form_score=None):
        """Log a new workout session"""
        workout = {
            'date': datetime.now().strftime('%Y-%m-%d %H:%M'),
            'exercise_type': exercise_type,
            'sets': sets,
            'reps': reps,
            'duration_seconds': duration_seconds,
            'form_score': form_score,
            'timestamp': datetime.now().isoformat()
        }
        self.workouts.append(workout)
        self._save_data()
        return workout
    
    def get_recent_workouts(self, limit=10):
        """Get recent workouts"""
        return sorted(self.workouts, key=lambda x: x.get('timestamp', ''), reverse=True)[:limit]
    
    def get_weekly_stats(self):
        """Get weekly statistics"""
        today = datetime.now().date()
        stats = {}
        for i in range(7):
            day = today - timedelta(days=i)
            day_name = day.strftime('%a').lower()
            day_workouts = [w for w in self.workouts if w.get('timestamp', '').startswith(day.isoformat())]
            stats[day_name] = {
                'workout_count': len(day_workouts),
                'total_duration': sum(w.get('duration_seconds', 0) for w in day_workouts)
            }
        return stats
    
    def get_exercise_distribution(self):
        """Get exercise distribution"""
        dist = {}
        for w in self.workouts:
            exercise = w.get('exercise_type', 'unknown')
            dist[exercise] = dist.get(exercise, 0) + 1
        return dist
    
    def get_user_stats(self):
        """Get user statistics"""
        today = datetime.now().date()
        today_str = today.isoformat()
        
        # Count workouts today
        today_workouts = [w for w in self.workouts if w.get('timestamp', '').startswith(today_str)]
        
        return {
            'total_workouts': len(self.workouts),
            'total_exercises': sum(w.get('reps', 0) * w.get('sets', 0) for w in self.workouts),
            'streak_days': self._calculate_streak(),
            'daily_sessions': len(today_workouts)
        }
    
    def _calculate_streak(self):
        """Calculate current streak of consecutive days with workouts"""
        if not self.workouts:
            return 0
        
        # Get unique workout dates
        dates = set()
        for w in self.workouts:
            if 'timestamp' in w:
                date = w['timestamp'][:10]
                dates.add(date)
        
        if not dates:
            return 0
        
        dates = sorted(dates, reverse=True)
        today = datetime.now().date().isoformat()
        
        streak = 0
        current_date = datetime.now().date()
        
        for date_str in dates:
            date = datetime.fromisoformat(date_str).date()
            if date == current_date:
                streak += 1
                current_date -= timedelta(days=1)
            elif date == current_date - timedelta(days=1):
                streak += 1
                current_date -= timedelta(days=1)
            else:
                break
        
        return streak