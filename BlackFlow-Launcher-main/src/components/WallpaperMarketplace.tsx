import React, { useState } from 'react';
import { WallpaperItem, LiveEffectType } from '../types';
import { SAMPLE_WALLPAPERS, MORE_ONLINE_WALLPAPERS } from '../data/mockApps';
import { tactileAudio } from '../utils/audioFeedback';
import {
  ArrowLeft,
  Heart,
  Download,
  Check,
  Sparkles,
  Eye,
  CloudDownload,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

interface Props {
  currentWallpaperId?: string;
  onClose: () => void;
  onApplyLiveWallpaper: (effect: LiveEffectType) => void;
  onSetWallpaper: (wallpaper: WallpaperItem, target: 'HOME' | 'LOCK' | 'BOTH') => void;
}

export const WallpaperMarketplace: React.FC<Props> = ({
  currentWallpaperId = 'wp_amoled_pure',
  onClose,
  onApplyLiveWallpaper,
  onSetWallpaper
}) => {
  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>([
    ...SAMPLE_WALLPAPERS,
    ...MORE_ONLINE_WALLPAPERS
  ]);
  const [selectedTab, setSelectedTab] = useState<string>('AMOLED');
  const [activeWallpaperId, setActiveWallpaperId] = useState<string>(currentWallpaperId);
  const [previewWallpaper, setPreviewWallpaper] = useState<WallpaperItem | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isRefreshingCloud, setIsRefreshingCloud] = useState(false);
  const [oneClickApply] = useState(true);

  const tabs = [
    { id: 'AMOLED', label: 'AMOLED Black' },
    { id: 'MORE', label: 'Download More ☁' },
    { id: 'DARK', label: 'Matte & Vector' },
    { id: 'MINIMAL', label: 'Minimalist' },
    { id: 'SPACE', label: 'Deep Space' },
    { id: 'CARS', label: 'Hypercars Noir' },
    { id: 'ANIME', label: 'Anime Dark' },
    { id: 'LIVE', label: 'Live 60FPS' },
    { id: 'DOWNLOADED', label: 'Downloaded' },
    { id: 'FAVORITES', label: 'Favorites' }
  ];

  const filteredWallpapers = wallpapers.filter((wp) => {
    if (selectedTab === 'FAVORITES') return wp.isFavorite;
    if (selectedTab === 'DOWNLOADED') return wp.isDownloaded;
    if (selectedTab === 'MORE') return wp.category === 'MORE' || (wp.downloadCount && wp.downloadCount > 15000);
    if (selectedTab === 'AMOLED') return wp.category === 'AMOLED' || wp.id.includes('amoled') || wp.id.includes('dark');
    return wp.category === selectedTab;
  });

  // Instant 1-Click Wallpaper Apply
  const handleInstantApply = (wp: WallpaperItem, target: 'HOME' | 'LOCK' | 'BOTH' = 'BOTH', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    tactileAudio.playClick(2400);
    setActiveWallpaperId(wp.id);

    if (wp.isLive && wp.liveEffect) {
      onApplyLiveWallpaper(wp.liveEffect);
    }
    onSetWallpaper(wp, target);

    setAppliedNotification(`Applied "${wp.title}" to ${target === 'BOTH' ? 'Home & Lock' : target}`);
    setTimeout(() => {
      setAppliedNotification(null);
    }, 2200);
  };

  // Real File Download Execution
  const handleDownload = async (wp: WallpaperItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    tactileAudio.playClick(1800);
    setDownloadingId(wp.id);

    try {
      if (wp.highResUrl || wp.thumbnailUrl) {
        const srcUrl = wp.highResUrl || wp.thumbnailUrl;
        try {
          const res = await fetch(srcUrl, { mode: 'cors' });
          if (res.ok) {
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${wp.title.replace(/[^a-zA-Z0-9]/g, '_')}_AMOLED_4K.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
          } else {
            throw new Error('Fallback anchor');
          }
        } catch {
          // Fallback direct link
          const a = document.createElement('a');
          a.href = srcUrl;
          a.target = '_blank';
          a.rel = 'noreferrer';
          a.download = `${wp.title.replace(/[^a-zA-Z0-9]/g, '_')}_AMOLED_4K.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        // Pure black canvas generator
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 2400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, 1080, 2400);
          if (wp.liveEffect === 'PARTICLES') {
            ctx.fillStyle = '#FFFFFF';
            for (let i = 0; i < 220; i++) {
              ctx.beginPath();
              ctx.arc(Math.random() * 1080, Math.random() * 2400, Math.random() * 2 + 1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          const dataUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `${wp.title.replace(/[^a-zA-Z0-9]/g, '_')}_AMOLED.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }

      setWallpapers((prev) =>
        prev.map((item) =>
          item.id === wp.id
            ? { ...item, isDownloaded: true, downloadCount: (item.downloadCount || 0) + 1 }
            : item
        )
      );
      setAppliedNotification(`Downloaded "${wp.title}" to device storage!`);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
      setTimeout(() => setAppliedNotification(null), 2500);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    tactileAudio.playClick(2100);
    setWallpapers((prev) =>
      prev.map((wp) => (wp.id === id ? { ...wp, isFavorite: !wp.isFavorite } : wp))
    );
  };

  // Simulates fetching more fresh wallpapers from cloud
  const handleFetchMoreCloud = () => {
    tactileAudio.playClick(2000);
    setIsRefreshingCloud(true);
    setTimeout(() => {
      const extraWallpapers: WallpaperItem[] = [
        {
          id: `wp_extra_${Date.now()}_1`,
          title: 'Deep Obsidian Singularity Matrix',
          category: 'MORE',
          thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400',
          highResUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1800',
          resolution: '4K Ultra (2160×3840)',
          downloadCount: 34100,
          isFavorite: false,
          isNew: true
        },
        {
          id: `wp_extra_${Date.now()}_2`,
          title: 'Cyberpunk Vector Noir Highway',
          category: 'MORE',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400',
          highResUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1800',
          resolution: '4K AMOLED (2160×3840)',
          downloadCount: 41200,
          isFavorite: true,
          isNew: true
        }
      ];
      setWallpapers((prev) => [...extraWallpapers, ...prev]);
      setIsRefreshingCloud(false);
      setAppliedNotification('Loaded 2 fresh 4K cloud wallpapers!');
      setTimeout(() => setAppliedNotification(null), 2500);
    }, 900);
  };

  return (
    <div
      id="wallpaper_store_container"
      className="absolute inset-0 z-30 bg-[#000000] text-white flex flex-col select-none overflow-hidden animate-fade-in"
    >
      {/* Header */}
      <div className="pt-5 px-5 pb-3 border-b border-neutral-900 flex items-center justify-between bg-black/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            id="btn_wallpaper_back"
            onClick={() => {
              tactileAudio.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-neutral-900 active:scale-95 transition-all text-neutral-300 hover:text-white"
          >
            <ArrowLeft size={19} />
          </button>
          <div>
            <h2 className="text-xs font-semibold tracking-wider font-mono flex items-center gap-2">
              <span>WALLPAPER STUDIO</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                1-CLICK INSTANT
              </span>
            </h2>
            <p className="text-[10px] text-neutral-500 font-mono">
              Click any wallpaper to apply instantly • Download 4K
            </p>
          </div>
        </div>

        {/* Download More Button */}
        <button
          onClick={() => {
            tactileAudio.playClick(2300);
            setSelectedTab('MORE');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono tracking-wider transition-all ${
            selectedTab === 'MORE'
              ? 'bg-white text-black font-bold border-white'
              : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white'
          }`}
        >
          <CloudDownload size={13} />
          <span>MORE</span>
        </button>
      </div>

      {/* Cloud Banner in 'MORE' Tab */}
      {selectedTab === 'MORE' && (
        <div className="mx-5 mt-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <CloudDownload size={16} />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white">Cloud Wallpaper Depot</div>
              <div className="text-[10px] text-neutral-400 font-mono">
                Curated 4K UHD AMOLED dark wallpapers
              </div>
            </div>
          </div>
          <button
            onClick={handleFetchMoreCloud}
            disabled={isRefreshingCloud}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 text-[10px] font-mono text-white active:scale-95 transition-all"
          >
            <RefreshCw size={11} className={isRefreshingCloud ? 'animate-spin' : ''} />
            <span>{isRefreshingCloud ? 'Fetching...' : 'Fetch More'}</span>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 px-5 py-2.5 overflow-x-auto no-scrollbar border-b border-neutral-900/80">
        {tabs.map((tab) => {
          const isSelected = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                tactileAudio.playClick(2000);
                setSelectedTab(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-wider transition-all whitespace-nowrap flex items-center gap-1 ${
                isSelected
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-neutral-200 hover:border-neutral-800'
              }`}
            >
              {tab.id === 'MORE' && <CloudDownload size={11} />}
              {tab.id === 'DOWNLOADED' && <HardDrive size={11} />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notification Toast */}
      {appliedNotification && (
        <div className="mx-5 mt-2 px-3.5 py-2 bg-neutral-900/95 border border-neutral-700 text-xs font-mono text-white rounded-xl flex items-center justify-between shadow-lg animate-fade-in z-20">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-[11px] truncate">{appliedNotification}</span>
          </div>
          <span className="text-[9px] text-neutral-400 font-mono">READY</span>
        </div>
      )}

      {/* Wallpaper Cards Grid */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {filteredWallpapers.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-neutral-500 font-mono text-xs">
            <CloudDownload size={32} className="mb-2 opacity-50" />
            <p>No wallpapers in this view.</p>
            {selectedTab === 'DOWNLOADED' && (
              <p className="text-[10px] text-neutral-600 mt-1">
                Tap the download icon on any wallpaper to save it locally.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 pb-10">
            {filteredWallpapers.map((wp) => {
              const isActive = activeWallpaperId === wp.id;
              const isDownloading = downloadingId === wp.id;

              return (
                <div
                  key={wp.id}
                  onClick={() => handleInstantApply(wp, 'BOTH')}
                  className={`relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-950 border transition-all cursor-pointer group flex flex-col justify-between p-3 ${
                    isActive
                      ? 'border-white ring-2 ring-white/30 shadow-lg'
                      : 'border-neutral-850 hover:border-neutral-600'
                  }`}
                >
                  {/* Wallpaper Thumbnail Image */}
                  {wp.thumbnailUrl ? (
                    <img
                      src={wp.thumbnailUrl}
                      alt={wp.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#000000] flex items-center justify-center">
                      <Sparkles size={24} className="text-neutral-600" />
                    </div>
                  )}

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />

                  {/* Top Badges & Actions */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                      {isActive && (
                        <span className="px-1.5 py-0.5 rounded-full bg-white text-black text-[8px] font-mono font-bold tracking-wider shadow">
                          ✓ ACTIVE
                        </span>
                      )}
                      {wp.isNew && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-black text-[8px] font-mono font-bold tracking-wider">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Preview Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          tactileAudio.playClick();
                          setPreviewWallpaper(wp);
                        }}
                        className="p-1.5 rounded-full bg-black/60 text-neutral-300 hover:text-white hover:bg-black/80 active:scale-95 transition-all"
                        title="Preview Full Screen"
                      >
                        <Eye size={12} />
                      </button>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(wp.id, e)}
                        className="p-1.5 rounded-full bg-black/60 text-white hover:scale-110 active:scale-95 transition-all"
                      >
                        <Heart
                          size={12}
                          className={wp.isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-400'}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Info & Download Action */}
                  <div className="relative z-10">
                    <div className="mb-2">
                      {wp.isLive && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-white text-[8px] font-mono font-bold tracking-wider mb-1">
                          LIVE 60FPS
                        </span>
                      )}
                      <h4 className="text-xs font-semibold text-white tracking-tight leading-tight line-clamp-1">
                        {wp.title}
                      </h4>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[9px] text-neutral-400 font-mono">
                          {wp.resolution || wp.category}
                        </span>
                        {wp.downloadCount && (
                          <span className="text-[8px] text-neutral-500 font-mono">
                            {wp.downloadCount > 1000
                              ? `${(wp.downloadCount / 1000).toFixed(1)}k dl`
                              : `${wp.downloadCount} dl`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick 1-Click Action & Download Button */}
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={(e) => handleInstantApply(wp, 'BOTH', e)}
                        className={`col-span-2 py-1 px-2 rounded-lg text-[10px] font-mono tracking-wider font-semibold flex items-center justify-center gap-1 transition-all ${
                          isActive
                            ? 'bg-white text-black'
                            : 'bg-black/70 border border-neutral-700 text-white hover:bg-white hover:text-black'
                        }`}
                      >
                        <Check size={11} />
                        <span>{isActive ? 'Applied' : 'Apply'}</span>
                      </button>

                      {/* Direct Download Button */}
                      <button
                        onClick={(e) => handleDownload(wp, e)}
                        disabled={isDownloading}
                        className={`py-1 px-1.5 rounded-lg border text-[10px] font-mono flex items-center justify-center transition-all ${
                          wp.isDownloaded
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                            : 'bg-black/70 border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500'
                        }`}
                        title="Download wallpaper to storage"
                      >
                        {isDownloading ? (
                          <RefreshCw size={11} className="animate-spin text-white" />
                        ) : wp.isDownloaded ? (
                          <Check size={11} />
                        ) : (
                          <Download size={11} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Screen Preview Modal */}
      {previewWallpaper && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-between p-6 animate-fade-in select-none">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                tactileAudio.playClick();
                setPreviewWallpaper(null);
              }}
              className="p-2 rounded-full bg-neutral-900 text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="text-xs font-mono tracking-widest text-neutral-400">
              AMOLED 4K PREVIEW
            </span>
            <button
              onClick={(e) => handleDownload(previewWallpaper, e)}
              className="p-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
              title="Download Wallpaper"
            >
              <Download size={16} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            {previewWallpaper.isLive ? (
              <div className="flex flex-col items-center">
                <Sparkles size={40} className="text-white animate-pulse mb-3" />
                <h3 className="text-lg font-light tracking-wide text-white">
                  {previewWallpaper.title}
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Engine: Android WallpaperService Canvas
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-light tracking-wide text-white">
                  {previewWallpaper.title}
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Resolution: {previewWallpaper.resolution || '4K UHD (2160×3840)'}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              id="btn_apply_both"
              onClick={() => {
                handleInstantApply(previewWallpaper, 'BOTH');
                setPreviewWallpaper(null);
              }}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs font-mono tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={14} />
              <span>APPLY TO HOME & LOCK SCREEN</span>
            </button>
            <button
              id="btn_apply_home"
              onClick={() => {
                handleInstantApply(previewWallpaper, 'HOME');
                setPreviewWallpaper(null);
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs font-mono tracking-wider border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              APPLY TO HOME ONLY
            </button>
            <button
              onClick={(e) => handleDownload(previewWallpaper, e)}
              className="w-full py-2.5 rounded-xl bg-neutral-950 text-neutral-300 font-mono text-xs tracking-wider border border-neutral-850 hover:text-white flex items-center justify-center gap-1.5"
            >
              <Download size={13} />
              <span>DOWNLOAD 4K IMAGE TO DEVICE</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
