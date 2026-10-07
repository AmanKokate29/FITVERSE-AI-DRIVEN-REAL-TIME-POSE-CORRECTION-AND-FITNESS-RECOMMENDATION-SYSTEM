"""
BaseExercise - Core Exercise Engine

Bu sınıf tüm egzersizlerin temel motorudur.
Hareketler YAML dosyalarından yüklenir ve bu motor tarafından işlenir.

Features:
- Finite State Machine (FSM) ile hareket aşamaları
- Otomatik tekrar sayımı
- Gerçek zamanlı form geri bildirimi
- Kalibrasyon desteği
- Zaman filtreleme (yanlış sayımı önler)
"""

import numpy as np
import time
from typing import Dict, List, Optional, Tuple, Any


class BaseExercise:
    """
    Tüm egzersizler için temel sınıf.
    YAML konfigürasyonundan yüklenen hareket tanımlarını işler.
    """
    
    # MediaPipe landmark indeksleri
    LANDMARK_MAP = {
        # Yüz
        "nose": 0,
        # Omuzlar
        "left_shoulder": 11,
        "right_shoulder": 12,
        # Dirsekler
        "left_elbow": 13,
        "right_elbow": 14,
        # Bilekler
        "left_wrist": 15,
        "right_wrist": 16,
        # Kalçalar
        "left_hip": 23,
        "right_hip": 24,
        # Dizler
        "left_knee": 25,
        "right_knee": 26,
        # Ayak bilekleri
        "left_ankle": 27,
        "right_ankle": 28,
    }
    
    def __init__(self, config: Dict[str, Any]):
        """
        Exercise motorunu başlat.
        
        Args:
            config: YAML'dan yüklenen egzersiz konfigürasyonu
        """
        # Temel bilgiler
        self.name = config["name"]
        self.display_name = config.get("display_name", self.name.replace("_", " ").title())
        self.type = config.get("type", "repetition")  # repetition | duration
        
        # Açı tanımları
        self.angles = config.get("angles", {})
        
        # Durum makinesi (FSM)
        self.states = config.get("states", {})
        self.state_order = config.get("state_order", list(self.states.keys()))
        
        # Sayaç kuralları
        self.counter_rule = config.get("counter", {})
        
        # Geri bildirim kuralları
        self.feedback_rules = config.get("feedback", {})
        
        # Çizim ayarları
        self.visualization = config.get("visualization", {})
        
        # Durum değişkenleri
        self.current_state = None
        self.prev_state = None
        self.counter = 0
        self.counter_left = 0  # Çift taraflı hareketler için
        self.counter_right = 0
        
        # Zaman filtreleme
        self.last_count_time = 0
        self.min_rep_duration = config.get("min_rep_duration", 0.5)  # minimum saniye
        
        # Kalibrasyon
        self.calibration_enabled = config.get("calibration", {}).get("enabled", False)
        self.calibration_reps = config.get("calibration", {}).get("reps", 3)
        self.calibration_data = {"max_angles": [], "min_angles": []}
        self.is_calibrated = False
        
        # Smoothing
        self.smoothing_enabled = config.get("smoothing", {}).get("enabled", False)
        self.smoothing_window = config.get("smoothing", {}).get("window", 5)
        self.angle_history = []
        
        # Computed angles cache
        self._computed_angles = {}
        
        # ==================== FORM SCORE SYSTEM ====================
        # Form Score (0-100) hesaplama için değişkenler
        self.form_score_config = config.get("form_score", {})
        self.ideal_angles = self.form_score_config.get("ideal_angles", {})
        self.tempo_range = self.form_score_config.get("tempo_range", {"min": 1.0, "max": 3.0})
        
        # Rep tracking for form score
        self.rep_start_time = None
        self.rep_durations = []
        self.rep_form_scores = []
        self.current_form_score = 100
        self.avg_form_score = 100
        
        # Feedback penalty tracking
        self.active_feedback_count = 0
        self.latest_feedback = []
        
    def get_landmark_coords(self, landmarks, point_name: str, frame_shape: Tuple[int, int]) -> Tuple[int, int]:
        """
        Landmark adından piksel koordinatlarını al.
        
        Args:
            landmarks: MediaPipe pose landmarks
            point_name: Landmark adı (örn: "left_hip")
            frame_shape: Frame boyutları (height, width)
            
        Returns:
            (x, y) piksel koordinatları
        """
        idx = self.LANDMARK_MAP.get(point_name)
        if idx is None:
            raise ValueError(f"Unknown landmark: {point_name}")
        
        landmark = landmarks[idx]
        
        # Check visibility - skip if landmark is not visible
        if hasattr(landmark, 'visibility') and landmark.visibility < 0.5:
            raise ValueError(f"Landmark {point_name} not visible")
        
        x = int(landmark.x * frame_shape[1])
        y = int(landmark.y * frame_shape[0])
        return (x, y)
    
    def compute_angle(self, landmarks, angle_name: str, frame_shape: Tuple[int, int]) -> float:
        """
        Belirtilen açıyı hesapla.
        
        Args:
            landmarks: MediaPipe pose landmarks
            angle_name: Açı adı (config'deki angles altında tanımlı)
            frame_shape: Frame boyutları
            
        Returns:
            Derece cinsinden açı
        """
        angle_def = self.angles.get(angle_name)
        if not angle_def:
            raise ValueError(f"Undefined angle: {angle_name}")
        
        points = angle_def["points"]
        p1 = self.get_landmark_coords(landmarks, points[0], frame_shape)
        p2 = self.get_landmark_coords(landmarks, points[1], frame_shape)
        p3 = self.get_landmark_coords(landmarks, points[2], frame_shape)
        
        angle = self._angle_between(p1, p2, p3)
        
        # Smoothing uygula
        if self.smoothing_enabled:
            angle = self._smooth_angle(angle)
        
        # Cache'e kaydet
        self._computed_angles[angle_name] = angle
        
        return angle
    
    def compute_all_angles(self, landmarks, frame_shape: Tuple[int, int]) -> Dict[str, float]:
        """Tüm tanımlı açıları hesapla."""
        self._computed_angles = {}
        for angle_name in self.angles.keys():
            try:
                self.compute_angle(landmarks, angle_name, frame_shape)
            except ValueError as e:
                # Skip this angle if landmarks not visible
                print(f"Skipping angle {angle_name}: {e}")
                continue
            except Exception as e:
                print(f"Error computing angle {angle_name}: {e}")
                continue
        return self._computed_angles
    
    def get_context(self, landmarks, frame_shape: Tuple[int, int]) -> Dict[str, Any]:
        """
        Durum değerlendirmesi için context oluştur.
        
        Args:
            landmarks: MediaPipe pose landmarks
            frame_shape: Frame boyutları
            
        Returns:
            Tüm açılar ve landmark koordinatlarını içeren dict
        """
        context = {}
        
        # Tüm açıları ekle
        for angle_name, angle_value in self._computed_angles.items():
            context[f"{angle_name}_angle"] = angle_value
            # Kısa erişim için "angle" key'i de ekle (primary için)
            if angle_name == "primary":
                context["angle"] = angle_value
        
        # Landmark koordinatlarını ekle
        for point_name, idx in self.LANDMARK_MAP.items():
            try:
                coords = self.get_landmark_coords(landmarks, point_name, frame_shape)
                context[f"{point_name}_x"] = coords[0]
                context[f"{point_name}_y"] = coords[1]
            except:
                pass
        
        return context
    
    def update_state(self, context: Dict[str, Any]) -> str:
        """
        Mevcut durumu güncelle (FSM).
        
        Args:
            context: Açılar ve koordinatları içeren dict
            
        Returns:
            Yeni durum adı
        """
        self.prev_state = self.current_state
        
        # If no valid angles computed, keep previous state or use default
        if not self._computed_angles or not context.get('angle'):
            if self.current_state is None:
                self.current_state = 'start'
            return self.current_state
        
        # State order'a göre kontrol et (öncelik sırası)
        state_matched = False
        for state_name in self.state_order:
            state_def = self.states.get(state_name, {})
            condition = state_def.get("condition", "False")
            
            # Güvenli eval
            try:
                if self._safe_eval(condition, context):
                    self.current_state = state_name
                    state_matched = True
                    break
            except Exception as e:
                print(f"State condition error ({state_name}): {e}")
        
        # Fallback: If no state matched, use 'start' as default
        if not state_matched:
            self.current_state = 'start'
        
        return self.current_state
    
    def update_counter(self) -> bool:
        """
        Sayacı güncelle.
        
        Returns:
            Sayaç artırıldıysa True
        """
        trigger_state = self.counter_rule.get("trigger_state")
        from_state = self.counter_rule.get("from_state")  # Opsiyonel: hangi state'den gelmiş olmalı
        
        # State değişimi kontrolü
        state_changed = self.prev_state != self.current_state
        reached_trigger = self.current_state == trigger_state
        
        # from_state belirtilmişse kontrol et
        from_valid = True
        if from_state:
            from_valid = self.prev_state == from_state
        
        # Zaman filtresi
        current_time = time.time()
        time_valid = (current_time - self.last_count_time) >= self.min_rep_duration
        
        if state_changed and reached_trigger and from_valid and time_valid:
            self.counter += 1
            self.last_count_time = current_time
            
            # Kalibrasyon verisi topla
            if self.calibration_enabled and not self.is_calibrated:
                self._collect_calibration_data()
            
            return True
        
        return False
    
    def check_feedback(self, context: Dict[str, Any]) -> List[str]:
        """
        Form geri bildirimlerini kontrol et.
        
        Args:
            context: Açılar ve koordinatları içeren dict
            
        Returns:
            Uyarı mesajları listesi
        """
        messages = []
        
        for feedback_name, feedback_def in self.feedback_rules.items():
            condition = feedback_def.get("condition", "False")
            message = feedback_def.get("message", "Form uyarısı")
            severity = feedback_def.get("severity", "warning")  # warning | error | info
            
            try:
                if self._safe_eval(condition, context):
                    messages.append({
                        "name": feedback_name,
                        "message": message,
                        "severity": severity
                    })
            except Exception as e:
                print(f"Feedback condition error ({feedback_name}): {e}")
        
        return messages
    
    def get_visualization_config(self) -> Dict[str, Any]:
        """Görselleştirme ayarlarını döndür."""
        return self.visualization
    
    # ==================== FORM SCORE METHODS ====================
    
    def calculate_form_score(self, context: Dict[str, Any], feedback_list: List[Dict]) -> int:
        """
        Form skorunu hesapla (0-100).
        
        Skor bileşenleri:
        - Açı doğruluğu (40 puan)
        - Tempo/hız (30 puan)
        - Form hataları (30 puan)
        
        Args:
            context: Mevcut açılar ve koordinatlar
            feedback_list: Aktif feedback mesajları
            
        Returns:
            0-100 arası form skoru
        """
        score = 100
        
        # 1. AÇI DOĞRULUĞU (40 puan max penalty)
        angle_penalty = self._calculate_angle_penalty(context)
        score -= min(angle_penalty, 40)
        
        # 2. TEMPO PENALTY (30 puan max penalty)
        tempo_penalty = self._calculate_tempo_penalty()
        score -= min(tempo_penalty, 30)
        
        # 3. FORM HATALARI (30 puan max penalty)
        # Her feedback -10 puan
        feedback_penalty = len(feedback_list) * 10
        score -= min(feedback_penalty, 30)
        
        # Skor 0-100 aralığında kalsın
        score = max(0, min(100, score))
        
        self.current_form_score = score
        self.active_feedback_count = len(feedback_list)
        self.latest_feedback = [fb.get('message', '') for fb in feedback_list if fb.get('message')]
        
        return score
    
    def _calculate_angle_penalty(self, context: Dict[str, Any]) -> int:
        """Açı sapmasına göre penalty hesapla."""
        if not self.ideal_angles:
            return 0
        
        total_deviation = 0
        count = 0
        
        for angle_name, ideal_value in self.ideal_angles.items():
            current_value = context.get(f"{angle_name}_angle") or context.get("angle", 0)
            if current_value:
                deviation = abs(current_value - ideal_value)
                # Her 10 derece sapma = 5 puan penalty
                total_deviation += (deviation / 10) * 5
                count += 1
        
        if count > 0:
            return int(total_deviation / count)
        return 0
    
    def _calculate_tempo_penalty(self) -> int:
        """Tempo/hız penalty hesapla."""
        if not self.rep_durations:
            return 0
        
        last_duration = self.rep_durations[-1] if self.rep_durations else 0
        min_tempo = self.tempo_range.get("min", 1.0)
        max_tempo = self.tempo_range.get("max", 3.0)
        
        if last_duration < min_tempo:
            # Çok hızlı - her 0.5 saniye = 15 puan penalty
            return int((min_tempo - last_duration) / 0.5 * 15)
        elif last_duration > max_tempo:
            # Çok yavaş - her 1 saniye = 10 puan penalty
            return int((last_duration - max_tempo) * 10)
        
        return 0
    
    def start_rep_tracking(self):
        """Rep başlangıç zamanını kaydet."""
        self.rep_start_time = time.time()
    
    def end_rep_tracking(self):
        """Rep süresini kaydet ve form score'u güncelle."""
        if self.rep_start_time:
            duration = time.time() - self.rep_start_time
            self.rep_durations.append(duration)
            self.rep_start_time = None
            
            # Son rep'in form score'unu kaydet
            self.rep_form_scores.append(self.current_form_score)
            
            # Ortalama form score'u güncelle
            if self.rep_form_scores:
                self.avg_form_score = int(sum(self.rep_form_scores) / len(self.rep_form_scores))
    
    def get_form_score_grade(self, score: int = None) -> str:
        """Form score'dan harf notu al."""
        if score is None:
            score = self.current_form_score
        
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"
    
    def get_form_score_color(self, score: int = None) -> Tuple[int, int, int]:
        """Form score'a göre renk döndür (BGR)."""
        if score is None:
            score = self.current_form_score
        
        if score >= 90:
            return (0, 255, 0)      # Yeşil
        elif score >= 80:
            return (0, 255, 255)    # Sarı
        elif score >= 70:
            return (0, 165, 255)    # Turuncu
        elif score >= 60:
            return (0, 100, 255)    # Koyu turuncu
        else:
            return (0, 0, 255)      # Kırmızı
    
    def reset(self):
        """Egzersizi sıfırla."""
        self.current_state = None
        self.prev_state = None
        self.counter = 0
        self.counter_left = 0
        self.counter_right = 0
        self.last_count_time = 0
        self.angle_history = []
        self._computed_angles = {}
        # Form score reset
        self.rep_start_time = None
        self.rep_durations = []
        self.rep_form_scores = []
        self.current_form_score = 100
        self.avg_form_score = 100
        self.active_feedback_count = 0
        self.latest_feedback = []
    
    def get_status(self) -> Dict[str, Any]:
        """Mevcut durumu döndür."""
        return {
            "name": self.name,
            "display_name": self.display_name,
            "counter": self.counter,
            "current_state": self.current_state,
            "angles": self._computed_angles.copy(),
            "is_calibrated": self.is_calibrated,
            "form_score": self.current_form_score,
            "avg_form_score": self.avg_form_score,
            "form_grade": self.get_form_score_grade(),
            "feedback": self._generate_feedback()
        }
    
    def _generate_feedback(self) -> List[str]:
        """Mevcut feedback mesajlarını döndür."""
        return self.latest_feedback.copy() if hasattr(self, 'latest_feedback') else []
    
    # ==================== Private Methods ====================
    
    @staticmethod
    def _angle_between(a: Tuple[int, int], b: Tuple[int, int], c: Tuple[int, int]) -> float:
        """
        Üç nokta arasındaki açıyı hesapla (b köşe noktası).
        
        Args:
            a, b, c: (x, y) koordinatları
            
        Returns:
            Derece cinsinden açı
        """
        ba = np.array(a) - np.array(b)
        bc = np.array(c) - np.array(b)
        
        cos_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
        angle = np.degrees(np.arccos(np.clip(cos_angle, -1.0, 1.0)))
        
        return angle
    
    def _smooth_angle(self, angle: float) -> float:
        """Moving average ile açı smoothing."""
        self.angle_history.append(angle)
        if len(self.angle_history) > self.smoothing_window:
            self.angle_history.pop(0)
        return np.mean(self.angle_history)
    
    def _safe_eval(self, condition: str, context: Dict[str, Any]) -> bool:
        """
        Güvenli koşul değerlendirmesi.
        Sadece izin verilen operatörleri kullanır.
        """
        # İzin verilen isimler
        allowed_names = {
            "True": True,
            "False": False,
            "abs": abs,
            "min": min,
            "max": max,
        }
        allowed_names.update(context)
        
        # Tehlikeli yapıları kontrol et
        dangerous = ["import", "exec", "eval", "__", "open", "file", "os", "sys"]
        for d in dangerous:
            if d in condition:
                raise ValueError(f"Unsafe condition: {condition}")
        
        return eval(condition, {"__builtins__": {}}, allowed_names)
    
    def _collect_calibration_data(self):
        """Kalibrasyon verisi topla."""
        if "primary" in self._computed_angles:
            angle = self._computed_angles["primary"]
            
            if self.current_state in ["down", "bottom"]:
                self.calibration_data["min_angles"].append(angle)
            elif self.current_state in ["up", "top", "start"]:
                self.calibration_data["max_angles"].append(angle)
            
            # Yeterli veri toplandıysa kalibre et
            if (len(self.calibration_data["min_angles"]) >= self.calibration_reps and
                len(self.calibration_data["max_angles"]) >= self.calibration_reps):
                self._apply_calibration()
    
    def _apply_calibration(self):
        """Kalibrasyon verilerini uygula."""
        avg_min = np.mean(self.calibration_data["min_angles"])
        avg_max = np.mean(self.calibration_data["max_angles"])
        
        # State eşiklerini güncelle (basit yaklaşım)
        # Daha gelişmiş: YAML'daki formülleri dinamik güncelle
        print(f"[Calibration] {self.name}: min_angle={avg_min:.1f}, max_angle={avg_max:.1f}")
        
        self.is_calibrated = True


