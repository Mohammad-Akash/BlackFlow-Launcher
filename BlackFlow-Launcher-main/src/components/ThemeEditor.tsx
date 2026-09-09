import React, { useState } from 'react';
import {
  ThemeConfig,
  IconStyleType,
  IconShapeType,
  ClockStyleType,
  LiveEffectType,
  WidgetConfig
} from '../types';
import { THEME_PRESETS } from '../data/mockApps';
import { MonochromeIconRenderer } from './MonochromeIconRenderer';
import { FuturisticClock } from './FuturisticClock';
import { ClockEditor } from './ClockEditor';
import { tactileAudio } from '../utils/audioFeedback';
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  Palette,
  Clock,
  Grid,
  Sparkles,
  Layers,
  LayoutTemplate,
  Music,
  Volume2,
  VolumeX,
  Radio,
  Share2
} from 'lucide-react';

interface Props {
  currentTheme: ThemeConfig;
  onUpdateTheme: (updated: ThemeConfig) => void;
  onClose: () => void;
}

export const ThemeEditor: React.FC<Props> = ({ currentTheme, onUpdateTheme, onClose }) => {
  const [theme, setTheme] = useState<ThemeConfig>(currentTheme);
  const [activeTab, setActiveTab] = useState<'PRESETS' | 'ICONS' | 'CLOCK' | 'WIDGETS' | 'GRID' | 'ANIMATIONS' | 'JSON'>('PRESETS');
  const [clockSubTab, setClockSubTab] = useState<'EDITOR' | 'STYLES'>('EDITOR');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const updateField = (partial: Partial<ThemeConfig>) => {
    const updated = { ...theme, ...partial };
    setTheme(updated);
    onUpdateTheme(updated);
  };

  const updateGridField = (partial: Partial<typeof theme.gridConfig>) => {
    const updatedGrid = { ...theme.gridConfig, ...partial };
    const updated = { ...theme, gridConfig: updatedGrid };
    setTheme(updated);
    onUpdateTheme(updated);
  };

  const updateWidgetField = (partial: Partial<WidgetConfig>) => {
    const updatedWidgets = { ...theme.widgets, ...partial };
    const updated = { ...theme, widgets: updatedWidgets };
    setTheme(updated);
    onUpdateTheme(updated);
  };

  const handleApplyPreset = (preset: ThemeConfig) => {
    tactileAudio.playClick(2400);
    setTheme(preset);
    onUpdateTheme(preset);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1200);
  };

  const handleSave = () => {
    tactileAudio.playUnlock();
    onUpdateTheme(theme);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleExportJson = () => {
    tactileAudio.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(theme, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `blackflow-theme-${theme.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setTheme(parsed);
      onUpdateTheme(parsed);
      tactileAudio.playUnlock();
      alert('Theme imported and applied successfully!');
    } catch {
      alert('Invalid theme JSON structure.');
    }
  };

  const colorPalettes = [
    { label: 'Pure White', hex: '#FFFFFF' },
    { label: 'Cyber Cyan', hex: '#00F0FF' },
    { label: 'Ice Blue', hex: '#80D8FF' },
    { label: 'Vermillion', hex: '#FF3838' },
    { label: 'Acid Lime', hex: '#CCFF00' },
    { label: 'Solar Amber', hex: '#FFB703' },
    { label: 'Titanium', hex: '#E6DCB8' },
    { label: 'Lavender', hex: '#D1C4E9' }
  ];

  const iconShapes: { id: IconShapeType; label: string }[] = [
    { id: 'NONE', label: 'Bare Glyph' },
    { id: 'CIRCLE', label: 'Circle' },
    { id: 'SQUIRCLE', label: 'Squircle' },
    { id: 'ROUNDED_SQUARE', label: 'Square' },
    { id: 'HEXAGON', label: 'Hexagon' },
    { id: 'DIAMOND', label: 'Diamond' },
    { id: 'OCTAGON', label: 'Octagon' },
    { id: 'TEARDROP', label: 'Teardrop' },
    { id: 'SHIELD', label: 'Shield' }
  ];

  const clockStyles: { id: ClockStyleType; label: string; preview: string; tag?: string }[] = [
    { id: 'ITHEME_DUNE', label: 'iTheme Dune View', preview: '09 : 32 • DUNE VIEW • 88%', tag: 'SCREENSHOT' },
    { id: 'WIREFRAME_HOLLOW', label: 'Wireframe Hollow Outline', preview: 'Stroked hollow numerals matching icons', tag: 'OUTLINE' },
    { id: 'BAUHAUS_DUAL', label: 'Bauhaus Dual Block', preview: '09 : 32 • BAUHAUS ARCHITECTURAL', tag: 'PREMIUM' },
    { id: 'CHRONO_RACING', label: 'Chrono Tachymeter', preview: 'SPLIT 00:42 • SECTOR 01 // OK', tag: 'RACING' },
    { id: 'OLED_GLITCH', label: 'Cyber Glitch Horizon', preview: 'CYBER//HUD 120 FPS OFFSET', tag: 'CYBER' },
    { id: 'AURA_RING', label: 'Aura Radial Ring', preview: 'Circular orbital seconds ring gauge', tag: 'RADIAL' },
    { id: 'ROMA_MINIMAL', label: 'Roma Luxury Swiss', preview: 'Haute Horlogerie Roman • GENEVE', tag: 'LUXURY' },
    { id: 'SPLIT_PILL', label: 'Split Capsule Pill', preview: 'Dual high-contrast capsule badges', tag: 'CAPSULE' },
    { id: 'NOTHING_DOT', label: 'Nothing Dot Matrix', preview: 'Glyph matrix modules with red/white colon', tag: 'GLYPH' },
    { id: 'NIAGARA_STACKED', label: 'Niagara Stacked Modern', preview: '09:32 with vertical date glance bar', tag: 'MINIMAL' },
    { id: 'GEOMETRIC_HUD', label: 'Cyber HUD Frame', preview: 'Sci-Fi boxed frame with 120 FPS & seconds', tag: 'HUD' },
    { id: 'MINIMAL_DIGITAL', label: 'Minimal Digital (Swiss)', preview: '10:42 • EEE, D MMM' },
    { id: 'CYBER_MONO', label: 'Cyber Monospace', preview: '10:42:09 // SYS' },
    { id: 'WORD_CLOCK', label: 'Word Clock', preview: 'IT IS TEN FORTY TWO' },
    { id: 'DUAL_LINE', label: 'Dual Line Stacked', preview: '10 / 42' },
    { id: 'ANALOG_OUTLINE', label: 'Minimalist Analog Dial', preview: 'Rotating hairline dial' },
    { id: 'SEGMENT_LED', label: 'Segment LED Sci-Fi', preview: '10:42 7-Segment' },
    { id: 'VERTICAL_DIGIT', label: 'Horizontal Spaced', preview: '10 : 42' }
  ];

  const liveEffects: { id: LiveEffectType; label: string; desc: string }[] = [
    { id: 'PARTICLES', label: 'Constellation Particles', desc: 'Drifting nodes with connecting lines' },
    { id: 'GALAXY', label: 'Void Galaxy', desc: 'Orbiting stardust around screen center' },
    { id: 'STARFIELD_WARP', label: 'Starfield Warp', desc: '3D hyper-speed star projection' },
    { id: 'NEON_LINES', label: 'Cyber Vector Grid', desc: 'Moving matrix coordinates' },
    { id: 'RAIN', label: 'AMOLED Rain', desc: 'Subtle vertical raindrops' },
    { id: 'FLUID_WAVE', label: 'Sine Wave Horizon', desc: 'Smooth mathematical oscillations' },
    { id: 'NONE', label: 'Pure Black (Static)', desc: 'Zero movement • Absolute black #000000' }
  ];

  return (
    <div
      id="theme_editor_container"
      className="absolute inset-0 z-30 bg-[#000000] text-white flex flex-col select-none overflow-hidden animate-fade-in"
    >
      {/* Header */}
      <div className="pt-6 px-5 pb-3 border-b border-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              tactileAudio.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-neutral-900 active:scale-95 transition-all text-neutral-300 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-semibold tracking-wider font-mono">THEME STUDIO</h2>
            <p className="text-[11px] text-neutral-500">Live Visual Customization Engine</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-black font-semibold text-xs font-mono tracking-wider hover:bg-neutral-200 active:scale-95 transition-all"
        >
          {savedSuccess ? <Check size={14} /> : <Save size={14} />}
          <span>{savedSuccess ? 'APPLIED' : 'APPLY'}</span>
        </button>
      </div>

      {/* Editor Sub-Tabs */}
      <div className="flex items-center gap-2 px-5 py-2.5 overflow-x-auto no-scrollbar border-b border-neutral-900/60">
        {(['PRESETS', 'ICONS', 'CLOCK', 'WIDGETS', 'GRID', 'ANIMATIONS', 'JSON'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              tactileAudio.playClick(2100);
              setActiveTab(tab);
            }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {/* 1. PRESETS TAB */}
        {activeTab === 'PRESETS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400 tracking-wider">
                CURATED AMOLED PRESETS
              </span>
              <span className="text-[10px] font-mono text-neutral-500">1-CLICK LOAD</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected = theme.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-white bg-neutral-900'
                        : 'border-neutral-900 bg-neutral-950 hover:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                        style={{
                          borderColor: preset.accentColor,
                          backgroundColor: '#050505'
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: preset.accentColor }}
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white tracking-wide">
                          {preset.name}
                        </h4>
                        <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-black font-semibold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ICONS TAB */}
        {activeTab === 'ICONS' && (
          <div className="space-y-5">
            {/* Live Interactive Icon Preview Box */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 flex flex-col items-center">
              <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase mb-3">
                LIVE ICON PREVIEW • {theme.gridConfig.iconShape} ({theme.gridConfig.iconSize}px)
              </span>
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex flex-col items-center gap-1.5">
                  <MonochromeIconRenderer
                    iconName="Phone"
                    size={theme.gridConfig.iconSize}
                    styleType={theme.gridConfig.iconStyle}
                    shape={theme.gridConfig.iconShape}
                    accentColor={theme.accentColor}
                    opacity={theme.gridConfig.iconOpacity}
                    customStroke={theme.gridConfig.strokeWidth}
                  />
                  {theme.gridConfig.showLabels && (
                    <span className="text-[10px] text-neutral-400 font-mono">Phone</span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <MonochromeIconRenderer
                    iconName="Camera"
                    size={theme.gridConfig.iconSize}
                    styleType={theme.gridConfig.iconStyle}
                    shape={theme.gridConfig.iconShape}
                    accentColor={theme.accentColor}
                    opacity={theme.gridConfig.iconOpacity}
                    customStroke={theme.gridConfig.strokeWidth}
                  />
                  {theme.gridConfig.showLabels && (
                    <span className="text-[10px] text-neutral-400 font-mono">Camera</span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <MonochromeIconRenderer
                    iconName="Settings"
                    size={theme.gridConfig.iconSize}
                    styleType={theme.gridConfig.iconStyle}
                    shape={theme.gridConfig.iconShape}
                    accentColor={theme.accentColor}
                    opacity={theme.gridConfig.iconOpacity}
                    customStroke={theme.gridConfig.strokeWidth}
                  />
                  {theme.gridConfig.showLabels && (
                    <span className="text-[10px] text-neutral-400 font-mono">Settings</span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <MonochromeIconRenderer
                    iconName="MessageSquare"
                    size={theme.gridConfig.iconSize}
                    styleType={theme.gridConfig.iconStyle}
                    shape={theme.gridConfig.iconShape}
                    accentColor={theme.accentColor}
                    opacity={theme.gridConfig.iconOpacity}
                    customStroke={theme.gridConfig.strokeWidth}
                  />
                  {theme.gridConfig.showLabels && (
                    <span className="text-[10px] text-neutral-400 font-mono">Chat</span>
                  )}
                </div>
              </div>
            </div>

            {/* Icon Size Adjustment (Requested by user) */}
            <div className="space-y-2.5 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-850">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <span>ICON SIZE</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {theme.gridConfig.iconSize}px
                  </span>
                </span>
                <span className="text-neutral-400 text-[10px]">RANGE: 32px – 68px</span>
              </div>
              <input
                type="range"
                min="32"
                max="68"
                step="2"
                value={theme.gridConfig.iconSize}
                onChange={(e) => {
                  tactileAudio.playClick(2400);
                  updateGridField({ iconSize: Number(e.target.value) });
                }}
                className="w-full accent-white"
              />
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[
                  { size: 36, label: 'Compact' },
                  { size: 44, label: 'Standard' },
                  { size: 52, label: 'Modern' },
                  { size: 60, label: 'Giant' }
                ].map((preset) => (
                  <button
                    key={preset.size}
                    onClick={() => {
                      tactileAudio.playClick(2200);
                      updateGridField({ iconSize: preset.size });
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-mono border transition-all ${
                      theme.gridConfig.iconSize === preset.size
                        ? 'border-white bg-white text-black font-bold'
                        : 'border-neutral-900 bg-black text-neutral-400 hover:text-white'
                    }`}
                  >
                    {preset.size}px ({preset.label})
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Silhouette Shape (9 Shapes requested) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 tracking-wider">
                  ICON SILHOUETTE SHAPE
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {theme.gridConfig.iconShape}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {iconShapes.map((shape) => {
                  const isSelected = theme.gridConfig.iconShape === shape.id;
                  return (
                    <button
                      key={shape.id}
                      onClick={() => {
                        tactileAudio.playClick(2100);
                        updateGridField({ iconShape: shape.id });
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-mono border transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'border-white bg-white text-black font-semibold shadow-sm'
                          : 'border-neutral-900 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-800'
                      }`}
                    >
                      <span className="text-xs">{shape.label}</span>
                      <span className={`text-[9px] ${isSelected ? 'text-neutral-700' : 'text-neutral-600'}`}>
                        {shape.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Icon Render Style (Outline, Thin Line, Filled, etc.) */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono text-neutral-400 tracking-wider">
                GLYPH STROKE RENDER STYLE
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'OUTLINE' as IconStyleType, label: 'Wireframe' },
                  { id: 'THIN_LINE' as IconStyleType, label: 'Thin Line' },
                  { id: 'FILLED_MONOCHROME' as IconStyleType, label: 'Solid Monotone' },
                  { id: 'ROUNDED' as IconStyleType, label: 'Curved Soft' },
                  { id: 'MINIMAL' as IconStyleType, label: 'Micro Minimal' }
                ].map((style) => {
                  const isSelected = theme.gridConfig.iconStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => {
                        tactileAudio.playClick();
                        updateGridField({ iconStyle: style.id });
                        updateField({ iconStyle: style.id });
                      }}
                      className={`py-2 px-2 rounded-xl text-[11px] font-mono border transition-all ${
                        isSelected
                          ? 'border-white bg-white text-black font-semibold'
                          : 'border-neutral-900 bg-neutral-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {style.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Palette Accent */}
            <div className="space-y-2.5 pt-2 border-t border-neutral-900">
              <span className="text-xs font-mono text-neutral-400 tracking-wider">
                ACCENT COLOR TINT
              </span>
              <div className="grid grid-cols-4 gap-2">
                {colorPalettes.map((c) => {
                  const isSelected = theme.accentColor === c.hex;
                  return (
                    <button
                      key={c.hex}
                      onClick={() => {
                        tactileAudio.playClick(2200);
                        updateField({ accentColor: c.hex });
                        updateGridField({ accentColor: c.hex });
                      }}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        isSelected ? 'border-white bg-neutral-900' : 'border-neutral-900 bg-neutral-950'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-neutral-800 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[9px] font-mono text-neutral-300 truncate w-full text-center">
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stroke Width Slider */}
            <div className="space-y-2 pt-2 border-t border-neutral-900">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300">STROKE THICKNESS</span>
                <span className="text-neutral-400">{theme.gridConfig.strokeWidth}px</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.1"
                value={theme.gridConfig.strokeWidth}
                onChange={(e) => updateGridField({ strokeWidth: Number(e.target.value) })}
                className="w-full accent-white"
              />
            </div>

            {/* Icon Opacity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300">ICON OPACITY</span>
                <span className="text-neutral-400">{Math.round(theme.gridConfig.iconOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={theme.gridConfig.iconOpacity}
                onChange={(e) => updateGridField({ iconOpacity: Number(e.target.value) })}
                className="w-full accent-white"
              />
            </div>

            {/* Show Labels Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-900">
              <div>
                <div className="text-xs font-mono text-white">APP LABELS</div>
                <div className="text-[10px] text-neutral-500 font-mono">
                  Display application text names below icons
                </div>
              </div>
              <button
                onClick={() => {
                  tactileAudio.playClick();
                  updateGridField({ showLabels: !theme.gridConfig.showLabels });
                }}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                  theme.gridConfig.showLabels ? 'bg-white' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-transform ${
                    theme.gridConfig.showLabels
                      ? 'translate-x-5 bg-black'
                      : 'translate-x-0 bg-neutral-400'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* 3. CLOCK TAB */}
        {activeTab === 'CLOCK' && (
          <div className="space-y-4">
            {/* Clock Sub-Tab Toggle */}
            <div className="flex items-center justify-between bg-neutral-950 p-1 rounded-xl border border-neutral-850">
              <button
                onClick={() => {
                  tactileAudio.playClick(2100);
                  setClockSubTab('EDITOR');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  clockSubTab === 'EDITOR'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sparkles size={13} />
                <span>CLOCK EDITOR (TYPOGRAPHY & BLEND)</span>
              </button>
              <button
                onClick={() => {
                  tactileAudio.playClick(2100);
                  setClockSubTab('STYLES');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  clockSubTab === 'STYLES'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Clock size={13} />
                <span>BASE CLOCK STYLES ({clockStyles.length})</span>
              </button>
            </div>

            {clockSubTab === 'EDITOR' ? (
              <ClockEditor
                theme={theme}
                onUpdateTheme={(updated) => {
                  setTheme(updated);
                  onUpdateTheme(updated);
                }}
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-neutral-400 tracking-wider">
                    FUTURISTIC CLOCK STYLE
                  </label>
                  <button
                    onClick={() => {
                      tactileAudio.playClick(2100);
                      setClockSubTab('EDITOR');
                    }}
                    className="text-[10px] font-mono text-white underline hover:text-neutral-300"
                  >
                    Open Typography & Blending Editor →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {clockStyles.map((style) => {
                    const isSelected = theme.clockStyle === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => {
                          tactileAudio.playClick(2100);
                          updateField({ clockStyle: style.id });
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 ${
                          isSelected
                            ? 'border-white bg-neutral-900 shadow-md ring-1 ring-white/20'
                            : 'border-neutral-900 bg-neutral-950/80 hover:border-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {style.tag && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                                {style.tag}
                              </span>
                            )}
                            <span className="text-xs font-semibold text-white">{style.label}</span>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                              <Check size={13} />
                              <span>ACTIVE</span>
                            </div>
                          )}
                        </div>

                        {/* Micro live render of the actual clock */}
                        <div className="p-2.5 rounded-xl bg-black border border-neutral-900/90 flex items-center overflow-hidden">
                          <FuturisticClock
                            styleType={style.id}
                            accentColor={theme.accentColor}
                            config={theme.clockConfig}
                            className="transform scale-85 origin-left"
                          />
                        </div>

                        <p className="text-[10px] text-neutral-500 font-mono">{style.preview}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. WIDGETS TAB */}
        {activeTab === 'WIDGETS' && (
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-400 tracking-wider">
              HOME SCREEN WIDGET MODULES
            </span>

            {/* Music Player */}
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Music Player Pill</h4>
                  <p className="text-[11px] text-neutral-500">Audio playback & animated waveforms</p>
                </div>
                <input
                  type="checkbox"
                  checked={theme.widgets.showMusicPlayer}
                  onChange={(e) => updateWidgetField({ showMusicPlayer: e.target.checked })}
                  className="w-4 h-4 accent-white rounded"
                />
              </div>

              {theme.widgets.showMusicPlayer && (
                <div className="pt-2 border-t border-neutral-900 space-y-2">
                  <input
                    type="text"
                    value={theme.widgets.musicTrackTitle}
                    onChange={(e) => updateWidgetField({ musicTrackTitle: e.target.value })}
                    placeholder="Track Title"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                  <input
                    type="text"
                    value={theme.widgets.musicTrackArtist}
                    onChange={(e) => updateWidgetField({ musicTrackArtist: e.target.value })}
                    placeholder="Artist Name"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              )}
            </div>

            {/* System Monitor */}
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">System Stats Monitor</h4>
                <p className="text-[11px] text-neutral-500">Battery %, RAM draw, 120 FPS indicator</p>
              </div>
              <input
                type="checkbox"
                checked={theme.widgets.showSystemMonitor}
                onChange={(e) => updateWidgetField({ showSystemMonitor: e.target.checked })}
                className="w-4 h-4 accent-white rounded"
              />
            </div>

            {/* Weather Pill */}
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">Weather Pill</h4>
                <p className="text-[11px] text-neutral-500">Temperature, conditions, wind speed</p>
              </div>
              <input
                type="checkbox"
                checked={theme.widgets.showWeatherPill}
                onChange={(e) => updateWidgetField({ showWeatherPill: e.target.checked })}
                className="w-4 h-4 accent-white rounded"
              />
            </div>

            {/* Search Pill */}
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">Search Pill Bar</h4>
                <p className="text-[11px] text-neutral-500">Fast access to Google / system search</p>
              </div>
              <input
                type="checkbox"
                checked={theme.widgets.showSearchPill}
                onChange={(e) => updateWidgetField({ showSearchPill: e.target.checked })}
                className="w-4 h-4 accent-white rounded"
              />
            </div>
          </div>
        )}

        {/* 5. GRID & ALIGNMENT TAB */}
        {activeTab === 'GRID' && (
          <div className="space-y-5">
            {/* Alignment */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono text-neutral-400 tracking-wider">
                GRID VERTICAL ALIGNMENT
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['top', 'center', 'bottom'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateGridField({ alignment: align })}
                    className={`py-2 text-xs font-mono border rounded-xl capitalize ${
                      theme.gridConfig.alignment === align
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-900'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            {/* Columns & Rows */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <span className="text-xs font-mono text-neutral-400">COLUMNS ({theme.gridConfig.columns})</span>
                <div className="flex gap-1.5">
                  {[3, 4, 5].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => updateGridField({ columns: cols })}
                      className={`flex-1 py-2 rounded-lg text-xs font-mono border ${
                        theme.gridConfig.columns === cols
                          ? 'bg-white text-black border-white font-semibold'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-900'
                      }`}
                    >
                      {cols}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-neutral-400">ROWS ({theme.gridConfig.rows})</span>
                <div className="flex gap-1.5">
                  {[4, 5, 6].map((rows) => (
                    <button
                      key={rows}
                      onClick={() => updateGridField({ rows })}
                      className={`flex-1 py-2 rounded-lg text-xs font-mono border ${
                        theme.gridConfig.rows === rows
                          ? 'bg-white text-black border-white font-semibold'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-900'
                      }`}
                    >
                      {rows}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Icon Size */}
            <div className="space-y-2 pt-2 border-t border-neutral-900">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300">ICON SIZE</span>
                <span className="text-neutral-400">{theme.gridConfig.iconSize}px</span>
              </div>
              <input
                type="range"
                min="40"
                max="64"
                value={theme.gridConfig.iconSize}
                onChange={(e) => updateGridField({ iconSize: Number(e.target.value) })}
                className="w-full accent-white"
              />
            </div>

            {/* Icon Spacing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300">GRID SPACING</span>
                <span className="text-neutral-400">{theme.gridConfig.iconSpacing}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="26"
                value={theme.gridConfig.iconSpacing}
                onChange={(e) => updateGridField({ iconSpacing: Number(e.target.value) })}
                className="w-full accent-white"
              />
            </div>

            {/* App Labels */}
            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-white block">APPLICATION LABELS</span>
                <span className="text-[11px] text-neutral-500">Text labels below app icons</span>
              </div>
              <input
                type="checkbox"
                checked={theme.gridConfig.showLabels}
                onChange={(e) => updateGridField({ showLabels: e.target.checked })}
                className="w-4 h-4 accent-white rounded"
              />
            </div>
          </div>
        )}

        {/* 6. ANIMATIONS TAB */}
        {activeTab === 'ANIMATIONS' && (
          <div className="space-y-4">
            <label className="text-xs font-mono text-neutral-400 tracking-wider">
              LIVE WALLPAPER ENGINE (60/120 FPS)
            </label>
            <div className="space-y-2">
              {liveEffects.map((eff) => {
                const isSelected = theme.liveEffect === eff.id;
                return (
                  <div
                    key={eff.id}
                    onClick={() => {
                      tactileAudio.playClick();
                      updateField({ liveEffect: eff.id });
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-white bg-neutral-900'
                        : 'border-neutral-900 bg-neutral-950 hover:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{eff.label}</span>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{eff.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. JSON TAB */}
        {activeTab === 'JSON' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">THEME JSON SCHEMA</span>
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1 text-xs font-mono text-white hover:underline"
              >
                <Download size={13} />
                <span>Export .JSON</span>
              </button>
            </div>
            <textarea
              value={jsonInput || JSON.stringify(theme, null, 2)}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={9}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-300 focus:outline-none focus:border-neutral-600"
            />
            <button
              onClick={handleImportJson}
              className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-mono text-white hover:bg-neutral-800 flex items-center justify-center gap-2"
            >
              <Upload size={14} />
              <span>Import & Parse JSON</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
