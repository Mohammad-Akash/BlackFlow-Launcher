import React, { useState, useEffect } from 'react';
import {
  AppItem,
  GridConfig,
  ClockStyleType,
  LiveEffectType,
  ThemeConfig,
  WallpaperItem,
  WidgetConfig
} from './types';
import { INITIAL_APPS, DEFAULT_THEME, THEME_PRESETS } from './data/mockApps';
import { LauncherHomeScreen } from './components/LauncherHomeScreen';
import { AppDrawer } from './components/AppDrawer';
import { LockScreen } from './components/LockScreen';
import { WallpaperMarketplace } from './components/WallpaperMarketplace';
import { ThemeEditor } from './components/ThemeEditor';
import { LauncherSettings } from './components/LauncherSettings';
import { AndroidProjectExplorer } from './components/AndroidProjectExplorer';
import { ClockStylePickerModal } from './components/ClockStylePickerModal';
import { UninstallConfirmModal } from './components/UninstallConfirmModal';
import { WidgetManagerModal } from './components/WidgetManagerModal';
import { AddAppsToHomeModal } from './components/AddAppsToHomeModal';
import { tactileAudio } from './utils/audioFeedback';
import {
  Smartphone,
  Code2,
  Lock,
  Grid,
  Sparkles,
  Sliders,
  Settings as SettingsIcon,
  Wifi,
  Battery,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  Palette,
  Layers,
  Edit3,
  Clock,
  Plus,
  Trash2,
  Zap,
  FileText,
  Footprints
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'SIMULATOR' | 'CODE_EXPLORER'>('SIMULATOR');
  const [screen, setScreen] = useState<'HOME' | 'DRAWER' | 'WALLPAPERS' | 'THEME_STUDIO' | 'SETTINGS'>('HOME');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isClockPickerOpen, setIsClockPickerOpen] = useState<boolean>(false);
  const [isWidgetManagerOpen, setIsWidgetManagerOpen] = useState<boolean>(false);
  const [isAddAppsToHomeOpen, setIsAddAppsToHomeOpen] = useState<boolean>(false);
  const [uninstallTargetApp, setUninstallTargetApp] = useState<AppItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time ticker for top phone status bar
  const [currentTime, setCurrentTime] = useState('10:42');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    tactileAudio.setEnabled(next);
    if (next) tactileAudio.playClick(2200);
    showToast(next ? 'Futuristic Tactile Audio ON' : 'Audio Muted');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleLaunchApp = (app: AppItem) => {
    showToast(`Launching ${app.customLabel || app.name} [${app.packageName}]`);
  };

  const handleToggleHomePin = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, isCustomOnHome: !a.isCustomOnHome } : a))
    );
    showToast('Updated Home Grid shortcut');
  };

  const handleToggleHideApp = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, isHidden: !a.isHidden } : a))
    );
    showToast('Updated hidden application status');
  };

  const handleUnhideApp = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, isHidden: false } : a))
    );
    showToast('Application unhidden');
  };

  const handleUpdateApp = (appId: string, customLabel?: string, customIcon?: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, customLabel, customIcon } : a))
    );
    showToast('Application customized');
  };

  const handleRemoveFromHome = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, isCustomOnHome: false } : a))
    );
    showToast('Removed from Home Grid');
  };

  const handleReorderHomeApps = (reorderedApps: AppItem[]) => {
    setApps((prev) => {
      const orderMap = new Map(reorderedApps.map((a) => [a.id, a.order]));
      return prev.map((app) => {
        if (orderMap.has(app.id)) {
          return { ...app, order: orderMap.get(app.id) };
        }
        return app;
      });
    });
    showToast('Reordered Home Screen');
  };

  const handleUninstallApp = (appId: string) => {
    const target = apps.find((a) => a.id === appId);
    if (!target) return;
    if (target.isSystem || target.category === 'SYSTEM') {
      showToast('System application cannot be deleted');
      return;
    }
    setApps((prev) => prev.filter((a) => a.id !== appId));
    showToast(`Uninstalled ${target.customLabel || target.name}`);
  };

  const handleRestoreDefaultApps = () => {
    setApps(INITIAL_APPS);
    showToast('Factory default applications restored');
  };

  const handleUpdateWidget = (updated: Partial<WidgetConfig>) => {
    setTheme((prev) => ({
      ...prev,
      widgets: { ...prev.widgets, ...updated }
    }));
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-neutral-100 flex flex-col font-sans select-none antialiased">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-neutral-900 px-6 flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black font-mono font-bold text-xs">
            BF
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider font-mono text-white flex items-center gap-2">
              <span>BLACKFLOW LAUNCHER</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                AMOLED KOTLIN COMPOSE
              </span>
            </h1>
          </div>
        </div>

        {/* View Switcher & Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? 'border-neutral-800 bg-neutral-900 text-white'
                : 'border-neutral-900 text-neutral-500'
            }`}
            title="Tactile synthesized click sound toggle"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="hidden sm:inline text-[11px] font-mono">TACTILE FX</span>
          </button>

          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-850">
            <button
              id="tab_phone_simulator"
              onClick={() => {
                tactileAudio.playClick();
                setActiveView('SIMULATOR');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
                activeView === 'SIMULATOR'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>AMOLED SIMULATOR</span>
            </button>
            <button
              id="tab_code_explorer"
              onClick={() => {
                tactileAudio.playClick();
                setActiveView('CODE_EXPLORER');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
                activeView === 'CODE_EXPLORER'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Code2 size={14} />
              <span>ANDROID STUDIO PROJECT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Preset Themes One-Click Banner */}
      {activeView === 'SIMULATOR' && (
        <div className="border-b border-neutral-900/80 bg-neutral-950/60 px-6 py-2 flex items-center justify-between overflow-x-auto no-scrollbar gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 whitespace-nowrap">
            <Sparkles size={13} className="text-white" />
            <span>PRESETS:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {THEME_PRESETS.map((preset) => {
              const isSelected = theme.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    tactileAudio.playClick(2400);
                    setTheme(preset);
                    showToast(`Applied "${preset.name}" Preset`);
                  }}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border whitespace-nowrap transition-all ${
                    isSelected
                      ? 'border-white bg-white text-black font-semibold shadow-sm'
                      : 'border-neutral-850 bg-neutral-900/90 text-neutral-300 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-black/40"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn_quick_clock_picker"
              onClick={() => {
                tactileAudio.playClick(2100);
                setIsClockPickerOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-mono text-white whitespace-nowrap hover:border-neutral-600 transition-all shadow-sm"
              title="Change Clock Style"
            >
              <Clock size={12} className="text-white" />
              <span>CLOCK: {theme.clockStyle.replace('_', ' ')}</span>
            </button>

            <button
              onClick={() => {
                tactileAudio.playClick();
                setScreen('THEME_STUDIO');
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white whitespace-nowrap"
            >
              <Sliders size={12} />
              <span>CUSTOMIZE ALL</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        {activeView === 'SIMULATOR' ? (
          <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-6xl justify-center">
            {/* Phone Hardware Mockup Frame */}
            <div className="relative w-[375px] h-[790px] bg-[#0c0c0e] rounded-[50px] p-3 shadow-2xl border-4 border-neutral-850 shadow-black ring-1 ring-white/10 flex flex-col">
              {/* Phone Speaker & Punch Hole Camera */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-black z-50 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111115] border border-neutral-800" />
              </div>

              {/* AMOLED Screen Canvas Container */}
              <div className="relative flex-1 bg-[#000000] rounded-[40px] overflow-hidden flex flex-col border border-neutral-900">
                {/* Status Bar */}
                <div className="h-9 px-6 flex items-center justify-between text-[11px] font-mono font-medium text-neutral-300 z-40">
                  <span>{currentTime}</span>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <span className="text-[10px] tracking-wider">5G</span>
                    <Wifi size={13} strokeWidth={1.7} />
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px]">92%</span>
                      <Battery size={13} strokeWidth={1.7} />
                    </div>
                  </div>
                </div>

                {/* Active Screen inside Launcher */}
                <div className="relative flex-1 overflow-hidden">
                  <LauncherHomeScreen
                    apps={apps}
                    gridConfig={theme.gridConfig}
                    clockStyle={theme.clockStyle}
                    clockConfig={theme.clockConfig}
                    widgets={theme.widgets}
                    liveEffect={theme.liveEffect}
                    accentColor={theme.accentColor}
                    wallpaperUrl={theme.customWallpaperUrl}
                    onOpenDrawer={() => setScreen('DRAWER')}
                    onOpenSettings={() => setScreen('SETTINGS')}
                    onOpenWallpaperStore={() => setScreen('WALLPAPERS')}
                    onOpenThemeEditor={() => setScreen('THEME_STUDIO')}
                    onOpenClockPicker={() => setIsClockPickerOpen(true)}
                    onLockScreen={() => setIsLocked(true)}
                    onLaunchApp={handleLaunchApp}
                    onUpdateWidget={handleUpdateWidget}
                    onUpdateApp={handleUpdateApp}
                    onRemoveFromHome={handleRemoveFromHome}
                    onReorderHomeApps={handleReorderHomeApps}
                    onUninstallAppRequest={(app) => setUninstallTargetApp(app)}
                    onOpenAddAppsModal={() => setIsAddAppsToHomeOpen(true)}
                    onOpenWidgetManager={() => setIsWidgetManagerOpen(true)}
                  />

                  {screen === 'DRAWER' && (
                    <AppDrawer
                      apps={apps}
                      iconStyle={theme.gridConfig.iconStyle}
                      iconShape={theme.gridConfig.iconShape}
                      accentColor={theme.accentColor}
                      onClose={() => setScreen('HOME')}
                      onLaunchApp={handleLaunchApp}
                      onToggleHomePin={handleToggleHomePin}
                      onToggleHideApp={handleToggleHideApp}
                      onUninstallAppRequest={(app) => setUninstallTargetApp(app)}
                    />
                  )}

                  {screen === 'WALLPAPERS' && (
                    <WallpaperMarketplace
                      currentWallpaperId={theme.wallpaperId}
                      onClose={() => setScreen('HOME')}
                      onApplyLiveWallpaper={(effect: LiveEffectType) => {
                        setTheme((prev) => ({ ...prev, liveEffect: effect }));
                      }}
                      onSetWallpaper={(wp: WallpaperItem, target: 'HOME' | 'LOCK' | 'BOTH') => {
                        const newUrl = wp.highResUrl || wp.thumbnailUrl || '';
                        setTheme((prev) => ({
                          ...prev,
                          wallpaperId: wp.id,
                          customWallpaperUrl: newUrl,
                          liveEffect: wp.isLive && wp.liveEffect ? wp.liveEffect : 'NONE'
                        }));
                        showToast(`Applied "${wp.title}" to ${target === 'BOTH' ? 'Home & Lock' : target}`);
                      }}
                    />
                  )}

                  {screen === 'THEME_STUDIO' && (
                    <ThemeEditor
                      currentTheme={theme}
                      onUpdateTheme={(updated) => setTheme(updated)}
                      onClose={() => setScreen('HOME')}
                    />
                  )}

                  {screen === 'SETTINGS' && (
                    <LauncherSettings
                      apps={apps}
                      onClose={() => setScreen('HOME')}
                      onOpenThemeEditor={() => setScreen('THEME_STUDIO')}
                      onOpenWallpaperStore={() => setScreen('WALLPAPERS')}
                      onUnhideApp={handleUnhideApp}
                      onRestoreDefaultApps={handleRestoreDefaultApps}
                      onUninstallAppRequest={(app) => setUninstallTargetApp(app)}
                    />
                  )}

                  {/* Lock Screen Overlay */}
                  {isLocked && (
                    <LockScreen
                      clockStyle={theme.clockStyle}
                      clockConfig={
                        theme.separateLockClock && theme.lockScreenClockConfig
                          ? theme.lockScreenClockConfig
                          : theme.clockConfig
                      }
                      accentColor={theme.accentColor}
                      wallpaperUrl={theme.customWallpaperUrl}
                      onUnlock={() => setIsLocked(false)}
                    />
                  )}

                  {/* Clock Style Quick Selector Modal */}
                  {isClockPickerOpen && (
                    <ClockStylePickerModal
                      currentStyle={theme.clockStyle}
                      accentColor={theme.accentColor}
                      onSelectStyle={(newStyle) => {
                        setTheme((prev) => ({ ...prev, clockStyle: newStyle }));
                        showToast(`Clock style set to ${newStyle.replace('_', ' ')}`);
                      }}
                      onOpenClockEditor={() => {
                        setScreen('THEME_STUDIO');
                      }}
                      onClose={() => setIsClockPickerOpen(false)}
                    />
                  )}

                  {/* Uninstall App Confirmation Modal */}
                  {uninstallTargetApp && (
                    <UninstallConfirmModal
                      app={uninstallTargetApp}
                      iconStyle={theme.gridConfig.iconStyle}
                      iconShape={theme.gridConfig.iconShape}
                      accentColor={theme.accentColor}
                      onCancel={() => setUninstallTargetApp(null)}
                      onConfirmUninstall={(appId) => handleUninstallApp(appId)}
                      onRemoveFromHome={(appId) => handleRemoveFromHome(appId)}
                      onHideApp={(appId) => handleToggleHideApp(appId)}
                    />
                  )}

                  {/* Widgets Manager Modal */}
                  {isWidgetManagerOpen && (
                    <WidgetManagerModal
                      config={theme.widgets}
                      accentColor={theme.accentColor}
                      onClose={() => setIsWidgetManagerOpen(false)}
                      onUpdateWidget={handleUpdateWidget}
                    />
                  )}

                  {/* Add Apps to Home Modal */}
                  {isAddAppsToHomeOpen && (
                    <AddAppsToHomeModal
                      allApps={apps}
                      iconStyle={theme.gridConfig.iconStyle}
                      iconShape={theme.gridConfig.iconShape}
                      accentColor={theme.accentColor}
                      onToggleHomeApp={handleToggleHomePin}
                      onClose={() => setIsAddAppsToHomeOpen(false)}
                    />
                  )}

                  {/* Toast Notification */}
                  {toastMessage && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-neutral-900/95 border border-neutral-700 text-xs font-mono text-white rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap animate-fade-in">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>{toastMessage}</span>
                    </div>
                  )}
                </div>

                {/* Android Navigation Bar Pill */}
                <div className="h-6 flex items-center justify-center z-40">
                  <div
                    onClick={() => {
                      tactileAudio.playClick(2600);
                      setScreen('HOME');
                    }}
                    className="w-28 h-1 bg-neutral-600 rounded-full hover:bg-white cursor-pointer transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Quick Interactive Demo Controls & Live Customizer Shortcuts */}
            <div className="w-full max-w-md space-y-4">
              <div className="bg-neutral-950 border border-neutral-850 rounded-2xl p-5">
                <h3 className="text-xs font-mono font-bold tracking-wider text-neutral-300 uppercase mb-3 flex items-center justify-between">
                  <span>SCREEN NAVIGATOR</span>
                  <span className="text-[10px] text-neutral-500 font-normal">INSTANT VIEW</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      setScreen('HOME');
                      setIsLocked(false);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                      screen === 'HOME' && !isLocked
                        ? 'border-white bg-neutral-900 text-white font-semibold'
                        : 'border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Grid size={14} />
                    <span>Home Screen</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      setScreen('DRAWER');
                      setIsLocked(false);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                      screen === 'DRAWER' && !isLocked
                        ? 'border-white bg-neutral-900 text-white font-semibold'
                        : 'border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Grid size={14} />
                    <span>App Drawer</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playLock();
                      setIsLocked(true);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                      isLocked
                        ? 'border-white bg-neutral-900 text-white font-semibold'
                        : 'border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Lock size={14} />
                    <span>Lock Screen</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      setScreen('THEME_STUDIO');
                      setIsLocked(false);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                      screen === 'THEME_STUDIO' && !isLocked
                        ? 'border-white bg-neutral-900 text-white font-semibold'
                        : 'border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Sliders size={14} />
                    <span>Theme Studio</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      setScreen('WALLPAPERS');
                      setIsLocked(false);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                      screen === 'WALLPAPERS' && !isLocked
                        ? 'border-white bg-neutral-900 text-white font-semibold'
                        : 'border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Sparkles size={14} />
                    <span>Wallpaper Hub</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      setScreen('SETTINGS');
                      setIsLocked(false);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                      screen === 'SETTINGS' && !isLocked
                        ? 'border-white bg-neutral-900 text-white font-semibold'
                        : 'border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <SettingsIcon size={14} />
                    <span>Settings</span>
                  </button>

                  <button
                    id="btn_open_clock_editor"
                    onClick={() => {
                      tactileAudio.playClick();
                      setScreen('THEME_STUDIO');
                      setIsLocked(false);
                    }}
                    className="col-span-2 py-2 px-3 rounded-xl border border-white/20 bg-neutral-900 text-white font-mono text-xs flex items-center justify-between hover:bg-neutral-850 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-emerald-400" />
                      <span>Clock Editor (Fonts, Weights & Blend)</span>
                    </span>
                    <span className="text-[10px] text-neutral-400">STUDIO →</span>
                  </button>
                </div>
              </div>

              {/* Real-time Widget Toggles & App Manager */}
              <div className="bg-neutral-950 border border-neutral-850 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-300 font-semibold">
                  <span className="flex items-center gap-2">
                    <Layers size={14} className="text-white" />
                    <span>WIDGETS & HOME GRID CONTROLS</span>
                  </span>
                  <span className="text-[10px] text-neutral-500 font-normal">REAL-TIME</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="btn_side_open_widget_manager"
                    onClick={() => {
                      tactileAudio.playClick(2100);
                      setIsWidgetManagerOpen(true);
                    }}
                    className="col-span-1 py-2 px-3 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition-colors"
                  >
                    <Plus size={13} />
                    <span>Manage Widgets</span>
                  </button>

                  <button
                    id="btn_side_open_add_apps"
                    onClick={() => {
                      tactileAudio.playClick(2100);
                      setIsAddAppsToHomeOpen(true);
                    }}
                    className="col-span-1 py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-750 text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-800 transition-colors"
                  >
                    <Grid size={13} />
                    <span>Add Apps to Home</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      handleUpdateWidget({ showMusicPlayer: !theme.widgets.showMusicPlayer });
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      theme.widgets.showMusicPlayer
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-900 text-neutral-500'
                    }`}
                  >
                    <span>Music Player</span>
                    <span className="text-[9px]">{theme.widgets.showMusicPlayer ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      handleUpdateWidget({ showSystemMonitor: !theme.widgets.showSystemMonitor });
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      theme.widgets.showSystemMonitor
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-900 text-neutral-500'
                    }`}
                  >
                    <span>System Stats</span>
                    <span className="text-[9px]">{theme.widgets.showSystemMonitor ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      handleUpdateWidget({ showWeatherPill: !theme.widgets.showWeatherPill });
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      theme.widgets.showWeatherPill
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-900 text-neutral-500'
                    }`}
                  >
                    <span>Weather Pill</span>
                    <span className="text-[9px]">{theme.widgets.showWeatherPill ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      handleUpdateWidget({ showSearchPill: !theme.widgets.showSearchPill });
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      theme.widgets.showSearchPill
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-900 text-neutral-500'
                    }`}
                  >
                    <span>Search Pill</span>
                    <span className="text-[9px]">{theme.widgets.showSearchPill ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      handleUpdateWidget({ showQuickNotes: !theme.widgets.showQuickNotes });
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      theme.widgets.showQuickNotes
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-900 text-neutral-500'
                    }`}
                  >
                    <span>Quick Notes</span>
                    <span className="text-[9px]">{theme.widgets.showQuickNotes ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      handleUpdateWidget({ showRamBooster: !theme.widgets.showRamBooster });
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      theme.widgets.showRamBooster
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-900 text-neutral-500'
                    }`}
                  >
                    <span>RAM Booster</span>
                    <span className="text-[9px]">{theme.widgets.showRamBooster ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      handleUpdateWidget({ showStepCounter: !theme.widgets.showStepCounter });
                    }}
                    className={`col-span-2 p-2.5 rounded-xl border flex items-center justify-between ${
                      theme.widgets.showStepCounter
                        ? 'border-white bg-neutral-900 text-white'
                        : 'border-neutral-900 text-neutral-500'
                    }`}
                  >
                    <span>Health & Pedometer Step Glance</span>
                    <span className="text-[9px]">{theme.widgets.showStepCounter ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>

              {/* Architecture & Verification Specs */}
              <div className="bg-neutral-950 border border-neutral-850 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>ANDROID PRODUCTION ARCHITECTURE</span>
                </div>
                <div className="space-y-1.5 text-neutral-400 text-[11px] leading-relaxed">
                  <div className="flex justify-between py-1 border-b border-neutral-900">
                    <span className="text-neutral-500">PACKAGE NAME</span>
                    <span className="text-neutral-200">com.blackflow.launcher</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900">
                    <span className="text-neutral-500">PLATFORM ROLE</span>
                    <span className="text-neutral-200">RoleManager.ROLE_HOME</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900">
                    <span className="text-neutral-500">LIVE WALLPAPER</span>
                    <span className="text-neutral-200">AmoledLiveWallpaperService.kt</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900">
                    <span className="text-neutral-500">ROOM PERSISTENCE</span>
                    <span className="text-neutral-200">13 Entities • SQLite Room</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">BIOMETRIC SECURITY</span>
                    <span className="text-neutral-200">BiometricPrompt Coexistence</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    tactileAudio.playClick();
                    setActiveView('CODE_EXPLORER');
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs flex items-center justify-center gap-2 border border-neutral-800 transition-colors"
                >
                  <Code2 size={14} />
                  <span>Inspect Android Studio Project & Export ZIP</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl h-[790px]">
            <AndroidProjectExplorer />
          </div>
        )}
      </main>
    </div>
  );
}