class BilateralExercise(BaseExercise):
    """
    Çift taraflı egzersizler için genişletilmiş sınıf.
    Örn: Hammer Curl (sağ ve sol kol ayrı sayılır)
    """
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        
        # Çift taraflı ayarlar
        self.bilateral = config.get("bilateral", False)
        self.sides = config.get("sides", ["left", "right"])
        
        # Her taraf için ayrı state
        self.current_state_left = None
        self.current_state_right = None
        self.prev_state_left = None
        self.prev_state_right = None
        
        self.last_count_time_left = 0
        self.last_count_time_right = 0
    
    def compute_bilateral_angles(self, landmarks, frame_shape: Tuple[int, int]) -> Dict[str, float]:
        """Sol ve sağ taraf açılarını hesapla."""
        angles = {}
        
        for side in self.sides:
            angle_key = f"{side}_angle"
            angle_def = self.angles.get(side)
            
            if angle_def:
                points = angle_def["points"]
                p1 = self.get_landmark_coords(landmarks, points[0], frame_shape)
                p2 = self.get_landmark_coords(landmarks, points[1], frame_shape)
                p3 = self.get_landmark_coords(landmarks, points[2], frame_shape)
                
                angles[angle_key] = self._angle_between(p1, p2, p3)
        
        self._computed_angles.update(angles)
        return angles
    
    def update_bilateral_state(self, context: Dict[str, Any]) -> Tuple[str, str]:
        """Her iki taraf için durumu güncelle."""
        self.prev_state_left = self.current_state_left
        self.prev_state_right = self.current_state_right
        
        # Sol taraf
        left_context = context.copy()
        left_context["angle"] = context.get("left_angle", 0)
        for state_name in self.state_order:
            state_def = self.states.get(state_name, {})
            condition = state_def.get("condition", "False")
            try:
                if self._safe_eval(condition, left_context):
                    self.current_state_left = state_name
                    break
            except:
                pass
        
        # Sağ taraf
        right_context = context.copy()
        right_context["angle"] = context.get("right_angle", 0)
        for state_name in self.state_order:
            state_def = self.states.get(state_name, {})
            condition = state_def.get("condition", "False")
            try:
                if self._safe_eval(condition, right_context):
                    self.current_state_right = state_name
                    break
            except:
                pass
        
        return self.current_state_left, self.current_state_right
    
    def update_bilateral_counter(self) -> Tuple[bool, bool]:
        """Her iki taraf için sayacı güncelle."""
        trigger_state = self.counter_rule.get("trigger_state")
        current_time = time.time()
        
        left_counted = False
        right_counted = False
        
        # Sol
        if (self.prev_state_left != self.current_state_left and 
            self.current_state_left == trigger_state and
            (current_time - self.last_count_time_left) >= self.min_rep_duration):
            self.counter_left += 1
            self.last_count_time_left = current_time
            left_counted = True
        
        # Sağ
        if (self.prev_state_right != self.current_state_right and 
            self.current_state_right == trigger_state and
            (current_time - self.last_count_time_right) >= self.min_rep_duration):
            self.counter_right += 1
            self.last_count_time_right = current_time
            right_counted = True
        
        # Toplam sayaç
        self.counter = self.counter_left + self.counter_right
        
        return left_counted, right_counted
    
    def reset(self):
        """Sıfırla."""
        super().reset()
        self.current_state_left = None
        self.current_state_right = None
        self.prev_state_left = None
        self.prev_state_right = None
        self.last_count_time_left = 0
        self.last_count_time_right = 0
    
    def get_status(self) -> Dict[str, Any]:
        """Bilateral durum bilgisi."""
        status = super().get_status()
        status.update({
            "counter_left": self.counter_left,
            "counter_right": self.counter_right,
            "state_left": self.current_state_left,
            "state_right": self.current_state_right
        })
        return status


