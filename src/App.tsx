import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Square, Download, Copy, RefreshCw, Volume2, Sparkles } from 'lucide-react';
import {
  NOTE_DISPLAY,
  NOTES,
  generateChordPool,
  generateProgression,
  formatProgressionText,
  Chord,
  LineType,
} from './utils/musicTheory';
import { ProgressionPlayer } from './utils/audioPlayer';
import { downloadMidi } from './utils/midiExport';
import { ProgressionDisplay } from './components/ProgressionDisplay';
import { InfoTooltip } from './components/InfoTooltip';
import { ChordReference } from './components/ChordReference';
import { ChordPositionFinder } from './components/ChordPositionFinder';
import { ScaleVisualizer } from './components/ScaleVisualizer';
import { Tuner } from './components/Tuner';
import RhymingDictionary from './components/RhymingDictionary';
import { SongStructureBuilder } from './components/SongStructureBuilder';
import { Home } from './components/Home';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

type Mode = 'major' | 'minor';
type ActiveTab = 'home' | 'generator' | 'reference' | 'positions' | 'scales' | 'tuner' | 'rhymes' | 'songbuilder';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [rootNote, setRootNote] = useState<string>('C');
  const [mode, setMode] = useState<Mode>('major');
  const [includeBorrowed, setIncludeBorrowed] = useState(false);
  const [numLines, setNumLines] = useState(4);
  const [chordsPerLine, setChordsPerLine] = useState(4);
  const [lineTypes, setLineTypes] = useState<LineType[]>(Array(8).fill('country-standard'));
  const [bpm, setBpm] = useState(100);

  const [progression, setProgression] = useState<Chord[][] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingLine, setCurrentPlayingLine] = useState<number | undefined>();
  const [currentPlayingChord, setCurrentPlayingChord] = useState<number | undefined>();

  const playerRef = useRef<ProgressionPlayer | null>(null);

  useEffect(() => {
    playerRef.current = new ProgressionPlayer();
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  const handleGenerate = () => {
    const chordPool = generateChordPool(NOTES[NOTE_DISPLAY.indexOf(rootNote)], mode, includeBorrowed);
    const newProgression = generateProgression(chordPool, numLines, chordsPerLine, lineTypes, mode);
    setProgression(newProgression);
    setCurrentPlayingLine(undefined);
    setCurrentPlayingChord(undefined);
  };

  const handlePlay = async () => {
    if (!progression || !playerRef.current) return;

    if (isPlaying) {
      playerRef.current.stop();
      setIsPlaying(false);
      setCurrentPlayingLine(undefined);
      setCurrentPlayingChord(undefined);
    } else {
      setIsPlaying(true);
      await playerRef.current.play(progression, bpm, (lineIndex, chordIndex) => {
        setCurrentPlayingLine(lineIndex);
        setCurrentPlayingChord(chordIndex);
      });
      setIsPlaying(false);
      setCurrentPlayingLine(undefined);
      setCurrentPlayingChord(undefined);
    }
  };

  const handleCopyToClipboard = () => {
    if (!progression) return;
    const text = formatProgressionText(progression, chordsPerLine);
    navigator.clipboard.writeText(text);
  };

  const handleExportMidi = () => {
    if (!progression) return;
    downloadMidi(progression, bpm, 'country-progression.mid');
  };

  const handleLineTypeChange = (lineIndex: number, newType: LineType) => {
    const newLineTypes = [...lineTypes];
    newLineTypes[lineIndex] = newType;
    setLineTypes(newLineTypes);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] noise-texture relative flex flex-col">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10 flex-1">

        {activeTab === 'home' && <Home />}

        {activeTab === 'generator' && (
        <>
        <div className="max-w-6xl mx-auto mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl font-bold text-[#E5E5E5]">Chord Progression Generator</h1>
            </div>
            <p className="text-[#A3A3A3]">Create authentic chord progressions in any key</p>
          </div>
        </div>

        <div className="dark-card mb-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[#E5E5E5] font-bold mb-2">
                Key
                <InfoTooltip
                  title="Selecting Your Key"
                  content="Choose the root note that your song will be based on. This determines which chords are available in your progression."
                />
              </label>
              <select
                value={rootNote}
                onChange={(e) => setRootNote(e.target.value)}
                className="dark-select w-full"
              >
                {NOTE_DISPLAY.map(note => (
                  <option key={note} value={note}>{note}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#E5E5E5] font-bold mb-2">
                Mode
                <InfoTooltip
                  title="Major vs Minor"
                  content={[
                    "Major: Bright, happy sound common in upbeat country songs",
                    "Minor: Darker, sadder sound for emotional ballads"
                  ]}
                />
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="major"
                    checked={mode === 'major'}
                    onChange={() => setMode('major')}
                    className="w-5 h-5 text-amber-600"
                  />
                  <span className="text-[#E5E5E5] font-medium">Major</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="minor"
                    checked={mode === 'minor'}
                    onChange={() => setMode('minor')}
                    className="w-5 h-5 text-amber-600"
                  />
                  <span className="text-[#E5E5E5] font-medium">Minor</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBorrowed}
                onChange={(e) => setIncludeBorrowed(e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded"
              />
              <span className="text-amber-900 font-bold">
                Include Borrowed Chords
                <InfoTooltip
                  title="What are Borrowed Chords?"
                  content={[
                    "Borrowed chords come from the parallel key (major/minor)",
                    "They add color and emotional depth to progressions",
                    "Common in country: iv chord in major keys (e.g., Fm in C major)",
                    "Creates that classic 'bittersweet' country sound"
                  ]}
                />
              </span>
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[#E5E5E5] font-bold mb-2">
                Number of Lines (1-8)
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={numLines}
                onChange={(e) => setNumLines(Math.min(8, Math.max(1, parseInt(e.target.value) || 1)))}
                className="dark-input w-full"
              />
            </div>

            <div>
              <label className="block text-[#E5E5E5] font-bold mb-2">
                Chords per Line (2-8)
              </label>
              <input
                type="number"
                min="2"
                max="8"
                value={chordsPerLine}
                onChange={(e) => setChordsPerLine(Math.min(8, Math.max(2, parseInt(e.target.value) || 2)))}
                className="dark-input w-full"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-amber-900 font-bold mb-3">
              Line Settings
              <InfoTooltip
                title="Line Type Options"
                content={[
                  "Major chords only: Bright, stable sound",
                  "Minor chords only: Darker, emotional feel",
                  "Major + Borrowed: Mix of standard and borrowed chords",
                  "All available: Any chord from your pool",
                  "Standard: Emphasizes I-IV-V-vi (most common chords)"
                ]}
              />
            </label>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: numLines }).map((_, index) => (
                <div key={index} className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <label className="block text-amber-800 font-semibold mb-2 text-sm">
                    Line {index + 1}
                  </label>
                  <select
                    value={lineTypes[index]}
                    onChange={(e) => handleLineTypeChange(index, e.target.value as LineType)}
                    className="dark-select w-full !py-1 !px-2 text-sm"
                  >
                    <option value="major-only">Major chords only</option>
                    <option value="minor-only">Minor chords only</option>
                    <option value="major-borrowed">Major + Borrowed</option>
                    <option value="all">All available</option>
                    <option value="country-standard">Standard</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
          >
            <RefreshCw size={24} />
            Generate Progression
          </button>
        </div>

        {progression && (
          <>
            <ProgressionDisplay
              progression={progression}
              currentPlayingLine={currentPlayingLine}
              currentPlayingChord={currentPlayingChord}
            />

            <div className="bg-[#1A1A1A] rounded-lg shadow-xl border-2 border-amber-500 p-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[#E5E5E5] font-bold mb-2">
                    Tempo (BPM)
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-amber-700 font-bold text-lg mt-2">
                    {bpm} BPM
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handlePlay}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                      isPlaying
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square size={20} />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        Play Progression
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={async () => {
                    if (playerRef.current) {
                      await playerRef.current.testSound();
                    }
                  }}
                  className="dark-button-primary w-full flex items-center justify-center gap-2"
                >
                  <Volume2 size={20} />
                  Test Sound
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Copy size={20} />
                  Copy to Clipboard
                </button>

                <button
                  onClick={handleExportMidi}
                  className="dark-button-primary w-full flex items-center justify-center gap-2 !bg-purple-600 !hover:bg-purple-700"
                >
                  <Download size={20} />
                  Export as MIDI
                </button>
              </div>
            </div>
          </>
        )}
        </>
        )}

        {activeTab === 'reference' && <ChordReference onNavigateToChordFinder={() => setActiveTab('positions')} />}

        {activeTab === 'positions' && <ChordPositionFinder onNavigateToReference={() => setActiveTab('reference')} />}

        {activeTab === 'scales' && <ScaleVisualizer />}

        {activeTab === 'tuner' && <Tuner />}

        {activeTab === 'rhymes' && <RhymingDictionary />}

        {activeTab === 'songbuilder' && <SongStructureBuilder />}
      </div>

      <Footer />
    </div>
  );
}

export default App;
