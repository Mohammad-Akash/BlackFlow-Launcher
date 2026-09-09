import React, { useState, useRef } from 'react';
import { AppItem, GridConfig, ClockStyleType, LiveEffectType, WidgetConfig, ClockCustomization } from '../types';
import { FuturisticClock } from './FuturisticClock';
import { MonochromeIconRenderer } from './MonochromeIconRenderer';
import { AmoledCanvasWallpaper } from './AmoledCanvasWallpaper';
import { HomeWidgets } from './HomeWidgets';
import { tactileAudio } from '../utils/audioFeedback';
import {
  Search,
  Settings as SettingsIcon,
  Sliders,
  ChevronUp,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Sparkles,
  X,
  Check,
  Clock,
  Plus,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  MinusCircle,
  Info,
  Layers
} from 'lucide-react';

interface Props {
  apps: AppItem[];
  gridConfig: GridConfig;
  clockStyle: ClockStyleType;
  clockConfig?: ClockCustomization;
  widgets: WidgetConfig;
  liveEffect: LiveEffectType;
  accentColor: string;
  wallpaperUrl?: string;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  onOpenWallpaperStore: () => void;
  onOpenThemeEditor: () => void;
  onOpenClockPicker?: () => void;
  onLockScreen: () => void;
  onLaunchApp: (app: AppItem) => void;
  onUpdateWidget?: (updated: Partial<WidgetConfig>) => void;
  onUpdateApp?: (appId: string, customLabel?: string, customIcon?: string) => void;
  onRemoveFromHome?: (appId: string) => void;
  onReorderHomeApps?: (reorderedApps: AppItem[]) => void;
  onUninstallAppRequest?: (app: AppItem) => void;
  onOpenAddAppsModal?: () => void;
  onOpenWidgetManager?: () => void;
}

