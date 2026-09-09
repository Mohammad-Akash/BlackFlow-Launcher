import React from 'react';
import { WidgetConfig } from '../types';
import { tactileAudio } from '../utils/audioFeedback';
import {
  Search,
  Disc3,
  Battery,
  CloudSun,
  FileText,
  Zap,
  Footprints,
  Check,
  Plus,
  Trash2,
  X,
  Sliders,
  Sparkles
} from 'lucide-react';

interface Props {
  config: WidgetConfig;
  accentColor?: string;
  onClose: () => void;
  onUpdateWidget: (updated: Partial<WidgetConfig>) => void;
}

interface WidgetItemDef {
  key: keyof WidgetConfig;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'ESSENTIAL' | 'PRODUCTIVITY' | 'SYSTEM';
  badge?: string;
}

export const WidgetManagerModal: React.FC<Props> = ({
  config,
  accentColor = '#FFFFFF',
  onClose,
  onUpdateWidget
}) => {
  const widgetDefs: WidgetItemDef[] = [
    {
      key: 'showSearchPill',
      title: 'Minimalist Search Pill',
      description: 'Quick system search with voice input icon and app filter',
      icon: <Search size={18} />,
      category: 'ESSENTIAL',
      badge: 'POPULAR'
    },
    {
      key: 'showMusicPlayer',
      title: 'Now Playing Audio Pill',
      description: 'Vinyl disc animation, track telemetry, and live waveform visualizer',
      icon: <Disc3 size={18} />,
      category: 'ESSENTIAL',
      badge: 'AUDIO'
    },
    {
      key: 'showSystemMonitor',
      title: 'Battery & System Telemetry',
      description: 'Live battery %, OLED Safe status, RAM usage and 120 FPS indicator',
      icon: <Battery size={18} />,
      category: 'SYSTEM',
      badge: 'TELEMETRY'
    },
    {
      key: 'showWeatherPill',
      title: 'Weather & Climate Capsule',
      description: 'Current temperature, sky condition, and wind velocity',
      icon: <CloudSun size={18} />,
      category: 'ESSENTIAL',
      badge: 'WEATHER'
    },
    {
      key: 'showQuickNotes',
      title: 'AMOLED Scratchpad & Notes',
      description: 'Instant writable sticky note right on your home screen for ideas',
      icon: <FileText size={18} />,
      category: 'PRODUCTIVITY',
      badge: 'NEW'
    },
    {
      key: 'showRamBooster',
      title: '1-Tap RAM Booster & Cleaner',
      description: 'Tactile cache cleaner button that frees memory with clean animation',
      icon: <Zap size={18} />,
      category: 'SYSTEM',
      badge: 'NEW'
    },
    {
      key: 'showStepCounter',
      title: 'Health & Step Glance',
      description: 'Live pedometer tracking daily steps, distance, and calorie burn',
      icon: <Footprints size={18} />,
      category: 'PRODUCTIVITY',
      badge: 'HEALTH'
    }
  ];

  const handleToggle = (key: keyof WidgetConfig, currentVal: boolean) => {
    tactileAudio.playClick(currentVal ? 1600 : 2300);
    onUpdateWidget({ [key]: !currentVal });
  };

  const activeCount = widgetDefs.filter(
    (w) => Boolean(config[w.key])
  ).length;

  return (
    <div
      id="widget_manager_backdrop"
      className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end select-none animate-fade-in"
      onClick={onClose}
    >
      <div
        id="widget_manager_sheet"
        className="w-full max-h-[85%] bg-neutral-950 border-t border-neutral-800 rounded-t-3xl p-5 flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-12 h-1 bg-neutral-800 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-tight">
                Home Screen Widgets
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                {activeCount} Active
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
              Add or remove glanceable AMOLED widgets
            </p>
          </div>

          <button
            id="btn_close_widget_manager"
            onClick={() => {
              tactileAudio.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Widgets List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 no-scrollbar">
          {widgetDefs.map((w) => {
            const isEnabled = Boolean(config[w.key]);

            return (
              <div
                key={w.key}
                id={`widget_item_${w.key}`}
                className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isEnabled
                    ? 'bg-neutral-900/90 border-neutral-700 shadow-md'
                    : 'bg-neutral-950/70 border-neutral-900 hover:border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isEnabled
                        ? 'bg-white text-black'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    {w.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">
                        {w.title}
                      </span>
                      {w.badge && (
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-neutral-850 text-neutral-400 border border-neutral-800">
                          {w.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5 font-sans">
                      {w.description}
                    </p>
                  </div>
                </div>

                {/* Add / Remove Action Switch */}
                <button
                  id={`btn_toggle_widget_${w.key}`}
                  onClick={() => handleToggle(w.key, isEnabled)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all shrink-0 ${
                    isEnabled
                      ? 'bg-neutral-850 hover:bg-red-950/60 hover:text-red-400 border border-neutral-750 text-white'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                  title={isEnabled ? 'Remove widget' : 'Add widget'}
                >
                  {isEnabled ? (
                    <>
                      <Trash2 size={13} className="text-neutral-400 group-hover:text-red-400" />
                      <span>Remove</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info & Done */}
        <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
          <span className="text-[10px] font-mono text-neutral-500">
            Tip: Long-press home screen or tap "Edit Mode" to remove directly
          </span>
          <button
            onClick={() => {
              tactileAudio.playClick(2100);
              onClose();
            }}
            className="py-2 px-5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
