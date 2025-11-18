import * as Tone from 'tone';

// Guitar instrument components
let pluckSynth: Tone.PluckSynth | null = null;
let reverbWet: Tone.Reverb | null = null;
let bodyFilter: Tone.Filter | null = null;
let compressionNode: Tone.Compressor | null = null;

/**
 * Initialize the acoustic guitar instrument chain
 * Uses PluckSynth for Karplus-Strong algorithm (physical modeling of plucked strings)
 */
export async function getInstrument(): Promise<Tone.PluckSynth> {
  await Tone.start();

  if (!pluckSynth) {
    // Create reverb for acoustic space (small room/body resonance)
    reverbWet = new Tone.Reverb({
      decay: 1.5,
      preDelay: 0.01,
      wet: 0.25
    });

    // Guitar body resonance filter - emphasizes the "woody" character
    // Peak around 200-400Hz for body resonance
    bodyFilter = new Tone.Filter({
      type: 'bandpass',
      frequency: 300,
      Q: 1.5,
      gain: 3
    });

    // Subtle compression for even dynamics
    compressionNode = new Tone.Compressor({
      threshold: -20,
      ratio: 3,
      attack: 0.003,
      release: 0.1
    });

    // PluckSynth uses Karplus-Strong algorithm - physical model of plucked string
    pluckSynth = new Tone.PluckSynth({
      attackNoise: 1.5,      // Initial pick attack noise (1-20, higher = brighter pick sound)
      dampening: 2500,       // String dampening frequency (lower = longer sustain)
      resonance: 0.92        // String resonance (0-1, higher = longer ring)
    });

    // Signal chain: PluckSynth -> Body Filter -> Reverb -> Compression -> Output
    pluckSynth.chain(bodyFilter, reverbWet, compressionNode, Tone.getDestination());

    console.log('Acoustic guitar instrument initialized (PluckSynth with body resonance)');
  }

  return pluckSynth;
}

/**
 * Play a single note with acoustic guitar tone
 * @param note - Note with octave (e.g., "G3", "E4")
 * @param duration - Duration in Tone.js notation or seconds
 * @param velocity - Pick intensity (0-1, default 0.8)
 */
export async function playNote(note: string, duration: string = '8n', velocity: number = 0.8): Promise<void> {
  const instrument = await getInstrument();
  const now = Tone.now();

  // Velocity affects the attack brightness
  instrument.triggerAttackRelease(note, duration, now, velocity);
}

/**
 * Play a chord with realistic guitar strum
 * @param notes - Array of notes (e.g., ["C3", "E3", "G3"])
 * @param duration - How long the chord rings
 * @param strumSpeed - Time between each string (0.01-0.05 seconds)
 * @param direction - "down" or "up" strum
 */
export async function playChord(
  notes: string[],
  duration: number = 2,
  strumSpeed: number = 0.025,
  direction: 'down' | 'up' = 'down'
): Promise<void> {
  const instrument = await getInstrument();
  const now = Tone.now();

  // Reverse order for upstroke
  const orderedNotes = direction === 'up' ? [...notes].reverse() : notes;

  orderedNotes.forEach((note, index) => {
    // Vary velocity slightly for realism (outer strings slightly louder)
    const velocity = 0.7 + (Math.random() * 0.2);
    const timing = now + (index * strumSpeed);

    instrument.triggerAttackRelease(note, duration, timing, velocity);
  });
}

/**
 * Play an arpeggio (fingerpicking pattern)
 * @param notes - Array of notes to arpeggiate
 * @param pattern - Timing pattern in seconds between notes
 */
export async function playArpeggio(
  notes: string[],
  pattern: number[] = [0, 0.15, 0.3, 0.45]
): Promise<void> {
  const instrument = await getInstrument();
  const now = Tone.now();

  notes.forEach((note, index) => {
    const timing = now + (pattern[index] || index * 0.15);
    const velocity = 0.6 + (Math.random() * 0.3); // Fingerpicking has more dynamic variation

    instrument.triggerAttackRelease(note, '4n', timing, velocity);
  });
}

/**
 * Adjust guitar tone characteristics in real-time
 * @param settings - Object with tone parameters
 */
export function adjustTone(settings: {
  dampening?: number;      // 1000-4000 (lower = longer sustain)
  resonance?: number;      // 0-0.99 (higher = more ring)
  attackNoise?: number;    // 0.5-3 (higher = brighter pick)
  bodyResonance?: number;  // 200-500 Hz (body cavity frequency)
  reverbAmount?: number;   // 0-1 (wet mix)
}): void {
  if (pluckSynth && settings.dampening !== undefined) {
    pluckSynth.dampening = settings.dampening;
  }
  if (pluckSynth && settings.resonance !== undefined) {
    pluckSynth.resonance = settings.resonance;
  }
  if (pluckSynth && settings.attackNoise !== undefined) {
    pluckSynth.attackNoise = settings.attackNoise;
  }
  if (bodyFilter && settings.bodyResonance !== undefined) {
    bodyFilter.frequency.value = settings.bodyResonance;
  }
  if (reverbWet && settings.reverbAmount !== undefined) {
    reverbWet.wet.value = settings.reverbAmount;
  }
}

/**
 * Stop all sounds immediately
 */
export function stopAll(): void {
  if (pluckSynth) {
    pluckSynth.triggerRelease();
  }
}

/**
 * Get current tone settings (for UI controls)
 */
export function getToneSettings() {
  return {
    dampening: pluckSynth?.dampening || 2500,
    resonance: pluckSynth?.resonance || 0.92,
    attackNoise: pluckSynth?.attackNoise || 1.5,
    bodyResonance: bodyFilter?.frequency.value || 300,
    reverbAmount: reverbWet?.wet.value || 0.25
  };
}
