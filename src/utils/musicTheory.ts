export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTE_DISPLAY = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

export type ChordQuality = 'major' | 'minor' | 'diminished';
export type LineType = 'major-only' | 'minor-only' | 'major-borrowed' | 'all' | 'country-standard';

export interface Chord {
  root: string;
  quality: ChordQuality;
  roman: string;
  isBorrowed: boolean;
  borrowedFrom?: string;
}

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

function getScaleNotes(rootNote: string, intervals: number[]): string[] {
  const rootIndex = NOTES.indexOf(rootNote);
  return intervals.map(interval => NOTES[(rootIndex + interval) % 12]);
}

export function generateChordPool(rootNote: string, mode: 'major' | 'minor', includeBorrowed: boolean): Chord[] {
  const pool: Chord[] = [];

  if (mode === 'major') {
    const scaleNotes = getScaleNotes(rootNote, MAJOR_SCALE_INTERVALS);
    const romanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
    const qualities: ChordQuality[] = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'];

    scaleNotes.forEach((note, i) => {
      pool.push({
        root: note,
        quality: qualities[i],
        roman: romanNumerals[i],
        isBorrowed: false
      });
    });

    if (includeBorrowed) {
      const minorScaleNotes = getScaleNotes(rootNote, MINOR_SCALE_INTERVALS);
      pool.push({
        root: minorScaleNotes[3],
        quality: 'minor',
        roman: 'iv',
        isBorrowed: true,
        borrowedFrom: 'parallel minor'
      });
      pool.push({
        root: minorScaleNotes[6],
        quality: 'major',
        roman: 'bVII',
        isBorrowed: true,
        borrowedFrom: 'parallel minor'
      });
      pool.push({
        root: minorScaleNotes[5],
        quality: 'major',
        roman: 'bVI',
        isBorrowed: true,
        borrowedFrom: 'parallel minor'
      });
      pool.push({
        root: minorScaleNotes[2],
        quality: 'major',
        roman: 'bIII',
        isBorrowed: true,
        borrowedFrom: 'parallel minor'
      });
      pool.push({
        root: rootNote,
        quality: 'minor',
        roman: 'i',
        isBorrowed: true,
        borrowedFrom: 'parallel minor'
      });
    }
  } else {
    const scaleNotes = getScaleNotes(rootNote, MINOR_SCALE_INTERVALS);
    const romanNumerals = ['i', 'ii°', 'bIII', 'iv', 'v', 'bVI', 'bVII'];
    const qualities: ChordQuality[] = ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'];

    scaleNotes.forEach((note, i) => {
      pool.push({
        root: note,
        quality: qualities[i],
        roman: romanNumerals[i],
        isBorrowed: false
      });
    });

    if (includeBorrowed) {
      const majorScaleNotes = getScaleNotes(rootNote, MAJOR_SCALE_INTERVALS);
      pool.push({
        root: majorScaleNotes[3],
        quality: 'major',
        roman: 'IV',
        isBorrowed: true,
        borrowedFrom: 'parallel major'
      });
      pool.push({
        root: majorScaleNotes[4],
        quality: 'major',
        roman: 'V',
        isBorrowed: true,
        borrowedFrom: 'parallel major'
      });
      pool.push({
        root: majorScaleNotes[5],
        quality: 'minor',
        roman: 'VI',
        isBorrowed: true,
        borrowedFrom: 'parallel major'
      });
      pool.push({
        root: rootNote,
        quality: 'major',
        roman: 'I',
        isBorrowed: true,
        borrowedFrom: 'parallel major'
      });
    }
  }

  return pool;
}

export function generateProgression(
  chordPool: Chord[],
  numLines: number,
  chordsPerLine: number,
  lineTypes: LineType[],
  mode: 'major' | 'minor'
): Chord[][] {
  const progression: Chord[][] = [];

  for (let line = 0; line < numLines; line++) {
    const lineType = lineTypes[line] || 'all';
    const availableChords = filterChordsByLineType(chordPool, lineType, mode);
    const lineChords = generateSmartLineWithTheory(chordsPerLine, availableChords, line === 0);
    progression.push(lineChords);
  }

  return progression;
}

