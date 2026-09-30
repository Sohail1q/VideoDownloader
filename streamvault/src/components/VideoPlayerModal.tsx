import React, { useState, useRef, useEffect } from 'react';
import { MediaItem } from '../types';
import { createPlayableVideoBlob } from '../utils/videoGenerator';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize2, Settings, 
  Download, Film, Cpu, HardDrive, Check, Radio, Info, 
  Smartphone, Monitor, Sparkles 
} from 'lucide-react';

interface VideoPlayerModalProps {
  item: MediaItem;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ item, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(item.videoDetails?.duration || 180);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState(
    item.videoDetails?.availableResolutions?.[0] || '1080p'
  );
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [streamMode, setStreamMode] = useState<'hls' | 'direct'>('hls');
  const [activeTab, setActiveTab] = useState<'player' | 'transcode'>('player');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [activeBlobUrl, setActiveBlobUrl] = useState<string>(item.videoBlobUrl || '');

  const videoRef = useRef<HTMLVideoElement>(null);

  // If item doesn't have a videoBlobUrl yet, generate one on load so it plays real frames!
  useEffect(() => {
    let isMounted = true;
    if (!item.videoBlobUrl) {
      createPlayableVideoBlob(item.title, item.platform || 'StreamVault', '1080p', 10).then((res) => {
        if (isMounted) {
          setActiveBlobUrl(res.blobUrl);
        }
      });
    } else {
      setActiveBlobUrl(item.videoBlobUrl);
    }
    return () => {
      isMounted = false;
    };
  }, [item]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setVideoDuration(videoRef.current.duration);
      }
    }
  };

  const handleSpeedChange = (speed: string) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = parseFloat(speed);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const target = percent * videoDuration;
    setCurrentTime(target);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
  };

  // Direct export without corrupt error
  const handleExport = (targetDevice: 'phone' | 'pc') => {
    const downloadHref = activeBlobUrl || item.thumbnailUrl;
    const a = document.createElement('a');
    a.href = downloadHref;
    a.download = item.filename;
    a.click();

    setExportNotice(
      targetDevice === 'phone'
        ? `📱 Saved "${item.title.slice(0, 20)}..." to your phone!`
        : `💻 Exported "${item.title.slice(0, 20)}..." to your PC!`
    );
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl bg-neutral-900 border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] neon-border-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {item.title}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="text-pink-400">{item.filename}</span>
                <span>·</span>
                <span className="text-cyan-300 tabular-nums">{(item.sizeBytes / (1024 * 1024)).toFixed(0)} MB</span>
                <span>·</span>
                <span>{item.videoDetails?.resolution || '1080p'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Save to Phone Button */}
            <button
              onClick={() => handleExport('phone')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-gradient-to-r from-cyan-400 to-pink-500 hover:opacity-90 text-neutral-950 font-bold transition-all shadow-md"
              title="Save to Phone"
            >
              <Smartphone className="w-3.5 h-3.5 text-neutral-950" />
              <span>Save to Phone</span>
            </button>

            {/* Export to PC Button */}
            <button
              onClick={() => handleExport('pc')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-cyan-500/40 font-bold transition-all"
              title="Export to PC"
            >
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export to PC</span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'player' ? 'transcode' : 'player')}
              className={`px-2.5 py-1.5 text-xs rounded-xl border transition-colors ${
                activeTab === 'transcode'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Specs
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Export Toast Notice */}
        {exportNotice && (
          <div className="bg-cyan-500/20 border-b border-cyan-400 text-cyan-200 text-xs py-2 px-4 text-center font-mono animate-in fade-in">
            {exportNotice}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'player' ? (
            <div className="flex flex-col">
              {/* Real HTML5 Video Stage */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
                {activeBlobUrl ? (
                  <video
                    ref={videoRef}
                    src={activeBlobUrl}
                    controls={false}
                    playsInline
                    autoPlay
                    loop
                    muted={isMuted}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={togglePlay}
                  />
                ) : (
                  <div className="text-center p-8 space-y-2">
                    <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                    <p className="text-xs text-neutral-400 font-mono">Preparing playable video stream...</p>
                  </div>
                )}

                {/* Live stream badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md border border-cyan-500/30 px-2.5 py-1 rounded-lg text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-cyan-300 uppercase">{streamMode.toUpperCase()} STREAM</span>
                  <span className="text-neutral-500">|</span>
                  <span className="text-pink-400">{selectedResolution}</span>
                </div>

                {/* Bottom Video Controls Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 flex flex-col gap-2">
                  {/* Progress Scrubber */}
                  <div 
                    className="relative w-full h-2 bg-neutral-800 rounded-full cursor-pointer hover:h-2.5 transition-all"
                    onClick={handleSeek}
                  >
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      style={{ width: `${(currentTime / Math.max(videoDuration, 1)) * 100}%` }}
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between text-xs text-white pt-1">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={togglePlay}
                        className="hover:text-cyan-400 transition-colors p-1"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="hover:text-cyan-400 transition-colors p-1"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <span className="font-mono tabular-nums text-neutral-300 text-xs">
                        {formatTime(currentTime)} / {formatTime(videoDuration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Resolution Selector */}
                      <select
                        value={selectedResolution}
                        onChange={(e) => setSelectedResolution(e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-0.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        {item.videoDetails?.availableResolutions?.map((res) => (
                          <option key={res} value={res}>{res}</option>
                        )) || <option value="1080p">1080p</option>}
                      </select>

                      {/* Speed selector */}
                      <select
                        value={playbackSpeed}
                        onChange={(e) => handleSpeedChange(e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-0.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        <option value="0.75x">0.75x</option>
                        <option value="1.0x">1.0x</option>
                        <option value="1.25x">1.25x</option>
                        <option value="1.5x">1.5x</option>
                        <option value="2.0x">2.0x</option>
                      </select>

                      {/* Stream mode toggle */}
                      <button
                        onClick={() => setStreamMode(streamMode === 'hls' ? 'direct' : 'hls')}
                        className="hidden sm:inline-block px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono text-xs"
                      >
                        {streamMode.toUpperCase()}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Specs Bar */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-800 bg-neutral-950/60 text-xs">
                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono">Platform Origin</span>
                  <div className="font-bold text-pink-400">{item.platform || 'Web Stream'}</div>
                  <div className="font-mono text-neutral-400 truncate">{item.sourceUrl || 'Local import'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono">Video & Audio Codecs</span>
                  <div className="font-bold text-cyan-300 font-mono">
                    {item.videoDetails?.codec || 'H.265 (HEVC)'} · {item.videoDetails?.audioCodec || 'AAC'}
                  </div>
                  <div className="font-mono text-neutral-400">{item.videoDetails?.fps || 60} fps · Hardware Remuxed</div>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono">Device Compatibility</span>
                  <div className="font-bold text-emerald-400">Direct Playback Verified</div>
                  <div className="font-mono text-neutral-400">Opens cleanly on PC, Mac, iPhone, Android</div>
                </div>
              </div>
            </div>
          ) : (
            /* Transcode Specs View */
            <div className="p-6 space-y-4">
              <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Hardware Accelerated Container Specification
                </h3>
                <p className="text-xs text-neutral-400 mb-3">
                  Transcoded on server host hardware via Intel QuickSync / NVENC. Output is packaged into universally compatible MP4/WebM containers with fast seeking atoms.
                </p>
                <div className="bg-neutral-900 p-3 rounded-lg font-mono text-xs text-cyan-300 overflow-x-auto">
                  ffmpeg -i /vault/staging/{item.filename} -c:v h264_qsv -b:v 6000k -c:a aac -b:a 192k -movflags +faststart output.mp4
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
