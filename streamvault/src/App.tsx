import React, { useState } from 'react';
import { MediaItem } from './types';
import { INITIAL_MEDIA_ITEMS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { SimpleDownloaderView } from './components/SimpleDownloaderView';
import { DockerBlueprintView } from './components/DockerBlueprintView';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AuthModal } from './components/AuthModal';
import { ServerConnectModal } from './components/ServerConnectModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'downloader' | 'setup'>('downloader');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [activeModalItem, setActiveModalItem] = useState<MediaItem | null>(null);

  // Authentication state
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; isAdmin: boolean } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Server connection state
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [activeServerId, setActiveServerId] = useState('local-docker');
  const [activeServerName, setActiveServerName] = useState('StreamVault Main');

  // Handle new downloaded media addition
  const handleAddMedia = (newItem: MediaItem) => {
    setMediaItems((prev) => [newItem, ...prev]);
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleServerSelect = (serverId: string) => {
    setActiveServerId(serverId);
    if (serverId === 'local-docker') setActiveServerName('StreamVault Main');
    else if (serverId === 'tailscale-mesh') setActiveServerName('Tailscale Mesh');
    else if (serverId === 'cloudflare-edge') setActiveServerName('Cloudflare Tunnel');
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navbar with Log In / Sign Up, Storage Progress Meter & Server status */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuth}
        onLogout={() => setCurrentUser(null)}
        onOpenServerModal={() => setIsServerModalOpen(true)}
        activeServerName={activeServerName}
        mediaItems={mediaItems}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'downloader' ? (
          <SimpleDownloaderView
            items={mediaItems}
            onSelectItem={(item) => setActiveModalItem(item)}
            onAddMedia={handleAddMedia}
            onOpenServerModal={() => setIsServerModalOpen(true)}
            activeServerName={activeServerName}
            onSwitchServer={handleServerSelect}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div>
                <h2 className="text-xl font-bold text-white">Server Deployment & Cloudflare Guide</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Step-by-step instructions to run StreamVault on your host Linux server or VPS.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('downloader')}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 border border-neutral-700 text-cyan-300 hover:text-white"
              >
                Back to Downloader
              </button>
            </div>
            <DockerBlueprintView />
          </div>
        )}
      </main>

      {/* Auth Modal (Log In / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* 1-Click Server Connect Modal */}
      <ServerConnectModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        activeServerId={activeServerId}
        onSelectServer={handleServerSelect}
      />

      {/* Video Player Modal */}
      {activeModalItem && (
        <VideoPlayerModal
          item={activeModalItem}
          onClose={() => setActiveModalItem(null)}
        />
      )}

      {/* Clean minimal footer */}
      <footer className="border-t border-neutral-900 py-6 px-4 sm:px-6 text-xs text-neutral-500 bg-[#06070a]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
              StreamVault
            </span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span>Fast Server-Side Video Downloader & Personal Archive</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-500">
            <button
              onClick={() => setIsServerModalOpen(true)}
              className="text-cyan-400 hover:underline"
            >
              Server: {activeServerName}
            </button>
            <span>·</span>
            <span>Zero Device Compute Load</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
