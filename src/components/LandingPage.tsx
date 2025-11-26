import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Dashboard from './Dashboard';
import {type SyncControls } from '../types/video';
import './LandingPage.css';

interface LandingPageProps {
  syncControls?: SyncControls;
}

const LandingPage: React.FC<LandingPageProps> = ({ syncControls }) => {
  return (
    <div className="landing-page">
      <Header 
        onSync={syncControls?.manualSync}
        isSyncing={syncControls?.isSyncing}
      />
      
      <main className="main-content">
        <Dashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;