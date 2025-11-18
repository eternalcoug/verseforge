import React from 'react';
import { getFretNote, isNoteInScale, isRootNote, getScaleDegree, getStringName, FRET_MARKERS, ScaleType } from '../utils/scaleTheory';
import { getFretNoteWithOctave, getStringInfo } from '../utils/fretboardTheory';
import { playNote } from '../utils/guitarInstrument';

interface FretboardProps {
  scaleNotes: string[];
  rootNote: string;
  scaleType: ScaleType;
  onNoteClick?: (note: string, stringIndex: number, fret: number) => void;
}

export function Fretboard({ scaleNotes, rootNote, scaleType, onNoteClick }: FretboardProps) {
  const numStrings = 6;
  const numFrets = 12;

  console.log('Fretboard rendering with scale notes:', scaleNotes);
  console.log('Root note:', rootNote);
  console.log('\n=== STRING ORIENTATION WITH OCTAVES (Top to Bottom) ===');
  console.log('String 1 (high E - index 0), Fret 0:', getFretNoteWithOctave(0, 0));
  console.log('String 2 (B - index 1), Fret 0:', getFretNoteWithOctave(1, 0));
  console.log('String 3 (G - index 2), Fret 0:', getFretNoteWithOctave(2, 0));
  console.log('String 4 (D - index 3), Fret 0:', getFretNoteWithOctave(3, 0));
  console.log('String 5 (A - index 4), Fret 0:', getFretNoteWithOctave(4, 0));
  console.log('String 6 (low E - index 5), Fret 0:', getFretNoteWithOctave(5, 0));
  console.log('String 6 (low E - index 5), Fret 3:', getFretNoteWithOctave(5, 3), '(should be G2)');
  console.log('String 3 (G - index 2), Fret 12:', getFretNoteWithOctave(2, 12), '(should be G4)');

  const renderNote = (stringIndex: number, fret: number) => {
    const note = getFretNote(stringIndex, fret);
    const noteWithOctave = getFretNoteWithOctave(stringIndex, fret);
    const inScale = isNoteInScale(note, scaleNotes);
    const isRoot = isRootNote(note, rootNote);
    const scaleDegree = getScaleDegree(note, scaleNotes, scaleType);

    if (!inScale) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full opacity-30"></div>
        </div>
      );
    }

    const handleClick = async () => {
      console.log(`Clicking: String ${stringIndex + 1}, Fret ${fret} - ${noteWithOctave.fullNote}`);
      await playNote(noteWithOctave.fullNote, '8n');
      onNoteClick?.(note, stringIndex, fret);
    };

    return (
      <div
        className="relative w-full h-full flex items-center justify-center cursor-pointer group"
        onClick={handleClick}
        title={`${noteWithOctave.fullNote} - ${scaleDegree || ''}`}
      >
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center
            font-bold text-white text-xs shadow-lg
            transition-transform group-hover:scale-110 group-active:scale-95
            ${isRoot
              ? 'bg-red-600 ring-2 ring-red-400'
              : 'bg-blue-600 ring-2 ring-blue-400'
            }
          `}
        >
          {note}
        </div>
        <div className="absolute -bottom-6 text-[10px] text-amber-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F0F0F] px-1 rounded shadow-sm border border-[#2A2A2A]">
          {scaleDegree}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="bg-gradient-to-b from-amber-900 to-amber-950 rounded-lg p-6 shadow-2xl">
          <div className="flex flex-col">
            <div className="flex mb-2 pl-12">
              {Array.from({ length: numFrets + 1 }, (_, fret) => (
                <div key={fret} className="flex-1 text-center min-w-[70px]">
                  <span className="text-amber-300 text-sm font-bold">{fret}</span>
                  {FRET_MARKERS.includes(fret) && (
                    <div className="flex justify-center mt-1">
                      {fret === 12 ? (
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-amber-400 rounded-full opacity-60"></div>
                          <div className="w-2 h-2 bg-amber-400 rounded-full opacity-60"></div>
                        </div>
                      ) : (
                        <div className="w-2 h-2 bg-amber-400 rounded-full opacity-60"></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {Array.from({ length: numStrings }, (_, stringIndex) => {
              const stringLabels = [
                { note: 'E', label: 'e', subtitle: '(1st)' },
                { note: 'B', label: 'B', subtitle: '(2nd)' },
                { note: 'G', label: 'G', subtitle: '(3rd)' },
                { note: 'D', label: 'D', subtitle: '(4th)' },
                { note: 'A', label: 'A', subtitle: '(5th)' },
                { note: 'E', label: 'E', subtitle: '(6th)' }
              ];
              const stringInfo = stringLabels[stringIndex];

              return (
              <div key={stringIndex} className="flex items-center mb-3 last:mb-0">
                <div className="w-16 text-right pr-3">
                  <div className="text-amber-300 font-bold text-sm">
                    {stringInfo.label}
                  </div>
                  <div className="text-amber-400 text-[10px]">
                    {stringInfo.subtitle}
                  </div>
                </div>

                <div className="flex-1 flex relative">
                  <div
                    className="absolute top-1/2 left-0 right-0 bg-gray-400 shadow-sm"
                    style={{
                      height: `${stringIndex + 1}px`,
                      transform: 'translateY(-50%)'
                    }}
                  ></div>

                  {Array.from({ length: numFrets + 1 }, (_, fret) => (
                    <div
                      key={fret}
                      className="relative flex-1 min-w-[70px] h-12 flex items-center justify-center"
                    >
                      {fret > 0 && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 shadow-sm"></div>
                      )}

                      {renderNote(stringIndex, fret)}
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-4 items-center text-sm">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-600 ring-2 ring-red-400"></div>
                <span className="text-amber-100">Root Note</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 ring-2 ring-blue-400"></div>
                <span className="text-amber-100">Scale Note</span>
              </div>
            </div>
            <div className="bg-amber-800 text-amber-100 px-4 py-2 rounded-lg text-xs max-w-2xl text-center">
              <span className="font-bold">💡 Orientation Tip:</span> This fretboard is oriented as if you're looking down at your guitar while playing.
              The top line is the thinnest string (high E), and the bottom line is the thickest string (low E).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
