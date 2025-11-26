import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { type VideoPlayerProps } from '../types/video';
import './VideoPlayer.css';

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  onPlayerReady,
  onTimeUpdate,
  isMaster = false,
  seekTo = null,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if browser supports HLS natively
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari and other browsers with native HLS support
      video.src = src;
      console.log(`Using native HLS support for: ${title}`);
    } else if (Hls.isSupported()) {
      // Use hls.js for other browsers
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hlsRef.current = hls;
      
      hls.loadSource(src);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log(`HLS manifest loaded for: ${title}`);
        setIsLoading(false);
        setHasError(false);
        onPlayerReady?.(video);
      });
      
      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error(`HLS error (${title}):`, data);
        if (data.fatal) {
          setHasError(true);
          setIsLoading(false);
        }
      });
    } else {
      console.error(`HLS not supported in this browser for: ${title}`);
      setHasError(true);
      setIsLoading(false);
    }

    // Event listeners for the video element
    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    };

    const handleError = (e: Event) => {
      console.error(`Video error (${title}):`, e);
      setHasError(true);
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      // Cleanup
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [src, title, onPlayerReady, onTimeUpdate]);

  // Handle seeking for synchronization
  useEffect(() => {
    if (videoRef.current && seekTo !== null && !isMaster) {
      videoRef.current.currentTime = seekTo;
    }
  }, [seekTo, isMaster]);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Play failed:', error);
      });
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div className={`video-player-container ${className}`}>
      <h4 className="video-title">{title}</h4>
      
      {isLoading && !hasError && (
        <div className="video-loading">
          <div className="loading-spinner"></div>
          <p>Loading HLS stream...</p>
        </div>
      )}
      
      {hasError ? (
        <div className="video-error">
          <p>❌ Failed to load HLS stream</p>
          <button onClick={handleRetry} className="retry-btn">
            🔄 Retry
          </button>
          <p className="error-url">URL: {src}</p>
          <p className="error-detail">Check if the stream is available</p>
        </div>
      ) : (
        <div className="video-wrapper">
          <video
            ref={videoRef}
            controls
            style={{ 
              width: '100%', 
              height: '400px',
              display: isLoading ? 'none' : 'block'
            }}
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Custom controls */}
          <div className="custom-controls">
            <button onClick={handlePlay} className="control-btn">▶ Play</button>
            <button onClick={handlePause} className="control-btn">⏸ Pause</button>
            <span className="time-display">Time: {Math.round(currentTime)}s</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

