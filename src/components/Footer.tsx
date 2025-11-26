import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Video Streaming Dashboard</h3>
          <p>Real-time multi-camera monitoring system with synchronized playback.</p>
        </div>
        
        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>Live HLS Streaming</li>
            <li>Multi-camera Sync</li>
            <li>Responsive Design</li>
            <li>Real-time Monitoring</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Technology</h4>
          <ul>
            <li>React + TypeScript</li>
            <li>Video.js + HLS.js</li>
            <li>HTML5 Video</li>
            <li>Responsive CSS</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>support@streamdashboard.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Video Streaming Dashboard. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;