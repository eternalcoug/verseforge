/**
 * Scale Visualizer Enhancements
 * Additional utilities for advanced scale features
 */

import { ScaleType } from './scaleTheory';

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Get scale degree number for a note in a scale
 */
export function getScaleDegreeNumber(note: string, scaleNotes: string[]): number | null {
  const index = scaleNotes.indexOf(note);
  return index !== -1 ? index + 1 : null;
}

/**
 * Get relative scale (major <-> minor, major pent <-> minor pent)
 */
export interface RelativeScale {
  root: string;
  type: ScaleType;
  name: string;
}

export function getRelativeScale(rootNote: string, scaleType: ScaleType): RelativeScale {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);

  const relationships: Record<ScaleType, { interval: number; newType: ScaleType }> = {
    'major': { interval: 9, newType: 'minor' }, // down minor 3rd (9 semitones up = 3 down)
    'minor': { interval: 3, newType: 'major' }, // up minor 3rd
    'major-pentatonic': { interval: 9, newType: 'minor-pentatonic' },
    'minor-pentatonic': { interval: 3, newType: 'major-pentatonic' }
  };

  const rel = relationships[scaleType];
  const relativeRoot = CHROMATIC_NOTES[(rootIndex + rel.interval) % 12];

  const typeName = {
    'major': 'Major',
    'minor': 'Minor',
    'major-pentatonic': 'Major Pentatonic',
    'minor-pentatonic': 'Minor Pentatonic'
  };

  return {
    root: relativeRoot,
    type: rel.newType,
    name: `${relativeRoot} ${typeName[rel.newType]}`
  };
}

/**
 * Get diatonic chords for a scale
 */
export interface ScaleChord {
  name: string;
  romanNumeral: string;
  root: string;
  quality: string;
}

export function getChordsInScale(rootNote: string, scaleType: ScaleType): ScaleChord[] {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);

  const chordFormulas: Record<string, Array<{ degree: string; quality: string; interval: number }>> = {
    'major': [
      { degree: 'I', quality: '', interval: 0 },
      { degree: 'ii', quality: 'm', interval: 2 },
      { degree: 'iii', quality: 'm', interval: 4 },
      { degree: 'IV', quality: '', interval: 5 },
      { degree: 'V', quality: '', interval: 7 },
      { degree: 'vi', quality: 'm', interval: 9 },
      { degree: 'vii°', quality: 'dim', interval: 11 }
    ],
    'minor': [
      { degree: 'i', quality: 'm', interval: 0 },
      { degree: 'ii°', quality: 'dim', interval: 2 },
      { degree: 'III', quality: '', interval: 3 },
      { degree: 'iv', quality: 'm', interval: 5 },
      { degree: 'v', quality: 'm', interval: 7 },
      { degree: 'VI', quality: '', interval: 8 },
      { degree: 'VII', quality: '', interval: 10 }
    ],
    'major-pentatonic': [
      { degree: 'I', quality: '', interval: 0 },
      { degree: 'ii', quality: 'm', interval: 2 },
      { degree: 'iii', quality: 'm', interval: 4 },
      { degree: 'V', quality: '', interval: 7 },
      { degree: 'vi', quality: 'm', interval: 9 }
    ],
    'minor-pentatonic': [
      { degree: 'i', quality: 'm', interval: 0 },
      { degree: 'III', quality: '', interval: 3 },
      { degree: 'iv', quality: 'm', interval: 5 },
      { degree: 'v', quality: 'm', interval: 7 },
      { degree: 'VII', quality: '', interval: 10 }
    ]
  };

  const formulas = chordFormulas[scaleType] || chordFormulas['major'];

  return formulas.map(chord => {
    const chordRoot = CHROMATIC_NOTES[(rootIndex + chord.interval) % 12];
    return {
      name: `${chordRoot}${chord.quality}`,
      romanNumeral: chord.degree,
      root: chordRoot,
      quality: chord.quality
    };
  });
}

/**
 * Common chord progressions for each scale type
 */
export interface ChordProgression {
  name: string;
  pattern: number[]; // Indices into the chords array
  genre: string;
  description: string;
}

export function getCommonProgressions(scaleType: ScaleType): ChordProgression[] {
  const progressions: Record<string, ChordProgression[]> = {
    'major': [
      {
        name: 'I - V - vi - IV',
        pattern: [0, 4, 5, 3],
        genre: 'Pop/Rock',
        description: 'The most popular progression in modern music'
      },
      {
        name: 'I - IV - V',
        pattern: [0, 3, 4],
        genre: 'Rock/Country',
        description: 'Classic three-chord rock progression'
      },
      {
        name: 'I - vi - IV - V',
        pattern: [0, 5, 3, 4],
        genre: '50s/Doo-wop',
        description: 'Nostalgic progression from the 1950s'
      },
      {
        name: 'ii - V - I',
        pattern: [1, 4, 0],
        genre: 'Jazz',
        description: 'Essential jazz turnaround'
      }
    ],
    'minor': [
      {
        name: 'i - VI - III - VII',
        pattern: [0, 5, 2, 6],
        genre: 'Pop',
        description: 'Modern minor pop progression'
      },
      {
        name: 'i - iv - v',
        pattern: [0, 3, 4],
        genre: 'Rock',
        description: 'Classic minor rock progression'
      },
      {
        name: 'i - VII - VI - VII',
        pattern: [0, 6, 5, 6],
        genre: 'Rock',
        description: 'Powerful rock progression'
      }
    ],
    'major-pentatonic': [
      {
        name: 'I - V - vi',
        pattern: [0, 3, 4],
        genre: 'Country/Folk',
        description: 'Simple three-chord country progression'
      },
      {
        name: 'I - IV - I - V',
        pattern: [0, 2, 0, 3],
        genre: 'Blues/Rock',
        description: 'Blues-inspired progression'
      }
    ],
    'minor-pentatonic': [
      {
        name: 'i - III - iv',
        pattern: [0, 1, 2],
        genre: 'Rock/Blues',
        description: 'Minor blues rock progression'
      },
      {
        name: 'i - VII - i',
        pattern: [0, 4, 0],
        genre: 'Rock',
        description: 'Simple minor rock vamp'
      }
    ]
  };

  return progressions[scaleType] || progressions['major'];
}

/**
 * Scale play directions
 */
export type PlayDirection = 'ascending' | 'descending' | 'both' | 'random';

/**
 * Generate note sequence based on direction
 */
export function generateNoteSequence(notes: string[], direction: PlayDirection): string[] {
  switch (direction) {
    case 'ascending':
      return notes;
    case 'descending':
      return [...notes].reverse();
    case 'both':
      return [...notes, ...[...notes].reverse().slice(1)];
    case 'random':
      const shuffled = [...notes];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    default:
      return notes;
  }
}

/**
 * Convert speed slider value (1-7) to BPM
 */
export function speedToBPM(speed: number): number {
  const bpmMap = [60, 80, 100, 120, 150, 180, 200];
  return bpmMap[Math.max(0, Math.min(6, speed - 1))];
}

/**
 * Get speed label
 */
export function getSpeedLabel(speed: number): string {
  const labels = ['Very Slow', 'Slow', 'Moderate', 'Medium', 'Fast', 'Very Fast', 'Blazing'];
  return labels[Math.max(0, Math.min(6, speed - 1))];
}
