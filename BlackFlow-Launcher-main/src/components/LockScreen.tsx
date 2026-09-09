import React, { useState, useEffect, useRef } from 'react';
import { ClockStyleType, ClockCustomization } from '../types';
import { FuturisticClock } from './FuturisticClock';
import { tactileAudio } from '../utils/audioFeedback';
import {
  Fingerprint,
  BatteryCharging,
  CloudSun,
  ShieldCheck,
  ChevronUp,
  MessageSquare,
  Moon
} from 'lucide-react';

interface Props {
  clockStyle: ClockStyleType;
  clockConfig?: ClockCustomization;
  accentColor?: string;
  wallpaperUrl?: string;
  onUnlock: () => void;
}

export const LockScreen: React.FC<Props> = ({
  clockStyle,
  clockConfig,
  accentColor = '#FFFFFF',
  wallpaperUrl,
  onUnlock
}) => {
  const [time, setTime] = useState(new Date());
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAod, setIsAod] = useState(false);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const dayStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta < 0) {
      setSwipeOffset(delta);
      if (delta < -130) {
        tactileAudio.playUnlock();
        onUnlock();
      }
    }
  };

  const handleTouchEnd = () => {
    setSwipeOffset(0);
    startY.current = null;
  };

  const handleBiometricTap = () => {
    tactileAudio.playClick(1500);
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      tactileAudio.playUnlock();
      onUnlock();
    }, 380);
  };

  return (
    <div
      id="lock_screen_container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${swipeOffset}px)`
      }}
      className={`absolute inset-0 z-50 bg-[#000000] text-white flex flex-col justify-between p-7 select-none transition-transform duration-100 ease-out overflow-hidden ${
        isAod ? 'opacity-40 brightness-75' : ''
      }`}
    >
      {/* Dynamic Wallpaper Background */}
      {!isAod && wallpaperUrl && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
          style={{
            backgroundImage: `url(${wallpaperUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]" />
        </div>
      )}

      {/* Top Status & AOD toggle */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-mono">
          <CloudSun size={14} />
          <span>21°C CLEAR</span>
        </div>

        <button
          onClick={() => {
            tactileAudio.playClick();
            setIsAod(!isAod);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-[10px] font-mono text-neutral-400 hover:text-white"
        >
          <Moon size={11} />
          <span>{isAod ? 'AOD ON' : 'AOD PREVIEW'}</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-white">
          <BatteryCharging size={15} className="text-emerald-400 animate-pulse" />
          <span>92%</span>
        </div>
      </div>

      {/* Futuristic Digital Clock Display */}
      <div className="flex flex-col items-center justify-center my-auto">
        <FuturisticClock
          styleType={clockStyle}
          accentColor={accentColor}
          config={clockConfig}
          className="text-center"
        />

        {/* Minimalist Coexisting Notification Area */}
        {!isAod && (
          <div className="mt-10 w-full max-w-xs bg-neutral-950/90 border border-neutral-850 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-md">
            <div
              className="p-2 rounded-xl border flex items-center justify-center"
              style={{ borderColor: `${accentColor}33`, color: accentColor }}
            >
              <MessageSquare size={15} strokeWidth={1.5} />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">BlackFlow Kernel</span>
                <span className="text-[9px] text-neutral-500 font-mono">NOW</span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                Pure OLED Deep Black Active • 0.00W Idle Draw
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Biometric Fingerprint Area & Swipe Indicator */}
      <div className="flex flex-col items-center pb-3">
        <button
          id="btn_biometric_unlock"
          onClick={handleBiometricTap}
          className={`relative p-5 rounded-full border transition-all ${
            isAuthenticating
              ? 'border-white bg-white/20 scale-105'
              : 'border-neutral-800 hover:border-neutral-600 bg-neutral-950'
          }`}
          title="Tap to authenticate via Biometric / Fingerprint"
        >
          <Fingerprint
            size={34}
            strokeWidth={1.2}
            className={`transition-colors ${isAuthenticating ? 'text-white' : 'text-neutral-400'}`}
          />
          {isAuthenticating && (
            <div className="absolute inset-0 rounded-full border-2 border-white animate-ping" />
          )}
        </button>

        <div
          className="mt-3 flex flex-col items-center cursor-pointer"
          onClick={() => {
            tactileAudio.playUnlock();
            onUnlock();
          }}
        >
          <ChevronUp size={15} className="text-neutral-500 animate-bounce" />
          <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-500">
            SWIPE UP TO UNLOCK
          </span>
        </div>
      </div>
    </div>
  );
};
