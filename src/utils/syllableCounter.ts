export function countSyllables(word: string): number {
  if (!word || word.length === 0) return 0;

  word = word.toLowerCase().trim();

  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');

  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

export function countLineSyllables(line: string): number {
  if (!line || line.trim().length === 0) return 0;

  // CRITICAL: Strip chord notation before counting syllables
  // Remove all [chord] patterns so they don't affect analysis
  const lyricsOnly = line.replace(/\[([^\]]+)\]/g, '').trim();

  const words = lyricsOnly.split(/\s+/).filter(w => w.length > 0);
  return words.reduce((total, word) => {
    const cleanWord = word.replace(/[^a-zA-Z'-]/g, '');
    return total + countSyllables(cleanWord);
  }, 0);
}

export function analyzeTextSyllables(text: string[]): {
  lines: number[];
  average: number;
  total: number;
} {
  const lines = text.map(line => countLineSyllables(line));
  const total = lines.reduce((sum, count) => sum + count, 0);
  const average = lines.length > 0 ? total / lines.length : 0;

  return {
    lines,
    average: Math.round(average * 10) / 10,
    total
  };
}

export function checkFlowConsistency(syllableCounts: number[]): {
  isConsistent: boolean;
  variance: number;
  warnings: string[];
} {
  if (syllableCounts.length === 0) {
    return { isConsistent: true, variance: 0, warnings: [] };
  }

  const avg = syllableCounts.reduce((a, b) => a + b, 0) / syllableCounts.length;
  const variance = Math.max(...syllableCounts) - Math.min(...syllableCounts);
  const warnings: string[] = [];

  syllableCounts.forEach((count, index) => {
    const diff = Math.abs(count - avg);
    if (diff > 2) {
      warnings.push(`Line ${index + 1} has ${count} syllables (${diff > 0 ? '+' : ''}${Math.round(count - avg)} from average)`);
    }
  });

  return {
    isConsistent: variance <= 2,
    variance,
    warnings
  };
}

interface TempoRange {
  min: number;
  max: number;
  bpm: number;
  desc: string;
}

export function suggestTempo(avgSyllables: number, genre: string): {
  category: string;
  bpm: number;
  description: string;
} {
  const tempos: Record<string, Record<string, TempoRange>> = {
    rock: {
      ballad: { min: 6, max: 8, bpm: 70, desc: 'Power Ballad' },
      mid: { min: 8, max: 10, bpm: 110, desc: 'Mid-tempo Rock' },
      fast: { min: 10, max: 15, bpm: 160, desc: 'Fast Rock' }
    },
    pop: {
      ballad: { min: 6, max: 8, bpm: 70, desc: 'Ballad' },
      mid: { min: 8, max: 10, bpm: 105, desc: 'Mid-tempo Pop' },
      fast: { min: 10, max: 15, bpm: 125, desc: 'Dance/Uptempo' }
    },
    country: {
      ballad: { min: 6, max: 8, bpm: 68, desc: 'Ballad' },
      mid: { min: 8, max: 10, bpm: 95, desc: 'Mid-tempo' },
      fast: { min: 10, max: 15, bpm: 130, desc: 'Up-tempo' }
    },
    hiphop: {
      laid: { min: 10, max: 12, bpm: 80, desc: 'Laid Back' },
      standard: { min: 12, max: 16, bpm: 100, desc: 'Standard' },
      double: { min: 16, max: 25, bpm: 150, desc: 'Double Time' }
    }
  };

  const genreTempos = tempos[genre] || tempos.pop;

  for (const tempo of Object.values(genreTempos)) {
    if (avgSyllables >= tempo.min && avgSyllables <= tempo.max) {
      return {
        category: tempo.desc,
        bpm: tempo.bpm,
        description: `This song flows best as a ${tempo.desc} at ~${tempo.bpm} BPM`
      };
    }
  }

  return {
    category: genreTempos.mid.desc,
    bpm: genreTempos.mid.bpm,
    description: `This song flows best as a ${genreTempos.mid.desc} at ~${genreTempos.mid.bpm} BPM`
  };
}
