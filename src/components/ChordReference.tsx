import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, Star, X, Music, Play, Guitar, Plus, Trash2, Download, Upload } from 'lucide-react';
import { getDiatonicChords, getBorrowedChords, DiatonicChord } from '../utils/chordTheory';
import { ProgressionPlayer } from '../utils/audioPlayer';
import { saveProgression, loadProgression, saveChordContext, clearProgression } from '../utils/progressionManager';

const KEY_OPTIONS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const playerInstance = new ProgressionPlayer();

// FEATURE 1: Chord information for modals
const CHORD_FUNCTIONS: Record<string, {
  function: string;
  description: string;
  commonUses: string[];
}> = {
  'I': {
    function: 'Tonic',
    description: 'Home base, stable and resolved',
    commonUses: ['Start of progressions', 'End of progressions', 'Provides stability']
  },
  'ii': {
    function: 'Supertonic',
    description: 'Movement chord, creates forward motion',
    commonUses: ['Leads to V', 'Part of ii-V-I', 'Pre-dominant']
  },
  'iii': {
    function: 'Mediant',
    description: 'Subtle color, smooth transition',
    commonUses: ['Substitute for I', 'Smooth voice leading', 'Passing chord']
  },
  'IV': {
    function: 'Subdominant',
    description: 'Movement away from tonic',
    commonUses: ['After I', 'Before V', 'I-IV-V progressions']
  },
  'V': {
    function: 'Dominant',
    description: 'Strong pull back to I',
    commonUses: ['Resolves to I', 'Creates tension', 'Cadences']
  },
  'vi': {
    function: 'Submediant',
    description: 'Minor feel in major key',
    commonUses: ['Deceptive cadence', 'Emotional progressions', 'Substitute for I']
  },
  'vii°': {
    function: 'Leading Tone',
    description: 'Unstable, strongly leads to I',
    commonUses: ['Passing chord', 'Leads to I', 'Rarely used in pop/rock']
  },
  'iv': {
    function: 'Minor Subdominant',
    description: 'Adds emotional depth, borrowed from minor',
    commonUses: ['Creates melancholy feel', 'Common in country', 'Before V or I']
  },
  '♭VII': {
    function: 'Subtonic',
    description: 'Bluesy, rock sound',
    commonUses: ['Rock progressions', 'Creates tension', 'Borrowed from minor']
  }
};

// FEATURE 4: Common progressions library
interface CommonProgression {
  name: string;
  numerals: string[];
  genre: string;
  description: string;
  isCountry?: boolean;
}

const COMMON_PROGRESSIONS: CommonProgression[] = [
  {
    name: 'I - IV - V - I',
    numerals: ['I', 'IV', 'V', 'I'],
    genre: 'Country/Rock',
    description: 'Classic country and rock progression used in thousands of songs',
    isCountry: true
  },
  {
    name: 'I - V - vi - IV',
    numerals: ['I', 'V', 'vi', 'IV'],
    genre: 'Pop/Modern Country',
    description: 'Extremely popular in modern music - the "four chord song"',
    isCountry: true
  },
  {
    name: 'I - vi - IV - V',
    numerals: ['I', 'vi', 'IV', 'V'],
    genre: '50s/Doo-wop/Country',
    description: 'Classic progression from the 1950s, still used today',
    isCountry: true
  },
  {
    name: 'vi - IV - I - V',
    numerals: ['vi', 'IV', 'I', 'V'],
    genre: 'Indie/Pop/Country',
    description: 'Modern pop and indie progression with emotional start',
    isCountry: false
  },
  {
    name: 'I - V - IV',
    numerals: ['I', 'V', 'IV'],
    genre: 'Country/Rock',
    description: 'Simple three-chord classic for verse sections',
    isCountry: true
  },
  {
    name: 'I - IV - I - V',
    numerals: ['I', 'IV', 'I', 'V'],
    genre: 'Country',
    description: 'Traditional country turnaround progression',
    isCountry: true
  },
  {
    name: 'I - iii - IV - iv',
    numerals: ['I', 'iii', 'IV', 'iv'],
    genre: 'Country',
    description: 'Uses chromatic descent with borrowed iv chord',
    isCountry: true
  },
  {
    name: 'I - ♭VII - IV',
    numerals: ['I', '♭VII', 'IV'],
    genre: 'Rock',
    description: 'Classic rock progression with borrowed ♭VII',
    isCountry: false
  }
];

