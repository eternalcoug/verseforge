/**
 * Chord Quality and Progression Enhancements
 * For Chord Position Finder
 */

export type ChordQuality =
  | 'major'
  | 'minor'
  | '7'
  | 'maj7'
  | 'm7'
  | 'sus2'
  | 'sus4'
  | 'add9'
  | 'dim'
  | 'aug'
  | '6'
  | '9';

export interface ChordQualityInfo {
  value: ChordQuality;
  label: string;
  suffix: string;
  intervals: number[];
  description: string;
}

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const CHORD_QUALITIES: ChordQualityInfo[] = [
  {
    value: 'major',
    label: 'Major',
    suffix: '',
    intervals: [0, 4, 7],
    description: 'Root, Major 3rd, Perfect 5th'
  },
  {
    value: 'minor',
    label: 'Minor',
    suffix: 'm',
    intervals: [0, 3, 7],
    description: 'Root, Minor 3rd, Perfect 5th'
  },
  {
    value: '7',
    label: 'Dominant 7th',
    suffix: '7',
    intervals: [0, 4, 7, 10],
    description: 'Root, Major 3rd, Perfect 5th, Minor 7th'
  },
  {
    value: 'maj7',
    label: 'Major 7th',
    suffix: 'maj7',
    intervals: [0, 4, 7, 11],
    description: 'Root, Major 3rd, Perfect 5th, Major 7th'
  },
  {
    value: 'm7',
    label: 'Minor 7th',
    suffix: 'm7',
    intervals: [0, 3, 7, 10],
    description: 'Root, Minor 3rd, Perfect 5th, Minor 7th'
  },
  {
    value: 'sus2',
    label: 'Suspended 2nd',
    suffix: 'sus2',
    intervals: [0, 2, 7],
    description: 'Root, Major 2nd, Perfect 5th'
  },
  {
    value: 'sus4',
    label: 'Suspended 4th',
    suffix: 'sus4',
    intervals: [0, 5, 7],
    description: 'Root, Perfect 4th, Perfect 5th'
  },
  {
    value: 'add9',
    label: 'Add 9',
    suffix: 'add9',
    intervals: [0, 4, 7, 14],
    description: 'Root, Major 3rd, Perfect 5th, Major 9th'
  },
  {
    value: 'dim',
    label: 'Diminished',
    suffix: 'dim',
    intervals: [0, 3, 6],
    description: 'Root, Minor 3rd, Diminished 5th'
  },
  {
    value: 'aug',
    label: 'Augmented',
    suffix: 'aug',
    intervals: [0, 4, 8],
    description: 'Root, Major 3rd, Augmented 5th'
  },
  {
    value: '6',
    label: 'Sixth',
    suffix: '6',
    intervals: [0, 4, 7, 9],
    description: 'Root, Major 3rd, Perfect 5th, Major 6th'
  },
  {
    value: '9',
    label: 'Ninth',
    suffix: '9',
    intervals: [0, 4, 7, 10, 14],
    description: 'Root, Major 3rd, Perfect 5th, Minor 7th, Major 9th'
  }
];

/**
 * Get chord name with quality
 */
export function getChordName(root: string, quality: ChordQuality): string {
  const qualityInfo = CHORD_QUALITIES.find(q => q.value === quality);
  return `${root}${qualityInfo?.suffix || ''}`;
}

/**
 * Get notes in a chord
 */
export function getChordNotes(root: string, quality: ChordQuality): string[] {
  const rootIndex = CHROMATIC_NOTES.indexOf(root);
  if (rootIndex === -1) return [];

  const qualityInfo = CHORD_QUALITIES.find(q => q.value === quality);
  if (!qualityInfo) return [];

  return qualityInfo.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return CHROMATIC_NOTES[noteIndex];
  });
}

/**
 * Calculate chord difficulty based on position
 */
export function calculateDifficulty(frets: (number | 'x' | 0)[], baseFret: number): {
  stars: number;
  label: string;
} {
  const playedStrings = frets.filter(f => f !== 'x').length;
  const hasOpenStrings = frets.some(f => f === 0);
  const maxFret = Math.max(...frets.filter(f => typeof f === 'number' && f > 0) as number[]);
  const fretRange = maxFret - (baseFret || 1);

  let stars = 5;

  // Open position with no barre
  if (hasOpenStrings && baseFret === 1 && fretRange <= 3) {
    stars = 5;
  }
  // Open position with some stretch
  else if (hasOpenStrings && fretRange <= 4) {
    stars = 4;
  }
  // Low fret barre
  else if (!hasOpenStrings && baseFret <= 5) {
    stars = 3;
  }
  // High fret positions
  else if (baseFret > 5 && baseFret <= 9) {
    stars = 2;
  }
  // Very high or complex
  else {
    stars = 1;
  }

  const labels = ['Very Hard', 'Hard', 'Moderate', 'Easy', 'Very Easy'];
  return { stars, label: labels[stars - 1] };
}

