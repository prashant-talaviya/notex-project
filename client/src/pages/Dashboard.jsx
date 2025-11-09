import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import DashboardCards from '../components/DashboardCards';
import QuickNotes from '../components/QuickNotes';
import RecentNotes from '../components/RecentNotes';
import AIShortcuts from '../components/AIShortcuts';
import Timer from '../components/Timer';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    notesCount: 0,
    conversationsCount: 0,
    quickNotesCount: 0,
    recentNotes: [],
    dailyTip: ''
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <h1>Welcome back, {user.name || 'Student'} 👋</h1>
        <p className="motivational-quote">
          "{stats.dailyTip || 'Stay focused and take breaks to maintain productivity!'}"
        </p>
      </div>

      <DashboardCards stats={stats} />

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <QuickNotes onUpdate={fetchStats} />
        </div>

        <div className="dashboard-section">
          <RecentNotes notes={stats.recentNotes} navigate={navigate} />
        </div>
      </div>

      <div className="dashboard-section">
        <AIShortcuts />
      </div>

      <div className="dashboard-section">
        <Timer />
      </div>
    </div>
  );
};

export default Dashboard;

