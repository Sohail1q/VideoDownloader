import { MediaItem, SubsystemNode } from '../types';

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [];

export const PRESET_INGEST_URLS = [
  {
    url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    platform: 'YouTube',
    title: '4K Costa Rica Wildlife & Rainforest HDR Demo Reel',
    estimatedSize: '1.2 GB',
    duration: '5m 12s',
    recommendedPreset: '1080p H.264 Universal Remux'
  },
  {
    url: 'https://vimeo.com/76979871',
    platform: 'Vimeo',
    title: 'Nordic Light: Scandinavian Coastal Architecture',
    estimatedSize: '480 MB',
    duration: '3m 45s',
    recommendedPreset: 'Original 4K HEVC Passthrough'
  },
  {
    url: 'https://www.reddit.com/r/datahoarder/comments/selfhosted_media_archive',
    platform: 'Reddit',
    title: 'Homelab ZFS 120TB Rack Storage Teardown & Cable Clean',
    estimatedSize: '185 MB',
    duration: '1m 30s',
    recommendedPreset: '720p Mobile-Optimized HLS'
  },
  {
    url: 'https://x.com/archdaily/status/17849201948201',
    platform: 'X/Twitter',
    title: 'Tokyo Brutalist Concrete Tower Interior Tour',
    estimatedSize: '95 MB',
    duration: '0m 58s',
    recommendedPreset: '1080p WebM Remux'
  },
  {
    url: 'https://cdn.example.org/raw/timelapse_patagonia_glacier_master.mp4',
    platform: 'Direct Download',
    title: 'Patagonia Glacier Retreat Time-Lapse (Raw ProRes Proxy)',
    estimatedSize: '2.4 GB',
    duration: '8m 20s',
    recommendedPreset: 'Transcode to H.265 Space-Saver'
  }
];

