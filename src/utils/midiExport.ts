import { Midi } from '@tonejs/midi';
import { Chord } from './musicTheory';

const NOTE_TO_MIDI: Record<string, number> = {
  'C': 48, 'C#': 49, 'D': 50, 'D#': 51, 'E': 52, 'F': 53,
  'F#': 54, 'G': 55, 'G#': 56, 'A': 57, 'A#': 58, 'B': 59
};

function chordToMidiNotes(chord: Chord): number[] {
  const rootMidi = NOTE_TO_MIDI[chord.root];

  if (chord.quality === 'major') {
    return [rootMidi, rootMidi + 4, rootMidi + 7, rootMidi + 12];
  } else if (chord.quality === 'minor') {
    return [rootMidi, rootMidi + 3, rootMidi + 7, rootMidi + 12];
  } else {
    return [rootMidi, rootMidi + 3, rootMidi + 6, rootMidi + 12];
  }
}

export function exportToMidi(progression: Chord[][], bpm: number): Blob {
  const midi = new Midi();
  const track = midi.addTrack();

  midi.header.setTempo(bpm);

  const beatDuration = 60 / bpm;
  const chordDuration = beatDuration * 2;

  let currentTime = 0;

  progression.forEach(line => {
    line.forEach(chord => {
      const midiNotes = chordToMidiNotes(chord);

      midiNotes.forEach(midiNote => {
        track.addNote({
          midi: midiNote,
          time: currentTime,
          duration: chordDuration,
          velocity: 0.8
        });
      });

      currentTime += chordDuration;
    });
  });

  return new Blob([midi.toArray()], { type: 'audio/midi' });
}

export function downloadMidi(progression: Chord[][], bpm: number, filename: string = 'progression.mid'): void {
  const blob = exportToMidi(progression, bpm);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
