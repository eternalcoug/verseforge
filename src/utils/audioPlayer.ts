import * as Tone from 'tone';
import { Chord } from './musicTheory';

function chordToNotes(chord: Chord): string[] {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = notes.indexOf(chord.root);

  let intervals: number[];
  if (chord.quality === 'major') {
    intervals = [0, 4, 7];
  } else if (chord.quality === 'minor') {
    intervals = [0, 3, 7];
  } else {
    intervals = [0, 3, 6];
  }

  const chordNotes: string[] = [];
  intervals.forEach(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    const noteName = notes[noteIndex];
    chordNotes.push(`${noteName}4`);
  });

  return chordNotes;
}

export class ProgressionPlayer {
  private synth: Tone.PolySynth | null = null;
  private isPlaying: boolean = false;
  private stopRequested: boolean = false;

  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.005,
        decay: 0.3,
        sustain: 0.4,
        release: 1
      }
    }).toDestination();

    this.synth.volume.value = -8;
  }

  async ensureInstrument(): Promise<void> {
    await Tone.start();
    console.log('Tone.js audio context started');
  }

  async play(
    progression: Chord[][],
    bpm: number,
    onProgress?: (lineIndex: number, chordIndex: number) => void
  ): Promise<void> {
    if (this.isPlaying) {
      this.stop();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await this.ensureInstrument();

    this.isPlaying = true;
    this.stopRequested = false;

    const beatDuration = 60 / bpm;
    const chordDuration = beatDuration * 2;

    for (let lineIndex = 0; lineIndex < progression.length; lineIndex++) {
      if (this.stopRequested) break;

      const line = progression[lineIndex];

      for (let chordIndex = 0; chordIndex < line.length; chordIndex++) {
        if (this.stopRequested) break;

        const chord = line[chordIndex];
        const notes = chordToNotes(chord);

        if (onProgress) {
          onProgress(lineIndex, chordIndex);
        }

        if (this.synth) {
          console.log(`Playing chord: ${chord.root}${chord.quality}`, notes);
          this.synth.triggerAttackRelease(notes, chordDuration);
        }

        await new Promise(resolve => setTimeout(resolve, chordDuration * 1000));
      }
    }

    this.isPlaying = false;
  }

  async testSound(): Promise<void> {
    await this.ensureInstrument();

    if (this.synth) {
      console.log('Playing test chord: C Major');
      const testNotes = ['C4', 'E4', 'G4'];
      this.synth.triggerAttackRelease(testNotes, '2n');
    }
  }

  stop(): void {
    this.stopRequested = true;
    this.isPlaying = false;
    if (this.synth) {
      this.synth.releaseAll();
    }
  }

  dispose(): void {
    this.stop();
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
