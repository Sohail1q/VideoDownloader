export type MediaType = 'video' | 'image' | 'document';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  filename: string;
  sizeBytes: number;
  dateArchived: string;
  sourceUrl?: string;
  platform?: 'YouTube' | 'Vimeo' | 'Reddit' | 'X/Twitter' | 'TikTok' | 'Direct Download' | 'Manual Upload';
  tags: string[];
  thumbnailUrl: string;
  videoBlobUrl?: string;
  formatType?: string;
  isPrivate?: boolean;
  // Video specific properties
  videoDetails?: {
    duration: number; // in seconds
    resolution: string; // e.g., '3840x2160'
    fps: number;
    codec: 'AV1' | 'H.264 (AVC)' | 'H.265 (HEVC)' | 'VP9';
    audioCodec: 'Opus' | 'AAC' | 'FLAC';
    bitrateMbps: number;
    availableResolutions: string[];
    hasSubtitles: boolean;
    subtitlesLanguages?: string[];
  };
  // Image specific properties
  imageDetails?: {
    dimensions: string;
    aspectRatio: string;
    cameraMake?: string;
    cameraModel?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    colorSpace?: string;
  };
  // Document specific properties
  documentDetails?: {
    format: 'markdown' | 'plaintext' | 'json';
    content: string;
    wordCount: number;
    author: string;
  };
}

export type IngestStatus = 'idle' | 'probing' | 'queued' | 'downloading' | 'transcoding' | 'indexing' | 'completed' | 'failed';

export interface IngestJob {
  id: string;
  url: string;
  platform: string;
  title: string;
  status: IngestStatus;
  progressPercent: number;
  downloadSpeed: string;
  eta: string;
  qualityPreset: string;
  fileSizeBytes?: number;
  createdTime: string;
  completedTime?: string;
  logs: string[];
  metaProbe?: {
    extractor: string;
    videoCodec: string;
    audioCodec: string;
    nativeResolution: string;
    durationSeconds: number;
    thumbnail: string;
  };
}

export interface SubsystemNode {
  id: string;
  name: string;
  tier: 'client' | 'ingress' | 'application' | 'task_queue' | 'transcode' | 'storage';
  role: string;
  software: string;
  port?: string;
  protocol: string;
  description: string;
  hardwareRequirements: string;
  securityFeatures: string[];
  dockerService: string;
}
