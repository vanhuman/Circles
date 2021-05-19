export class Helper {
    static taskConstructor = (funcArg, waitArg) => {
        var task = {
            wait: waitArg, // wait time every loop
            func: funcArg, // function to execute every loop
            running: true,
            timeout: false, // variable that holds the setTimeout
            start: function () {
                this.running = true;
                return this.loop();
            },
            loop: function () {
                this.timeout = setTimeout(this.runLoop, this.wait);
                return this;
            },
            runLoop: function () {
                var result;
                if (!task.running) return;
                result = task.func.call(task);
                if (typeof result == 'number') {
                    if (result === 0) return;
                    task.wait = result;
                }
                task.loop();
            },
            stop: function () {
                this.running = false;
                clearTimeout(this.timeout);
            }
        };
        return task.start();
    };

    static lfoValues = (lfoDur) => {
        var lfoValueCount = 4096, lfoValues = new Float32Array(lfoValueCount), percent;
        var lfoFreq = 0.5 + Math.random() * 10, lfoDepth = 0.1 + Math.random() * 0.3;
        for (var i = 0; i < lfoValueCount; i++) {
            percent = (i / lfoValueCount) * lfoDur * lfoFreq ;
            lfoValues[i] = (1 - lfoDepth) + (Math.sin(percent * 2 * Math.PI) * lfoDepth );
        }
        return lfoValues;
    };

    static hexToRgb(hexColor) {
        if (hexColor.substring(0, 1) === '#') {
            hexColor = hexColor.substring(1);
        }
        if (hexColor.length === 3) {
            hexColor = hexColor + hexColor;
        }
        const hexArray = hexColor.match(/.{1,2}/g);
        return [
            parseInt(hexArray[0], 16),
            parseInt(hexArray[1], 16),
            parseInt(hexArray[2], 16)
        ];
    }

    static rgbToHex(rgbColor) {
        return '#' + Helper.componentToHex(rgbColor[0]) + Helper.componentToHex(rgbColor[1]) + Helper.componentToHex(rgbColor[2]);
    }

    static componentToHex(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
}
