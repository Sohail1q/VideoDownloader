import React, { useState } from 'react';
import { 
  DOCKER_COMPOSE_BLUEPRINT, 
  ENV_PRODUCTION_CONFIG, 
  CADDYFILE_CONFIG, 
  TAILSCALE_SIDECAR_CONFIG, 
  HOST_SETUP_GUIDE 
} from '../data/mockData';
import { 
  Copy, Check, Download, Terminal, Cpu, FileCode, 
  Shield, HardDrive, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const DockerBlueprintView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compose' | 'env' | 'caddy' | 'tailscale' | 'steps'>('compose');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getFileContent = () => {
    switch (activeTab) {
      case 'compose':
        return { content: DOCKER_COMPOSE_BLUEPRINT, filename: 'docker-compose.yml', lang: 'yaml' };
      case 'env':
        return { content: ENV_PRODUCTION_CONFIG, filename: '.env', lang: 'bash' };
      case 'caddy':
        return { content: CADDYFILE_CONFIG, filename: 'Caddyfile', lang: 'caddyfile' };
      case 'tailscale':
        return { content: TAILSCALE_SIDECAR_CONFIG, filename: 'docker-compose.tailscale.yml', lang: 'yaml' };
      default:
        return null;
    }
  };

  const fileData = getFileContent();

  const handleDownloadFile = () => {
    if (!fileData) return;
    const blob = new Blob([fileData.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileData.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border border-neutral-800 rounded-xl bg-neutral-900/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-amber-400 font-mono text-xs uppercase tracking-wider mb-1">
              Infrastructure as Code
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              StreamVault Production Deployment Blueprint
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl leading-relaxed">
              Complete, production-hardened Docker Compose orchestration file and configuration files. Includes hardware transcoding passthrough (<code className="font-mono text-amber-300">/dev/dri</code>), automated inotify indexing, and zero-port-forwarding Tailscale integration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {fileData && (
              <button
                onClick={handleDownloadFile}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors border border-neutral-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save {fileData.filename}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'compose' ? 'bg-neutral-800 text-white font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span>docker-compose.yml</span>
        </button>

        <button
          onClick={() => setActiveTab('env')}
          className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'env' ? 'bg-neutral-800 text-white font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>.env.production</span>
        </button>

        <button
          onClick={() => setActiveTab('caddy')}
          className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'caddy' ? 'bg-neutral-800 text-white font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <span>Caddyfile (Reverse Proxy)</span>
        </button>

        <button
          onClick={() => setActiveTab('tailscale')}
          className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'tailscale' ? 'bg-neutral-800 text-white font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Tailscale Sidecar</span>
        </button>

        <button
          onClick={() => setActiveTab('steps')}
          className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'steps' ? 'bg-neutral-800 text-white font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Host Setup Guide (6 Steps)</span>
        </button>
      </div>

      {/* Code Editor Viewport or Setup Steps */}
      {activeTab !== 'steps' && fileData ? (
        <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950 shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/60">
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{fileData.filename}</span>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-500">{fileData.content.split('\n').length} lines</span>
            </div>

            <button
              onClick={() => copyToClipboard(fileData.content, activeTab)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
            >
              {copied === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 sm:p-6 overflow-x-auto text-xs font-mono text-neutral-300 leading-relaxed max-h-[600px] select-text">
            <code>{fileData.content}</code>
          </pre>
        </div>
      ) : (
        /* Host Setup Step-by-Step Guide */
        <div className="space-y-4">
          <div className="border border-neutral-800 rounded-xl bg-neutral-900/60 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Step-by-Step Host Installation & Verification Walkthrough
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Follow these commands on your host Linux machine (Ubuntu 22.04 / 24.04 LTS or Debian 12 recommended) to launch the StreamVault server with hardware acceleration and Tailscale mesh security.
            </p>

            <div className="space-y-4 pt-2">
              {HOST_SETUP_GUIDE.map((step, idx) => (
                <div key={idx} className="border border-neutral-800 rounded-lg p-4 bg-neutral-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs sm:text-sm text-white">
                      {step.step}
                    </span>
                    <button
                      onClick={() => copyToClipboard(step.command, `step-${idx}`)}
                      className="text-xs flex items-center gap-1 text-neutral-400 hover:text-white"
                    >
                      {copied === `step-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-xs text-amber-300 overflow-x-auto">
                    <code>{step.command}</code>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {step.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
