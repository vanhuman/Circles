import {CanvasConfig} from '../services/canvas-config.js';
import {Helper} from '../helpers/helper.js';

export class PointAudio {
    osc = {};
    main = {};
    settings = {
        masterGain: 0.05,
        baseFrequency: 0,
        osctype: 'sine',
        attack: 5
    }
    baseFactor = 1.5;
    baseLine = CanvasConfig.height * this.baseFactor;
    collisionStarted = true;
    firstBreathIsPassed = false;

    constructor(point) {
        this.point = point;
        this.audioContext = point.audioContext;
        setTimeout(() => {
            this.firstBreathIsPassed = true;
        }, 100);
    }

    play(fadeTime = 0) {
        this.defineAudioParts();
        this.connectAudioParts();
        this.initCompressor();
        this.mapXtoPanning();
        this.setFreqAndGain(this.getFrequenciesFromRgb(), this.getGainsFromRgb());
        this.startOscillators(fadeTime);
        this.startMasterGainModulation();
        this.scheduleStop(fadeTime);
    }

    updateAudio() {
        const factor = this.baseFactor * ((this.baseLine - this.point.position.y) / this.baseLine);

        this.osc.osc1.frequency.linearRampToValueAtTime(this.osc.osc1base * factor, this.audioContext.currentTime + 0.1);
        this.osc.osc2.frequency.linearRampToValueAtTime(this.osc.osc2base * factor, this.audioContext.currentTime + 0.1);
        this.osc.osc3.frequency.linearRampToValueAtTime(this.osc.osc3base * factor, this.audioContext.currentTime + 0.1);

        this.main.panner.pan.linearRampToValueAtTime(this.point.position.x / (0.5 * CanvasConfig.width) - 1, this.audioContext.currentTime + 0.1);

        if (this.firstBreathIsPassed) {
            if (this.point.collision && !this.collisionStarted) {
                let gain = Math.random() + 0.5;
                this.osc.gainTjing.gain.setValueAtTime(gain, this.audioContext.currentTime);
                this.osc.gainTjing.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
                this.osc.gainTjing.gain.setValueAtTime(0.5 * gain, this.audioContext.currentTime + 0.3);
                this.osc.gainTjing.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
                this.osc.gainTjing.gain.setValueAtTime(0.2 * gain, this.audioContext.currentTime + 0.55);
                this.osc.gainTjing.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.70);
                if (Math.random() < 0.5) {
                    this.osc.gainTjing.gain.setValueAtTime(0.1 * gain, this.audioContext.currentTime + 0.8);
                    this.osc.gainTjing.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.95);
                }
                this.collisionStarted = true;
            }
            if (!this.point.collision && this.collisionStarted) {
                this.collisionStarted = false;
            }
        }
    }

    defineAudioParts() {
        this.main.tremolo = this.audioContext.createGain();
        this.main.master = this.audioContext.createGain();
        this.main.compressor = this.audioContext.createDynamicsCompressor();
        this.main.panner = this.audioContext.createStereoPanner();

        this.osc.osc1 = this.audioContext.createOscillator();
        this.osc.osc2 = this.audioContext.createOscillator();
        this.osc.osc3 = this.audioContext.createOscillator();
        this.osc.gain1 = this.audioContext.createGain();
        this.osc.gain2 = this.audioContext.createGain();
        this.osc.gain3 = this.audioContext.createGain();

        this.osc.gainOsc = this.audioContext.createGain();

        this.osc.tjing = this.audioContext.createOscillator();
        this.osc.gainTjing = this.audioContext.createGain();
    }

    connectAudioParts() {
        this.osc.osc1.connect(this.osc.gain1);
        this.osc.osc2.connect(this.osc.gain2);
        this.osc.osc3.connect(this.osc.gain3);
        this.osc.tjing.connect(this.osc.gainTjing);
        this.osc.gain1.connect(this.osc.gainOsc);
        this.osc.gain2.connect(this.osc.gainOsc);
        this.osc.gain3.connect(this.osc.gainOsc);
        this.osc.gainOsc.connect(this.main.tremolo);
        this.osc.gainTjing.connect(this.main.tremolo);
        this.main.tremolo.connect(this.main.master);
        this.main.master.connect(this.main.panner);
        this.main.panner.connect(this.main.compressor);
        this.main.compressor.connect(this.audioContext.destination);
    }

    initCompressor() {
        this.main.compressor.threshold.value = -12;
        this.main.compressor.knee.value = 40; // 0-40 where 0=hard knee 40=soft knee
        this.main.compressor.ratio.value = 12; // 12:1 when input is 12db above threshold, output is 1db above
        this.main.compressor.attack.value = 0.001;
        this.main.compressor.release.value = 0.25;
    }

    mapXtoPanning() {
        this.main.panner.pan.value = this.point.position.x / CanvasConfig.width;
    }

    setFreqAndGain(freq, gain) {
        this.osc.osc1.type = this.settings.osctype;
        this.osc.osc1.frequency.value = freq[0];
        this.osc.gain1.gain.value = gain[0];
        this.osc.osc2.type = this.settings.osctype;
        this.osc.osc2.frequency.value = freq[1];
        this.osc.gain2.gain.value = gain[1];
        this.osc.osc3.type = this.settings.osctype;
        this.osc.osc3.frequency.value = freq[2];
        this.osc.gain3.gain.value = gain[2];

        this.osc.gainOsc.gain.value = 1;
        this.osc.tjing.frequency.value = freq[0] * 20;
        this.osc.gainTjing.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.osc.gainTjing.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.01);
    }

    startMasterGainModulation() {
        let sign = 1;
        let gain = 1;
        let previousGain;
        let wait = this.settings.attack;
        this.osc.gainOsc.gain.setValueAtTime(gain, this.audioContext.currentTime);
        const masterGainModulation = Helper.taskConstructor(() => {
            wait = Math.max(10, Math.random() * 60);
            sign = sign * -1;
            previousGain = gain;
            gain = sign === -1 ? Math.random() * 0.5 : 1;
            console.log(wait, sign, gain);
            this.osc.gainOsc.gain.setValueAtTime(previousGain, this.audioContext.currentTime);
            this.osc.gainOsc.gain.exponentialRampToValueAtTime(gain, this.audioContext.currentTime + wait);
            return wait * 1000;
        }, wait * 1000);
    }

    startOscillators(fadeTime) {
        this.main.master.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.main.master.gain.linearRampToValueAtTime(this.settings.masterGain, this.audioContext.currentTime + this.settings.attack);

        this.osc.osc1.start(0);
        this.osc.osc2.start(0);
        this.osc.osc3.start(0);

        this.osc.tjing.start();

        if (fadeTime > 0) {
            const release = Math.min(2, 2 * fadeTime); // in seconds
            this.main.tremolo.gain.setValueCurveAtTime(
                Helper.lfoValues(fadeTime + release),
                this.audioContext.currentTime,
                fadeTime + release
            );
        }
    }

    scheduleStop(fadeTime) {
        if (fadeTime > 0) {
            const release = Math.min(2, 2 * fadeTime); // in seconds
            const context = this.audioContext;
            const osc = this.osc;
            const main = this.main;
            const masterGain = this.settings.masterGain;
            setTimeout(function () {
                main.master.gain.setValueAtTime(masterGain, context.currentTime);
                main.master.gain.linearRampToValueAtTime(0, context.currentTime + release);
                osc.osc1.stop(context.currentTime + release);
                osc.osc2.stop(context.currentTime + release);
                osc.osc3.stop(context.currentTime + release);
            }, fadeTime * 1000);
        }
    }

    getFrequenciesFromRgb() {
        let freq = [
            this.settings.baseFrequency + 50 + (this.point.color[0] / 255) * 100,
            this.settings.baseFrequency + 200 + (this.point.color[1] / 255) * 200,
            this.settings.baseFrequency + 400 + (this.point.color[2] / 255) * 400
        ];
        [this.osc.osc1base, this.osc.osc2base, this.osc.osc3base] = freq;

        // change frequency according to initial y position
        const factor = this.baseFactor * ((this.baseLine - this.point.position.y) / this.baseLine);
        freq = freq.map(f => f * factor);
        return freq;
    }

    getGainsFromRgb() {
        let gain = this.point.color.map(c => 1 - (c / 255)).map(Math.sqrt)
        if (gain.every(g => g === 0)) {
            gain = [0.3, 0.3, 0.3];
        }
        return gain;
    }
}
