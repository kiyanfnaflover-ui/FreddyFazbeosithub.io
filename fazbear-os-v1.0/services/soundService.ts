
// Simple synth for retro UI sounds
const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
let audioCtx: AudioContext | null = null;

const getCtx = () => {
    if (!audioCtx && AudioContextClass) {
        audioCtx = new AudioContextClass();
    }
    return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, delay = 0, vol = 0.1) => {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
};

export const playSound = (type: 'click' | 'open' | 'error' | 'startup' | 'shutdown' | 'maximize' | 'minimize') => {
    switch (type) {
        case 'click':
            playTone(800, 'triangle', 0.05, 0, 0.05); // High crisp click
            break;
        case 'open':
            // "Double click" sound effect
            playTone(600, 'sine', 0.1);
            playTone(800, 'sine', 0.1, 0.08);
            break;
        case 'minimize':
            playTone(400, 'sawtooth', 0.1, 0, 0.05);
            playTone(200, 'sawtooth', 0.1, 0.05, 0.05);
            break;
        case 'maximize':
            playTone(200, 'sawtooth', 0.1, 0, 0.05);
            playTone(400, 'sawtooth', 0.1, 0.05, 0.05);
            break;
        case 'error':
            playTone(150, 'sawtooth', 0.3, 0, 0.2); // Low buzz
            break;
        case 'startup':
            // The Windows 95 chord-ish sound
            const startVol = 0.1;
            playTone(440, 'sine', 2.0, 0, startVol);
            playTone(554, 'sine', 2.0, 0.1, startVol);
            playTone(659, 'sine', 2.0, 0.2, startVol);
            playTone(880, 'sine', 2.5, 0.4, startVol);
            break;
        case 'shutdown':
            playTone(880, 'square', 0.5, 0, 0.05);
            playTone(440, 'square', 0.5, 0.2, 0.05);
            playTone(220, 'square', 0.8, 0.4, 0.05);
            break;
    }
};
