import { Midi } from '@tonejs/midi';
import { Chord } from './musicTheory';
import { MelodyNote, pitchToMidiNumber } from './melodyTypes';
import { SongSection } from './songTemplates';

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

export function exportMelodyToMidi(melody: MelodyNote[], bpm: number): Blob {
  const midi = new Midi();
  const track = midi.addTrack();
  track.name = 'Melody';
  track.instrument.number = 0;

  midi.header.setTempo(bpm);

  const beatDuration = 60 / bpm;

  melody.forEach(note => {
    const midiNumber = pitchToMidiNumber(note.pitch, note.octave);
    const startTime = note.start * beatDuration;
    const duration = note.duration * beatDuration;

    track.addNote({
      midi: midiNumber,
      time: startTime,
      duration: duration,
      velocity: note.velocity
    });
  });

  return new Blob([midi.toArray()], { type: 'audio/midi' });
}

export function exportSongWithMelodyToMidi(sections: SongSection[], bpm: number): Blob {
  const midi = new Midi();

  midi.header.setTempo(bpm);

  const beatDuration = 60 / bpm;
  let currentTime = 0;

  sections.forEach(section => {
    if (section.melody && section.melody.length > 0) {
      const melodyTrack = midi.addTrack();
      melodyTrack.name = `${section.type} Melody`;
      melodyTrack.instrument.number = 0;

      section.melody.forEach(note => {
        const midiNumber = pitchToMidiNumber(note.pitch, note.octave);
        const startTime = currentTime + (note.start * beatDuration);
        const duration = note.duration * beatDuration;

        melodyTrack.addNote({
          midi: midiNumber,
          time: startTime,
          duration: duration,
          velocity: note.velocity
        });
      });

      const sectionDuration = Math.max(
        ...section.melody.map(n => n.start + n.duration)
      ) * beatDuration;
      currentTime += sectionDuration;
    }
  });

  return new Blob([midi.toArray()], { type: 'audio/midi' });
}

export function downloadSongMidi(sections: SongSection[], bpm: number, filename: string = 'song.mid'): void {
  const blob = exportSongWithMelodyToMidi(sections, bpm);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