export const SUBSYSTEM_NODES: SubsystemNode[] = [
  {
    id: 'client-tier',
    name: 'Universal Client Web & Mobile PWA',
    tier: 'client',
    role: 'Presentation & Media Streaming Playback',
    software: 'StreamVault React 19 SPA + PWA Service Worker',
    port: '3000',
    protocol: 'HTTPS / WSS / HLS',
    description: 'Ultra-lightweight web portal running in any mobile browser, desktop browser, or Smart TV. Zero downloading, zero transcoding, and zero heavy computation happens on this client.',
    hardwareRequirements: 'Any modern browser with H.264/HEVC/AV1 hardware decoding',
    securityFeatures: ['Zero local storage footprint', 'Session token authentication', 'Adaptive bitrate streaming'],
    dockerService: 'streamvault-web'
  },
  {
    id: 'ingress-tier',
    name: 'Zero-Trust Ingress & Mesh VPN',
    tier: 'ingress',
    role: 'Encrypted Remote Access & Reverse Proxy',
    software: 'Tailscale Sidecar Daemon + Caddy v2 Reverse Proxy',
    port: '443 / 80',
    protocol: 'WireGuard (Noise protocol) / TLS 1.3 / HTTP/3 QUIC',
    description: 'Strictly shields the entire server from the public internet. Tailscale creates a peer-to-peer WireGuard mesh with MagicDNS. Caddy terminates TLS and forwards authorized requests.',
    hardwareRequirements: 'Low CPU overhead (WireGuard kernel module acceleration)',
    securityFeatures: ['No open public router ports', 'Automatic Let’s Encrypt certificates via Tailscale ACME', 'mTLS & OIDC single sign-on support'],
    dockerService: 'tailscale-sidecar & caddy-proxy'
  },
  {
    id: 'api-tier',
    name: 'StreamVault Core API & Ingest Gateway',
    tier: 'application',
    role: 'Orchestration, Ingestion Dispatcher & Metadata Manager',
    software: 'Node.js / Fastify & TypeScript Core',
    port: '4000',
    protocol: 'REST JSON / WebSocket Events',
    description: 'Validates submitted URLs, parses media manifests, schedules backend download jobs into Redis, streams real-time console telemetry to users, and manages vault metadata.',
    hardwareRequirements: '1-2 vCPU cores, 512MB RAM',
    securityFeatures: ['Strict URL domain sanitization', 'Rate limiting', 'Content-Security-Policy headers'],
    dockerService: 'streamvault-api'
  },
  {
    id: 'queue-tier',
    name: 'Distributed Task Queue & Scheduler',
    tier: 'task_queue',
    role: 'Asynchronous Job Broker & Concurrency Limiter',
    software: 'Redis 7 Alpine + BullMQ',
    port: '6379',
    protocol: 'RESP3 Redis Protocol',
    description: 'Buffers download and transcoding jobs to prevent server disk or CPU saturation. Manages worker pool concurrency, retries failed downloads, and persists task states across reboots.',
    hardwareRequirements: '128MB RAM, ultra-low latency memory storage',
    securityFeatures: ['Password-authenticated socket', 'Isolated internal Docker network'],
    dockerService: 'streamvault-redis'
  },
  {
    id: 'worker-tier',
    name: 'Server-Side Ingestion & yt-dlp Worker',
    tier: 'transcode',
    role: 'Automated Media Fetcher & Format Extractor',
    software: 'yt-dlp Daemon + Python 3.12 + Streamlink',
    port: 'Internal Worker Daemon',
    protocol: 'Internal IPC / Subprocess STDOUT',
    description: 'Pulls video/audio payloads directly from 1,000+ online video and social platforms onto server storage at server gigabit speeds. Clients never burn mobile battery or data.',
    hardwareRequirements: 'Gigabit network interface, fast SSD scratch volume',
    securityFeatures: ['Isolated non-root container user', 'Restricted disk quota permissions'],
    dockerService: 'streamvault-worker-ingest'
  },
  {
    id: 'transcode-tier',
    name: 'Hardware Transcode & HLS Packaging Engine',
    tier: 'transcode',
    role: 'Hardware-Accelerated Encoding & HLS Segmenter',
    software: 'FFmpeg 7.0 + Intel QuickSync (QSV) / Nvidia NVENC / VAAPI',
    port: 'Internal Worker Daemon',
    protocol: 'Hardware Pipe (/dev/dri or /dev/nvidia*)',
    description: 'Converts downloaded high-bitrate media into universally playable H.264/HEVC/AV1 multi-resolution streams with segmented HLS playlists (.m3u8) for instant scrubbing.',
    hardwareRequirements: 'Intel CPU with QuickSync (/dev/dri) OR Nvidia GPU with NVENC',
    securityFeatures: ['Sandbox ffmpeg execution', 'Resource memory caps (Docker cgroups)'],
    dockerService: 'streamvault-worker-transcode'
  },
  {
    id: 'storage-tier',
    name: 'Persistent Vault Storage & Automated Indexer',
    tier: 'storage',
    role: 'Data Preservation, File Watcher & Metadata DB',
    software: 'ZFS Pool (RaidZ2) / MinIO S3 + inotify Media Watcher + SQLite/PostgreSQL',
    port: '9000 (MinIO S3)',
    protocol: 'POSIX Filesystem / S3 API',
    description: 'Preserves raw masters and streaming assets with bitrot self-healing. An inotify file watcher detects new files dropped manually into directories and auto-indexes them into the database.',
    hardwareRequirements: 'Multi-drive ZFS pool or NVMe cache tier',
    securityFeatures: ['Native ZFS AES-256-GCM encryption at rest', 'Automatic scrub schedule'],
    dockerService: 'streamvault-indexer & zfs-mount'
  }
];

