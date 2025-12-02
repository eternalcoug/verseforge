export interface ChordDiagram {
  chord: string;
  frets: (number | 'x')[];
  fingers: (number | 0)[];
  baseFret: number;
}

export const CHORD_DIAGRAMS: Record<string, ChordDiagram> = {
  'C': { chord: 'C', frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 },
  'C#': { chord: 'C#', frets: ['x', 4, 6, 6, 6, 4], fingers: [0, 1, 3, 4, 5, 1], baseFret: 1 },
  'D': { chord: 'D', frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
  'D#': { chord: 'D#', frets: ['x', 'x', 1, 3, 4, 3], fingers: [0, 0, 1, 2, 4, 3], baseFret: 1 },
  'E': { chord: 'E', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 },
  'F': { chord: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1 },
  'F#': { chord: 'F#', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1 },
  'G': { chord: 'G', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 },
  'G#': { chord: 'G#', frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1 },
  'A': { chord: 'A', frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 },
  'A#': { chord: 'A#', frets: ['x', 1, 3, 3, 3, 1], fingers: [0, 1, 3, 4, 5, 1], baseFret: 1 },
  'B': { chord: 'B', frets: ['x', 2, 4, 4, 4, 2], fingers: [0, 1, 3, 4, 5, 1], baseFret: 1 },

  'Cm': { chord: 'Cm', frets: ['x', 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1 },
  'C#m': { chord: 'C#m', frets: ['x', 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1 },
  'Dm': { chord: 'Dm', frets: ['x', 'x', 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1 },
  'D#m': { chord: 'D#m', frets: ['x', 'x', 1, 3, 4, 2], fingers: [0, 0, 1, 3, 4, 2], baseFret: 1 },
  'Em': { chord: 'Em', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 },
  'Fm': { chord: 'Fm', frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1 },
  'F#m': { chord: 'F#m', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1 },
  'Gm': { chord: 'Gm', frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1 },
  'G#m': { chord: 'G#m', frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1 },
  'Am': { chord: 'Am', frets: ['x', 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
  'A#m': { chord: 'A#m', frets: ['x', 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1 },
  'Bm': { chord: 'Bm', frets: ['x', 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1 },

  'C°': { chord: 'C°', frets: ['x', 3, 4, 5, 4, 'x'], fingers: [0, 1, 2, 4, 3, 0], baseFret: 1 },
  'C#°': { chord: 'C#°', frets: ['x', 4, 5, 6, 5, 'x'], fingers: [0, 1, 2, 4, 3, 0], baseFret: 1 },
  'D°': { chord: 'D°', frets: ['x', 'x', 0, 1, 0, 1], fingers: [0, 0, 0, 1, 0, 2], baseFret: 1 },
  'D#°': { chord: 'D#°', frets: ['x', 'x', 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4], baseFret: 1 },
  'E°': { chord: 'E°', frets: ['x', 'x', 2, 3, 2, 3], fingers: [0, 0, 1, 3, 2, 4], baseFret: 1 },
  'F°': { chord: 'F°', frets: ['x', 'x', 3, 4, 3, 4], fingers: [0, 0, 1, 3, 2, 4], baseFret: 1 },
  'F#°': { chord: 'F#°', frets: ['x', 'x', 4, 5, 4, 5], fingers: [0, 0, 1, 3, 2, 4], baseFret: 1 },
  'G°': { chord: 'G°', frets: ['x', 'x', 5, 6, 5, 6], fingers: [0, 0, 1, 3, 2, 4], baseFret: 1 },
  'G#°': { chord: 'G#°', frets: ['x', 'x', 6, 7, 6, 7], fingers: [0, 0, 1, 3, 2, 4], baseFret: 1 },
  'A°': { chord: 'A°', frets: ['x', 0, 1, 2, 1, 'x'], fingers: [0, 0, 1, 3, 2, 0], baseFret: 1 },
  'A#°': { chord: 'A#°', frets: ['x', 1, 2, 3, 2, 'x'], fingers: [0, 1, 2, 4, 3, 0], baseFret: 1 },
  'B°': { chord: 'B°', frets: ['x', 2, 3, 4, 3, 'x'], fingers: [0, 1, 2, 4, 3, 0], baseFret: 1 },
};

export const CHORD_ALTERNATIVES: Record<string, ChordDiagram[]> = {
  'C': [
    { chord: 'C', frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 },
    { chord: 'C', frets: ['x', 3, 5, 5, 5, 3], fingers: [0, 1, 3, 4, 5, 1], baseFret: 1 },
    { chord: 'C', frets: [3, 3, 2, 0, 1, 0], fingers: [3, 4, 2, 0, 1, 0], baseFret: 1 },
  ],
  'D': [
    { chord: 'D', frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
    { chord: 'D', frets: ['x', 5, 7, 7, 7, 5], fingers: [0, 1, 3, 4, 5, 1], baseFret: 1 },
    { chord: 'D', frets: [5, 5, 7, 7, 7, 5], fingers: [1, 1, 3, 4, 5, 1], baseFret: 1 },
  ],
  'E': [
    { chord: 'E', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 },
    { chord: 'E', frets: [0, 7, 9, 9, 9, 7], fingers: [0, 1, 3, 4, 5, 1], baseFret: 1 },
    { chord: 'E', frets: ['x', 7, 9, 9, 9, 'x'], fingers: [0, 1, 3, 4, 5, 0], baseFret: 1 },
  ],
  'F': [
    { chord: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1 },
    { chord: 'F', frets: ['x', 'x', 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1], baseFret: 1 },
    { chord: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 4, 5, 3, 1, 1], baseFret: 1 },
  ],
  'G': [
    { chord: 'G', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 },
    { chord: 'G', frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1 },
    { chord: 'G', frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4], baseFret: 1 },
  ],
  'A': [
    { chord: 'A', frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 },
    { chord: 'A', frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1 },
    { chord: 'A', frets: ['x', 0, 2, 2, 2, 5], fingers: [0, 0, 1, 2, 3, 4], baseFret: 1 },
  ],
  'Am': [
    { chord: 'Am', frets: ['x', 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
    { chord: 'Am', frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1 },
    { chord: 'Am', frets: ['x', 0, 2, 2, 1, 3], fingers: [0, 0, 2, 3, 1, 4], baseFret: 1 },
  ],
  'Dm': [
    { chord: 'Dm', frets: ['x', 'x', 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1 },
    { chord: 'Dm', frets: ['x', 5, 7, 7, 6, 5], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1 },
    { chord: 'Dm', frets: [1, 0, 0, 2, 3, 1], fingers: [1, 0, 0, 2, 3, 4], baseFret: 1 },
  ],
  'Em': [
    { chord: 'Em', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 },
    { chord: 'Em', frets: [0, 7, 9, 9, 8, 7], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1 },
    { chord: 'Em', frets: ['x', 7, 9, 9, 8, 'x'], fingers: [0, 1, 3, 4, 2, 0], baseFret: 1 },
  ],
};

export function getChordAlternatives(chordName: string): ChordDiagram[] {
  return CHORD_ALTERNATIVES[chordName] || [CHORD_DIAGRAMS[chordName]].filter(Boolean);
}
