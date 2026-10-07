"""
Standalone video processor - Runs in separate process to avoid memory issues
Creates output video WITH SKELETON OVERLAY
Usage: python video_processor.py <video_path> <exercise_type> <output_json_path> [output_video_path]
"""

import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import sys
import json
import cv2
import gc

# Try to use imageio with ffmpeg for H.264 support
try:
    import imageio
    IMAGEIO_AVAILABLE = True
    print("imageio available for H.264 output")
except ImportError:
    IMAGEIO_AVAILABLE = False
    print("imageio not available, using OpenCV for output")


def draw_skeleton(frame, landmarks, mp_pose, mp_drawing):
    """Draw enhanced skeleton on frame with neon glow effect"""
    h, w = frame.shape[:2]
    
    # Define custom connections for cleaner skeleton
    # Body connections with different colors
    BODY_CONNECTIONS = [
        # Torso (cyan)
        (11, 12),  # Shoulders
        (11, 23),  # Left shoulder to hip
        (12, 24),  # Right shoulder to hip
        (23, 24),  # Hips
    ]
    
    ARM_CONNECTIONS = [
        # Left arm (green)
        (11, 13), (13, 15),  # Left arm
        # Right arm (green)  
        (12, 14), (14, 16),  # Right arm
    ]
    
    LEG_CONNECTIONS = [
        # Left leg (blue)
        (23, 25), (25, 27),  # Left leg
        # Right leg (blue)
        (24, 26), (26, 28),  # Right leg
    ]
    
    # Get landmark positions
    def get_pos(idx):
        lm = landmarks.landmark[idx]
        return (int(lm.x * w), int(lm.y * h))
    
    def is_visible(idx):
        return landmarks.landmark[idx].visibility > 0.5
    
    # Draw connections with glow effect
    def draw_line_with_glow(p1, p2, color, thickness=3):
        # Outer glow
        cv2.line(frame, p1, p2, (color[0]//3, color[1]//3, color[2]//3), thickness + 4)
        # Main line
        cv2.line(frame, p1, p2, color, thickness)
        # Inner bright line
        cv2.line(frame, p1, p2, (min(255, color[0]+50), min(255, color[1]+50), min(255, color[2]+50)), max(1, thickness-1))
    
    # Draw body (cyan)
    for start, end in BODY_CONNECTIONS:
        if is_visible(start) and is_visible(end):
            draw_line_with_glow(get_pos(start), get_pos(end), (255, 200, 0), 3)  # Cyan in BGR
    
    # Draw arms (green)
    for start, end in ARM_CONNECTIONS:
        if is_visible(start) and is_visible(end):
            draw_line_with_glow(get_pos(start), get_pos(end), (0, 255, 100), 3)
    
    # Draw legs (blue-purple)
    for start, end in LEG_CONNECTIONS:
        if is_visible(start) and is_visible(end):
            draw_line_with_glow(get_pos(start), get_pos(end), (255, 100, 100), 3)
    
    # Draw key joints with glow
    key_joints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]
    for idx in key_joints:
        if is_visible(idx):
            pos = get_pos(idx)
            # Outer glow
            cv2.circle(frame, pos, 8, (50, 50, 50), -1)
            # Middle ring
            cv2.circle(frame, pos, 6, (0, 200, 100), -1)
            # Inner dot
            cv2.circle(frame, pos, 3, (255, 255, 255), -1)
    
    return frame


def draw_stats_overlay(frame, stats):
    """Draw professional exercise stats overlay on frame"""
    h, w = frame.shape[:2]
    
    # Calculate overlay dimensions
    box_width = 320
    box_height = 180
    margin = 15
    padding = 12
    
    # Create semi-transparent overlay with rounded corners effect
    overlay = frame.copy()
    
    # Main background box
    cv2.rectangle(overlay, (margin, margin), (margin + box_width, margin + box_height), 
                  (30, 30, 30), -1)
    
    # Add accent line on left
    cv2.rectangle(overlay, (margin, margin), (margin + 5, margin + box_height), 
                  (0, 200, 100), -1)
    
    cv2.addWeighted(overlay, 0.85, frame, 0.15, 0, frame)
    
    # Fonts
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_bold = cv2.FONT_HERSHEY_DUPLEX
    
    # Calculate positions
    x_start = margin + padding + 8
    y_start = margin + 35
    line_height = 38
    
    # === REPS (Large, prominent) ===
    reps_text = f"{stats['reps']}"
    cv2.putText(frame, "REPS", (x_start, y_start - 8), 
                font, 0.5, (150, 150, 150), 1, cv2.LINE_AA)
    cv2.putText(frame, reps_text, (x_start, y_start + 28), 
                font_bold, 1.4, (255, 255, 255), 2, cv2.LINE_AA)
    
    # === SCORE with color gradient based on value ===
    score = stats.get('form_score', 100)
    grade = stats.get('grade', 'A')
    
    # Color based on score
    if score >= 90:
        score_color = (0, 230, 118)  # Bright green
    elif score >= 75:
        score_color = (0, 200, 255)  # Gold/Yellow
    elif score >= 60:
        score_color = (0, 165, 255)  # Orange
    else:
        score_color = (60, 76, 231)  # Red
    
    # Score display (middle section)
    score_x = x_start + 90
    cv2.putText(frame, "SCORE", (score_x, y_start - 8), 
                font, 0.5, (150, 150, 150), 1, cv2.LINE_AA)
    cv2.putText(frame, f"{int(score)}", (score_x, y_start + 28), 
                font_bold, 1.4, score_color, 2, cv2.LINE_AA)
    
    # === GRADE (with badge style) ===
    grade_x = score_x + 90
    cv2.putText(frame, "GRADE", (grade_x, y_start - 8), 
                font, 0.5, (150, 150, 150), 1, cv2.LINE_AA)
    
    # Grade badge background
    badge_x = grade_x
    badge_y = y_start + 5
    badge_size = 35
    cv2.rectangle(frame, (badge_x - 5, badge_y - 5), (badge_x + badge_size, badge_y + badge_size - 5), 
                  score_color, -1)
    cv2.putText(frame, grade, (badge_x + 5, badge_y + 22), 
                font_bold, 0.9, (255, 255, 255), 2, cv2.LINE_AA)
    
    # === STATE (with icon-like indicator) ===
    state = stats.get('state', 'READY')
    if state is None or state == 'None':
        state = 'READY'
    
    # Map states to user-friendly names and colors
    state_info = {
        'up': ('UP', (0, 230, 118)),
        'down': ('DOWN', (255, 180, 0)),
        'UP': ('UP', (0, 230, 118)),
        'DOWN': ('DOWN', (255, 180, 0)),
        'hold': ('HOLD', (0, 200, 255)),
        'HOLD': ('HOLD', (0, 200, 255)),
        'READY': ('READY', (100, 100, 100)),
        'ready': ('READY', (100, 100, 100)),
        'UNKNOWN': ('READY', (100, 100, 100)),
    }
    
    state_display, state_color = state_info.get(state, (state.upper(), (180, 180, 180)))
    
    state_y = y_start + line_height + 25
    cv2.putText(frame, "STATE", (x_start, state_y), 
                font, 0.5, (150, 150, 150), 1, cv2.LINE_AA)
    
    # State indicator dot
    dot_y = state_y + 20
    cv2.circle(frame, (x_start + 8, dot_y), 6, state_color, -1)
    cv2.putText(frame, state_display, (x_start + 22, dot_y + 5), 
                font, 0.65, state_color, 2, cv2.LINE_AA)
    
    # === FEEDBACK (if any) ===
    feedback = stats.get('feedback', '')
    # Handle feedback being a list or other type
    if isinstance(feedback, list):
        feedback = ' '.join(str(f) for f in feedback)
    elif feedback:
        feedback = str(feedback)
    else:
        feedback = ''
    if feedback and feedback.strip():
        feedback_y = state_y + line_height + 15
        # Truncate long feedback
        if len(feedback) > 40:
            feedback = feedback[:37] + "..."
        cv2.putText(frame, feedback, (x_start, feedback_y), 
                    font, 0.5, (200, 200, 200), 1, cv2.LINE_AA)
    
    return frame


def process_video(video_path: str, exercise_type: str, output_json_path: str, output_video_path: str = None):
    """Process video, draw skeleton, and write results"""
    import mediapipe as mp
    from exercises.engine import ExerciseEngine
    
    results = {
        'status': 'processing',
        'progress': 0,
        'reps': 0,
        'form_score': 100,
        'avg_form_score': 100,
        'grade': 'A',
        'state': 'READY',
        'feedback': '',
        'error': None,
        'output_video': output_video_path
    }
    
    def save_results():
        with open(output_json_path, 'w') as f:
            json.dump(results, f)
    
    cap = None
    out = None
    pose = None
    imageio_writer = None
    
    try:
        # Open video
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            results['status'] = 'error'
            results['error'] = 'Could not open video file'
            save_results()
            return
        
        # Get video properties
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        print(f"Video: {width}x{height} @ {fps:.1f} fps, {total_frames} frames")
        
        # Create output video writer if path provided
        out = None
        
        if output_video_path:
            # Ensure .mp4 extension
            if not output_video_path.endswith('.mp4'):
                output_video_path = output_video_path.rsplit('.', 1)[0] + '.mp4'
            
            if IMAGEIO_AVAILABLE:
                # Use imageio with ffmpeg for H.264
                try:
                    imageio_writer = imageio.get_writer(
                        output_video_path,
                        fps=fps,
                        codec='libx264',  # H.264 codec
                        pixelformat='yuv420p',  # Browser compatible
                        quality=8,
                        macro_block_size=1  # Avoid size issues
                    )
                    print(f"Using imageio/FFmpeg H.264 writer: {output_video_path}")
                except Exception as e:
                    print(f"imageio writer init failed: {e}, will use OpenCV")
                    imageio_writer = None
            
            if not imageio_writer:
                # Fallback to OpenCV
                codecs_to_try = [
                    ('avc1', '.mp4'),  # H.264 - best for web
                    ('H264', '.mp4'),  # Alternative H.264
                    ('XVID', '.avi'),  # Fallback
                    ('mp4v', '.mp4'),  # Last resort
                ]
                
                for codec, ext in codecs_to_try:
                    try:
                        fourcc = cv2.VideoWriter_fourcc(*codec)
                        if not output_video_path.endswith(ext):
                            output_video_path = output_video_path.rsplit('.', 1)[0] + ext
                        out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))
                        if out.isOpened():
                            print(f"Using OpenCV codec: {codec}")
                            break
                        out.release()
                        out = None
                    except:
                        continue
                
                if not out or not out.isOpened():
                    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                    out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))
                    print("Using fallback codec: mp4v")
            
            # Update results with actual output path
            results['output_video'] = output_video_path
            print(f"Output video: {output_video_path}")
        
        # Initialize MediaPipe
        mp_pose = mp.solutions.pose
        mp_drawing = mp.solutions.drawing_utils
        
        pose = mp_pose.Pose(
            static_image_mode=False,  # Video mode for better tracking
            model_complexity=1,  # Better accuracy
            enable_segmentation=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        print("MediaPipe Pose initialized")
        
        # Initialize exercise engine
        engine = ExerciseEngine()
        if not engine.set_exercise(exercise_type):
            print(f"WARNING: Failed to load exercise: {exercise_type}")
        else:
            print(f"Exercise loaded: {exercise_type}")
        
        frame_count = 0
        analyze_skip = max(1, int(fps / 8))  # Analyze at ~8 fps
        print(f"Analyze skip: {analyze_skip} (analyzing at ~{fps/analyze_skip:.1f} fps)")
        
        # Current stats for overlay
        current_stats = {
            'reps': 0,
            'form_score': 100,
            'grade': 'A',
            'state': 'READY',
            'feedback': ''
        }
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            results['progress'] = int((frame_count / total_frames) * 100)
            
            # Process with MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pose_results = pose.process(rgb_frame)
            
            if pose_results.pose_landmarks:
                # Draw skeleton on frame
                frame = draw_skeleton(frame, pose_results.pose_landmarks, mp_pose, mp_drawing)
                
                # Analyze exercise periodically
                if frame_count % analyze_skip == 0:
                    class SimpleResults:
                        def __init__(self, landmarks):
                            self.pose_landmarks = landmarks
                    
                    # Pass landmarks.landmark (the actual list) to engine
                    engine.process_frame(frame, pose_results.pose_landmarks.landmark)
                    status = engine.get_status()
                    
                    current_stats['reps'] = status.get('counter', 0)
                    current_stats['form_score'] = status.get('form_score', 100)
                    current_stats['grade'] = status.get('form_grade', 'A')
                    current_stats['state'] = status.get('current_state', 'UNKNOWN')
                    current_stats['feedback'] = status.get('feedback', '')
                    
                    results['reps'] = current_stats['reps']
                    results['form_score'] = current_stats['form_score']
                    results['avg_form_score'] = status.get('avg_form_score', 100)
                    results['grade'] = current_stats['grade']
                    results['state'] = current_stats['state']
                    results['feedback'] = current_stats['feedback']
                    
                    # Debug: print counter every 30 analyze frames
                    if (frame_count // analyze_skip) % 30 == 0:
                        print(f"[Frame {frame_count}] Counter: {status.get('counter', 0)}, State: {status.get('current_state')}, Left: {status.get('counter_left', 'N/A')}, Right: {status.get('counter_right', 'N/A')}")
            
            # Draw stats overlay
            frame = draw_stats_overlay(frame, current_stats)
            
            # Write frame to output video
            if imageio_writer:
                # Convert BGR to RGB for imageio
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                imageio_writer.append_data(frame_rgb)
            elif out:
                out.write(frame)
            
            # Save intermediate results
            if frame_count % 60 == 0:
                save_results()
            
            # Memory management
            del rgb_frame
            if frame_count % 100 == 0:
                gc.collect()
        
        # Cleanup video capture
        if cap:
            cap.release()
        if pose:
            pose.close()
        
        # IMPORTANT: Write final stats to results (in case last frame didn't trigger update)
        results['reps'] = current_stats['reps']
        results['form_score'] = current_stats['form_score']
        results['grade'] = current_stats['grade']
        results['state'] = 'COMPLETED'
        results['feedback'] = current_stats['feedback']
        
        # Close video writers
        if imageio_writer:
            try:
                imageio_writer.close()
                print(f"H.264 video saved: {output_video_path}")
            except Exception as e:
                print(f"Error closing imageio writer: {e}")
        if out:
            out.release()
        
        gc.collect()
        
        results['status'] = 'completed'
        results['progress'] = 100
        
        # Debug: Print final values
        print(f"=== FINAL RESULTS ===")
        print(f"Reps from current_stats: {current_stats['reps']}")
        print(f"Reps written to results: {results['reps']}")
        print(f"Form Score: {results['form_score']}")
        print(f"Grade: {results['grade']}")
        print(f"State: {results['state']}")
        
        # Get final status from engine for verification
        final_status = engine.get_status()
        print(f"Engine final counter: {final_status.get('counter', 'N/A')}")
        print(f"Engine final state: {final_status.get('current_state', 'N/A')}")
        if final_status.get('counter_left') is not None:
            print(f"Engine counter_left: {final_status.get('counter_left')}")
            print(f"Engine counter_right: {final_status.get('counter_right')}")
        print(f"=====================")
        
        save_results()
        
        print(f"Completed: {frame_count} frames, {results['reps']} reps")
        if output_video_path:
            print(f"Output video saved: {output_video_path}")
        
    except Exception as e:
        results['status'] = 'error'
        results['error'] = str(e)
        save_results()
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if cap:
            try:
                cap.release()
            except:
                pass
        if imageio_writer:
            try:
                imageio_writer.close()
            except:
                pass
        if out:
            try:
                out.release()
            except:
                pass
        if pose:
            try:
                pose.close()
            except:
                pass
        gc.collect()


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python video_processor.py <video_path> <exercise_type> <output_json_path> [output_video_path]")
        sys.exit(1)
    
    video_path = sys.argv[1]
    exercise_type = sys.argv[2]
    output_json_path = sys.argv[3]
    output_video_path = sys.argv[4] if len(sys.argv) > 4 else None
    
    process_video(video_path, exercise_type, output_json_path, output_video_path)
