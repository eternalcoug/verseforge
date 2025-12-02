import React from 'react';
import { CHORD_DIAGRAMS, ChordDiagram as ChordDiagramType, getChordAlternatives } from '../utils/chordDiagrams';

interface ChordDiagramProps {
  chordName: string;
}

const SingleDiagram: React.FC<{ diagram: ChordDiagramType; title?: string; isAlternative?: boolean }> = ({ diagram, title, isAlternative = false }) => {
  const stringCount = 6;
  const fretCount = 4;

  return (
    <div className={`flex flex-col items-center p-3 rounded-lg border ${isAlternative ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
      <div className={`text-sm font-bold mb-2 ${isAlternative ? 'text-blue-900' : 'text-amber-900'}`}>
        {title || diagram.chord}
      </div>

      <svg width="80" height="100" viewBox="0 0 80 100" className="mb-1">
        {Array.from({ length: stringCount }).map((_, stringIndex) => {
          const x = 15 + stringIndex * 10;
          return (
            <line
              key={`string-${stringIndex}`}
              x1={x}
              y1="10"
              x2={x}
              y2="90"
              stroke="#8B4513"
              strokeWidth="1"
            />
          );
        })}

        {Array.from({ length: fretCount + 1 }).map((_, fretIndex) => {
          const y = 10 + fretIndex * 20;
          const strokeWidth = fretIndex === 0 ? 3 : 1;
          return (
            <line
              key={`fret-${fretIndex}`}
              x1="15"
              y1={y}
              x2="65"
              y2={y}
              stroke="#8B4513"
              strokeWidth={strokeWidth}
            />
          );
        })}

        {diagram.frets.map((fret, stringIndex) => {
          const x = 15 + stringIndex * 10;

          if (fret === 'x') {
            return (
              <text
                key={`marker-${stringIndex}`}
                x={x}
                y="7"
                textAnchor="middle"
                fontSize="10"
                fill="#991B1B"
                fontWeight="bold"
              >
                ×
              </text>
            );
          }

          if (fret === 0) {
            return (
              <circle
                key={`marker-${stringIndex}`}
                cx={x}
                cy="5"
                r="3"
                fill="none"
                stroke="#15803D"
                strokeWidth="2"
              />
            );
          }

          const y = 10 + (fret - 0.5) * 20;
          return (
            <circle
              key={`marker-${stringIndex}`}
              cx={x}
              cy={y}
              r="4"
              fill="#8B4513"
            />
          );
        })}
      </svg>

      <div className={`text-xs ${isAlternative ? 'text-blue-700' : 'text-amber-700'}`}>
        {diagram.baseFret > 1 && `${diagram.baseFret}fr`}
      </div>
    </div>
  );
};

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ chordName }) => {
  const diagram = CHORD_DIAGRAMS[chordName];
  const alternatives = getChordAlternatives(chordName);

  if (!diagram) {
    return (
      <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="text-sm font-semibold text-amber-900 mb-2">{chordName}</div>
        <div className="text-xs text-amber-600">Diagram not available</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <SingleDiagram diagram={diagram} title={chordName} />
      {alternatives.length > 1 && (
        <div className="space-y-2">
          <div className="text-xs text-[#A3A3A3] text-center font-semibold">Alternative Positions:</div>
          {alternatives.slice(1).map((alt, index) => (
            <SingleDiagram
              key={index}
              diagram={alt}
              title={`${chordName} (${index + 2})`}
              isAlternative={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
