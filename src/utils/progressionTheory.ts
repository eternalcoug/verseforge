import { Chord } from './musicTheory';

export enum ChordFunction {
  TONIC = 'tonic',
  PREDOMINANT = 'predominant',
  DOMINANT = 'dominant'
}

const CHORD_FUNCTIONS: Record<string, ChordFunction> = {
  'I': ChordFunction.TONIC,
  'ii': ChordFunction.PREDOMINANT,
  'iii': ChordFunction.TONIC,
  'IV': ChordFunction.PREDOMINANT,
  'V': ChordFunction.DOMINANT,
  'vi': ChordFunction.TONIC,
  'vii°': ChordFunction.DOMINANT,
  'iv': ChordFunction.PREDOMINANT,
  'bVII': ChordFunction.DOMINANT,
  'bVI': ChordFunction.PREDOMINANT,
  'bIII': ChordFunction.TONIC,
  'i': ChordFunction.TONIC,
  'ii°': ChordFunction.PREDOMINANT,
  'v': ChordFunction.DOMINANT,
  'VI': ChordFunction.TONIC,
  'V': ChordFunction.DOMINANT
};

const PROGRESSION_WEIGHTS: Record<ChordFunction, Record<ChordFunction, number>> = {
  [ChordFunction.TONIC]: {
    [ChordFunction.TONIC]: 2,
    [ChordFunction.PREDOMINANT]: 10,
    [ChordFunction.DOMINANT]: 7
  },
  [ChordFunction.PREDOMINANT]: {
    [ChordFunction.TONIC]: 3,
    [ChordFunction.PREDOMINANT]: 1,
    [ChordFunction.DOMINANT]: 10
  },
  [ChordFunction.DOMINANT]: {
    [ChordFunction.TONIC]: 10,
    [ChordFunction.PREDOMINANT]: 2,
    [ChordFunction.DOMINANT]: 1
  }
};

const CHORD_POPULARITY: Record<string, number> = {
  'I': 10,
  'IV': 9,
  'V': 9,
  'vi': 6,
  'ii': 4,
  'iii': 2,
  'vii°': 1,
  'iv': 5,
  'bVII': 6,
  'bVI': 3,
  'bIII': 2,
  'i': 10,
  'ii°': 2,
  'v': 8,
  'VI': 5
};

export function getChordFunction(romanNumeral: string): ChordFunction {
  return CHORD_FUNCTIONS[romanNumeral] || ChordFunction.TONIC;
}

export function getValidNextChords(
  currentChord: string,
  availableChords: Chord[],
  usedChordsInLine: string[]
): { chord: Chord; weight: number }[] {

  const currentFunction = getChordFunction(currentChord);
  const functionWeights = PROGRESSION_WEIGHTS[currentFunction];

  return availableChords
    .filter(chord => {
      const chordId = `${chord.root}${chord.quality}`;
      return !usedChordsInLine.includes(chordId);
    })
    .map(chord => {
      const nextFunction = getChordFunction(chord.roman);
      const functionWeight = functionWeights[nextFunction] || 1;
      const popularityWeight = CHORD_POPULARITY[chord.roman] || 1;

      const totalWeight = functionWeight * popularityWeight;

      return { chord, weight: totalWeight };
    });
}

function weightedRandom<T>(items: { item: T; weight: number }[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item.item;
    }
  }

  return items[items.length - 1].item;
}

export function generateSmartLine(
  chordsPerLine: number,
  availableChords: Chord[],
  startWithTonic: boolean = true
): Chord[] {

  const line: Chord[] = [];
  const usedChordsInLine: string[] = [];

  if (startWithTonic) {
    const tonicChord = availableChords.find(c => c.roman === 'I' || c.roman === 'i');
    if (tonicChord) {
      line.push(tonicChord);
      usedChordsInLine.push(`${tonicChord.root}${tonicChord.quality}`);
    }
  } else {
    const tonicChords = availableChords.filter(c =>
      getChordFunction(c.roman) === ChordFunction.TONIC
    );
    if (tonicChords.length > 0) {
      const startChord = tonicChords[Math.floor(Math.random() * tonicChords.length)];
      line.push(startChord);
      usedChordsInLine.push(`${startChord.root}${startChord.quality}`);
    }
  }

  while (line.length < chordsPerLine) {
    const lastChord = line[line.length - 1];
    const lastRomanNumeral = lastChord.roman;

    const isLastChord = line.length === chordsPerLine - 1;

    let validNextChords = getValidNextChords(
      lastRomanNumeral,
      availableChords,
      usedChordsInLine
    );

    if (isLastChord) {
      const resolutionChords = validNextChords.filter(({ chord }) => {
        const func = getChordFunction(chord.roman);
        return func === ChordFunction.TONIC || func === ChordFunction.DOMINANT;
      });

      if (resolutionChords.length > 0) {
        validNextChords = resolutionChords.map(item => ({
          ...item,
          weight: item.weight * 2
        }));
      }
    }

    if (validNextChords.length === 0) {
      validNextChords = availableChords
        .filter(chord => {
          const chordId = `${chord.root}${chord.quality}`;
          return !usedChordsInLine.includes(chordId);
        })
        .map(chord => ({ chord, weight: 1 }));
    }

    if (validNextChords.length === 0) {
      validNextChords = availableChords.map(chord => ({ chord, weight: 1 }));
    }

    const weightedItems = validNextChords.map(({ chord, weight }) => ({
      item: chord,
      weight
    }));

    const nextChord = weightedRandom(weightedItems);
    line.push(nextChord);
    usedChordsInLine.push(`${nextChord.root}${nextChord.quality}`);
  }

  return line;
}

export function generateSmartProgression(
  lines: number,
  chordsPerLine: number,
  availableChords: Chord[],
  includeBorrowedChords: boolean = false
): Chord[][] {

  let chordPool = availableChords;
  if (!includeBorrowedChords) {
    chordPool = availableChords.filter(chord => !chord.isBorrowed);
  }

  const progression: Chord[][] = [];

  for (let i = 0; i < lines; i++) {
    const startWithTonic = i === 0;
    const line = generateSmartLine(chordsPerLine, chordPool, startWithTonic);
    progression.push(line);
  }

  return progression;
}
