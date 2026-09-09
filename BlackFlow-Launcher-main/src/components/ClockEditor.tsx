import React, { useState } from 'react';
import {
  ThemeConfig,
  ClockCustomization,
  ClockStyleType,
  ClockFontFamily,
  ClockFontWeight,
  ClockColorBlendMode,
  DEFAULT_CLOCK_CONFIG
} from '../types';
import { FuturisticClock } from './FuturisticClock';
import { tactileAudio } from '../utils/audioFeedback';
import {
  Sparkles,
  Sliders,
  Type,
  Maximize2,
  Minimize2,
  Eye,
  RotateCcw,
  Check,
  Palette,
  Layers,
  Smartphone,
  Lock,
  Sun,
  Moon,
  Clock
} from 'lucide-react';

interface Props {
  theme: ThemeConfig;
  onUpdateTheme: (updated: ThemeConfig) => void;
}

export const ClockEditor: React.FC<Props> = ({ theme, onUpdateTheme }) => {
  // Target: 'HOME' | 'LOCK' | 'BOTH'
  const [targetScreen, setTargetScreen] = useState<'HOME' | 'LOCK' | 'BOTH'>(
    theme.separateLockClock ? 'HOME' : 'BOTH'
  );
  const [previewContext, setPreviewContext] = useState<'HOME' | 'LOCK'>('HOME');

  // Get current active config for editing based on target screen
  const getActiveClockConfig = (): ClockCustomization => {
    if (targetScreen === 'LOCK' && theme.lockScreenClockConfig) {
      return { ...DEFAULT_CLOCK_CONFIG, ...theme.lockScreenClockConfig };
    }
    return { ...DEFAULT_CLOCK_CONFIG, ...(theme.clockConfig || {}) };
  };

  const currentConfig = getActiveClockConfig();

  // Helper to commit changes to the theme
  const updateConfig = (partial: Partial<ClockCustomization>) => {
    const nextConfig = { ...currentConfig, ...partial };

    let updatedTheme = { ...theme };

    if (targetScreen === 'BOTH') {
      updatedTheme = {
        ...updatedTheme,
        separateLockClock: false,
        clockConfig: nextConfig,
        lockScreenClockConfig: nextConfig
      };
    } else if (targetScreen === 'HOME') {
      updatedTheme = {
        ...updatedTheme,
        separateLockClock: true,
        clockConfig: nextConfig
      };
    } else {
      updatedTheme = {
        ...updatedTheme,
        separateLockClock: true,
        lockScreenClockConfig: nextConfig
      };
    }

    onUpdateTheme(updatedTheme);
  };

  const updateClockStyle = (newStyle: ClockStyleType) => {
    tactileAudio.playClick(2100);
    onUpdateTheme({
      ...theme,
      clockStyle: newStyle
    });
  };

  const handleResetDefaults = () => {
    tactileAudio.playUnlock();
    updateConfig(DEFAULT_CLOCK_CONFIG);
  };

  // Font family choices
  const fontFamilies: { id: ClockFontFamily; label: string; sample: string; desc: string }[] = [
    { id: 'sans', label: 'Neo-Grotesque Sans', sample: '10:42', desc: 'Minimalist, Swiss Modern' },
    { id: 'mono', label: 'Cyber Monospace', sample: '10:42', desc: 'Technical, Developer Terminal' },
    { id: 'serif', label: 'Editorial Serif', sample: '10:42', desc: 'High Fashion, Luxury Editorial' },
    { id: 'tech', label: 'Space Tech Mono', sample: '10:42', desc: 'Futuristic HUD / Sci-Fi' },
    { id: 'condensed', label: 'Condensed Display', sample: '10:42', desc: 'Tall, High Density Numerals' },
    { id: 'display', label: 'Geometric Heavy', sample: '10:42', desc: 'Bold, Punchy Architecture' }
  ];

  // Font weights
  const fontWeights: { weight: ClockFontWeight; label: string; short: string }[] = [
    { weight: 100, label: 'Thin (100)', short: '100' },
    { weight: 200, label: 'Ultralight (200)', short: '200' },
    { weight: 300, label: 'Light (300)', short: '300' },
    { weight: 400, label: 'Regular (400)', short: '400' },
    { weight: 500, label: 'Medium (500)', short: '500' },
    { weight: 700, label: 'Bold (700)', short: '700' },
    { weight: 900, label: 'Black (900)', short: '900' }
  ];

  // Color blending modes
  const blendModes: { id: ClockColorBlendMode; label: string; desc: string }[] = [
    { id: 'normal', label: 'Solid Clean', desc: 'Pure crisp pixel rendering with solid opacity' },
    { id: 'wireframe_stroke', label: 'Hollow Stroke', desc: 'Razor-thin wireframe vector outline' },
    { id: 'screen', label: 'Screen Blend', desc: 'Luminous light blending against wallpaper' },
    { id: 'overlay', label: 'Overlay', desc: 'High-contrast subtle backdrop overlay' },
    { id: 'luminosity', label: 'Luminosity', desc: 'Adapts color brightness to substrate' },
    { id: 'neon_glow', label: 'Neon Cyber Glow', desc: 'Subtle sci-fi neon drop-shadow halo' },
    { id: 'gradient_fade', label: 'Luminous Gradient', desc: 'Vertical white-to-smoke gradient fill' },
    { id: 'cyber_matrix', label: 'Aberration Glitch', desc: 'Chromatic aberration offset glow' }
  ];

  // Curated color swatches
  const primaryPalette = [
    { label: 'Pure White', hex: '#FFFFFF' },
    { label: 'Warm Titanium', hex: '#F0EFEA' },
    { label: 'Minimal Silver', hex: '#C4C4C4' },
    { label: 'Cyber Cyan', hex: '#00F0FF' },
    { label: 'Ice Blue', hex: '#80D8FF' },
    { label: 'Emerald OLED', hex: '#00E676' },
    { label: 'Amber Flare', hex: '#FF9100' },
    { label: 'Crimson Glow', hex: '#FF3366' }
  ];

  // 1-Click Curated Presets
  const quickPresets: { name: string; style: ClockStyleType; config: Partial<ClockCustomization> }[] = [
    {
      name: 'Dune Minimal',
      style: 'ITHEME_DUNE',
      config: {
        fontFamily: 'sans',
        fontWeight: 200,
        fontSize: 50,
        secondaryTextSize: 10,
        colorBlendMode: 'normal',
        primaryColor: '#FFFFFF',
        primaryOpacity: 1,
        letterSpacing: -1.5,
        showSeconds: true
      }
    },
    {
      name: 'Wireframe Outlined',
      style: 'WIREFRAME_HOLLOW',
      config: {
        fontFamily: 'sans',
        fontWeight: 900,
        fontSize: 52,
        secondaryTextSize: 10,
        colorBlendMode: 'wireframe_stroke',
        strokeWidth: 1.8,
        primaryColor: '#FFFFFF',
        letterSpacing: 0
      }
    },
    {
      name: 'Cyber Terminal',
      style: 'CYBER_MONO',
      config: {
        fontFamily: 'tech',
        fontWeight: 400,
        fontSize: 42,
        secondaryTextSize: 10,
        colorBlendMode: 'neon_glow',
        glowColor: '#00F0FF',
        primaryColor: '#00F0FF',
        letterSpacing: 2
      }
    },
    {
      name: 'Nothing Dot Matrix',
      style: 'NOTHING_DOT',
      config: {
        fontFamily: 'mono',
        fontWeight: 300,
        fontSize: 40,
        secondaryTextSize: 10,
        colorBlendMode: 'normal',
        primaryColor: '#FFFFFF',
        glowColor: '#FF3366'
      }
    },
    {
      name: 'Editorial Serif',
      style: 'ITHEME_DUNE',
      config: {
        fontFamily: 'serif',
        fontWeight: 200,
        fontSize: 54,
        secondaryTextSize: 10,
        colorBlendMode: 'normal',
        primaryColor: '#F5F5F0',
        letterSpacing: -1
      }
    },
    {
      name: 'Heavy Swiss',
      style: 'MINIMAL_DIGITAL',
      config: {
        fontFamily: 'sans',
        fontWeight: 800,
        fontSize: 52,
        secondaryTextSize: 11,
        colorBlendMode: 'normal',
        primaryColor: '#FFFFFF',
        letterSpacing: -2
      }
    }
  ];

  return (
    <div id="clock_editor_container" className="space-y-6 animate-fade-in text-white select-none">
      {/* Target Screen Segment & Synchronizer */}
      <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Clock size={15} className="text-white" />
            <span>Clock Target Mode</span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-0.5">
            Configure typography & blending independently or synchronized
          </p>
        </div>

        <div className="flex items-center bg-black p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => {
              tactileAudio.playClick(2100);
              setTargetScreen('BOTH');
              setPreviewContext('HOME');
              onUpdateTheme({
                ...theme,
                separateLockClock: false,
                lockScreenClockConfig: currentConfig
              });
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono transition-all ${
              targetScreen === 'BOTH'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Both (Linked)
          </button>
          <button
            onClick={() => {
              tactileAudio.playClick(2100);
              setTargetScreen('HOME');
              setPreviewContext('HOME');
              onUpdateTheme({
                ...theme,
                separateLockClock: true
              });
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono transition-all flex items-center gap-1 ${
              targetScreen === 'HOME'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone size={11} />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              tactileAudio.playClick(2100);
              setTargetScreen('LOCK');
              setPreviewContext('LOCK');
              onUpdateTheme({
                ...theme,
                separateLockClock: true,
                lockScreenClockConfig: theme.lockScreenClockConfig || { ...currentConfig }
              });
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono transition-all flex items-center gap-1 ${
              targetScreen === 'LOCK'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Lock size={11} />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* LIVE CLOCK PREVIEW STAGE */}
      <div className="relative rounded-2xl bg-black border border-neutral-800 p-6 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-neutral-900 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400">
              LIVE TYPOGRAPHY PREVIEW
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-emerald-400">
              ACTIVE REALTIME
            </span>
          </div>

          {/* Switch Preview Context */}
          <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
            <button
              onClick={() => {
                tactileAudio.playClick();
                setPreviewContext('HOME');
              }}
              className={`px-2 py-0.5 rounded transition-all ${
                previewContext === 'HOME' ? 'bg-neutral-800 text-white font-semibold' : 'hover:text-neutral-200'
              }`}
            >
              Home View
            </button>
            <span className="text-neutral-600">/</span>
            <button
              onClick={() => {
                tactileAudio.playClick();
                setPreviewContext('LOCK');
              }}
              className={`px-2 py-0.5 rounded transition-all ${
                previewContext === 'LOCK' ? 'bg-neutral-800 text-white font-semibold' : 'hover:text-neutral-200'
              }`}
            >
              Lock View
            </button>
          </div>
        </div>

        {/* The Live Clock */}
        <div className="py-4 flex flex-col items-center justify-center min-h-[120px]">
          <FuturisticClock
            styleType={theme.clockStyle}
            accentColor={theme.accentColor}
            config={currentConfig}
            className={previewContext === 'LOCK' ? 'text-center' : 'text-left'}
          />

          {previewContext === 'LOCK' && (
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-neutral-500">
              <Lock size={11} />
              <span>SWIPE UP TO UNLOCK • 92% BATTERY</span>
            </div>
          )}
        </div>

        {/* Micro Telemetry Bar */}
        <div className="mt-2 pt-2 border-t border-neutral-900/80 flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span>FONT: {currentConfig.fontFamily.toUpperCase()}</span>
            <span>WEIGHT: {currentConfig.fontWeight}</span>
            <span>SIZE: {currentConfig.fontSize}px</span>
            <span>SEC: {currentConfig.secondaryTextSize}px</span>
          </div>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1 hover:text-white transition-colors"
            title="Reset to Style Default Values"
          >
            <RotateCcw size={11} />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* 1-CLICK QUICK TYPOGRAPHY PRESETS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-neutral-400 tracking-wider">
            1-CLICK TYPOGRAPHY PRESETS
          </span>
          <span className="text-[10px] font-mono text-neutral-500">CURATED COMBOS</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {quickPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                tactileAudio.playClick(2300);
                updateClockStyle(preset.style);
                updateConfig(preset.config);
              }}
              className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-left transition-all active:scale-[0.98]"
            >
              <div className="text-xs font-semibold text-white">{preset.name}</div>
              <div className="text-[9px] font-mono text-neutral-500 mt-0.5 line-clamp-1">
                {preset.config.fontFamily} • {preset.config.fontWeight}w • {preset.config.colorBlendMode}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: FONT STYLE (TYPEFACE) */}
      <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-850">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type size={16} className="text-white" />
            <label className="text-xs font-semibold text-white">Font Style (Typeface)</label>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 uppercase">
            {currentConfig.fontFamily}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {fontFamilies.map((item) => {
            const isSelected = currentConfig.fontFamily === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  tactileAudio.playClick(2200);
                  updateConfig({ fontFamily: item.id });
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-white bg-neutral-900 shadow-md ring-1 ring-white/20'
                    : 'border-neutral-900 bg-black hover:border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{item.label}</span>
                  {isSelected && <Check size={13} className="text-white" />}
                </div>
                <div className="text-lg font-light text-neutral-200 mt-1.5">{item.sample}</div>
                <p className="text-[9px] text-neutral-500 font-mono mt-0.5">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: FONT WEIGHT & LETTER SPACING */}
      <div className="space-y-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-850">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-white" />
            <label className="text-xs font-semibold text-white">Font Weight</label>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {currentConfig.fontWeight}
          </span>
        </div>

        {/* Discrete Font Weight Buttons */}
        <div className="grid grid-cols-7 gap-1">
          {fontWeights.map((w) => {
            const isSelected = currentConfig.fontWeight === w.weight;
            return (
              <button
                key={w.weight}
                onClick={() => {
                  tactileAudio.playClick(2100 + (w.weight / 10));
                  updateConfig({ fontWeight: w.weight });
                }}
                className={`py-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'border-white bg-neutral-850 text-white font-bold'
                    : 'border-neutral-900 bg-black text-neutral-400 hover:text-neutral-200 hover:border-neutral-800'
                }`}
                title={w.label}
              >
                <div className="text-xs font-mono">{w.short}</div>
                <div
                  className="text-[10px] mt-0.5"
                  style={{ fontWeight: w.weight }}
                >
                  Aa
                </div>
              </button>
            );
          })}
        </div>

        {/* Primary Digit Size Slider */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>PRIMARY DIGIT SIZE</span>
            <span className="text-white font-bold">{currentConfig.fontSize}px</span>
          </div>
          <input
            type="range"
            min="32"
            max="76"
            step="2"
            value={currentConfig.fontSize}
            onChange={(e) => updateConfig({ fontSize: Number(e.target.value) })}
            className="w-full accent-white cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-neutral-600">
            <span>32px (COMPACT)</span>
            <span>50px (DEFAULT)</span>
            <span>76px (MASSIVE)</span>
          </div>
        </div>

        {/* Letter Spacing (Tracking) */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>LETTER SPACING (TRACKING)</span>
            <span className="text-white font-bold">{currentConfig.letterSpacing}px</span>
          </div>
          <input
            type="range"
            min="-4"
            max="8"
            step="0.5"
            value={currentConfig.letterSpacing}
            onChange={(e) => updateConfig({ letterSpacing: Number(e.target.value) })}
            className="w-full accent-white cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-neutral-600">
            <span>-4px (TIGHT)</span>
            <span>0px (NORMAL)</span>
            <span>+8px (SPACED)</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: SECONDARY TEXT SIZE & ATTRIBUTES */}
      <div className="space-y-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-850">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Maximize2 size={16} className="text-white" />
            <label className="text-xs font-semibold text-white">Secondary Text Size & Glances</label>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {currentConfig.secondaryTextSize}px
          </span>
        </div>
        <p className="text-[10px] text-neutral-400">
          Controls the scale of dates, Dune view telemetry, and status pills
        </p>

        {/* Secondary Size Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>SECONDARY TEXT SIZE</span>
            <span className="text-white font-bold">{currentConfig.secondaryTextSize}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="18"
            step="1"
            value={currentConfig.secondaryTextSize}
            onChange={(e) => updateConfig({ secondaryTextSize: Number(e.target.value) })}
            className="w-full accent-white cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-neutral-600">
            <span>8px (SUBTLE)</span>
            <span>10px (BALANCED)</span>
            <span>18px (PROMINENT)</span>
          </div>
        </div>

        {/* Secondary Weight & Tracking options */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-mono text-neutral-400 block mb-1.5">
              SECONDARY WEIGHT
            </label>
            <div className="grid grid-cols-4 gap-1">
              {([300, 400, 500, 600] as const).map((wt) => (
                <button
                  key={wt}
                  onClick={() => {
                    tactileAudio.playClick(2150);
                    updateConfig({ secondaryFontWeight: wt });
                  }}
                  className={`py-1.5 rounded-lg text-xs font-mono border transition-all ${
                    currentConfig.secondaryFontWeight === wt
                      ? 'border-white bg-neutral-850 text-white font-semibold'
                      : 'border-neutral-900 bg-black text-neutral-400 hover:text-white'
                  }`}
                >
                  {wt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-neutral-400 block mb-1.5">
              SECONDARY TRACKING
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['normal', 'wide', 'widest'] as const).map((tr) => (
                <button
                  key={tr}
                  onClick={() => {
                    tactileAudio.playClick(2150);
                    updateConfig({ secondaryTracking: tr });
                  }}
                  className={`py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all ${
                    currentConfig.secondaryTracking === tr
                      ? 'border-white bg-neutral-850 text-white font-semibold'
                      : 'border-neutral-900 bg-black text-neutral-400 hover:text-white'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: COLOR BLENDING & VISUAL EFFECTS */}
      <div className="space-y-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-850">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-white" />
            <label className="text-xs font-semibold text-white">Color Blending & Effects</label>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 uppercase">
            {currentConfig.colorBlendMode.replace('_', ' ')}
          </span>
        </div>

        {/* Blend Modes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {blendModes.map((mode) => {
            const isSelected = currentConfig.colorBlendMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  tactileAudio.playClick(2250);
                  updateConfig({ colorBlendMode: mode.id });
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  isSelected
                    ? 'border-white bg-neutral-900 shadow-md ring-1 ring-white/20'
                    : 'border-neutral-900 bg-black hover:border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{mode.label}</span>
                  {isSelected && <Check size={13} className="text-white" />}
                </div>
                <p className="text-[10px] text-neutral-400">{mode.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Wireframe Stroke Width (shown if wireframe_stroke active) */}
        {currentConfig.colorBlendMode === 'wireframe_stroke' && (
          <div className="p-3 bg-black rounded-xl border border-neutral-850 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>OUTLINE STROKE WIDTH</span>
              <span className="text-white font-bold">{currentConfig.strokeWidth}px</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="3.0"
              step="0.2"
              value={currentConfig.strokeWidth}
              onChange={(e) => updateConfig({ strokeWidth: Number(e.target.value) })}
              className="w-full accent-white cursor-pointer"
            />
          </div>
        )}

        {/* Primary Digits Color Palette */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>PRIMARY DIGIT COLOR</span>
            <span className="text-white">{currentConfig.primaryColor}</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {primaryPalette.map((p) => {
              const isSelected = currentConfig.primaryColor === p.hex;
              return (
                <button
                  key={p.hex}
                  onClick={() => {
                    tactileAudio.playClick(2300);
                    updateConfig({ primaryColor: p.hex });
                  }}
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'scale-110 border-white shadow-lg ring-2 ring-white/40' : 'border-neutral-800 hover:border-neutral-600'
                  }`}
                  style={{ backgroundColor: p.hex }}
                  title={p.label}
                >
                  {isSelected && (
                    <Check size={13} className={p.hex === '#FFFFFF' ? 'text-black' : 'text-white'} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Opacity Slider */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>DIGIT OPACITY</span>
            <span className="text-white font-bold">
              {Math.round(currentConfig.primaryOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={currentConfig.primaryOpacity}
            onChange={(e) => updateConfig({ primaryOpacity: Number(e.target.value) })}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        {/* Secondary Text Color Swatches */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>SECONDARY TEXT COLOR</span>
            <span className="text-white">{currentConfig.secondaryColor}</span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: 'Muted Gray', hex: '#A3A3A3' },
              { label: 'Subtle Slate', hex: '#737373' },
              { label: 'Crisp White', hex: '#FFFFFF' },
              { label: 'Accent Cyan', hex: '#00F0FF' },
              { label: 'Emerald OLED', hex: '#00E676' }
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  tactileAudio.playClick(2200);
                  updateConfig({ secondaryColor: c.hex });
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all flex items-center gap-1.5 ${
                  currentConfig.secondaryColor === c.hex
                    ? 'border-white bg-neutral-850 text-white font-bold'
                    : 'border-neutral-900 bg-black text-neutral-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex }} />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: GLANCE ELEMENTS & TIME FORMAT */}
      <div className="space-y-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-850">
        <label className="text-xs font-semibold text-white block">
          Display Elements & Formatting
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* 12h vs 24h */}
          <div className="p-3 bg-black rounded-xl border border-neutral-900 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-white">24-Hour Time Format</div>
              <div className="text-[10px] text-neutral-500 font-mono">Military / ISO 8601</div>
            </div>
            <input
              type="checkbox"
              checked={currentConfig.is24Hour}
              onChange={(e) => {
                tactileAudio.playClick();
                updateConfig({ is24Hour: e.target.checked });
              }}
              className="accent-white w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Show Seconds */}
          <div className="p-3 bg-black rounded-xl border border-neutral-900 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-white">Show Live Seconds</div>
              <div className="text-[10px] text-neutral-500 font-mono">Ticking realtime second indicator</div>
            </div>
            <input
              type="checkbox"
              checked={currentConfig.showSeconds}
              onChange={(e) => {
                tactileAudio.playClick();
                updateConfig({ showSeconds: e.target.checked });
              }}
              className="accent-white w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Show Date */}
          <div className="p-3 bg-black rounded-xl border border-neutral-900 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-white">Show Date & Weekday</div>
              <div className="text-[10px] text-neutral-500 font-mono">e.g. MON, SEP 8</div>
            </div>
            <input
              type="checkbox"
              checked={currentConfig.showDate}
              onChange={(e) => {
                tactileAudio.playClick();
                updateConfig({ showDate: e.target.checked });
              }}
              className="accent-white w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Show Telemetry */}
          <div className="p-3 bg-black rounded-xl border border-neutral-900 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-white">Status Telemetry Pill</div>
              <div className="text-[10px] text-neutral-500 font-mono">Battery % & Dune view pill</div>
            </div>
            <input
              type="checkbox"
              checked={currentConfig.showTelemetry}
              onChange={(e) => {
                tactileAudio.playClick();
                updateConfig({ showTelemetry: e.target.checked });
              }}
              className="accent-white w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
