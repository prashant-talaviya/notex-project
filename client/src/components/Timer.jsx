import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    // Load saved time from localStorage
    const savedTime = localStorage.getItem('studyTimeSeconds') || '0';
    const savedStartTime = localStorage.getItem('studyStartTime');
    
    if (savedStartTime && !isRunning) {
      const elapsed = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
      setTime(parseInt(savedTime) + elapsed);
    } else {
      setTime(parseInt(savedTime));
    }
  }, []);

  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          localStorage.setItem('studyTimeSeconds', newTime.toString());
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    localStorage.setItem('studyStartTime', Date.now().toString());
  };

  const handlePause = () => {
    setIsRunning(false);
    localStorage.removeItem('studyStartTime');
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setStartTime(null);
    localStorage.removeItem('studyTimeSeconds');
    localStorage.removeItem('studyStartTime');
    // Update dashboard display
    localStorage.setItem('studyTime', '0:00:00');
    window.dispatchEvent(new Event('studyTimeUpdate'));
  };

  // Update study time in localStorage for dashboard display
  useEffect(() => {
    localStorage.setItem('studyTime', formatTime(time));
    // Dispatch custom event for same-window listeners
    window.dispatchEvent(new Event('studyTimeUpdate'));
  }, [time]);

  return (
    <div className="timer card">
      <h2 className="section-title">⏱️ Study Timer</h2>
      
      <div className="timer-display">
        <div className="timer-time">{formatTime(time)}</div>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={handleStart} className="btn btn-success">
            Start
          </button>
        ) : (
          <button onClick={handlePause} className="btn btn-secondary">
            Pause
          </button>
        )}
        <button onClick={handleReset} className="btn btn-danger">
          Reset
        </button>
      </div>

      <p className="timer-info">
        Track your study sessions and build consistent study habits!
      </p>
    </div>
  );
};

export default Timer;

