import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './VideoBackground.css';

const VideoBackground = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`video-background ${isDarkMode ? 'dark' : 'light'}`}>
      <iframe
        src="https://www.youtube.com/embed/0Gs3g24iuS8?autoplay=1&mute=1&controls=0&loop=1&playlist=0Gs3g24iuS8&showinfo=0&rel=0"
        title="AI Technology Background"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`video-iframe ${isDarkMode ? 'dark-video' : 'light-video'}`}
      ></iframe>
    </div>
  );
};

export default VideoBackground;