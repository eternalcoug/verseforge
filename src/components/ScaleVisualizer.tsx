import React, { useState } from 'react';
import { Play, Music, Grid3x3 } from 'lucide-react';
import { getScaleInfo, KEY_OPTIONS, ScaleType } from '../utils/scaleTheory';
import { Fretboard } from './Fretboard';
import { getInstrument } from '../utils/guitarInstrument';
import * as Tone from 'tone';

export function ScaleVisualizer() {
  const [selectedKey, setSelectedKey] = useState<string>('G');
  const [scaleType, setScaleType] = useState<ScaleType>('major');
  const [isPlaying, setIsPlaying] = useState(false);

  const scaleInfo = getScaleInfo(selectedKey, scaleType);

  console.log(`${selectedKey} ${scaleType}:`, scaleInfo.notes.join(' - '));

  const playScale = async () => {
    if (isPlaying) return;

    setIsPlaying(true);

    try {
      await Tone.start();
      const synth = await getInstrument();

      const scaleNotes = scaleInfo.notes.map(note => `${note}4`);

      console.log('Playing scale:', scaleNotes.join(' - '));

      for (let i = 0; i < scaleNotes.length; i++) {
        const now = Tone.now();
        synth.triggerAttackRelease(scaleNotes[i], '4n', now);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      await new Promise(resolve => setTimeout(resolve, 200));
      const now = Tone.now();
      synth.triggerAttackRelease(`${scaleInfo.root}5`, '2n', now);
    } catch (error) {
      console.error('Error playing scale:', error);
    } finally {
      setIsPlaying(false);
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
                  className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-lg font-semibold text-amber-900">Major</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="scaleType"
                  value="minor"
                  checked={scaleType === 'minor'}
                  onChange={(e) => setScaleType(e.target.value as ScaleType)}
                  className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-lg font-semibold text-amber-900">Minor</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="scaleType"
                  value="major-pentatonic"
                  checked={scaleType === 'major-pentatonic'}
                  onChange={(e) => setScaleType(e.target.value as ScaleType)}
                  className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-lg font-semibold text-amber-900">Major Pentatonic</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="scaleType"
                  value="minor-pentatonic"
                  checked={scaleType === 'minor-pentatonic'}
                  onChange={(e) => setScaleType(e.target.value as ScaleType)}
                  className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-lg font-semibold text-amber-900">Minor Pentatonic</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-amber-200">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-amber-900 mb-4">
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

            <p className="text-amber-800 text-lg">
              <span className="font-bold">Intervals:</span>{' '}
              <span className="font-mono">
                {scaleType === 'major' && 'Root - 2nd - 3rd - 4th - 5th - 6th - 7th'}
                {scaleType === 'minor' && 'Root - 2nd - ♭3rd - 4th - 5th - ♭6th - ♭7th'}
                {scaleType === 'major-pentatonic' && 'Root - 2nd - 3rd - 5th - 6th'}
                {scaleType === 'minor-pentatonic' && 'Root - ♭3rd - 4th - 5th - ♭7th'}
              </span>
            </p>
            <p className="text-amber-700 text-sm mt-2">
              {scaleType === 'major' && 'Pattern: Whole - Whole - Half - Whole - Whole - Whole - Half (W-W-H-W-W-W-H)'}
              {scaleType === 'minor' && 'Pattern: Whole - Half - Whole - Whole - Half - Whole - Whole (W-H-W-W-H-W-W)'}
              {scaleType === 'major-pentatonic' && 'Pattern: Whole - Whole - Minor 3rd - Whole - Minor 3rd (W-W-m3-W-m3)'}
              {scaleType === 'minor-pentatonic' && 'Pattern: Minor 3rd - Whole - Whole - Minor 3rd - Whole (m3-W-W-m3-W)'}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={playScale}
              disabled={isPlaying}
              className={`
                px-8 py-4 rounded-lg font-bold transition-all shadow-lg text-lg
                flex items-center gap-3
                ${isPlaying
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
                }
              `}
            >
              <Play size={24} />
              {isPlaying ? 'Playing Scale...' : 'Play Scale'}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-amber-900 mb-2">
          Fretboard Diagram
        </h3>
        <p className="text-sm text-amber-700 mb-4">
          Click any note on the fretboard to hear it played. Hover over notes to see their scale degree.
        </p>
      </div>

      <Fretboard
        scaleNotes={scaleInfo.notes}
        rootNote={scaleInfo.root}
        scaleType={scaleType}
      />

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-3">How to Read This Diagram:</h4>

        <div className="mb-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600 ring-2 ring-red-400 flex items-center justify-center text-white text-xs font-bold">
              {scaleInfo.root}
            </div>
            <span className="text-sm font-semibold text-blue-900">Root Note (starting note)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 ring-2 ring-blue-400 flex items-center justify-center text-white text-xs font-bold">
              {scaleInfo.notes[1] || 'X'}
            </div>
            <span className="text-sm font-semibold text-blue-900">Other scale notes</span>
          </div>
        </div>

        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Click any note</strong> to hear it played</li>
          <li>• <strong>Hover over notes</strong> to see their scale degree (Root, 2nd, 3rd, etc.)</li>
          <li>• <strong>Click "Play Scale"</strong> above to hear the entire scale ascending</li>
          <li>• <strong>String layout:</strong> Top = high E (1st/thinnest), Bottom = low E (6th/thickest)</li>
          <li>• <strong>Fret numbers</strong> at top show positions (0 = open string, 12 = octave)</li>
          <li>• <strong>Dots above fretboard</strong> show fret markers (3, 5, 7, 9, 12)</li>
        </ul>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-bold text-amber-900 mb-2">Practice Tips:</h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Try playing the scale from low to high on a single string</li>
          <li>• Practice horizontal patterns (across strings) and vertical patterns (along one string)</li>
          <li>• Memorize where the root notes are - they're your landmarks on the fretboard</li>
          <li>• Most country solos use Major scales and Major Pentatonic patterns</li>
          <li>• Pentatonic scales are easier to learn (only 5 notes) and great for improvising</li>
        </ul>
      </div>

      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-bold text-green-900 mb-3">Scale Examples (for reference):</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
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
        <p className="text-xs text-green-700 mt-3">
          <strong>Note:</strong> Notice how the scale pattern repeats across the fretboard.
          Learn one pattern and you can play it anywhere by starting on a different fret!
        </p>
      </div>
      </div>
    </div>
  );
}
