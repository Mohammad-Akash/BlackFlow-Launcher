import React, { useState, useEffect } from 'react';
import { ClockStyleType, ClockCustomization, ClockFontFamily } from '../types';

interface Props {
  styleType: ClockStyleType;
  accentColor?: string;
  config?: ClockCustomization;
  className?: string;
  onClick?: () => void;
}

export const FuturisticClock: React.FC<Props> = ({
  styleType,
  accentColor = '#FFFFFF',
  config,
  className = '',
  onClick
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const is24 = config?.is24Hour ?? false;
  const hoursRaw = is24 ? time.getHours() : time.getHours() % 12 || 12;
  const hours = hoursRaw.toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
  const dayStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();

  const getFontFamilyCss = (font?: ClockFontFamily) => {
    switch (font) {
      case 'mono':
        return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      case 'serif':
        return 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
      case 'display':
        return '"Montserrat", "Impact", "Arial Black", system-ui, sans-serif';
      case 'tech':
        return '"Space Mono", "Share Tech Mono", "Courier New", monospace';
      case 'condensed':
        return '"Oswald", "Arial Narrow", "Franklin Gothic Medium", sans-serif-condensed, sans-serif';
      case 'sans':
      default:
        return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    }
  };

  const getDigitStyles = (defaultFontSize = 48, defaultWeight = 200, defaultStroke = false): React.CSSProperties => {
    const font = config?.fontFamily || 'sans';
    const weight = config?.fontWeight ?? defaultWeight;
    const size = config?.fontSize ?? defaultFontSize;
    const spacing = config?.letterSpacing ?? (font === 'sans' ? -1.5 : 1);
    const mode = config?.colorBlendMode ?? (defaultStroke ? 'wireframe_stroke' : 'normal');
    const color = config?.primaryColor || '#FFFFFF';
    const opacity = config?.primaryOpacity ?? 1;

    const base: React.CSSProperties = {
      fontFamily: getFontFamilyCss(font),
      fontWeight: weight,
      fontSize: `${size}px`,
      letterSpacing: `${spacing}px`,
      lineHeight: 1,
      opacity
    };

    switch (mode) {
      case 'wireframe_stroke':
        return {
          ...base,
          WebkitTextStroke: `${config?.strokeWidth ?? 1.8}px ${color}`,
          color: 'transparent'
        };
      case 'screen':
        return {
          ...base,
          color,
          mixBlendMode: 'screen'
        };
      case 'overlay':
        return {
          ...base,
          color,
          mixBlendMode: 'overlay'
        };
      case 'luminosity':
        return {
          ...base,
          color,
          mixBlendMode: 'luminosity'
        };
      case 'neon_glow':
        return {
          ...base,
          color,
          textShadow: `0 0 10px ${config?.glowColor || accentColor}ee, 0 0 24px ${config?.glowColor || accentColor}66`
        };
      case 'gradient_fade':
        return {
          ...base,
          background: `linear-gradient(180deg, ${color} 20%, rgba(255,255,255,0.18) 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        };
      case 'cyber_matrix':
        return {
          ...base,
          color,
          textShadow: '2px 0 0 rgba(255, 0, 80, 0.7), -2px 0 0 rgba(0, 240, 255, 0.7)'
        };
      case 'normal':
      default:
        return {
          ...base,
          color
        };
    }
  };

  const getSecondaryStyles = (defaultSize = 10, defaultColor = '#A3A3A3'): React.CSSProperties => {
    const size = config?.secondaryTextSize ?? defaultSize;
    const weight = config?.secondaryFontWeight ?? 400;
    const color = config?.secondaryColor || defaultColor;
    const trackingMap = {
      normal: '0.06em',
      wide: '0.18em',
      widest: '0.3em'
    };
    const tracking = trackingMap[config?.secondaryTracking || 'wide'];

    return {
      fontSize: `${size}px`,
      fontWeight: weight,
      letterSpacing: tracking,
      color
    };
  };

  const showSeconds = config?.showSeconds ?? true;
  const showDate = config?.showDate ?? true;
  const showTelemetry = config?.showTelemetry ?? true;

  // Word Clock mapping
  const numToWords: Record<number, string> = {
    0: 'ZERO', 1: 'ONE', 2: 'TWO', 3: 'THREE', 4: 'FOUR',
    5: 'FIVE', 6: 'SIX', 7: 'SEVEN', 8: 'EIGHT', 9: 'NINE',
    10: 'TEN', 11: 'ELEVEN', 12: 'TWELVE', 13: 'THIRTEEN', 14: 'FOURTEEN',
    15: 'FIFTEEN', 16: 'SIXTEEN', 17: 'SEVENTEEN', 18: 'EIGHTEEN', 19: 'NINETEEN',
    20: 'TWENTY', 21: 'TWENTY ONE', 22: 'TWENTY TWO', 23: 'TWENTY THREE',
    30: 'THIRTY', 40: 'FORTY', 50: 'FIFTY'
  };

  const getMinuteWords = (m: number) => {
    if (m === 0) return "O'CLOCK";
    if (numToWords[m]) return numToWords[m];
    const tens = Math.floor(m / 10) * 10;
    const ones = m % 10;
    return `${numToWords[tens]} ${numToWords[ones]}`;
  };

  // iTheme Dune View Minimalist (from the screenshot aesthetic)
  if (styleType === 'ITHEME_DUNE') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none text-left group ${className}`}>
        <div className="flex items-baseline gap-2">
          <span style={getDigitStyles(50, 200)}>{hours}</span>
          <span
            className="text-3xl font-thin text-neutral-600 group-hover:text-white transition-colors"
            style={{ fontSize: `${(config?.fontSize ?? 50) * 0.65}px` }}
          >
            :
          </span>
          <span style={getDigitStyles(50, 200)}>{minutes}</span>
          {showSeconds && (
            <span
              className="font-mono ml-1"
              style={{
                fontSize: `${Math.max(9, (config?.secondaryTextSize ?? 10) + 1)}px`,
                color: config?.glowColor || accentColor
              }}
            >
              {seconds}s
            </span>
          )}
          {!is24 && (
            <span
              className="font-mono text-[9px] uppercase ml-1 opacity-70"
              style={{ color: config?.secondaryColor || '#888888' }}
            >
              {ampm}
            </span>
          )}
        </div>
        {(showDate || showTelemetry) && (
          <div
            className="mt-1.5 flex items-center gap-2 font-mono"
            style={getSecondaryStyles(10, '#A3A3A3')}
          >
            {showDate && <span>{dayStr}</span>}
            {showDate && showTelemetry && <span className="w-1 h-1 rounded-full bg-neutral-700" />}
            {showTelemetry && <span className="text-neutral-300">DUNE VIEW</span>}
            {showTelemetry && <span className="w-1 h-1 rounded-full bg-neutral-700" />}
            {showTelemetry && <span className="text-emerald-400">88%</span>}
          </div>
        )}
      </div>
    );
  }

  // Wireframe Hollow Outline Clock (Matching wireframe icons)
  if (styleType === 'WIREFRAME_HOLLOW') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none text-left group ${className}`}>
        <div className="flex items-center gap-1.5">
          <span style={getDigitStyles(50, 900, true)}>{hours}</span>
          <span
            className="font-light text-neutral-500 animate-pulse"
            style={{ fontSize: `${(config?.fontSize ?? 50) * 0.6}px`, color: config?.glowColor || accentColor }}
          >
            :
          </span>
          <span style={getDigitStyles(50, 900, true)}>{minutes}</span>
          {showSeconds && (
            <span
              className="font-mono ml-1.5 text-xs"
              style={{ color: config?.glowColor || accentColor }}
            >
              .{seconds}
            </span>
          )}
        </div>
        {(showDate || showTelemetry) && (
          <div
            className="mt-1.5 flex items-center gap-1.5 font-mono"
            style={getSecondaryStyles(10, '#A3A3A3')}
          >
            <span
              className="px-1.5 py-0.5 rounded border border-neutral-800 text-[9px]"
              style={{ borderColor: `${config?.primaryColor || '#FFFFFF'}33` }}
            >
              OUTLINE
            </span>
            {showDate && <span>{dayStr}</span>}
          </div>
        )}
      </div>
    );
  }

  // Nothing OS Dot Matrix Clock
  if (styleType === 'NOTHING_DOT') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none text-left ${className}`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span
              className="bg-neutral-900/90 px-2.5 py-1 rounded-lg border border-neutral-800"
              style={getDigitStyles(40, 300)}
            >
              {hours}
            </span>
            <span
              className="mx-1.5 animate-pulse font-bold"
              style={{
                fontSize: `${(config?.fontSize ?? 40) * 0.7}px`,
                color: config?.glowColor || accentColor
              }}
            >
              :
            </span>
            <span
              className="bg-neutral-900/90 px-2.5 py-1 rounded-lg border border-neutral-800"
              style={getDigitStyles(40, 300)}
            >
              {minutes}
            </span>
          </div>
        </div>
        {showDate && (
          <div
            className="mt-2 flex items-center gap-2 font-mono"
            style={getSecondaryStyles(10, '#A3A3A3')}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: config?.glowColor || accentColor }}
            />
            <span>GLYPH // {dayStr}</span>
            {showSeconds && <span>:{seconds}</span>}
          </div>
        )}
      </div>
    );
  }

  // Niagara Stacked Clock
  if (styleType === 'NIAGARA_STACKED') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none text-left ${className}`}>
        <div className="flex items-baseline gap-3">
          <div style={getDigitStyles(44, 300)}>
            {hours}:{minutes}
            {showSeconds && (
              <span
                className="text-sm font-mono ml-1 opacity-70"
                style={{ color: config?.glowColor || accentColor }}
              >
                :{seconds}
              </span>
            )}
          </div>
          {showDate && (
            <div
              className="border-l border-neutral-800 pl-2 font-mono"
              style={getSecondaryStyles(11, '#888888')}
            >
              <div>{time.toLocaleDateString('en-US', { weekday: 'long' })}</div>
              <div className="text-neutral-200 font-semibold">
                {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Futuristic Geometric HUD Widget
  if (styleType === 'GEOMETRIC_HUD') {
    return (
      <div
        onClick={onClick}
        className={`cursor-pointer select-none text-left p-3 rounded-xl border border-neutral-850 bg-neutral-950/60 backdrop-blur-sm ${className}`}
      >
        <div
          className="flex items-center justify-between font-mono mb-1"
          style={getSecondaryStyles(9, '#737373')}
        >
          <span className="tracking-widest">KOTLIN.COMPOSE.CORE</span>
          <span style={{ color: config?.glowColor || accentColor }}>120 FPS</span>
        </div>
        <div className="flex items-baseline justify-between">
          <div style={getDigitStyles(36, 300)}>
            {hours}:{minutes}
            {showSeconds && <span className="text-sm opacity-60">:{seconds}</span>}
          </div>
          {showDate && (
            <div className="text-right font-mono" style={getSecondaryStyles(10, '#A3A3A3')}>
              <div>{dayStr}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (styleType === 'WORD_CLOCK') {
    const hrNum = time.getHours() % 12 || 12;
    const hrWord = numToWords[hrNum] || '';
    const minWord = getMinuteWords(time.getMinutes());

    return (
      <div onClick={onClick} className={`cursor-pointer select-none ${className}`}>
        <div
          className="font-mono mb-1"
          style={getSecondaryStyles(10, '#737373')}
        >
          CURRENT // TIME
        </div>
        <div
          className="leading-tight"
          style={{
            ...getDigitStyles(26, 300),
            letterSpacing: '0.02em'
          }}
        >
          IT IS <span style={{ color: config?.glowColor || accentColor }}>{hrWord}</span> {minWord}
        </div>
        {showDate && (
          <div
            className="font-mono mt-1.5"
            style={getSecondaryStyles(10, '#A3A3A3')}
          >
            {dayStr}
          </div>
        )}
      </div>
    );
  }

  if (styleType === 'ANALOG_OUTLINE') {
    const secAngle = (time.getSeconds() / 60) * 360;
    const minAngle = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
    const hrAngle = (((time.getHours() % 12) + time.getMinutes() / 60) / 12) * 360;

    return (
      <div onClick={onClick} className={`cursor-pointer select-none flex items-center gap-4 ${className}`}>
        <div className="relative w-16 h-16 rounded-full border border-neutral-800 flex items-center justify-center">
          <div
            className="absolute w-0.5 h-4 bg-white origin-bottom bottom-1/2 left-[calc(50%-1px)] rounded-full"
            style={{ transform: `rotate(${hrAngle}deg)` }}
          />
          <div
            className="absolute w-0.5 h-6 bg-neutral-300 origin-bottom bottom-1/2 left-[calc(50%-1px)] rounded-full"
            style={{ transform: `rotate(${minAngle}deg)` }}
          />
          <div
            className="absolute w-[1px] h-7 origin-bottom bottom-1/2 left-[calc(50%-0.5px)]"
            style={{ transform: `rotate(${secAngle}deg)`, backgroundColor: config?.glowColor || accentColor }}
          />
          <div className="w-1.5 h-1.5 rounded-full bg-white z-10" />
        </div>
        <div>
          <div style={getDigitStyles(26, 300)}>{hours}:{minutes}</div>
          {showDate && (
            <div className="font-mono mt-0.5" style={getSecondaryStyles(10, '#A3A3A3')}>
              {dayStr}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (styleType === 'SEGMENT_LED') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none ${className}`}>
        <div style={getDigitStyles(42, 300)}>
          {hours}
          <span className="animate-pulse" style={{ color: config?.glowColor || accentColor }}>:</span>
          {minutes}
          {showSeconds && <span className="text-lg opacity-60">:{seconds}</span>}
        </div>
        {showDate && (
          <div className="font-mono mt-1" style={getSecondaryStyles(10, '#A3A3A3')}>
            {dayStr}
          </div>
        )}
      </div>
    );
  }

  if (styleType === 'DUAL_LINE') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none text-left ${className}`}>
        <div style={getDigitStyles(48, 200)}>{hours}</div>
        <div style={{ ...getDigitStyles(48, 200), opacity: 0.65 }}>{minutes}</div>
        {showDate && (
          <div className="mt-1.5 font-mono" style={getSecondaryStyles(10, '#A3A3A3')}>
            {dayStr}
          </div>
        )}
      </div>
    );
  }

  if (styleType === 'CYBER_MONO') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none ${className}`}>
        <div style={getDigitStyles(36, 300)}>
          {hours}:{minutes}
          {showSeconds && <span className="text-xl opacity-60">:{seconds}</span>}
        </div>
        {showDate && (
          <div className="font-mono mt-1" style={getSecondaryStyles(10, '#A3A3A3')}>
            SYS // {dayStr}
          </div>
        )}
      </div>
    );
  }

  if (styleType === 'VERTICAL_DIGIT') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none flex items-baseline gap-2 ${className}`}>
        <span style={getDigitStyles(40, 200)}>{hours}</span>
        <span className="text-xl font-light text-neutral-600">:</span>
        <span style={getDigitStyles(40, 200)}>{minutes}</span>
        {showDate && (
          <span className="font-mono ml-1" style={getSecondaryStyles(10, '#A3A3A3')}>
            {dayStr}
          </span>
        )}
      </div>
    );
  }

  // 1. BAUHAUS DUAL BLOCK (Architectural Modernist)
  if (styleType === 'BAUHAUS_DUAL') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none text-left group ${className}`}>
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-black tracking-widest">
                HR
              </span>
              <span style={getDigitStyles(46, 800)}>{hours}</span>
            </div>
            <div className="flex items-center gap-1.5 -mt-1">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 tracking-widest">
                MN
              </span>
              <span style={{ ...getDigitStyles(46, 200), color: config?.glowColor || accentColor }}>
                {minutes}
              </span>
            </div>
          </div>
          <div className="h-14 w-[2px] bg-gradient-to-b from-white via-neutral-700 to-transparent mx-1" />
          <div className="flex flex-col justify-between py-1 font-mono">
            {showSeconds && (
              <span
                className="text-xs font-bold"
                style={{ color: config?.glowColor || accentColor }}
              >
                .{seconds}s
              </span>
            )}
            <span className="text-[9px] tracking-widest text-neutral-400">BAUHAUS</span>
            {showDate && (
              <span className="text-[10px] text-neutral-300 font-semibold">{dayStr}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. CHRONO RACING TACHYMETER
  if (styleType === 'CHRONO_RACING') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none text-left p-3 rounded-2xl bg-neutral-950/80 border border-neutral-850 backdrop-blur-sm ${className}`}>
        <div className="flex items-center justify-between font-mono text-[9px] mb-1.5 text-neutral-400 border-b border-neutral-900 pb-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-white font-bold tracking-widest">CHRONO TACHY</span>
          </span>
          <span className="tracking-widest" style={{ color: config?.glowColor || accentColor }}>
            SPLIT 00:{seconds}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1 font-mono">
            <span style={getDigitStyles(42, 700)}>{hours}</span>
            <span className="text-xl text-neutral-600 font-bold">:</span>
            <span style={getDigitStyles(42, 700)}>{minutes}</span>
            <span
              className="text-sm font-bold ml-1"
              style={{ color: config?.glowColor || accentColor }}
            >
              :{seconds}
            </span>
          </div>
          <div className="text-right font-mono">
            <div className="text-[11px] font-bold text-white tracking-wider">{dayStr}</div>
            <div className="text-[9px] text-neutral-500">SECTOR 01 // OK</div>
          </div>
        </div>
      </div>
    );
  }

  // 3. OLED CYBER GLITCH HORIZON
  if (styleType === 'OLED_GLITCH') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none text-left group ${className}`}>
        <div className="relative">
          <div
            className="relative z-10 flex items-baseline gap-1"
            style={{
              textShadow: '1.5px 0 0 rgba(255,0,80,0.8), -1.5px 0 0 rgba(0,240,255,0.8)'
            }}
          >
            <span style={getDigitStyles(48, 700)}>{hours}</span>
            <span className="text-2xl text-neutral-400 animate-pulse">:</span>
            <span style={getDigitStyles(48, 700)}>{minutes}</span>
            {showSeconds && (
              <span
                className="text-xs font-mono ml-1 font-bold"
                style={{ color: config?.glowColor || '#00F0FF' }}
              >
                [{seconds}]
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1 font-mono text-[9px] text-neutral-400">
          <span className="px-1 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-cyan-400">
            CYBER//HUD
          </span>
          {showDate && <span className="tracking-widest">{dayStr}</span>}
          <span className="text-emerald-400 font-bold">120 FPS</span>
        </div>
      </div>
    );
  }

  // 4. AURA RADIAL RING
  if (styleType === 'AURA_RING') {
    const secProgress = (time.getSeconds() / 60) * 100;
    const strokeDash = 2 * Math.PI * 26;
    const strokeOffset = strokeDash - (secProgress / 100) * strokeDash;

    return (
      <div onClick={onClick} className={`cursor-pointer select-none flex items-center gap-3.5 ${className}`}>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
            <circle
              cx="30"
              cy="30"
              r="26"
              stroke="#1a1a1a"
              strokeWidth="2"
              fill="transparent"
            />
            <circle
              cx="30"
              cy="30"
              r="26"
              stroke={config?.glowColor || accentColor}
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={strokeDash}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-mono font-bold text-white">
            {seconds}s
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span style={getDigitStyles(38, 300)}>{hours}:{minutes}</span>
            {!is24 && (
              <span className="text-[10px] font-mono text-neutral-400 ml-1">
                {ampm}
              </span>
            )}
          </div>
          {showDate && (
            <div className="font-mono text-[10px] text-neutral-400 tracking-wider">
              {dayStr}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. ROMA LUXURY MINIMAL
  if (styleType === 'ROMA_MINIMAL') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none text-left group ${className}`}>
        <div className="flex items-baseline gap-2.5">
          <span
            style={{
              ...getDigitStyles(52, 300),
              fontFamily: '"Cinzel", "Playfair Display", "Times New Roman", serif',
              letterSpacing: '0.04em'
            }}
          >
            {hours}
          </span>
          <span className="text-xl text-neutral-600 font-light">•</span>
          <span
            style={{
              ...getDigitStyles(52, 300),
              fontFamily: '"Cinzel", "Playfair Display", "Times New Roman", serif',
              letterSpacing: '0.04em'
            }}
          >
            {minutes}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[10px] tracking-[0.25em] text-neutral-400 font-serif uppercase">
          <span>{dayStr}</span>
          <span>•</span>
          <span style={{ color: config?.glowColor || accentColor }}>GENEVE</span>
        </div>
      </div>
    );
  }

  // 6. SPLIT DUAL PILL
  if (styleType === 'SPLIT_PILL') {
    return (
      <div onClick={onClick} className={`cursor-pointer select-none text-left ${className}`}>
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-white text-black flex items-center justify-center font-mono shadow-md">
            <span style={{ ...getDigitStyles(34, 700), color: '#000000' }}>{hours}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-neutral-900 border border-neutral-750 text-white flex items-center justify-center font-mono shadow-inner">
            <span style={{ ...getDigitStyles(34, 400), color: '#FFFFFF' }}>{minutes}</span>
          </div>
          {showSeconds && (
            <div className="w-7 h-7 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-400">
              {seconds}
            </div>
          )}
        </div>
        {showDate && (
          <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] text-neutral-400 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{dayStr}</span>
          </div>
        )}
      </div>
    );
  }

  // Default: MINIMAL_DIGITAL
  return (
    <div onClick={onClick} className={`cursor-pointer select-none ${className}`}>
      <div style={getDigitStyles(50, 200)}>
        {hours}:{minutes}
        {showSeconds && (
          <span
            className="text-xs font-mono ml-1.5 opacity-80"
            style={{ color: config?.glowColor || accentColor }}
          >
            :{seconds}
          </span>
        )}
      </div>
      {showDate && (
        <div className="font-mono mt-1" style={getSecondaryStyles(10, '#A3A3A3')}>
          {dayStr}
        </div>
      )}
    </div>
  );
};
