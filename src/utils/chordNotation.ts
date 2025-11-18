/**
 * Chord Notation Parser
 * Handles [chord] notation in lyrics, extracting chords for display
 * while preserving pure lyrics for analysis.
 */

export interface ChordPosition {
  chord: string;
  position: number;
  charIndex: number;
}

export interface ParsedLine {
  rawLine: string;
  lyrics: string;
  chords: ChordPosition[];
  hasChords: boolean;
}

/**
 * Checks if a line contains chord notation
 */
export function hasChords(line: string): boolean {
  return /\[([^\]]+)\]/g.test(line);
}

/**
 * Strips all chord notation from a line, returning pure lyrics
 * This is what should be used for ALL analysis (syllables, rhymes, etc.)
 */
export function stripChords(line: string): string {
  return line.replace(/\[([^\]]+)\]/g, '').trim();
}

/**
 * Parses a line to extract both chords and lyrics
 */
export function parseLineWithChords(line: string): ParsedLine {
  const chordRegex = /\[([^\]]+)\]/g;
  const chords: ChordPosition[] = [];
  let match;

  // Extract all chords with their positions in the original string
  while ((match = chordRegex.exec(line)) !== null) {
    chords.push({
      chord: match[1],
      position: match.index,
      charIndex: match.index
    });
  }

  // Get pure lyrics (remove all chord notation)
  const lyrics = stripChords(line);

  // Adjust chord positions to align with lyrics after bracket removal
  const adjustedChords = chords.map((chord, index) => {
    // Calculate how many brackets appeared before this chord
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += chords[i].chord.length + 2; // +2 for the brackets
    }

    return {
      ...chord,
      position: Math.max(0, chord.position - offset)
    };
  });

  return {
    rawLine: line,
    lyrics,
    chords: adjustedChords,
    hasChords: chords.length > 0
  };
}

/**
 * Validates if a chord name looks valid
 * (permissive - allows most formats)
 */
export function isValidChord(chord: string): boolean {
  // Match common chord patterns: C, C#, Cm, Cmaj7, Csus4, etc.
  const chordPattern = /^[A-G][#b]?(m|maj|min|sus|aug|dim|add)?[0-9]*(\/[A-G][#b]?)?$/;
  return chordPattern.test(chord.trim());
}

/**
 * Extract unique chords from multiple lines
 */
export function extractAllChords(lines: string[]): string[] {
  const allChords = new Set<string>();

  lines.forEach(line => {
    const { chords } = parseLineWithChords(line);
    chords.forEach(c => allChords.add(c.chord));
  });

  return Array.from(allChords);
}

/**
 * Format line for display with chord positioning hints
 */
export function formatChordLine(chords: ChordPosition[], lyrics: string): string {
  if (chords.length === 0) return '';

  let chordLine = '';
  let lastPos = 0;

  chords.forEach(chord => {
    // Add spaces to position chord correctly
    const spaces = Math.max(0, chord.position - lastPos);
    chordLine += ' '.repeat(spaces) + chord.chord;
    lastPos = chord.position + chord.chord.length;
  });

  return chordLine;
}

/**
 * Convert lines with chords to plain text (for export)
 */
export function exportWithChords(lines: string[]): string {
  return lines.map(line => {
    const { chords, lyrics } = parseLineWithChords(line);

    if (chords.length === 0) {
      return lyrics;
    }

    // Format with chords on separate line above
    const chordLine = formatChordLine(chords, lyrics);
    return chordLine + '\n' + lyrics;
  }).join('\n');
}

/**
 * Convert lines to plain lyrics only (no chords)
 */
export function exportLyricsOnly(lines: string[]): string {
  return lines.map(stripChords).join('\n');
}
