import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Volume2, Star } from 'lucide-react';
import { getDiatonicChords, getBorrowedChords, DiatonicChord } from '../utils/chordTheory';
import { ProgressionPlayer } from '../utils/audioPlayer';

const KEY_OPTIONS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const playerInstance = new ProgressionPlayer();

export function ChordReference() {
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedMode, setSelectedMode] = useState<'major' | 'minor'>('major');
  const [playingChord, setPlayingChord] = useState<string | null>(null);

  const diatonicChords = getDiatonicChords(selectedKey, selectedMode);
  const borrowedChords = getBorrowedChords(selectedKey, selectedMode);

  const playChord = async (chord: DiatonicChord) => {
    if (playingChord === chord.display) return;

    setPlayingChord(chord.display);

    await playerInstance.ensureInstrument();

    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = notes.indexOf(chord.root);

    let intervals: number[];
    if (chord.quality === 'major') {
      intervals = [0, 4, 7];
    } else if (chord.quality === 'minor') {
      intervals = [0, 3, 7];
    } else if (chord.quality === 'diminished') {
      intervals = [0, 3, 6];
    } else if (chord.quality === 'm7b5') {
      intervals = [0, 3, 6, 10];
    } else {
      intervals = [0, 4, 7];
    }

    const chordNotes: string[] = [];
    intervals.forEach(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      const noteName = notes[noteIndex];
      chordNotes.push(`${noteName}4`);
    });

    if (playerInstance['synth']) {
      playerInstance['synth'].triggerAttackRelease(chordNotes, '2n');
    }

    setTimeout(() => setPlayingChord(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BookOpen className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-[#E5E5E5]">Chord Reference</h1>
        </div>
        <p className="text-[#A3A3A3]">Explore diatonic chords in any key and scale</p>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg shadow-xl border-2 border-[#2A2A2A] p-6">

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-[#E5E5E5] font-bold mb-2">Select Key</label>
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="dark-select w-full"
          >
            {KEY_OPTIONS.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#E5E5E5] font-bold mb-2">Select Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="major"
                checked={selectedMode === 'major'}
                onChange={() => setSelectedMode('major')}
                className="w-5 h-5 text-amber-600"
              />
              <span className="text-amber-900 font-medium">Major</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="minor"
                checked={selectedMode === 'minor'}
                onChange={() => setSelectedMode('minor')}
                className="w-5 h-5 text-amber-600"
              />
              <span className="text-amber-900 font-medium">Minor</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-bold text-blue-400">
            Diatonic Chords (Key of {selectedKey} {selectedMode})
          </h3>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {diatonicChords.map((chord, index) => (
            <button
              key={index}
              onClick={() => playChord(chord)}
              className={`
                relative p-4 rounded-lg border-2 transition-all
                ${playingChord === chord.display
                  ? 'bg-blue-600 border-blue-700 text-white scale-105 shadow-lg'
                  : 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200 hover:border-blue-400'
                }
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold">{chord.display}</span>
                <span className="text-sm font-medium opacity-80">{chord.romanNumeral}</span>
                {playingChord === chord.display && (
                  <Volume2 size={16} className="absolute top-1 right-1 animate-pulse" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-bold text-orange-400">
            Borrowed Chords (from parallel {selectedMode === 'major' ? 'minor' : 'major'})
          </h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {borrowedChords.map((chord, index) => (
            <button
              key={index}
              onClick={() => playChord(chord)}
              className={`
                relative p-4 rounded-lg border-2 transition-all
                ${playingChord === chord.display
                  ? 'bg-orange-600 border-orange-700 text-white scale-105 shadow-lg'
                  : 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200 hover:border-orange-400'
                }
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold">{chord.display}</span>
                <span className="text-sm font-medium opacity-80">{chord.romanNumeral}</span>
                {chord.isCommonInCountry && (
                  <Star
                    size={14}
                    className="absolute top-1 right-1 fill-yellow-400 text-yellow-500"
                    title="Common in country music"
                  />
                )}
                {playingChord === chord.display && (
                  <Volume2 size={16} className="absolute top-1 left-1 animate-pulse" />
                )}
              </div>
            </button>
          ))}
        </div>
        <p className="text-sm text-[#A3A3A3] mt-3 flex items-center gap-2">
          <Star size={14} className="fill-yellow-400 text-yellow-500" />
          Indicates chords commonly used in country music
        </p>
      </div>
      </div>
    </div>
  );
}
