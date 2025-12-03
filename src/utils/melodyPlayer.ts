import * as Tone from 'tone';
import { MelodyNote } from './melodyTypes';

export class MelodyPlayer {
  private synth: Tone.Synth | null = null;
  private isPlaying: boolean = false;
  private stopRequested: boolean = false;

  constructor() {
    this.synth = new Tone.Synth({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5
      }
    }).toDestination();

    this.synth.volume.value = -6;
  }

  async ensureInstrument(): Promise<void> {
    await Tone.start();
  }

  async playMelody(
    notes: MelodyNote[],
    bpm: number,
    onProgress?: (noteIndex: number) => void
  ): Promise<void> {
    if (this.isPlaying) {
      this.stop();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await this.ensureInstrument();

    this.isPlaying = true;
    this.stopRequested = false;

    const beatDuration = 60 / bpm;

    for (let i = 0; i < notes.length; i++) {
      if (this.stopRequested) break;

      const note = notes[i];
      const noteName = `${note.pitch}${note.octave}`;
      const duration = note.duration * beatDuration;

      if (onProgress) {
        onProgress(i);
      }

      if (this.synth) {
        this.synth.triggerAttackRelease(noteName, duration, undefined, note.velocity);
      }

      await new Promise(resolve => setTimeout(resolve, duration * 1000));
    }

    this.isPlaying = false;
  }

  async playNote(pitch: string, octave: number, duration: number = 0.5): Promise<void> {
    await this.ensureInstrument();

    if (this.synth) {
      const noteName = `${pitch}${octave}`;
      this.synth.triggerAttackRelease(noteName, duration);
    }
  }

  stop(): void {
    this.stopRequested = true;
    this.isPlaying = false;
    if (this.synth) {
      this.synth.triggerRelease();
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
