import {Audio} from './services/audio.js';
import {Canvas} from './services/canvas.js';
import {CanvasConfig} from './services/canvas-config.js';
import {Drawing} from './models/drawing.js';

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
        const audio = new Audio();
        this.audioContext = audio.context;
    }

    startDrawing() {
        const scenario = CanvasConfig.params.scenario ?? 'static';
        const drawing = new Drawing(this.canvas, this.audioContext);
        this.postInstructions(drawing);
        if (drawing['scenario_' + scenario] instanceof Function) {
            drawing['scenario_' + scenario]();
        } else {
            drawing['scenario_static']();
        }
    }

    postInstructions(object) {
        console.log('Use querystring parameters for different configurations. Possible keys are scenario, color, background, alpha, disableClear, enableClear, ' +
            'vibrationFactor, movementFactor, circles');
        const scenarios = Object.getOwnPropertyNames(Object.getPrototypeOf(object)).filter(method => method.substring(0, 8) === 'scenario');
        console.log('Possible scenarios: ' + scenarios.map(scenario => scenario.substring(9)).join(', ') + '.');
        console.log('Color and background are hexadecimal without the # sign.');
        console.log('The alpha parameter can be just a number for a static alpha value, or 4 values indicating the type of process (only "fade-in" for now), ' +
            'the initial alpha value, the step value and the wait value (in seconds); for example: fade-in,0.005,0.001,0.1.');
        console.log('The parameters enableClear and disableClear override whether the previous points are cleared or not. No value necessary.');
        console.log('The parameters vibrationFactor and movementFactor influence the speed of vibration and movement: lower values increase the speed, ' +
            'higher values slow it down.');
        console.log('The circles parameter turns the points into circles.');
    }
}
