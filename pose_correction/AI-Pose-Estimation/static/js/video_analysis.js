// Video Analysis Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadArea = document.getElementById('upload-area');
    const videoInput = document.getElementById('video-input');
    const browseBtn = document.getElementById('browse-btn');
    const videoPlayer = document.getElementById('video-player');
    const analysisCanvas = document.getElementById('analysis-canvas');
    const ctx = analysisCanvas.getContext('2d');
    
    const playBtn = document.getElementById('play-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const stopAnalysisBtn = document.getElementById('stop-analysis-btn');
    const resetBtn = document.getElementById('reset-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    const exerciseSelect = document.getElementById('exercise-select');
    const exerciseInfoPanel = document.getElementById('exercise-info-panel');
    const miniType = document.getElementById('mini-type');
    const miniDescription = document.getElementById('mini-description');
    
    const statReps = document.getElementById('stat-reps');
    const statScore = document.getElementById('stat-score');
    const statGrade = document.getElementById('stat-grade');
    const statState = document.getElementById('stat-state');
    const gaugeFill = document.getElementById('gauge-fill');
    const gaugeValue = document.getElementById('gauge-value');
    const feedbackLog = document.getElementById('feedback-log');
    const reportSection = document.getElementById('report-section');
    const reportContent = document.getElementById('report-content');
    const downloadReportBtn = document.getElementById('download-report-btn');
    
    // Terminal Elements
    const terminalContent = document.getElementById('terminal-content');
    const terminalStatus = document.getElementById('terminal-status');
    const terminalToggle = document.getElementById('terminal-toggle');
    const terminalBody = document.getElementById('terminal-body');
    
    // State
    let videoFile = null;
    let isAnalyzing = false;
    let analysisInterval = null;
    let exercisesData = {};
    let analysisResults = {
        reps: 0,
        scores: [],
        feedbacks: [],
        startTime: null,
        endTime: null
    };
    
    // ==================== Terminal/Log Functions ====================
    function getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    
    function addLog(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.innerHTML = `<span class="timestamp">[${getTimestamp()}]</span> ${message}`;
        terminalContent.appendChild(line);
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }
    
    function setTerminalStatus(status, type = 'idle') {
        terminalStatus.textContent = `● ${status}`;
        terminalStatus.className = `terminal-status ${type}`;
    }
    
    function clearTerminal() {
        terminalContent.innerHTML = '<div class="log-line info"><span class="timestamp">[' + getTimestamp() + ']</span> Terminal cleared. Ready for new analysis...</div>';
    }
    
    // Terminal toggle
    if (terminalToggle) {
        terminalToggle.addEventListener('click', function() {
            terminalBody.classList.toggle('collapsed');
            terminalToggle.classList.toggle('collapsed');
        });
    }
    
    // Initialize terminal
    addLog('System initialized. Ready for video upload.', 'info');
    
    // Exercise type info
    const exerciseTypeInfo = {
        'bilateral': { label: '↔️ Bilateral', color: '#9b59b6', class: 'bilateral' },
        'duration': { label: '⏱️ Duration', color: '#e67e22', class: 'duration' },
        'standard': { label: '🔄 Standard', color: '#3498db', class: 'standard' }
    };
    
    // Load exercises
    async function loadExercises() {
        try {
            addLog('Loading available exercises...', 'info');
            const response = await fetch('/exercises');
            const data = await response.json();
            exercisesData = data;
            
            data.exercises.forEach(exercise => {
                const info = data.info[exercise] || {};
                const option = document.createElement('option');
                option.value = exercise;
                option.textContent = info.name || exercise.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                exerciseSelect.appendChild(option);
            });
            addLog(`Loaded ${data.exercises.length} exercises successfully.`, 'success');
        } catch (error) {
            console.error('Error loading exercises:', error);
            addLog(`Error loading exercises: ${error.message}`, 'error');
        }
    }
    
    // Exercise selection change
    exerciseSelect.addEventListener('change', function() {
        const exercise = this.value;
        if (exercise && exercisesData.info[exercise]) {
            const info = exercisesData.info[exercise];
            const typeInfo = exerciseTypeInfo[info.type] || exerciseTypeInfo['standard'];
            addLog(`Selected exercise: ${info.name || exercise} (${info.type})`, 'info');
            
            miniType.textContent = typeInfo.label;
            miniType.className = `mini-badge ${typeInfo.class}`;
            miniDescription.textContent = info.description || 'No description available';
            exerciseInfoPanel.classList.remove('hidden');
            
            // Enable analyze button if video is loaded
            if (videoFile) {
                analyzeBtn.disabled = false;
            }
        } else {
            exerciseInfoPanel.classList.add('hidden');
            analyzeBtn.disabled = true;
        }
    });
    
    // File upload handling
    browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        videoInput.click();
    });
    
    uploadArea.addEventListener('click', () => videoInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('video/')) {
            handleVideoFile(files[0]);
        }
    });
    
    videoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleVideoFile(e.target.files[0]);
        }
    });
    
    function handleVideoFile(file) {
        videoFile = file;
        const url = URL.createObjectURL(file);
        videoPlayer.src = url;
        videoPlayer.hidden = false;
        uploadArea.hidden = true;
        
        playBtn.disabled = false;
        resetBtn.disabled = false;
        
        if (exerciseSelect.value) {
            analyzeBtn.disabled = false;
        }
        
        // Terminal logs
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        addLog(`Video file loaded: ${file.name}`, 'success');
        addLog(`File size: ${fileSizeMB} MB | Type: ${file.type}`, 'info');
        
        addFeedback('info', `Video loaded: ${file.name}`);
    }
    
    // Video controls
    playBtn.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
            playBtn.textContent = '⏸️ Pause';
        } else {
            videoPlayer.pause();
            playBtn.textContent = '▶️ Play';
        }
    });
    
    videoPlayer.addEventListener('play', () => {
        playBtn.textContent = '⏸️ Pause';
    });
    
    videoPlayer.addEventListener('pause', () => {
        playBtn.textContent = '▶️ Play';
    });
    
    videoPlayer.addEventListener('timeupdate', () => {
        if (!isAnalyzing && videoPlayer.duration && !isNaN(videoPlayer.duration)) {
            const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }
    });
    
    // Reset
    resetBtn.addEventListener('click', () => {
        stopAnalysis();
        videoPlayer.hidden = true;
        videoPlayer.src = '';
        uploadArea.hidden = false;
        analysisCanvas.hidden = true;
        videoFile = null;
        
        playBtn.disabled = true;
        analyzeBtn.disabled = true;
        resetBtn.disabled = true;
        
        resetStats();
        reportSection.classList.add('hidden');
        feedbackLog.innerHTML = '<div class="feedback-item info"><span class="feedback-time">--:--</span><span class="feedback-text">Upload a video and start analysis to see feedback</span></div>';
    });
    
    // Start Analysis
    analyzeBtn.addEventListener('click', async () => {
        if (!videoFile || !exerciseSelect.value) return;
        
        isAnalyzing = true;
        analyzeBtn.disabled = true;
        stopAnalysisBtn.disabled = false;
        exerciseSelect.disabled = true;
        
        analysisResults = {
            reps: 0,
            scores: [],
            feedbacks: [],
            startTime: new Date(),
            endTime: null
        };
        
        // Terminal logs
        setTerminalStatus('Processing', 'running');
        addLog('═══════════════════════════════════════════════', 'info');
        addLog('Starting video analysis...', 'processing');
        addLog(`Exercise: ${exerciseSelect.options[exerciseSelect.selectedIndex].text}`, 'info');
        addLog(`Video: ${videoFile.name}`, 'info');
        
        addFeedback('info', `Starting analysis for ${exerciseSelect.options[exerciseSelect.selectedIndex].text}`);
        
        // Upload video and start analysis
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('exercise_type', exerciseSelect.value);
        
        addLog('Uploading video to server...', 'processing');
        
        try {
            const response = await fetch('/api/video/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            if (data.success) {
                addLog(`Upload complete. Video ID: ${data.video_id}`, 'success');
                addLog('Initializing pose estimation engine...', 'processing');
                addLog('Starting frame-by-frame analysis...', 'processing');
                addFeedback('success', 'Video uploaded successfully. Processing...');
                startAnalysisPolling(data.video_id);
            } else {
                addLog(`Upload failed: ${data.error}`, 'error');
                setTerminalStatus('Error', 'error');
                addFeedback('error', `Upload failed: ${data.error}`);
                stopAnalysis();
            }
        } catch (error) {
            console.error('Error:', error);
            addLog(`Network error: ${error.message}`, 'error');
            setTerminalStatus('Error', 'error');
            addFeedback('error', 'Failed to upload video');
            stopAnalysis();
        }
    });
    
    // Poll for analysis results
    let lastProgress = 0;
    
    function startAnalysisPolling(videoId) {
        // Setup canvas
        analysisCanvas.width = videoPlayer.videoWidth || 640;
        analysisCanvas.height = videoPlayer.videoHeight || 480;
        analysisCanvas.hidden = false;
        
        videoPlayer.currentTime = 0;
        videoPlayer.play();
        
        analysisInterval = setInterval(async () => {
            if (!isAnalyzing) {
                clearInterval(analysisInterval);
                return;
            }
            
            try {
                const response = await fetch(`/api/video/status/${videoId}`);
                const data = await response.json();
                
                if (data.status === 'processing') {
                    // Update progress
                    progressFill.style.width = `${data.progress}%`;
                    progressText.textContent = `Processing: ${Math.round(data.progress)}%`;
                    
                    // Log progress at intervals
                    const currentProgress = Math.floor(data.progress / 10) * 10;
                    if (currentProgress > lastProgress && currentProgress > 0) {
                        addLog(`Progress: ${currentProgress}% | Reps: 5 | Score: ${data.form_score || '--'}`, 'progress');
                        lastProgress = currentProgress;
                    }
                    
                    // Update stats
                    updateStats(data);
                    
                } else if (data.status === 'completed') {
                    clearInterval(analysisInterval);
                    analysisResults.endTime = new Date();
                    
                    // IMPORTANT: Update stats with final values before showing report
                    updateStats(data);
                    
                    // Set progress to 100%
                    progressFill.style.width = '100%';
                    progressText.textContent = '100%';
                    
                    // Terminal completion logs
                    addLog('═══════════════════════════════════════════════', 'success');
                    addLog('✓ Analysis completed successfully!', 'success');
                    addLog(`Total Reps: ${data.reps || 0}`, 'success');
                    addLog(`Average Score: ${data.avg_form_score || data.form_score || '--'}/100`, 'success');
                    addLog(`Grade: ${data.grade || '--'}`, 'success');
                    setTerminalStatus('Completed', 'success');
                    
                    // Check if processed video with skeleton is available
                    if (data.has_processed_video && data.processed_video_url) {
                        addLog('Loading processed video with skeleton overlay...', 'processing');
                        addFeedback('success', 'Analysis completed! Loading video with skeleton overlay...');
                        
                        // Replace video source with processed video
                        videoPlayer.src = data.processed_video_url;
                        videoPlayer.load();
                        videoPlayer.play();
                        
                        addLog('Video with skeleton overlay loaded.', 'success');
                        addFeedback('info', '🦴 Video with skeleton overlay is now playing');
                    } else {
                        addFeedback('success', 'Analysis completed!');
                    }
                    
                    showReport(data);
                    stopAnalysis();
                    
                } else if (data.status === 'error') {
                    clearInterval(analysisInterval);
                    addLog(`✗ Analysis error: ${data.error}`, 'error');
                    setTerminalStatus('Error', 'error');
                    addFeedback('error', `Analysis error: ${data.error}`);
                    stopAnalysis();
                }
            } catch (error) {
                console.error('Polling error:', error);
                addLog(`Network error during polling: ${error.message}`, 'warning');
            }
        }, 200);
        
        // Also poll frame-by-frame for real-time display
        requestAnimationFrame(function frameLoop() {
            if (isAnalyzing && !videoPlayer.paused) {
                sendFrameForAnalysis(videoId);
                requestAnimationFrame(frameLoop);
            }
        });
    }
    
    async function sendFrameForAnalysis(videoId) {
        // Create a temporary canvas to capture current frame
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = videoPlayer.videoWidth;
        tempCanvas.height = videoPlayer.videoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(videoPlayer, 0, 0);
        
        try {
            const blob = await new Promise(resolve => tempCanvas.toBlob(resolve, 'image/jpeg', 0.8));
            const formData = new FormData();
            formData.append('frame', blob);
            formData.append('video_id', videoId);
            formData.append('timestamp', videoPlayer.currentTime);
            
            const response = await fetch('/api/video/analyze_frame', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            if (data.success) {
                // Draw pose on canvas
                drawPoseOnCanvas(data);
                updateStats(data);
                
                // Check for new feedback
                if (data.feedback && data.feedback !== lastFeedback) {
                    addFeedback('warning', data.feedback);
                    lastFeedback = data.feedback;
                }
            }
        } catch (error) {
            // Silently fail for frame analysis
        }
    }
    
    let lastFeedback = '';
    
    function drawPoseOnCanvas(data) {
        ctx.clearRect(0, 0, analysisCanvas.width, analysisCanvas.height);
        
        if (!data.landmarks) return;
        
        // Draw skeleton
        const connections = [
            [11, 13], [13, 15], // Left arm
            [12, 14], [14, 16], // Right arm
            [11, 12], // Shoulders
            [11, 23], [12, 24], // Torso
            [23, 24], // Hips
            [23, 25], [25, 27], // Left leg
            [24, 26], [26, 28]  // Right leg
        ];
        
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        
        connections.forEach(([i, j]) => {
            if (data.landmarks[i] && data.landmarks[j]) {
                ctx.beginPath();
                ctx.moveTo(data.landmarks[i].x * analysisCanvas.width, data.landmarks[i].y * analysisCanvas.height);
                ctx.lineTo(data.landmarks[j].x * analysisCanvas.width, data.landmarks[j].y * analysisCanvas.height);
                ctx.stroke();
            }
        });
        
        // Draw points
        ctx.fillStyle = '#ff0000';
        Object.values(data.landmarks).forEach(point => {
            if (point) {
                ctx.beginPath();
                ctx.arc(point.x * analysisCanvas.width, point.y * analysisCanvas.height, 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }
    
    function updateStats(data) {
        if (data.reps !== undefined) {
            statReps.textContent = data.reps;
            analysisResults.reps = data.reps;
        }
        
        if (data.form_score !== undefined) {
            const score = Math.round(data.form_score);
            statScore.textContent = score;
            gaugeValue.textContent = score;
            analysisResults.scores.push(score);
            
            // Update gauge
            const offset = 251.2 - (251.2 * score / 100);
            gaugeFill.style.strokeDashoffset = offset;
            
            // Color based on score
            let color = '#27ae60'; // Green
            if (score < 60) color = '#e74c3c'; // Red
            else if (score < 70) color = '#e67e22'; // Orange
            else if (score < 80) color = '#f1c40f'; // Yellow
            else if (score < 90) color = '#3498db'; // Blue
            gaugeFill.style.stroke = color;
        }
        
        if (data.grade !== undefined) {
            statGrade.textContent = data.grade;
            statGrade.className = `stat-value grade grade-${data.grade.toLowerCase()}`;
        }
        
        if (data.state !== undefined) {
            statState.textContent = data.state;
        }
    }
    
    function resetStats() {
        statReps.textContent = '0';
        statScore.textContent = '--';
        statGrade.textContent = '--';
        statState.textContent = '--';
        gaugeValue.textContent = '--';
        gaugeFill.style.strokeDashoffset = 251.2;
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
    }
    
    // Stop Analysis
    stopAnalysisBtn.addEventListener('click', () => {
        addLog('Analysis stopped by user.', 'warning');
        setTerminalStatus('Stopped', 'idle');
        stopAnalysis();
        addFeedback('info', 'Analysis stopped by user');
    });
    
    function stopAnalysis() {
        isAnalyzing = false;
        lastProgress = 0;  // Reset progress tracker
        if (analysisInterval) {
            clearInterval(analysisInterval);
            analysisInterval = null;
        }
        
        videoPlayer.pause();
        analyzeBtn.disabled = false;
        stopAnalysisBtn.disabled = true;
        exerciseSelect.disabled = false;
    }
    
    // Add feedback to log
    function addFeedback(type, message) {
        const now = new Date();
        const timeStr = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        const item = document.createElement('div');
        item.className = `feedback-item ${type}`;
        item.innerHTML = `<span class="feedback-time">${timeStr}</span><span class="feedback-text">${message}</span>`;
        
        feedbackLog.insertBefore(item, feedbackLog.firstChild);
        
        // Keep only last 50 items
        while (feedbackLog.children.length > 50) {
            feedbackLog.removeChild(feedbackLog.lastChild);
        }
        
        analysisResults.feedbacks.push({ time: timeStr, type, message });
    }
    
    // Show final report
    function showReport(data) {
        const avgScore = analysisResults.scores.length > 0 
            ? Math.round(analysisResults.scores.reduce((a, b) => a + b, 0) / analysisResults.scores.length)
            : 0;
        
        const duration = analysisResults.endTime && analysisResults.startTime
            ? Math.round((analysisResults.endTime - analysisResults.startTime) / 1000)
            : 0;
        
        const grade = avgScore >= 90 ? 'A' : avgScore >= 80 ? 'B' : avgScore >= 70 ? 'C' : avgScore >= 60 ? 'D' : 'F';
        
        reportContent.innerHTML = `
            <div class="report-row">
                <span class="report-label">Exercise</span>
                <span class="report-value">${exerciseSelect.options[exerciseSelect.selectedIndex].text}</span>
            </div>
            <div class="report-row">
                <span class="report-label">Total Reps</span>
                <span class="report-value">${analysisResults.reps}</span>
            </div>
            <div class="report-row">
                <span class="report-label">Average Form Score</span>
                <span class="report-value">${avgScore}/100</span>
            </div>
            <div class="report-row">
                <span class="report-label">Final Grade</span>
                <span class="report-value">${grade}</span>
            </div>
            <div class="report-row">
                <span class="report-label">Duration</span>
                <span class="report-value">${duration}s</span>
            </div>
            <div class="report-row">
                <span class="report-label">Form Warnings</span>
                <span class="report-value">${analysisResults.feedbacks.filter(f => f.type === 'warning').length}</span>
            </div>
        `;
        
        reportSection.classList.remove('hidden');
    }
    
    // Download report
    downloadReportBtn.addEventListener('click', () => {
        const reportText = `
FITNESS TRAINER - VIDEO ANALYSIS REPORT
========================================
Date: ${new Date().toLocaleString()}
Video: ${videoFile ? videoFile.name : 'Unknown'}
Exercise: ${exerciseSelect.options[exerciseSelect.selectedIndex].text}

RESULTS
-------
Total Repetitions: ${analysisResults.reps}
Average Form Score: ${analysisResults.scores.length > 0 ? Math.round(analysisResults.scores.reduce((a, b) => a + b, 0) / analysisResults.scores.length) : 0}/100

FEEDBACK LOG
------------
${analysisResults.feedbacks.map(f => `[${f.time}] ${f.type.toUpperCase()}: ${f.message}`).join('\n')}
        `;
        
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fitness_report_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });
    
    // Initialize
    loadExercises();
});
