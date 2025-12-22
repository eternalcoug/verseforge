export interface StringTuning {
  stringNumber: number;
  note: string;
  octave: number;
  fullNote: string;
  label: string;
}

export interface TuningConfig {
  name: string;
  strings: StringTuning[];
  description?: string;
}

export const GUITAR_6_TUNINGS: Record<string, TuningConfig> = {
  standard: {
    name: "Standard (E-A-D-G-B-E)",
    strings: [
      { stringNumber: 1, note: 'E', octave: 4, fullNote: 'E4', label: '1st (High E)' },
      { stringNumber: 2, note: 'B', octave: 3, fullNote: 'B3', label: '2nd (B)' },
      { stringNumber: 3, note: 'G', octave: 3, fullNote: 'G3', label: '3rd (G)' },
      { stringNumber: 4, note: 'D', octave: 3, fullNote: 'D3', label: '4th (D)' },
      { stringNumber: 5, note: 'A', octave: 2, fullNote: 'A2', label: '5th (A)' },
      { stringNumber: 6, note: 'E', octave: 2, fullNote: 'E2', label: '6th (Low E)' }
    ],
    description: "Most common guitar tuning"
  },
  dropD: {
    name: "Drop D (D-A-D-G-B-E)",
    strings: [
      { stringNumber: 1, note: 'E', octave: 4, fullNote: 'E4', label: '1st (High E)' },
      { stringNumber: 2, note: 'B', octave: 3, fullNote: 'B3', label: '2nd (B)' },
      { stringNumber: 3, note: 'G', octave: 3, fullNote: 'G3', label: '3rd (G)' },
      { stringNumber: 4, note: 'D', octave: 3, fullNote: 'D3', label: '4th (D)' },
      { stringNumber: 5, note: 'A', octave: 2, fullNote: 'A2', label: '5th (A)' },
      { stringNumber: 6, note: 'D', octave: 2, fullNote: 'D2', label: '6th (Low D)' }
    ],
    description: "Low E string tuned down to D"
  },
  halfStepDown: {
    name: "Half Step Down (Eb-Ab-Db-Gb-Bb-Eb)",
    strings: [
      { stringNumber: 1, note: 'D#', octave: 4, fullNote: 'D#4', label: '1st (Eb)' },
      { stringNumber: 2, note: 'A#', octave: 3, fullNote: 'A#3', label: '2nd (Bb)' },
      { stringNumber: 3, note: 'F#', octave: 3, fullNote: 'F#3', label: '3rd (Gb)' },
      { stringNumber: 4, note: 'C#', octave: 3, fullNote: 'C#3', label: '4th (Db)' },
      { stringNumber: 5, note: 'G#', octave: 2, fullNote: 'G#2', label: '5th (Ab)' },
      { stringNumber: 6, note: 'D#', octave: 2, fullNote: 'D#2', label: '6th (Eb)' }
    ],
    description: "All strings tuned down one half step"
  },
  dadgad: {
    name: "DADGAD (D-A-D-G-A-D)",
    strings: [
      { stringNumber: 1, note: 'D', octave: 4, fullNote: 'D4', label: '1st (D)' },
      { stringNumber: 2, note: 'A', octave: 3, fullNote: 'A3', label: '2nd (A)' },
      { stringNumber: 3, note: 'G', octave: 3, fullNote: 'G3', label: '3rd (G)' },
      { stringNumber: 4, note: 'D', octave: 3, fullNote: 'D3', label: '4th (D)' },
      { stringNumber: 5, note: 'A', octave: 2, fullNote: 'A2', label: '5th (A)' },
      { stringNumber: 6, note: 'D', octave: 2, fullNote: 'D2', label: '6th (Low D)' }
    ],
    description: "Popular for Celtic and folk music"
  },
  openG: {
    name: "Open G (D-G-D-G-B-D)",
    strings: [
      { stringNumber: 1, note: 'D', octave: 4, fullNote: 'D4', label: '1st (D)' },
      { stringNumber: 2, note: 'B', octave: 3, fullNote: 'B3', label: '2nd (B)' },
      { stringNumber: 3, note: 'G', octave: 3, fullNote: 'G3', label: '3rd (G)' },
      { stringNumber: 4, note: 'D', octave: 3, fullNote: 'D3', label: '4th (D)' },
      { stringNumber: 5, note: 'G', octave: 2, fullNote: 'G2', label: '5th (G)' },
      { stringNumber: 6, note: 'D', octave: 2, fullNote: 'D2', label: '6th (Low D)' }
    ],
    description: "Forms a G major chord when strummed open"
  },
  openD: {
    name: "Open D (D-A-D-F#-A-D)",
    strings: [
      { stringNumber: 1, note: 'D', octave: 4, fullNote: 'D4', label: '1st (D)' },
      { stringNumber: 2, note: 'A', octave: 3, fullNote: 'A3', label: '2nd (A)' },
      { stringNumber: 3, note: 'F#', octave: 3, fullNote: 'F#3', label: '3rd (F#)' },
      { stringNumber: 4, note: 'D', octave: 3, fullNote: 'D3', label: '4th (D)' },
      { stringNumber: 5, note: 'A', octave: 2, fullNote: 'A2', label: '5th (A)' },
      { stringNumber: 6, note: 'D', octave: 2, fullNote: 'D2', label: '6th (Low D)' }
    ],
    description: "Forms a D major chord when strummed open"
  },
  dropC: {
    name: "Drop C (C-G-C-F-A-D)",
    strings: [
      { stringNumber: 1, note: 'D', octave: 4, fullNote: 'D4', label: '1st (D)' },
      { stringNumber: 2, note: 'A', octave: 3, fullNote: 'A3', label: '2nd (A)' },
      { stringNumber: 3, note: 'F', octave: 3, fullNote: 'F3', label: '3rd (F)' },
      { stringNumber: 4, note: 'C', octave: 3, fullNote: 'C3', label: '4th (C)' },
      { stringNumber: 5, note: 'G', octave: 2, fullNote: 'G2', label: '5th (G)' },
      { stringNumber: 6, note: 'C', octave: 2, fullNote: 'C2', label: '6th (Low C)' }
    ],
    description: "Heavy rock and metal tuning"
  }
};

