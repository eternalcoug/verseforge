export interface SharedProgression {
  chords: string[];
  key?: string;
  mode?: 'major' | 'minor';
  source: 'chord-finder' | 'chord-reference';
  timestamp: number;
}

export interface ChordNavigationContext {
  chord: string;
  quality?: string;
  key?: string;
  timestamp: number;
}

const PROGRESSION_KEY = 'verseforge_shared_progression';
const CHORD_CONTEXT_KEY = 'verseforge_chord_context';

export const saveProgression = (progression: SharedProgression): void => {
  try {
    localStorage.setItem(PROGRESSION_KEY, JSON.stringify(progression));
  } catch (error) {
    console.error('Failed to save progression:', error);
  }
};

export const loadProgression = (): SharedProgression | null => {
  try {
    const saved = localStorage.getItem(PROGRESSION_KEY);
    if (!saved) return null;

    const progression = JSON.parse(saved) as SharedProgression;

    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    if (progression.timestamp < oneHourAgo) {
      clearProgression();
      return null;
    }

    return progression;
  } catch (error) {
    console.error('Failed to load progression:', error);
    return null;
  }
};

export const clearProgression = (): void => {
  try {
    localStorage.removeItem(PROGRESSION_KEY);
  } catch (error) {
    console.error('Failed to clear progression:', error);
  }
};

export const saveChordContext = (chord: string, quality?: string, key?: string): void => {
  try {
    const context: ChordNavigationContext = {
      chord,
      quality,
      key,
      timestamp: Date.now()
    };
    localStorage.setItem(CHORD_CONTEXT_KEY, JSON.stringify(context));
  } catch (error) {
    console.error('Failed to save chord context:', error);
  }
};

export const loadChordContext = (): ChordNavigationContext | null => {
  try {
    const saved = localStorage.getItem(CHORD_CONTEXT_KEY);
    if (!saved) return null;

    const context = JSON.parse(saved) as ChordNavigationContext;

    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    if (context.timestamp < fiveMinutesAgo) {
      clearChordContext();
      return null;
    }

    return context;
  } catch (error) {
    console.error('Failed to load chord context:', error);
    return null;
  }
};

export const clearChordContext = (): void => {
  try {
    localStorage.removeItem(CHORD_CONTEXT_KEY);
  } catch (error) {
    console.error('Failed to clear chord context:', error);
  }
};
