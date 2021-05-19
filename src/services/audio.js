export class Audio {
    context = null;

    constructor() {
        this.initAudio();
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
}