export const UKULELE_TUNINGS: Record<string, TuningConfig> = {
  standardC: {
    name: "Standard C (G-C-E-A)",
    strings: [
      { stringNumber: 1, note: 'A', octave: 4, fullNote: 'A4', label: '1st (A)' },
      { stringNumber: 2, note: 'E', octave: 4, fullNote: 'E4', label: '2nd (E)' },
      { stringNumber: 3, note: 'C', octave: 4, fullNote: 'C4', label: '3rd (C)' },
      { stringNumber: 4, note: 'G', octave: 4, fullNote: 'G4', label: '4th (G)' }
    ],
    description: "Standard soprano/concert/tenor ukulele tuning"
  },
  baritone: {
    name: "Baritone (D-G-B-E)",
    strings: [
      { stringNumber: 1, note: 'E', octave: 4, fullNote: 'E4', label: '1st (E)' },
      { stringNumber: 2, note: 'B', octave: 3, fullNote: 'B3', label: '2nd (B)' },
      { stringNumber: 3, note: 'G', octave: 3, fullNote: 'G3', label: '3rd (G)' },
      { stringNumber: 4, note: 'D', octave: 3, fullNote: 'D3', label: '4th (D)' }
    ],
    description: "Baritone ukulele tuning (like top 4 guitar strings)"
  },
  lowG: {
    name: "Low G (G-C-E-A)",
    strings: [
      { stringNumber: 1, note: 'A', octave: 4, fullNote: 'A4', label: '1st (A)' },
      { stringNumber: 2, note: 'E', octave: 4, fullNote: 'E4', label: '2nd (E)' },
      { stringNumber: 3, note: 'C', octave: 4, fullNote: 'C4', label: '3rd (C)' },
      { stringNumber: 4, note: 'G', octave: 3, fullNote: 'G3', label: '4th (Low G)' }
    ],
    description: "Standard tuning with low G string"
  },
  canadian: {
    name: "Canadian (A-D-F#-B)",
    strings: [
      { stringNumber: 1, note: 'B', octave: 4, fullNote: 'B4', label: '1st (B)' },
      { stringNumber: 2, note: 'F#', octave: 4, fullNote: 'F#4', label: '2nd (F#)' },
      { stringNumber: 3, note: 'D', octave: 4, fullNote: 'D4', label: '3rd (D)' },
      { stringNumber: 4, note: 'A', octave: 4, fullNote: 'A4', label: '4th (A)' }
    ],
    description: "Alternative tuning for ukulele"
  }
};

