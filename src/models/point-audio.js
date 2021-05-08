import {CanvasConfig} from './canvas-config.js';

export class PointAudio {
    point = null;
    audioContext = null;
    canvasConfig = null;
    osc = {};
    masterGain = 0.1;
    panner = null;

    constructor(point) {
        this.point = point;
        this.audioContext = point.audioContext;
        this.canvasConfig = point.canvasConfig;
    }

    play(fadeTime = 200) {
        let color = this.point.color;
        let freq = [80, 200, 400], baseFreq = 0.0, gain = [0, 0, 0];
        let attack = 0.1, release = Math.min(2, 2 * fadeTime); // in seconds
        let osctype = 'sine';
        this.osc.osc1 = this.audioContext.createOscillator();
        this.osc.osc2 = this.audioContext.createOscillator();
        this.osc.osc3 = this.audioContext.createOscillator();
        let osc1gain = this.audioContext.createGain(),
            osc2gain = this.audioContext.createGain(),
            osc3gain = this.audioContext.createGain();
        let tremolo = this.audioContext.createGain(),
            master = this.audioContext.createGain();
        let compressor = this.audioContext.createDynamicsCompressor();
        let tremInterval; // tremolo setInterval
        this.panner = this.audioContext.createStereoPanner();

        // map rgb values to frequencies
        freq = [50 + (color[0] / 255) * 100, 200 + (color[1] / 255) * 200, 400 + (color[2] / 255) * 400];
        // octave depending on y
        // for (let i = 0; i < freq.length; i++) {
        //     freq[i] = freq[i] * (Point.nbrY - y);
        // }
        // round to integers and add baseFreq
        freq = [
            baseFreq + Number(freq[0].toFixed()),
            baseFreq + Number(freq[1].toFixed()),
            baseFreq + Number(freq[2].toFixed())
        ];
        this.osc.osc1base = freq[0];
        this.osc.osc2base = freq[1];
        this.osc.osc3base = freq[2];

        const baseLine = CanvasConfig.height * 1.5;
        const factor = 1.5 * ((baseLine - this.point.position.y) / baseLine);
        freq[0] = freq[0] * factor;
        freq[1] = freq[1] * factor;
        freq[2] = freq[2] * factor;

        // map rgb values to gains
        gain = [1 - color[0] / 255, 1 - color[1] / 255, 1 - color[2] / 255].map(Math.sqrt);
        if (gain[0] === 0 && gain[1] === 0 && gain[2] === 0) {
            gain = [0.3, 0.3, 0.3];
        }
        // console.log("Freqs: "+freq+" Gain: "+gain);
        this.osc.osc1.type = osctype;
        this.osc.osc1.frequency.value = freq[0];
        osc1gain.gain.value = gain[0];
        this.osc.osc2.type = osctype;
        this.osc.osc2.frequency.value = freq[1];
        osc2gain.gain.value = gain[1];
        this.osc.osc3.type = osctype;
        this.osc.osc3.frequency.value = freq[2];
        osc3gain.gain.value = gain[2];

        compressor.threshold.value = -12;
        compressor.knee.value = 40; // 0-40 where 0=hard knee 40=soft knee
        compressor.ratio.value = 12; // 12:1 when input is 12db above threshold, output is 1db above
        compressor.attack.value = 0.001;
        compressor.release.value = 0.25;

        this.osc.osc1.connect(osc1gain);
        this.osc.osc2.connect(osc2gain);
        this.osc.osc3.connect(osc3gain);
        osc1gain.connect(tremolo);
        osc2gain.connect(tremolo);
        osc3gain.connect(tremolo);
        tremolo.connect(master);

        // map x to panning
        this.panner.pan.value = this.point.position.x / CanvasConfig.width;
        master.connect(this.panner);
        this.panner.connect(compressor);

        compressor.connect(this.audioContext.destination);

        // attack
        master.gain.setValueAtTime(0, this.audioContext.currentTime);
        master.gain.linearRampToValueAtTime(this.masterGain, this.audioContext.currentTime + attack);
        // start osc's
        this.osc.osc1.start(0);
        this.osc.osc2.start(0);
        this.osc.osc3.start(0);
        // start LFO
        // tremolo.gain.setValueCurveAtTime(
        //     Point.lfoValues(fadeTime + release),
        //     this.audioContext.currentTime,
        //     fadeTime + release
        // );

        // schedule fade out and stop
        const context = this.audioContext;
        const osc = this.osc;
        const masterGain = this.masterGain;
        setTimeout(function () {
            master.gain.setValueAtTime(masterGain, context.currentTime);
            master.gain.linearRampToValueAtTime(0, context.currentTime + release);
            osc.osc1.stop(context.currentTime + release);
            osc.osc2.stop(context.currentTime + release);
            osc.osc3.stop(context.currentTime + release);
            // setTimeout(function () {
            //     clearInterval(tremInterval)
            // }, release * 1000);
        }, fadeTime * 1000);
    }

    updateAudio() {
        const baseLine = CanvasConfig.height * 1.5;
        const factor = 1.5 * ((baseLine - this.point.position.y) / baseLine);

        this.osc.osc1.frequency.linearRampToValueAtTime(this.osc.osc1base * factor, this.audioContext.currentTime + 0.1);
        this.osc.osc2.frequency.linearRampToValueAtTime(this.osc.osc2base * factor, this.audioContext.currentTime + 0.1);
        this.osc.osc3.frequency.linearRampToValueAtTime(this.osc.osc3base * factor, this.audioContext.currentTime + 0.1);

        this.panner.pan.linearRampToValueAtTime(this.point.position.x / (0.5 * CanvasConfig.width) - 1, this.audioContext.currentTime + 0.1);
    }
}