function generateSmartLineWithTheory(
  chordsPerLine: number,
  availableChords: Chord[],
  startWithTonic: boolean
): Chord[] {
  const line: Chord[] = [];
  const usedChordsInLine: string[] = [];

  if (startWithTonic && availableChords.length > 0) {
    const tonicChord = availableChords.find(c =>
      c.roman === 'I' || c.roman === 'i'
    ) || availableChords[0];
    line.push(tonicChord);
    usedChordsInLine.push(`${tonicChord.root}${tonicChord.quality}`);
  } else if (availableChords.length > 0) {
    const tonicFunctionChords = availableChords.filter(c =>
      ['I', 'i', 'vi', 'VI', 'iii', 'bIII'].includes(c.roman)
    );
    const startChords = tonicFunctionChords.length > 0 ? tonicFunctionChords : availableChords;
    const startChord = startChords[Math.floor(Math.random() * startChords.length)];
    line.push(startChord);
    usedChordsInLine.push(`${startChord.root}${startChord.quality}`);
  }

  while (line.length < chordsPerLine && availableChords.length > 0) {
    const lastChord = line[line.length - 1];
    const isLastChord = line.length === chordsPerLine - 1;

    let candidates = availableChords.filter(chord => {
      const chordId = `${chord.root}${chord.quality}`;
      return !usedChordsInLine.includes(chordId);
    });

    if (candidates.length === 0) {
      candidates = availableChords;
    }

    const weights = candidates.map(chord =>
      calculateChordWeight(lastChord.roman, chord.roman, isLastChord)
    );

    const nextChord = weightedRandomSelection(candidates, weights);
    line.push(nextChord);
    usedChordsInLine.push(`${nextChord.root}${nextChord.quality}`);
  }

  return line;
}

function calculateChordWeight(
  currentRoman: string,
  nextRoman: string,
  isLastChord: boolean
): number {
  const functionWeights: Record<string, Record<string, number>> = {
    'I': { 'I': 1, 'ii': 8, 'iii': 3, 'IV': 10, 'V': 9, 'vi': 7, 'vii°': 4, 'iv': 6, 'bVII': 5, 'bVI': 4, 'bIII': 3, 'i': 2, 'ii°': 2, 'v': 3 },
    'ii': { 'I': 4, 'ii': 1, 'iii': 2, 'IV': 5, 'V': 10, 'vi': 3, 'vii°': 6, 'iv': 4, 'bVII': 3, 'bVI': 2, 'bIII': 2, 'i': 3, 'ii°': 2, 'v': 8 },
    'iii': { 'I': 5, 'ii': 4, 'iii': 1, 'IV': 7, 'V': 6, 'vi': 8, 'vii°': 3, 'iv': 5, 'bVII': 4, 'bVI': 6, 'bIII': 4, 'i': 4, 'ii°': 2, 'v': 5 },
    'IV': { 'I': 8, 'ii': 6, 'iii': 3, 'IV': 1, 'V': 10, 'vi': 5, 'vii°': 4, 'iv': 2, 'bVII': 6, 'bVI': 4, 'bIII': 3, 'i': 6, 'ii°': 3, 'v': 9 },
    'V': { 'I': 10, 'ii': 3, 'iii': 2, 'IV': 5, 'V': 1, 'vi': 7, 'vii°': 2, 'iv': 4, 'bVII': 3, 'bVI': 6, 'bIII': 4, 'i': 9, 'ii°': 2, 'v': 2 },
    'vi': { 'I': 6, 'ii': 7, 'iii': 4, 'IV': 9, 'V': 8, 'vi': 1, 'vii°': 3, 'iv': 6, 'bVII': 5, 'bVI': 4, 'bIII': 5, 'i': 5, 'ii°': 3, 'v': 7 },
    'vii°': { 'I': 10, 'ii': 2, 'iii': 3, 'IV': 4, 'V': 2, 'vi': 5, 'vii°': 1, 'iv': 3, 'bVII': 2, 'bVI': 3, 'bIII': 2, 'i': 8, 'ii°': 1, 'v': 2 },
    'iv': { 'I': 8, 'ii': 4, 'iii': 2, 'IV': 5, 'V': 9, 'vi': 4, 'vii°': 2, 'iv': 1, 'bVII': 7, 'bVI': 5, 'bIII': 3, 'i': 7, 'ii°': 3, 'v': 10 },
    'i': { 'I': 3, 'ii': 5, 'iii': 2, 'IV': 7, 'V': 9, 'vi': 4, 'vii°': 2, 'iv': 9, 'bVII': 6, 'bVI': 7, 'bIII': 8, 'i': 1, 'ii°': 6, 'v': 8 },
    'ii°': { 'I': 4, 'ii': 2, 'iii': 2, 'IV': 5, 'V': 8, 'vi': 3, 'vii°': 3, 'iv': 6, 'bVII': 4, 'bVI': 4, 'bIII': 5, 'i': 3, 'ii°': 1, 'v': 9 },
    'v': { 'I': 8, 'ii': 3, 'iii': 2, 'IV': 4, 'V': 2, 'vi': 5, 'vii°': 2, 'iv': 4, 'bVII': 4, 'bVI': 6, 'bIII': 5, 'i': 10, 'ii°': 2, 'v': 1 },
    'bVII': { 'I': 9, 'ii': 3, 'iii': 2, 'IV': 7, 'V': 4, 'vi': 5, 'vii°': 1, 'iv': 6, 'bVII': 1, 'bVI': 5, 'bIII': 6, 'i': 8, 'ii°': 2, 'v': 4 },
    'bVI': { 'I': 7, 'ii': 4, 'iii': 3, 'IV': 6, 'V': 8, 'vi': 4, 'vii°': 2, 'iv': 5, 'bVII': 7, 'bVI': 1, 'bIII': 5, 'i': 6, 'ii°': 3, 'v': 7 },
    'bIII': { 'I': 6, 'ii': 5, 'iii': 3, 'IV': 8, 'V': 6, 'vi': 7, 'vii°': 2, 'iv': 6, 'bVII': 5, 'bVI': 6, 'bIII': 1, 'i': 7, 'ii°': 4, 'v': 5 }
  };

  let weight = functionWeights[currentRoman]?.[nextRoman] || 3;

  if (isLastChord) {
    if (['I', 'i', 'V'].includes(nextRoman)) {
      weight *= 2;
    }
  }

  return weight;
}

