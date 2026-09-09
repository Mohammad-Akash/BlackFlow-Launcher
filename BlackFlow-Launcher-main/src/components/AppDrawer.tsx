import React, { useState, useMemo } from 'react';
import { AppItem, IconStyleType, IconShapeType } from '../types';
import { MonochromeIconRenderer } from './MonochromeIconRenderer';
import { tactileAudio } from '../utils/audioFeedback';
import {
  Search,
  ArrowLeft,
  X,
  Star,
  EyeOff,
  PlusCircle,
  MinusCircle,
  Info,
  SlidersHorizontal,
  MoreVertical,
  ChevronDown,
  LayoutGrid,
  Trash2
} from 'lucide-react';

interface Props {
  apps: AppItem[];
  iconStyle: IconStyleType;
  iconShape?: IconShapeType;
  accentColor?: string;
  onClose: () => void;
  onLaunchApp: (app: AppItem) => void;
  onToggleHomePin: (appId: string) => void;
  onToggleHideApp: (appId: string) => void;
  onUninstallAppRequest?: (app: AppItem) => void;
}

export const AppDrawer: React.FC<Props> = ({
  apps,
  iconStyle,
  iconShape = 'NONE',
  accentColor = '#FFFFFF',
  onClose,
  onLaunchApp,
  onToggleHomePin,
  onToggleHideApp,
  onUninstallAppRequest
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeAppMenu, setActiveAppMenu] = useState<AppItem | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [drawerColumns, setDrawerColumns] = useState<4 | 5>(4);

  const categories = ['ALL', 'SYSTEM', 'TOOLS', 'DEVELOPER', 'SOCIAL', 'MEDIA'];

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => !app.isHidden)
      .filter((app) => {
        const matchesQuery =
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'ALL' || app.category === selectedCategory;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [apps, searchQuery, selectedCategory]);

  return (
    <div
      id="app_drawer_container"
      className="absolute inset-0 z-30 bg-[#000000] text-white flex flex-col select-none overflow-hidden animate-fade-in"
    >
      {/* Top Header - Matches the user reference image: "All apps" on left, Search & 3-dots on right */}
      {!isSearching ? (
        <div className="pt-5 px-5 pb-2 flex items-center justify-between border-b border-neutral-900/80">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-normal tracking-tight text-white font-sans">
              All apps
            </h1>
            <span className="text-[10px] font-mono text-neutral-500 mt-1">
              ({filteredApps.length})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="btn_drawer_search_toggle"
              onClick={() => {
                tactileAudio.playClick();
                setIsSearching(true);
              }}
              className="p-2 rounded-full hover:bg-neutral-900 active:scale-95 transition-all text-neutral-300 hover:text-white"
              title="Search"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            <div className="relative">
              <button
                id="btn_drawer_more_options"
                onClick={() => {
                  tactileAudio.playClick();
                  setShowOptionsMenu(!showOptionsMenu);
                }}
                className="p-2 rounded-full hover:bg-neutral-900 active:scale-95 transition-all text-neutral-300 hover:text-white"
                title="Options"
              >
                <MoreVertical size={19} strokeWidth={1.5} />
              </button>

              {/* Options Popover */}
              {showOptionsMenu && (
                <div
                  className="absolute right-0 top-11 w-48 bg-neutral-950 border border-neutral-850 rounded-2xl p-2 shadow-2xl z-50 animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      setDrawerColumns(drawerColumns === 4 ? 5 : 4);
                      setShowOptionsMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-all"
                  >
                    <span>Grid Columns</span>
                    <span className="font-bold text-white">{drawerColumns} Cols</span>
                  </button>
                  <button
                    onClick={() => {
                      tactileAudio.playClick();
                      setShowOptionsMenu(false);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-all"
                  >
                    <ChevronDown size={14} />
                    <span>Back to Home</span>
                  </button>
                </div>
              )}
            </div>

            <button
              id="btn_drawer_close"
              onClick={() => {
                tactileAudio.playClick();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-neutral-900 active:scale-95 transition-all text-neutral-400 hover:text-white ml-0.5"
              title="Close Drawer"
            >
              <ChevronDown size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      ) : (
        /* Search Active Bar */
        <div className="pt-4 px-4 pb-2 border-b border-neutral-900 flex items-center gap-2">
          <button
            onClick={() => {
              tactileAudio.playClick();
              setIsSearching(false);
              setSearchQuery('');
            }}
            className="p-2 rounded-full hover:bg-neutral-900 text-neutral-300 hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex-1 flex items-center bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5">
            <Search size={15} className="text-neutral-500 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="w-full bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none font-sans"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => {
                  tactileAudio.playClick();
                  setSearchQuery('');
                }}
                className="text-neutral-500 hover:text-white p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 px-5 py-2.5 overflow-x-auto no-scrollbar border-b border-neutral-900/40">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                tactileAudio.playClick(2200);
                setSelectedCategory(cat);
              }}
              className={`px-2.5 py-1 rounded-full text-[9px] font-mono tracking-wider transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-white text-black font-semibold'
                  : 'bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Applications Grid - Clean white vector outline icons matching reference photo */}
      <div className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar">
        {filteredApps.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-neutral-500 text-xs font-mono">
            <span>NO APPLICATIONS FOUND</span>
          </div>
        ) : (
          <div
            className={`grid gap-y-5 justify-items-center ${
              drawerColumns === 5 ? 'grid-cols-5 gap-x-1' : 'grid-cols-4 gap-x-2'
            }`}
          >
            {filteredApps.map((app) => (
              <div
                key={app.id}
                id={`drawer_app_${app.id}`}
                className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform"
                onClick={() => {
                  tactileAudio.playClick(1900);
                  onLaunchApp(app);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  tactileAudio.playClick(1600);
                  setActiveAppMenu(app);
                }}
              >
                <div
                  className={`flex items-center justify-center transition-all ${
                    iconShape === 'NONE'
                      ? 'w-12 h-12'
                      : 'w-13 h-13 rounded-2xl bg-neutral-950 border border-neutral-900/80 group-hover:border-neutral-700'
                  }`}
                >
                  <MonochromeIconRenderer
                    name={app.customIcon || app.icon}
                    size={iconShape === 'NONE' ? (drawerColumns === 5 ? 26 : 30) : 26}
                    styleType={iconStyle}
                    shape={iconShape}
                    accentColor={accentColor}
                  />
                </div>
                <span className="mt-1 text-[10px] font-sans text-neutral-300 text-center truncate max-w-[66px] tracking-tight">
                  {app.customLabel || app.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* App Context Menu Modal */}
      {activeAppMenu && (
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-end justify-center p-4 animate-fade-in"
          onClick={() => setActiveAppMenu(null)}
        >
          <div
            className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-900">
              <MonochromeIconRenderer
                name={activeAppMenu.customIcon || activeAppMenu.icon}
                size={34}
                styleType={iconStyle}
                shape={iconShape}
                accentColor={accentColor}
              />
              <div>
                <h4 className="text-sm font-semibold text-white">{activeAppMenu.customLabel || activeAppMenu.name}</h4>
                <p className="text-[11px] text-neutral-500 font-mono">{activeAppMenu.packageName}</p>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <button
                id={`btn_drawer_toggle_home_${activeAppMenu.id}`}
                onClick={() => {
                  tactileAudio.playClick(activeAppMenu.isCustomOnHome ? 1400 : 2200);
                  onToggleHomePin(activeAppMenu.id);
                  setActiveAppMenu(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-neutral-200 hover:bg-neutral-900 rounded-xl text-left transition-colors"
              >
                {activeAppMenu.isCustomOnHome ? (
                  <>
                    <MinusCircle size={16} className="text-neutral-400" />
                    <span>Remove from Home Screen</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={16} className="text-white" />
                    <span>Add to Home Screen</span>
                  </>
                )}
              </button>

              <button
                id={`btn_drawer_uninstall_${activeAppMenu.id}`}
                onClick={() => {
                  tactileAudio.playClick(1300);
                  const target = activeAppMenu;
                  setActiveAppMenu(null);
                  onUninstallAppRequest?.(target);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-400 hover:bg-red-950/40 rounded-xl text-left transition-colors"
              >
                <Trash2 size={16} />
                <span>Uninstall App</span>
              </button>

              <button
                onClick={() => {
                  tactileAudio.playClick();
                  onToggleHideApp(activeAppMenu.id);
                  setActiveAppMenu(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-neutral-200 hover:bg-neutral-900 rounded-xl text-left transition-colors"
              >
                <EyeOff size={16} />
                <span>Hide Application</span>
              </button>
              <button
                onClick={() => {
                  tactileAudio.playClick();
                  alert(`Package Info:\n${activeAppMenu.name}\n${activeAppMenu.packageName}\nTarget SDK: 35 (Android 15)\nSystem Component: ${activeAppMenu.isSystem ? 'Yes' : 'No'}`);
                  setActiveAppMenu(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl text-left transition-colors"
              >
                <Info size={16} />
                <span>App Info</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
