export type SectionType = 'intro' | 'verse' | 'prechorus' | 'chorus' | 'bridge' | 'solo' | 'outro' | 'buildup' | 'drop' | 'hook';

export interface SongSection {
  id: string;
  type: SectionType;
  number?: number;
  lyrics: string[];
  bars?: number;
}

export interface SongTemplate {
  name: string;
  description: string;
  structure: Omit<SongSection, 'id' | 'lyrics'>[];
}

export interface GenreConfig {
  name: string;
  icon: string;
  color: string;
  templates: Record<string, SongTemplate>;
  standards: {
    hookOptimalMin: number;
    hookOptimalMax: number;
    avgSyllablesMin: number;
    avgSyllablesMax: number;
    verseLines: { min: number; max: number };
    chorusLines: { min: number; max: number };
  };
  tips: string[];
}

export const GENRE_CONFIGS: Record<string, GenreConfig> = {
  rock: {
    name: 'Rock',
    icon: '🎸',
    color: 'from-red-600 to-gray-900',
    templates: {
      classic: {
        name: 'Classic Rock',
        description: 'Traditional rock structure with guitar solo',
        structure: [
          { type: 'intro' },
          { type: 'verse', number: 1 },
          { type: 'chorus' },
          { type: 'verse', number: 2 },
          { type: 'chorus' },
          { type: 'solo' },
          { type: 'bridge' },
          { type: 'chorus' },
        ]
      },
      alt: {
        name: 'Alt Rock',
        description: 'Modern alternative rock structure',
        structure: [
          { type: 'verse', number: 1 },
          { type: 'chorus' },
          { type: 'verse', number: 2 },
          { type: 'chorus' },
          { type: 'bridge' },
          { type: 'chorus' },
          { type: 'outro' },
        ]
      },
      ballad: {
        name: 'Power Ballad',
        description: 'Build from quiet to powerful',
        structure: [
          { type: 'verse', number: 1 },
          { type: 'verse', number: 2 },
          { type: 'chorus' },
          { type: 'verse', number: 3 },
          { type: 'chorus' },
          { type: 'solo' },
          { type: 'bridge' },
          { type: 'chorus' },
          { type: 'chorus' },
        ]
      },
      punk: {
        name: 'Punk/Hard Rock',
        description: 'Fast-paced energetic structure',
        structure: [
          { type: 'intro' },
          { type: 'verse', number: 1 },
          { type: 'chorus' },
          { type: 'verse', number: 2 },
          { type: 'chorus' },
          { type: 'bridge' },
          { type: 'chorus' },
          { type: 'chorus' },
        ]
      }
    },
    standards: {
      hookOptimalMin: 3,
      hookOptimalMax: 5,
      avgSyllablesMin: 8,
      avgSyllablesMax: 12,
      verseLines: { min: 6, max: 10 },
      chorusLines: { min: 4, max: 8 }
    },
    tips: [
      'Rock choruses are typically high-energy and memorable',
      'Solos usually replace a verse or bridge section',
      'Power in repetition - repeat that chorus!',
      'Build energy from verse to chorus'
    ]
  },
  pop: {
    name: 'Pop',
    icon: '🎤',
    color: 'from-pink-500 to-purple-600',
    templates: {
      modern: {
        name: 'Modern Pop',
        description: 'Hook-driven with pre-chorus build',
        structure: [
          { type: 'intro' },
          { type: 'verse', number: 1 },
          { type: 'prechorus' },
          { type: 'chorus' },
          { type: 'verse', number: 2 },
          { type: 'prechorus' },
          { type: 'chorus' },
          { type: 'bridge' },
          { type: 'chorus' },
        ]
      },
      hookfirst: {
        name: 'Hook-First Pop',
        description: 'Start with the catchiest part',
        structure: [
          { type: 'chorus' },
          { type: 'verse', number: 1 },
          { type: 'prechorus' },
          { type: 'chorus' },
          { type: 'bridge' },
          { type: 'chorus' },
        ]
      },
      dance: {
        name: 'Dance Pop',
        description: 'EDM-influenced with drops',
        structure: [
          { type: 'intro' },
          { type: 'verse', number: 1 },
          { type: 'buildup' },
          { type: 'drop' },
          { type: 'verse', number: 2 },
          { type: 'buildup' },
          { type: 'drop' },
          { type: 'bridge' },
          { type: 'drop' },
        ]
      },
      popballad: {
        name: 'Pop Ballad',
        description: 'Emotional and melodic',
        structure: [
          { type: 'verse', number: 1 },
          { type: 'verse', number: 2 },
          { type: 'chorus' },
          { type: 'verse', number: 3 },
          { type: 'bridge' },
          { type: 'chorus' },
          { type: 'outro' },
        ]
      }
    },
    standards: {
      hookOptimalMin: 6,
      hookOptimalMax: 10,
      avgSyllablesMin: 8,
      avgSyllablesMax: 12,
      verseLines: { min: 4, max: 8 },
      chorusLines: { min: 4, max: 8 }
    },
    tips: [
      'Hook should appear within first 30 seconds',
      'Pre-chorus builds tension before payoff',
      'Keep verses short - 30-45 seconds max',
      'Repeat the hook for memorability'
    ]
  },
  country: {
    name: 'Country',
    icon: '🤠',
    color: 'from-amber-600 to-yellow-700',
    templates: {
      classic: {
        name: 'Classic Country',
        description: 'Traditional storytelling structure',
        structure: [
          { type: 'verse', number: 1 },
          { type: 'chorus' },
          { type: 'verse', number: 2 },
          { type: 'chorus' },
          { type: 'bridge' },
          { type: 'chorus' },
        ]
      },
      modern: {
        name: 'Modern Country',
        description: 'Hook-first contemporary structure',
        structure: [
          { type: 'chorus' },
          { type: 'verse', number: 1 },
          { type: 'chorus' },
          { type: 'verse', number: 2 },
          { type: 'bridge' },
          { type: 'chorus' },
        ]
      },
      story: {
        name: 'Story Song',
        description: 'Narrative-focused with multiple verses',
        structure: [
          { type: 'verse', number: 1 },
          { type: 'verse', number: 2 },
          { type: 'verse', number: 3 },
          { type: 'chorus' },
          { type: 'verse', number: 4 },
          { type: 'chorus' },
        ]
      },
      uptempo: {
        name: 'Up-Tempo',
        description: 'Energetic with instrumental break',
        structure: [
          { type: 'intro' },
          { type: 'verse', number: 1 },
          { type: 'chorus' },
          { type: 'verse', number: 2 },
          { type: 'chorus' },
          { type: 'solo' },
          { type: 'chorus' },
          { type: 'chorus' },
        ]
      }
    },
    standards: {
      hookOptimalMin: 3,
      hookOptimalMax: 7,
      avgSyllablesMin: 7,
      avgSyllablesMax: 11,
      verseLines: { min: 6, max: 10 },
      chorusLines: { min: 4, max: 8 }
    },
    tips: [
      'Country songs tell clear stories with concrete details',
      'Title should appear 3-7 times, usually in chorus',
      'Bridge provides the emotional moment',
      'Use conversational, relatable language'
    ]
  },
  hiphop: {
    name: 'Hip Hop',
    icon: '🎧',
    color: 'from-purple-600 to-indigo-900',
    templates: {
      standard: {
        name: 'Standard Rap',
        description: 'Classic 16-bar verse structure',
        structure: [
          { type: 'intro', bars: 4 },
          { type: 'verse', number: 1, bars: 16 },
          { type: 'hook', bars: 8 },
          { type: 'verse', number: 2, bars: 16 },
          { type: 'hook', bars: 8 },
          { type: 'verse', number: 3, bars: 16 },
          { type: 'hook', bars: 8 },
          { type: 'outro', bars: 4 },
        ]
      },
      trap: {
        name: 'Modern Trap',
        description: 'Shorter verses, catchy hooks',
        structure: [
          { type: 'intro', bars: 4 },
          { type: 'verse', number: 1, bars: 12 },
          { type: 'hook', bars: 8 },
          { type: 'verse', number: 2, bars: 12 },
          { type: 'hook', bars: 8 },
          { type: 'bridge', bars: 8 },
          { type: 'hook', bars: 8 },
        ]
      },
      storytelling: {
        name: 'Storytelling',
        description: 'Longer verses for narrative',
        structure: [
          { type: 'verse', number: 1, bars: 24 },
          { type: 'hook', bars: 8 },
          { type: 'verse', number: 2, bars: 24 },
          { type: 'hook', bars: 8 },
          { type: 'verse', number: 3, bars: 16 },
          { type: 'hook', bars: 8 },
        ]
      },
      feature: {
        name: 'Two Artist Feature',
        description: 'Multiple artist structure',
        structure: [
          { type: 'verse', number: 1, bars: 16 },
          { type: 'hook', bars: 8 },
          { type: 'verse', number: 2, bars: 16 },
          { type: 'hook', bars: 8 },
          { type: 'verse', number: 3, bars: 16 },
          { type: 'hook', bars: 8 },
        ]
      }
    },
    standards: {
      hookOptimalMin: 4,
      hookOptimalMax: 8,
      avgSyllablesMin: 12,
      avgSyllablesMax: 16,
      verseLines: { min: 12, max: 20 },
      chorusLines: { min: 4, max: 8 }
    },
    tips: [
      'Standard verses are 16 bars (8-12 for modern trap)',
      'Hooks should be 4-8 bars and easily memorable',
      'Internal rhymes add complexity and flow',
      'Track syllable density per bar (10-16 ideal)'
    ]
  }
};

export const SECTION_COLORS: Record<SectionType, string> = {
  verse: 'bg-blue-100 border-blue-400 text-blue-800',
  chorus: 'bg-yellow-100 border-yellow-500 text-yellow-900',
  hook: 'bg-yellow-100 border-yellow-500 text-yellow-900',
  bridge: 'bg-red-100 border-red-400 text-red-800',
  prechorus: 'bg-green-100 border-green-400 text-green-800',
  intro: 'bg-gray-100 border-gray-400 text-gray-800',
  outro: 'bg-gray-100 border-gray-400 text-gray-800',
  solo: 'bg-purple-100 border-purple-400 text-purple-800',
  buildup: 'bg-orange-100 border-orange-400 text-orange-800',
  drop: 'bg-orange-100 border-orange-500 text-orange-900'
};

export const SECTION_LABELS: Record<SectionType, string> = {
  verse: 'Verse',
  chorus: 'Chorus',
  hook: 'Hook',
  bridge: 'Bridge',
  prechorus: 'Pre-Chorus',
  intro: 'Intro',
  outro: 'Outro',
  solo: 'Solo/Instrumental',
  buildup: 'Build-Up',
  drop: 'Drop'
};
