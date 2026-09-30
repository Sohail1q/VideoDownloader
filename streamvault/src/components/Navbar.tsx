import React from 'react';
import { MediaItem } from '../types';
import { HardDrive, Server, User, LogOut, UserPlus, LogIn, Cpu, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'downloader' | 'setup';
  setActiveTab: (tab: 'downloader' | 'setup') => void;
  currentUser: { email: string; name: string; isAdmin: boolean } | null;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenServerModal: () => void;
  activeServerName: string;
  mediaItems: MediaItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenServerModal,
  activeServerName,
  mediaItems
}) => {
  // Calculate storage consumed vs total available disk space
  const totalSizeBytes = mediaItems.reduce((acc, item) => acc + item.sizeBytes, 0);
  const totalDiskCapacityBytes = 500 * 1024 * 1024 * 1024; // 500 GB capacity
  const percentUsed = Math.min((totalSizeBytes / totalDiskCapacityBytes) * 100, 100);

  const formatStorage = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/30 bg-neutral-950/95 backdrop-blur-md shadow-[0_4px_25px_rgba(6,182,212,0.1)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-cyan-500/20 shrink-0">
            <HardDrive className="w-4 h-4 text-neutral-950" />
          </div>
          <button
            onClick={() => setActiveTab('downloader')}
            className="text-left font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 hover:opacity-90 transition-opacity"
          >
            <span className="text-lg">StreamVault</span>
          </button>
        </div>

        {/* Neon-Cyan Storage Stats Progress Bar in Header */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 border border-cyan-500/30 text-xs shadow-inner">
          <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between gap-3 text-[10px] font-mono leading-none">
              <span className="text-cyan-300 font-bold">{formatStorage(totalSizeBytes)}</span>
              <span className="text-neutral-500 font-normal">/ 500 GB</span>
              <span className="text-pink-400 font-bold">{percentUsed.toFixed(1)}%</span>
            </div>
            <div className="w-24 sm:w-28 h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-cyan-500/30">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300 shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-all duration-300"
                style={{ width: `${Math.max(percentUsed, totalSizeBytes > 0 ? 3 : 0.5)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Simple Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setActiveTab('downloader')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'downloader'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Downloader
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'setup'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-400/50 shadow-[0_0_12px_rgba(236,72,153,0.25)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-pink-400" />
            <span>Server Deployment</span>
          </button>
        </div>

        {/* Server & User Auth Actions */}
        <div className="flex items-center gap-2">
          {/* 1-Click Server Quick Status */}
          <button
            onClick={onOpenServerModal}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-mono rounded-xl bg-neutral-900 border border-cyan-500/30 text-neutral-300 hover:border-cyan-400 transition-colors shadow-sm"
            title="Click to switch or connect servers"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-cyan-300 truncate max-w-[100px] sm:max-w-[130px]">{activeServerName}</span>
          </button>

          {/* User Logged in vs Log In / Sign Up */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs flex items-center gap-1.5 text-white">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-cyan-300 font-bold truncate max-w-[100px] sm:max-w-[120px]">
                  {currentUser.name}
                </span>
                {currentUser.isAdmin && (
                  <span className="text-[10px] font-mono font-bold text-pink-400 bg-pink-500/15 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-neutral-200 hover:text-white rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-600 transition-colors flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('signup')}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-extrabold text-neutral-950 bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-cyan-300 hover:to-pink-400 rounded-xl transition-all shadow-md neon-glow-cyan flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5 text-neutral-950 stroke-[3]" />
                <span className="hidden sm:inline">Sign Up</span>
                <span className="sm:hidden">Join</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav bar row including storage meter */}
      <div className="md:hidden flex items-center justify-between border-t border-cyan-500/20 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('downloader')}
            className={`px-2 py-0.5 ${activeTab === 'downloader' ? 'text-cyan-400 font-bold' : ''}`}
          >
            Downloader
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-2 py-0.5 ${activeTab === 'setup' ? 'text-pink-400 font-bold' : ''}`}
          >
            Setup
          </button>
        </div>

        {/* Mobile mini storage meter */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300">
          <HardDrive className="w-3 h-3 text-cyan-400" />
          <span>{formatStorage(totalSizeBytes)}</span>
          <div className="w-12 h-1 bg-neutral-900 rounded-full overflow-hidden border border-cyan-500/30">
            <div 
              className="h-full bg-cyan-400" 
              style={{ width: `${Math.max(percentUsed, totalSizeBytes > 0 ? 5 : 1)}%` }} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};