function weightedRandomSelection<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

function filterChordsByLineType(pool: Chord[], lineType: LineType, mode: 'major' | 'minor'): Chord[] {
  switch (lineType) {
    case 'major-only':
      return pool.filter(c => c.quality === 'major' && !c.isBorrowed);
    case 'minor-only':
      return pool.filter(c => c.quality === 'minor' && !c.isBorrowed);
    case 'major-borrowed':
      return pool.filter(c => c.quality === 'major' || c.isBorrowed);
    case 'country-standard':
      if (mode === 'major') {
        return pool.filter(c => ['I', 'IV', 'V', 'vi'].includes(c.roman));
      } else {
        return pool.filter(c => ['i', 'iv', 'v', 'bVII', 'IV', 'V'].includes(c.roman));
      }
    case 'all':
    default:
      return pool;
  }
}

export function getChordName(chord: Chord): string {
  const suffixes: Record<ChordQuality, string> = {
    'major': '',
    'minor': 'm',
    'diminished': '°'
  };
  return chord.root + suffixes[chord.quality];
}

export function formatProgressionText(progression: Chord[][], chordsPerLine: number): string {
  let text = '';

  progression.forEach((line, lineIndex) => {
    const chordNames = line.map(c => getChordName(c)).join('  -  ');
    const romanNumerals = line.map(c => c.roman).join('  -  ');

    text += `LINE ${lineIndex + 1}:  ${chordNames}\n`;
    text += `(Roman): ${romanNumerals}\n`;

    const borrowedChords = line.filter(c => c.isBorrowed);
    if (borrowedChords.length > 0) {
      const borrowedNames = borrowedChords.map(c => `${c.roman} (${getChordName(c)})`).join(', ');
      text += `         [Borrowed from ${borrowedChords[0].borrowedFrom}: ${borrowedNames}]\n`;
    }

    text += '\n';
  });

  return text;
}
