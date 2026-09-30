import React, { useState } from 'react';
import { X, Server, Check, ShieldCheck, RefreshCw, Zap, Wifi, Lock, ExternalLink, ArrowRight } from 'lucide-react';

interface ServerNode {
  id: string;
  name: string;
  type: string;
  address: string;
  status: 'connected' | 'idle' | 'connecting';
  speed: string;
  description: string;
}

interface ServerConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeServerId: string;
  onSelectServer: (serverId: string) => void;
}

export const ServerConnectModal: React.FC<ServerConnectModalProps> = ({
  isOpen,
  onClose,
  activeServerId,
  onSelectServer
}) => {
  const [servers, setServers] = useState<ServerNode[]>([
    {
      id: 'local-docker',
      name: 'StreamVault Main Server',
      type: 'Local Docker Host',
      address: 'http://localhost:3000 (Internal Bridge)',
      status: 'connected',
      speed: '1.0 Gbps Direct',
      description: 'Host Docker daemon running yt-dlp & FFmpeg hardware acceleration.'
    },
    {
      id: 'tailscale-mesh',
      name: 'Tailscale Encrypted Mesh',
      type: 'Zero-Trust WireGuard',
      address: 'https://streamvault.ts.net (Peer-to-Peer)',
      status: 'idle',
      speed: '850 Mbps P2P',
      description: 'Private WireGuard tunnel connecting your phone and home server without open ports.'
    },
    {
      id: 'cloudflare-edge',
      name: 'Cloudflare Edge Tunnel',
      type: 'Remote Ingress',
      address: 'https://vault.yourdomain.com',
      status: 'idle',
      speed: '600 Mbps Edge',
      description: 'Encrypted outbound tunnel for public access from external web browsers.'
    }
  ]);

  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [permissionPrompt, setPermissionPrompt] = useState<ServerNode | null>(null);

  if (!isOpen) return null;

  const handleStartConnect = (server: ServerNode) => {
    // Open permission approval step
    setPermissionPrompt(server);
  };

  const handleApproveAndConnect = () => {
    if (!permissionPrompt) return;
    const targetId = permissionPrompt.id;
    setPermissionPrompt(null);
    setConnectingId(targetId);

    // Simulate automatic login and connection handshake
    setTimeout(() => {
      setServers((prev) =>
        prev.map((s) => ({
          ...s,
          status: s.id === targetId ? 'connected' : 'idle'
        }))
      );
      onSelectServer(targetId);
      setConnectingId(null);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden neon-border-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-400 to-pink-500 text-neutral-950 font-bold shadow-md">
              <Server className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                1-Click Server Manager
              </h3>
              <p className="text-xs text-cyan-400 font-mono">
                Connect and switch your downloader servers instantly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Approval Dialog (if requested) */}
        {permissionPrompt ? (
          <div className="py-6 space-y-4 relative z-10">
            <div className="p-4 rounded-xl bg-neutral-950 border border-cyan-500/40 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Authorize Automatic Server Connection</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                StreamVault is requesting permission to authenticate with <strong className="text-white">{permissionPrompt.name}</strong> ({permissionPrompt.address}) and mount local storage volumes.
              </p>
              <div className="text-[11px] font-mono text-neutral-400 pt-1 border-t border-neutral-800">
                Scope: Direct media download streaming · Hardware transcode passthrough
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleApproveAndConnect}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg neon-glow-cyan transition-all flex items-center justify-center gap-1.5"
              >
                <span>Allow & Connect Automatically</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPermissionPrompt(null)}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Server List */
          <div className="py-4 space-y-3 relative z-10">
            <p className="text-xs text-neutral-300 leading-relaxed">
              Click any server to authenticate and connect automatically. Your downloads will route through the selected server.
            </p>

            <div className="space-y-2.5">
              {servers.map((server) => {
                const isCurrent = server.id === activeServerId;
                const isBusy = connectingId === server.id;

                return (
                  <div
                    key={server.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-cyan-500/10 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                        : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{server.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/30">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 truncate mt-0.5">
                        {server.address}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">
                        Speed: <span className="text-emerald-400 font-mono font-semibold">{server.speed}</span> · {server.type}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isBusy ? (
                        <button
                          disabled
                          className="px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-800 text-cyan-300 flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                          <span>Pairing...</span>
                        </button>
                      ) : isCurrent ? (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-bold px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Connected</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartConnect(server)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-400 to-pink-500 hover:opacity-90 text-neutral-950 shadow-md transition-all flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3 fill-current" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onClose}
                className="text-xs text-neutral-400 hover:text-white transition-colors underline"
              >
                Close Manager
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
