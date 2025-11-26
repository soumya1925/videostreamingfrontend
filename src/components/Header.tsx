import React from 'react';
import './Header.css';

interface HeaderProps {
  title?: string;
  onSync?: () => void;
  isSyncing?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Video Streaming Dashboard", 
  onSync, 
  isSyncing = false 
}) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="logo">{title}</h1>
          <span className="tagline">Real-time Multi-Stream Monitoring</span>
        </div>
        
        <nav className="nav-section">
          <ul className="nav-links">
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#streams">Live Streams</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>

        <div className="controls-section">
          {onSync && (
            <button 
              className={`sync-btn ${isSyncing ? 'syncing' : ''}`}
              onClick={onSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <span className="spinner"></span>
                  Syncing...
                </>
              ) : (
                'Sync All Streams'
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;