export const LauncherHomeScreen: React.FC<Props> = ({
  apps,
  gridConfig,
  clockStyle,
  clockConfig,
  widgets,
  liveEffect,
  accentColor,
  wallpaperUrl,
  onOpenDrawer,
  onOpenSettings,
  onOpenWallpaperStore,
  onOpenThemeEditor,
  onOpenClockPicker,
  onLockScreen,
  onLaunchApp,
  onUpdateWidget,
  onUpdateApp,
  onRemoveFromHome,
  onReorderHomeApps,
  onUninstallAppRequest,
  onOpenAddAppsModal,
  onOpenWidgetManager
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [contextMenuApp, setContextMenuApp] = useState<AppItem | null>(null);
  const [editAppLabel, setEditAppLabel] = useState('');

  // Drag and Drop state
  const [draggedApp, setDraggedApp] = useState<AppItem | null>(null);
  const [dragOverAppId, setDragOverAppId] = useState<string | null>(null);
  const [isOverRemoveZone, setIsOverRemoveZone] = useState(false);
  const [isOverUninstallZone, setIsOverUninstallZone] = useState(false);

  // Gesture handling refs
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const lastTapTime = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Sorted list of home apps by order
  const homeApps = apps
    .filter((a) => a.isCustomOnHome && !a.isHidden)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  // Touch & Gesture detection for home screen background
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;

    // Trigger edit mode on long press background
    longPressTimer.current = setTimeout(() => {
      tactileAudio.playClick(1400);
      setIsEditMode(true);
    }, 600);
  };

  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    // Swipe up: App Drawer
    if (deltaY < -55 && Math.abs(deltaX) < 80) {
      tactileAudio.playClick(2400);
      onOpenDrawer();
    }
    // Swipe down: App Drawer / Search
    else if (deltaY > 55 && Math.abs(deltaX) < 80) {
      tactileAudio.playClick(2000);
      onOpenDrawer();
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  // Double tap background to lock
  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('.app-icon-item') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('.home-widget-area')
    ) {
      return;
    }

    const now = Date.now();
    if (now - lastTapTime.current < 320) {
      tactileAudio.playLock();
      onLockScreen();
      lastTapTime.current = 0;
    } else {
      lastTapTime.current = now;
    }
  };

  const handleAppClick = (app: AppItem) => {
    if (isEditMode) {
      setEditingApp(app);
      setEditAppLabel(app.customLabel || app.name);
      return;
    }
    tactileAudio.playClick(1900);
    onLaunchApp(app);
  };

  const handleAppContextMenu = (e: React.MouseEvent, app: AppItem) => {
    e.preventDefault();
    e.stopPropagation();
    tactileAudio.playClick(1500);
    setContextMenuApp(app);
  };

  const saveAppEdit = () => {
    if (!editingApp) return;
    tactileAudio.playClick(2100);
    onUpdateApp?.(editingApp.id, editAppLabel.trim() || undefined);
    setEditingApp(null);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, app: AppItem) => {
    e.dataTransfer.setData('text/plain', app.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedApp(app);
    tactileAudio.playClick(1400);
  };

  const handleDragEnd = () => {
    setDraggedApp(null);
    setDragOverAppId(null);
    setIsOverRemoveZone(false);
    setIsOverUninstallZone(false);
  };

  const handleDragOverApp = (e: React.DragEvent, targetAppId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverAppId !== targetAppId) {
      setDragOverAppId(targetAppId);
    }
  };

  const handleDropOnApp = (e: React.DragEvent, targetAppId: string) => {
    e.preventDefault();
    if (!draggedApp || draggedApp.id === targetAppId) {
      handleDragEnd();
      return;
    }

    const currentHomeApps = [...homeApps];
    const sourceIdx = currentHomeApps.findIndex((a) => a.id === draggedApp.id);
    const targetIdx = currentHomeApps.findIndex((a) => a.id === targetAppId);

    if (sourceIdx !== -1 && targetIdx !== -1) {
      // Reorder items
      const [movedApp] = currentHomeApps.splice(sourceIdx, 1);
      currentHomeApps.splice(targetIdx, 0, movedApp);

      // Reassign order
      const reorderedList = currentHomeApps.map((a, idx) => ({
        ...a,
        order: idx
      }));

      tactileAudio.playClick(2400);
      onReorderHomeApps?.(reorderedList);
    }

    handleDragEnd();
  };

  const handleDropOnRemove = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedApp) {
      tactileAudio.playClick(1300);
      onRemoveFromHome?.(draggedApp.id);
    }
    handleDragEnd();
  };

  const handleDropOnUninstall = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedApp) {
      tactileAudio.playClick(1300);
      onUninstallAppRequest?.(draggedApp);
    }
    handleDragEnd();
  };

  // Step reordering for touch/click in Edit Mode
  const handleShiftApp = (appId: string, direction: 'LEFT' | 'RIGHT') => {
    const currentHomeApps = [...homeApps];
    const idx = currentHomeApps.findIndex((a) => a.id === appId);
    if (idx === -1) return;

    const targetIdx = direction === 'LEFT' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentHomeApps.length) return;

    const temp = currentHomeApps[idx];
    currentHomeApps[idx] = currentHomeApps[targetIdx];
    currentHomeApps[targetIdx] = temp;

    const reorderedList = currentHomeApps.map((a, i) => ({ ...a, order: i }));
    tactileAudio.playClick(2200);
    onReorderHomeApps?.(reorderedList);
  };

  const alignmentClass =
    gridConfig.alignment === 'top'
      ? 'justify-start'
      : gridConfig.alignment === 'bottom'
      ? 'justify-end'
      : 'justify-center';

  return (
    <div
      id="launcher_home_screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleContainerClick}
      onContextMenu={(e) => {
        // Background long-press / right-click activates edit mode
        if ((e.target as HTMLElement).closest('.app-icon-item')) return;
        e.preventDefault();
        tactileAudio.playClick(1500);
        setIsEditMode(true);
      }}
      className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden bg-black text-white"
    >
      {/* Dynamic Backgrounds */}
      <AmoledCanvasWallpaper
        effect={liveEffect}
        wallpaperUrl={wallpaperUrl}
        accentColor={accentColor}
      />

      {/* DRAG-AND-DROP TOP ACTION BAR (Appears dynamically while dragging) */}
      {draggedApp && (
        <div className="absolute top-2 inset-x-3 z-50 flex items-center gap-2 animate-fade-in">
          {/* Drop target: Remove from Home Screen */}
          <div
            id="drag_target_remove"
            onDragOver={(e) => {
              e.preventDefault();
              setIsOverRemoveZone(true);
            }}
            onDragLeave={() => setIsOverRemoveZone(false)}
            onDrop={handleDropOnRemove}
            className={`flex-1 py-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${
              isOverRemoveZone
                ? 'bg-red-950 border-red-500 text-white scale-102 shadow-xl shadow-red-950/50'
                : 'bg-neutral-950/90 border-neutral-700 text-neutral-300'
            }`}
          >
            <MinusCircle size={16} className={isOverRemoveZone ? 'text-red-400' : 'text-neutral-400'} />
            <span className="text-xs font-mono font-semibold">Remove from Home</span>
          </div>

          {/* Drop target: Uninstall App */}
          <div
            id="drag_target_uninstall"
            onDragOver={(e) => {
              e.preventDefault();
              setIsOverUninstallZone(true);
            }}
            onDragLeave={() => setIsOverUninstallZone(false)}
            onDrop={handleDropOnUninstall}
            className={`flex-1 py-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${
              isOverUninstallZone
                ? 'bg-red-600 border-red-400 text-white scale-102 shadow-xl shadow-red-900/50'
                : 'bg-neutral-950/90 border-neutral-700 text-neutral-300'
            }`}
          >
            <Trash2 size={16} className={isOverUninstallZone ? 'text-white' : 'text-neutral-400'} />
            <span className="text-xs font-mono font-semibold">Uninstall App</span>
          </div>
        </div>
      )}

      {/* Top Section: Clock & Quick Launch Shortcuts */}
      <div className="relative z-10 pt-4 px-5 flex items-start justify-between">
        <div
          className="cursor-pointer group relative"
          onClick={() => {
            tactileAudio.playClick(2100);
            if (onOpenClockPicker) {
              onOpenClockPicker();
            } else {
              onOpenThemeEditor();
            }
          }}
        >
          <FuturisticClock
            style={clockStyle}
            accentColor={accentColor}
            config={clockConfig}
            onClockClick={() => {
              tactileAudio.playClick(2100);
              if (onOpenClockPicker) {
                onOpenClockPicker();
              } else {
                onOpenThemeEditor();
              }
            }}
          />
          <div className="absolute -bottom-4 left-0 text-[8px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            ⚡ TAP CLOCK TO CHANGE STYLE
          </div>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <button
            id="btn_home_clock_picker"
            onClick={() => {
              tactileAudio.playClick(2100);
              if (onOpenClockPicker) {
                onOpenClockPicker();
              } else {
                onOpenThemeEditor();
              }
            }}
            className="p-2 rounded-full hover:bg-neutral-900/80 active:scale-95 transition-all text-neutral-300 hover:text-white"
            title="Change Clock Style"
          >
            <Clock size={18} strokeWidth={1.4} />
          </button>
          <button
            id="btn_home_search"
            onClick={() => {
              tactileAudio.playClick();
              onOpenDrawer();
            }}
            className="p-2 rounded-full hover:bg-neutral-900/80 active:scale-95 transition-all text-neutral-300 hover:text-white"
            title="App Search / All Apps"
          >
            <Search size={18} strokeWidth={1.4} />
          </button>
          <button
            id="btn_home_theme_studio"
            onClick={() => {
              tactileAudio.playClick();
              onOpenThemeEditor();
            }}
            className="p-2 rounded-full hover:bg-neutral-900/80 active:scale-95 transition-all text-neutral-300 hover:text-white"
            title="Theme Studio"
          >
            <Sliders size={18} strokeWidth={1.4} />
          </button>
          <button
            id="btn_home_settings"
            onClick={() => {
              tactileAudio.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-full hover:bg-neutral-900/80 active:scale-95 transition-all text-neutral-300 hover:text-white"
            title="Launcher Settings"
          >
            <SettingsIcon size={18} strokeWidth={1.4} />
          </button>
        </div>
      </div>

      {/* Widgets Section (with 1-tap remove & Add Widgets options) */}
      <div className="home-widget-area relative z-10 px-5">
        <HomeWidgets
          config={widgets}
          accentColor={accentColor}
          isEditMode={isEditMode}
          onOpenDrawer={onOpenDrawer}
          onUpdateWidget={onUpdateWidget}
          onRemoveWidget={(key) => onUpdateWidget?.({ [key]: false })}
          onOpenWidgetManager={onOpenWidgetManager}
        />
      </div>

      {/* Edit Mode Toolbar */}
      {isEditMode && (
        <div className="relative z-20 mx-4 py-2 px-3 rounded-2xl bg-neutral-950/95 border border-neutral-800 text-[11px] font-mono text-neutral-300 flex items-center justify-between animate-fade-in shadow-2xl">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                tactileAudio.playClick(2100);
                onOpenAddAppsModal?.();
              }}
              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 text-white rounded-lg flex items-center gap-1 text-[10px] font-semibold"
            >
              <Plus size={12} />
              <span>ADD APPS</span>
            </button>

            <button
              onClick={() => {
                tactileAudio.playClick(2100);
                onOpenWidgetManager?.();
              }}
              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 text-white rounded-lg flex items-center gap-1 text-[10px] font-semibold"
            >
              <Layers size={12} />
              <span>WIDGETS</span>
            </button>
          </div>

          <button
            onClick={() => setIsEditMode(false)}
            className="px-3 py-1 text-[10px] bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 active:scale-95 transition-all"
          >
            DONE
          </button>
        </div>
      )}

      {/* Applications Grid with Full Drag & Drop */}
      <div className={`relative z-10 flex-1 flex flex-col ${alignmentClass} px-4 py-2 overflow-y-auto no-scrollbar`}>
        {homeApps.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs font-mono text-neutral-400 mb-2">HOME SCREEN IS EMPTY</p>
            <button
              onClick={() => onOpenAddAppsModal?.()}
              className="px-4 py-2 bg-white text-black text-xs font-mono font-semibold rounded-xl hover:bg-neutral-200 flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Add Apps to Home Screen</span>
            </button>
          </div>
        ) : (
          <div
            className="w-full grid justify-items-center transition-all"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.columns}, minmax(0, 1fr))`,
              rowGap: `${gridConfig.iconSpacing + 10}px`,
              columnGap: `${gridConfig.iconSpacing}px`
            }}
          >
            {homeApps.slice(0, gridConfig.columns * gridConfig.rows).map((app, appIdx) => {
              const displayName = app.customLabel || app.name;
              const iconName = app.customIcon || app.icon;
              const isBeingDragged = draggedApp?.id === app.id;
              const isDropTarget = dragOverAppId === app.id && !isBeingDragged;

              return (
                <div
                  key={app.id}
                  id={`home_app_${app.id}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOverApp(e, app.id)}
                  onDrop={(e) => handleDropOnApp(e, app.id)}
                  className={`app-icon-item relative flex flex-col items-center cursor-pointer group transition-all duration-150 ${
                    isBeingDragged ? 'opacity-30 scale-90' : ''
                  } ${
                    isDropTarget
                      ? 'scale-108 ring-2 ring-white/80 rounded-2xl bg-neutral-900/60 p-1'
                      : ''
                  } active:scale-95`}
                  onClick={() => handleAppClick(app)}
                  onContextMenu={(e) => handleAppContextMenu(e, app)}
                >
                  <div
                    className="relative flex items-center justify-center transition-all duration-200"
                    style={{
                      width: `${gridConfig.iconSize}px`,
                      height: `${gridConfig.iconSize}px`
                    }}
                  >
                    <MonochromeIconRenderer
                      name={iconName}
                      size={gridConfig.iconSize}
                      styleType={gridConfig.iconStyle}
                      shape={gridConfig.iconShape}
                      strokeWidth={gridConfig.strokeWidth}
                      accentColor={gridConfig.accentColor || accentColor}
                      opacity={gridConfig.iconOpacity}
                    />

                    {/* Quick Remove "×" badge in Edit Mode */}
                    {isEditMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          tactileAudio.playClick(1400);
                          onRemoveFromHome?.(app.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-neutral-900 border border-neutral-700 hover:bg-red-600 hover:border-red-400 rounded-full flex items-center justify-center text-[10px] text-white transition-colors shadow-lg z-20"
                        title="Remove from home screen"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>

                  {gridConfig.showLabels && (
                    <span
                      className={`mt-1.5 text-[10px] text-neutral-300 tracking-tight text-center truncate max-w-[62px] ${
                        gridConfig.labelFont === 'mono'
                          ? 'font-mono'
                          : gridConfig.labelFont === 'serif'
                          ? 'font-serif'
                          : 'font-sans'
                      }`}
                    >
                      {displayName}
                    </span>
                  )}

                  {/* Reorder Shift Arrows in Edit Mode for effortless 1-tap reordering */}
                  {isEditMode && (
                    <div
                      className="flex items-center gap-1 mt-1 z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {appIdx > 0 && (
                        <button
                          onClick={() => handleShiftApp(app.id, 'LEFT')}
                          className="w-4 h-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded flex items-center justify-center text-[9px]"
                          title="Move left"
                        >
                          ‹
                        </button>
                      )}
                      {appIdx < homeApps.length - 1 && (
                        <button
                          onClick={() => handleShiftApp(app.id, 'RIGHT')}
                          className="w-4 h-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded flex items-center justify-center text-[9px]"
                          title="Move right"
                        >
                          ›
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right-Click / Long-Press Context Menu Popover */}
      {contextMenuApp && (
        <div
          className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setContextMenuApp(null)}
        >
          <div
            className="w-full max-w-xs bg-neutral-950 border border-neutral-800 rounded-3xl p-4 shadow-2xl space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-900">
              <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                <MonochromeIconRenderer
                  name={contextMenuApp.customIcon || contextMenuApp.icon}
                  size={26}
                  styleType={gridConfig.iconStyle}
                  shape={gridConfig.iconShape}
                  accentColor={accentColor}
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white truncate">
                  {contextMenuApp.customLabel || contextMenuApp.name}
                </h4>
                <p className="text-[10px] font-mono text-neutral-500 truncate">
                  {contextMenuApp.packageName}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              {/* Remove from Home Screen */}
              <button
                onClick={() => {
                  tactileAudio.playClick(1400);
                  onRemoveFromHome?.(contextMenuApp.id);
                  setContextMenuApp(null);
                }}
                className="w-full py-2 px-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-xs font-mono text-neutral-200 flex items-center gap-2.5 transition-colors text-left"
              >
                <MinusCircle size={15} className="text-neutral-400" />
                <span>Remove from Home Screen</span>
              </button>

              {/* Uninstall Application */}
              <button
                onClick={() => {
                  tactileAudio.playClick(1300);
                  const target = contextMenuApp;
                  setContextMenuApp(null);
                  onUninstallAppRequest?.(target);
                }}
                className="w-full py-2 px-3 rounded-xl bg-neutral-900/80 hover:bg-red-950/60 hover:text-red-300 text-xs font-mono text-red-400 flex items-center gap-2.5 transition-colors text-left"
              >
                <Trash2 size={15} />
                <span>Uninstall App</span>
              </button>

              {/* Customize Label / Icon */}
              <button
                onClick={() => {
                  tactileAudio.playClick();
                  setEditingApp(contextMenuApp);
                  setEditAppLabel(contextMenuApp.customLabel || contextMenuApp.name);
                  setContextMenuApp(null);
                }}
                className="w-full py-2 px-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-xs font-mono text-neutral-200 flex items-center gap-2.5 transition-colors text-left"
              >
                <Edit2 size={15} className="text-neutral-400" />
                <span>Customize Label</span>
              </button>

              {/* App Info */}
              <button
                onClick={() => {
                  tactileAudio.playClick();
                  alert(
                    `Application Details:\nName: ${contextMenuApp.name}\nPackage: ${contextMenuApp.packageName}\nCategory: ${contextMenuApp.category}\nSystem App: ${contextMenuApp.isSystem ? 'Yes' : 'No'}`
                  );
                  setContextMenuApp(null);
                }}
                className="w-full py-2 px-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-xs font-mono text-neutral-400 flex items-center gap-2.5 transition-colors text-left"
              >
                <Info size={15} />
                <span>App Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Edit Modal */}
      {editingApp && (
        <div
          className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm flex items-end justify-center p-4 animate-fade-in"
          onClick={() => setEditingApp(null)}
        >
          <div
            className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-3xl p-5 mb-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div className="flex items-center gap-3">
                <MonochromeIconRenderer
                  name={editingApp.customIcon || editingApp.icon}
                  size={32}
                  styleType={gridConfig.iconStyle}
                  shape={gridConfig.iconShape}
                  accentColor={accentColor}
                />
                <div>
                  <h4 className="text-xs font-semibold text-white">Customize Application</h4>
                  <p className="text-[10px] font-mono text-neutral-500">{editingApp.packageName}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingApp(null)}
                className="text-neutral-500 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-neutral-400">CUSTOM LABEL</label>
              <input
                type="text"
                value={editAppLabel}
                onChange={(e) => setEditAppLabel(e.target.value)}
                placeholder={editingApp.name}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={saveAppEdit}
                className="flex-1 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono flex items-center justify-center gap-1.5 hover:bg-neutral-200"
              >
                <Check size={14} />
                <span>SAVE</span>
              </button>
              <button
                onClick={() => {
                  tactileAudio.playClick(1400);
                  onRemoveFromHome?.(editingApp.id);
                  setEditingApp(null);
                }}
                className="py-2.5 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white hover:bg-neutral-800"
                title="Remove from home screen"
              >
                REMOVE
              </button>
              <button
                onClick={() => {
                  const target = editingApp;
                  setEditingApp(null);
                  onUninstallAppRequest?.(target);
                }}
                className="py-2.5 px-3 rounded-xl bg-neutral-900 border border-red-900/60 text-xs font-mono text-red-400 hover:bg-red-950/60"
                title="Uninstall app"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Dock / Swipe Up Indicator */}
      <div className="relative z-10 pb-4 flex flex-col items-center">
        <button
          id="btn_swipe_up_drawer"
          onClick={() => {
            tactileAudio.playClick(2400);
            onOpenDrawer();
          }}
          className="group flex flex-col items-center cursor-pointer hover:opacity-100 opacity-60 transition-opacity"
        >
          <ChevronUp size={16} className="text-neutral-400 group-hover:text-white transition-colors" />
          <div className="w-12 h-1 bg-neutral-700 group-hover:bg-white rounded-full transition-colors mt-0.5" />
        </button>
      </div>
    </div>
  );
};