// FEATURE 2: Chord type options
type ChordType = 'triads' | 'sevenths' | 'extended';

interface ChordReferenceProps {
  onNavigateToChordFinder?: () => void;
}

export function ChordReference({ onNavigateToChordFinder }: ChordReferenceProps = {}) {
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedMode, setSelectedMode] = useState<'major' | 'minor'>('major');
  const [playingChord, setPlayingChord] = useState<string | null>(null);

  // FEATURE 1: Modal state
  const [selectedChord, setSelectedChord] = useState<DiatonicChord | null>(null);

  // FEATURE 2: Chord type state
  const [chordType, setChordType] = useState<ChordType>('triads');

  // FEATURE 3: Progression builder state
  const [progression, setProgression] = useState<DiatonicChord[]>([]);
  const [playingProgressionIndex, setPlayingProgressionIndex] = useState<number | null>(null);
  const [hasImportedProgression, setHasImportedProgression] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    const saved = loadProgression();
    if (saved && saved.source === 'chord-finder') {
      setHasImportedProgression(true);
    }
  }, []);

  // FEATURE 4: Common progressions state
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [showMoreProgressions, setShowMoreProgressions] = useState(false);

  const diatonicChords = getDiatonicChords(selectedKey, selectedMode, chordType === 'sevenths');
  const borrowedChords = getBorrowedChords(selectedKey, selectedMode, chordType === 'sevenths');

  // Helper to get chord notes
  const getChordNotes = (chord: DiatonicChord): string[] => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = notes.indexOf(chord.root);

    let intervals: number[];
    if (chord.quality === 'major') {
      intervals = [0, 4, 7];
    } else if (chord.quality === 'minor') {
      intervals = [0, 3, 7];
    } else if (chord.quality === 'diminished') {
      intervals = [0, 3, 6];
    } else if (chord.quality === 'maj7') {
      intervals = [0, 4, 7, 11];
    } else if (chord.quality === 'min7') {
      intervals = [0, 3, 7, 10];
    } else if (chord.quality === 'dom7') {
      intervals = [0, 4, 7, 10];
    } else if (chord.quality === 'm7b5') {
      intervals = [0, 3, 6, 10];
    } else if (chord.quality === 'dim7') {
      intervals = [0, 3, 6, 9];
    } else {
      intervals = [0, 4, 7];
    }

    return intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes[noteIndex];
    });
  };

  const playChord = async (chord: DiatonicChord) => {
    if (playingChord === chord.display) return;

    setPlayingChord(chord.display);

    await playerInstance.ensureInstrument();

    const notes = getChordNotes(chord);
    const notesWithOctaves = notes.map(n => `${n}4`);

    if (playerInstance['synth']) {
      playerInstance['synth'].triggerAttackRelease(notesWithOctaves, '2n');
    }

    setTimeout(() => setPlayingChord(null), 2000);
  };

  // FEATURE 1: Handle chord click to open modal
  const handleChordClick = (chord: DiatonicChord, e: React.MouseEvent) => {
    // If shift/ctrl key, play chord
    if (e.shiftKey || e.ctrlKey) {
      playChord(chord);
    } else {
      setSelectedChord(chord);
    }
  };

  // FEATURE 3: Add chord to progression
  const addToProgression = (chord: DiatonicChord) => {
    if (progression.length < 8) {
      setProgression([...progression, chord]);
    }
  };

  // FEATURE 3: Remove chord from progression
  const removeFromProgression = (index: number) => {
    setProgression(progression.filter((_, i) => i !== index));
  };

  // FEATURE 3: Play progression
  const playProgression = async () => {
    if (progression.length === 0) return;

    await playerInstance.ensureInstrument();

    for (let i = 0; i < progression.length; i++) {
      setPlayingProgressionIndex(i);

      const notes = getChordNotes(progression[i]);
      const notesWithOctaves = notes.map(n => `${n}4`);

      if (playerInstance['synth']) {
        playerInstance['synth'].triggerAttackRelease(notesWithOctaves, '2n');
      }

      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    setPlayingProgressionIndex(null);
  };

  // FEATURE 4: Load common progression
  const loadCommonProgression = (progressionNumerals: string[]) => {
    const allChords = [...diatonicChords, ...borrowedChords];
    const chords = progressionNumerals.map(numeral => {
      return allChords.find(c => c.romanNumeral === numeral);
    }).filter(c => c !== undefined) as DiatonicChord[];

    setProgression(chords);

    // Scroll to progression builder
    setTimeout(() => {
      document.getElementById('progression-builder')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Phase 2: Export progression
  const exportProgression = () => {
    if (progression.length === 0) return;

    saveProgression({
      chords: progression.map(c => c.display),
      key: selectedKey,
      mode: selectedMode,
      source: 'chord-reference',
      timestamp: Date.now()
    });

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // Phase 2: Import progression
  const importProgression = () => {
    const saved = loadProgression();
    if (!saved) return;

    const allChords = [...diatonicChords, ...borrowedChords];
    const importedChords: DiatonicChord[] = [];

    saved.chords.forEach(chordName => {
      const found = allChords.find(c => c.display === chordName);
      if (found) {
        importedChords.push(found);
      }
    });

    if (importedChords.length > 0) {
      setProgression(importedChords);
      setHasImportedProgression(false);
      clearProgression();
    }
  };

  // Phase 1: Navigate to Chord Finder with context
  const navigateToChordFinder = (chord: DiatonicChord) => {
    saveChordContext(chord.display, selectedKey);
    if (onNavigateToChordFinder) {
      onNavigateToChordFinder();
    }
  };

  // Filter progressions by genre
  const filteredProgressions = genreFilter === 'all'
    ? COMMON_PROGRESSIONS
    : genreFilter === 'country'
    ? COMMON_PROGRESSIONS.filter(p => p.isCountry)
    : COMMON_PROGRESSIONS.filter(p => p.genre.toLowerCase().includes(genreFilter.toLowerCase()));

  const displayedProgressions = showMoreProgressions ? filteredProgressions : filteredProgressions.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BookOpen className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-[#E5E5E5]">Chord Reference</h1>
        </div>
        <p className="text-[#A3A3A3]">Explore diatonic chords in any key and scale</p>
        <p className="text-sm text-[#666] mt-2">
          <Guitar size={14} className="inline mr-1" />
          Hover over any chord to see guitar positions in Chord Finder
        </p>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg shadow-xl border-2 border-[#2A2A2A] p-6">

      {/* FEATURE 2: Chord Type Selector */}
      <div className="mb-6 p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg">
        <div className="grid md:grid-cols-3 gap-4">
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
            <label className="block text-[#E5E5E5] font-bold mb-2">Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="major"
                  checked={selectedMode === 'major'}
                  onChange={() => setSelectedMode('major')}
                  className="w-4 h-4 text-blue-600 accent-blue-600"
                />
                <span className="text-[#E5E5E5] font-medium">Major</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="minor"
                  checked={selectedMode === 'minor'}
                  onChange={() => setSelectedMode('minor')}
                  className="w-4 h-4 text-blue-600 accent-blue-600"
                />
                <span className="text-[#E5E5E5] font-medium">Minor</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#E5E5E5] font-bold mb-2">Chord Type</label>
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setChordType('triads')}
                className={`px-3 py-1 rounded ${
                  chordType === 'triads'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1A1A1A] text-[#A3A3A3] hover:text-[#E5E5E5]'
                }`}
              >
                Triads
              </button>
              <button
                onClick={() => setChordType('sevenths')}
                className={`px-3 py-1 rounded ${
                  chordType === 'sevenths'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1A1A1A] text-[#A3A3A3] hover:text-[#E5E5E5]'
                }`}
              >
                7th Chords
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-bold text-blue-400">
            {chordType === 'sevenths' ? 'Diatonic 7th Chords' : 'Diatonic Chords'} (Key of {selectedKey} {selectedMode})
          </h3>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {diatonicChords.map((chord, index) => (
            <div key={index} className="relative group">
              <button
                onClick={(e) => handleChordClick(chord, e)}
                className={`
                  relative p-4 rounded-lg border-2 transition-all cursor-pointer w-full
                  ${playingChord === chord.display
                    ? 'bg-blue-600 border-blue-700 text-white scale-105 shadow-lg'
                    : 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200 hover:border-blue-400 hover:scale-103 hover:shadow-md'
                  }
                `}
                style={{
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-bold">{chord.display}</span>
                  <span className="text-sm font-medium opacity-80">{chord.romanNumeral}</span>
                  {playingChord === chord.display && (
                    <Volume2 size={16} className="absolute top-1 right-1 animate-pulse" />
                  )}
                </div>
              </button>
              <button
                onClick={() => navigateToChordFinder(chord)}
                className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-blue-900/80 rounded hover:bg-blue-800 z-10"
                title="View guitar positions"
              >
                <Guitar size={12} className="text-white" />
              </button>
            </div>
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
            <div key={index} className="relative group">
              <button
                onClick={(e) => handleChordClick(chord, e)}
                className={`
                  relative p-4 rounded-lg border-2 transition-all cursor-pointer w-full
                  ${playingChord === chord.display
                    ? 'bg-orange-600 border-orange-700 text-white scale-105 shadow-lg'
                    : 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200 hover:border-orange-400 hover:scale-103 hover:shadow-md'
                  }
                `}
                style={{
                  transition: 'all 0.2s ease'
                }}
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
              <button
                onClick={() => navigateToChordFinder(chord)}
                className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-orange-900/80 rounded hover:bg-orange-800 z-10"
                title="View guitar positions"
              >
                <Guitar size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
        <p className="text-sm text-[#A3A3A3] mt-3 flex items-center gap-2">
          <Star size={14} className="fill-yellow-400 text-yellow-500" />
          Indicates chords commonly used in country music
        </p>
      </div>
      </div>

      {/* FEATURE 3: Progression Builder */}
      <div id="progression-builder" className="mt-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#E5E5E5] mb-4 flex items-center gap-2">
          <Music className="w-6 h-6 text-blue-600" />
          Build Your Progression
        </h3>

        <p className="text-sm text-[#A3A3A3] mb-4">
          Click any chord above to add it here
        </p>

        <div className="mb-4">
          <div className="text-sm font-semibold text-[#E5E5E5] mb-2">Your Progression:</div>
          {progression.length === 0 ? (
            <div className="text-[#A3A3A3] text-center py-8 border-2 border-dashed border-[#2A2A2A] rounded-lg">
              Click chords above to build your progression
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {progression.map((chord, index) => (
                <button
                  key={index}
                  onClick={() => removeFromProgression(index)}
                  className={`
                    inline-flex flex-col items-center bg-[#0F0F0F] border-2 rounded-lg px-4 py-3
                    transition-all cursor-pointer
                    ${playingProgressionIndex === index
                      ? 'border-green-500 bg-green-900/20 scale-105'
                      : 'border-blue-600 hover:bg-[#242424] hover:scale-105'
                    }
                  `}
                  title="Click to remove"
                >
                  <span className="text-xl font-semibold text-[#E5E5E5]">{chord.display}</span>
                  <span className="text-sm text-[#A3A3A3]">{chord.romanNumeral}</span>
                </button>
              ))}
              {progression.length < 8 && (
                <button
                  className="inline-flex flex-col items-center justify-center bg-transparent border-2 border-dashed border-blue-600 rounded-lg px-4 py-3 text-blue-600 hover:bg-[#242424] transition-all min-w-[80px]"
                  onClick={() => {}}
                >
                  <Plus size={20} />
                  <span className="text-xs mt-1">Add</span>
                </button>
              )}
            </div>
          )}
          {progression.length >= 8 && (
            <p className="text-xs text-yellow-500 mt-2">Maximum 8 chords reached</p>
          )}
        </div>

        {hasImportedProgression && progression.length === 0 && (
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600/50 rounded-lg">
            <p className="text-sm text-blue-300 mb-2">Progression available from Chord Finder</p>
            <button
              onClick={importProgression}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
            >
              <Upload size={16} />
              Import Progression
            </button>
          </div>
        )}

        {progression.length > 0 && (
          <>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={playProgression}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <Play size={18} />
                Play Progression
              </button>
              <button
                onClick={exportProgression}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <Download size={18} />
                Export to Chord Finder
              </button>
              <button
                onClick={() => setProgression([])}
                className="px-6 py-3 bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <Trash2 size={18} />
                Clear
              </button>
            </div>
            {exportSuccess && (
              <div className="mt-3 p-3 bg-green-900/20 border border-green-600 rounded-lg">
                <p className="text-green-400 font-semibold flex items-center gap-2">
                  <Download size={16} />
                  Progression exported successfully! Go to Chord Finder to import it.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* FEATURE 4: Common Progressions Library */}
      <div className="mt-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#E5E5E5] mb-4">
          💡 Common Progressions in {selectedKey} {selectedMode}
        </h3>

        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setGenreFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              genreFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-[#0F0F0F] text-[#A3A3A3] hover:text-[#E5E5E5]'
            }`}
          >
            All Genres
          </button>
          <button
            onClick={() => setGenreFilter('country')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
              genreFilter === 'country'
                ? 'bg-blue-600 text-white'
                : 'bg-[#0F0F0F] text-[#A3A3A3] hover:text-[#E5E5E5]'
            }`}
          >
            <Star size={14} className="fill-yellow-400 text-yellow-500" />
            Country
          </button>
          <button
            onClick={() => setGenreFilter('rock')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              genreFilter === 'rock'
                ? 'bg-blue-600 text-white'
                : 'bg-[#0F0F0F] text-[#A3A3A3] hover:text-[#E5E5E5]'
            }`}
          >
            Rock
          </button>
          <button
            onClick={() => setGenreFilter('pop')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              genreFilter === 'pop'
                ? 'bg-blue-600 text-white'
                : 'bg-[#0F0F0F] text-[#A3A3A3] hover:text-[#E5E5E5]'
            }`}
          >
            Pop
          </button>
        </div>

        <div className="space-y-4">
          {displayedProgressions.map((prog, index) => {
            const allChords = [...diatonicChords, ...borrowedChords];
            const chordNames = prog.numerals.map(numeral => {
              const chord = allChords.find(c => c.romanNumeral === numeral);
              return chord?.display || numeral;
            });

            return (
              <div
                key={index}
                className="bg-[#0F0F0F] border border-[#2A2A2A] border-l-4 border-l-amber-500 rounded-lg p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-[#E5E5E5] flex items-center gap-2">
                      {prog.isCountry && <Star size={16} className="fill-yellow-400 text-yellow-500" />}
                      {prog.name}
                      <span className="text-xs font-normal text-amber-500 italic">({prog.genre})</span>
                    </h4>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-[#E5E5E5] font-medium mb-1">
                    {chordNames.join(' → ')}
                  </div>
                  <div className="text-sm text-[#A3A3A3]">
                    {prog.numerals.join(' → ')}
                  </div>
                </div>

                <p className="text-sm text-[#A3A3A3] mb-4">{prog.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => loadCommonProgression(prog.numerals)}
                    className="px-4 py-2 bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all font-medium text-sm"
                  >
                    Load This
                  </button>
                  <button
                    onClick={async () => {
                      const chords = prog.numerals.map(numeral => {
                        return allChords.find(c => c.romanNumeral === numeral);
                      }).filter(c => c !== undefined) as DiatonicChord[];

                      await playerInstance.ensureInstrument();
                      for (let chord of chords) {
                        const notes = getChordNotes(chord);
                        const notesWithOctaves = notes.map(n => `${n}4`);
                        if (playerInstance['synth']) {
                          playerInstance['synth'].triggerAttackRelease(notesWithOctaves, '2n');
                        }
                        await new Promise(resolve => setTimeout(resolve, 1200));
                      }
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-medium text-sm flex items-center gap-1"
                  >
                    <Play size={14} />
                    Play
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProgressions.length > 3 && (
          <button
            onClick={() => setShowMoreProgressions(!showMoreProgressions)}
            className="mt-4 w-full px-4 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-[#E5E5E5] hover:bg-[#242424] rounded-lg transition-all font-medium"
          >
            {showMoreProgressions ? '▲ Show Less' : `▼ Show ${filteredProgressions.length - 3} More Progressions`}
          </button>
        )}
      </div>

      {/* FEATURE 1: Chord Detail Modal */}
      {selectedChord && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedChord(null)}
        >
          <div
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#E5E5E5] flex items-center gap-2">
                📊 {selectedChord.display} - {CHORD_FUNCTIONS[selectedChord.romanNumeral]?.function || 'Chord'} ({selectedChord.romanNumeral})
              </h2>
              <button
                onClick={() => setSelectedChord(null)}
                className="text-[#A3A3A3] hover:text-[#E5E5E5] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-[#A3A3A3] mb-1">Full Name:</div>
                <div className="text-lg text-[#E5E5E5]">
                  {selectedChord.root} {selectedChord.quality === 'major' ? 'Major' : selectedChord.quality === 'minor' ? 'Minor' : selectedChord.quality === 'diminished' ? 'Diminished' : 'm7♭5'}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#A3A3A3] mb-1">Notes:</div>
                <div className="text-lg text-[#E5E5E5]">
                  {getChordNotes(selectedChord).join(' - ')}
                </div>
              </div>

              {CHORD_FUNCTIONS[selectedChord.romanNumeral] && (
                <>
                  <div className="border-t border-[#2A2A2A] pt-4">
                    <div className="text-sm font-semibold text-[#A3A3A3] mb-1">Function:</div>
                    <div className="text-lg text-[#E5E5E5] mb-2">
                      {CHORD_FUNCTIONS[selectedChord.romanNumeral].function}
                    </div>
                    <div className="text-sm text-[#A3A3A3]">
                      {CHORD_FUNCTIONS[selectedChord.romanNumeral].description}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-[#A3A3A3] mb-2">Common Uses:</div>
                    <ul className="space-y-1">
                      {CHORD_FUNCTIONS[selectedChord.romanNumeral].commonUses.map((use, i) => (
                        <li key={i} className="text-sm text-[#A3A3A3] flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className="border-t border-[#2A2A2A] pt-4 flex gap-3">
                <button
                  onClick={() => playChord(selectedChord)}
                  className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Play size={18} />
                  Play {selectedChord.display}
                </button>
                <button
                  onClick={() => {
                    navigateToChordFinder(selectedChord);
                    setSelectedChord(null);
                  }}
                  className="flex-1 px-6 py-3 bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Guitar size={18} />
                  View Positions
                </button>
              </div>
              <button
                onClick={() => {
                  addToProgression(selectedChord);
                  setSelectedChord(null);
                }}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add to Progression Builder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
