import React, { useState } from 'react';
import { SubsystemNode } from '../types';
import { SUBSYSTEM_NODES } from '../data/mockData';
import { 
  Layers, Server, Database, Cpu, HardDrive, ShieldCheck, 
  ArrowRight, Radio, Check, Info, ExternalLink, Zap, Terminal 
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ingress-tier');
  const [activeStep, setActiveStep] = useState<number>(1);

  const selectedNode = SUBSYSTEM_NODES.find(n => n.id === selectedNodeId) || SUBSYSTEM_NODES[0];

  const PIPELINE_STEPS = [
    {
      num: 1,
      title: 'Client Action (Zero Compute)',
      desc: 'User pastes a video or media link into the StreamVault web portal. The browser only dispatches a 500-byte JSON REST request.'
    },
    {
      num: 2,
      title: 'Ingress & Authentication',
      desc: 'Request passes through Tailscale WireGuard mesh and Caddy reverse proxy with mTLS/OIDC verification. No open public router ports.'
    },
    {
      num: 3,
      title: 'BullMQ Task Scheduling',
      desc: 'Fastify API validates the URL and enqueues an asynchronous ingestion task into Redis with concurrency limits to prevent host IO saturation.'
    },
    {
      num: 4,
      title: 'Server-Side yt-dlp Fetch',
      desc: 'Worker container executes yt-dlp directly onto high-speed NVMe staging storage (/vault/staging) utilizing server-grade gigabit bandwidth.'
    },
    {
      num: 5,
      title: 'Hardware Transcode (QSV/NVENC)',
      desc: 'FFmpeg converts raw streams into universal H.264/HEVC adaptive bitrate HLS chunks (.m3u8) using Intel QuickSync or Nvidia NVENC.'
    },
    {
      num: 6,
      title: 'Automated ZFS Indexing & Serving',
      desc: 'The inotify daemon registers the completed file into PostgreSQL/SQLite and moves it to the ZFS RAID-Z2 pool for bitrot-protected playback.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Recommended Open Source Software Stack Summary */}
      <div className="border border-neutral-800 rounded-xl bg-neutral-900/60 p-5 backdrop-blur-sm space-y-4">
        <div>
          <div className="text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
            Production System Architecture
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            StreamVault: Recommended Open-Source Software Stack
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl leading-relaxed">
            Engineered as a decoupled, private microservices architecture containerized via Docker. Heavy media downloads, transcoding, and indexing are strictly offloaded to server daemons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
            <div className="text-neutral-500 text-[10px] uppercase font-mono">Frontend & Presentation</div>
            <div className="text-white font-semibold text-sm mt-0.5">React 19 + TypeScript + PWA</div>
            <div className="text-neutral-400 text-xs mt-1">Lightweight, instant scrubbing, responsive on mobile & TVs.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
            <div className="text-neutral-500 text-[10px] uppercase font-mono">Backend API & Ingest Queue</div>
            <div className="text-white font-semibold text-sm mt-0.5">Fastify + Redis 7 + BullMQ</div>
            <div className="text-neutral-400 text-xs mt-1">Sub-millisecond dispatch, job buffering, worker retries.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
            <div className="text-neutral-500 text-[10px] uppercase font-mono">Downloader & Media Engine</div>
            <div className="text-white font-semibold text-sm mt-0.5">yt-dlp + FFmpeg (QSV/NVENC)</div>
            <div className="text-neutral-400 text-xs mt-1">1,000+ platform extractors, hardware accelerated transcoding.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
            <div className="text-neutral-500 text-[10px] uppercase font-mono">Storage & Remote Access</div>
            <div className="text-white font-semibold text-sm mt-0.5">OpenZFS + Tailscale Mesh</div>
            <div className="text-neutral-400 text-xs mt-1">RAID-Z2 bitrot self-healing + zero-trust WireGuard mesh.</div>
          </div>
        </div>
      </div>

      {/* Interactive Topology Graph */}
      <div className="border border-neutral-800 rounded-xl bg-neutral-900/60 p-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Interactive System Topology & Component Map
            </h3>
            <p className="text-xs text-neutral-400">
              Click any subsystem block below to inspect its container configuration, ports, and data flow.
            </p>
          </div>
          <div className="text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded w-fit">
            Selected: {selectedNode.name}
          </div>
        </div>

        {/* Multi-tier Visual Graph Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUBSYSTEM_NODES.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400/60 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {node.tier.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      Port: {node.port || 'IPC'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{node.name}</h4>
                  <div className="text-xs text-amber-400 font-mono mt-0.5">{node.software}</div>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {node.description}
                </p>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Protocol: {node.protocol.split('/')[0]}</span>
                  <span className="text-amber-400 flex items-center gap-0.5">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Subsystem Detailed Inspector */}
        <div className="border border-neutral-800 rounded-xl bg-neutral-950 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <div>
              <div className="text-[11px] font-mono text-amber-400 uppercase">Subsystem Specification</div>
              <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-neutral-500">Docker Service:</span>
              <span className="text-emerald-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                {selectedNode.dockerService}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {selectedNode.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 bg-neutral-900/60 border border-neutral-800/80 rounded-lg p-3">
              <div className="text-neutral-500 font-mono text-[11px]">Hardware & Compute Budget</div>
              <div className="text-neutral-200 font-medium">{selectedNode.hardwareRequirements}</div>
            </div>

            <div className="space-y-1.5 bg-neutral-900/60 border border-neutral-800/80 rounded-lg p-3">
              <div className="text-neutral-500 font-mono text-[11px]">Transport & Network Protocol</div>
              <div className="text-neutral-200 font-medium">{selectedNode.protocol}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-neutral-300 mb-2">Hardened Security Provisions:</div>
            <div className="flex flex-wrap gap-2">
              {selectedNode.securityFeatures.map((sec, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{sec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Data Ingestion Flowchart */}
      <div className="border border-neutral-800 rounded-xl bg-neutral-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              End-to-End Server-Side Ingestion Lifecycle
            </h3>
            <p className="text-xs text-neutral-400">
              How a single URL moves from the web browser to permanent ZFS bitrot-protected storage.
            </p>
          </div>
        </div>

        {/* Step indicator buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PIPELINE_STEPS.map((step) => (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`p-3 rounded-lg border text-left transition-all ${
                activeStep === step.num
                  ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm'
                  : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-mono text-xs font-bold text-amber-400">Step 0{step.num}</div>
              <div className="text-xs font-medium mt-1 truncate">{step.title}</div>
            </button>
          ))}
        </div>

        {/* Current Step Walkthrough Box */}
        <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold shrink-0 font-mono">
            0{activeStep}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {PIPELINE_STEPS[activeStep - 1].title}
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed">
              {PIPELINE_STEPS[activeStep - 1].desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
