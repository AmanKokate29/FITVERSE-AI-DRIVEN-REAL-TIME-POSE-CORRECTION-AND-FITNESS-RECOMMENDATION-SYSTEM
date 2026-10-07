"""
Exercise Loader - YAML'dan egzersiz yükleyici

Bu modül, YAML dosyalarından egzersiz konfigürasyonlarını yükler
ve uygun Exercise sınıfını oluşturur.
"""

import yaml
import os
from pathlib import Path
from typing import Dict, Optional, List

from exercises.base_exercise import BaseExercise, BilateralExercise, DurationExercise


# Definitions klasörünün yolu
DEFINITIONS_DIR = Path(__file__).parent / "definitions"


def load_exercise(exercise_name: str) -> BaseExercise:
    """
    Egzersiz adından YAML dosyasını yükle ve Exercise nesnesi oluştur.
    
    Args:
        exercise_name: Egzersiz adı (örn: "squat", "push_up")
        
    Returns:
        BaseExercise (veya alt sınıfı) instance
    """
    yaml_path = DEFINITIONS_DIR / f"{exercise_name}.yaml"
    
    if not yaml_path.exists():
        raise FileNotFoundError(f"Exercise definition not found: {yaml_path}")
    
    return load_exercise_from_file(str(yaml_path))


def load_exercise_from_file(yaml_path: str) -> BaseExercise:
    """
    YAML dosyasından egzersiz yükle.
    
    Args:
        yaml_path: YAML dosya yolu
        
    Returns:
        BaseExercise (veya alt sınıfı) instance
    """
    with open(yaml_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)
    
    # Egzersiz tipine göre uygun sınıfı seç
    exercise_type = config.get("type", "repetition")
    bilateral = config.get("bilateral", False)
    
    if exercise_type == "duration":
        return DurationExercise(config)
    elif bilateral:
        return BilateralExercise(config)
    else:
        return BaseExercise(config)


def get_available_exercises() -> List[str]:
    """
    Mevcut tüm egzersiz tanımlarını listele.
    
    Returns:
        Egzersiz adları listesi
    """
    if not DEFINITIONS_DIR.exists():
        return []
    
    exercises = []
    for file in DEFINITIONS_DIR.glob("*.yaml"):
        exercises.append(file.stem)
    
    return sorted(exercises)


def get_exercise_info(exercise_name: str) -> Dict:
    """
    Egzersiz bilgilerini al (UI için).
    
    Args:
        exercise_name: Egzersiz adı
        
    Returns:
        Egzersiz meta bilgileri
    """
    yaml_path = DEFINITIONS_DIR / f"{exercise_name}.yaml"
    
    if not yaml_path.exists():
        return {}
    
    with open(yaml_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)
    
    return {
        "name": config.get("display_name", exercise_name.replace("_", " ").title()),
        "type": config.get("type", "repetition"),
        "target_muscles": config.get("target_muscles", []),
        "equipment": config.get("equipment", "Bodyweight"),
        "reps": config.get("default_reps", 10),
        "sets": config.get("default_sets", 3),
        "rest_time": config.get("rest_time", "60 seconds"),
        "benefits": config.get("benefits", []),
        "difficulty": config.get("difficulty", "beginner"),
        "description": config.get("description", ""),
    }


def get_all_exercises_info() -> Dict[str, Dict]:
    """
    Tüm egzersizlerin bilgilerini al.
    
    Returns:
        {exercise_name: info_dict} formatında dict
    """
    exercises = {}
    for name in get_available_exercises():
        exercises[name] = get_exercise_info(name)
    return exercises


def validate_exercise_config(config: Dict) -> List[str]:
    """
    Egzersiz konfigürasyonunu doğrula.
    
    Args:
        config: YAML'dan yüklenen config
        
    Returns:
        Hata mesajları listesi (boş liste = geçerli)
    """
    errors = []
    
    # Zorunlu alanlar
    required = ["name", "angles", "states", "counter"]
    for field in required:
        if field not in config:
            errors.append(f"Missing required field: {field}")
    
    # Angles kontrolü
    if "angles" in config:
        for angle_name, angle_def in config["angles"].items():
            if "points" not in angle_def:
                errors.append(f"Angle '{angle_name}' missing 'points' field")
            elif len(angle_def["points"]) != 3:
                errors.append(f"Angle '{angle_name}' must have exactly 3 points")
    
    # States kontrolü
    if "states" in config:
        for state_name, state_def in config["states"].items():
            if "condition" not in state_def:
                errors.append(f"State '{state_name}' missing 'condition' field")
    
    # Counter kontrolü
    if "counter" in config:
        if "trigger_state" not in config["counter"]:
            errors.append("Counter missing 'trigger_state' field")
    
    return errors


# Modül yüklendiğinde definitions klasörünü oluştur
DEFINITIONS_DIR.mkdir(exist_ok=True)