export const DOCKER_COMPOSE_BLUEPRINT = `version: "3.8"

# ==============================================================================
# StreamVault: Self-Hosted Personal Media Archive & Cloud Storage System
# Production Docker Compose Architecture with yt-dlp, FFmpeg QSV/NVENC & Tailscale
# ==============================================================================

services:
  # ----------------------------------------------------------------------------
  # 1. Reverse Proxy & Zero-Trust Ingress (Caddy with Tailscale integration)
  # ----------------------------------------------------------------------------
  caddy:
    image: caddy:2.8-alpine
    container_name: streamvault-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp" # HTTP/3 QUIC
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - ./data/caddy_data:/data
      - ./data/caddy_config:/config
    environment:
      - DOMAIN=\${STREAMVAULT_DOMAIN:-streamvault.internal}
      - TAILSCALE_NODE=\${TAILSCALE_NODE_NAME:-streamvault-home}
    networks:
      - streamvault-internal
    depends_on:
      - web
      - api

  # ----------------------------------------------------------------------------
  # 2. Universal Client Web GUI (React SPA / PWA)
  # ----------------------------------------------------------------------------
  web:
    image: ghcr.io/streamvault/web:latest
    container_name: streamvault-web
    restart: unless-stopped
    environment:
      - VITE_API_URL=https://\${STREAMVAULT_DOMAIN:-streamvault.internal}/api
    networks:
      - streamvault-internal

  # ----------------------------------------------------------------------------
  # 3. Core API Gateway & Coordination Server
  # ----------------------------------------------------------------------------
  api:
    image: ghcr.io/streamvault/api:latest
    container_name: streamvault-api
    restart: unless-stopped
    environment:
      - PORT=4000
      - DATABASE_URL=postgresql://streamvault:\${DB_PASSWORD}@postgres:5432/streamvault
      - REDIS_URL=redis://: \${REDIS_PASSWORD}@redis:6379
      - VAULT_STORAGE_PATH=/vault/storage
      - STAGING_STORAGE_PATH=/vault/staging
      - JWT_SECRET=\${JWT_SECRET}
    volumes:
      - ./data/storage:/vault/storage
      - ./data/staging:/vault/staging
    networks:
      - streamvault-internal
    depends_on:
      - postgres
      - redis

  # ----------------------------------------------------------------------------
  # 4. Ingestion & yt-dlp Worker Daemon (Server-Side Downloader)
  # ----------------------------------------------------------------------------
  worker-ingest:
    image: ghcr.io/streamvault/worker-ingest:latest
    container_name: streamvault-worker-ingest
    restart: unless-stopped
    environment:
      - REDIS_URL=redis://: \${REDIS_PASSWORD}@redis:6379
      - STAGING_PATH=/vault/staging
      - USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    volumes:
      - ./data/staging:/vault/staging
      - ./data/cookies:/vault/cookies:ro # Optional netscape cookies for private platforms
    networks:
      - streamvault-internal
    depends_on:
      - redis

  # ----------------------------------------------------------------------------
  # 5. Hardware Transcoder (FFmpeg with Intel QuickSync / Nvidia NVENC)
  # ----------------------------------------------------------------------------
  worker-transcode:
    image: ghcr.io/streamvault/worker-transcode:latest
    container_name: streamvault-worker-transcode
    restart: unless-stopped
    environment:
      - REDIS_URL=redis://: \${REDIS_PASSWORD}@redis:6379
      - VAULT_PATH=/vault/storage
      - STAGING_PATH=/vault/staging
      - ACCELERATION_TYPE=\${HW_ACCEL:-vaapi} # options: qsv, nvenc, vaapi, cpu
    volumes:
      - ./data/storage:/vault/storage
      - ./data/staging:/vault/staging
    # ── For Intel QuickSync / AMD VAAPI Passthrough: ──
    devices:
      - /dev/dri:/dev/dri
    # ── For Nvidia NVENC Passthrough (uncomment if using Nvidia GPU): ──
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu, video]
    networks:
      - streamvault-internal
    depends_on:
      - redis

  # ----------------------------------------------------------------------------
  # 6. Automated Filesystem Indexer (inotify Daemon)
  # ----------------------------------------------------------------------------
  indexer:
    image: ghcr.io/streamvault/indexer:latest
    container_name: streamvault-indexer
    restart: unless-stopped
    environment:
      - WATCH_DIR=/vault/storage
      - API_WEBHOOK=http://api:4000/internal/webhook/index
    volumes:
      - ./data/storage:/vault/storage:ro
    networks:
      - streamvault-internal
    depends_on:
      - api

  # ----------------------------------------------------------------------------
  # 7. Asynchronous Task Queue (Redis)
  # ----------------------------------------------------------------------------
  redis:
    image: redis:7.2-alpine
    container_name: streamvault-redis
    restart: unless-stopped
    command: redis-server --requirepass \${REDIS_PASSWORD} --appendonly yes
    volumes:
      - ./data/redis:/data
    networks:
      - streamvault-internal

  # ----------------------------------------------------------------------------
  # 8. Relational Metadata Database (PostgreSQL)
  # ----------------------------------------------------------------------------
  postgres:
    image: postgres:16-alpine
    container_name: streamvault-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=streamvault
      - POSTGRES_USER=streamvault
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    networks:
      - streamvault-internal

networks:
  streamvault-internal:
    name: streamvault-network
    driver: bridge
`;

