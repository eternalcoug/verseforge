import { ChordPosition } from './chordPositions';

export const DADGAD_CHORD_POSITIONS: Record<string, ChordPosition[]> = {
  'D': [
    {
      chord: 'D',
      frets: [0, 0, 0, 0, 0, 0],
      fingers: [0, 0, 0, 0, 0, 0],
      baseFret: 1,
      name: 'Open (all strings)'
    },
    {
      chord: 'D',
      frets: ['x', 0, 0, 0, 0, 5],
      fingers: ['x', 0, 0, 0, 0, 3],
      baseFret: 1,
      name: 'Open with high D'
    },
    {
      chord: 'D',
      frets: [0, 0, 0, 0, 2, 0],
      fingers: [0, 0, 0, 0, 1, 0],
      baseFret: 1,
      name: 'Open Dsus4'
    },
    {
      chord: 'D',
      frets: [7, 7, 7, 7, 7, 7],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 7,
      barres: [1],
      name: 'Barre (7th fret)'
    },
    {
      chord: 'D',
      frets: [12, 12, 12, 12, 12, 12],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 12,
      barres: [1],
      name: 'Barre (12th fret)'
    },
    {
      chord: 'D',
      frets: [0, 0, 4, 5, 5, 5],
      fingers: [0, 0, 1, 2, 3, 4],
      baseFret: 1,
      name: 'Open partial high'
    },
    {
      chord: 'D',
      frets: [0, 0, 0, 0, 0, 7],
      fingers: [0, 0, 0, 0, 0, 3],
      baseFret: 1,
      name: 'Open octave high'
    }
  ],
  'Dm': [
    {
      chord: 'Dm',
      frets: [0, 0, 0, 2, 1, 0],
      fingers: [0, 0, 0, 3, 1, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Dm',
      frets: [0, 0, 0, 2, 1, 3],
      fingers: [0, 0, 0, 3, 1, 4],
      baseFret: 1,
      name: 'Open extended'
    },
    {
      chord: 'Dm',
      frets: ['x', 'x', 7, 9, 8, 7],
      fingers: ['x', 'x', 1, 4, 3, 2],
      baseFret: 7,
      name: 'Mid voicing (7th)'
    },
    {
      chord: 'Dm',
      frets: [10, 10, 10, 10, 10, 10],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 10,
      barres: [1],
      name: 'Barre (10th fret)'
    },
    {
      chord: 'Dm',
      frets: [0, 3, 0, 2, 1, 0],
      fingers: [0, 3, 0, 2, 1, 0],
      baseFret: 1,
      name: 'Open alternate'
    }
  ],
  'E': [
    {
      chord: 'E',
      frets: [2, 2, 2, 2, 2, 2],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 2,
      barres: [1],
      name: 'Barre (2nd fret)'
    },
    {
      chord: 'E',
      frets: [2, 2, 2, 4, 4, 4],
      fingers: [1, 1, 1, 3, 3, 3],
      baseFret: 2,
      barres: [1],
      name: 'Extended (2nd fret)'
    },
    {
      chord: 'E',
      frets: ['x', 'x', 2, 4, 4, 4],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 2,
      name: 'Partial (2nd fret)'
    },
    {
      chord: 'E',
      frets: [9, 9, 9, 9, 9, 9],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 9,
      barres: [1],
      name: 'Barre (9th fret)'
    }
  ],
  'Em': [
    {
      chord: 'Em',
      frets: [0, 2, 2, 0, 0, 0],
      fingers: [0, 1, 2, 0, 0, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Em',
      frets: [2, 2, 2, 2, 2, 2],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 2,
      barres: [1],
      name: 'Barre (2nd fret)'
    },
    {
      chord: 'Em',
      frets: [0, 2, 2, 0, 0, 2],
      fingers: [0, 2, 3, 0, 0, 4],
      baseFret: 1,
      name: 'Open extended'
    },
    {
      chord: 'Em',
      frets: ['x', 'x', 2, 4, 4, 2],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 2,
      name: 'Partial (2nd fret)'
    },
    {
      chord: 'Em',
      frets: [9, 9, 9, 9, 9, 9],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 9,
      barres: [1],
      name: 'Barre (9th fret)'
    },
    {
      chord: 'Em',
      frets: [0, 2, 2, 2, 2, 2],
      fingers: [0, 1, 1, 1, 1, 1],
      baseFret: 1,
      barres: [1],
      name: 'Open partial barre'
    }
  ],
  'F#': [
    {
      chord: 'F#',
      frets: [4, 4, 4, 4, 4, 4],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 4,
      barres: [1],
      name: 'Barre (4th fret)'
    },
    {
      chord: 'F#',
      frets: ['x', 'x', 4, 6, 6, 6],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 4,
      name: 'Partial (4th fret)'
    },
    {
      chord: 'F#',
      frets: [4, 4, 4, 6, 6, 6],
      fingers: [1, 1, 1, 3, 3, 3],
      baseFret: 4,
      barres: [1],
      name: 'Extended (4th fret)'
    },
    {
      chord: 'F#',
      frets: [11, 11, 11, 11, 11, 11],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 11,
      barres: [1],
      name: 'Barre (11th fret)'
    }
  ],
  'F#m': [
    {
      chord: 'F#m',
      frets: [4, 4, 4, 4, 4, 4],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 4,
      barres: [1],
      name: 'Barre (4th fret)'
    },
    {
      chord: 'F#m',
      frets: ['x', 'x', 4, 6, 6, 4],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 4,
      name: 'Partial (4th fret)'
    },
    {
      chord: 'F#m',
      frets: [4, 6, 6, 4, 4, 4],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 4,
      barres: [1],
      name: 'Extended (4th fret)'
    },
    {
      chord: 'F#m',
      frets: [11, 11, 11, 11, 11, 11],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 11,
      barres: [1],
      name: 'Barre (11th fret)'
    },
    {
      chord: 'F#m',
      frets: [0, 4, 4, 0, 0, 0],
      fingers: [0, 2, 3, 0, 0, 0],
      baseFret: 1,
      name: 'Open modal'
    }
  ],
  'G': [
    {
      chord: 'G',
      frets: [5, 5, 5, 5, 5, 5],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 5,
      barres: [1],
      name: 'Barre (5th fret)'
    },
    {
      chord: 'G',
      frets: [0, 0, 0, 5, 5, 5],
      fingers: [0, 0, 0, 1, 2, 3],
      baseFret: 1,
      name: 'Open hybrid'
    },
    {
      chord: 'G',
      frets: ['x', 'x', 5, 7, 7, 7],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 5,
      name: 'Partial (5th fret)'
    },
    {
      chord: 'G',
      frets: [5, 5, 5, 7, 7, 7],
      fingers: [1, 1, 1, 3, 3, 3],
      baseFret: 5,
      barres: [1],
      name: 'Extended (5th fret)'
    },
    {
      chord: 'G',
      frets: [12, 12, 12, 12, 12, 12],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 12,
      barres: [1],
      name: 'Barre (12th fret)'
    },
    {
      chord: 'G',
      frets: [0, 5, 5, 5, 5, 5],
      fingers: [0, 1, 1, 1, 1, 1],
      baseFret: 1,
      barres: [1],
      name: 'Open low barre'
    }
  ],
  'Gm': [
    {
      chord: 'Gm',
      frets: [5, 5, 5, 5, 5, 5],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 5,
      barres: [1],
      name: 'Barre (5th fret)'
    },
    {
      chord: 'Gm',
      frets: ['x', 'x', 5, 7, 7, 5],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 5,
      name: 'Partial (5th fret)'
    },
    {
      chord: 'Gm',
      frets: [5, 7, 7, 5, 5, 5],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 5,
      barres: [1],
      name: 'Extended (5th fret)'
    },
    {
      chord: 'Gm',
      frets: [12, 12, 12, 12, 12, 12],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 12,
      barres: [1],
      name: 'Barre (12th fret)'
    },
    {
      chord: 'Gm',
      frets: [0, 0, 0, 7, 7, 5],
      fingers: [0, 0, 0, 3, 4, 1],
      baseFret: 1,
      name: 'Open hybrid'
    }
  ],
  'A': [
    {
      chord: 'A',
      frets: [7, 7, 7, 7, 7, 7],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 7,
      barres: [1],
      name: 'Barre (7th fret)'
    },
    {
      chord: 'A',
      frets: [0, 0, 0, 2, 2, 2],
      fingers: [0, 0, 0, 1, 2, 3],
      baseFret: 1,
      name: 'Open hybrid'
    },
    {
      chord: 'A',
      frets: ['x', 'x', 7, 9, 9, 9],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 7,
      name: 'Partial (7th fret)'
    },
    {
      chord: 'A',
      frets: [7, 7, 7, 9, 9, 9],
      fingers: [1, 1, 1, 3, 3, 3],
      baseFret: 7,
      barres: [1],
      name: 'Extended (7th fret)'
    },
    {
      chord: 'A',
      frets: [14, 14, 14, 14, 14, 14],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 14,
      barres: [1],
      name: 'Barre (14th fret)'
    },
    {
      chord: 'A',
      frets: [0, 7, 7, 7, 7, 7],
      fingers: [0, 1, 1, 1, 1, 1],
      baseFret: 1,
      barres: [1],
      name: 'Open low barre'
    }
  ],
  'Am': [
    {
      chord: 'Am',
      frets: [7, 7, 7, 7, 7, 7],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 7,
      barres: [1],
      name: 'Barre (7th fret)'
    },
    {
      chord: 'Am',
      frets: [0, 0, 0, 2, 1, 0],
      fingers: [0, 0, 0, 2, 1, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Am',
      frets: ['x', 'x', 7, 9, 9, 7],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 7,
      name: 'Partial (7th fret)'
    },
    {
      chord: 'Am',
      frets: [7, 9, 9, 7, 7, 7],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 7,
      barres: [1],
      name: 'Extended (7th fret)'
    },
    {
      chord: 'Am',
      frets: [14, 14, 14, 14, 14, 14],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 14,
      barres: [1],
      name: 'Barre (14th fret)'
    }
  ],
  'B': [
    {
      chord: 'B',
      frets: [9, 9, 9, 9, 9, 9],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 9,
      barres: [1],
      name: 'Barre (9th fret)'
    },
    {
      chord: 'B',
      frets: ['x', 'x', 9, 11, 11, 11],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 9,
      name: 'Partial (9th fret)'
    },
    {
      chord: 'B',
      frets: [9, 9, 9, 11, 11, 11],
      fingers: [1, 1, 1, 3, 3, 3],
      baseFret: 9,
      barres: [1],
      name: 'Extended (9th fret)'
    },
    {
      chord: 'B',
      frets: [0, 0, 0, 4, 4, 4],
      fingers: [0, 0, 0, 1, 2, 3],
      baseFret: 1,
      name: 'Open hybrid'
    }
  ],
  'Bm': [
    {
      chord: 'Bm',
      frets: [9, 9, 9, 9, 9, 9],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 9,
      barres: [1],
      name: 'Barre (9th fret)'
    },
    {
      chord: 'Bm',
      frets: [0, 0, 0, 4, 3, 0],
      fingers: [0, 0, 0, 3, 2, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Bm',
      frets: ['x', 'x', 9, 11, 11, 9],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 9,
      name: 'Partial (9th fret)'
    },
    {
      chord: 'Bm',
      frets: [9, 11, 11, 9, 9, 9],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 9,
      barres: [1],
      name: 'Extended (9th fret)'
    },
    {
      chord: 'Bm',
      frets: [0, 0, 0, 4, 3, 4],
      fingers: [0, 0, 0, 2, 1, 3],
      baseFret: 1,
      name: 'Open extended'
    }
  ],
  'C': [
    {
      chord: 'C',
      frets: [10, 10, 10, 10, 10, 10],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 10,
      barres: [1],
      name: 'Barre (10th fret)'
    },
    {
      chord: 'C',
      frets: ['x', 'x', 10, 12, 12, 12],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 10,
      name: 'Partial (10th fret)'
    },
    {
      chord: 'C',
      frets: [10, 10, 10, 12, 12, 12],
      fingers: [1, 1, 1, 3, 3, 3],
      baseFret: 10,
      barres: [1],
      name: 'Extended (10th fret)'
    }
  ],
  'Cm': [
    {
      chord: 'Cm',
      frets: [10, 10, 10, 10, 10, 10],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 10,
      barres: [1],
      name: 'Barre (10th fret)'
    },
    {
      chord: 'Cm',
      frets: ['x', 'x', 10, 12, 12, 10],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 10,
      name: 'Partial (10th fret)'
    },
    {
      chord: 'Cm',
      frets: [10, 12, 12, 10, 10, 10],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 10,
      barres: [1],
      name: 'Extended (10th fret)'
    }
  ],
  'C#': [
    {
      chord: 'C#',
      frets: [11, 11, 11, 11, 11, 11],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 11,
      barres: [1],
      name: 'Barre (11th fret)'
    },
    {
      chord: 'C#',
      frets: ['x', 'x', 11, 13, 13, 13],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 11,
      name: 'Partial (11th fret)'
    }
  ],
  'C#m': [
    {
      chord: 'C#m',
      frets: [11, 11, 11, 11, 11, 11],
      fingers: [1, 1, 1, 1, 1, 1],
      baseFret: 11,
      barres: [1],
      name: 'Barre (11th fret)'
    },
    {
      chord: 'C#m',
      frets: ['x', 'x', 11, 13, 13, 11],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 11,
      name: 'Partial (11th fret)'
    }
  ],
  'C#dim': [
    {
      chord: 'C#dim',
      frets: [0, 0, 0, 5, 4, 2],
      fingers: [0, 0, 0, 4, 3, 1],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'C#dim',
      frets: ['x', 'x', 11, 13, 13, 11],
      fingers: ['x', 'x', 1, 3, 4, 1],
      baseFret: 11,
      barres: [1],
      name: 'Partial (11th fret)'
    },
    {
      chord: 'C#dim',
      frets: [11, 11, 11, 13, 13, 11],
      fingers: [1, 1, 1, 3, 4, 1],
      baseFret: 11,
      barres: [1],
      name: 'Extended (11th fret)'
    }
  ]
};

export function getDADGADChordPositions(chordName: string): ChordPosition[] {
  const normalized = chordName.replace('♭', 'b').replace('♯', '#');
  const positions = DADGAD_CHORD_POSITIONS[normalized];

  if (!positions) {
    return [];
  }

  return positions.sort((a, b) => {
    const aMinFret = Math.min(...a.frets.filter(f => typeof f === 'number' && f > 0) as number[]);
    const bMinFret = Math.min(...b.frets.filter(f => typeof f === 'number' && f > 0) as number[]);
    return aMinFret - bMinFret;
  });
}
