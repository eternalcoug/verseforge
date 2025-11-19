import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { getInstrument } from '../utils/guitarInstrument';
import {
  GUITAR_6_TUNINGS,
  UKULELE_TUNINGS,
  GUITAR_12_TUNINGS,
  StringTuning
} from '../utils/tuningConfigurations';
import { Music, ChevronDown } from 'lucide-react';

export function Tuner() {
  const [selectedGuitar6Tuning, setSelectedGuitar6Tuning] = useState<string>('standard');
  const [selectedUkuleleTuning, setSelectedUkuleleTuning] = useState<string>('standardC');
  const [selectedGuitar12Tuning, setSelectedGuitar12Tuning] = useState<string>('standard');
  const [playingString, setPlayingString] = useState<string | null>(null);
  const [ukuleleOpen, setUkuleleOpen] = useState(false);
  const [guitar12Open, setGuitar12Open] = useState(false);
  const synthRef = useRef<Tone.Synth | null>(null);

  const stopTuningNote = () => {
    if (synthRef.current) {
      synthRef.current.triggerRelease();

      setTimeout(() => {
        if (synthRef.current) {
          synthRef.current.dispose();
          synthRef.current = null;
        }
      }, 200);
    }

    setPlayingString(null);
  };

  const playTuningNote = async (fullNote: string, stringId: string) => {
    try {
      if (playingString === stringId && synthRef.current) {
        stopTuningNote();
        return;
      }

      if (synthRef.current) {
        stopTuningNote();
      }

      await Tone.start();

      console.log(`Playing pure tone: ${fullNote}`);

      setPlayingString(stringId);

      synthRef.current = new Tone.Synth({
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.05,
          decay: 0,
          sustain: 1,
          release: 0.1
        }
      }).toDestination();

      synthRef.current.volume.value = -6;

      synthRef.current.triggerAttack(fullNote);

    } catch (error) {
      console.error('Error playing tuning note:', error);
      stopTuningNote();
    }
  };

  useEffect(() => {
    return () => {
      stopTuningNote();
    };
  }, []);

  const renderTuningPeg = (
    stringInfo: StringTuning,
    instrumentType: string,
    side: 'left' | 'right',
    is12String: boolean = false
  ) => {
    const stringId = `${instrumentType}-${stringInfo.stringNumber}`;
    const isPlaying = playingString === stringId;

    return (
      <button
        key={stringId}
        onClick={() => playTuningNote(stringInfo.fullNote, stringId)}
        className={`
          group relative flex ${side === 'left' ? 'flex-row' : 'flex-row-reverse'} items-center gap-2
          transition-all duration-200 hover:scale-105 cursor-pointer
          mb-6
        `}
      >
        <div className="flex items-center gap-1">
          {is12String ? (
            <>
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                border-4 shadow-lg transition-all
                ${isPlaying
                  ? 'border-green-500 bg-green-100 animate-pulse scale-110'
                  : 'border-gray-400 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:border-blue-500 group-hover:from-blue-100 group-hover:to-blue-200'
                }
              `}>
                <div className={`
                  w-6 h-6 rounded-full
                  ${isPlaying ? 'bg-green-600' : 'bg-gray-600 group-hover:bg-blue-600'}
                  transition-colors
                `} />
              </div>
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                border-4 shadow-lg transition-all
                ${isPlaying
                  ? 'border-green-500 bg-green-100 animate-pulse scale-110'
                  : 'border-gray-400 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:border-blue-500 group-hover:from-blue-100 group-hover:to-blue-200'
                }
              `}>
                <div className={`
                  w-6 h-6 rounded-full
                  ${isPlaying ? 'bg-green-600' : 'bg-gray-600 group-hover:bg-blue-600'}
                  transition-colors
                `} />
              </div>
            </>
          ) : (
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center
              border-4 shadow-lg transition-all
              ${isPlaying
                ? 'border-green-500 bg-green-100 animate-pulse scale-110'
                : 'border-gray-400 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:border-blue-500 group-hover:from-blue-100 group-hover:to-blue-200'
              }
            `}>
              <div className={`
                w-8 h-8 rounded-full
                ${isPlaying ? 'bg-green-600' : 'bg-gray-600 group-hover:bg-blue-600'}
                transition-colors
              `} />
            </div>
          )}
        </div>

        <div className={`
          ${side === 'left' ? 'text-left' : 'text-right'}
          min-w-[120px]
        `}>
          <div className="font-bold text-[#E5E5E5] text-lg">{stringInfo.note}{stringInfo.octave}</div>
          <div className="text-sm text-[#A3A3A3]">{stringInfo.label}</div>
          {isPlaying && (
            <div className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              Playing
            </div>
          )}
        </div>
      </button>
    );
  };

  const renderHeadstock = (strings: StringTuning[], instrumentType: string, stringCount: number) => {
    const leftStrings = [];
    const rightStrings = [];
    const is12String = stringCount === 12;

    if (stringCount === 6 || stringCount === 12) {
      leftStrings.push(strings[3], strings[4], strings[5]);
      rightStrings.push(strings[2], strings[1], strings[0]);
    } else if (stringCount === 4) {
      leftStrings.push(strings[2], strings[3]);
      rightStrings.push(strings[1], strings[0]);
    }

    return (
      <div className="relative flex justify-center items-center py-8">
        <div className="relative flex items-center gap-4">
          <div className="flex flex-col items-end">
            {leftStrings.map(stringInfo =>
              renderTuningPeg(stringInfo, instrumentType, 'left', is12String)
            )}
          </div>

          <div className="flex flex-col items-start">
            {rightStrings.map(stringInfo =>
              renderTuningPeg(stringInfo, instrumentType, 'right', is12String)
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tuner-container max-w-4xl mx-auto p-6 space-y-8">
      {playingString && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={stopTuningNote}
            className="px-6 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 hover:scale-105"
          >
            <span className="text-xl">⏹️</span>
            <span className="font-semibold">Stop Playing</span>
          </button>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Music className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-[#E5E5E5]">Instrument Tuner</h1>
        </div>
        <p className="text-[#A3A3A3]">Click any string to hear the reference pitch for tuning</p>
        <p className="text-sm text-[#707070] mt-2 italic">Neck at bottom • Strings closest to neck at bottom of display</p>
      </div>

      <section className="instrument-section bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🎸</span>
          <h2 className="text-2xl font-bold text-[#E5E5E5]">6-String Acoustic Guitar</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#A3A3A3] mb-2">
            Select Tuning:
          </label>
          <select
            value={selectedGuitar6Tuning}
            onChange={(e) => setSelectedGuitar6Tuning(e.target.value)}
            className="dark-select w-full"
          >
            {Object.entries(GUITAR_6_TUNINGS).map(([key, config]) => (
              <option key={key} value={key}>
                {config.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-[#A3A3A3] mt-2 italic">
            {GUITAR_6_TUNINGS[selectedGuitar6Tuning].description}
          </p>
        </div>

        {renderHeadstock(GUITAR_6_TUNINGS[selectedGuitar6Tuning].strings, 'guitar6', 6)}
      </section>

      {/* Ukulele - Accordion */}
      <section className="instrument-section bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-md">
        <button
          onClick={() => setUkuleleOpen(!ukuleleOpen)}
          className="w-full p-6 flex items-center justify-between hover:bg-[#242424] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎻</span>
            <h2 className="text-2xl font-bold text-[#E5E5E5]">Ukulele</h2>
          </div>
          <ChevronDown
            className={`w-6 h-6 text-[#A3A3A3] transition-transform ${ukuleleOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {ukuleleOpen && (
          <div className="px-6 pb-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#A3A3A3] mb-2">
                Select Tuning:
              </label>
              <select
                value={selectedUkuleleTuning}
                onChange={(e) => setSelectedUkuleleTuning(e.target.value)}
                className="dark-select w-full"
              >
                {Object.entries(UKULELE_TUNINGS).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-[#A3A3A3] mt-2 italic">
                {UKULELE_TUNINGS[selectedUkuleleTuning].description}
              </p>
            </div>

            {renderHeadstock(UKULELE_TUNINGS[selectedUkuleleTuning].strings, 'ukulele', 4)}
          </div>
        )}
      </section>

      {/* 12-String Acoustic Guitar - Accordion */}
      <section className="instrument-section bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-md">
        <button
          onClick={() => setGuitar12Open(!guitar12Open)}
          className="w-full p-6 flex items-center justify-between hover:bg-[#242424] transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎸🎸</span>
            <h2 className="text-2xl font-bold text-[#E5E5E5]">12-String Acoustic Guitar</h2>
          </div>
          <ChevronDown
            className={`w-6 h-6 text-[#A3A3A3] transition-transform ${guitar12Open ? 'rotate-180' : ''}`}
          />
        </button>

        {guitar12Open && (
          <div className="px-6 pb-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#A3A3A3] mb-2">
                Select Tuning:
              </label>
              <select
                value={selectedGuitar12Tuning}
                onChange={(e) => setSelectedGuitar12Tuning(e.target.value)}
                className="dark-select w-full"
              >
                {Object.entries(GUITAR_12_TUNINGS).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-[#A3A3A3] mt-2 italic">
                {GUITAR_12_TUNINGS[selectedGuitar12Tuning].description}
              </p>
            </div>

            {renderHeadstock(GUITAR_12_TUNINGS[selectedGuitar12Tuning].strings, 'guitar12', 12)}

            <div className="mt-4 p-4 bg-[#242424] rounded-lg border border-[#2A2A2A]">
              <p className="text-sm text-[#A3A3A3]">
                <strong className="text-[#E5E5E5]">Note:</strong> 12-string guitars have pairs of strings. The high E and B pairs are
                tuned in unison, while the lower 4 pairs (G, D, A, E) are tuned in octaves. This tuner
                plays the primary pitch for each course.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="tuning-tips bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
        <h3 className="text-xl font-bold text-[#E5E5E5] mb-4 flex items-center gap-2">
          <span>💡</span> Tuning Tips
        </h3>
        <ul className="space-y-2 text-[#E5E5E5]">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>Click a string to hear a continuous reference tone - it will play until you stop it</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>Click the same string again or use the Stop button to end the tone</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>Use a guitar tuner app or clip-on tuner for precise tuning</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>Always tune UP to the pitch (tune flat, then bring it up to pitch)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>Tune in this order for best results: 6th, 5th, 4th, 3rd, 2nd, 1st</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>After tuning all strings, go back and check them again</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>New strings will go out of tune quickly - retune frequently</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
