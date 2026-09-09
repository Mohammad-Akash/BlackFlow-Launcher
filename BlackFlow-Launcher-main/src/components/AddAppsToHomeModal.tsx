import React, { useState, useMemo } from 'react';
import { AppItem, IconStyleType, IconShapeType } from '../types';
import { MonochromeIconRenderer } from './MonochromeIconRenderer';
import { tactileAudio } from '../utils/audioFeedback';
import { Search, X, Check, Plus, Minus, Smartphone } from 'lucide-react';

interface Props {
  allApps: AppItem[];
  iconStyle: IconStyleType;
  iconShape?: IconShapeType;
  accentColor?: string;
  onToggleHomeApp: (appId: string) => void;
  onClose: () => void;
}

export const AddAppsToHomeModal: React.FC<Props> = ({
  allApps,
  iconStyle,
  iconShape = 'NONE',
  accentColor = '#FFFFFF',
  onToggleHomeApp,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'NOT_ON_HOME' | 'ON_HOME'>('NOT_ON_HOME');

  const filteredApps = useMemo(() => {
    return allApps
      .filter((a) => !a.isHidden)
      .filter((a) => {
        if (filter === 'NOT_ON_HOME') return !a.isCustomOnHome;
        if (filter === 'ON_HOME') return Boolean(a.isCustomOnHome);
        return true;
      })
      .filter((a) => {
        const q = searchQuery.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          (a.customLabel && a.customLabel.toLowerCase().includes(q)) ||
          a.packageName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allApps, searchQuery, filter]);

  const onHomeCount = allApps.filter((a) => a.isCustomOnHome && !a.isHidden).length;

  return (
    <div
      id="add_apps_modal_backdrop"
      className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end select-none animate-fade-in"
      onClick={onClose}
    >
      <div
        id="add_apps_modal_sheet"
        className="w-full max-h-[85%] bg-neutral-950 border-t border-neutral-800 rounded-t-3xl p-5 flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-neutral-800 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-tight">
                Add Apps to Home Screen
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                {onHomeCount} On Home
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
              Tap any app to add or remove from your home grid
            </p>
          </div>

          <button
            onClick={() => {
              tactileAudio.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="pt-3 pb-2 space-y-2">
          <div className="flex items-center bg-neutral-900/80 border border-neutral-800 rounded-xl px-3 py-1.5">
            <Search size={15} className="text-neutral-500 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps to add..."
              className="w-full bg-transparent text-xs text-white placeholder:text-neutral-600 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-neutral-500 hover:text-white p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'NOT_ON_HOME', label: 'Available to Add' },
              { id: 'ALL', label: 'All Apps' },
              { id: 'ON_HOME', label: 'Already on Home' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  tactileAudio.playClick(2100);
                  setFilter(f.id as any);
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all ${
                  filter === f.id
                    ? 'bg-white text-black font-semibold'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-850 hover:text-neutral-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid/List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1.5 no-scrollbar">
          {filteredApps.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-neutral-500 text-xs font-mono">
              <Smartphone size={24} className="mb-2 opacity-40" />
              <span>No applications found</span>
            </div>
          ) : (
            filteredApps.map((app) => {
              const isOnHome = Boolean(app.isCustomOnHome);

              return (
                <div
                  key={app.id}
                  id={`add_app_item_${app.id}`}
                  onClick={() => {
                    tactileAudio.playClick(isOnHome ? 1700 : 2400);
                    onToggleHomeApp(app.id);
                  }}
                  className={`w-full p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isOnHome
                      ? 'bg-neutral-900/90 border-neutral-700'
                      : 'bg-neutral-950/60 border-neutral-900 hover:bg-neutral-900/40 hover:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center shrink-0">
                      <MonochromeIconRenderer
                        name={app.customIcon || app.icon}
                        size={24}
                        styleType={iconStyle}
                        shape={iconShape}
                        accentColor={accentColor}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {app.customLabel || app.name}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500 truncate">
                        {app.packageName}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all shrink-0 ${
                      isOnHome
                        ? 'bg-neutral-800 hover:bg-red-950/60 hover:text-red-400 text-white'
                        : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                  >
                    {isOnHome ? (
                      <>
                        <Minus size={13} />
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
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
          <span className="text-[10px] font-mono text-neutral-500">
            {onHomeCount} shortcuts active on home
          </span>
          <button
            onClick={() => {
              tactileAudio.playClick(2100);
              onClose();
            }}
            className="py-2 px-5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
