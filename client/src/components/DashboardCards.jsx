import React, { useState, useEffect } from 'react';
import './DashboardCards.css';

const DashboardCards = ({ stats }) => {
  // Calculate study time from localStorage
  const [studyTime, setStudyTime] = useState(localStorage.getItem('studyTime') || '0:00:00');

  useEffect(() => {
    // Listen for storage events to update study time
    const handleStorageChange = () => {
      const newTime = localStorage.getItem('studyTime') || '0:00:00';
      setStudyTime(newTime);
    };

    // Listen for custom storage events (same window updates)
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('studyTimeUpdate', handleStorageChange);
    
    // Also check periodically for updates (in case of same-window updates)
    const interval = setInterval(() => {
      const newTime = localStorage.getItem('studyTime') || '0:00:00';
      setStudyTime((prevTime) => {
        if (newTime !== prevTime) {
          return newTime;
        }
        return prevTime;
      });
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('studyTimeUpdate', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const cards = [
    {
      title: 'Notes',
      count: stats.notesCount || 0,
      icon: '📝',
      color: 'purple'
    },
    {
      title: 'Conversations',
      count: stats.conversationsCount || 0,
      icon: '💬',
      color: 'cyan'
    },
    {
      title: 'Quick Notes',
      count: stats.quickNotesCount || 0,
      icon: '⚡',
      color: 'orange'
    },
    {
      title: 'Study Time',
      count: studyTime,
      icon: '⏱️',
      color: 'green'
    }
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <div key={index} className={`dashboard-card card-${card.color}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <h3>{card.title}</h3>
            <p className="card-count">{card.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;

