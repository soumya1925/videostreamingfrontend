import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import { type SyncControls } from './types/video';
import './App.css';

const App: React.FC = () => {
  const [syncTime, setSyncTime] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const manualSync = useCallback(() => {
    setIsSyncing(true);
    setSyncTime(prev => prev ? prev + 0.1 : 0);
    
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  }, []);

  const syncControls: SyncControls = {
    isSyncing,
    syncTime,
    manualSync
  };

  return (
    <div className="App">
      <LandingPage syncControls={syncControls} />
    </div>
  );
};

export default App;