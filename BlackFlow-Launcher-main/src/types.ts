export type IconStyleType = 'OUTLINE' | 'FILLED_MONOCHROME' | 'THIN_LINE' | 'ROUNDED' | 'MINIMAL';

export type IconShapeType = 
  | 'NONE' 
  | 'CIRCLE' 
  | 'SQUIRCLE' 
  | 'ROUNDED_SQUARE' 
  | 'HEXAGON' 
  | 'DIAMOND'
  | 'OCTAGON'
  | 'TEARDROP'
  | 'SHIELD';

export type ClockStyleType = 
  | 'ITHEME_DUNE'
  | 'WIREFRAME_HOLLOW'
  | 'NOTHING_DOT'
  | 'NIAGARA_STACKED'
  | 'GEOMETRIC_HUD'
  | 'MINIMAL_DIGITAL' 
  | 'CYBER_MONO' 
  | 'DUAL_LINE' 
  | 'VERTICAL_DIGIT' 
  | 'WORD_CLOCK'
  | 'ANALOG_OUTLINE'
  | 'SEGMENT_LED'
  | 'BAUHAUS_DUAL'
  | 'CHRONO_RACING'
  | 'OLED_GLITCH'
  | 'AURA_RING'
  | 'ROMA_MINIMAL'
  | 'SPLIT_PILL';

export type ClockFontFamily = 'sans' | 'mono' | 'serif' | 'display' | 'tech' | 'condensed';
export type ClockFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type ClockColorBlendMode = 
  | 'normal' 
  | 'wireframe_stroke' 
  | 'screen' 
  | 'overlay' 
  | 'luminosity' 
  | 'neon_glow' 
  | 'gradient_fade'
  | 'cyber_matrix';

export interface ClockCustomization {
  fontFamily: ClockFontFamily;
  fontWeight: ClockFontWeight;
  fontSize: number; // in px: 32 - 76
  secondaryTextSize: number; // in px: 8 - 18
  secondaryFontWeight: 300 | 400 | 500 | 600;
  secondaryTracking: 'normal' | 'wide' | 'widest';
  colorBlendMode: ClockColorBlendMode;
  primaryColor: string; // e.g. '#FFFFFF'
  primaryOpacity: number; // 0.2 - 1.0
  secondaryColor: string; // e.g. '#A3A3A3'
  letterSpacing: number; // -4 to 8 px
  strokeWidth: number; // 1 to 3 px
  glowColor: string; // hex color for neon_glow / accent
  showSeconds: boolean;
  showDate: boolean;
  showTelemetry: boolean;
  is24Hour: boolean;
}

export const DEFAULT_CLOCK_CONFIG: ClockCustomization = {
  fontFamily: 'sans',
  fontWeight: 200,
  fontSize: 50,
  secondaryTextSize: 10,
  secondaryFontWeight: 400,
  secondaryTracking: 'wide',
  colorBlendMode: 'normal',
  primaryColor: '#FFFFFF',
  primaryOpacity: 1.0,
  secondaryColor: '#A3A3A3',
  letterSpacing: -1.5,
  strokeWidth: 1.8,
  glowColor: '#00F0FF',
  showSeconds: true,
  showDate: true,
  showTelemetry: true,
  is24Hour: false
};

export type LiveEffectType = 'NONE' | 'PARTICLES' | 'GALAXY' | 'NEON_LINES' | 'RAIN' | 'FLUID_WAVE' | 'STARFIELD_WARP';

export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  category: 'SYSTEM' | 'TOOLS' | 'DEVELOPER' | 'SOCIAL' | 'MEDIA';
  icon: string;
  customIcon?: string;
  customLabel?: string;
  isFavorite?: boolean;
  isHidden?: boolean;
  isCustomOnHome?: boolean;
  isSystem?: boolean;
  order?: number;
}

export interface WidgetConfig {
  showMusicPlayer: boolean;
  showWeatherPill: boolean;
  showSystemMonitor: boolean;
  showSearchPill: boolean;
  showQuickNotes?: boolean;
  showRamBooster?: boolean;
  showStepCounter?: boolean;
  quickNoteText?: string;
  musicTrackTitle: string;
  musicTrackArtist: string;
  musicIsPlaying: boolean;
}

export interface GridConfig {
  columns: number;
  rows: number;
  iconSize: number; // 38 - 68
  iconSpacing: number; // 6 - 28
  strokeWidth: number; // 0.8 - 2.5
  showLabels: boolean;
  labelFont: 'sans' | 'mono' | 'space' | 'serif';
  iconStyle: IconStyleType;
  iconShape: IconShapeType;
  iconOpacity: number;
  accentColor: string;
  alignment: 'top' | 'center' | 'bottom';
}

export interface WallpaperItem {
  id: string;
  title: string;
  category: 'FEATURED' | 'AMOLED' | 'ABSTRACT' | 'MINIMAL' | 'SPACE' | 'NATURE' | 'CARS' | 'ANIME' | 'DARK' | 'LIVE' | 'MORE';
  thumbnailUrl: string;
  highResUrl: string;
  isLive?: boolean;
  liveEffect?: LiveEffectType;
  isFavorite?: boolean;
  isDownloaded?: boolean;
  downloadCount?: number;
  resolution?: string;
  isNew?: boolean;
}

export interface ThemeConfig {
  id: string;
  name: string;
  author: string;
  description: string;
  clockStyle: ClockStyleType;
  clockConfig?: ClockCustomization;
  lockScreenClockConfig?: ClockCustomization;
  separateLockClock?: boolean;
  iconStyle: IconStyleType;
  gridConfig: GridConfig;
  widgets: WidgetConfig;
  liveEffect: LiveEffectType;
  wallpaperId: string;
  customWallpaperUrl?: string;
  accentColor: string;
  soundFeedback: boolean;
}

export interface LockScreenConfig {
  enabled: boolean;
  clockStyle: ClockStyleType;
  clockConfig?: ClockCustomization;
  showWeather: boolean;
  showBattery: boolean;
  batteryPercent: number;
  isCharging: boolean;
  blurLevel: number;
  textOpacity: number;
  aodMode: boolean;
}

