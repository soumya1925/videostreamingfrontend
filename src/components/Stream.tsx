import React, { useState, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import { type VideoStream, type SyncControls } from '../types/video';
import './Stream.css';

interface StreamProps {
  streams: VideoStream[];
  syncControls?: SyncControls;
}

const Stream: React.FC<StreamProps> = ({ streams, syncControls }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [masterTime, setMasterTime] = useState<number | null>(null);

  const handleMasterTimeUpdate = useCallback((time: number) => {
    setMasterTime(time);
  }, []);

  const handlePlayAll = () => {
    setIsPlaying(true);
   
    setTimeout(() => {
      syncControls?.manualSync();
    }, 1000);
  };

  const handlePauseAll = () => {
    setIsPlaying(false);
  };

  return (
    <section className="stream-section" id="streams">
      <div className="stream-header">
        <h2>Live Streams</h2>
        <div className="stream-controls">
          <button 
            className="control-btn play-all" 
            onClick={handlePlayAll}
            disabled={isPlaying}
          >
            ▶ Play All
          </button>
          <button 
            className="control-btn pause-all" 
            onClick={handlePauseAll}
            disabled={!isPlaying}
          >
            ⏸ Pause All
          </button>
          {syncControls && (
            <button 
              className="control-btn sync-btn" 
              onClick={syncControls.manualSync}
              disabled={syncControls.isSyncing}
            >
              {syncControls.isSyncing ? '🔄 Syncing...' : '🔄 Sync Streams'}
            </button>
          )}
        </div>
      </div>

      <div className="streams-grid">
        {streams.map((stream, index) => (
          <div key={stream.id} className="stream-item">
            <VideoPlayer
              src={stream.url}
              title={stream.title}
              isMaster={index === 0}
              seekTo={index === 0 ? null : masterTime}
              onTimeUpdate={index === 0 ? handleMasterTimeUpdate : undefined}
            />
          </div>
        ))}
      </div>

      <div className="stream-info">
        <p>Active Streams: {streams.length}</p>
        <p>Status: {isPlaying ? 'Live' : 'Ready'}</p>
        {masterTime !== null && (
          <p>Master Time: {masterTime.toFixed(2)}s</p>
        )}
      </div>
    </section>
  );
};

export default Stream;