class DurationExercise(BaseExercise):
    """
    Süre bazlı egzersizler için genişletilmiş sınıf.
    Örn: Plank
    """
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        
        self.target_duration = config.get("target_duration", 30)  # saniye
        self.current_duration = 0
        self.hold_start_time = None
        self.is_holding = False
        self.hold_state = config.get("hold_state", "hold")
    
    def update_duration(self, context: Dict[str, Any]) -> float:
        """Süreyi güncelle."""
        # State'i güncelle
        self.update_state(context)
        
        if self.current_state == self.hold_state:
            if not self.is_holding:
                self.hold_start_time = time.time()
                self.is_holding = True
            else:
                self.current_duration = time.time() - self.hold_start_time
        else:
            self.is_holding = False
            # Süre hedefine ulaşıldıysa sayacı artır
            if self.current_duration >= self.target_duration:
                self.counter += 1
            self.current_duration = 0
        
        return self.current_duration
    
    def reset(self):
        """Sıfırla."""
        super().reset()
        self.current_duration = 0
        self.hold_start_time = None
        self.is_holding = False
    
    def get_status(self) -> Dict[str, Any]:
        """Duration durum bilgisi."""
        status = super().get_status()
        status.update({
            "current_duration": self.current_duration,
            "target_duration": self.target_duration,
            "is_holding": self.is_holding
        })
        return status