/**
 * Get related chords
 */
export function getRelatedChords(root: string, quality: ChordQuality): {
  variations: string[];
  relatedMinors?: string[];
  inversions: string[];
} {
  const rootIndex = CHROMATIC_NOTES.indexOf(root);
  const related: any = {};

  // Add color variations (for major chords)
  if (quality === 'major') {
    related.variations = [
      `${root}add9`,
      `${root}maj7`,
      `${root}6`
    ];

    // Relative minor (3 semitones down from major)
    const relativeMinorIndex = (rootIndex - 3 + 12) % 12;
    const relativeMinor = CHROMATIC_NOTES[relativeMinorIndex];

    // Diatonic minors in this key
    const ii = CHROMATIC_NOTES[(rootIndex + 2) % 12];
    const iii = CHROMATIC_NOTES[(rootIndex + 4) % 12];
    const vi = CHROMATIC_NOTES[(rootIndex + 9) % 12];

    related.relatedMinors = [
      `${relativeMinor}m (Relative minor)`,
      `${ii}m`,
      `${iii}m`,
      `${vi}m`
    ];
  }

  // Inversions (slash chords)
  const notes = getChordNotes(root, quality);
  related.inversions = notes.slice(1).map(note => `${root}/${note}`);

  return related;
}

/**
 * Common chord progressions
 */
export interface ChordProgression {
  name: string;
  numerals: string[];
  pattern: number[];
  genre: string;
  description: string;
}

export function getCommonProgressions(root: string): ChordProgression[] {
  const rootIndex = CHROMATIC_NOTES.indexOf(root);

  // Scale degrees for major key
  const I = root;
  const ii = CHROMATIC_NOTES[(rootIndex + 2) % 12];
  const iii = CHROMATIC_NOTES[(rootIndex + 4) % 12];
  const IV = CHROMATIC_NOTES[(rootIndex + 5) % 12];
  const V = CHROMATIC_NOTES[(rootIndex + 7) % 12];
  const vi = CHROMATIC_NOTES[(rootIndex + 9) % 12];

  return [
    {
      name: 'I - V - vi - IV',
      numerals: ['I', 'V', 'vi', 'IV'],
      pattern: [0, 4, 5, 3],
      genre: 'Pop/Rock',
      description: 'The most popular progression in modern music',
    },
    {
      name: 'I - IV - V',
      numerals: ['I', 'IV', 'V'],
      pattern: [0, 3, 4],
      genre: 'Country/Rock',
      description: 'Classic three-chord rock progression',
    },
    {
      name: 'I - vi - IV - V',
      numerals: ['I', 'vi', 'IV', 'V'],
      pattern: [0, 5, 3, 4],
      genre: '50s/Doo-wop',
      description: 'Nostalgic progression from the 1950s',
    },
    {
      name: 'vi - IV - I - V',
      numerals: ['vi', 'IV', 'I', 'V'],
      pattern: [5, 3, 0, 4],
      genre: 'Indie/Modern',
      description: 'Modern pop/indie progression',
    },
    {
      name: 'ii - V - I',
      numerals: ['ii', 'V', 'I'],
      pattern: [1, 4, 0],
      genre: 'Jazz',
      description: 'Essential jazz turnaround',
    }
  ];
}

/**
 * Get actual chord names for a progression
 */
export function getProgressionChords(root: string, progression: ChordProgression): string[] {
  const rootIndex = CHROMATIC_NOTES.indexOf(root);

  // Major scale degrees
  const degrees = [
    { interval: 0, quality: '' },      // I
    { interval: 2, quality: 'm' },     // ii
    { interval: 4, quality: 'm' },     // iii
    { interval: 5, quality: '' },      // IV
    { interval: 7, quality: '' },      // V
    { interval: 9, quality: 'm' },     // vi
    { interval: 11, quality: 'dim' }   // vii°
  ];

  return progression.pattern.map(degreeIndex => {
    const degree = degrees[degreeIndex];
    const noteIndex = (rootIndex + degree.interval) % 12;
    const note = CHROMATIC_NOTES[noteIndex];
    return `${note}${degree.quality}`;
  });
}

/**
 * Get fret range display
 */
export function getFretRange(frets: (number | 'x' | 0)[], baseFret: number): string {
  const playedFrets = frets.filter(f => typeof f === 'number' && f > 0) as number[];
  if (playedFrets.length === 0) return 'Open';

  const minFret = Math.min(...playedFrets);
  const maxFret = Math.max(...playedFrets);

  if (minFret === maxFret) return `Fret ${minFret}`;
  return `Frets ${minFret}-${maxFret}`;
}
