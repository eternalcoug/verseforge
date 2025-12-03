export interface MelodyNote {
  pitch: string;
  octave: number;
  start: number;
  duration: number;
  velocity: number;
  lyricIndex: number;
}

export interface SectionMelody {
  sectionId: string;
  notes: MelodyNote[];
  key: string;
  scale: string;
}

export interface MelodySettings {
  snapToScale: boolean;
  highlightChordTones: boolean;
  key: string;
  scale: string;
}

export const PITCH_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type PitchName = typeof PITCH_NAMES[number];

export const SCALE_INTERVALS: Record<string, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonicMajor: [0, 2, 4, 7, 9],
  pentatonicMinor: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10]
};

export function getScaleNotes(rootNote: string, scale: string): string[] {
  const rootIndex = PITCH_NAMES.indexOf(rootNote as PitchName);
  if (rootIndex === -1) return [];

  const intervals = SCALE_INTERVALS[scale] || SCALE_INTERVALS.major;
  return intervals.map(interval => PITCH_NAMES[(rootIndex + interval) % 12]);
}

export function isNoteInScale(note: string, rootNote: string, scale: string): boolean {
  const scaleNotes = getScaleNotes(rootNote, scale);
  return scaleNotes.includes(note);
}

export function pitchToMidiNumber(pitch: string, octave: number): number {
  const pitchIndex = PITCH_NAMES.indexOf(pitch as PitchName);
  if (pitchIndex === -1) return 60;
  return (octave + 1) * 12 + pitchIndex;
}

export function midiNumberToPitch(midiNumber: number): { pitch: string; octave: number } {
  const octave = Math.floor(midiNumber / 12) - 1;
  const pitchIndex = midiNumber % 12;
  return {
    pitch: PITCH_NAMES[pitchIndex],
    octave
  };
}
