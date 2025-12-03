import { useState, useEffect, useRef } from 'react';
import { Play, StopCircle, Music2, Sparkles } from 'lucide-react';
import { MelodyNote, PITCH_NAMES, getScaleNotes, isNoteInScale } from '../utils/melodyTypes';
import { MelodyPlayer } from '../utils/melodyPlayer';

interface MelodyEditorProps {
  lyrics: string[];
  melody: MelodyNote[];
  onMelodyChange: (melody: MelodyNote[]) => void;
  sectionId: string;
  tempo: number;
  songKey?: string;
  scale?: string;
}

export function MelodyEditor({
  lyrics,
  melody,
  onMelodyChange,
  tempo,
  songKey = 'C',
  scale = 'major'
}: MelodyEditorProps) {
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);
  const [selectedOctave, setSelectedOctave] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingNoteIndex, setPlayingNoteIndex] = useState<number>(-1);
  const [snapToScale, setSnapToScale] = useState(true);
  const melodyPlayerRef = useRef<MelodyPlayer | null>(null);

  useEffect(() => {
    melodyPlayerRef.current = new MelodyPlayer();
    return () => {
      if (melodyPlayerRef.current) {
        melodyPlayerRef.current.dispose();
      }
    };
  }, []);

  const syllables = lyrics.flatMap((line, lineIndex) =>
    line.split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => ({
        word: word.replace(/[\[\]]/g, ''),
        lineIndex
      }))
  );

  const scaleNotes = getScaleNotes(songKey, scale);

  const initializeMelody = () => {
    if (melody.length === 0 && syllables.length > 0) {
      const defaultMelody: MelodyNote[] = syllables.map((_, index) => ({
        pitch: 'C',
        octave: 4,
        start: index * 0.5,
        duration: 0.5,
        velocity: 0.8,
        lyricIndex: index
      }));
      onMelodyChange(defaultMelody);
    }
  };

  useEffect(() => {
    initializeMelody();
  }, [syllables.length]);

  const handleNoteClick = (index: number) => {
    setSelectedNoteIndex(index);
    if (melodyPlayerRef.current && melody[index]) {
      const note = melody[index];
      melodyPlayerRef.current.playNote(note.pitch, note.octave, 0.3);
    }
  };

  const handlePitchChange = (pitch: string) => {
    if (selectedNoteIndex === null) return;

    if (snapToScale && !isNoteInScale(pitch, songKey, scale)) {
      return;
    }

    const updatedMelody = [...melody];
    updatedMelody[selectedNoteIndex] = {
      ...updatedMelody[selectedNoteIndex],
      pitch,
      octave: selectedOctave
    };
    onMelodyChange(updatedMelody);

    if (melodyPlayerRef.current) {
      melodyPlayerRef.current.playNote(pitch, selectedOctave, 0.3);
    }
  };

  const handleOctaveChange = (octave: number) => {
    setSelectedOctave(octave);
    if (selectedNoteIndex !== null) {
      const updatedMelody = [...melody];
      updatedMelody[selectedNoteIndex] = {
        ...updatedMelody[selectedNoteIndex],
        octave
      };
      onMelodyChange(updatedMelody);

      if (melodyPlayerRef.current) {
        const note = updatedMelody[selectedNoteIndex];
        melodyPlayerRef.current.playNote(note.pitch, octave, 0.3);
      }
    }
  };

  const handlePlayMelody = async () => {
    if (!melodyPlayerRef.current || melody.length === 0) return;

    if (isPlaying) {
      melodyPlayerRef.current.stop();
      setIsPlaying(false);
      setPlayingNoteIndex(-1);
      return;
    }

    setIsPlaying(true);
    await melodyPlayerRef.current.playMelody(melody, tempo, (noteIndex) => {
      setPlayingNoteIndex(noteIndex);
    });
    setIsPlaying(false);
    setPlayingNoteIndex(-1);
  };

  const getMelodyContour = (noteIndex: number): number => {
    if (!melody[noteIndex]) return 0;
    const note = melody[noteIndex];
    const pitchIndex = PITCH_NAMES.indexOf(note.pitch as any);
    return pitchIndex + (note.octave * 12);
  };

  const getRelativeY = (noteIndex: number, maxHeight: number = 100): number => {
    if (melody.length === 0) return maxHeight / 2;
    const midiNumbers = melody.map((_, i) => getMelodyContour(i));
    const minMidi = Math.min(...midiNumbers);
    const maxMidi = Math.max(...midiNumbers);
    const range = maxMidi - minMidi || 12;
    const currentMidi = getMelodyContour(noteIndex);
    return maxHeight - ((currentMidi - minMidi) / range) * maxHeight;
  };

  if (syllables.length === 0) {
    return (
      <div className="bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-lg p-6">
        <div className="text-center text-[#A3A3A3]">
          <Music2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Add lyrics to start creating a melody</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-[#E5E5E5]">Melody Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSnapToScale(!snapToScale)}
            className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
              snapToScale
                ? 'bg-blue-600 text-white'
                : 'bg-[#242424] text-[#A3A3A3] border border-[#2A2A2A]'
            }`}
          >
            Snap to Scale
          </button>
          <button
            onClick={handlePlayMelody}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <StopCircle className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-[#0F0F0F] rounded-lg p-4 mb-4">
        <div className="relative h-32 mb-2">
          <svg className="w-full h-full">
            {melody.length > 0 && (
              <>
                <polyline
                  points={melody.map((_, i) => {
                    const x = (i / (melody.length - 1 || 1)) * 100;
                    const y = getRelativeY(i, 100);
                    return `${x}%,${y}%`;
                  }).join(' ')}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  className="transition-all"
                />
                {melody.map((note, i) => {
                  const x = (i / (melody.length - 1 || 1)) * 100;
                  const y = getRelativeY(i, 100);
                  const isSelected = selectedNoteIndex === i;
                  const isCurrentlyPlaying = playingNoteIndex === i;
                  return (
                    <g key={i}>
                      <circle
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r={isSelected ? "8" : "6"}
                        fill={isCurrentlyPlaying ? "#10B981" : isSelected ? "#60A5FA" : "#3B82F6"}
                        className="cursor-pointer transition-all hover:r-8"
                        onClick={() => handleNoteClick(i)}
                      />
                      <text
                        x={`${x}%`}
                        y={`${y - 15}%`}
                        textAnchor="middle"
                        className="text-xs fill-[#A3A3A3] font-mono"
                      >
                        {note.pitch}{note.octave}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {syllables.map((syl, i) => (
            <button
              key={i}
              onClick={() => handleNoteClick(i)}
              className={`px-3 py-2 rounded-lg text-sm font-mono transition-all ${
                selectedNoteIndex === i
                  ? 'bg-blue-600 text-white border-2 border-blue-400'
                  : playingNoteIndex === i
                  ? 'bg-green-600 text-white'
                  : 'bg-[#242424] text-[#E5E5E5] border border-[#2A2A2A] hover:border-blue-400'
              }`}
            >
              {syl.word}
            </button>
          ))}
        </div>
      </div>

      {selectedNoteIndex !== null && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-[#E5E5E5] mb-2">
              Select Pitch {snapToScale && `(${songKey} ${scale})`}
            </label>
            <div className="flex gap-2 flex-wrap">
              {PITCH_NAMES.map((pitch) => {
                const inScale = isNoteInScale(pitch, songKey, scale);
                const isDisabled = snapToScale && !inScale;
                const isSelected = melody[selectedNoteIndex]?.pitch === pitch;

                return (
                  <button
                    key={pitch}
                    onClick={() => handlePitchChange(pitch)}
                    disabled={isDisabled}
                    className={`px-4 py-2 rounded-lg font-mono font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-2 border-blue-400'
                        : isDisabled
                        ? 'bg-[#1A1A1A] text-[#666] border border-[#2A2A2A] cursor-not-allowed'
                        : inScale
                        ? 'bg-[#242424] text-[#E5E5E5] border-2 border-green-600/30 hover:bg-green-600/20'
                        : 'bg-[#242424] text-[#A3A3A3] border border-[#2A2A2A] hover:border-amber-400'
                    }`}
                  >
                    {pitch}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#E5E5E5] mb-2">
              Select Octave
            </label>
            <div className="flex gap-2">
              {[3, 4, 5].map((octave) => (
                <button
                  key={octave}
                  onClick={() => handleOctaveChange(octave)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedOctave === octave
                      ? 'bg-blue-600 text-white border-2 border-blue-400'
                      : 'bg-[#242424] text-[#E5E5E5] border border-[#2A2A2A] hover:border-blue-400'
                  }`}
                >
                  Octave {octave}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-300">
        <strong>💡 Tip:</strong> Click any word to select it, then choose a pitch and octave.
        {snapToScale && ' Green borders show notes in your selected scale.'}
      </div>
    </div>
  );
}
