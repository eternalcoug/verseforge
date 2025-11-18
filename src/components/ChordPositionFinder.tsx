import React, { useState } from 'react';
import { Search, Play, MapPin } from 'lucide-react';
import { getChordPositions, CHORD_POSITIONS, ChordPosition } from '../utils/chordPositions';
import { generatePowerChordPositions, PowerChordPosition } from '../utils/powerChordTheory';
import { GuitarDiagram } from './GuitarDiagram';
import { ProgressionPlayer } from '../utils/audioPlayer';

const playerInstance = new ProgressionPlayer();

function convertPowerChordToChordPosition(powerPos: PowerChordPosition): ChordPosition {
  const frets: (number | 'x' | 0)[] = ['x', 'x', 'x', 'x', 'x', 'x'];
  const fingers: (number | 'x' | 0)[] = ['x', 'x', 'x', 'x', 'x', 'x'];

  powerPos.fingerPositions.forEach(fp => {
    const arrayIndex = 6 - fp.string;
    frets[arrayIndex] = fp.fret;
    fingers[arrayIndex] = fp.finger;
  });

  return {
    chord: powerPos.chordName,
    frets,
    fingers,
    baseFret: powerPos.fret || 1,
    name: powerPos.name
  };
}

export function ChordPositionFinder() {
  const [chordInput, setChordInput] = useState('C');
  const [chordType, setChordType] = useState<'standard' | 'power'>('standard');
  const [displayedPositions, setDisplayedPositions] = useState(getChordPositions('C'));
  const [displayedPowerPositions, setDisplayedPowerPositions] = useState<PowerChordPosition[]>([]);
  const [playingPosition, setPlayingPosition] = useState<number | null>(null);

  const availableChords = Object.keys(CHORD_POSITIONS).sort();

  const handleSearch = () => {
    if (chordType === 'standard') {
      const positions = getChordPositions(chordInput);
      setDisplayedPositions(positions);
    } else {
      const rootNote = chordInput.replace(/[^A-G#b]/g, '');
      const positions = generatePowerChordPositions(rootNote);
      setDisplayedPowerPositions(positions);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const playPosition = async (index: number) => {
    if (playingPosition === index) return;

    setPlayingPosition(index);

    const chordName = chordInput.replace('m', '').replace('#', '').replace('b', '');
    const quality = chordInput.includes('m') ? 'minor' : 'major';

    await playerInstance.ensureInstrument();

    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = notes.indexOf(chordName);

    let intervals: number[];
    if (chordType === 'power') {
      intervals = [0, 7];
    } else {
      intervals = quality === 'major' ? [0, 4, 7] : [0, 3, 7];
    }

    const chordNotes: string[] = [];
    intervals.forEach(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      const noteName = notes[noteIndex];
      chordNotes.push(`${noteName}3`);
    });

    if (playerInstance['synth']) {
      playerInstance['synth'].triggerAttackRelease(chordNotes, '2n');
    }

    setTimeout(() => setPlayingPosition(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <MapPin className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-[#E5E5E5]">Chord Position Finder</h1>
        </div>
        <p className="text-[#A3A3A3]">Find multiple positions for any chord on the fretboard</p>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg shadow-xl border-2 border-[#2A2A2A] p-6">

      <div className="mb-6 p-4 bg-[#242424] rounded-lg border-2 border-[#2A2A2A]">
        <label className="block font-bold text-[#E5E5E5] mb-3">Chord Type:</label>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setChordType('standard');
              setDisplayedPositions(getChordPositions(chordInput));
              setDisplayedPowerPositions([]);
            }}
            className={`
              flex-1 px-6 py-3 rounded-lg font-semibold transition-all
              ${chordType === 'standard'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-[#242424] text-[#E5E5E5] border-2 border-[#2A2A2A] hover:border-blue-400'
              }
            `}
          >
            <div className="text-lg mb-1">Standard Chords</div>
            <div className="text-xs opacity-80">Full major/minor chords (9 positions)</div>
          </button>

          <button
            onClick={() => {
              setChordType('power');
              const rootNote = chordInput.replace(/[^A-G#b]/g, '');
              setDisplayedPowerPositions(generatePowerChordPositions(rootNote));
              setDisplayedPositions([]);
            }}
            className={`
              flex-1 px-6 py-3 rounded-lg font-semibold transition-all
              ${chordType === 'power'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-[#242424] text-[#E5E5E5] border-2 border-[#2A2A2A] hover:border-red-400'
              }
            `}
          >
            <div className="text-lg mb-1">Power Chords</div>
            <div className="text-xs opacity-80">Rock/metal 5th chords (6 positions)</div>
          </button>
        </div>
      </div>

      {chordType === 'power' && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
            <span>Power Chord Info</span>
          </h3>
          <ul className="text-sm text-[#E5E5E5] space-y-1">
            <li>• Power chords use only <strong>root + 5th</strong> (no 3rd)</li>
            <li>• Neither major nor minor - <strong>neutral sound</strong></li>
            <li>• Perfect for <strong>rock, punk, metal, and country-rock</strong></li>
            <li>• Notation: <strong>{chordInput}5</strong></li>
            <li>• Sound huge with <strong>distortion</strong></li>
          </ul>
        </div>
      )}

      <div className="mb-8">
        <label className="block text-amber-900 font-bold mb-2">
          Enter Chord Name
        </label>
        <div className="flex gap-3">
          <select
            value={chordInput}
            onChange={(e) => {
              setChordInput(e.target.value);
              if (chordType === 'standard') {
                setDisplayedPositions(getChordPositions(e.target.value));
              } else {
                const rootNote = e.target.value.replace(/[^A-G#b]/g, '');
                setDisplayedPowerPositions(generatePowerChordPositions(rootNote));
              }
            }}
            className="dark-select flex-1 text-lg"
          >
            {availableChords.map(chord => (
              <option key={chord} value={chord}>{chord}</option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 rounded-lg transition-all shadow-lg flex items-center gap-2"
          >
            <Search size={20} />
            Show Positions
          </button>
        </div>
      </div>

      {(displayedPositions.length > 0 || displayedPowerPositions.length > 0) ? (
        <div>
          <h3 className="text-lg font-bold text-amber-900 mb-4">
            {chordType === 'standard' ? displayedPositions.length : displayedPowerPositions.length} Position{(chordType === 'standard' ? displayedPositions.length : displayedPowerPositions.length) !== 1 ? 's' : ''} for {chordInput}{chordType === 'power' ? '5' : ''}
          </h3>
          <div className={`grid gap-6 ${chordType === 'power' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {chordType === 'power' && displayedPowerPositions.map((position, index) => (
              <div
                key={index}
                className={`
                  bg-red-50 p-4 rounded-lg border-2 transition-all
                  ${playingPosition === index
                    ? 'border-red-600 shadow-lg'
                    : 'border-red-200'
                  }
                `}
              >
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg text-[#E5E5E5]">{position.chord}</h4>
                    <span className={`
                      text-xs px-2 py-1 rounded font-semibold
                      ${position.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        position.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}
                    `}>
                      {position.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-[#A3A3A3]">
                    {position.name} • {position.description}
                  </p>
                  <p className="text-xs text-red-700 font-semibold mt-1">
                    Power Chord (Root + 5th)
                  </p>
                </div>

                <GuitarDiagram position={convertPowerChordToChordPosition(position)} />

                <button
                  onClick={() => playPosition(index)}
                  className={`
                    w-full mt-4 py-2 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2
                    ${playingPosition === index
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                    }
                  `}
                >
                  <Play size={16} />
                  {playingPosition === index ? 'Playing...' : `Play ${position.chord}`}
                </button>
                {index === 0 && (
                  <div className="mt-2 text-xs text-center text-green-700 font-semibold">
                    ⭐ Most common position
                  </div>
                )}
              </div>
            ))}
            {chordType === 'standard' && displayedPositions.map((position, index) => (
              <div
                key={index}
                className={`
                  bg-amber-50 p-4 rounded-lg border-2 transition-all
                  ${playingPosition === index
                    ? 'border-amber-600 shadow-lg'
                    : 'border-amber-200'
                  }
                `}
              >
                <GuitarDiagram position={position} />
                <button
                  onClick={() => playPosition(index)}
                  className={`
                    w-full mt-4 py-2 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2
                    ${playingPosition === index
                      ? 'bg-green-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    }
                  `}
                >
                  <Play size={16} />
                  {playingPosition === index ? 'Playing...' : 'Play Chord'}
                </button>
                {index === 0 && (
                  <div className="mt-2 text-xs text-center text-green-700 font-semibold">
                    ⭐ Easiest for beginners
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">Diagram Legend:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><span className="font-bold">X</span> = Don't play this string</li>
              <li><span className="font-bold">O</span> = Play open string (no fret)</li>
              <li><span className="inline-block w-4 h-4 bg-red-600 rounded-full align-middle"></span> = Root note</li>
              <li><span className="inline-block w-4 h-4 bg-blue-600 rounded-full align-middle"></span> = Other chord tones</li>
              <li><span className="font-bold">Numbers</span> = Finger positions (1=index, 2=middle, 3=ring, 4=pinky)</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-[#A3A3A3]">
          <p className="text-lg">No positions found for "{chordInput}"</p>
          <p className="text-sm mt-2">Try a different chord name (e.g., C, Am, G, Dm)</p>
        </div>
      )}
      </div>
    </div>
  );
}
