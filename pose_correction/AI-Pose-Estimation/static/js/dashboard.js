document.addEventListener('DOMContentLoaded', function() {
    // Update charts with real data when available
    function updateChartsWithServerData() {
        fetch('/dashboard_data')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update weekly activity chart
                    if (data.weekly_activity) {
                        updateWeeklyChart(data.weekly_activity);
                    }
                    
                    // Update exercise distribution chart
                    if (data.exercise_distribution) {
                        updateExerciseChart(data.exercise_distribution);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error);
            });
    }
    
    function updateWeeklyChart(weeklyData) {
        // Get the chart instance
        const weeklyChart = Chart.getChart('weeklyChart');
        if (weeklyChart) {
            // Update with new data
            weeklyChart.data.datasets[0].data = weeklyData.values;
            weeklyChart.update();
        }
    }
    
    function updateExerciseChart(exerciseData) {
        // Get the chart instance
        const exerciseChart = Chart.getChart('exerciseChart');
        if (exerciseChart) {
            // Update with new data
            exerciseChart.data.labels = exerciseData.labels;
            exerciseChart.data.datasets[0].data = exerciseData.values;
            exerciseChart.update();
        }
    }
    
    // Call once on page load
    setTimeout(updateChartsWithServerData, 1000);
    
    // Set up refresh button if it exists
    const refreshBtn = document.getElementById('refresh-stats');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            updateChartsWithServerData();
        });
    }
});
