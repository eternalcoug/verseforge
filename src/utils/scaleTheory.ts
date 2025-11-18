export type ScaleType = 'major' | 'minor' | 'major-pentatonic' | 'minor-pentatonic';

export interface ScaleInfo {
  root: string;
  type: ScaleType;
  notes: string[];
}

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const OPEN_STRINGS = ['E', 'B', 'G', 'D', 'A', 'E'];

const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  'major-pentatonic': [0, 2, 4, 7, 9],
  'minor-pentatonic': [0, 3, 5, 7, 10]
};

const SCALE_DEGREE_NAMES = {
  major: ['Root', '2nd', '3rd', '4th', '5th', '6th', '7th'],
  minor: ['Root', '2nd', 'b3rd', '4th', '5th', 'b6th', 'b7th'],
  'major-pentatonic': ['Root', '2nd', '3rd', '5th', '6th'],
  'minor-pentatonic': ['Root', 'b3rd', '4th', '5th', 'b7th']
};

export function generateScale(root: string, scaleType: ScaleType): string[] {
  const rootIndex = CHROMATIC_NOTES.indexOf(root);
  if (rootIndex === -1) {
    throw new Error(`Invalid root note: ${root}`);
  }

  const intervals = SCALE_INTERVALS[scaleType];
  return intervals.map(interval => CHROMATIC_NOTES[(rootIndex + interval) % 12]);
}

export function getFretNote(stringIndex: number, fret: number): string {
  const openNote = OPEN_STRINGS[stringIndex];
  const openIndex = CHROMATIC_NOTES.indexOf(openNote);
  const noteIndex = (openIndex + fret) % 12;
  return CHROMATIC_NOTES[noteIndex];
}

export function isNoteInScale(note: string, scaleNotes: string[]): boolean {
  return scaleNotes.includes(note);
}

export function isRootNote(note: string, root: string): boolean {
  return note === root;
}

export function getScaleDegree(note: string, scaleNotes: string[], scaleType: ScaleType): string | null {
  const index = scaleNotes.indexOf(note);
  if (index === -1) return null;
  return SCALE_DEGREE_NAMES[scaleType][index];
}

export function getScaleInfo(root: string, scaleType: ScaleType): ScaleInfo {
  const notes = generateScale(root, scaleType);
  return {
    root,
    type: scaleType,
    notes
  };
}

export function getStringName(stringIndex: number): string {
  return OPEN_STRINGS[stringIndex];
}

export const FRET_MARKERS = [3, 5, 7, 9, 12];

export const KEY_OPTIONS = [
  { value: 'C', label: 'C' },
  { value: 'C#', label: 'C# / Db' },
  { value: 'D', label: 'D' },
  { value: 'D#', label: 'D# / Eb' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'F#', label: 'F# / Gb' },
  { value: 'G', label: 'G' },
  { value: 'G#', label: 'G# / Ab' },
  { value: 'A', label: 'A' },
  { value: 'A#', label: 'A# / Bb' },
  { value: 'B', label: 'B' }
];
