import {Point} from './models/point.js';
import {Audio} from './models/audio.js';
import {Canvas} from './models/canvas.js';

export class App {
    canvas = null;
    audioContext = null;

    constructor() {
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
        // this.drawPoint(200, 200, this.getRandomColor());
        // this.drawPoint(50, 500, this.getRandomColor());
        // this.drawPoint(1600, 400, this.getRandomColor());
        // this.drawPoint(1400, 700, this.getRandomColor());
        // this.drawPoint(900, 100, this.getRandomColor());
        // this.drawPoint(1000, 500, this.getRandomColor());

        this.drawPoint(500, 300, this.getRandomColor(), 200)
        this.drawPoint(500, 300, this.getRandomColor(), 200)
        this.drawPoint(500, 300, this.getRandomColor(), 200)
    }

    drawPoint(xPosition = 200, yPosition = 200, color = [255, 255, 255], size, shape) {
        const point = new Point(this.canvas, this.audioContext, xPosition, yPosition, color, size, shape);
        point.draw();
        point.startMovement(3, false);
    }

    getRandomColor() {
        return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    }
}
