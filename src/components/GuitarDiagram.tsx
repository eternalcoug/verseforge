import React, { useEffect, useRef } from 'react';
import { ChordPosition } from '../utils/chordPositions';

interface GuitarDiagramProps {
  position: ChordPosition;
}

export function GuitarDiagram({ position }: GuitarDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 180;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const stringSpacing = 28;
    const fretHeight = 35;
    const leftMargin = 30;
    const topMargin = 50;
    const numFrets = 5;

    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;

    for (let i = 0; i < 6; i++) {
      const x = leftMargin + i * stringSpacing;
      ctx.beginPath();
      ctx.moveTo(x, topMargin);
      ctx.lineTo(x, topMargin + numFrets * fretHeight);
      ctx.stroke();
    }

    for (let i = 0; i <= numFrets; i++) {
      const y = topMargin + i * fretHeight;
      ctx.lineWidth = i === 0 && position.baseFret === 1 ? 4 : 1;
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(leftMargin + 5 * stringSpacing, y);
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';

    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const x = leftMargin + stringIndex * stringSpacing;
      const fret = position.frets[stringIndex];

      if (fret === 'x') {
        ctx.fillText('X', x, topMargin - 20);
      } else if (fret === 0) {
        ctx.fillText('O', x, topMargin - 20);
      } else if (typeof fret === 'number') {
        const relativeFret = fret - position.baseFret + 1;
        if (relativeFret >= 0 && relativeFret <= numFrets) {
          const y = topMargin + relativeFret * fretHeight - fretHeight / 2;

          const isRoot = stringIndex === 0 || stringIndex === 5;
          ctx.fillStyle = isRoot ? '#dc2626' : '#2563eb';
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, 2 * Math.PI);
          ctx.fill();

          const finger = position.fingers[stringIndex];
          if (typeof finger === 'number' && finger > 0) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(finger.toString(), x, y + 4);
          }

          ctx.fillStyle = '#374151';
          ctx.font = 'bold 14px sans-serif';
        }
      }
    }

    if (position.baseFret > 1) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${position.baseFret}fr`, leftMargin - 10, topMargin + fretHeight / 2);
    }

    if (position.barres && position.barres.length > 0) {
      position.barres.forEach(barreFinger => {
        const barreStrings: number[] = [];
        position.fingers.forEach((finger, stringIndex) => {
          if (finger === barreFinger && typeof position.frets[stringIndex] === 'number') {
            barreStrings.push(stringIndex);
          }
        });

        if (barreStrings.length > 1) {
          const minString = Math.min(...barreStrings);
          const maxString = Math.max(...barreStrings);
          const fretValue = position.frets[minString] as number;
          const relativeFret = fretValue - position.baseFret + 1;
          const y = topMargin + relativeFret * fretHeight - fretHeight / 2;

          ctx.strokeStyle = '#1e40af';
          ctx.lineWidth = 18;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(leftMargin + minString * stringSpacing, y);
          ctx.lineTo(leftMargin + maxString * stringSpacing, y);
          ctx.stroke();
          ctx.lineWidth = 1;
          ctx.lineCap = 'butt';
        }
      });
    }
  }, [position]);

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-bold text-amber-900 mb-2">{position.name}</h4>
      <canvas ref={canvasRef} className="border border-amber-200 rounded" />
    </div>
  );
}
