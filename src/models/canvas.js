import {CanvasConfig} from './canvas-config.js';

export class Canvas {
    context = null;

    constructor() {
        this.initCanvas();
    }

    initCanvas() {
        const canvas = document.getElementById('MovingPointsCanvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        CanvasConfig.width = window.innerWidth;
        CanvasConfig.height = window.innerHeight;
        this.context = canvas.getContext('2d');
    }

    getContext() {
        return this.context;
    }

    getConfig() {
        return this.config;
    }
}
