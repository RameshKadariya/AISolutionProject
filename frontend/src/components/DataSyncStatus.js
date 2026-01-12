import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import smartDataManager from '../utils/smartDataManager';
import './DataSyncStatus.css';

const DataSyncStatus = () => {
  const { isDarkMode } = useTheme();
  const [syncStatus, setSyncStatus] = useState({});

  useEffect(() => {
    updateSyncStatus();
    const interval = setInterval(updateSyncStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateSyncStatus = () => {
    const status = smartDataManager.getDataSummary();
    setSyncStatus(status);
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'High': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Standard': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getQualityIcon = (quality) => {
    switch (quality) {
      case 'High': return '🟢';
      case 'Medium': return '🟡';
      case 'Standard': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <motion.div 
      className={`data-sync-status ${isDarkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="sync-header">
        <h4>📊 Data Synchronization Status</h4>
        <div className="sync-timestamp">
          Last sync: {syncStatus.lastSync?.toLocaleTimeString()}
        </div>
      </div>
      
      <div className="sync-metrics">
        <div className="sync-metric">
          <div className="metric-icon">📝</div>
          <div className="metric-info">
            <div className="metric-label">Real Inquiries</div>
            <div className="metric-value">{syncStatus.realInquiries || 0}</div>
          </div>
        </div>
        
        <div className="sync-metric">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <div className="metric-label">Analytics Total</div>
            <div className="metric-value">{syncStatus.simulatedTotal?.toLocaleString() || '0'}</div>
          </div>
        </div>
        
        <div className="sync-metric">
          <div className="metric-icon">⚡</div>
          <div className="metric-info">
            <div className="metric-label">Data Scale</div>
            <div className="metric-value">×{syncStatus.multiplier || 1}</div>
          </div>
        </div>
        
        <div className="sync-metric">
          <div className="metric-icon">{getQualityIcon(syncStatus.dataQuality)}</div>
          <div className="metric-info">
            <div className="metric-label">Data Quality</div>
            <div 
              className="metric-value quality"
              style={{ color: getQualityColor(syncStatus.dataQuality) }}
            >
              {syncStatus.dataQuality || 'Unknown'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="sync-explanation">
        <div className="explanation-icon">💡</div>
        <div className="explanation-text">
          {syncStatus.realInquiries > 0 ? (
            <>
              Your analytics dashboard processes <strong>{syncStatus.realInquiries} inquiries</strong> and 
              provides comprehensive analytics visualization.
            </>
          ) : (
            <>
              Currently using <strong>sample data</strong> for analytics visualization. 
              Real inquiries from your contact form will automatically sync to provide 
              more accurate analytics.
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DataSyncStatus;