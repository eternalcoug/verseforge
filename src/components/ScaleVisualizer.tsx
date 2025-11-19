import React, { useState } from 'react';
import { Play, Music, Grid3x3, Square, RefreshCw, ChevronDown } from 'lucide-react';
import { getScaleInfo, KEY_OPTIONS, ScaleType } from '../utils/scaleTheory';
import { Fretboard } from './Fretboard';
import { getInstrument } from '../utils/guitarInstrument';
import * as Tone from 'tone';
import {
  getRelativeScale,
  getChordsInScale,
  getCommonProgressions,
  generateNoteSequence,
  speedToBPM,
  getSpeedLabel,
  PlayDirection
} from '../utils/scaleEnhancements';

export function ScaleVisualizer() {
  const [selectedKey, setSelectedKey] = useState<string>('G');
  const [scaleType, setScaleType] = useState<ScaleType>('major');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScaleDegrees, setShowScaleDegrees] = useState(false);
  const [showNoteNames, setShowNoteNames] = useState(true);
  const [playDirection, setPlayDirection] = useState<PlayDirection>('ascending');
  const [playSpeed, setPlaySpeed] = useState(4); // 1-7 scale
  const [playingChordIndex, setPlayingChordIndex] = useState<number | null>(null);
  const [progressionsOpen, setProgressionsOpen] = useState(false);

  const scaleInfo = getScaleInfo(selectedKey, scaleType);

  console.log(`${selectedKey} ${scaleType}:`, scaleInfo.notes.join(' - '));

  const playScale = async () => {
    if (isPlaying) return;

    setIsPlaying(true);

    try {
      await Tone.start();
      const synth = await getInstrument();

      const sequence = generateNoteSequence(scaleInfo.notes, playDirection);
      const scaleNotes = sequence.map(note => `${note}4`);
      const bpm = speedToBPM(playSpeed);
      const noteInterval = (60000 / bpm) * 0.5; // Half beat per note

      console.log(`Playing scale ${playDirection} at ${bpm} BPM:`, scaleNotes.join(' - '));

      for (let i = 0; i < scaleNotes.length; i++) {
        const now = Tone.now();
        synth.triggerAttackRelease(scaleNotes[i], '8n', now);
        await new Promise(resolve => setTimeout(resolve, noteInterval));
      }

      await new Promise(resolve => setTimeout(resolve, 200));
      const now = Tone.now();
      synth.triggerAttackRelease(`${scaleInfo.root}5`, '4n', now);
    } catch (error) {
      console.error('Error playing scale:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const playChord = async (chordName: string, index: number) => {
    setPlayingChordIndex(index);
    try {
      await Tone.start();
      const synth = await getInstrument();

      // Simple chord voicing - root, third, fifth
      const root = chordName.replace(/[^A-G#]/g, '');
      const notes = [`${root}3`, `${root}4`];

      const now = Tone.now();
      notes.forEach(note => {
        synth.triggerAttackRelease(note, '2n', now);
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error playing chord:', error);
    } finally {
      setPlayingChordIndex(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Grid3x3 className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-[#E5E5E5]">Scale Visualizer</h1>
        </div>
        <p className="text-[#A3A3A3]">See how scales and modes look on the fretboard</p>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg shadow-xl border-2 border-[#2A2A2A] p-6">

      <div className="bg-[#242424] border-2 border-[#2A2A2A] rounded-lg p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#E5E5E5] font-bold mb-2">
              Key / Root Note
            </label>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="dark-select w-full text-lg"
            >
              {KEY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#E5E5E5] font-bold mb-2">
              Scale Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="scaleType"
                  value="major"
                  checked={scaleType === 'major'}
                  onChange={(e) => setScaleType(e.target.value as ScaleType)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg font-semibold text-[#E5E5E5]">Major</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="scaleType"
                  value="minor"
                  checked={scaleType === 'minor'}
                  onChange={(e) => setScaleType(e.target.value as ScaleType)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg font-semibold text-[#E5E5E5]">Minor</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="scaleType"
                  value="major-pentatonic"
                  checked={scaleType === 'major-pentatonic'}
                  onChange={(e) => setScaleType(e.target.value as ScaleType)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg font-semibold text-[#E5E5E5]">Major Pentatonic</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="scaleType"
                  value="minor-pentatonic"
                  checked={scaleType === 'minor-pentatonic'}
                  onChange={(e) => setScaleType(e.target.value as ScaleType)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg font-semibold text-[#E5E5E5]">Minor Pentatonic</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-amber-200">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-[#E5E5E5] mb-4">
              {selectedKey}{' '}
              {scaleType === 'major' && 'Major'}
              {scaleType === 'minor' && 'Natural Minor'}
              {scaleType === 'major-pentatonic' && 'Major Pentatonic'}
              {scaleType === 'minor-pentatonic' && 'Minor Pentatonic'}{' '}
              Scale
            </h3>

            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {scaleInfo.notes.map((note, index) => (
                <div
                  key={index}
                  className={`
                    px-6 py-4 rounded-lg font-bold text-2xl shadow-lg
                    ${note === scaleInfo.root
                      ? 'bg-red-600 text-white ring-4 ring-red-300'
                      : 'bg-blue-600 text-white ring-4 ring-blue-300'
                    }
                  `}
                >
                  {note}
                </div>
              ))}
            </div>

            <p className="text-[#A3A3A3] text-lg">
              <span className="font-bold">Intervals:</span>{' '}
              <span className="font-mono">
                {scaleType === 'major' && 'Root - 2nd - 3rd - 4th - 5th - 6th - 7th'}
                {scaleType === 'minor' && 'Root - 2nd - ♭3rd - 4th - 5th - ♭6th - ♭7th'}
                {scaleType === 'major-pentatonic' && 'Root - 2nd - 3rd - 5th - 6th'}
                {scaleType === 'minor-pentatonic' && 'Root - ♭3rd - 4th - 5th - ♭7th'}
              </span>
            </p>
            <p className="text-[#707070] text-sm mt-2">
              {scaleType === 'major' && 'Pattern: Whole - Whole - Half - Whole - Whole - Whole - Half (W-W-H-W-W-W-H)'}
              {scaleType === 'minor' && 'Pattern: Whole - Half - Whole - Whole - Half - Whole - Whole (W-H-W-W-H-W-W)'}
              {scaleType === 'major-pentatonic' && 'Pattern: Whole - Whole - Minor 3rd - Whole - Minor 3rd (W-W-m3-W-m3)'}
              {scaleType === 'minor-pentatonic' && 'Pattern: Minor 3rd - Whole - Whole - Minor 3rd - Whole (m3-W-W-m3-W)'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#E5E5E5] font-bold mb-2 text-sm">Direction:</label>
                <select
                  value={playDirection}
                  onChange={(e) => setPlayDirection(e.target.value as PlayDirection)}
                  className="dark-select w-full"
                >
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                  <option value="both">Both</option>
                  <option value="random">Random</option>
                </select>
              </div>
              <div>
                <label className="block text-[#E5E5E5] font-bold mb-2 text-sm">
                  Speed: {getSpeedLabel(playSpeed)} ({speedToBPM(playSpeed)} BPM)
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={playSpeed}
                  onChange={(e) => setPlaySpeed(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={playScale}
                  disabled={isPlaying}
                  className={`
                    w-full px-6 py-3 rounded-lg font-bold transition-all shadow-lg
                    flex items-center justify-center gap-2
                    ${isPlaying
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    }
                  `}
                >
                  {isPlaying ? <Square size={20} /> : <Play size={20} />}
                  {isPlaying ? 'Playing...' : 'Play Scale'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Relative Scale Section */}
        <div className="mt-6 p-4 bg-[#242424] border-2 border-blue-500/30 rounded-lg">
          {(() => {
            const relativeScale = getRelativeScale(selectedKey, scaleType);
            return (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#A3A3A3] text-sm">🔄 Relative Scale:</span>
                  <span className="ml-2 text-[#E5E5E5] font-bold">{relativeScale.name}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedKey(relativeScale.root);
                    setScaleType(relativeScale.type);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-semibold"
                >
                  Switch →
                </button>
              </div>
            );
          })()}
          <p className="text-xs text-[#707070] mt-2 italic">
            Relative scales share the same notes but start on different roots
          </p>
        </div>

        {/* Chords in Scale Section */}
        <div className="mt-6 p-6 bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-lg">
          <h3 className="text-xl font-bold text-[#E5E5E5] mb-4 flex items-center gap-2">
            <Music className="w-6 h-6 text-blue-600" />
            Chords in {selectedKey} {scaleType === 'major' ? 'Major' : scaleType === 'minor' ? 'Minor' : scaleType === 'major-pentatonic' ? 'Major Pentatonic' : 'Minor Pentatonic'}
          </h3>

          <div className="flex flex-wrap gap-2 mb-6">
            {getChordsInScale(selectedKey, scaleType).map((chord, index) => (
              <button
                key={index}
                onClick={() => playChord(chord.name, index)}
                className={`
                  px-4 py-2 rounded-lg font-bold transition-all border-2
                  ${playingChordIndex === index
                    ? 'bg-blue-600 border-blue-400 text-white scale-110'
                    : 'bg-[#1A1A1A] border-blue-600/50 text-[#E5E5E5] hover:border-blue-400 hover:bg-[#242424]'
                  }
                `}
              >
                <div className="text-xs text-[#A3A3A3] mb-1">{chord.romanNumeral}</div>
                <div>{chord.name}</div>
              </button>
            ))}
          </div>

          {/* Common Progressions - Accordion */}
          <div className="border-t border-[#2A2A2A] mt-4 pt-4">
            <button
              onClick={() => setProgressionsOpen(!progressionsOpen)}
              className="w-full flex items-center justify-between hover:bg-[#242424] p-2 rounded transition-colors"
            >
              <h4 className="font-bold text-[#E5E5E5] flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Common Progressions
              </h4>
              <ChevronDown
                className={`w-5 h-5 text-[#A3A3A3] transition-transform ${progressionsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {progressionsOpen && (
              <div className="space-y-4 mt-4">
                {getCommonProgressions(scaleType).map((prog, progIndex) => {
              const chords = getChordsInScale(selectedKey, scaleType);
              const progChords = prog.pattern.map(i => chords[i]);
              return (
                <div key={progIndex} className="p-3 bg-[#242424] rounded-lg border border-[#2A2A2A]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-[#E5E5E5]">{prog.name}</span>
                      <span className="ml-2 text-xs italic" style={{ color: '#F59E0B' }}>{prog.genre}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {progChords.map((chord, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-900/30 border border-blue-600/50 rounded text-[#E5E5E5] font-semibold">
                        {chord.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[#A3A3A3]">{prog.description}</p>
                </div>
              );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#E5E5E5] mb-2">
          Fretboard Diagram
        </h3>
        <p className="text-sm text-[#A3A3A3] mb-4">
          Click any note on the fretboard to hear it played. Hover over notes to see their scale degree.
        </p>
      </div>

      <Fretboard
        scaleNotes={scaleInfo.notes}
        rootNote={scaleInfo.root}
        scaleType={scaleType}
      />

      <div className="mt-6 bg-[#242424] border border-[#2A2A2A] rounded-lg p-4">
        <h4 className="font-bold text-[#E5E5E5] mb-3">How to Read This Diagram:</h4>

        <div className="mb-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600 ring-2 ring-red-400 flex items-center justify-center text-white text-xs font-bold">
              {scaleInfo.root}
            </div>
            <span className="text-sm font-semibold text-[#E5E5E5]">Root Note (starting note)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 ring-2 ring-blue-400 flex items-center justify-center text-white text-xs font-bold">
              {scaleInfo.notes[1] || 'X'}
            </div>
            <span className="text-sm font-semibold text-[#E5E5E5]">Other scale notes</span>
          </div>
        </div>

        <ul className="text-sm text-[#A3A3A3] space-y-1">
          <li>• <strong>Click any note</strong> to hear it played</li>
          <li>• <strong>Hover over notes</strong> to see their scale degree (Root, 2nd, 3rd, etc.)</li>
          <li>• <strong>Click "Play Scale"</strong> above to hear the entire scale with different directions and speeds</li>
          <li>• <strong>String layout:</strong> Top = high E (1st/thinnest), Bottom = low E (6th/thickest)</li>
          <li>• <strong>Fret numbers</strong> at top show positions (0 = open string, 12 = octave)</li>
          <li>• <strong>Dots above fretboard</strong> show fret markers (3, 5, 7, 9, 12)</li>
        </ul>
      </div>

      <div className="mt-4 bg-[#242424] border border-[#2A2A2A] rounded-lg p-4">
        <h4 className="font-bold text-[#E5E5E5] mb-2">Practice Tips:</h4>
        <ul className="text-sm text-[#A3A3A3] space-y-1">
          <li>• Try playing the scale from low to high on a single string</li>
          <li>• Practice horizontal patterns (across strings) and vertical patterns (along one string)</li>
          <li>• Memorize where the root notes are - they're your landmarks on the fretboard</li>
          <li>• Most country solos use Major scales and Major Pentatonic patterns</li>
          <li>• Pentatonic scales are easier to learn (only 5 notes) and great for improvising</li>
        </ul>
      </div>

      <div className="mt-4 bg-[#242424] border border-[#2A2A2A] rounded-lg p-4">
        <h4 className="font-bold text-[#E5E5E5] mb-3">Scale Examples (for reference):</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-[#A3A3A3]">
          <div>
            <p className="font-bold mb-1">C Major:</p>
            <p className="font-mono">C - D - E - F - G - A - B</p>
          </div>
          <div>
            <p className="font-bold mb-1">G Major:</p>
            <p className="font-mono">G - A - B - C - D - E - F#</p>
          </div>
          <div>
            <p className="font-bold mb-1">A Minor:</p>
            <p className="font-mono">A - B - C - D - E - F - G</p>
          </div>
          <div>
            <p className="font-bold mb-1">E Minor:</p>
            <p className="font-mono">E - F# - G - A - B - C - D</p>
          </div>
          <div>
            <p className="font-bold mb-1">G Major Pentatonic:</p>
            <p className="font-mono">G - A - B - D - E</p>
          </div>
          <div>
            <p className="font-bold mb-1">A Minor Pentatonic:</p>
            <p className="font-mono">A - C - D - E - G</p>
          </div>
        </div>
        <p className="text-xs text-[#707070] mt-3">
          <strong>Note:</strong> Notice how the scale pattern repeats across the fretboard.
          Learn one pattern and you can play it anywhere by starting on a different fret!
        </p>
      </div>
      </div>
    </div>
  );
}
