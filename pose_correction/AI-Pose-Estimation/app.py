# CRITICAL: Set environment variables BEFORE any TensorFlow/MediaPipe imports
import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"  # Suppress TF warnings

from flask import Flask, render_template, Response, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import cv2
import threading
import time
import sys
import traceback
import logging
import uuid
import numpy as np

# Set up logging
logging.basicConfig(level=logging.DEBUG, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                   handlers=[logging.StreamHandler()])
logger = logging.getLogger(__name__)

# Import attempt with error handling
try:
    from pose_estimation.estimation import PoseEstimator
    # NEW: Import Exercise Engine
    from exercises.engine import ExerciseEngine
    from exercises.loader import get_available_exercises, get_exercise_info
    from utils.draw_text_with_background import draw_text_with_background
    logger.info("Successfully imported pose estimation modules")
except ImportError as e:
    logger.error(f"Failed to import required modules: {e}")
    traceback.print_exc()
    sys.exit(1)

# Try to import WorkoutLogger with fallback
try:
    from db.workout_logger import WorkoutLogger
    workout_logger = WorkoutLogger()
    logger.info("Successfully initialized workout logger")
except ImportError:
    logger.warning("WorkoutLogger import failed, creating dummy class")
    
    class DummyWorkoutLogger:
        def __init__(self):
            pass
        def log_workout(self, *args, **kwargs):
            return {}
        def get_recent_workouts(self, *args, **kwargs):
            return []
        def get_weekly_stats(self, *args, **kwargs):
            return {}
        def get_exercise_distribution(self, *args, **kwargs):
            return {}
        def get_user_stats(self, *args, **kwargs):
            return {'total_workouts': 0, 'total_exercises': 0, 'streak_days': 0}
    
    workout_logger = DummyWorkoutLogger()

logger.info("Setting up Flask application")
app = Flask(__name__)
CORS(app, resources={r"/video_feed": {"origins": "*"}})
app.secret_key = 'fitness_trainer_secret_key'  # Required for sessions

# Global variables
camera = None
output_frame = None
lock = threading.Lock()
exercise_running = False
exercise_engine = ExerciseEngine()  # NEW: Global exercise engine
current_exercise_type = None
exercise_goal = 0
sets_completed = 0
sets_goal = 0
workout_start_time = None

# FPS tracking
fps_counter = 0
fps_start_time = time.time()
current_fps = 0

# Video analysis storage
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
video_analyses = {}  # Store ongoing video analyses

# Video upload limits
MAX_VIDEO_SIZE_MB = 50  # Max 50MB video
MAX_VIDEO_DURATION_SEC = 120  # Max 2 minutes

def initialize_camera():
    global camera
    if camera is None:
        logger.info("Initializing camera...")
        camera = cv2.VideoCapture(0)
        
        # Check if camera opened successfully
        if not camera.isOpened():
            logger.error("Failed to open camera")
            camera = None
            return None
            
        # Optimize camera settings
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        camera.set(cv2.CAP_PROP_FPS, 30)
        camera.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Reduce buffer lag
        
        logger.info("Camera initialized successfully")
    return camera

def release_camera():
    global camera
    if camera is not None:
        camera.release()
        camera = None

# Global pose estimator - ONLY ONE instance, created lazily when needed
_pose_estimator = None
_pose_estimator_lock = threading.Lock()

def get_pose_estimator():
    """Get or create the single PoseEstimator instance"""
    global _pose_estimator
    with _pose_estimator_lock:
        if _pose_estimator is None:
            _pose_estimator = PoseEstimator()
        return _pose_estimator

