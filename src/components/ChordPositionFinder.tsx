import React, { useState, useEffect } from 'react';
import { Search, Play, MapPin, Plus, Music, Info, ChevronDown, BookOpen, Download, Upload } from 'lucide-react';
import { getChordPositions, CHORD_POSITIONS, ChordPosition } from '../utils/chordPositions';
import { generatePowerChordPositions, PowerChordPosition } from '../utils/powerChordTheory';
import { GuitarDiagram } from './GuitarDiagram';
import { ProgressionPlayer } from '../utils/audioPlayer';
import {
  CHORD_QUALITIES,
  ChordQuality,
  getChordName,
  getChordNotes,
  calculateDifficulty,
  getRelatedChords,
  getCommonProgressions,
  getProgressionChords,
  getFretRange
} from '../utils/chordEnhancements';
import { saveProgression, loadProgression, loadChordContext, clearChordContext } from '../utils/progressionManager';
import { detectPossibleKeys, getBestKeyMatch } from '../utils/keyDetection';

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

interface ChordPositionFinderProps {
  onNavigateToReference?: () => void;
}

export function ChordPositionFinder({ onNavigateToReference }: ChordPositionFinderProps = {}) {
  const [chordRoot, setChordRoot] = useState('C');
  const [chordQuality, setChordQuality] = useState<ChordQuality>('major');
  const [chordType, setChordType] = useState<'standard' | 'power'>('standard');
  const [displayedPositions, setDisplayedPositions] = useState(getChordPositions('C'));
  const [displayedPowerPositions, setDisplayedPowerPositions] = useState<PowerChordPosition[]>([]);
  const [playingPosition, setPlayingPosition] = useState<number | null>(null);
  const [progression, setProgression] = useState<string[]>([]);
  const [playingProgression, setPlayingProgression] = useState(false);
  const [progressionOpen, setProgressionOpen] = useState(false);
  const [hasImportedProgression, setHasImportedProgression] = useState(false);

  useEffect(() => {
    const context = loadChordContext();
    if (context) {
      setChordRoot(context.chord.replace(/[^A-G#]/g, ''));
      const qualityMatch = context.chord.match(/(maj7|min7|m7|7|maj|min|m|sus2|sus4|dim|aug|°|\+)/i);
      if (qualityMatch) {
        const qualityStr = qualityMatch[0].toLowerCase();
        if (qualityStr === 'maj7') setChordQuality('major7');
        else if (qualityStr === 'min7' || qualityStr === 'm7') setChordQuality('minor7');
        else if (qualityStr === '7') setChordQuality('dominant7');
        else if (qualityStr === 'min' || qualityStr === 'm') setChordQuality('minor');
        else if (qualityStr === 'sus2') setChordQuality('sus2');
        else if (qualityStr === 'sus4') setChordQuality('sus4');
        else if (qualityStr === 'dim' || qualityStr === '°') setChordQuality('diminished');
        else if (qualityStr === 'aug' || qualityStr === '+') setChordQuality('augmented');
      }
      clearChordContext();
      setTimeout(() => handleSearch(), 100);
    }

    const saved = loadProgression();
    if (saved && saved.source === 'chord-reference') {
      setHasImportedProgression(true);
    }
  }, []);

  const availableRoots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const currentChordName = getChordName(chordRoot, chordQuality);

  const handleSearch = () => {
    if (chordType === 'standard') {
      const searchChord = currentChordName;
      const positions = getChordPositions(searchChord);
      setDisplayedPositions(positions);
    } else {
      const positions = generatePowerChordPositions(chordRoot);
      setDisplayedPowerPositions(positions);
    }
  };

  const addToProgression = (chord: string) => {
    setProgression([...progression, chord]);
  };

  const removeFromProgression = (index: number) => {
    setProgression(progression.filter((_, i) => i !== index));
  };

  const playProgressionSequence = async () => {
    if (progression.length === 0) return;
    setPlayingProgression(true);

    await playerInstance.ensureInstrument();

    for (let i = 0; i < progression.length; i++) {
      const chord = progression[i];
      const root = chord.replace(/[^A-G#]/g, '');
      const notes = getChordNotes(root, chordQuality);
      const notesWithOctaves = notes.map(n => `${n}3`);

      if (playerInstance['synth']) {
        playerInstance['synth'].triggerAttackRelease(notesWithOctaves, '2n');
      }

      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    setPlayingProgression(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const playPosition = async (index: number) => {
    if (playingPosition === index) return;

    setPlayingPosition(index);

    const chordName = chordRoot;
    const quality = chordQuality;

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

  const exportProgression = () => {
    if (progression.length === 0) return;

    saveProgression({
      chords: progression,
      source: 'chord-finder',
      timestamp: Date.now()
    });
  };

  const importProgression = () => {
    const saved = loadProgression();
    if (!saved) return;

    setProgression(saved.chords);
    setHasImportedProgression(false);
    clearProgression();
  };

  const possibleKeys = chordType === 'standard' ? detectPossibleKeys(chordRoot, chordQuality) : [];
  const bestKey = possibleKeys.length > 0 ? possibleKeys[0] : null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <MapPin className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-[#E5E5E5]">Chord Position Finder</h1>
        </div>
        <p className="text-[#A3A3A3]">Find multiple positions for any chord on the fretboard</p>
        <p className="text-sm text-[#666] mt-2">
          <BookOpen size={14} className="inline mr-1" />
          Learn music theory and chord relationships in Chord Reference
        </p>
      </div>

      {bestKey && chordType === 'standard' && (
        <div className="mb-6 bg-blue-900/20 border border-blue-600/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={18} className="text-blue-400" />
            <span className="text-base font-semibold text-blue-300">
              Chord Context
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            <span className="font-bold text-blue-200">{currentChordName}</span> is the{' '}
            <span className="font-bold text-blue-200">{bestKey.romanNumeral}</span> chord{' '}
            ({bestKey.function}) in the key of{' '}
            <span className="font-bold text-blue-200">{bestKey.key} {bestKey.mode}</span>
          </p>
          {possibleKeys.length > 1 && (
            <details className="text-sm text-gray-400">
              <summary className="cursor-pointer hover:text-gray-300 mb-2">
                Also works in {possibleKeys.length - 1} other {possibleKeys.length - 1 === 1 ? 'key' : 'keys'}
              </summary>
              <div className="pl-4 space-y-1">
                {possibleKeys.slice(1, 4).map((key, i) => (
                  <div key={i}>
                    {key.romanNumeral} in {key.key} {key.mode} ({key.function})
                  </div>
                ))}
              </div>
            </details>
          )}
          {onNavigateToReference && (
            <button
              onClick={onNavigateToReference}
              className="mt-3 text-blue-400 hover:text-blue-300 underline text-sm flex items-center gap-1"
            >
              View all chords in {bestKey.key} {bestKey.mode} →
            </button>
          )}
        </div>
      )}

      <div className="bg-[#1A1A1A] rounded-lg shadow-xl border-2 border-[#2A2A2A] p-6">

      <div className="mb-6 p-4 bg-[#242424] rounded-lg border-2 border-[#2A2A2A]">
        <label className="block font-bold text-[#E5E5E5] mb-3">Chord Type:</label>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setChordType('standard');
              setDisplayedPositions(getChordPositions(currentChordName));
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
              setDisplayedPowerPositions(generatePowerChordPositions(chordRoot));
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

      {/* TASK 2: Fixed Power Chord Info text visibility - changed from light gray to dark text */}
      {chordType === 'power' && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
            <span>Power Chord Info</span>
          </h3>
          <ul className="text-sm text-[#333333] space-y-1">
            <li>• Power chords use only <strong>root + 5th</strong> (no 3rd)</li>
            <li>• Neither major nor minor - <strong>neutral sound</strong></li>
            <li>• Perfect for <strong>rock, punk, metal, and country-rock</strong></li>
            <li>• Notation: <strong>{chordRoot}5</strong></li>
            <li>• Sound huge with <strong>distortion</strong></li>
          </ul>
        </div>
      )}

      <div className="mb-8">
        <label className="block text-[#E5E5E5] font-bold mb-2">
          Select Chord
        </label>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm text-[#A3A3A3] mb-1">Root Note:</label>
            <select
              value={chordRoot}
              onChange={(e) => {
                setChordRoot(e.target.value);
              }}
              className="dark-select w-full text-lg"
            >
              {availableRoots.map(root => (
                <option key={root} value={root}>{root}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#A3A3A3] mb-1">Quality:</label>
            <select
              value={chordQuality}
              onChange={(e) => setChordQuality(e.target.value as ChordQuality)}
              className="dark-select w-full text-lg"
            >
              {CHORD_QUALITIES.map(quality => (
                <option key={quality.value} value={quality.value}>
                  {quality.label} ({chordRoot}{quality.suffix})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 px-4 py-3 bg-[#242424] border-2 border-blue-600 rounded-lg text-center">
            <div className="text-sm text-[#A3A3A3]">Current Chord:</div>
            <div className="text-2xl font-bold text-[#E5E5E5]">{currentChordName}</div>
          </div>
          <button
            onClick={handleSearch}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 rounded-lg transition-all shadow-lg flex items-center gap-2"
          >
            <Search size={20} />
            Show Positions
          </button>
        </div>
      </div>

      {/* Progression Builder - Accordion */}
      <div className="mb-6 bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-lg">
        <button
          onClick={() => setProgressionOpen(!progressionOpen)}
          className="w-full p-6 flex items-center justify-between hover:bg-[#242424] transition-colors"
        >
          <h3 className="text-xl font-bold text-[#E5E5E5] flex items-center gap-2">
            <Music className="w-6 h-6 text-blue-600" />
            Build a Progression
          </h3>
          <ChevronDown
            className={`w-6 h-6 text-[#A3A3A3] transition-transform ${progressionOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {progressionOpen && (
          <div className="px-6 pb-6">
            {hasImportedProgression && progression.length === 0 && (
              <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600/50 rounded-lg">
                <p className="text-sm text-blue-300 mb-2">Progression available from Chord Reference</p>
                <button
                  onClick={importProgression}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                >
                  <Upload size={16} />
                  Import Progression
                </button>
              </div>
            )}

            <div className="mb-4">
          <p className="text-sm text-[#A3A3A3] mb-3">Your Progression: (Click + to add current chord)</p>
          <div className="flex flex-wrap gap-2">
            {progression.map((chord, index) => (
              <button
                key={index}
                onClick={() => removeFromProgression(index)}
                className="px-4 py-2 bg-[#0F0F0F] border-2 border-blue-600 rounded-lg text-[#E5E5E5] font-bold hover:bg-[#242424] transition-all"
              >
                {chord}
              </button>
            ))}
            <button
              onClick={() => addToProgression(currentChordName)}
              className="px-4 py-2 border-2 border-dashed border-blue-600 rounded-lg text-blue-600 font-bold hover:bg-[#242424] transition-all flex items-center gap-1"
            >
              <Plus size={16} />
              Add {currentChordName}
            </button>
          </div>
        </div>

        {progression.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={playProgressionSequence}
              disabled={playingProgression}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all flex items-center gap-2"
            >
              <Play size={16} />
              {playingProgression ? 'Playing...' : 'Play Progression'}
            </button>
            <button
              onClick={exportProgression}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center gap-2"
            >
              <Download size={16} />
              Export to Reference
            </button>
            <button
              onClick={() => setProgression([])}
              className="px-6 py-2 bg-transparent border-2 border-[#2A2A2A] text-[#E5E5E5] font-bold rounded-lg hover:border-blue-600 transition-all"
            >
              Clear
            </button>
          </div>
        )}

        {/* Common Progressions */}
        <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
          <h4 className="font-bold text-[#E5E5E5] mb-3">💡 Common Progressions in {chordRoot}:</h4>
          <div className="space-y-3">
            {getCommonProgressions(chordRoot).map((prog, index) => {
              const chords = getProgressionChords(chordRoot, prog);
              return (
                <div key={index} className="p-3 bg-[#242424] rounded-lg border border-[#2A2A2A]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-[#E5E5E5]">{prog.name}</span>
                      <span className="ml-2 text-xs italic" style={{ color: '#F59E0B' }}>{prog.genre}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {chords.map((chord, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-900/30 border border-blue-600/50 rounded text-[#E5E5E5] font-semibold text-sm">
                        {chord}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[#A3A3A3]">{prog.description}</p>
                  <button
                    onClick={() => setProgression(chords)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-400 font-semibold"
                  >
                    Load This Progression
                  </button>
                </div>
              );
            })}
          </div>
        </div>
          </div>
        )}
      </div>

      {chordType === 'standard' && (displayedPositions.length > 0) && (
        <div className="mb-6 bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-lg p-4">
          <h4 className="font-bold text-[#E5E5E5] mb-3 flex items-center gap-2">
            <Info size={18} className="text-blue-500" />
            Related Chords
          </h4>
          <div className="flex flex-wrap gap-2">
            {getRelatedChords(chordRoot, chordQuality).map((relatedChord, index) => (
              <button
                key={index}
                onClick={() => {
                  setChordRoot(relatedChord.root);
                  setChordQuality(relatedChord.quality);
                  setTimeout(() => {
                    const searchChord = getChordName(relatedChord.root, relatedChord.quality);
                    const positions = getChordPositions(searchChord);
                    setDisplayedPositions(positions);
                  }, 50);
                }}
                className="px-3 py-2 bg-[#242424] border border-blue-600/50 hover:border-blue-600 rounded-lg text-[#E5E5E5] text-sm font-medium hover:bg-[#2A2A2A] transition-all"
                title={relatedChord.relationship}
              >
                {getChordName(relatedChord.root, relatedChord.quality)}
                <span className="text-xs text-[#A3A3A3] ml-1">({relatedChord.relationship})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {(displayedPositions.length > 0 || displayedPowerPositions.length > 0) ? (
        <div>
          <h3 className="text-lg font-bold text-[#E5E5E5] mb-4">
            {chordType === 'standard' ? displayedPositions.length : displayedPowerPositions.length} Position{(chordType === 'standard' ? displayedPositions.length : displayedPowerPositions.length) !== 1 ? 's' : ''} for {chordType === 'standard' ? currentChordName : `${chordRoot}5`}
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
            {chordType === 'standard' && displayedPositions.map((position, index) => {
              const difficulty = calculateDifficulty(position.frets, position.baseFret);
              const notes = getChordNotes(chordRoot, chordQuality);
              const fretRange = getFretRange(position.frets, position.baseFret);

              return (
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
                  {/* Header with difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-[#1A1A1A]">
                      {position.name || `Position ${index + 1}`}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            color: i < difficulty.stars ? '#F59E0B' : '#525252',
                            fontSize: '14px'
                          }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>

                  <GuitarDiagram position={position} />

                  {/* Chord info */}
                  <div className="mt-3 text-xs space-y-1">
                    <div className="flex justify-between text-[#1A1A1A]">
                      <span className="font-semibold">Notes:</span>
                      <span>{notes.join(' ')}</span>
                    </div>
                    <div className="flex justify-between text-[#1A1A1A]">
                      <span className="font-semibold">Range:</span>
                      <span>{fretRange}</span>
                    </div>
                  </div>

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
              );
            })}
          </div>

          {/* Related Chords Section */}
          {chordType === 'standard' && chordQuality === 'major' && (
            <div className="mt-8 p-6 bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-lg">
              <h3 className="text-xl font-bold text-[#E5E5E5] mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-600" />
                Alternative & Related Chords
              </h3>

              {(() => {
                const related = getRelatedChords(chordRoot, chordQuality);
                return (
                  <div className="space-y-4">
                    {related.variations && (
                      <div>
                        <h4 className="text-sm font-bold text-[#E5E5E5] mb-2">Add Color to {currentChordName}:</h4>
                        <div className="flex flex-wrap gap-2">
                          {related.variations.map((chord, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                const [newRoot, newSuffix] = [chord.replace(/[^A-G#]/g, ''), chord.replace(/[A-G#]/g, '')];
                                setChordRoot(newRoot);
                                // Map suffix to quality - simplified for now
                                if (chord.includes('add9')) setChordQuality('add9');
                                else if (chord.includes('maj7')) setChordQuality('maj7');
                                else if (chord.includes('6')) setChordQuality('6');
                              }}
                              className="px-3 py-2 bg-[#0F0F0F] border border-blue-600 rounded text-[#E5E5E5] text-sm font-semibold hover:bg-[#242424] transition-all"
                            >
                              {chord}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {related.relatedMinors && (
                      <div>
                        <h4 className="text-sm font-bold text-[#E5E5E5] mb-2">Related Minor Chords:</h4>
                        <div className="flex flex-wrap gap-2">
                          {related.relatedMinors.map((chord, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                const cleanChord = chord.replace(' (Relative minor)', '');
                                const newRoot = cleanChord.replace('m', '');
                                setChordRoot(newRoot);
                                setChordQuality('minor');
                              }}
                              className="px-3 py-2 bg-[#0F0F0F] border border-blue-600 rounded text-[#E5E5E5] text-sm font-semibold hover:bg-[#242424] transition-all"
                            >
                              {chord}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <div className="mt-6 bg-[#242424] border border-[#2A2A2A] rounded-lg p-4">
            <h4 className="font-bold text-[#E5E5E5] mb-2">Diagram Legend:</h4>
            <ul className="text-sm text-[#A3A3A3] space-y-1">
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
          <p className="text-lg">No positions found for "{chordType === 'standard' ? currentChordName : `${chordRoot}5`}"</p>
          <p className="text-sm mt-2">Try a different chord name (e.g., C, Am, G, Dm)</p>
        </div>
      )}
      </div>
    </div>
  );
}
