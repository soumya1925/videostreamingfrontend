import React, { useState, useCallback, useEffect } from 'react';
import Stream from './Stream';
import VideoPlayer from './VideoPlayer';
import { type VideoStream, type SyncControls } from '../types/video';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [streamUrls, setStreamUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncTime, setSyncTime] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // ------------------------------
  // 1️⃣ FETCH STREAM URLs FROM API
  // ------------------------------
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch(
          "https://videostreamingapp-18pd.onrender.com/start-mt",
          { method: "POST" }
        );

        const data = await response.json();
        console.log("STREAMS FROM API:", data);

        setStreamUrls(data.streams);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load streams", error);
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  // ------------------------------------------
  // 2️⃣ WHILE LOADING, SHOW A BEAUTIFUL MESSAGE
  // ------------------------------------------
  if (loading) {
    return (
      <div style={{ color: "white", padding: 30, textAlign: "center" }}>
        <h2>Starting MediaMTX on EC2...</h2>
        <p>Please wait, launching streams...</p>
      </div>
    );
  }

  if (!streamUrls.length) {
    return (
      <div style={{ color: "white", padding: 30, textAlign: "center" }}>
        <h2>No streams available</h2>
        <p>MediaMTX may not be running.</p>
      </div>
    );
  }

  // ------------------------------------
  // 3️⃣ MAP STREAMS FROM THE API RESPONSE
  // ------------------------------------
  const dashboardStreams: VideoStream[] = streamUrls.slice(0, 3).map((url, i) => ({
    id: `stream${i + 1}`,
    title: `Camera ${i + 1}`,
    url,
    type: "hls"
  }));

  const liveStreams: VideoStream[] = streamUrls.slice(0, 2).map((url, i) => ({
    id: `live${i + 1}`,
    title: `Live Stream ${i + 1}`,
    url,
    type: "hls"
  }));

  // ---------------------
  // 4️⃣ SYNC CONTROLS
  // ---------------------
  const manualSync = useCallback(() => {
    setIsSyncing(true);
    setSyncTime(prev => (prev ? prev + 0.1 : 0));

    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  }, []);

  const syncControls: SyncControls = {
    isSyncing,
    syncTime,
    manualSync
  };

  // ---------------------
  // 5️⃣ RENDER UI
  // ---------------------
  return (
    <div className="dashboard" id="dashboard">
      <div className="dashboard-container">
        <section className="dashboard-hero">
          <h1>Multi-Camera Video Monitoring</h1>
          <p>Real-time synchronized streaming from multiple camera sources</p>
        </section>

        <Stream 
          streams={dashboardStreams} 
          syncControls={syncControls}
        />

        <section className="live-stream-section">
          <h2>Featured Live Streams</h2>
          <div className="featured-streams">
            {liveStreams.map(stream => (
              <div key={stream.id} className="featured-stream">
                <VideoPlayer
                  src={stream.url}
                  title={stream.title}
                  className="featured-player"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
