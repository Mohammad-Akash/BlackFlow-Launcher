import React from 'react';
import { AppItem, IconStyleType, IconShapeType } from '../types';
import { MonochromeIconRenderer } from './MonochromeIconRenderer';
import { tactileAudio } from '../utils/audioFeedback';
import { Trash2, AlertTriangle, ShieldAlert, X, Check, Shield } from 'lucide-react';

interface Props {
  app: AppItem;
  iconStyle: IconStyleType;
  iconShape?: IconShapeType;
  accentColor?: string;
  onCancel: () => void;
  onConfirmUninstall: (appId: string) => void;
  onRemoveFromHome?: (appId: string) => void;
  onHideApp?: (appId: string) => void;
}

export const UninstallConfirmModal: React.FC<Props> = ({
  app,
  iconStyle,
  iconShape = 'NONE',
  accentColor = '#FFFFFF',
  onCancel,
  onConfirmUninstall,
  onRemoveFromHome,
  onHideApp
}) => {
  const isSystemApp = app.isSystem || app.category === 'SYSTEM';

  return (
    <div
      id="uninstall_modal_backdrop"
      className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-5 select-none animate-fade-in"
      onClick={onCancel}
    >
      <div
        id="uninstall_modal_card"
        className="w-full max-w-xs bg-neutral-950 border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Icon + App Details */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <MonochromeIconRenderer
                name={app.customIcon || app.icon}
                size={34}
                styleType={iconStyle}
                shape={iconShape}
                accentColor={accentColor}
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
              isSystemApp ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400' : 'bg-red-500/20 border border-red-500/40 text-red-400'
            }`}>
              {isSystemApp ? <Shield size={12} /> : <Trash2 size={12} />}
            </div>
          </div>

          <h3 className="text-base font-semibold text-white tracking-tight">
            {isSystemApp ? 'System Application' : 'Uninstall Application?'}
          </h3>
          <p className="text-xs font-mono text-neutral-400 mt-0.5">
            {app.customLabel || app.name}
          </p>
          <span className="text-[10px] font-mono text-neutral-600 mt-0.5 truncate max-w-[220px]">
            {app.packageName}
          </span>
        </div>

        {/* Content Body */}
        <div className="bg-neutral-900/60 border border-neutral-850 rounded-2xl p-3 text-left">
          {isSystemApp ? (
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-amber-400 text-xs font-mono">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                <span>CORE OS SYSTEM APP</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                This app is part of the Android system build and cannot be fully deleted. You can hide it from the drawer or remove it from the home screen grid.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-b border-neutral-800/80 pb-1.5">
                <span>STORAGE USED</span>
                <span className="text-white font-semibold">68.4 MB</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-b border-neutral-800/80 pb-1.5">
                <span>APP CACHE</span>
                <span className="text-white font-semibold">12.2 MB</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed pt-1 font-sans">
                Do you want to uninstall <strong className="text-white font-semibold">{app.name}</strong>? All offline data, preferences, and cache will be permanently cleared.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {isSystemApp ? (
            <>
              <button
                id="btn_remove_system_from_home"
                onClick={() => {
                  tactileAudio.playClick(2100);
                  onRemoveFromHome?.(app.id);
                  onCancel();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-mono font-medium text-white flex items-center justify-center gap-2 transition-colors active:scale-98"
              >
                <X size={14} />
                <span>Remove from Home Screen</span>
              </button>
              <button
                id="btn_hide_system_app"
                onClick={() => {
                  tactileAudio.playClick(2000);
                  onHideApp?.(app.id);
                  onCancel();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-mono font-medium text-neutral-300 flex items-center justify-center gap-2 transition-colors active:scale-98"
              >
                <ShieldAlert size={14} />
                <span>Hide in App Drawer</span>
              </button>
              <button
                onClick={() => {
                  tactileAudio.playClick();
                  onCancel();
                }}
                className="w-full py-2 text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="btn_cancel_uninstall"
                onClick={() => {
                  tactileAudio.playClick();
                  onCancel();
                }}
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn_confirm_uninstall"
                onClick={() => {
                  tactileAudio.playClick(1300);
                  onConfirmUninstall(app.id);
                  onCancel();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-red-950/40"
              >
                <Trash2 size={13} />
                <span>Uninstall</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
