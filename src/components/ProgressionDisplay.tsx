import React from 'react';
import { Chord, getChordName } from '../utils/musicTheory';
import { ChordDiagram } from './ChordDiagram';

interface ProgressionDisplayProps {
  progression: Chord[][];
  currentPlayingLine?: number;
  currentPlayingChord?: number;
}

export const ProgressionDisplay: React.FC<ProgressionDisplayProps> = ({
  progression,
  currentPlayingLine,
  currentPlayingChord,
}) => {
  const uniqueChords = Array.from(
    new Set(progression.flat().map(c => getChordName(c)))
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] p-6 rounded-lg border-2 border-[#2A2A2A] shadow-lg">
        {progression.map((line, lineIndex) => {
          const borrowedChords = line.filter(c => c.isBorrowed);

          return (
            <div key={lineIndex} className="mb-6 last:mb-0">
              <div className="flex items-baseline gap-3 mb-2 font-mono">
                <span className="text-amber-400 font-bold text-sm w-16">LINE {lineIndex + 1}:</span>
                <div className="flex gap-4 flex-wrap items-center">
                  {line.map((chord, chordIndex) => {
                    const isPlaying = currentPlayingLine === lineIndex && currentPlayingChord === chordIndex;
                    return (
                      <span
                        key={chordIndex}
                        className={`text-2xl font-bold transition-all ${
                          isPlaying
                            ? 'text-orange-600 scale-110'
                            : chord.isBorrowed
                            ? 'text-orange-500'
                            : 'text-[#E5E5E5]'
                        }`}
                      >
                        {getChordName(chord)}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-2 font-mono">
                <span className="text-amber-400 text-xs w-16">(Roman):</span>
                <div className="flex gap-4 flex-wrap items-center">
                  {line.map((chord, chordIndex) => {
                    const isPlaying = currentPlayingLine === lineIndex && currentPlayingChord === chordIndex;
                    return (
                      <span
                        key={chordIndex}
                        className={`text-lg transition-all ${
                          isPlaying
                            ? 'text-orange-600 scale-110 font-bold'
                            : chord.isBorrowed
                            ? 'text-orange-500 font-semibold'
                            : 'text-[#A3A3A3]'
                        }`}
                      >
                        {chord.roman}
                      </span>
                    );
                  })}
                </div>
              </div>

              {borrowedChords.length > 0 && (
                <div className="ml-16 text-sm text-orange-600 font-medium">
                  [Borrowed from {borrowedChords[0].borrowedFrom}:{' '}
                  {borrowedChords.map(c => `${c.roman} (${getChordName(c)})`).join(', ')}]
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-lg border-2 border-[#2A2A2A] shadow-lg">
        <h3 className="text-xl font-bold text-[#E5E5E5] mb-4">Guitar Chord Diagrams</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {uniqueChords.map(chordName => (
            <ChordDiagram key={chordName} chordName={chordName} />
          ))}
        </div>
      </div>
    </div>
  );
};
