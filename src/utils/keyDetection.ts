import { ChordQuality } from './chordEnhancements';

export interface KeyContext {
  key: string;
  mode: 'major' | 'minor';
  romanNumeral: string;
  function: string;
  confidence: 'high' | 'medium' | 'low';
}

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

const NOTE_TO_INDEX: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1,
  'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8,
  'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11
};

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const ROMAN_NUMERALS_MAJOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const ROMAN_NUMERALS_MINOR = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

const CHORD_FUNCTIONS: Record<string, string> = {
  'I': 'Tonic',
  'ii': 'Supertonic',
  'iii': 'Mediant',
  'IV': 'Subdominant',
  'V': 'Dominant',
  'vi': 'Submediant',
  'vii°': 'Leading Tone',
  'i': 'Tonic',
  'ii°': 'Supertonic',
  'III': 'Mediant',
  'iv': 'Subdominant',
  'v': 'Dominant',
  'VI': 'Submediant',
  'VII': 'Subtonic',
  '♭VII': 'Subtonic (borrowed)',
  'iv (borrowed)': 'Minor Subdominant (borrowed)',
  '♭III': 'Borrowed from minor',
  '♭VI': 'Borrowed from minor'
};

function normalizeNote(note: string): string {
  const normalized = note.replace(/[^A-G#b]/g, '');

  if (normalized in NOTE_TO_INDEX) {
    const index = NOTE_TO_INDEX[normalized];
    return CHROMATIC_NOTES[index];
  }

  return normalized;
}

function getScaleDegree(rootNote: string, chordRoot: string, scaleIntervals: number[]): number | null {
  const rootIndex = NOTE_TO_INDEX[normalizeNote(rootNote)];
  const chordIndex = NOTE_TO_INDEX[normalizeNote(chordRoot)];

  if (rootIndex === undefined || chordIndex === undefined) {
    return null;
  }

  const interval = (chordIndex - rootIndex + 12) % 12;

  const degreeIndex = scaleIntervals.indexOf(interval);
  return degreeIndex !== -1 ? degreeIndex : null;
}

function checkBorrowedChord(chordRoot: string, chordQuality: ChordQuality, keyRoot: string, mode: 'major' | 'minor'): { romanNumeral: string; function: string } | null {
  const rootIndex = NOTE_TO_INDEX[normalizeNote(keyRoot)];
  const chordIndex = NOTE_TO_INDEX[normalizeNote(chordRoot)];

  if (rootIndex === undefined || chordIndex === undefined) {
    return null;
  }

  const interval = (chordIndex - rootIndex + 12) % 12;

  if (mode === 'major') {
    if (interval === 5 && chordQuality === 'minor') {
      return { romanNumeral: 'iv', function: 'Minor Subdominant (borrowed)' };
    }
    if (interval === 10 && chordQuality === 'major') {
      return { romanNumeral: '♭VII', function: 'Subtonic (borrowed)' };
    }
    if (interval === 8 && chordQuality === 'major') {
      return { romanNumeral: '♭VI', function: 'Borrowed from minor' };
    }
    if (interval === 3 && chordQuality === 'major') {
      return { romanNumeral: '♭III', function: 'Borrowed from minor' };
    }
  }

  return null;
}

export function detectPossibleKeys(chordRoot: string, chordQuality: ChordQuality): KeyContext[] {
  const possibleKeys: KeyContext[] = [];
  const normalizedRoot = normalizeNote(chordRoot);

  for (const potentialKey of CHROMATIC_NOTES) {
    const majorDegree = getScaleDegree(potentialKey, normalizedRoot, MAJOR_SCALE_INTERVALS);

    if (majorDegree !== null) {
      const expectedQuality = [0, 3, 4].includes(majorDegree) ? 'major' :
                             [1, 2, 5].includes(majorDegree) ? 'minor' :
                             'diminished';

      let confidence: 'high' | 'medium' | 'low' = 'low';
      if (chordQuality === expectedQuality ||
          (chordQuality === 'major7' && expectedQuality === 'major') ||
          (chordQuality === 'minor7' && expectedQuality === 'minor') ||
          (chordQuality === 'dominant7' && majorDegree === 4)) {
        confidence = 'high';
      } else if (chordQuality.includes('7') && expectedQuality !== 'diminished') {
        confidence = 'medium';
      }

      if (confidence !== 'low') {
        possibleKeys.push({
          key: potentialKey,
          mode: 'major',
          romanNumeral: ROMAN_NUMERALS_MAJOR[majorDegree],
          function: CHORD_FUNCTIONS[ROMAN_NUMERALS_MAJOR[majorDegree]] || 'Unknown',
          confidence
        });
      }
    }

    const minorDegree = getScaleDegree(potentialKey, normalizedRoot, MINOR_SCALE_INTERVALS);

    if (minorDegree !== null) {
      const expectedQuality = [2, 5, 6].includes(minorDegree) ? 'major' :
                             [0, 3].includes(minorDegree) ? 'minor' :
                             'diminished';

      let confidence: 'high' | 'medium' | 'low' = 'low';
      if (chordQuality === expectedQuality ||
          (chordQuality === 'major7' && expectedQuality === 'major') ||
          (chordQuality === 'minor7' && expectedQuality === 'minor')) {
        confidence = 'high';
      } else if (chordQuality.includes('7') && expectedQuality !== 'diminished') {
        confidence = 'medium';
      }

      if (confidence !== 'low') {
        possibleKeys.push({
          key: potentialKey,
          mode: 'minor',
          romanNumeral: ROMAN_NUMERALS_MINOR[minorDegree],
          function: CHORD_FUNCTIONS[ROMAN_NUMERALS_MINOR[minorDegree]] || 'Unknown',
          confidence
        });
      }
    }

    const borrowed = checkBorrowedChord(normalizedRoot, chordQuality, potentialKey, 'major');
    if (borrowed) {
      possibleKeys.push({
        key: potentialKey,
        mode: 'major',
        romanNumeral: borrowed.romanNumeral,
        function: borrowed.function,
        confidence: 'medium'
      });
    }
  }

  possibleKeys.sort((a, b) => {
    const confidenceOrder = { high: 3, medium: 2, low: 1 };
    const confidenceDiff = confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
    if (confidenceDiff !== 0) return confidenceDiff;

    const functionOrder = ['Tonic', 'Dominant', 'Subdominant', 'Submediant', 'Mediant', 'Supertonic'];
    const aIndex = functionOrder.indexOf(a.function.split(' ')[0]);
    const bIndex = functionOrder.indexOf(b.function.split(' ')[0]);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;

    return 0;
  });

  return possibleKeys.slice(0, 6);
}

export function getBestKeyMatch(chordRoot: string, chordQuality: ChordQuality): KeyContext | null {
  const possibleKeys = detectPossibleKeys(chordRoot, chordQuality);
  return possibleKeys.length > 0 ? possibleKeys[0] : null;
}
