import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Palette,
  Sparkles,
  Smartphone,
  Shield,
  Activity,
  ChevronRight,
  Check,
  Eye,
  Trash2,
  Lock,
  Layers,
  Info,
  Sliders
} from 'lucide-react';
import { AppItem } from '../types';

interface Props {
  apps: AppItem[];
  onClose: () => void;
  onOpenThemeEditor: () => void;
  onOpenWallpaperStore: () => void;
  onUnhideApp: (appId: string) => void;
  onRestoreDefaultApps?: () => void;
  onUninstallAppRequest?: (app: AppItem) => void;
}

export const LauncherSettings: React.FC<Props> = ({
  apps,
  onClose,
  onOpenThemeEditor,
  onOpenWallpaperStore,
  onUnhideApp,
  onRestoreDefaultApps,
  onUninstallAppRequest
}) => {
  const [activeSection, setActiveSection] = useState<'MAIN' | 'HIDDEN_APPS' | 'INSTALLED_APPS' | 'PERFORMANCE' | 'ABOUT'>('MAIN');
  const [highRefreshRate, setHighRefreshRate] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  const hiddenApps = apps.filter((a) => a.isHidden);

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 1500);
  };

  const handleRestore = () => {
    onRestoreDefaultApps?.();
    setRestoreSuccess(true);
    setTimeout(() => setRestoreSuccess(false), 2000);
  };

  return (
    <div
      id="launcher_settings_container"
      className="absolute inset-0 z-30 bg-[#000000] text-white flex flex-col select-none overflow-hidden animate-fade-in"
    >
      {/* Header */}
      <div className="pt-6 px-5 pb-3 border-b border-neutral-900 flex items-center gap-3">
        <button
          onClick={() => {
            if (activeSection !== 'MAIN') setActiveSection('MAIN');
            else onClose();
          }}
          className="p-2 rounded-full hover:bg-neutral-900 active:scale-95 transition-all text-neutral-300 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-sm font-semibold tracking-wider font-mono">
            {activeSection === 'MAIN' ? 'SETTINGS' : activeSection.replace('_', ' ')}
          </h2>
          <p className="text-[11px] text-neutral-500">BlackFlow System Engine</p>
        </div>
      </div>

      {/* Main Settings List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {activeSection === 'MAIN' && (
          <>
            {/* Default Launcher Banner */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white text-black">
                  <Home size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Default Home App</h4>
                  <p className="text-[11px] text-neutral-400">Manage Android RoleManager status</p>
                </div>
              </div>
              <button
                onClick={() => alert('On Android device: RoleManager.ROLE_HOME intent triggered successfully.')}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-white hover:bg-neutral-800"
              >
                REQUEST
              </button>
            </div>

            {/* Appearance Section */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 tracking-wider mb-2">APPEARANCE</div>
              <button
                onClick={onOpenThemeEditor}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-950 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Palette size={18} className="text-neutral-400" />
                  <div>
                    <div className="text-xs font-medium text-white">Theme & Monochrome Icons</div>
                    <div className="text-[11px] text-neutral-500">Customize outlines, clock, grid</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-600" />
              </button>

              <button
                onClick={onOpenWallpaperStore}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-950 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-neutral-400" />
                  <div>
                    <div className="text-xs font-medium text-white">Wallpaper Hub & Live Effects</div>
                    <div className="text-[11px] text-neutral-500">AMOLED pure black & 60FPS particles</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-600" />
              </button>
            </div>

            {/* Gestures Section */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 tracking-wider mb-2">GESTURES CONFIG</div>
              <div className="p-3 bg-neutral-950/80 rounded-xl space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Swipe Up</span>
                  <span className="font-mono text-neutral-500">App Drawer</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Swipe Down</span>
                  <span className="font-mono text-neutral-500">Search & Notifications</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Double Tap</span>
                  <span className="font-mono text-neutral-500">Lock Screen (Biometric)</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Long Press</span>
                  <span className="font-mono text-neutral-500">Home Grid Customizer</span>
                </div>
              </div>
            </div>

            {/* Apps & Security */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 tracking-wider mb-2">APPLICATIONS</div>
              <button
                id="btn_settings_installed_apps"
                onClick={() => setActiveSection('INSTALLED_APPS')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-950 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Sliders size={18} className="text-neutral-400" />
                  <div>
                    <div className="text-xs font-medium text-white">App Manager & Uninstall</div>
                    <div className="text-[11px] text-neutral-500">{apps.length} installed apps • Uninstall or restore</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-600" />
              </button>

              <button
                onClick={() => setActiveSection('HIDDEN_APPS')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-950 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Eye size={18} className="text-neutral-400" />
                  <div>
                    <div className="text-xs font-medium text-white">Hidden Applications</div>
                    <div className="text-[11px] text-neutral-500">{hiddenApps.length} apps hidden from drawer</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-600" />
              </button>
              <button
                onClick={() => setActiveSection('PERFORMANCE')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-950 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-neutral-400" />
                  <div>
                    <div className="text-xs font-medium text-white">Performance & Refresh Rate</div>
                    <div className="text-[11px] text-neutral-500">60/120 FPS display & cache management</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-600" />
              </button>
              <button
                onClick={() => setActiveSection('ABOUT')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-950 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Info size={18} className="text-neutral-400" />
                  <div>
                    <div className="text-xs font-medium text-white">About & Open Source</div>
                    <div className="text-[11px] text-neutral-500">v1.0.0 (Production Jetpack Compose)</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-600" />
              </button>
            </div>
          </>
        )}

        {activeSection === 'INSTALLED_APPS' && (
          <div className="space-y-4">
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">Restore Factory Applications</h4>
                <p className="text-[11px] text-neutral-400">Reinstall any uninstalled default apps</p>
              </div>
              <button
                id="btn_restore_default_apps"
                onClick={handleRestore}
                className="px-3 py-1.5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 transition-colors"
              >
                {restoreSuccess ? 'RESTORED' : 'RESTORE'}
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-neutral-500 tracking-wider">
                ALL INSTALLED APPLICATIONS ({apps.length})
              </div>

              <div className="space-y-2 pt-1">
                {apps.map((app) => {
                  const isSys = app.isSystem || app.category === 'SYSTEM';

                  return (
                    <div
                      key={app.id}
                      className="p-3 bg-neutral-950 rounded-2xl border border-neutral-900 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {app.customLabel || app.name}
                          </h4>
                          {isSys && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                              SYSTEM
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono truncate">
                          {app.packageName}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {!isSys ? (
                          <button
                            onClick={() => onUninstallAppRequest?.(app)}
                            className="px-2.5 py-1 text-[11px] font-mono text-red-400 hover:text-white bg-neutral-900 hover:bg-red-950/60 border border-neutral-800 hover:border-red-800 rounded-xl transition-colors"
                          >
                            Uninstall
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-neutral-600 px-2 py-1">
                            Protected
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'HIDDEN_APPS' && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-400">
              Hidden applications are kept safe and hidden from the App Drawer and Home grid.
            </p>
            {hiddenApps.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-neutral-600">
                NO HIDDEN APPS
              </div>
            ) : (
              <div className="space-y-2">
                {hiddenApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-900"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white">{app.name}</h4>
                      <p className="text-[10px] text-neutral-500 font-mono">{app.packageName}</p>
                    </div>
                    <button
                      onClick={() => onUnhideApp(app.id)}
                      className="px-2.5 py-1 text-[11px] font-mono text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
                    >
                      UNHIDE
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'PERFORMANCE' && (
          <div className="space-y-5">
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">120Hz Ultra-Smooth Mode</span>
                <span className="text-[11px] text-neutral-400">Unlock high refresh rate animations</span>
              </div>
              <input
                type="checkbox"
                checked={highRefreshRate}
                onChange={(e) => setHighRefreshRate(e.target.checked)}
                className="w-4 h-4 accent-white rounded"
              />
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Clear Local Icon Cache</span>
                <span className="text-[11px] text-neutral-400">Free memory & regenerate outlines</span>
              </div>
              <button
                onClick={handleClearCache}
                className="px-3 py-1.5 text-xs font-mono bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg"
              >
                {cacheCleared ? 'CLEARED' : 'CLEAR'}
              </button>
            </div>
          </div>
        )}

        {activeSection === 'ABOUT' && (
          <div className="space-y-4 text-xs leading-relaxed text-neutral-300">
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900">
              <h4 className="font-semibold text-white text-sm">BlackFlow Launcher</h4>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Version 1.0.0-release</p>
              <p className="mt-3 text-neutral-300">
                A production-ready AMOLED Black Launcher crafted with Jetpack Compose, Material 3, Room, DataStore, and Hilt.
              </p>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-500">PLATFORM:</span>
                <span className="text-white">Android 10+ (Target SDK 35)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">TELEMETRY:</span>
                <span className="text-emerald-400">Zero (100% Offline)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">BATTERY:</span>
                <span className="text-white">Pure #000000 OLED Conservation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">LICENSE:</span>
                <span className="text-white">Apache 2.0 Open Source</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
