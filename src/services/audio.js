export class Audio {
    context = null;
    compressor = null;

    constructor() {
        this.initAudio();
        this.initCompressor();
    }

    initAudio() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        var usingWebAudio = true;
        try {
            if (typeof AudioContext !== 'undefined') {
                this.context = new AudioContext();
            } else if (typeof webkitAudioContext !== 'undefined') {
                this.context = new webkitAudioContext();
            } else {
                usingWebAudio = false;
            }
        } catch (e) {
            usingWebAudio = false
        }
        if (usingWebAudio && this.context && this.context.state === 'suspended') {
            var context = this.context;
            var resume = function () {
                context.resume();
                setTimeout(function () {
                    if (context.state === 'running') {
                        document.body.removeEventListener('touchend', resume, false);
                    }
                }, 0);
            };
            document.body.addEventListener('touchend', resume, false);
        }
    }

    initCompressor() {
        this.compressor = this.context.createDynamicsCompressor();
        this.compressor.connect(this.context.destination);

        this.compressor.threshold.value = -80;
        this.compressor.knee.value = 40; // 0-40 where 0=hard knee 40=soft knee
        this.compressor.ratio.value = 12; // 12:1 when input is 12db above threshold, output is 1db above
        this.compressor.attack.value = 0.001;
        this.compressor.release.value = 0.25;
    }
}
