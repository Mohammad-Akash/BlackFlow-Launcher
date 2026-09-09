import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  CloudSun,
  Cpu,
  Battery,
  Search,
  Mic,
  Disc3,
  Activity,
  X,
  Plus,
  Zap,
  FileText,
  Footprints,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { WidgetConfig } from '../types';
import { tactileAudio } from '../utils/audioFeedback';

interface Props {
  config: WidgetConfig;
  accentColor?: string;
  isEditMode?: boolean;
  onOpenDrawer: () => void;
  onUpdateWidget?: (updated: Partial<WidgetConfig>) => void;
  onRemoveWidget?: (widgetKey: keyof WidgetConfig) => void;
  onOpenWidgetManager?: () => void;
}

export const HomeWidgets: React.FC<Props> = ({
  config,
  accentColor = '#FFFFFF',
  isEditMode = false,
  onOpenDrawer,
  onUpdateWidget,
  onRemoveWidget,
  onOpenWidgetManager
}) => {
  const [isPlaying, setIsPlaying] = useState(config.musicIsPlaying ?? true);
  const [progress, setProgress] = useState(42);
  const [isBoostingRam, setIsBoostingRam] = useState(false);
  const [ramBoosted, setRamBoosted] = useState(false);
  const [noteContent, setNoteContent] = useState(config.quickNoteText || 'Buy coffee • Call dev team • Deploy 1.0');
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Play progress animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    tactileAudio.playClick(2200);
    const next = !isPlaying;
    setIsPlaying(next);
    onUpdateWidget?.({ musicIsPlaying: next });
  };

  const handleRamBoost = () => {
    tactileAudio.playClick(1700);
    setIsBoostingRam(true);
    setTimeout(() => {
      tactileAudio.playClick(2400);
      setIsBoostingRam(false);
      setRamBoosted(true);
      setTimeout(() => setRamBoosted(false), 2500);
    }, 900);
  };

  const handleSaveNote = () => {
    setIsEditingNote(false);
    onUpdateWidget?.({ quickNoteText: noteContent });
  };

  const hasAnyWidget =
    config.showSearchPill ||
    config.showMusicPlayer ||
    config.showSystemMonitor ||
    config.showWeatherPill ||
    config.showQuickNotes ||
    config.showRamBooster ||
    config.showStepCounter;

  return (
    <div className="w-full space-y-2.5 my-2">
      {/* Search Pill Widget */}
      {config.showSearchPill && (
        <div className="relative group">
          <div
            onClick={() => {
              if (isEditMode) return;
              tactileAudio.playClick();
              onOpenDrawer();
            }}
            className="w-full h-10 px-4 rounded-full bg-neutral-950/80 border border-neutral-850 hover:border-neutral-700 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5 text-neutral-400">
              <Search size={15} strokeWidth={1.5} />
              <span className="text-xs font-mono tracking-wide text-neutral-400">Search apps, files, web...</span>
            </div>
            <Mic size={14} className="text-neutral-500 hover:text-white transition-colors" />
          </div>

          {isEditMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                tactileAudio.playClick(1400);
                onRemoveWidget?.('showSearchPill');
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-900 border border-neutral-700 hover:bg-red-950 hover:border-red-600 rounded-full flex items-center justify-center text-[10px] text-white transition-all shadow-md z-20"
              title="Remove Search Widget"
            >
              <X size={11} />
            </button>
          )}
        </div>
      )}

      {/* Music Player Widget */}
      {config.showMusicPlayer && (
        <div className="relative group">
          <div className="w-full p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-850 backdrop-blur-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white cursor-pointer"
                  onClick={togglePlay}
                >
                  <Disc3
                    size={20}
                    className={`text-neutral-200 ${isPlaying ? 'animate-spin' : ''}`}
                    style={{ animationDuration: '4s' }}
                  />
                </div>

                <div>
                  <div className="text-xs font-semibold text-white tracking-tight truncate max-w-[140px]">
                    {config.musicTrackTitle || 'Resonance (Aesthetic)'}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 truncate max-w-[140px]">
                    {config.musicTrackArtist || 'HOME • BlackFlow Audio'}
                  </div>
                </div>
              </div>

              {/* Audio Waveform Bars & Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5 h-4 px-2">
                  {[0.6, 1.0, 0.4, 0.8, 0.5, 0.9].map((height, i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-white rounded-full transition-all"
                      style={{
                        height: isPlaying ? `${Math.sin((i + 1) * 2.5) * 6 + 10}px` : '3px',
                        opacity: isPlaying ? 0.9 : 0.3
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={togglePlay}
                  className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" className="ml-0.5" />}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-neutral-900 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {isEditMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                tactileAudio.playClick(1400);
                onRemoveWidget?.('showMusicPlayer');
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-900 border border-neutral-700 hover:bg-red-950 hover:border-red-600 rounded-full flex items-center justify-center text-[10px] text-white transition-all shadow-md z-20"
              title="Remove Music Widget"
            >
              <X size={11} />
            </button>
          )}
        </div>
      )}

      {/* System Monitor Pill Widget */}
      {config.showSystemMonitor && (
        <div className="relative group">
          <div className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-neutral-850 flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Battery size={14} className="text-white" />
              <span className="text-white font-semibold">92%</span>
              <span className="text-[10px] text-neutral-500">OLED SAFE</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Cpu size={14} className="text-neutral-400" />
              <span>RAM 38%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Activity size={14} className="text-emerald-400" />
              <span className="text-emerald-400">120 FPS</span>
            </div>
          </div>

          {isEditMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                tactileAudio.playClick(1400);
                onRemoveWidget?.('showSystemMonitor');
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-900 border border-neutral-700 hover:bg-red-950 hover:border-red-600 rounded-full flex items-center justify-center text-[10px] text-white transition-all shadow-md z-20"
              title="Remove Telemetry Widget"
            >
              <X size={11} />
            </button>
          )}
        </div>
      )}

      {/* Weather Pill Widget */}
      {config.showWeatherPill && (
        <div className="relative group">
          <div className="w-full px-4 py-2.5 rounded-xl bg-neutral-950/80 border border-neutral-850 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <CloudSun size={16} className="text-neutral-300" />
              <span className="text-white font-medium">21°C</span>
              <span className="text-neutral-400 text-[11px]">Clear Skies</span>
            </div>
            <span className="text-neutral-500 text-[10px]">WIND 4 KM/H</span>
          </div>

          {isEditMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                tactileAudio.playClick(1400);
                onRemoveWidget?.('showWeatherPill');
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-900 border border-neutral-700 hover:bg-red-950 hover:border-red-600 rounded-full flex items-center justify-center text-[10px] text-white transition-all shadow-md z-20"
              title="Remove Weather Widget"
            >
              <X size={11} />
            </button>
          )}
        </div>
      )}

      {/* Quick Notes / Scratchpad Widget */}
      {config.showQuickNotes && (
        <div className="relative group">
          <div className="w-full p-3 rounded-2xl bg-neutral-950/90 border border-neutral-850 text-xs font-mono">
            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-900 mb-1.5">
              <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                <FileText size={12} className="text-white" />
                <span>SCRATCHPAD MEMO</span>
              </div>
              {isEditingNote ? (
                <button
                  onClick={handleSaveNote}
                  className="text-[10px] text-emerald-400 hover:text-white"
                >
                  SAVE
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="text-[10px] text-neutral-500 hover:text-white"
                >
                  EDIT
                </button>
              )}
            </div>

            {isEditingNote ? (
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={2}
                autoFocus
                placeholder="Type quick thought..."
                className="w-full bg-neutral-900/80 border border-neutral-800 rounded-lg p-1.5 text-[11px] text-white focus:outline-none font-mono resize-none"
              />
            ) : (
              <p
                onClick={() => setIsEditingNote(true)}
                className="text-[11px] text-neutral-300 font-sans cursor-pointer hover:text-white leading-relaxed truncate"
              >
                {noteContent || 'Tap to add quick thought or to-do...'}
              </p>
            )}
          </div>

          {isEditMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                tactileAudio.playClick(1400);
                onRemoveWidget?.('showQuickNotes');
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-900 border border-neutral-700 hover:bg-red-950 hover:border-red-600 rounded-full flex items-center justify-center text-[10px] text-white transition-all shadow-md z-20"
              title="Remove Notes Widget"
            >
              <X size={11} />
            </button>
          )}
        </div>
      )}

      {/* 1-Tap RAM Booster Widget */}
      {config.showRamBooster && (
        <div className="relative group">
          <div className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-neutral-850 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <Zap size={14} className={isBoostingRam ? 'text-amber-400 animate-pulse' : 'text-cyan-400'} />
              <div>
                <span className="text-white font-medium">
                  {isBoostingRam
                    ? 'PURGING CACHE...'
                    : ramBoosted
                    ? 'FREED 1.4 GB RAM'
                    : '12.4 GB / 16 GB FREE'}
                </span>
              </div>
            </div>

            <button
              onClick={handleRamBoost}
              disabled={isBoostingRam}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                isBoostingRam
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : ramBoosted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isBoostingRam ? 'CLEANING' : ramBoosted ? 'OPTIMIZED' : 'BOOST'}
            </button>
          </div>

          {isEditMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                tactileAudio.playClick(1400);
                onRemoveWidget?.('showRamBooster');
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-900 border border-neutral-700 hover:bg-red-950 hover:border-red-600 rounded-full flex items-center justify-center text-[10px] text-white transition-all shadow-md z-20"
              title="Remove RAM Booster"
            >
              <X size={11} />
            </button>
          )}
        </div>
      )}

      {/* Health & Steps Glance Widget */}
      {config.showStepCounter && (
        <div className="relative group">
          <div className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-neutral-850 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <Footprints size={15} className="text-white" />
              <span className="text-white font-semibold">7,428 STEPS</span>
              <span className="text-[10px] text-neutral-500">74% GOAL</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400 text-[10px]">
              <span>384 KCAL</span>
              <span>•</span>
              <span>5.4 KM</span>
            </div>
          </div>

          {isEditMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                tactileAudio.playClick(1400);
                onRemoveWidget?.('showStepCounter');
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-900 border border-neutral-700 hover:bg-red-950 hover:border-red-600 rounded-full flex items-center justify-center text-[10px] text-white transition-all shadow-md z-20"
              title="Remove Steps Widget"
            >
              <X size={11} />
            </button>
          )}
        </div>
      )}

      {/* Manage Widgets Button (Shown when in Edit Mode or if no widgets are active) */}
      {(isEditMode || !hasAnyWidget) && (
        <button
          onClick={() => {
            tactileAudio.playClick(2100);
            onOpenWidgetManager?.();
          }}
          className="w-full py-2 px-3 rounded-xl border border-dashed border-neutral-800 hover:border-neutral-600 bg-neutral-950/40 text-neutral-400 hover:text-white flex items-center justify-center gap-2 text-xs font-mono transition-all active:scale-98"
        >
          <Plus size={14} />
          <span>Add / Manage Home Widgets</span>
        </button>
      )}
    </div>
  );
};
