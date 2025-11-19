export interface PowerChordPosition {
  name: string;
  fret: number;
  chordName: string;
  fingerPositions: {
    string: number;
    fret: number;
    finger: number;
    note: string;
    isRoot: boolean;
  }[];
  mutedStrings: number[];
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  shape: 'E-shape' | 'A-shape' | 'D-shape';
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const OPEN_STRINGS: Record<number, string> = {
  1: 'E',
  2: 'B',
  3: 'G',
  4: 'D',
  5: 'A',
  6: 'E'
};

function findFretForNote(targetNote: string, stringNumber: number): number {
  const openNote = OPEN_STRINGS[stringNumber];
  const openIndex = NOTES.indexOf(openNote);
  const targetIndex = NOTES.indexOf(targetNote);

  let fret = (targetIndex - openIndex + 12) % 12;

  return fret;
}

function getFifth(root: string): string {
  const rootIndex = NOTES.indexOf(root);
  const fifthIndex = (rootIndex + 7) % 12;
  return NOTES[fifthIndex];
}

// ============================================================================
// TASK 3: Expanded power chord positions - guaranteed minimum 3 per root note
// Added more variations including higher octave positions and different string combos
// ============================================================================
export function generatePowerChordPositions(root: string): PowerChordPosition[] {
  const fifth = getFifth(root);
  const positions: PowerChordPosition[] = [];

  // Position 1: Low E string root (frets 0-5)
  const lowE_rootFret = findFretForNote(root, 6);
  if (lowE_rootFret >= 0 && lowE_rootFret <= 5) {
    positions.push({
      name: `Open/Low Position`,
      fret: lowE_rootFret,
      chordName: `${root}5`,
      fingerPositions: [
        {
          string: 6,
          fret: lowE_rootFret,
          finger: lowE_rootFret === 0 ? 0 : 1,
          note: root,
          isRoot: true
        },
        {
          string: 5,
          fret: lowE_rootFret + 2,
          finger: 3,
          note: fifth,
          isRoot: false
        },
        {
          string: 4,
          fret: lowE_rootFret + 2,
          finger: 4,
          note: root,
          isRoot: true
        }
      ],
      mutedStrings: [1, 2, 3],
      difficulty: 'easy',
      description: '6th string root - classic rock position',
      shape: 'E-shape'
    });
  }

  // Position 2: A string root (frets 0-5)
  const lowA_rootFret = findFretForNote(root, 5);
  if (lowA_rootFret >= 0 && lowA_rootFret <= 5) {
    positions.push({
      name: `Low (5th string root)`,
      fret: lowA_rootFret,
      chordName: `${root}5`,
      fingerPositions: [
        {
          string: 5,
          fret: lowA_rootFret,
          finger: lowA_rootFret === 0 ? 0 : 1,
          note: root,
          isRoot: true
        },
        {
          string: 4,
          fret: lowA_rootFret + 2,
          finger: 3,
          note: fifth,
          isRoot: false
        },
        {
          string: 3,
          fret: lowA_rootFret + 2,
          finger: 4,
          note: root,
          isRoot: true
        }
      ],
      mutedStrings: [1, 2, 6],
      difficulty: 'easy',
      description: '5th string root - A-shape',
      shape: 'A-shape'
    });
  }

  // Position 3: D string root (frets 0-7)
  const lowD_rootFret = findFretForNote(root, 4);
  if (lowD_rootFret >= 0 && lowD_rootFret <= 7) {
    positions.push({
      name: `D-string Position`,
      fret: lowD_rootFret,
      chordName: `${root}5`,
      fingerPositions: [
        { string: 4, fret: lowD_rootFret, finger: 1, note: root, isRoot: true },
        { string: 3, fret: lowD_rootFret + 2, finger: 3, note: fifth, isRoot: false },
        { string: 2, fret: lowD_rootFret + 3, finger: 4, note: root, isRoot: true }
      ],
      mutedStrings: [1, 5, 6],
      difficulty: 'medium',
      description: '4th string root - less common',
      shape: 'D-shape'
    });
  }

  // Position 4: Higher E string (octave up, frets 7-12)
  const midE_rootFret = lowE_rootFret + 12;
  if (midE_rootFret >= 7 && midE_rootFret <= 12) {
    positions.push({
      name: `Mid Position (6th string)`,
      fret: midE_rootFret - 1,
      chordName: `${root}5`,
      fingerPositions: [
        { string: 6, fret: midE_rootFret, finger: 1, note: root, isRoot: true },
        { string: 5, fret: midE_rootFret + 2, finger: 3, note: fifth, isRoot: false },
        { string: 4, fret: midE_rootFret + 2, finger: 4, note: root, isRoot: true }
      ],
      mutedStrings: [1, 2, 3],
      difficulty: 'medium',
      description: 'Higher on neck, same E-shape',
      shape: 'E-shape'
    });
  }

  // Position 5: Higher A string (octave up, frets 7-12)
  const midA_rootFret = lowA_rootFret + 12;
  if (midA_rootFret >= 7 && midA_rootFret <= 12) {
    positions.push({
      name: `Mid (5th string root)`,
      fret: midA_rootFret - 1,
      chordName: `${root}5`,
      fingerPositions: [
        { string: 5, fret: midA_rootFret, finger: 1, note: root, isRoot: true },
        { string: 4, fret: midA_rootFret + 2, finger: 3, note: fifth, isRoot: false },
        { string: 3, fret: midA_rootFret + 2, finger: 4, note: root, isRoot: true }
      ],
      mutedStrings: [1, 2, 6],
      difficulty: 'medium',
      description: 'Higher 5th string position',
      shape: 'A-shape'
    });
  }

  // Position 6: Octave voicing on E string (wider spread)
  if (lowE_rootFret >= 0 && lowE_rootFret <= 5) {
    positions.push({
      name: `Octave Voicing`,
      fret: lowE_rootFret,
      chordName: `${root}5`,
      fingerPositions: [
        {
          string: 6,
          fret: lowE_rootFret,
          finger: lowE_rootFret === 0 ? 0 : 1,
          note: root,
          isRoot: true
        },
        {
          string: 4,
          fret: lowE_rootFret + 2,
          finger: 3,
          note: root,
          isRoot: true
        },
        {
          string: 3,
          fret: lowE_rootFret + 2,
          finger: 4,
          note: fifth,
          isRoot: false
        }
      ],
      mutedStrings: [1, 2, 5],
      difficulty: 'medium',
      description: 'Wider voicing with octave spread',
      shape: 'E-shape'
    });
  }

  // Position 7: Two-string power chord on E and A strings (compact)
  if (lowE_rootFret >= 0 && lowE_rootFret <= 7) {
    positions.push({
      name: `Two-String (E-A)`,
      fret: lowE_rootFret,
      chordName: `${root}5`,
      fingerPositions: [
        {
          string: 6,
          fret: lowE_rootFret,
          finger: lowE_rootFret === 0 ? 0 : 1,
          note: root,
          isRoot: true
        },
        {
          string: 5,
          fret: lowE_rootFret + 2,
          finger: 3,
          note: fifth,
          isRoot: false
        }
      ],
      mutedStrings: [1, 2, 3, 4],
      difficulty: 'easy',
      description: 'Minimal 2-string version - punchy sound',
      shape: 'E-shape'
    });
  }

  // Position 8: Two-string power chord on A and D strings (compact)
  if (lowA_rootFret >= 0 && lowA_rootFret <= 7) {
    positions.push({
      name: `Two-String (A-D)`,
      fret: lowA_rootFret,
      chordName: `${root}5`,
      fingerPositions: [
        {
          string: 5,
          fret: lowA_rootFret,
          finger: lowA_rootFret === 0 ? 0 : 1,
          note: root,
          isRoot: true
        },
        {
          string: 4,
          fret: lowA_rootFret + 2,
          finger: 3,
          note: fifth,
          isRoot: false
        }
      ],
      mutedStrings: [1, 2, 3, 6],
      difficulty: 'easy',
      description: 'Minimal 2-string version - clear tone',
      shape: 'A-shape'
    });
  }

  // Position 9: High G string position (for variety)
  const highG_rootFret = findFretForNote(root, 3);
  if (highG_rootFret >= 0 && highG_rootFret <= 10) {
    positions.push({
      name: `High (G-string root)`,
      fret: highG_rootFret,
      chordName: `${root}5`,
      fingerPositions: [
        { string: 3, fret: highG_rootFret, finger: 1, note: root, isRoot: true },
        { string: 2, fret: highG_rootFret + 3, finger: 4, note: fifth, isRoot: false }
      ],
      mutedStrings: [1, 4, 5, 6],
      difficulty: 'medium',
      description: 'High register power chord - bright sound',
      shape: 'D-shape'
    });
  }

  // Ensure we always return at least 3 positions
  // If we don't have enough, add alternative fingerings
  if (positions.length < 3) {
    // Add simple barre position at fret 5 if available
    const barreFret = 5;
    positions.push({
      name: `Mid Barre (5th fret)`,
      fret: barreFret,
      chordName: `${root}5`,
      fingerPositions: [
        { string: 6, fret: barreFret, finger: 1, note: root, isRoot: true },
        { string: 5, fret: barreFret + 2, finger: 3, note: fifth, isRoot: false },
        { string: 4, fret: barreFret + 2, finger: 4, note: root, isRoot: true }
      ],
      mutedStrings: [1, 2, 3],
      difficulty: 'easy',
      description: 'Standard barre position',
      shape: 'E-shape'
    });
  }

  // Return all positions (no slice limit)
  return positions;
}