export const ENV_PRODUCTION_CONFIG = `# StreamVault Environment Configuration
# Copy this file to .env before starting containers

# Domain & Ingress
STREAMVAULT_DOMAIN=streamvault.internal
TAILSCALE_NODE_NAME=streamvault-host

# Hardware Acceleration Profile (qsv = Intel QuickSync, nvenc = Nvidia, vaapi = AMD/Intel, cpu = Software)
HW_ACCEL=qsv

# Security & Secrets (Generate with 'openssl rand -base64 32')
JWT_SECRET=super_secure_vault_random_token_generate_with_openssl_32
DB_PASSWORD=vault_secure_postgres_pass_change_me
REDIS_PASSWORD=vault_redis_auth_token_change_me

# Storage Root Paths on Host System (Can point to ZFS pool e.g. /mnt/tank/streamvault)
STORAGE_ROOT=./data/storage
STAGING_ROOT=./data/staging

# Ingestion Worker Settings
MAX_CONCURRENT_DOWNLOADS=3
MAX_CONCURRENT_TRANSCODES=2
DEFAULT_VIDEO_PRESET=1080p_h264_aac
`;

export const CADDYFILE_CONFIG = `(tailscale_auth) {
  # Forward authentication or restrict to Tailscale subnet
  @blocked not client_ip 100.64.0.0/10 192.168.0.0/16 127.0.0.1
  abort @blocked
}

{\$STREAMVAULT_DOMAIN} {
  # Enable HTTP/3 and automated TLS
  import tailscale_auth

  # Compress modern responses
  encode zstd gzip

  # API Gateway & WebSocket handling
  handle /api/* {
    reverse_proxy api:4000 {
      header_up Host {host}
      header_up X-Real-IP {remote_host}
    }
  }

  # HLS Media Streaming endpoint (Direct high-performance file serving)
  handle /media/* {
    root * /vault/storage
    file_server {
      hide .*
      precompressed gzip zstd
    }
    header {
      Access-Control-Allow-Origin *
      Cache-Control "public, max-age=31536000, immutable"
    }
  }

  # Web Frontend SPA & PWA
  handle {
    reverse_proxy web:3000
  }
}
`;

export const TAILSCALE_SIDECAR_CONFIG = `version: "3.8"

# Tailscale Sidecar Integration for StreamVault
# Connects StreamVault directly into your private WireGuard mesh without exposing any router ports.

services:
  tailscale:
    image: tailscale/tailscale:latest
    container_name: streamvault-tailscale
    hostname: streamvault
    environment:
      - TS_AUTHKEY=\${TAILSCALE_AUTH_KEY} # Pre-authenticated reusable node key
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_USERSPACE=false
    volumes:
      - ./data/tailscale:/var/lib/tailscale
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - NET_ADMIN
      - NET_RAW
    restart: unless-stopped
`;

export const HOST_SETUP_GUIDE = [
  {
    step: '1. Host Server Preparation (Ubuntu/Debian)',
    command: 'sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg lsb-release zfsutils-linux vainfo',
    explanation: 'Installs system dependencies, ZFS utilities for data integrity, and vainfo to verify video acceleration hardware.'
  },
  {
    step: '2. Verify Hardware Acceleration Driver',
    command: 'ls -l /dev/dri && vainfo',
    explanation: 'Confirms that the host kernel sees the Intel/AMD integrated GPU render node (/dev/dri/renderD128) for hardware transcoding.'
  },
  {
    step: '3. Create StreamVault Storage Directories & ZFS Datasets',
    command: 'sudo mkdir -p /opt/streamvault/data/{storage,staging,caddy_data,redis,postgres} && sudo chown -R $USER:$USER /opt/streamvault',
    explanation: 'Creates isolated directory trees for staging volatile downloads, persistent storage, and database state.'
  },
  {
    step: '4. Install Docker & Docker Compose v2',
    command: 'curl -fsSL https://get.docker.com | sh && sudo usermod -aG docker,video,render $USER',
    explanation: 'Installs Docker engine and adds the user to video and render groups to grant GPU access without root.'
  },
  {
    step: '5. Launch StreamVault Production Stack',
    command: 'cd /opt/streamvault && docker compose up -d',
    explanation: 'Pulls containers, initializes internal Redis and Postgres, binds hardware devices, and boots Caddy reverse proxy.'
  },
  {
    step: '6. Connect to Tailscale Mesh Network',
    command: 'curl -fsSL https://tailscale.com/install.sh | sh && sudo tailscale up --ssh --operator=$USER',
    explanation: 'Joins your server to your private mesh VPN with MagicDNS. StreamVault is now reachable via http://streamvault.your-tailnet.ts.net.'
  }
];
