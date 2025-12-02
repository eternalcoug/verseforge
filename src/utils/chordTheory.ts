export type ChordQuality = 'major' | 'minor' | 'diminished' | 'maj7' | 'min7' | 'dom7' | 'dim7' | 'm7b5';

export interface DiatonicChord {
  root: string;
  quality: ChordQuality;
  romanNumeral: string;
  display: string;
  isBorrowed: boolean;
  isCommonInCountry?: boolean;
}

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transposeNote(note: string, semitones: number): string {
  const index = CHROMATIC_NOTES.indexOf(note);
  if (index === -1) return note;
  const newIndex = (index + semitones + 12) % 12;
  return CHROMATIC_NOTES[newIndex];
}

function getChordDisplay(root: string, quality: ChordQuality): string {
  switch (quality) {
    case 'major': return root;
    case 'minor': return root + 'm';
    case 'diminished': return root + 'dim';
    case 'maj7': return root + 'maj7';
    case 'min7': return root + 'm7';
    case 'dom7': return root + '7';
    case 'dim7': return root + 'dim7';
    case 'm7b5': return root + 'm7♭5';
    default: return root;
  }
}

export function getDiatonicChords(key: string, mode: 'major' | 'minor', useSevenths: boolean = false): DiatonicChord[] {
  if (mode === 'major') {
    // Major key diatonic chords: I, ii, iii, IV, V, vi, vii°
    const intervals = [0, 2, 4, 5, 7, 9, 11];
    const triadQualities: ChordQuality[] = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'];
    const seventhQualities: ChordQuality[] = ['maj7', 'min7', 'min7', 'maj7', 'dom7', 'min7', 'm7b5'];
    const triadRomanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
    const seventhRomanNumerals = ['Imaj7', 'ii7', 'iii7', 'IVmaj7', 'V7', 'vi7', 'viiø7'];

    const qualities = useSevenths ? seventhQualities : triadQualities;
    const romanNumerals = useSevenths ? seventhRomanNumerals : triadRomanNumerals;

    return intervals.map((interval, i) => {
      const root = transposeNote(key, interval);
      return {
        root,
        quality: qualities[i],
        romanNumeral: romanNumerals[i],
        display: getChordDisplay(root, qualities[i]),
        isBorrowed: false
      };
    });
  } else {
    // Minor key diatonic chords: i, ii°, ♭III, iv, v, ♭VI, ♭VII
    const intervals = [0, 2, 3, 5, 7, 8, 10];
    const triadQualities: ChordQuality[] = ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'];
    const seventhQualities: ChordQuality[] = ['min7', 'm7b5', 'maj7', 'min7', 'min7', 'maj7', 'dom7'];
    const triadRomanNumerals = ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII'];
    const seventhRomanNumerals = ['i7', 'iiø7', '♭IIImaj7', 'iv7', 'v7', '♭VImaj7', '♭VII7'];

    const qualities = useSevenths ? seventhQualities : triadQualities;
    const romanNumerals = useSevenths ? seventhRomanNumerals : triadRomanNumerals;

    return intervals.map((interval, i) => {
      const root = transposeNote(key, interval);
      return {
        root,
        quality: qualities[i],
        romanNumeral: romanNumerals[i],
        display: getChordDisplay(root, qualities[i]),
        isBorrowed: false
      };
    });
  }
}

export function getBorrowedChords(key: string, mode: 'major' | 'minor', useSevenths: boolean = false): DiatonicChord[] {
  if (mode === 'major') {
    // Borrowing from parallel minor
    const intervals = [0, 2, 3, 5, 7, 8, 10];
    const triadQualities: ChordQuality[] = ['minor', 'm7b5', 'major', 'minor', 'minor', 'major', 'major'];
    const seventhQualities: ChordQuality[] = ['min7', 'm7b5', 'maj7', 'min7', 'min7', 'maj7', 'dom7'];
    const triadRomanNumerals = ['i', 'iiø', '♭III', 'iv', 'v', '♭VI', '♭VII'];
    const seventhRomanNumerals = ['i7', 'iiø7', '♭IIImaj7', 'iv7', 'v7', '♭VImaj7', '♭VII7'];

    const qualities = useSevenths ? seventhQualities : triadQualities;
    const romanNumerals = useSevenths ? seventhRomanNumerals : triadRomanNumerals;

    return intervals.map((interval, i) => {
      const root = transposeNote(key, interval);
      // iv and ♭VII are most common in country
      const isCommonInCountry = i === 3 || i === 6;

      return {
        root,
        quality: qualities[i],
        romanNumeral: romanNumerals[i],
        display: getChordDisplay(root, qualities[i]),
        isBorrowed: true,
        isCommonInCountry
      };
    });
  } else {
    // Borrowing from parallel major
    const intervals = [0, 2, 4, 5, 7, 9, 11];
    const triadQualities: ChordQuality[] = ['major', 'major', 'major', 'major', 'major', 'major', 'diminished'];
    const seventhQualities: ChordQuality[] = ['maj7', 'dom7', 'maj7', 'maj7', 'dom7', 'maj7', 'm7b5'];
    const triadRomanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'vii°'];
    const seventhRomanNumerals = ['Imaj7', 'II7', 'IIImaj7', 'IVmaj7', 'V7', 'VImaj7', 'viiø7'];

    const qualities = useSevenths ? seventhQualities : triadQualities;
    const romanNumerals = useSevenths ? seventhRomanNumerals : triadRomanNumerals;

    return intervals.map((interval, i) => {
      const root = transposeNote(key, interval);
      return {
        root,
        quality: qualities[i],
        romanNumeral: romanNumerals[i],
        display: getChordDisplay(root, qualities[i]),
        isBorrowed: true,
        isCommonInCountry: false
      };
    });
  }
}

export function getChordMidiNotes(root: string, quality: ChordQuality): number[] {
  const NOTE_TO_MIDI: Record<string, number> = {
    'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64, 'F': 65,
    'F#': 66, 'G': 67, 'G#': 68, 'A': 69, 'A#': 70, 'B': 71
  };

  const rootMidi = NOTE_TO_MIDI[root];
  if (!rootMidi) return [];

  switch (quality) {
    case 'major':
      return [rootMidi, rootMidi + 4, rootMidi + 7, rootMidi + 12];
    case 'minor':
      return [rootMidi, rootMidi + 3, rootMidi + 7, rootMidi + 12];
    case 'diminished':
      return [rootMidi, rootMidi + 3, rootMidi + 6, rootMidi + 12];
    case 'maj7':
      return [rootMidi, rootMidi + 4, rootMidi + 7, rootMidi + 11];
    case 'min7':
      return [rootMidi, rootMidi + 3, rootMidi + 7, rootMidi + 10];
    case 'dom7':
      return [rootMidi, rootMidi + 4, rootMidi + 7, rootMidi + 10];
    case 'm7b5':
      return [rootMidi, rootMidi + 3, rootMidi + 6, rootMidi + 10];
    case 'dim7':
      return [rootMidi, rootMidi + 3, rootMidi + 6, rootMidi + 9];
    default:
      return [rootMidi, rootMidi + 4, rootMidi + 7, rootMidi + 12];
  }
}
