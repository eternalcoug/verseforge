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

export function generatePowerChordPositions(root: string): PowerChordPosition[] {
  const fifth = getFifth(root);
  const positions: PowerChordPosition[] = [];

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

  const midE_rootFret = lowE_rootFret + 12;
  if (midE_rootFret >= 5 && midE_rootFret <= 12) {
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
      description: 'Higher on neck, same shape',
      shape: 'E-shape'
    });
  }

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

  const midA_rootFret = lowA_rootFret + 12;
  if (midA_rootFret >= 5 && midA_rootFret <= 12) {
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
      difficulty: 'hard',
      description: 'Wider voicing with octave spread',
      shape: 'E-shape'
    });
  }

  return positions.slice(0, 6);
}
