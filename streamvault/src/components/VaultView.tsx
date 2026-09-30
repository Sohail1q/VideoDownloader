import React, { useState, useMemo } from 'react';
import { MediaItem, MediaType } from '../types';
import { 
  Film, Image as ImageIcon, FileText, Search, 
  Grid, List, HardDrive, ArrowUpDown, Clock, 
  Play, Tag, Sparkles, FolderArchive, Smartphone, 
  Download, Lock, Eye, Check, Plus, Zap 
} from 'lucide-react';

interface VaultViewProps {
  items: MediaItem[];
  onSelectItem: (item: MediaItem) => void;
  onOpenIngest: () => void;
  isAdmin: boolean;
  onTogglePrivacy?: (id: string) => void;
  onQuickFetch?: (url: string) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({ 
  items, 
  onSelectItem, 
  onOpenIngest,
  isAdmin,
  onTogglePrivacy,
  onQuickFetch
}) => {
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'title'>('date');
  const [quickUrl, setQuickUrl] = useState('');
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Compute storage statistics
  const totalSizeBytes = useMemo(() => {
    return items.reduce((acc, item) => acc + item.sizeBytes, 0);
  }, [items]);

  const totalSizeFormatted = (totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2);

  // Filter items (hide private items if not admin)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Hide private items if user is not admin
        if (item.isPrivate && !isAdmin) return false;

        if (selectedType !== 'all' && item.type !== selectedType) return false;
        if (selectedTag && !item.tags.includes(selectedTag)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchFile = item.filename.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchFile && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.dateArchived).getTime() - new Date(a.dateArchived).getTime();
        }
        if (sortBy === 'size') {
          return b.sizeBytes - a.sizeBytes;
        }
        return a.title.localeCompare(b.title);
      });
  }, [items, selectedType, selectedTag, searchQuery, sortBy, isAdmin]);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Export to phone simulation / download
  const handleExportToPhone = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const fakeContent = item.documentDetails?.content || `StreamVault Media Export: ${item.title}`;
    const blob = new Blob([fakeContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.filename;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccessId(item.id);
    setTimeout(() => setDownloadSuccessId(null), 2500);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;
    if (onQuickFetch) {
      onQuickFetch(quickUrl.trim());
      setQuickUrl('');
    } else {
      onOpenIngest();
    }
  };

  return (
    <div className="space-y-6">
      {/* Neon Cyber Storage Pool Header */}
      <div className="border border-cyan-500/30 rounded-2xl bg-neutral-950/80 p-5 backdrop-blur-md relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)]">
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-pink-500/20 border border-cyan-500/40 text-cyan-400 shrink-0 shadow-lg">
              <HardDrive className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  StreamVault Master Media Pool
                </h3>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                  ZFS RAID-Z2 · ONLINE
                </span>
                {isAdmin ? (
                  <span className="text-[10px] font-mono text-pink-300 bg-pink-500/15 border border-pink-400/30 px-2 py-0.5 rounded">
                    ADMIN STORAGE UNLOCKED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                    PUBLIC ACCESS VIEW
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Zero client-side compute. All video streams and files are indexed with direct high-speed export to mobile devices.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl px-3.5 py-2">
              <div className="text-neutral-500 text-[10px] uppercase">Storage Active</div>
              <div className="text-cyan-400 font-bold tabular-nums">
                {totalSizeFormatted} GB <span className="text-neutral-500 font-normal">/ 4.00 TB</span>
              </div>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl px-3.5 py-2">
              <div className="text-neutral-500 text-[10px] uppercase">Total Objects</div>
              <div className="text-pink-400 font-bold tabular-nums">
                {items.length} Files
              </div>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl px-3.5 py-2">
              <div className="text-neutral-500 text-[10px] uppercase">Speed Pipeline</div>
              <div className="text-emerald-400 font-bold">
                1.0 Gbps Direct
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Neon Storage Indicator */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center gap-3 relative z-10">
          <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden flex border border-neutral-800">
            <div className="bg-gradient-to-r from-cyan-400 to-pink-500 h-full" style={{ width: items.length > 0 ? '4.5%' : '0.2%' }} />
          </div>
          <span className="text-[11px] font-mono text-cyan-400 whitespace-nowrap">
            {items.length > 0 ? 'Active Partition' : 'Fresh Vault Ready'}
          </span>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Type Filter Buttons with Neon Glow */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => { setSelectedType('all'); setSelectedTag(null); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              selectedType === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Vault ({items.length})
          </button>
          <button
            onClick={() => { setSelectedType('video'); setSelectedTag(null); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              selectedType === 'video'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/50'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ultra Videos ({items.filter(i => i.type === 'video').length})</span>
          </button>
          <button
            onClick={() => { setSelectedType('image'); setSelectedTag(null); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              selectedType === 'image'
                ? 'bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/50'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>Galleries ({items.filter(i => i.type === 'image').length})</span>
          </button>
          <button
            onClick={() => { setSelectedType('document'); setSelectedTag(null); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              selectedType === 'document'
                ? 'bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/50'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Documents ({items.filter(i => i.type === 'document').length})</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, codec, tag..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-pink-500 font-mono"
          >
            <option value="date">Sort: Recent</option>
            <option value="size">Sort: Size</option>
            <option value="title">Sort: Title</option>
          </select>

          {/* Layout switcher */}
          <div className="hidden sm:flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-lg ${viewLayout === 'grid' ? 'bg-neutral-800 text-cyan-400' : 'text-neutral-500 hover:text-neutral-300'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-lg ${viewLayout === 'list' ? 'bg-neutral-800 text-pink-400' : 'text-neutral-500 hover:text-neutral-300'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Items or Clean Ready State */}
      {filteredItems.length === 0 ? (
        <div className="border border-cyan-500/20 rounded-2xl p-8 sm:p-12 text-center bg-neutral-950/70 relative overflow-hidden shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-pink-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Zap className="w-8 h-8 text-cyan-300" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            StreamVault is Ready for Your Content
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto mt-1.5 mb-6 leading-relaxed">
            All default mock assets have been cleared. You can paste any media link below to trigger the ultra-high-speed server downloader (yt-dlp + FFmpeg hardware acceleration) and start populating your vault.
          </p>

          {/* Direct Ingest Input in Empty State */}
          <form onSubmit={handleQuickSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="url"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="Paste YouTube, Vimeo, Reddit, X, TikTok, or MP4 URL..."
              className="flex-1 px-4 py-2.5 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg neon-glow-cyan transition-all whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-neutral-950" />
              <span>Fetch Ultra Video</span>
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <span>Or switch to</span>
            <button
              onClick={onOpenIngest}
              className="text-cyan-400 hover:underline font-mono"
            >
              Server Ingestion Console
            </button>
            <span>to inspect live terminal logs</span>
          </div>
        </div>
      ) : viewLayout === 'grid' ? (
        /* Grid Presentation */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group cursor-pointer border border-neutral-800 hover:border-cyan-500/50 bg-neutral-900/80 hover:bg-neutral-900 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                {item.type === 'video' ? (
                  <>
                    <img
                      src={item.thumbnailUrl || '/src/assets/images/streamvault_video_thumb_1_1790761832657.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    
                    {/* Duration badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 font-mono text-[11px] text-white">
                      {formatDuration(item.videoDetails?.duration)}
                    </div>

                    {/* Codec & Resolution indicator */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-400 to-pink-500 text-neutral-950 font-bold shadow-md">
                        {item.videoDetails?.resolution.includes('3840') ? '4K ULTRA' : '1080p HQ'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-black/75 text-neutral-300 border border-neutral-800">
                        {item.videoDetails?.codec.split(' ')[0]}
                      </span>
                    </div>

                    {/* Center hover play icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-cyan-400 text-neutral-950 flex items-center justify-center shadow-lg neon-glow-cyan">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>
                  </>
                ) : item.type === 'image' ? (
                  <>
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-pink-500 text-neutral-950 font-mono text-[10px] font-bold">
                      RAW PHOTO
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full p-5 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col justify-between">
                    <span className="p-2 rounded-lg bg-purple-500/15 text-purple-400 w-fit">
                      <FileText className="w-5 h-5" />
                    </span>
                    <p className="text-xs text-neutral-400 line-clamp-3 font-mono">
                      {item.documentDetails?.content.slice(0, 140)}...
                    </p>
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2 font-mono">
                    <span className="text-cyan-400 tabular-nums">{formatFileSize(item.sizeBytes)}</span>
                    <span>·</span>
                    <span className="text-pink-400">{item.platform || 'Server Ingest'}</span>
                    <span>·</span>
                    <span>{new Date(item.dateArchived).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Actions: Export to Phone & Privacy */}
                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => handleExportToPhone(item, e)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg bg-neutral-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-neutral-300 border border-neutral-700/60 transition-colors"
                    title="Export direct file to mobile device or computer"
                  >
                    {downloadSuccessId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Saved!</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Export to Phone</span>
                      </>
                    )}
                  </button>

                  {isAdmin && onTogglePrivacy && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePrivacy(item.id);
                      }}
                      className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                        item.isPrivate
                          ? 'text-pink-400 bg-pink-500/10 border border-pink-500/30'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                      title={item.isPrivate ? 'Private (Admin Only)' : 'Public to All Visitors'}
                    >
                      {item.isPrivate ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Presentation */
        <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/60 divide-y divide-neutral-800">
          <div className="px-4 py-3 bg-neutral-950 text-xs font-semibold text-neutral-400 grid grid-cols-12 gap-4">
            <span className="col-span-6 sm:col-span-5">Media Title</span>
            <span className="col-span-2 hidden sm:block">Format</span>
            <span className="col-span-3 sm:col-span-2 text-right">Size</span>
            <span className="col-span-3 text-right">Export Action</span>
          </div>

          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="px-4 py-3.5 hover:bg-neutral-800/60 cursor-pointer grid grid-cols-12 gap-4 items-center text-xs transition-colors"
            >
              <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-neutral-800 text-cyan-400 shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate">{item.title}</div>
                  <div className="font-mono text-neutral-500 text-[11px] truncate">{item.filename}</div>
                </div>
              </div>

              <div className="col-span-2 hidden sm:block font-mono text-neutral-400">
                {item.videoDetails?.resolution || 'Original HQ'}
              </div>

              <div className="col-span-3 sm:col-span-2 text-right font-mono tabular-nums text-cyan-300">
                {formatFileSize(item.sizeBytes)}
              </div>

              <div className="col-span-3 text-right">
                <button
                  onClick={(e) => handleExportToPhone(item, e)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-neutral-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-neutral-300 transition-colors inline-flex items-center gap-1"
                >
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
