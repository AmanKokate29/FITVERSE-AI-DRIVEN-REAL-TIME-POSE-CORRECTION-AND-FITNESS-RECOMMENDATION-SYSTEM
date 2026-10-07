"""
Exercise Engine - Hareket motorunu kullanmak için yüksek seviye API

Bu modül, BaseExercise sınıfını frame işleme döngüsünde
kolayca kullanılabilir hale getirir.
"""

import cv2
import numpy as np
from typing import Dict, Optional, Tuple, List, Any

from exercises.base_exercise import BaseExercise, BilateralExercise, DurationExercise
from exercises.loader import load_exercise, get_exercise_info, get_available_exercises
from utils.draw_text_with_background import draw_text_with_background


class ExerciseEngine:
    """
    Egzersiz motoru - frame işleme ve görselleştirme için ana sınıf.
    
    Kullanım:
        engine = ExerciseEngine()
        engine.set_exercise("squat")
        
        # Frame döngüsünde:
        result = engine.process_frame(frame, landmarks)
    """
    
    def __init__(self):
        self.exercise: Optional[BaseExercise] = None
        self.exercise_name: str = None
        self._exercise_info: Dict = {}
        
    def set_exercise(self, exercise_name: str) -> bool:
        """
        Aktif egzersizi ayarla.
        
        Args:
            exercise_name: Egzersiz adı (örn: "squat")
            
        Returns:
            Başarılı ise True
        """
        try:
            self.exercise = load_exercise(exercise_name)
            self.exercise_name = exercise_name
            self._exercise_info = get_exercise_info(exercise_name)
            return True
        except Exception as e:
            print(f"Failed to load exercise '{exercise_name}': {e}")
            return False
    
    def reset(self):
        """Mevcut egzersizi sıfırla."""
        if self.exercise:
            self.exercise.reset()
    
    def process_frame(self, frame: np.ndarray, landmarks) -> Dict[str, Any]:
        """
        Frame'i işle ve egzersiz verilerini güncelle.
        
        Args:
            frame: OpenCV frame (BGR)
            landmarks: MediaPipe pose landmarks
            
        Returns:
            İşlem sonuçları dict'i
        """
        if not self.exercise or not landmarks:
            return {"success": False, "error": "No exercise or landmarks"}
        
        frame_shape = frame.shape[:2]  # (height, width)
        
        result = {
            "success": True,
            "exercise_name": self.exercise_name,
            "counter": 0,
            "state": None,
            "angles": {},
            "feedback": [],
            "counted": False
        }
        
        try:
            # Bilateral (çift taraflı) egzersiz mi?
            if isinstance(self.exercise, BilateralExercise):
                result = self._process_bilateral(frame, landmarks, frame_shape, result)
            
            # Duration (süre bazlı) egzersiz mi?
            elif isinstance(self.exercise, DurationExercise):
                result = self._process_duration(frame, landmarks, frame_shape, result)
            
            # Normal egzersiz
            else:
                result = self._process_standard(frame, landmarks, frame_shape, result)
            
            # Görselleştirme
            self._draw_visualization(frame, landmarks, frame_shape)
            self._draw_feedback(frame, result["feedback"])
            
        except Exception as e:
            result["success"] = False
            result["error"] = str(e)
            print(f"Exercise processing error: {e}")
        
        return result
    
    def _process_standard(self, frame, landmarks, frame_shape, result):
        """Standart tekrar bazlı egzersiz işleme."""
        # Tüm açıları hesapla
        self.exercise.compute_all_angles(landmarks, frame_shape)
        
        # Context oluştur
        context = self.exercise.get_context(landmarks, frame_shape)
        
        # State güncelle
        prev_state = self.exercise.current_state
        self.exercise.update_state(context)
        
        # Rep tracking başlat (descent başladığında)
        if prev_state == "start" and self.exercise.current_state == "descent":
            self.exercise.start_rep_tracking()
        
        # Sayacı güncelle
        counted = self.exercise.update_counter()
        
        # Feedback kontrol
        feedback = self.exercise.check_feedback(context)
        
        # FORM SCORE hesapla
        form_score = self.exercise.calculate_form_score(context, feedback)
        
        # Rep tamamlandıysa tracking bitir
        if counted:
            self.exercise.end_rep_tracking()
        
        # Sonuçları doldur
        result.update({
            "counter": self.exercise.counter,
            "state": self.exercise.current_state,
            "angles": self.exercise._computed_angles.copy(),
            "feedback": feedback,
            "counted": counted,
            "form_score": form_score,
            "avg_form_score": self.exercise.avg_form_score,
            "form_grade": self.exercise.get_form_score_grade()
        })
        
        return result
    
    def _process_bilateral(self, frame, landmarks, frame_shape, result):
        """Bilateral egzersiz işleme."""
        exercise: BilateralExercise = self.exercise
        
        # Her iki taraf için açıları hesapla
        exercise.compute_bilateral_angles(landmarks, frame_shape)
        
        # Context oluştur
        context = exercise.get_context(landmarks, frame_shape)
        context["left_angle"] = exercise._computed_angles.get("left_angle", 0)
        context["right_angle"] = exercise._computed_angles.get("right_angle", 0)
        
        # Her iki taraf için state güncelle
        exercise.update_bilateral_state(context)
        
        # Sayaçları güncelle
        left_counted, right_counted = exercise.update_bilateral_counter()
        
        # Feedback kontrol
        context["counter_left"] = exercise.counter_left
        context["counter_right"] = exercise.counter_right
        feedback = []
        seen_feedback = set()

        def collect_feedback(feedback_context):
            for item in exercise.check_feedback(feedback_context):
                key = (item.get("name"), item.get("message"), item.get("severity"))
                if key not in seen_feedback:
                    seen_feedback.add(key)
                    feedback.append(item)

        left_feedback_context = context.copy()
        left_feedback_context["angle"] = left_feedback_context.get("left_angle", 0)
        collect_feedback(left_feedback_context)

        right_feedback_context = context.copy()
        right_feedback_context["angle"] = right_feedback_context.get("right_angle", 0)
        collect_feedback(right_feedback_context)
        
        # Sonuçları doldur
        result.update({
            "counter": exercise.counter,
            "counter_left": exercise.counter_left,
            "counter_right": exercise.counter_right,
            "state_left": exercise.current_state_left,
            "state_right": exercise.current_state_right,
            "angles": exercise._computed_angles.copy(),
            "feedback": feedback,
            "counted": left_counted or right_counted
        })
        
        return result
    
    def _process_duration(self, frame, landmarks, frame_shape, result):
        """Duration egzersiz işleme."""
        exercise: DurationExercise = self.exercise
        
        # Açıları hesapla
        exercise.compute_all_angles(landmarks, frame_shape)
        
        # Context oluştur
        context = exercise.get_context(landmarks, frame_shape)
        
        # Süreyi güncelle (bu aynı zamanda state'i de günceller)
        current_duration = exercise.update_duration(context)
        
        # Feedback kontrol
        feedback = exercise.check_feedback(context)
        
        # Sonuçları doldur
        result.update({
            "counter": exercise.counter,
            "state": exercise.current_state,
            "current_duration": current_duration,
            "target_duration": exercise.target_duration,
            "is_holding": exercise.is_holding,
            "angles": exercise._computed_angles.copy(),
            "feedback": feedback
        })
        
        return result
    
    def _draw_visualization(self, frame, landmarks, frame_shape):
        """Egzersiz görselleştirmesi çiz."""
        if not self.exercise:
            return
        
        viz_config = self.exercise.get_visualization_config()
        
        # Çizgileri çiz
        for line in viz_config.get("lines", []):
            points = line["points"]
            color = tuple(line.get("color", [0, 255, 0]))
            thickness = line.get("thickness", 2)
            
            try:
                p1 = self.exercise.get_landmark_coords(landmarks, points[0], frame_shape)
                p2 = self.exercise.get_landmark_coords(landmarks, points[1], frame_shape)
                cv2.line(frame, p1, p2, color, thickness, lineType=cv2.LINE_AA)
            except:
                pass
        
        # Daireleri çiz
        for circle in viz_config.get("circles", []):
            point = circle["point"]
            color = tuple(circle.get("color", [0, 255, 0]))
            radius = circle.get("radius", 5)
            
            try:
                center = self.exercise.get_landmark_coords(landmarks, point, frame_shape)
                cv2.circle(frame, center, radius, color, -1)
            except:
                pass
        
        # Açı metinlerini çiz
        for angle_display in viz_config.get("angle_display", []):
            angle_name = angle_display["angle"]
            position_point = angle_display["position"]
            offset = angle_display.get("offset", [10, -10])
            label = angle_display.get("label", "Angle")
            
            try:
                pos = self.exercise.get_landmark_coords(landmarks, position_point, frame_shape)
                angle_value = self.exercise._computed_angles.get(angle_name, 0)
                text = f"{label}: {int(angle_value)}"
                text_pos = (pos[0] + offset[0], pos[1] + offset[1])
                cv2.putText(frame, text, text_pos, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
            except:
                pass
    
    def _draw_feedback(self, frame, feedback_list):
        """Feedback mesajlarını çiz."""
        y_offset = frame.shape[0] - 100  # Alt kısımdan başla
        
        for fb in feedback_list:
            message = fb["message"]
            severity = fb.get("severity", "warning")
            
            # Severity'ye göre renk
            if severity == "error":
                bg_color = (0, 0, 200)
            elif severity == "warning":
                bg_color = (0, 165, 255)
            else:  # info
                bg_color = (200, 200, 0)
            
            draw_text_with_background(
                frame, message, (20, y_offset),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), bg_color, 1
            )
            y_offset -= 35
    
    def draw_status_overlay(self, frame, exercise_goal: int = 10, sets_goal: int = 3, 
                           sets_completed: int = 0):
        """
        Durum overlay'ini çiz (sayaç, set, hedef vs).
        
        Args:
            frame: OpenCV frame
            exercise_goal: Hedef tekrar sayısı
            sets_goal: Hedef set sayısı
            sets_completed: Tamamlanan set sayısı
        """
        if not self.exercise:
            return
        
        info = self._exercise_info
        
        # Egzersiz adı
        draw_text_with_background(
            frame, f"Exercise: {info.get('name', self.exercise_name)}", 
            (40, 50), cv2.FONT_HERSHEY_DUPLEX, 0.7, 
            (255, 255, 255), (118, 29, 14), 1
        )
        
        # Hedef tekrar
        draw_text_with_background(
            frame, f"Reps Goal: {exercise_goal}", 
            (40, 80), cv2.FONT_HERSHEY_DUPLEX, 0.7, 
            (255, 255, 255), (118, 29, 14), 1
        )
        
        # Hedef set
        draw_text_with_background(
            frame, f"Sets Goal: {sets_goal}", 
            (40, 110), cv2.FONT_HERSHEY_DUPLEX, 0.7, 
            (255, 255, 255), (118, 29, 14), 1
        )
        
        # Mevcut set
        draw_text_with_background(
            frame, f"Current Set: {sets_completed + 1}", 
            (40, 140), cv2.FONT_HERSHEY_DUPLEX, 0.7, 
            (255, 255, 255), (118, 29, 14), 1
        )
        
        # Sayaç
        counter = self.exercise.counter
        draw_text_with_background(
            frame, f"Count: {counter}", 
            (40, 200), cv2.FONT_HERSHEY_SIMPLEX, 1.0, 
            (0, 0, 0), (192, 192, 192), 2
        )
        
        # Stage
        state = self.exercise.current_state or "Ready"
        draw_text_with_background(
            frame, f"Stage: {state.title() if state else 'Ready'}", 
            (40, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.7, 
            (0, 0, 0), (192, 192, 192), 1
        )
        
        # Bilateral için ek bilgi
        if isinstance(self.exercise, BilateralExercise):
            draw_text_with_background(
                frame, f"Left: {self.exercise.counter_left} | Right: {self.exercise.counter_right}", 
                (40, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.7, 
                (0, 0, 0), (192, 192, 192), 1
            )
        
        # Duration için ek bilgi
        if isinstance(self.exercise, DurationExercise):
            duration = int(self.exercise.current_duration)
            target = self.exercise.target_duration
            draw_text_with_background(
                frame, f"Hold: {duration}/{target}s", 
                (40, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.7, 
                (0, 0, 0), (192, 192, 192), 1
            )
    
    def draw_form_score(self, frame):
        """
        Form Score göstergesini çiz.
        
        Sağ üst köşede büyük bir skor gösterir.
        """
        if not self.exercise:
            return
        
        score = self.exercise.current_form_score
        grade = self.exercise.get_form_score_grade()
        color = self.exercise.get_form_score_color()
        avg_score = self.exercise.avg_form_score
        
        # Frame boyutları
        h, w = frame.shape[:2]
        
        # Sağ üst köşe pozisyonu
        x_pos = w - 180
        y_pos = 50
        
        # Arka plan çiz
        cv2.rectangle(frame, (x_pos - 10, y_pos - 40), (w - 10, y_pos + 100), (50, 50, 50), -1)
        cv2.rectangle(frame, (x_pos - 10, y_pos - 40), (w - 10, y_pos + 100), color, 2)
        
        # "FORM SCORE" başlığı
        cv2.putText(frame, "FORM SCORE", (x_pos, y_pos - 15), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
        
        # Büyük skor
        cv2.putText(frame, f"{score}", (x_pos + 20, y_pos + 45), 
                   cv2.FONT_HERSHEY_SIMPLEX, 2.0, color, 3)
        
        # Grade (harf notu)
        cv2.putText(frame, grade, (x_pos + 110, y_pos + 45), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1.5, color, 2)
        
        # Ortalama skor
        cv2.putText(frame, f"Avg: {avg_score}", (x_pos, y_pos + 80), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
        
        # Progress bar
        bar_width = 150
        bar_height = 8
        bar_x = x_pos
        bar_y = y_pos + 90
        
        # Arka plan bar
        cv2.rectangle(frame, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), (100, 100, 100), -1)
        
        # Dolu kısım
        fill_width = int((score / 100) * bar_width)
        cv2.rectangle(frame, (bar_x, bar_y), (bar_x + fill_width, bar_y + bar_height), color, -1)
    
    def get_counter(self) -> int:
        """Mevcut sayacı al."""
        if self.exercise:
            return self.exercise.counter
        return 0
    
    def get_status(self) -> Dict[str, Any]:
        """Mevcut durumu al."""
        if self.exercise:
            return self.exercise.get_status()
        return {}
    
    @staticmethod
    def list_exercises() -> List[str]:
        """Mevcut egzersizleri listele."""
        return get_available_exercises()
    
    @staticmethod
    def get_info(exercise_name: str) -> Dict:
        """Egzersiz bilgilerini al."""
        return get_exercise_info(exercise_name)
