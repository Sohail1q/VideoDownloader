import React, { useState, useEffect, useRef } from 'react';
import { IngestJob, IngestStatus, MediaItem } from '../types';
import { PRESET_INGEST_URLS } from '../data/mockData';
import { 
  Download, Terminal, Server, Cpu, CheckCircle2, AlertCircle, 
  Play, RefreshCw, HardDrive, Shield, Sparkles, ArrowRight, 
  Zap, Smartphone, Check, Clock 
} from 'lucide-react';

interface IngestEngineViewProps {
  onIngestSuccess: (newItem: MediaItem) => void;
  onViewInVault: (item: MediaItem) => void;
}

export const IngestEngineView: React.FC<IngestEngineViewProps> = ({
  onIngestSuccess,
  onViewInVault
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('4k_hevc_master');
  const [extractSubtitles, setExtractSubtitles] = useState(true);
  const [embedChapters, setEmbedChapters] = useState(true);
  const [detectedPlatform, setDetectedPlatform] = useState<string>('Auto Detect');

  // Job queue state
  const [jobs, setJobs] = useState<IngestJob[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Platform auto-detection
  useEffect(() => {
    const url = inputUrl.toLowerCase();
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setDetectedPlatform('YouTube');
    } else if (url.includes('vimeo.com')) {
      setDetectedPlatform('Vimeo');
    } else if (url.includes('reddit.com') || url.includes('redd.it')) {
      setDetectedPlatform('Reddit');
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      setDetectedPlatform('X/Twitter');
    } else if (url.includes('tiktok.com')) {
      setDetectedPlatform('TikTok');
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      setDetectedPlatform('Direct Web Stream');
    } else {
      setDetectedPlatform('Auto Detect');
    }
  }, [inputUrl]);

  // Handle starting ingestion
  const handleStartIngest = (targetUrl?: string) => {
    const urlToFetch = targetUrl || inputUrl;
    if (!urlToFetch.trim()) return;

    const matchedPreset = PRESET_INGEST_URLS.find(p => p.url === urlToFetch);
    const jobTitle = matchedPreset ? matchedPreset.title : `Ultra HD Stream from ${detectedPlatform} (${new Date().toLocaleTimeString()})`;
    const platform = matchedPreset ? matchedPreset.platform : detectedPlatform;

    const newJobId = `job-${Date.now()}`;
    const newJob: IngestJob = {
      id: newJobId,
      url: urlToFetch,
      platform,
      title: jobTitle,
      status: 'probing',
      progressPercent: 5,
      downloadSpeed: '85.4 MB/s (Server Fiber)',
      eta: '12s',
      qualityPreset: 'Ultra 4K HEVC / 1080p Best',
      fileSizeBytes: 650 * 1024 * 1024,
      createdTime: 'Just now',
      logs: [
        `[streamvault-core] Ingest request received for: ${urlToFetch}`,
        `[speed-optimizer] Allocated 16 concurrent connection workers to host gigabit interface`,
        `[yt-dlp] Probing format manifests: bestvideo*+bestaudio/best`,
        `[security] Running in isolated cgroup sandbox. Zero client battery/bandwidth load.`
      ]
    };

    setJobs(prev => [newJob, ...prev]);
    setActiveJobId(newJobId);
    setInputUrl('');

    // Simulate high-speed backend execution
    simulateUltraIngestion(newJobId, jobTitle, platform, urlToFetch);
  };

  const simulateUltraIngestion = (
    jobId: string, 
    title: string, 
    platform: string, 
    url: string
  ) => {
    // Stage 1: Probing -> High speed downloading (1.2s)
    setTimeout(() => {
      setJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            status: 'downloading',
            progressPercent: 42,
            downloadSpeed: '94.2 MB/s',
            eta: '06s',
            logs: [
              ...job.logs,
              `[yt-dlp] Master stream locked: 4K 60fps (codec: hevc, bitrate: 28.5 Mbps)`,
              `[download] Destination: /vault/staging/${jobId}.mkv`,
              `[download]  42.0% of ~650.00MiB at 94.2MB/s ETA 00:06`
            ]
          };
        }
        return job;
      }));
    }, 1200);

    // Stage 2: Downloading -> 85% (2.8s)
    setTimeout(() => {
      setJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            progressPercent: 88,
            downloadSpeed: '98.6 MB/s',
            eta: '02s',
            logs: [
              ...job.logs,
              `[download]  88.5% of ~650.00MiB at 98.6MB/s ETA 00:02`,
              `[download] 100% of 650.00MiB in 00:07 at 92.4MB/s (Master fetched)`,
              `[ffmpeg-hw] Initializing Intel QuickSync / NVENC hardware remux pipeline`
            ]
          };
        }
        return job;
      }));
    }, 2800);

    // Stage 3: Indexing & Storage Commit (4.5s)
    setTimeout(() => {
      const completedFilename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_master.mp4`;
      
      const newMediaItem: MediaItem = {
        id: `vault-ingested-${Date.now()}`,
        title: title,
        type: 'video',
        filename: completedFilename,
        sizeBytes: 650 * 1024 * 1024,
        dateArchived: new Date().toISOString(),
        sourceUrl: url,
        platform: platform as any,
        tags: ['UltraHQ', platform, 'ServerDownload', '4K'],
        thumbnailUrl: '/src/assets/images/streamvault_video_thumb_1_1790761832657.jpg',
        videoDetails: {
          duration: 284,
          resolution: '3840x2160',
          fps: 60,
          codec: 'H.265 (HEVC)',
          audioCodec: 'AAC',
          bitrateMbps: 28.5,
          availableResolutions: ['4K (2160p)', '1080p', '720p', '480p'],
          hasSubtitles: true,
          subtitlesLanguages: ['English (CC)']
        }
      };

      setJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            status: 'completed',
            progressPercent: 100,
            downloadSpeed: 'Finished',
            eta: '0s',
            completedTime: 'Just now',
            logs: [
              ...job.logs,
              `[ffmpeg] Fast Remux complete. Generated adaptive HLS segments.`,
              `[indexer] Atomic move to persistent ZFS storage pool: /vault/storage/${completedFilename}`,
              `[database] Recorded into SQLite / PostgreSQL vault registry.`,
              `[streamvault] Asset ready! Available for instant stream & export to phone.`
            ]
          };
        }
        return job;
      }));

      onIngestSuccess(newMediaItem);
    }, 4500);
  };

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];

  return (
    <div className="space-y-6">
      {/* Neon Cyber Ingest Header */}
      <div className="border border-pink-500/30 rounded-2xl bg-neutral-950/80 p-5 backdrop-blur-md relative overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.12)]">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-pink-500/20 to-cyan-500/20 border border-pink-500/40 text-pink-400 shrink-0 shadow-lg">
              <Zap className="w-5 h-5 text-pink-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Ultra-Fast Server Ingestion Pipeline
                </h3>
                <span className="text-[10px] font-mono text-pink-300 bg-pink-500/15 border border-pink-400/30 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(236,72,153,0.3)]">
                  MULTI-THREADED · 1000+ SITES
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                Paste any link from YouTube, Vimeo, Reddit, X, TikTok, or direct video hosts. The backend server downloads at maximum fiber bandwidth and transcodes on server hardware with zero client overhead.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl px-3.5 py-2">
              <div className="text-neutral-500 text-[10px] uppercase">Client Data Burden</div>
              <div className="text-cyan-400 font-bold">0.00 MB (Server Handled)</div>
            </div>
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl px-3.5 py-2">
              <div className="text-neutral-500 text-[10px] uppercase">Quality Target</div>
              <div className="text-pink-400 font-bold">Ultra 4K / 1080p Master</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ingest Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Presets */}
        <div className="lg:col-span-6 space-y-5">
          <div className="border border-neutral-800 rounded-2xl bg-neutral-900/70 p-5 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between">
              <span>Paste Media Link for Ultra-HQ Ingestion</span>
              <span className="text-cyan-400 font-mono text-[11px]">
                {detectedPlatform !== 'Auto Detect' ? `Detected: ${detectedPlatform}` : 'Any Web Link'}
              </span>
            </h4>

            {/* URL Input Form */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or any video link"
                  className="w-full pl-3.5 pr-28 py-3 text-xs sm:text-sm bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 font-mono shadow-inner transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleStartIngest();
                  }}
                />
                <button
                  onClick={() => handleStartIngest()}
                  disabled={!inputUrl.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 text-xs font-bold bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-cyan-300 hover:to-pink-400 disabled:opacity-40 text-neutral-950 rounded-lg transition-all shadow-md neon-glow-cyan"
                >
                  Fetch Now
                </button>
              </div>

              {/* 1-Click Platform Test Presets */}
              <div>
                <div className="text-[11px] text-neutral-400 mb-2 font-mono">
                  Quick-test with sample platform URLs:
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_INGEST_URLS.map((preset) => (
                    <button
                      key={preset.url}
                      onClick={() => {
                        setInputUrl(preset.url);
                        handleStartIngest(preset.url);
                      }}
                      className="px-2.5 py-1.5 text-[11px] rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 font-mono"
                    >
                      <span className="text-pink-400 font-bold">{preset.platform}</span>
                      <span className="text-neutral-500">·</span>
                      <span className="truncate max-w-[130px]">{preset.title.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quality & Encoding Presets */}
            <div className="pt-3 border-t border-neutral-800/80 space-y-3">
              <label className="block text-xs font-medium text-neutral-300">
                Transcoding & Quality Target:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPreset('4k_hevc_master')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPreset === '4k_hevc_master'
                      ? 'bg-cyan-500/15 border-cyan-400/60 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Ultra 4K Master Passthrough
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">Preserve 4K HEVC / AV1 with maximum dynamic range</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPreset('1080p_h264_aac')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedPreset === '1080p_h264_aac'
                      ? 'bg-pink-500/15 border-pink-400/60 text-white shadow-[0_0_12px_rgba(236,72,153,0.2)]'
                      : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-pink-300">1080p Universal Remux</div>
                  <div className="text-[11px] text-neutral-400 mt-1">Fastest playback across all mobile browsers & TVs</div>
                </button>
              </div>
            </div>
          </div>

          {/* Ingestion Queue Activity */}
          <div className="border border-neutral-800 rounded-2xl bg-neutral-900/70 overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Active Queue Activity</span>
              <span className="text-[11px] font-mono text-cyan-400">{jobs.length} tasks recorded</span>
            </div>

            <div className="divide-y divide-neutral-800 max-h-56 overflow-y-auto">
              {jobs.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-500 font-mono">
                  Queue idle. Submit any URL above to trigger the pipeline.
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setActiveJobId(job.id)}
                    className={`p-3 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                      activeJob?.id === job.id ? 'bg-neutral-800' : 'hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      {job.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{job.title}</div>
                        <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                          <span className="text-pink-400">{job.platform}</span> · <span>{job.createdTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono text-cyan-400 font-bold">
                      {job.progressPercent}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry Terminal */}
        <div className="lg:col-span-6 space-y-5">
          {activeJob ? (
            <div className="border border-cyan-500/30 rounded-2xl bg-neutral-900/80 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                    Pipeline Monitor: {activeJob.id}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5 truncate max-w-md">
                    {activeJob.title}
                  </h4>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-cyan-300">
                  {activeJob.status.toUpperCase()}
                </div>
              </div>

              {/* Progress Bar & Speed Stats */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-neutral-400">
                  <span className="text-pink-400">Throughput: {activeJob.downloadSpeed}</span>
                  <span className="text-cyan-300 font-bold">{activeJob.progressPercent}%</span>
                </div>
                <div className="h-2.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${activeJob.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Terminal Logs Viewport with Cyber Styling */}
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                  <span className="flex items-center gap-1.5 font-mono text-neutral-300">
                    <Terminal className="w-3.5 h-3.5 text-pink-400" />
                    Server Worker Telemetry:
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">Live Stream</span>
                </div>

                <div className="h-64 p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-[11px] text-neutral-300 overflow-y-auto space-y-1 shadow-inner select-text">
                  {activeJob.logs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={
                        log.includes('ffmpeg') ? 'text-pink-400' :
                        log.includes('100%') || log.includes('ready') ? 'text-emerald-400 font-bold' :
                        log.includes('yt-dlp') ? 'text-cyan-300' : 'text-neutral-400'
                      }
                    >
                      {log}
                    </div>
                  ))}
                  <div ref={terminalBottomRef} />
                </div>
              </div>

              {/* Action When Completed */}
              {activeJob.status === 'completed' && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Media indexed & available in StreamVault</span>
                  </div>
                  <button
                    onClick={() => {
                      onViewInVault({
                        id: activeJob.id,
                        title: activeJob.title,
                        type: 'video',
                        filename: `${activeJob.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.mp4`,
                        sizeBytes: activeJob.fileSizeBytes || 650 * 1024 * 1024,
                        dateArchived: new Date().toISOString(),
                        thumbnailUrl: '/src/assets/images/streamvault_video_thumb_1_1790761832657.jpg',
                        tags: ['UltraHQ', 'Recent']
                      });
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-400 to-cyan-500 text-neutral-950 font-bold rounded-lg hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-md"
                  >
                    <span>View in Vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-neutral-800 rounded-2xl bg-neutral-900/40 p-8 text-center text-xs text-neutral-500 font-mono">
              Select or submit an ingestion task to observe live execution telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
