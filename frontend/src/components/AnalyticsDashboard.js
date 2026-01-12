import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import dataGenerator from '../utils/dataGenerator';
import smartDataManager from '../utils/smartDataManager';
import AdvancedMetrics from './AdvancedMetrics';
import './AnalyticsDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsDashboard = () => {
  const { isDarkMode } = useTheme();
  const [metrics, setMetrics] = useState({});
  const [historicalData, setHistoricalData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [industryData, setIndustryData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeView, setActiveView] = useState('overview');
  const intervalRef = useRef(null);

  // Initialize data
  useEffect(() => {
    loadInitialData();
    startRealTimeUpdates();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    
    // Simulate loading delay for realistic effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setMetrics(smartDataManager.generateRealTimeMetrics());
    setHistoricalData(smartDataManager.generateHistoricalData(30));
    setHourlyData(smartDataManager.generateHourlyData());
    setCountryData(smartDataManager.generateCountryData());
    setIndustryData(smartDataManager.generateIndustryData());
    setServiceData(dataGenerator.generateServiceData());
    setDeviceData(dataGenerator.generateDeviceData());
    setLiveActivity(smartDataManager.generateLiveActivity(15));
    
    setIsLoading(false);
  };

  const startRealTimeUpdates = () => {
    intervalRef.current = setInterval(() => {
      // Update metrics every 5 seconds
      setMetrics(smartDataManager.generateRealTimeMetrics());
      setLastUpdate(new Date());
      
      // Occasionally add new activity
      if (Math.random() < 0.4) {
        const newActivity = smartDataManager.generateLiveActivity(1)[0];
        setLiveActivity(prev => [newActivity, ...prev.slice(0, 14)]);
      }
      
      // Update hourly data every minute (simulated)
      if (Math.random() < 0.1) {
        setHourlyData(smartDataManager.generateHourlyData());
      }
    }, 5000);
  };

  // Chart configurations
  const getChartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#ffffff' : '#333333',
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: title,
        color: isDarkMode ? '#ffffff' : '#333333',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#ffffff' : '#333333',
        bodyColor: isDarkMode ? '#ffffff' : '#333333',
        borderColor: '#ff9900',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { color: isDarkMode ? '#ffffff' : '#333333' },
        grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
      },
      y: {
        ticks: { color: isDarkMode ? '#ffffff' : '#333333' },
        grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
      }
    }
  });

  // Chart data configurations
  const inquiryTrendData = {
    labels: historicalData.map(d => d.date.slice(-5)),
    datasets: [
      {
        label: 'Daily Inquiries',
        data: historicalData.map(d => d.inquiries),
        borderColor: '#ff9900',
        backgroundColor: 'rgba(255, 153, 0, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ff9900',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  const hourlyActivityData = {
    labels: hourlyData.map(d => d.hour),
    datasets: [
      {
        label: 'Hourly Inquiries',
        data: hourlyData.map(d => d.inquiries),
        backgroundColor: 'rgba(255, 153, 0, 0.8)',
        borderColor: '#ff9900',
        borderWidth: 2,
        borderRadius: 4
      }
    ]
  };

  const industryDistributionData = {
    labels: industryData.map(d => d.name),
    datasets: [
      {
        data: industryData.map(d => d.inquiries),
        backgroundColor: industryData.map(d => d.color),
        borderColor: isDarkMode ? '#ffffff' : '#333333',
        borderWidth: 2
      }
    ]
  };

  const servicePopularityData = {
    labels: serviceData.map(d => d.name),
    datasets: [
      {
        data: serviceData.map(d => d.inquiries),
        backgroundColor: serviceData.map(d => d.color),
        borderColor: isDarkMode ? '#ffffff' : '#333333',
        borderWidth: 2
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="analytics-loading">
        <motion.div
          className="loading-spinner-large"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          📊
        </motion.div>
        <h3>Loading Analytics Dashboard...</h3>
        <p>Preparing real-time insights</p>
      </div>
    );
  }

  return (
    <div className={`analytics-dashboard ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h2>📊 Real-time Analytics Dashboard</h2>
          <div className="header-controls">
            <div className="view-switcher">
              <button 
                className={`view-btn ${activeView === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveView('overview')}
              >
                📊 Overview
              </button>
              <button 
                className={`view-btn ${activeView === 'advanced' ? 'active' : ''}`}
                onClick={() => setActiveView('advanced')}
              >
                🚀 Advanced
              </button>
            </div>
            <div className="dashboard-info">
              <div className="data-source-indicator">
                <span className="data-icon">🔗</span>
                <span className="data-text">
                  Based on {metrics.realInquiriesCount || 0} inquiries processed
                </span>
              </div>
              <div className="last-updated">
                <span className="update-indicator"></span>
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Conditional Content Based on Active View */}
      {activeView === 'advanced' ? (
        <AdvancedMetrics />
      ) : (
        <>
          {/* Key Metrics Cards */}
          <motion.div 
            className="metrics-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>Total Inquiries</h3>
            <div className="metric-value">{metrics.totalInquiries?.toLocaleString()}</div>
            <div className="metric-change positive">+{metrics.monthlyGrowth}% this month</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h3>Avg Response Time</h3>
            <div className="metric-value">{metrics.avgResponseTime}h</div>
            <div className="metric-change positive">-15% improvement</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>Conversion Rate</h3>
            <div className="metric-value">{metrics.conversionRate}%</div>
            <div className="metric-change positive">+{metrics.weeklyGrowth}% this week</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌍</div>
          <div className="metric-content">
            <h3>Global Reach</h3>
            <div className="metric-value">{metrics.activeCountries}</div>
            <div className="metric-change neutral">countries active</div>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Inquiry Trend Chart */}
        <motion.div 
          className="chart-container large"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="chart-header">
            <h3>📈 Inquiry Trends (30 Days)</h3>
            <div className="chart-actions">
              <button className="chart-action">📊 Export</button>
              <button className="chart-action">🔍 Details</button>
            </div>
          </div>
          <div className="chart-content">
            <Line data={inquiryTrendData} options={getChartOptions('Daily Inquiry Volume')} />
          </div>
        </motion.div>

        {/* Hourly Activity */}
        <motion.div 
          className="chart-container medium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="chart-header">
            <h3>⏰ Hourly Activity</h3>
          </div>
          <div className="chart-content">
            <Bar data={hourlyActivityData} options={getChartOptions('Inquiries by Hour')} />
          </div>
        </motion.div>

        {/* Industry Distribution */}
        <motion.div 
          className="chart-container medium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="chart-header">
            <h3>🏭 Industry Breakdown</h3>
          </div>
          <div className="chart-content">
            <Doughnut data={industryDistributionData} options={getChartOptions('Inquiries by Industry')} />
          </div>
        </motion.div>

        {/* Service Popularity */}
        <motion.div 
          className="chart-container medium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="chart-header">
            <h3>🎯 Service Popularity</h3>
          </div>
          <div className="chart-content">
            <Pie data={servicePopularityData} options={getChartOptions('Most Requested Services')} />
          </div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div 
          className="chart-container medium activity-feed"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="chart-header">
            <h3>🔴 Live Activity Feed</h3>
            <div className="live-indicator">
              <span className="pulse-dot"></span>
              LIVE
            </div>
          </div>
          <div className="activity-list">
            <AnimatePresence>
              {liveActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className={`activity-item priority-${activity.priority.toLowerCase()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="activity-icon">
                    {activity.priority === 'High' ? '🔥' : activity.priority === 'Medium' ? '⚡' : '📝'}
                  </div>
                  <div className="activity-content">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-meta">
                      <span className="activity-time">
                        {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="activity-value">
                        ${activity.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div 
          className="chart-container large"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="chart-header">
            <h3>🌍 Geographic Distribution</h3>
          </div>
          <div className="geographic-content">
            <div className="country-list">
              {countryData.slice(0, 8).map((country, index) => (
                <div key={country.code} className="country-item">
                  <div className="country-flag">{country.code}</div>
                  <div className="country-info">
                    <div className="country-name">{country.name}</div>
                    <div className="country-stats">
                      <span className="inquiries">{country.inquiries} inquiries</span>
                      <span className="revenue">${country.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="country-bar">
                    <div 
                      className="country-progress"
                      style={{ width: `${(country.inquiries / countryData[0].inquiries) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;