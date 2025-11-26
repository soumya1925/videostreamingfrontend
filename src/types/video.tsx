export interface VideoStream {
    id: string;
    title: string;
    url: string;
    type: 'hls' | 'mp4';
  }
  
  export interface VideoPlayerProps {
    src: string;
    title: string;
    onPlayerReady?: (player: any) => void;
    onTimeUpdate?: (time: number) => void;
    isMaster?: boolean;
    seekTo?: number | null;
    className?: string;
  }
  
  export interface SyncControls {
    isSyncing: boolean;
    syncTime: number | null;
    manualSync: () => void;
  }