export const GUITAR_12_TUNINGS: Record<string, TuningConfig> = {
  standard: {
    name: "Standard 12-String",
    strings: [
      { stringNumber: 1, note: 'E', octave: 4, fullNote: 'E4', label: '1st pair (E+E unison)' },
      { stringNumber: 2, note: 'B', octave: 3, fullNote: 'B3', label: '2nd pair (B+B octave)' },
      { stringNumber: 3, note: 'G', octave: 3, fullNote: 'G3', label: '3rd pair (G+G octave)' },
      { stringNumber: 4, note: 'D', octave: 3, fullNote: 'D3', label: '4th pair (D+D octave)' },
      { stringNumber: 5, note: 'A', octave: 2, fullNote: 'A2', label: '5th pair (A+A octave)' },
      { stringNumber: 6, note: 'E', octave: 2, fullNote: 'E2', label: '6th pair (E+E octave)' }
    ],
    description: "Standard 12-string: pairs tuned in octaves (except high strings in unison)"
  },
  dropD: {
    name: "Drop D 12-String",
    strings: [
      { stringNumber: 1, note: 'E', octave: 4, fullNote: 'E4', label: '1st pair (E+E unison)' },
      { stringNumber: 2, note: 'B', octave: 3, fullNote: 'B3', label: '2nd pair (B+B octave)' },
      { stringNumber: 3, note: 'G', octave: 3, fullNote: 'G3', label: '3rd pair (G+G octave)' },
      { stringNumber: 4, note: 'D', octave: 3, fullNote: 'D3', label: '4th pair (D+D octave)' },
      { stringNumber: 5, note: 'A', octave: 2, fullNote: 'A2', label: '5th pair (A+A octave)' },
      { stringNumber: 6, note: 'D', octave: 2, fullNote: 'D2', label: '6th pair (D+D octave)' }
    ],
    description: "Drop D tuning with octave pairs"
  },
  openG: {
    name: "Open G 12-String",
    strings: [
      { stringNumber: 1, note: 'D', octave: 4, fullNote: 'D4', label: '1st pair (D+D unison)' },
      { stringNumber: 2, note: 'B', octave: 3, fullNote: 'B3', label: '2nd pair (B+B octave)' },
      { stringNumber: 3, note: 'G', octave: 3, fullNote: 'G3', label: '3rd pair (G+G octave)' },
      { stringNumber: 4, note: 'D', octave: 3, fullNote: 'D3', label: '4th pair (D+D octave)' },
      { stringNumber: 5, note: 'G', octave: 2, fullNote: 'G2', label: '5th pair (G+G octave)' },
      { stringNumber: 6, note: 'D', octave: 2, fullNote: 'D2', label: '6th pair (D+D octave)' }
    ],
    description: "Open G tuning with octave pairs - forms G major chord"
  }
};

export interface ScaleInfo {
  root: string;
  chords: Array<{
    root: string;
    quality: string;
    degree: string;
    function: string;
  }>;
}

export const MAJOR_SCALE_CHORDS: Record<string, ScaleInfo> = {
  'D': {
    root: 'D',
    chords: [
      { root: 'D', quality: 'major', degree: 'I', function: 'Tonic' },
      { root: 'E', quality: 'minor', degree: 'ii', function: 'Supertonic' },
      { root: 'F#', quality: 'minor', degree: 'iii', function: 'Mediant' },
      { root: 'G', quality: 'major', degree: 'IV', function: 'Subdominant' },
      { root: 'A', quality: 'major', degree: 'V', function: 'Dominant' },
      { root: 'B', quality: 'minor', degree: 'vi', function: 'Submediant' },
      { root: 'C#', quality: 'diminished', degree: 'vii°', function: 'Leading Tone' }
    ]
  }
};

export function getTuningInfo(tuningKey: string): TuningConfig | null {
  return GUITAR_6_TUNINGS[tuningKey] || null;
}

export function getRecommendedChordsForTuning(tuningKey: string): ScaleInfo | null {
  if (tuningKey === 'dadgad') {
    return MAJOR_SCALE_CHORDS['D'];
  }
  return null;
}
