import React from 'react';
import { ClockStyleType } from '../types';
import { FuturisticClock } from './FuturisticClock';
import { tactileAudio } from '../utils/audioFeedback';
import { X, Check, Sparkles, SlidersHorizontal } from 'lucide-react';

interface Props {
  currentStyle: ClockStyleType;
  accentColor: string;
  onSelectStyle: (style: ClockStyleType) => void;
  onOpenClockEditor?: () => void;
  onClose: () => void;
}

interface ClockOption {
  id: ClockStyleType;
  name: string;
  category: string;
  description: string;
}

const CLOCK_OPTIONS: ClockOption[] = [
  {
    id: 'ITHEME_DUNE',
    name: 'iTheme Dune View',
    category: 'MATCHES SCREENSHOT',
    description: 'Ultra-clean high-fashion typography with seconds & telemetry pill'
  },
  {
    id: 'WIREFRAME_HOLLOW',
    name: 'Wireframe Hollow Outline',
    category: 'MATCHES SCREENSHOT',
    description: 'Hollow white outlined numerals matching the wireframe app icons'
  },
  {
    id: 'NOTHING_DOT',
    name: 'Nothing Dot Matrix',
    category: 'DOT MATRIX',
    description: 'Minimalist glyph dot-matrix modules with accent colon'
  },
  {
    id: 'NIAGARA_STACKED',
    name: 'Niagara Stacked Modern',
    category: 'MINIMAL',
    description: 'Clean time with side-by-side vertical date glance pill'
  },
  {
    id: 'GEOMETRIC_HUD',
    name: 'Cyber HUD Frame',
    category: 'SCI-FI HUD',
    description: 'Hairline box with live 120 FPS indicator & seconds counter'
  },
  {
    id: 'MINIMAL_DIGITAL',
    name: 'Minimal Digital (Swiss)',
    category: 'CLASSIC',
    description: 'Ultra-lightweight numerals with spaced tracking'
  },
  {
    id: 'CYBER_MONO',
    name: 'Cyber Terminal Monospace',
    category: 'DEVELOPER',
    description: 'Full live seconds with SYS status line'
  },
  {
    id: 'WORD_CLOCK',
    name: 'Typographic Word Clock',
    category: 'EDITORIAL',
    description: 'Literary time display ("IT IS TEN FORTY TWO")'
  },
  {
    id: 'ANALOG_OUTLINE',
    name: 'Minimalist Analog Dial',
    category: 'ANALOG',
    description: 'Hairline rotating clock hands on pure black'
  },
  {
    id: 'BAUHAUS_DUAL',
    name: 'Bauhaus Dual Block',
    category: 'ARCHITECTURAL',
    description: 'Stacked bold Bauhaus hour & minute blocks with dynamic red/black divider'
  },
  {
    id: 'CHRONO_RACING',
    name: 'Chrono Tachymeter',
    category: 'RACING',
    description: 'High-precision motorsports chronograph with live sector telemetry'
  },
  {
    id: 'OLED_GLITCH',
    name: 'Cyber Glitch Horizon',
    category: 'CYBERPUNK',
    description: 'Futuristic offset RGB glitch matrix with live 120 FPS counter'
  },
  {
    id: 'AURA_RING',
    name: 'Aura Radial Ring',
    category: 'RADIAL GAUGE',
    description: 'Dynamic orbital second gauge arc enclosing minimalist hours & minutes'
  },
  {
    id: 'ROMA_MINIMAL',
    name: 'Roma Luxury Swiss',
    category: 'LUXURY',
    description: 'Ultra-refined Roman serif watch typography with Geneva luxury emblem'
  },
  {
    id: 'SPLIT_PILL',
    name: 'Split Capsule Pill',
    category: 'MINIMAL PILL',
    description: 'Segmented dual high-contrast capsule badges for hours & minutes'
  },
  {
    id: 'SEGMENT_LED',
    name: 'Retro 7-Segment LED',
    category: 'RETRO',
    description: 'Sci-fi digital segment display'
  }
];

export const ClockStylePickerModal: React.FC<Props> = ({
  currentStyle,
  accentColor,
  onSelectStyle,
  onOpenClockEditor,
  onClose
}) => {
  return (
    <div
      id="clock_style_picker_modal"
      className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[85%] bg-neutral-950 border-t border-neutral-800 rounded-t-[32px] p-5 flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-12 h-1 bg-neutral-700 rounded-full mx-auto mb-3" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold tracking-wider text-white">
                CLOCK STYLE SELECTOR
              </h3>
              <p className="text-[10px] text-neutral-400">
                Tap any style to instantly apply
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable list of styles with LIVE previews */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 no-scrollbar">
          {CLOCK_OPTIONS.map((opt) => {
            const isSelected = currentStyle === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  tactileAudio.playClick(2400);
                  onSelectStyle(opt.id);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'border-white bg-neutral-900 shadow-md ring-1 ring-white/20'
                    : 'border-neutral-900 bg-neutral-950/80 hover:border-neutral-750 hover:bg-neutral-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                      {opt.category}
                    </span>
                    <span className="text-xs font-semibold text-white tracking-wide">
                      {opt.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                      <Check size={13} />
                      <span>ACTIVE</span>
                    </div>
                  )}
                </div>

                {/* Micro Live Preview of the Clock */}
                <div className="py-2 px-3 rounded-xl bg-black border border-neutral-900 flex items-center overflow-hidden">
                  <FuturisticClock
                    styleType={opt.id}
                    accentColor={accentColor}
                    className="transform scale-90 origin-left"
                  />
                </div>

                <p className="text-[10px] text-neutral-500 font-mono">
                  {opt.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-neutral-900 flex items-center gap-2">
          {onOpenClockEditor && (
            <button
              onClick={() => {
                onClose();
                onOpenClockEditor();
              }}
              className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs font-mono tracking-wider border border-neutral-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <SlidersHorizontal size={13} className="text-white" />
              <span>CUSTOMIZE FONTS & BLEND</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono tracking-wider hover:bg-neutral-200 transition-colors"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
