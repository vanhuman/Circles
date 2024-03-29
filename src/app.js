import { Audio } from './services/audio.js';
import { Canvas } from './services/canvas.js';
import { CanvasConfig } from './services/canvas-config.js';
import { Drawing } from './models/drawing.js';

export class App {
    constructor() {
        CanvasConfig.getQueryString();
        this.initCanvas();
        this.initAudio();
        this.startDrawing();
    }

    initCanvas() {
        this.canvas = new Canvas();
    }

    initAudio() {
        this.audio = new Audio();
    }

    startDrawing() {
        const drawing = new Drawing(this.canvas, this.audio);
        this.postInstructions(drawing);
        this.canvas.setDrawing(drawing);

        const scenario = CanvasConfig.params.scenario ?? null;
        if (scenario && drawing['scenario_' + scenario] instanceof Function) {
            drawing['scenario_' + scenario]();
        } else {
            drawing.runRandomScenario();
        }
    }

    postInstructions(object) {
        console.log('Use querystring parameters for different configurations. Possible keys are: scenario, size, color, background, alpha, disableClear, enableClear, ' +
            ' clearWithDelay, vibrationFactor, movementFactor, circles');
        const scenarios = Object.getOwnPropertyNames(Object.getPrototypeOf(object)).filter(method => method.substring(0, 8) === 'scenario');
        console.log('Values for scenario: ' + scenarios.map(scenario => scenario.substring(9)).join(', ') + '.');
        console.log('Size is in number of pixels.');
        console.log('Color and background are hexadecimal without the # sign.');
        console.log('The alpha parameter can be just a number for a static alpha value, or 4 values indicating the type of process (only "fade-in" for now), ' +
            'the initial alpha value, the step value and the wait value (in seconds); for example: fade-in,0.005,0.001,0.1.');
        console.log('The parameters enableClear and disableClear override whether the previous points are cleared or not. No value necessary.');
        console.log('The parameter delayClear is only useful with enableClear, and allows to clear the previous points with a delay. If no value is passed the default (5 seconds) is used.');
        console.log('The parameters vibrationFactor and movementFactor influence the speed of vibration and movement: lower values increase the speed, ' +
            'higher values slow it down.');
        console.log('The circles parameter turns the points into circles. If no value is passed the default size factor (0.95) is used.');
        console.log('Keyboard shortcuts:');
        console.log('n: trigger the next scenario');
        console.log('a: trigger the same scenario again (with possibly other random arguments)');
        console.log('s: toggle window-size listener');
        console.log('q: stop playback');
        console.log('p: start playback');
    }
}
