import React from 'react';
import * as LucideIcons from 'lucide-react';
import { IconStyleType, IconShapeType } from '../types';

interface Props {
  name: string;
  size?: number;
  styleType?: IconStyleType;
  shape?: IconShapeType;
  strokeWidth?: number;
  accentColor?: string;
  opacity?: number;
  className?: string;
}

export const MonochromeIconRenderer: React.FC<Props> = ({
  name,
  size = 28,
  styleType = 'OUTLINE',
  shape = 'NONE',
  strokeWidth: customStroke,
  accentColor = '#FFFFFF',
  opacity = 1,
  className = ''
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Square;

  const defaultStroke =
    styleType === 'THIN_LINE'
      ? 1.0
      : styleType === 'OUTLINE'
      ? 1.4
      : styleType === 'ROUNDED'
      ? 1.6
      : 1.25;

  const strokeWidth = customStroke ?? defaultStroke;
  const isFilled = styleType === 'FILLED_MONOCHROME';

  const getShapeStyles = () => {
    switch (shape) {
      case 'CIRCLE':
        return {
          className: 'rounded-full border',
          style: {
            borderColor: `${accentColor}33`,
            backgroundColor: '#080808'
          },
          innerRotate: ''
        };
      case 'SQUIRCLE':
        return {
          className: 'rounded-[28%] border',
          style: {
            borderColor: `${accentColor}33`,
            backgroundColor: '#080808'
          },
          innerRotate: ''
        };
      case 'ROUNDED_SQUARE':
        return {
          className: 'rounded-2xl border',
          style: {
            borderColor: `${accentColor}33`,
            backgroundColor: '#080808'
          },
          innerRotate: ''
        };
      case 'DIAMOND':
        return {
          className: 'rounded-lg border rotate-45',
          style: {
            borderColor: `${accentColor}33`,
            backgroundColor: '#080808'
          },
          innerRotate: '-rotate-45'
        };
      case 'HEXAGON':
        return {
          className: 'border relative flex items-center justify-center',
          style: {
            clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
            backgroundColor: '#0a0a0a',
            borderColor: `${accentColor}44`,
            borderWidth: '1px'
          },
          innerRotate: ''
        };
      case 'OCTAGON':
        return {
          className: 'border relative flex items-center justify-center',
          style: {
            clipPath: 'polygon(29% 0%, 71% 0%, 100% 29%, 100% 71%, 71% 100%, 29% 100%, 0% 71%, 0% 29%)',
            backgroundColor: '#0a0a0a',
            borderColor: `${accentColor}44`,
            borderWidth: '1px'
          },
          innerRotate: ''
        };
      case 'TEARDROP':
        return {
          className: 'rounded-t-full rounded-br-full rounded-bl-sm border',
          style: {
            borderColor: `${accentColor}33`,
            backgroundColor: '#080808'
          },
          innerRotate: ''
        };
      case 'SHIELD':
        return {
          className: 'rounded-t-md rounded-b-[42%] border',
          style: {
            borderColor: `${accentColor}33`,
            backgroundColor: '#080808'
          },
          innerRotate: ''
        };
      case 'NONE':
      default:
        return {
          className: '',
          style: {
            borderColor: 'transparent',
            backgroundColor: 'transparent'
          },
          innerRotate: ''
        };
    }
  };

  const shapeConfig = getShapeStyles();
  const hasShape = shape !== 'NONE';

  return (
    <div
      className={`flex items-center justify-center transition-all ${className}`}
      style={{
        width: size,
        height: size,
        opacity
      }}
    >
      <div
        className={`w-full h-full flex items-center justify-center transition-all ${shapeConfig.className}`}
        style={shapeConfig.style}
      >
        <div className={shapeConfig.innerRotate}>
          <IconComponent
            size={size * (hasShape ? 0.50 : 0.74)}
            strokeWidth={strokeWidth}
            style={{
              stroke: isFilled ? '#000000' : accentColor,
              fill: isFilled ? accentColor : 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
};
