"""
Test script for the new Exercise Engine

Bu script, yeni YAML tabanlı egzersiz motorunu test eder.
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from exercises.loader import load_exercise, get_available_exercises, get_exercise_info, validate_exercise_config
from exercises.base_exercise import BaseExercise, BilateralExercise, DurationExercise
import yaml


def test_yaml_loading():
    """YAML dosyalarının yüklenmesini test et."""
    print("=" * 60)
    print("TEST: YAML Loading")
    print("=" * 60)
    
    exercises = get_available_exercises()
    print(f"\nAvailable exercises: {exercises}")
    
    for ex_name in exercises:
        try:
            exercise = load_exercise(ex_name)
            print(f"\n✅ {ex_name}:")
            print(f"   Type: {type(exercise).__name__}")
            print(f"   Name: {exercise.display_name}")
            print(f"   States: {list(exercise.states.keys())}")
            print(f"   Angles: {list(exercise.angles.keys())}")
        except Exception as e:
            print(f"\n❌ {ex_name}: {e}")
    
    return True


def test_exercise_info():
    """Egzersiz bilgilerini test et."""
    print("\n" + "=" * 60)
    print("TEST: Exercise Info")
    print("=" * 60)
    
    for ex_name in get_available_exercises():
        info = get_exercise_info(ex_name)
        print(f"\n📋 {ex_name}:")
        print(f"   Display Name: {info.get('name')}")
        print(f"   Target Muscles: {info.get('target_muscles')}")
        print(f"   Difficulty: {info.get('difficulty')}")
        print(f"   Default Reps: {info.get('reps')}")
    
    return True


def test_state_machine():
    """State machine mantığını test et."""
    print("\n" + "=" * 60)
    print("TEST: State Machine Logic")
    print("=" * 60)
    
    # Squat testi
    squat = load_exercise("squat")
    
    # Simüle edilmiş açı değerleri
    test_angles = [175, 160, 130, 100, 85, 95, 140, 170, 175]
    
    print(f"\nSquat State Machine Test:")
    print(f"Trigger state: {squat.counter_rule.get('trigger_state')}")
    
    for angle in test_angles:
        context = {"angle": angle}
        squat.update_state(context)
        squat.update_counter()
        print(f"   Angle: {angle:3d}° → State: {squat.current_state:15s} | Counter: {squat.counter}")
    
    assert squat.counter == 1, f"Expected 1 rep, got {squat.counter}"
    print(f"\n✅ State machine working correctly! Final count: {squat.counter}")
    
    return True


def test_bilateral_exercise():
    """Bilateral egzersizi test et."""
    print("\n" + "=" * 60)
    print("TEST: Bilateral Exercise (Hammer Curl)")
    print("=" * 60)
    
    hammer_curl = load_exercise("hammer_curl")
    
    assert isinstance(hammer_curl, BilateralExercise), "Hammer curl should be BilateralExercise"
    
    print(f"\n✅ Hammer Curl loaded as BilateralExercise")
    print(f"   Sides: {hammer_curl.sides}")
    print(f"   Left angles: {[k for k in hammer_curl.angles.keys() if 'left' in k]}")
    print(f"   Right angles: {[k for k in hammer_curl.angles.keys() if 'right' in k]}")
    
    return True


def test_duration_exercise():
    """Duration egzersizini test et."""
    print("\n" + "=" * 60)
    print("TEST: Duration Exercise (Plank)")
    print("=" * 60)
    
    plank = load_exercise("plank")
    
    assert isinstance(plank, DurationExercise), "Plank should be DurationExercise"
    
    print(f"\n✅ Plank loaded as DurationExercise")
    print(f"   Target duration: {plank.target_duration}s")
    print(f"   Hold state: {plank.hold_state}")
    
    return True


def test_feedback_rules():
    """Feedback kurallarını test et."""
    print("\n" + "=" * 60)
    print("TEST: Feedback Rules")
    print("=" * 60)
    
    squat = load_exercise("squat")
    
    # Kötü form simülasyonu - dizler içe kaçıyor
    context = {
        "angle": 100,
        "left_knee_x": 200,
        "left_ankle_x": 250,  # Diz, ayak bilekten 50px solda
        "left_shoulder_x": 220,
        "left_hip_x": 230
    }
    
    feedback = squat.check_feedback(context)
    
    print(f"\nSquat Feedback Test:")
    print(f"   Context: knee_x={context['left_knee_x']}, ankle_x={context['left_ankle_x']}")
    print(f"   Feedback messages: {len(feedback)}")
    
    for fb in feedback:
        print(f"   ⚠️  {fb['severity'].upper()}: {fb['message']}")
    
    return True


def test_config_validation():
    """Config validation test et."""
    print("\n" + "=" * 60)
    print("TEST: Config Validation")
    print("=" * 60)
    
    # Geçerli config
    valid_config = {
        "name": "test_exercise",
        "angles": {
            "primary": {"points": ["left_shoulder", "left_hip", "left_knee"]}
        },
        "states": {
            "start": {"condition": "angle > 160"},
            "down": {"condition": "angle < 100"}
        },
        "counter": {
            "trigger_state": "down"
        }
    }
    
    errors = validate_exercise_config(valid_config)
    print(f"\nValid config errors: {errors}")
    assert len(errors) == 0, f"Valid config should have no errors: {errors}"
    print("✅ Valid config passed")
    
    # Geçersiz config
    invalid_config = {
        "name": "test",
        "states": {}
    }
    
    errors = validate_exercise_config(invalid_config)
    print(f"\nInvalid config errors: {errors}")
    assert len(errors) > 0, "Invalid config should have errors"
    print("✅ Invalid config correctly detected")
    
    return True


def main():
    """Tüm testleri çalıştır."""
    print("\n" + "🏋️ " * 20)
    print("EXERCISE ENGINE TEST SUITE")
    print("🏋️ " * 20)
    
    tests = [
        ("YAML Loading", test_yaml_loading),
        ("Exercise Info", test_exercise_info),
        ("State Machine", test_state_machine),
        ("Bilateral Exercise", test_bilateral_exercise),
        ("Duration Exercise", test_duration_exercise),
        ("Feedback Rules", test_feedback_rules),
        ("Config Validation", test_config_validation),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, "✅ PASSED" if success else "❌ FAILED"))
        except Exception as e:
            results.append((name, f"❌ ERROR: {e}"))
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    for name, result in results:
        print(f"   {name}: {result}")
    
    passed = sum(1 for _, r in results if "PASSED" in r)
    total = len(results)
    
    print(f"\n   Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! The Exercise Engine is ready to use.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")


if __name__ == "__main__":
    main()
