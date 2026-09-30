import React, { useState } from 'react';
import { MediaItem } from '../types';
import { X, ZoomIn, ZoomOut, RotateCw, Download, Camera, Sliders, Image as ImageIcon, Info } from 'lucide-react';

interface ImageViewerModalProps {
  item: MediaItem;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ item, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showExifSidebar, setShowExifSidebar] = useState(true);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-6xl h-[92vh] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-400 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-white truncate">
                {item.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-mono">{item.filename}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{(item.sizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                <span aria-hidden="true">·</span>
                <span>{item.imageDetails?.dimensions || 'High Resolution'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExifSidebar(!showExifSidebar)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1.5 ${
                showExifSidebar
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                  : 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>EXIF Metadata</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close image viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Canvas + Metadata Drawer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Photo Viewport */}
          <div className="flex-1 relative bg-neutral-950 flex items-center justify-center overflow-hidden p-4">
            <div 
              className="transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`
              }}
            >
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded select-none shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Floating Zoom & Controls Toolbar */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-700/80 px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md text-neutral-300 text-xs">
              <button 
                onClick={handleZoomOut} 
                className="p-1 hover:text-white transition-colors" 
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono tabular-nums px-1 text-amber-400 font-medium">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button 
                onClick={handleZoomIn} 
                className="p-1 hover:text-white transition-colors" 
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-neutral-600">|</span>
              <button 
                onClick={handleRotate} 
                className="p-1 hover:text-white transition-colors" 
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button 
                onClick={handleReset} 
                className="px-2 py-0.5 text-[11px] bg-neutral-800 rounded hover:bg-neutral-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* EXIF Metadata Sidebar */}
          {showExifSidebar && (
            <aside className="w-80 border-l border-neutral-800 bg-neutral-900/95 overflow-y-auto p-5 flex flex-col gap-6 text-xs text-neutral-300">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-400" />
                  Camera & Optics Exposure
                </h3>
                <div className="space-y-2.5 bg-neutral-950/60 border border-neutral-800/80 rounded-lg p-3">
                  <div>
                    <div className="text-neutral-500">Camera System</div>
                    <div className="font-semibold text-white">
                      {item.imageDetails?.cameraMake} {item.imageDetails?.cameraModel || 'Custom Sensor'}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Lens Specification</div>
                    <div className="text-neutral-200">
                      {item.imageDetails?.lens || 'Prime Optical Lens'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800/60">
                    <div>
                      <div className="text-neutral-500">Focal Length</div>
                      <div className="font-mono text-neutral-200 font-medium">
                        {item.imageDetails?.focalLength || '35mm'}
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-500">Aperture</div>
                      <div className="font-mono text-neutral-200 font-medium">
                        {item.imageDetails?.aperture || 'f/2.8'}
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-500">Shutter Speed</div>
                      <div className="font-mono text-neutral-200 font-medium">
                        {item.imageDetails?.shutterSpeed || '1/125s'}
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-500">ISO Sensitivity</div>
                      <div className="font-mono text-amber-400 font-semibold">
                        ISO {item.imageDetails?.iso || 100}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
                  Color & Dimensional Attributes
                </h3>
                <div className="space-y-2 bg-neutral-950/60 border border-neutral-800/80 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Resolution:</span>
                    <span className="font-mono text-white">{item.imageDetails?.dimensions || '8256 x 5504'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Aspect Ratio:</span>
                    <span className="font-mono text-neutral-300">{item.imageDetails?.aspectRatio || '4:3'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Color Profile:</span>
                    <span className="font-mono text-neutral-300">{item.imageDetails?.colorSpace || 'Adobe RGB'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Master Bit Depth:</span>
                    <span className="font-mono text-neutral-300">14-bit Uncompressed RAW</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
                  Taxonomy & Archive Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[11px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert(`Master file ${item.filename} downloaded from local ZFS storage pool.`)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Original RAW Master</span>
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
