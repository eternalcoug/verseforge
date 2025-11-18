// Standard guitar tuning with octaves (low to high pitch)
const STANDARD_TUNING = [
  { string: 1, note: 'E', octave: 4 },  // High E (thinnest)
  { string: 2, note: 'B', octave: 3 },  // B
  { string: 3, note: 'G', octave: 3 },  // G
  { string: 4, note: 'D', octave: 3 },  // D
  { string: 5, note: 'A', octave: 2 },  // A
  { string: 6, note: 'E', octave: 2 }   // Low E (thickest)
];

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Calculate the note name and octave for a specific string and fret
 * @param stringIndex - String index (0-5, where 0 is high E, 5 is low E)
 * @param fret - Fret number (0-24)
 * @returns Object with note name and octave (e.g., { note: 'G', octave: 3 })
 */
export function getFretNoteWithOctave(stringIndex: number, fret: number): { note: string; octave: number; fullNote: string } {
  // Get the open string info
  const openString = STANDARD_TUNING[stringIndex];
  const openNote = openString.note;
  const openOctave = openString.octave;

  // Find the chromatic index of the open note
  const openNoteIndex = CHROMATIC_NOTES.indexOf(openNote);

  // Calculate the new note after adding frets
  const totalSemitones = openNoteIndex + fret;
  const newNoteIndex = totalSemitones % 12;
  const newNote = CHROMATIC_NOTES[newNoteIndex];

  // Calculate octave changes (every 12 frets = 1 octave up)
  const octaveChange = Math.floor(totalSemitones / 12);
  const newOctave = openOctave + octaveChange;

  return {
    note: newNote,
    octave: newOctave,
    fullNote: `${newNote}${newOctave}` // e.g., "G3", "A4", "C5"
  };
}

/**
 * Get string name for display
 */
export function getStringInfo(stringIndex: number): { note: string; octave: number; label: string } {
  const tuning = STANDARD_TUNING[stringIndex];
  const labels = ['e', 'B', 'G', 'D', 'A', 'E'];
  return {
    note: tuning.note,
    octave: tuning.octave,
    label: labels[stringIndex]
  };
}