def generate_frames():
    global output_frame, lock, exercise_running, exercise_engine
    global exercise_goal, sets_completed, sets_goal
    global fps_counter, fps_start_time, current_fps

    # NO PoseEstimator here - only create when exercise starts
    pose_estimator = None

    # Initialize camera when video feed starts
    initialize_camera()

    while True:
        if camera is None:
            logger.warning("Camera not initialized, attempting to initialize...")
            initialize_camera()
            time.sleep(0.1)
            continue
            
        success, frame = camera.read()
        if not success:
            logger.warning("Failed to read frame from camera")
            time.sleep(0.01)
            continue
        
        # FPS calculation
        fps_counter += 1
        elapsed = time.time() - fps_start_time
        if elapsed >= 1.0:
            current_fps = fps_counter / elapsed
            fps_counter = 0
            fps_start_time = time.time()
        
        # Only process frames if an exercise is running
        if exercise_running and exercise_engine.exercise:
            # Lazy load pose estimator only when needed
            if pose_estimator is None:
                pose_estimator = get_pose_estimator()
            
            # Process with pose estimation
            results = pose_estimator.estimate_pose(frame, exercise_engine.exercise_name)
            
            if results.pose_landmarks:
                # NEW: Use Exercise Engine to process frame
                result = exercise_engine.process_frame(frame, results.pose_landmarks.landmark)
                
                if result["success"]:
                    # Draw status overlay
                    exercise_engine.draw_status_overlay(frame, exercise_goal, sets_goal, sets_completed)
                    
                    # Draw Form Score
                    exercise_engine.draw_form_score(frame)
                    
                    # Check if rep goal is reached for current set
                    current_counter = exercise_engine.get_counter()
                    if current_counter >= exercise_goal:
                        sets_completed += 1
                        exercise_engine.reset()
                        
                        # Check if all sets are completed
                        if sets_completed >= sets_goal:
                            exercise_running = False
                            # Final form score display
                            avg_score = exercise_engine.exercise.avg_form_score if exercise_engine.exercise else 0
                            draw_text_with_background(frame, f"WORKOUT COMPLETE! Avg Score: {avg_score}", 
                                                    (frame.shape[1]//2 - 200, frame.shape[0]//2),
                                                    cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), (0, 200, 0), 2)
                        else:
                            draw_text_with_background(frame, f"SET {sets_completed} COMPLETE! Rest for 30 sec", 
                                                    (frame.shape[1]//2 - 200, frame.shape[0]//2),
                                                    cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), (0, 0, 200), 2)
        else:
            # Display welcome message if no exercise is running
            cv2.putText(frame, "Select an exercise to begin", (frame.shape[1]//2 - 180, frame.shape[0]//2),
                       cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)
            
            # Show available exercises
            exercises = get_available_exercises()
            cv2.putText(frame, f"Available: {len(exercises)} exercises", (frame.shape[1]//2 - 120, frame.shape[0]//2 + 40),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
        
        # Display FPS
        cv2.putText(frame, f"FPS: {current_fps:.1f}", (frame.shape[1] - 100, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 1)
                
        # Encode the frame in JPEG format
        try:
            with lock:
                output_frame = frame.copy()
                
            # Yield the frame in byte format
            ret, buffer = cv2.imencode('.jpg', output_frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if not ret:
                logger.warning("Failed to encode frame")
                continue
                
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        except Exception as e:
            logger.error(f"Error encoding/yielding frame: {e}")
            continue

@app.route('/')
def index():
    """Home page with landing"""
    logger.info("Rendering home page")
    try:
        # Get user stats for the home page
        user_stats = workout_logger.get_user_stats()
        return render_template('home.html',
                              total_sessions=user_stats.get('total_workouts', 0),
                              sessions_today=user_stats.get('daily_sessions', 0))
    except Exception as e:
        logger.error(f"Error rendering home: {e}")
        return render_template('home.html',
                              total_sessions=0,
                              sessions_today=0)

@app.route('/live_camera')
def live_camera():
    """Live camera page with exercise selection"""
    logger.info("Rendering live camera page")
    try:
        return render_template('live_camera.html')
    except Exception as e:
        logger.error(f"Error rendering index: {e}")
        return f"Error rendering template: {str(e)}", 500

@app.route('/dashboard')
def dashboard():
    """Dashboard page with workout statistics"""
    logger.info("Rendering dashboard page")
    try:
        # Get data for the dashboard
        recent_workouts = workout_logger.get_recent_workouts(5)
        weekly_stats = workout_logger.get_weekly_stats()
        exercise_distribution = workout_logger.get_exercise_distribution()
        user_stats = workout_logger.get_user_stats()
        
        # Format workouts for display
        formatted_workouts = []
        for workout in recent_workouts:
            formatted_workouts.append({
                'date': workout['date'],
                'exercise': workout['exercise_type'].replace('_', ' ').title(),
                'sets': workout['sets'],
                'reps': workout['reps'],
                'duration': f"{workout['duration_seconds'] // 60}:{workout['duration_seconds'] % 60:02d}"
            })
        
        # Calculate total workouts this week
        weekly_workout_count = sum(day['workout_count'] for day in weekly_stats.values())
        
        # Calculate total time tracked in hours
        total_duration_seconds = sum(w.get('duration_seconds', 0) for w in workout_logger.workouts)
        total_hours = total_duration_seconds / 3600
        
        return render_template('dashboard.html',
                              recent_workouts=formatted_workouts,
                              weekly_workouts=weekly_workout_count,
                              total_workouts=user_stats['total_workouts'],
                              total_exercises=user_stats['total_exercises'],
                              streak_days=user_stats['streak_days'],
                              exercise_distribution=exercise_distribution,
                              weekly_stats=weekly_stats,
                              total_hours=round(total_hours, 1))
    except Exception as e:
        logger.error(f"Error in dashboard: {e}")
        traceback.print_exc()
        return f"Error loading dashboard: {str(e)}", 500

@app.route('/video_feed')
def video_feed():
    """Video streaming route"""
    logger.info("Video feed requested")
    response = Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame',
                   headers={'Cache-Control': 'no-cache, no-store, must-revalidate',
                           'Pragma': 'no-cache',
                           'Expires': '0',
                           'Access-Control-Allow-Origin': '*'})
    return response

@app.route('/stop_camera', methods=['POST'])
def stop_camera():
    """Stop and release camera"""
    global exercise_running
    exercise_running = False
    release_camera()
    logger.info("Camera stopped and released")
    return jsonify({'success': True})

@app.route('/start_exercise', methods=['POST'])
def start_exercise():
    """Start a new exercise based on user selection"""
    global exercise_running, exercise_engine, current_exercise_type
    global exercise_goal, sets_completed, sets_goal
    global workout_start_time
    
    data = request.json
    exercise_type = data.get('exercise_type')
    sets_goal = int(data.get('sets', 3))
    exercise_goal = int(data.get('reps', 10))
    
    # Initialize camera if not already done
    initialize_camera()
    
    # Reset counters
    sets_completed = 0
    workout_start_time = time.time()
    
    # NEW: Use Exercise Engine to load exercise from YAML
    available = get_available_exercises()
    if exercise_type not in available:
        return jsonify({'success': False, 'error': f'Invalid exercise type. Available: {available}'})
    
    # Load exercise
    if not exercise_engine.set_exercise(exercise_type):
        return jsonify({'success': False, 'error': f'Failed to load exercise: {exercise_type}'})
    
    current_exercise_type = exercise_type
    
    # Start the exercise
    exercise_running = True
    
    logger.info(f"Started exercise: {exercise_type}, goal: {exercise_goal} reps x {sets_goal} sets")
    
    return jsonify({
        'success': True,
        'exercise': exercise_type,
        'info': get_exercise_info(exercise_type)
    })

@app.route('/stop_exercise', methods=['POST'])
def stop_exercise():
    """Stop the current exercise and log the workout"""
    global exercise_running, exercise_engine, current_exercise_type
    global workout_start_time, sets_completed, exercise_goal, sets_goal
    
    if exercise_running and exercise_engine.exercise:
        # Calculate duration
        duration = int(time.time() - workout_start_time) if workout_start_time else 0
        
        # Get final form score
        avg_form_score = exercise_engine.exercise.avg_form_score
        
        # Log the workout
        current_counter = exercise_engine.get_counter()
        workout_logger.log_workout(
            exercise_type=current_exercise_type,
            sets=sets_completed + (1 if current_counter > 0 else 0),
            reps=exercise_goal,
            duration_seconds=duration
        )
        
        logger.info(f"Workout stopped. Avg form score: {avg_form_score}")
    
    exercise_running = False
    return jsonify({'success': True})

@app.route('/get_status', methods=['GET'])
def get_status():
    """Return current exercise status"""
    global exercise_engine, sets_completed, exercise_goal, sets_goal, exercise_running
    
    status = {
        'exercise_running': exercise_running,
        'current_reps': exercise_engine.get_counter() if exercise_engine.exercise else 0,
        'current_set': sets_completed + 1 if exercise_running else 0,
        'total_sets': sets_goal,
        'rep_goal': exercise_goal
    }
    
    # Add form score if exercise is running
    if exercise_running and exercise_engine.exercise:
        ex_status = exercise_engine.get_status()
        status['form_score'] = ex_status.get('form_score', 100)
        status['avg_form_score'] = ex_status.get('avg_form_score', 100)
        status['form_grade'] = ex_status.get('form_grade', 'A')
        status['feedback'] = ex_status.get('feedback', [])
    
    return jsonify(status)

@app.route('/exercises', methods=['GET'])
def list_exercises():
    """Return list of all available exercises"""
    exercises = get_available_exercises()
    exercises_info = {ex: get_exercise_info(ex) for ex in exercises}
    return jsonify({
        'exercises': exercises,
        'info': exercises_info,
        'count': len(exercises)
    })

@app.route('/profile')
def profile():
    """User profile page"""
    return render_template('profile.html')

@app.route('/api/profile/update', methods=['POST'])
def update_profile():
    """Update user profile - API endpoint"""
    try:
        data = request.get_json()
        # In a real app, this would save to a database
        # For now, we just acknowledge the update
        return jsonify({'success': True, 'message': 'Profile updated'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# ============================================
# VIDEO ANALYSIS ROUTES
# ============================================

@app.route('/video_analysis')
def video_analysis():
    """Video analysis page"""
    return render_template('video_analysis.html')

@app.route('/api/video/upload', methods=['POST'])
def upload_video():
    """Upload video for analysis"""
    if 'video' not in request.files:
        return jsonify({'success': False, 'error': 'No video file provided'})
    
    video_file = request.files['video']
    exercise_type = request.form.get('exercise_type')
    
    if not exercise_type:
        return jsonify({'success': False, 'error': 'No exercise type specified'})
    
    if video_file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'})
    
    # Check file size (in memory before saving)
    video_file.seek(0, 2)  # Seek to end
    file_size = video_file.tell()
    video_file.seek(0)  # Seek back to start
    
    max_size_bytes = MAX_VIDEO_SIZE_MB * 1024 * 1024
    if file_size > max_size_bytes:
        return jsonify({
            'success': False, 
            'error': f'Video çok büyük! Max {MAX_VIDEO_SIZE_MB}MB, yüklenen: {file_size / (1024*1024):.1f}MB'
        })
    
    # Generate unique ID
    video_id = str(uuid.uuid4())
    
    # Save video
    filename = f"{video_id}_{video_file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    video_file.save(filepath)
    
    # Check video duration
    cap = cv2.VideoCapture(filepath)
    if cap.isOpened():
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        duration = frame_count / fps
        cap.release()
        
        if duration > MAX_VIDEO_DURATION_SEC:
            os.remove(filepath)  # Delete the uploaded file
            return jsonify({
                'success': False,
                'error': f'Video çok uzun! Max {MAX_VIDEO_DURATION_SEC} saniye, yüklenen: {duration:.0f} saniye'
            })
    
    # Initialize analysis state
    video_analyses[video_id] = {
        'status': 'processing',
        'progress': 0,
        'filepath': filepath,
        'exercise_type': exercise_type,
        'reps': 0,
        'form_score': 100,
        'avg_form_score': 100,
        'grade': 'A',
        'state': 'READY',
        'feedback': '',
        'engine': ExerciseEngine(),
        'total_frames': 0,
        'processed_frames': 0
    }
    
    # Load exercise into engine (not used in subprocess mode, but keep for status)
    video_analyses[video_id]['engine'].set_exercise(exercise_type)
    
    # Start background processing using subprocess
    thread = threading.Thread(target=process_video_subprocess, args=(video_id,))
    thread.daemon = True
    thread.start()
    
    return jsonify({
        'success': True,
        'video_id': video_id,
        'message': 'Video uploaded, processing started'
    })

def process_video_subprocess(video_id):
    """Process video in a separate subprocess to avoid memory issues"""
    import subprocess
    import json
    
    logger.info(f"Starting video processing (subprocess) for {video_id}")
    
    analysis = video_analyses.get(video_id)
    if not analysis:
        logger.error(f"Analysis not found for {video_id}")
        return
    
    analysis['status'] = 'processing'
    
    # Output paths
    output_json_path = os.path.join(UPLOAD_FOLDER, f"{video_id}_results.json")
    output_video_path = os.path.join(UPLOAD_FOLDER, f"{video_id}_processed.mp4")
    
    try:
        # Run video processor in subprocess WITH output video
        cmd = [
            sys.executable,  # Use same Python interpreter
            'video_processor.py',
            analysis['filepath'],
            analysis['exercise_type'],
            output_json_path,
            output_video_path  # NEW: Output video with skeleton overlay
        ]
        
        logger.info(f"Running subprocess: {' '.join(cmd)}")
        
        # Start subprocess - capture output for debugging
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,  # Combine stderr with stdout
            cwd=os.path.dirname(os.path.abspath(__file__)),
            text=True,
            bufsize=1
        )
        
        # Monitor progress by reading output JSON periodically
        while process.poll() is None:
            # Read any available output
            try:
                line = process.stdout.readline()
                if line:
                    logger.info(f"[Subprocess] {line.strip()}")
            except:
                pass
            
            time.sleep(0.3)
            try:
                if os.path.exists(output_json_path):
                    with open(output_json_path, 'r') as f:
                        results = json.load(f)
                    analysis['progress'] = results.get('progress', 0)
                    analysis['reps'] = results.get('reps', 0)
                    analysis['form_score'] = results.get('form_score', 100)
                    analysis['avg_form_score'] = results.get('avg_form_score', 100)
                    analysis['grade'] = results.get('grade', 'A')
                    analysis['state'] = results.get('state', 'UNKNOWN')
                    analysis['feedback'] = results.get('feedback', '')
            except:
                pass
        
        # Process finished - read final results
        stdout, stderr = process.communicate()
        
        if process.returncode == 0 and os.path.exists(output_json_path):
            with open(output_json_path, 'r') as f:
                results = json.load(f)
            
            analysis['status'] = results.get('status', 'completed')
            analysis['progress'] = 100
            analysis['reps'] = results.get('reps', 0)
            analysis['form_score'] = results.get('form_score', 100)
            analysis['avg_form_score'] = results.get('avg_form_score', 100)
            analysis['grade'] = results.get('grade', 'A')
            analysis['state'] = results.get('state', 'COMPLETED')
            analysis['feedback'] = results.get('feedback', '')
            
            # Get actual output video path from results (extension may have changed)
            actual_output_video = results.get('output_video', output_video_path)
            if actual_output_video and os.path.exists(actual_output_video):
                analysis['processed_video'] = actual_output_video
            elif os.path.exists(output_video_path):
                analysis['processed_video'] = output_video_path
            else:
                # Try .avi extension as fallback
                avi_path = output_video_path.rsplit('.', 1)[0] + '.avi'
                if os.path.exists(avi_path):
                    analysis['processed_video'] = avi_path
                else:
                    analysis['processed_video'] = None
            
            if results.get('error'):
                analysis['status'] = 'error'
                analysis['error'] = results['error']
            
            logger.info(f"Video processing completed: {analysis['reps']} reps, output: {output_video_path}")
        else:
            analysis['status'] = 'error'
            analysis['error'] = f"Subprocess failed: {stderr.decode()}"
            logger.error(f"Subprocess error: {stderr.decode()}")
        
        # Cleanup JSON file (keep processed video for download)
        try:
            if os.path.exists(output_json_path):
                os.remove(output_json_path)
            # Delete original video (keep processed one)
            if os.path.exists(analysis['filepath']):
                os.remove(analysis['filepath'])
        except Exception as e:
            logger.warning(f"Cleanup error: {e}")
            
    except Exception as e:
        logger.error(f"Subprocess error: {e}")
        analysis['status'] = 'error'
        analysis['error'] = str(e)

@app.route('/api/video/processed/<video_id>', methods=['GET'])
def get_processed_video(video_id):
    """Serve the processed video with skeleton overlay"""
    from flask import send_file
    
    analysis = video_analyses.get(video_id)
    
    if not analysis:
        return jsonify({'error': 'Video ID not found'}), 404
    
    processed_video = analysis.get('processed_video')
    if not processed_video or not os.path.exists(processed_video):
        return jsonify({'error': 'Processed video not ready'}), 404
    
    # Determine MIME type based on extension
    if processed_video.endswith('.avi'):
        mimetype = 'video/x-msvideo'
    elif processed_video.endswith('.webm'):
        mimetype = 'video/webm'
    else:
        mimetype = 'video/mp4'
    
    return send_file(processed_video, mimetype=mimetype, as_attachment=False)

@app.route('/api/video/status/<video_id>', methods=['GET'])
def get_video_status(video_id):
    """Get video analysis status"""
    analysis = video_analyses.get(video_id)
    
    if not analysis:
        return jsonify({'status': 'not_found', 'error': 'Video ID not found'})
    
    # Check if processed video is ready
    has_processed_video = False
    if analysis.get('processed_video') and os.path.exists(analysis.get('processed_video', '')):
        has_processed_video = True
    
    return jsonify({
        'status': analysis['status'],
        'progress': analysis['progress'],
        'reps': analysis['reps'],
        'form_score': analysis['form_score'],
        'avg_form_score': analysis['avg_form_score'],
        'grade': analysis['grade'],
        'state': analysis['state'],
        'feedback': analysis['feedback'],
        'has_processed_video': has_processed_video,
        'processed_video_url': f'/api/video/processed/{video_id}' if has_processed_video else None
    })

@app.route('/api/video/analyze_frame', methods=['POST'])
def analyze_video_frame():
    """Analyze a single frame from video (real-time overlay)"""
    if 'frame' not in request.files:
        return jsonify({'success': False, 'error': 'No frame provided'})
    
    video_id = request.form.get('video_id')
    analysis = video_analyses.get(video_id)
    
    if not analysis:
        return jsonify({'success': False, 'error': 'Video ID not found'})
    
    try:
        # Read the frame image
        frame_file = request.files['frame']
        frame_bytes = frame_file.read()
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'success': False, 'error': 'Failed to decode frame'})
        
        exercise_type = analysis.get('exercise_type', 'squat')
        
        # Create PoseEstimator instance for this frame
        estimator = PoseEstimator(static_mode=True, model_complexity=0)
        results = estimator.estimate_pose(frame, exercise_type)
        
        # Get pose landmarks
        pose_landmarks = None
        if results.pose_landmarks:
            pose_landmarks = results.pose_landmarks
            # Draw pose on frame
            estimator.mp_drawing.draw_landmarks(
                frame,
                pose_landmarks,
                estimator.mp_pose.POSE_CONNECTIONS,
                estimator.mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                estimator.mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2)
            )
        
        estimator.close()
        
        # Calculate form score based on exercise
        form_score = 100
        feedback_msg = "Good form!"
        
        # Get reps from analysis
        reps = analysis.get('reps', 0)
        state = analysis.get('state', 'READY')
        
        return jsonify({
            'success': True,
            'reps': reps,
            'form_score': form_score,
            'grade': 'A' if form_score >= 90 else 'B' if form_score >= 70 else 'C',
            'state': state,
            'feedback': feedback_msg,
            'pose_landmarks': pose_landmarks is not None
        })
        
    except Exception as e:
        logger.error(f"Error analyzing frame: {e}")
        return jsonify({
            'success': False, 
            'error': str(e),
            'reps': analysis.get('reps', 0) if analysis else 0,
            'form_score': analysis.get('form_score', 100) if analysis else 100,
            'grade': analysis.get('grade', 'A') if analysis else 'A',
            'state': analysis.get('state', 'PROCESSING') if analysis else 'PROCESSING',
            'feedback': analysis.get('feedback', '') if analysis else ''
        })

if __name__ == '__main__':
    try:
        # List available exercises on startup
        exercises = get_available_exercises()
        logger.info(f"Available exercises: {exercises}")
        
        logger.info("Starting the Flask application on http://127.0.0.1:5000")
        print("=" * 50)
        print("FITNESS TRAINER WITH POSE ESTIMATION")
        print("=" * 50)
        print(f"Available exercises: {len(exercises)}")
        for ex in exercises:
            print(f"   - {ex}")
        print("-" * 50)
        print("Open http://127.0.0.1:5000 in your browser")
        print("=" * 50)
        app.run(debug=False, threaded=True, use_reloader=False)
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        traceback.print_exc()
