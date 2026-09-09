import React, { useEffect, useRef } from 'react';
import { LiveEffectType } from '../types';

interface Props {
  effect: LiveEffectType;
  accentColor?: string;
  hasWallpaperImage?: boolean;
  className?: string;
}

export const AmoledCanvasWallpaper: React.FC<Props> = ({
  effect,
  accentColor = '#FFFFFF',
  hasWallpaperImage = false,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 740);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    if (effect === 'NONE' && hasWallpaperImage) {
      ctx.clearRect(0, 0, width, height);
      return;
    }

    // Particles setup
    const particleCount = effect === 'PARTICLES' ? 40 : effect === 'GALAXY' ? 55 : effect === 'STARFIELD_WARP' ? 70 : 25;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.6 + 0.2,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.005 + 0.002
    }));

    let tick = 0;

    const render = () => {
      tick++;

      // 1. Clear to true AMOLED pure black or transparent if wallpaper image exists
      if (hasWallpaperImage) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
      }

      if (effect === 'PARTICLES') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 85) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 85) * 0.16})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
      } else if (effect === 'GALAXY') {
        const cx = width / 2;
        const cy = height / 2;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.angle += p.speed;
          const r = (i / particles.length) * (width * 0.45) + 25;
          const x = cx + Math.cos(p.angle) * r;
          const y = cy + Math.sin(p.angle) * (r * 0.55);

          ctx.beginPath();
          ctx.arc(x, y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.85})`;
          ctx.fill();
        }
      } else if (effect === 'STARFIELD_WARP') {
        const cx = width / 2;
        const cy = height / 2;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.z -= 1.8;
          if (p.z <= 0) {
            p.z = width;
            p.x = (Math.random() - 0.5) * width * 2;
            p.y = (Math.random() - 0.5) * height * 2;
          }
          const k = 200 / p.z;
          const px = p.x * k + cx;
          const py = p.y * k + cy;

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            const size = (1 - p.z / width) * 2.2;
            ctx.beginPath();
            ctx.arc(px, py, Math.max(0.5, size), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, 1 - p.z / width)})`;
            ctx.fill();
          }
        }
      } else if (effect === 'NEON_LINES') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        const offset = (tick * 0.35) % gridSize;
        for (let x = -gridSize; x < width + gridSize; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x + offset, 0);
          ctx.lineTo(x + offset, height);
          ctx.stroke();
        }
        for (let y = -gridSize; y < height + gridSize; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y + offset);
          ctx.lineTo(width, y + offset);
          ctx.stroke();
        }
      } else if (effect === 'RAIN') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.9;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += 5.5;
          if (p.y > height) {
            p.y = 0;
            p.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + 14);
          ctx.stroke();
        }
      } else if (effect === 'FLUID_WAVE') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.2;
        for (let w = 0; w < 3; w++) {
          ctx.beginPath();
          const baseHeight = height * 0.6 + w * 25;
          for (let x = 0; x < width; x += 10) {
            const y = baseHeight + Math.sin(x * 0.015 + tick * 0.02 + w) * 20;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effect, accentColor]);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />;
};
