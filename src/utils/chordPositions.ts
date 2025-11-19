export interface ChordPosition {
  chord: string;
  frets: (number | 'x' | 0)[];
  fingers: (number | 'x' | 0)[];
  baseFret: number;
  barres?: number[];
  name: string;
}

export const CHORD_POSITIONS: Record<string, ChordPosition[]> = {
  'C': [
    {
      chord: 'C',
      frets: [0, 3, 2, 0, 1, 0],
      fingers: [0, 3, 2, 0, 1, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'C',
      frets: ['x', 3, 2, 0, 1, 0],
      fingers: ['x', 3, 2, 0, 1, 0],
      baseFret: 1,
      name: 'Open (no low E)'
    },
    {
      chord: 'C',
      frets: [3, 3, 5, 5, 5, 3],
      fingers: [1, 1, 3, 3, 3, 1],
      baseFret: 3,
      barres: [1],
      name: 'Barre (3rd fret)'
    },
    {
      chord: 'C',
      frets: ['x', 'x', 10, 12, 13, 12],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 10,
      name: 'High voicing (10th)'
    },
    {
      chord: 'C',
      frets: [8, 10, 10, 9, 8, 8],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'C',
      frets: ['x', 'x', 5, 5, 5, 8],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 5,
      name: 'Partial (5th fret)'
    },
    {
      chord: 'C',
      frets: ['x', 'x', 10, 10, 10, 13],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 10,
      name: 'Partial (10th fret)'
    },
    {
      chord: 'C',
      frets: [0, 3, 5, 5, 5, 3],
      fingers: [0, 1, 3, 3, 3, 1],
      baseFret: 1,
      name: 'Hybrid open position'
    },
    {
      chord: 'C',
      frets: ['x', 3, 5, 5, 5, 3],
      fingers: ['x', 1, 3, 4, 4, 1],
      baseFret: 3,
      barres: [1],
      name: 'Middle position (3rd)'
    }
  ],
  'Cm': [
    {
      chord: 'Cm',
      frets: ['x', 'x', 5, 5, 4, 3],
      fingers: ['x', 'x', 3, 4, 2, 1],
      baseFret: 3,
      name: 'Partial (3rd fret)'
    },
    {
      chord: 'Cm',
      frets: [3, 3, 5, 5, 4, 3],
      fingers: [1, 1, 3, 4, 2, 1],
      baseFret: 3,
      barres: [1],
      name: 'Barre (3rd fret)'
    },
    {
      chord: 'Cm',
      frets: ['x', 3, 5, 5, 4, 3],
      fingers: ['x', 1, 3, 4, 2, 1],
      baseFret: 3,
      name: 'Partial barre (3rd)'
    },
    {
      chord: 'Cm',
      frets: [8, 10, 10, 8, 8, 8],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'Cm',
      frets: ['x', 'x', 10, 12, 12, 11],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 10,
      name: 'High voicing (10th)'
    },
    {
      chord: 'Cm',
      frets: ['x', 8, 10, 10, 8, 8],
      fingers: ['x', 1, 3, 4, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Partial barre (8th)'
    },
    {
      chord: 'Cm',
      frets: ['x', 3, 5, 5, 4, 'x'],
      fingers: ['x', 1, 3, 4, 2, 'x'],
      baseFret: 3,
      name: 'Compact (3rd fret)'
    },
    {
      chord: 'Cm',
      frets: ['x', 'x', 1, 3, 4, 4],
      fingers: ['x', 'x', 1, 3, 4, 4],
      baseFret: 1,
      name: 'Low position'
    },
    {
      chord: 'Cm',
      frets: [3, 3, 5, 5, 4, 'x'],
      fingers: [1, 1, 3, 4, 2, 'x'],
      baseFret: 3,
      barres: [1],
      name: 'Truncated barre (3rd)'
    }
  ],
  'D': [
    {
      chord: 'D',
      frets: ['x', 0, 0, 2, 3, 2],
      fingers: ['x', 0, 0, 1, 3, 2],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'D',
      frets: ['x', 'x', 0, 2, 3, 2],
      fingers: ['x', 'x', 0, 1, 3, 2],
      baseFret: 1,
      name: 'Open (tight voicing)'
    },
    {
      chord: 'D',
      frets: ['x', 'x', 0, 7, 7, 7],
      fingers: ['x', 'x', 0, 1, 1, 1],
      baseFret: 1,
      name: 'Partial (7th fret)'
    },
    {
      chord: 'D',
      frets: ['x', 5, 7, 7, 7, 5],
      fingers: ['x', 1, 3, 3, 3, 1],
      baseFret: 5,
      barres: [1],
      name: 'Barre (5th fret)'
    },
    {
      chord: 'D',
      frets: [10, 12, 12, 11, 10, 10],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 10,
      barres: [1],
      name: 'Barre (10th fret)'
    },
    {
      chord: 'D',
      frets: ['x', 'x', 12, 14, 14, 14],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 12,
      name: 'High voicing (12th)'
    },
    {
      chord: 'D',
      frets: ['x', 'x', 0, 2, 3, 5],
      fingers: ['x', 'x', 0, 1, 2, 4],
      baseFret: 1,
      name: 'Open extended'
    },
    {
      chord: 'D',
      frets: [10, 12, 12, 11, 'x', 'x'],
      fingers: [1, 3, 4, 2, 'x', 'x'],
      baseFret: 10,
      name: 'Low strings (10th)'
    },
    {
      chord: 'D',
      frets: ['x', 5, 7, 7, 7, 'x'],
      fingers: ['x', 1, 3, 3, 3, 'x'],
      baseFret: 5,
      name: 'Compact barre (5th)'
    }
  ],
  'Dm': [
    {
      chord: 'Dm',
      frets: ['x', 0, 0, 2, 3, 1],
      fingers: ['x', 0, 0, 2, 3, 1],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Dm',
      frets: ['x', 'x', 0, 2, 3, 1],
      fingers: ['x', 'x', 0, 2, 3, 1],
      baseFret: 1,
      name: 'Open (tight voicing)'
    },
    {
      chord: 'Dm',
      frets: ['x', 'x', 0, 5, 6, 5],
      fingers: ['x', 'x', 0, 1, 3, 2],
      baseFret: 1,
      name: 'Partial (5th fret)'
    },
    {
      chord: 'Dm',
      frets: ['x', 5, 7, 7, 6, 5],
      fingers: ['x', 1, 3, 4, 2, 1],
      baseFret: 5,
      barres: [1],
      name: 'Barre (5th fret)'
    },
    {
      chord: 'Dm',
      frets: [10, 12, 12, 10, 10, 10],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 10,
      barres: [1],
      name: 'Barre (10th fret)'
    },
    {
      chord: 'Dm',
      frets: ['x', 'x', 7, 10, 10, 10],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 7,
      name: 'High voicing (7th)'
    },
    {
      chord: 'Dm',
      frets: ['x', 'x', 0, 2, 3, 3],
      fingers: ['x', 'x', 0, 1, 2, 3],
      baseFret: 1,
      name: 'Open alternate'
    },
    {
      chord: 'Dm',
      frets: [10, 12, 12, 10, 'x', 'x'],
      fingers: [1, 3, 4, 1, 'x', 'x'],
      baseFret: 10,
      barres: [1],
      name: 'Low strings (10th)'
    },
    {
      chord: 'Dm',
      frets: ['x', 5, 7, 7, 6, 'x'],
      fingers: ['x', 1, 3, 4, 2, 'x'],
      baseFret: 5,
      name: 'Compact (5th fret)'
    }
  ],
  'E': [
    {
      chord: 'E',
      frets: [0, 2, 2, 1, 0, 0],
      fingers: [0, 2, 3, 1, 0, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'E',
      frets: [0, 2, 2, 1, 0, 4],
      fingers: [0, 2, 3, 1, 0, 4],
      baseFret: 1,
      name: 'Open (high E)'
    },
    {
      chord: 'E',
      frets: ['x', 'x', 2, 4, 5, 4],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 2,
      name: 'Partial (2nd fret)'
    },
    {
      chord: 'E',
      frets: [7, 9, 9, 9, 7, 7],
      fingers: [1, 3, 3, 3, 1, 1],
      baseFret: 7,
      barres: [1],
      name: 'Barre (7th fret)'
    },
    {
      chord: 'E',
      frets: ['x', 7, 9, 9, 9, 7],
      fingers: ['x', 1, 3, 3, 3, 1],
      baseFret: 7,
      barres: [1],
      name: 'Partial barre (7th)'
    },
    {
      chord: 'E',
      frets: [12, 14, 14, 13, 12, 12],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 12,
      barres: [1],
      name: 'Barre (12th fret)'
    },
    {
      chord: 'E',
      frets: [0, 2, 2, 1, 'x', 'x'],
      fingers: [0, 2, 3, 1, 'x', 'x'],
      baseFret: 1,
      name: 'Open (low strings)'
    },
    {
      chord: 'E',
      frets: ['x', 'x', 6, 9, 9, 9],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 6,
      name: 'High partial (6th)'
    },
    {
      chord: 'E',
      frets: ['x', 'x', 2, 1, 0, 0],
      fingers: ['x', 'x', 2, 1, 0, 0],
      baseFret: 1,
      name: 'Inverted open'
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
      frets: [0, 2, 2, 0, 0, 3],
      fingers: [0, 1, 2, 0, 0, 3],
      baseFret: 1,
      name: 'Open (high E)'
    },
    {
      chord: 'Em',
      frets: ['x', 'x', 5, 7, 8, 7],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 5,
      name: 'Partial (5th fret)'
    },
    {
      chord: 'Em',
      frets: [7, 9, 9, 8, 7, 7],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 7,
      barres: [1],
      name: 'Barre (7th fret)'
    },
    {
      chord: 'Em',
      frets: ['x', 7, 9, 9, 8, 7],
      fingers: ['x', 1, 3, 4, 2, 1],
      baseFret: 7,
      barres: [1],
      name: 'Partial barre (7th)'
    },
    {
      chord: 'Em',
      frets: [12, 14, 14, 12, 12, 12],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 12,
      barres: [1],
      name: 'Barre (12th fret)'
    },
    {
      chord: 'Em',
      frets: [0, 2, 2, 0, 'x', 'x'],
      fingers: [0, 1, 2, 0, 'x', 'x'],
      baseFret: 1,
      name: 'Open (low strings)'
    },
    {
      chord: 'Em',
      frets: ['x', 'x', 9, 12, 12, 12],
      fingers: ['x', 'x', 1, 2, 3, 4],
      baseFret: 9,
      name: 'High partial (9th)'
    },
    {
      chord: 'Em',
      frets: ['x', 'x', 2, 0, 0, 0],
      fingers: ['x', 'x', 1, 0, 0, 0],
      baseFret: 1,
      name: 'Inverted open'
    }
  ],
  'F': [
    {
      chord: 'F',
      frets: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 1,
      barres: [1],
      name: 'Barre (1st fret)'
    },
    {
      chord: 'F',
      frets: ['x', 'x', 3, 5, 6, 5],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 3,
      name: 'Partial (3rd fret)'
    },
    {
      chord: 'F',
      frets: ['x', 3, 3, 2, 1, 1],
      fingers: ['x', 3, 4, 2, 1, 1],
      baseFret: 1,
      barres: [1],
      name: 'Partial barre (1st)'
    },
    {
      chord: 'F',
      frets: [8, 10, 10, 10, 8, 8],
      fingers: [1, 3, 3, 3, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'F',
      frets: ['x', 8, 10, 10, 10, 8],
      fingers: ['x', 1, 3, 3, 3, 1],
      baseFret: 8,
      barres: [1],
      name: 'Partial barre (8th)'
    },
    {
      chord: 'F',
      frets: [13, 15, 15, 14, 13, 13],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 13,
      barres: [1],
      name: 'Barre (13th fret)'
    },
    {
      chord: 'F',
      frets: ['x', 'x', 10, 10, 10, 13],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 10,
      name: 'Partial (10th fret)'
    },
    {
      chord: 'F',
      frets: [1, 3, 3, 2, 'x', 'x'],
      fingers: [1, 3, 4, 2, 'x', 'x'],
      baseFret: 1,
      barres: [1],
      name: 'Low strings barre'
    },
    {
      chord: 'F',
      frets: ['x', 'x', 3, 2, 1, 1],
      fingers: ['x', 'x', 3, 2, 1, 1],
      baseFret: 1,
      barres: [1],
      name: 'Compact partial'
    }
  ],
  'Fm': [
    {
      chord: 'Fm',
      frets: [1, 3, 3, 1, 1, 1],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 1,
      barres: [1],
      name: 'Barre (1st fret)'
    },
    {
      chord: 'Fm',
      frets: ['x', 'x', 3, 5, 6, 4],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 3,
      name: 'Partial (3rd fret)'
    },
    {
      chord: 'Fm',
      frets: ['x', 3, 3, 1, 1, 1],
      fingers: ['x', 3, 4, 1, 1, 1],
      baseFret: 1,
      barres: [1],
      name: 'Partial barre (1st)'
    },
    {
      chord: 'Fm',
      frets: [8, 10, 10, 8, 8, 8],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'Fm',
      frets: ['x', 8, 10, 10, 8, 8],
      fingers: ['x', 1, 3, 4, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Partial barre (8th)'
    },
    {
      chord: 'Fm',
      frets: [13, 15, 15, 13, 13, 13],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 13,
      barres: [1],
      name: 'Barre (13th fret)'
    },
    {
      chord: 'Fm',
      frets: ['x', 'x', 10, 10, 9, 8],
      fingers: ['x', 'x', 3, 4, 2, 1],
      baseFret: 8,
      name: 'Partial (8th fret)'
    },
    {
      chord: 'Fm',
      frets: [1, 3, 3, 1, 'x', 'x'],
      fingers: [1, 3, 4, 1, 'x', 'x'],
      baseFret: 1,
      barres: [1],
      name: 'Low strings barre'
    },
    {
      chord: 'Fm',
      frets: ['x', 'x', 3, 1, 1, 1],
      fingers: ['x', 'x', 3, 1, 1, 1],
      baseFret: 1,
      barres: [1],
      name: 'Compact partial'
    }
  ],
  'G': [
    {
      chord: 'G',
      frets: [3, 2, 0, 0, 0, 3],
      fingers: [2, 1, 0, 0, 0, 3],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'G',
      frets: [3, 2, 0, 0, 3, 3],
      fingers: [2, 1, 0, 0, 3, 4],
      baseFret: 1,
      name: 'Open (alternate)'
    },
    {
      chord: 'G',
      frets: ['x', 'x', 0, 4, 3, 3],
      fingers: ['x', 'x', 0, 3, 1, 2],
      baseFret: 1,
      name: 'Partial (open D)'
    },
    {
      chord: 'G',
      frets: [3, 5, 5, 4, 3, 3],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 3,
      barres: [1],
      name: 'Barre (3rd fret)'
    },
    {
      chord: 'G',
      frets: [10, 12, 12, 12, 10, 10],
      fingers: [1, 3, 3, 3, 1, 1],
      baseFret: 10,
      barres: [1],
      name: 'Barre (10th fret)'
    },
    {
      chord: 'G',
      frets: ['x', 10, 12, 12, 12, 10],
      fingers: ['x', 1, 3, 3, 3, 1],
      baseFret: 10,
      barres: [1],
      name: 'Partial barre (10th)'
    },
    {
      chord: 'G',
      frets: [3, 'x', 0, 0, 0, 3],
      fingers: [2, 'x', 0, 0, 0, 3],
      baseFret: 1,
      name: 'Open (no A string)'
    },
    {
      chord: 'G',
      frets: ['x', 'x', 5, 7, 8, 7],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 5,
      name: 'Partial (5th fret)'
    },
    {
      chord: 'G',
      frets: ['x', 'x', 12, 12, 12, 15],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 12,
      name: 'High partial (12th)'
    }
  ],
  'Gm': [
    {
      chord: 'Gm',
      frets: [3, 5, 5, 3, 3, 3],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 3,
      barres: [1],
      name: 'Barre (3rd fret)'
    },
    {
      chord: 'Gm',
      frets: ['x', 'x', 5, 7, 8, 6],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 5,
      name: 'Partial (5th fret)'
    },
    {
      chord: 'Gm',
      frets: ['x', 5, 5, 3, 3, 3],
      fingers: ['x', 3, 4, 1, 1, 1],
      baseFret: 3,
      barres: [1],
      name: 'Partial barre (3rd)'
    },
    {
      chord: 'Gm',
      frets: [10, 12, 12, 10, 10, 10],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 10,
      barres: [1],
      name: 'Barre (10th fret)'
    },
    {
      chord: 'Gm',
      frets: ['x', 10, 12, 12, 10, 10],
      fingers: ['x', 1, 3, 4, 1, 1],
      baseFret: 10,
      barres: [1],
      name: 'Partial barre (10th)'
    },
    {
      chord: 'Gm',
      frets: ['x', 'x', 12, 14, 15, 13],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 12,
      name: 'High voicing (12th)'
    },
    {
      chord: 'Gm',
      frets: [3, 5, 5, 3, 'x', 'x'],
      fingers: [1, 3, 4, 1, 'x', 'x'],
      baseFret: 3,
      barres: [1],
      name: 'Low strings (3rd)'
    },
    {
      chord: 'Gm',
      frets: ['x', 'x', 3, 3, 3, 6],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 3,
      name: 'Extended partial (3rd)'
    },
    {
      chord: 'Gm',
      frets: ['x', 'x', 0, 3, 3, 3],
      fingers: ['x', 'x', 0, 1, 2, 3],
      baseFret: 1,
      name: 'Partial open'
    }
  ],
  'A': [
    {
      chord: 'A',
      frets: ['x', 0, 2, 2, 2, 0],
      fingers: ['x', 0, 1, 2, 3, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'A',
      frets: ['x', 0, 2, 2, 2, 5],
      fingers: ['x', 0, 1, 2, 3, 4],
      baseFret: 1,
      name: 'Open (high E)'
    },
    {
      chord: 'A',
      frets: ['x', 'x', 2, 2, 2, 5],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 1,
      name: 'Partial (tight)'
    },
    {
      chord: 'A',
      frets: [5, 7, 7, 6, 5, 5],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 5,
      barres: [1],
      name: 'Barre (5th fret)'
    },
    {
      chord: 'A',
      frets: ['x', 12, 14, 14, 14, 12],
      fingers: ['x', 1, 3, 3, 3, 1],
      baseFret: 12,
      barres: [1],
      name: 'Barre (12th fret)'
    },
    {
      chord: 'A',
      frets: ['x', 'x', 7, 9, 10, 9],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 7,
      name: 'High voicing (7th)'
    },
    {
      chord: 'A',
      frets: ['x', 0, 2, 2, 2, 'x'],
      fingers: ['x', 0, 1, 2, 3, 'x'],
      baseFret: 1,
      name: 'Open (compact)'
    },
    {
      chord: 'A',
      frets: [5, 7, 7, 6, 'x', 'x'],
      fingers: [1, 3, 4, 2, 'x', 'x'],
      baseFret: 5,
      name: 'Low strings (5th)'
    },
    {
      chord: 'A',
      frets: ['x', 'x', 14, 14, 14, 17],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 14,
      name: 'High partial (14th)'
    }
  ],
  'Am': [
    {
      chord: 'Am',
      frets: ['x', 0, 2, 2, 1, 0],
      fingers: ['x', 0, 2, 3, 1, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Am',
      frets: ['x', 0, 2, 2, 1, 3],
      fingers: ['x', 0, 2, 3, 1, 4],
      baseFret: 1,
      name: 'Open (high E)'
    },
    {
      chord: 'Am',
      frets: ['x', 'x', 2, 2, 1, 0],
      fingers: ['x', 'x', 2, 3, 1, 0],
      baseFret: 1,
      name: 'Partial (tight)'
    },
    {
      chord: 'Am',
      frets: [5, 7, 7, 5, 5, 5],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 5,
      barres: [1],
      name: 'Barre (5th fret)'
    },
    {
      chord: 'Am',
      frets: ['x', 12, 14, 14, 13, 12],
      fingers: ['x', 1, 3, 4, 2, 1],
      baseFret: 12,
      barres: [1],
      name: 'Barre (12th fret)'
    },
    {
      chord: 'Am',
      frets: ['x', 'x', 10, 12, 13, 12],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 10,
      name: 'High voicing (10th)'
    },
    {
      chord: 'Am',
      frets: ['x', 0, 2, 2, 1, 'x'],
      fingers: ['x', 0, 2, 3, 1, 'x'],
      baseFret: 1,
      name: 'Open (compact)'
    },
    {
      chord: 'Am',
      frets: [5, 7, 7, 5, 'x', 'x'],
      fingers: [1, 3, 4, 1, 'x', 'x'],
      baseFret: 5,
      barres: [1],
      name: 'Low strings (5th)'
    },
    {
      chord: 'Am',
      frets: ['x', 'x', 5, 5, 5, 8],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 5,
      name: 'Extended partial (5th)'
    }
  ],
  'B': [
    {
      chord: 'B',
      frets: ['x', 2, 4, 4, 4, 2],
      fingers: ['x', 1, 3, 3, 3, 1],
      baseFret: 2,
      barres: [1],
      name: 'Barre (2nd fret)'
    },
    {
      chord: 'B',
      frets: ['x', 'x', 4, 4, 4, 7],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 4,
      name: 'Partial (4th fret)'
    },
    {
      chord: 'B',
      frets: ['x', 2, 4, 4, 4, 'x'],
      fingers: ['x', 1, 3, 4, 4, 'x'],
      baseFret: 2,
      name: 'Partial barre (2nd)'
    },
    {
      chord: 'B',
      frets: [7, 9, 9, 8, 7, 7],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 7,
      barres: [1],
      name: 'Barre (7th fret)'
    },
    {
      chord: 'B',
      frets: ['x', 'x', 9, 11, 12, 11],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 9,
      name: 'High voicing (9th)'
    },
    {
      chord: 'B',
      frets: ['x', 7, 9, 9, 8, 7],
      fingers: ['x', 1, 3, 4, 2, 1],
      baseFret: 7,
      barres: [1],
      name: 'Partial barre (7th)'
    },
    {
      chord: 'B',
      frets: ['x', 'x', 9, 9, 9, 12],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 9,
      name: 'Extended partial (9th)'
    },
    {
      chord: 'B',
      frets: [7, 9, 9, 8, 'x', 'x'],
      fingers: [1, 3, 4, 2, 'x', 'x'],
      baseFret: 7,
      name: 'Low strings (7th)'
    },
    {
      chord: 'B',
      frets: ['x', 2, 4, 4, 'x', 'x'],
      fingers: ['x', 1, 3, 4, 'x', 'x'],
      baseFret: 2,
      name: 'Minimal (2nd fret)'
    }
  ],
  'Bm': [
    {
      chord: 'Bm',
      frets: ['x', 2, 4, 4, 3, 2],
      fingers: ['x', 1, 3, 4, 2, 1],
      baseFret: 2,
      barres: [1],
      name: 'Barre (2nd fret)'
    },
    {
      chord: 'Bm',
      frets: ['x', 'x', 4, 4, 3, 2],
      fingers: ['x', 'x', 3, 4, 2, 1],
      baseFret: 2,
      name: 'Partial (2nd fret)'
    },
    {
      chord: 'Bm',
      frets: ['x', 2, 4, 4, 3, 'x'],
      fingers: ['x', 1, 3, 4, 2, 'x'],
      baseFret: 2,
      name: 'Partial barre (2nd)'
    },
    {
      chord: 'Bm',
      frets: [7, 9, 9, 7, 7, 7],
      fingers: [1, 3, 4, 1, 1, 1],
      baseFret: 7,
      barres: [1],
      name: 'Barre (7th fret)'
    },
    {
      chord: 'Bm',
      frets: ['x', 'x', 9, 11, 12, 10],
      fingers: ['x', 'x', 1, 3, 4, 2],
      baseFret: 9,
      name: 'High voicing (9th)'
    },
    {
      chord: 'Bm',
      frets: ['x', 7, 9, 9, 7, 7],
      fingers: ['x', 1, 3, 4, 1, 1],
      baseFret: 7,
      barres: [1],
      name: 'Partial barre (7th)'
    },
    {
      chord: 'Bm',
      frets: ['x', 'x', 9, 9, 8, 7],
      fingers: ['x', 'x', 3, 4, 2, 1],
      baseFret: 7,
      name: 'Compact (7th fret)'
    },
    {
      chord: 'Bm',
      frets: [7, 9, 9, 7, 'x', 'x'],
      fingers: [1, 3, 4, 1, 'x', 'x'],
      baseFret: 7,
      barres: [1],
      name: 'Low strings (7th)'
    },
    {
      chord: 'Bm',
      frets: ['x', 2, 4, 4, 'x', 'x'],
      fingers: ['x', 1, 3, 4, 'x', 'x'],
      baseFret: 2,
      name: 'Minimal (2nd fret)'
    }
  ],

  // ============================================================================
  // TASK 1: EXTENDED CHORD TYPES - Dominant 7th, Major 7th, Minor 7th, etc.
  // ============================================================================

  // C Dominant 7th (C7)
  'C7': [
    {
      chord: 'C7',
      frets: [0, 3, 2, 3, 1, 0],
      fingers: [0, 3, 2, 4, 1, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'C7',
      frets: ['x', 3, 2, 3, 1, 'x'],
      fingers: ['x', 3, 2, 4, 1, 'x'],
      baseFret: 1,
      name: 'Open (middle strings)'
    },
    {
      chord: 'C7',
      frets: [8, 10, 8, 9, 8, 8],
      fingers: [1, 3, 1, 2, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'C7',
      frets: ['x', 3, 5, 3, 5, 3],
      fingers: ['x', 1, 3, 1, 4, 1],
      baseFret: 3,
      barres: [1],
      name: 'Barre (3rd fret)'
    }
  ],

  // C Major 7th (Cmaj7)
  'Cmaj7': [
    {
      chord: 'Cmaj7',
      frets: [0, 3, 2, 0, 0, 0],
      fingers: [0, 3, 2, 0, 0, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Cmaj7',
      frets: ['x', 3, 2, 0, 0, 'x'],
      fingers: ['x', 3, 2, 0, 0, 'x'],
      baseFret: 1,
      name: 'Open (no bass)'
    },
    {
      chord: 'Cmaj7',
      frets: [8, 10, 9, 9, 8, 8],
      fingers: [1, 4, 2, 3, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'Cmaj7',
      frets: ['x', 'x', 10, 9, 8, 7],
      fingers: ['x', 'x', 4, 3, 2, 1],
      baseFret: 7,
      name: 'High voicing'
    }
  ],

  // C Minor 7th (Cm7)
  'Cm7': [
    {
      chord: 'Cm7',
      frets: ['x', 3, 1, 3, 1, 'x'],
      fingers: ['x', 3, 1, 4, 1, 'x'],
      baseFret: 1,
      barres: [1],
      name: 'Open (partial barre)'
    },
    {
      chord: 'Cm7',
      frets: [8, 10, 8, 8, 8, 8],
      fingers: [1, 3, 1, 1, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'Cm7',
      frets: ['x', 'x', 10, 8, 8, 8],
      fingers: ['x', 'x', 4, 1, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'High (10th fret)'
    }
  ],

  // C Diminished (Cdim)
  'Cdim': [
    {
      chord: 'Cdim',
      frets: ['x', 3, 1, 2, 1, 'x'],
      fingers: ['x', 4, 1, 3, 2, 'x'],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Cdim',
      frets: ['x', 'x', 10, 7, 8, 7],
      fingers: ['x', 'x', 4, 1, 3, 2],
      baseFret: 7,
      name: 'High voicing (7th)'
    },
    {
      chord: 'Cdim',
      frets: ['x', 3, 4, 5, 4, 'x'],
      fingers: ['x', 1, 2, 4, 3, 'x'],
      baseFret: 3,
      name: 'Mid voicing'
    }
  ],

  // C Augmented (Caug)
  'Caug': [
    {
      chord: 'Caug',
      frets: ['x', 3, 2, 1, 1, 'x'],
      fingers: ['x', 4, 3, 1, 2, 'x'],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Caug',
      frets: ['x', 'x', 10, 9, 9, 'x'],
      fingers: ['x', 'x', 3, 1, 2, 'x'],
      baseFret: 9,
      name: 'High voicing'
    },
    {
      chord: 'Caug',
      frets: [8, 'x', 9, 9, 9, 'x'],
      fingers: [1, 'x', 2, 3, 4, 'x'],
      baseFret: 8,
      name: 'Mid position (8th)'
    }
  ],

  // C Suspended 2nd (Csus2)
  'Csus2': [
    {
      chord: 'Csus2',
      frets: ['x', 3, 0, 0, 1, 'x'],
      fingers: ['x', 3, 0, 0, 1, 'x'],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Csus2',
      frets: [8, 10, 10, 10, 8, 8],
      fingers: [1, 2, 3, 4, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'Csus2',
      frets: ['x', 'x', 10, 10, 10, 13],
      fingers: ['x', 'x', 1, 1, 1, 4],
      baseFret: 10,
      barres: [1],
      name: 'High voicing'
    }
  ],

  // C Suspended 4th (Csus4)
  'Csus4': [
    {
      chord: 'Csus4',
      frets: ['x', 3, 3, 0, 1, 1],
      fingers: ['x', 3, 4, 0, 1, 2],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Csus4',
      frets: [8, 10, 10, 10, 8, 8],
      fingers: [1, 3, 3, 3, 1, 1],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'Csus4',
      frets: ['x', 'x', 10, 10, 11, 13],
      fingers: ['x', 'x', 1, 1, 2, 4],
      baseFret: 10,
      barres: [1],
      name: 'High voicing'
    }
  ],

  // C Add9 (Cadd9)
  'Cadd9': [
    {
      chord: 'Cadd9',
      frets: ['x', 3, 2, 0, 3, 0],
      fingers: ['x', 2, 1, 0, 3, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'Cadd9',
      frets: [8, 10, 10, 9, 10, 8],
      fingers: [1, 3, 4, 2, 4, 1],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'Cadd9',
      frets: ['x', 'x', 10, 10, 12, 10],
      fingers: ['x', 'x', 1, 1, 3, 1],
      baseFret: 10,
      barres: [1],
      name: 'High voicing'
    }
  ],

  // C Sixth (C6)
  'C6': [
    {
      chord: 'C6',
      frets: ['x', 3, 2, 2, 1, 0],
      fingers: ['x', 4, 2, 3, 1, 0],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'C6',
      frets: [8, 10, 10, 9, 10, 10],
      fingers: [1, 2, 3, 1, 3, 4],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'C6',
      frets: ['x', 'x', 10, 10, 10, 10],
      fingers: ['x', 'x', 1, 1, 1, 1],
      baseFret: 10,
      barres: [1],
      name: 'High (block chord)'
    }
  ],

  // C Ninth (C9)
  'C9': [
    {
      chord: 'C9',
      frets: ['x', 3, 2, 3, 3, 'x'],
      fingers: ['x', 2, 1, 3, 4, 'x'],
      baseFret: 1,
      name: 'Open Position'
    },
    {
      chord: 'C9',
      frets: [8, 10, 8, 9, 10, 'x'],
      fingers: [1, 3, 1, 2, 4, 'x'],
      baseFret: 8,
      barres: [1],
      name: 'Barre (8th fret)'
    },
    {
      chord: 'C9',
      frets: ['x', 'x', 10, 10, 10, 12],
      fingers: ['x', 'x', 1, 1, 1, 3],
      baseFret: 10,
      barres: [1],
      name: 'High voicing'
    }
  ]
};

export function getChordPositions(chordName: string): ChordPosition[] {
  const normalized = chordName.replace('♭', 'b').replace('♯', '#');
  const positions = CHORD_POSITIONS[normalized] || [];

  return positions.sort((a, b) => {
    const aMinFret = Math.min(...a.frets.filter(f => typeof f === 'number' && f > 0) as number[]);
    const bMinFret = Math.min(...b.frets.filter(f => typeof f === 'number' && f > 0) as number[]);
    return aMinFret - bMinFret;
  });
}
