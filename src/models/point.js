import {PointAudio} from './point-audio.js';
import {PointMovement} from './point-movement.js';
import {CanvasConfig} from '../services/canvas-config.js';
import {Helper} from '../helpers/helper.js';

export class Point {
    previousPosition = {
        x: -1000,
        y: -1000,
    };
    clearBeforeDraw = true;
    collision = true;

    constructor(canvas, audioContext, config) {
        this.canvas = canvas;
        this.audioContext = audioContext;
        this.position = config.position;
        this.color = CanvasConfig.params.color ? Helper.hexToRgb(CanvasConfig.params.color) : config.color;
        this.size = CanvasConfig.params.size && CanvasConfig.params.size !== '' ? CanvasConfig.params.size : config.size;
        this.shape = config.shape;
        this.pointAudio = new PointAudio(this);
        this.pointAudio.play();
        this.pointMovement = new PointMovement(this);
    }

    startVibration(vibrateWidth = 2, vibrateWithJumps = false) {
        this.pointMovement.vibratePoint(vibrateWidth, vibrateWithJumps);
        return this;
    }

    startMovement(deltaX = 5, deltaY = 5, directionX = 1, directionY = 1) {
        this.pointMovement.movePoint(deltaX, deltaY, directionX, directionY);

        // this.pointMovement.stopAt('bottom', this.pointMovement.movePoint(0, 30, null, 1))
        //     .then(() => this.pointMovement.stopAt('right', this.pointMovement.movePoint(30, 0, 1, null)))
        //     .then(() => this.pointMovement.stopAt('top', this.pointMovement.movePoint(0, 30, null, -1)))
        //     .then(() => this.pointMovement.stopAt('left', this.pointMovement.movePoint(30, 0, 1, null)))
        //     .then(() => console.log('done'));

        return this;
    }

    setPosition(x, y) {
        this.previousPosition = Object.assign({}, this.position);
        this.position.x = x;
        this.position.y = y;
        this.canvas.registerPosition(this, this.position);
        this.collision = this.canvas.checkForCollisionWithPoint(this);
    }

    setOffset(dx, dy) {
        this.setPosition(this.position.x + dx, this.position.y + dy);
    }

    setClearBeforeDraw(clearBeforeDraw) {
        this.clearBeforeDraw = clearBeforeDraw;
        return this;
    }

    draw() {
        if (this.shape === 'circle') {
            if (CanvasConfig.params.enableClear || (this.clearBeforeDraw && !CanvasConfig.disableClear && !CanvasConfig.params.disableClear)) {
                let alpha;
                alpha = this.canvas.context.globalAlpha;
                this.canvas.context.globalAlpha = 1;
                this.drawCircle(true);
                this.canvas.context.globalAlpha = alpha;
            }
            this.drawCircle();
        } else {
            if (this.clearBeforeDraw) {
                this.drawSquare(true);
            }
            this.drawSquare();
        }
    }

    drawCircle(clear = false) {
        let x = this.position.x;
        let y = this.position.y;
        let color = this.color;
        if (clear) {
            x = this.previousPosition.x;
            y = this.previousPosition.y;
            color = CanvasConfig.baseColor;
        }
        this.canvas.context.beginPath();
        this.canvas.context.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
        this.canvas.context.arc(x, y, 0.5 * this.size, 0, 2 * Math.PI);
        this.canvas.context.fill();
    }

    drawSquare(clear = false) {
        let x = this.position.x;
        let y = this.position.y;
        let color = this.color;
        if (clear) {
            x = this.previousPosition.x;
            y = this.previousPosition.y;
            color = CanvasConfig.baseColor;
        }
        this.canvas.context.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
        this.canvas.context.fillRect(x, y, this.size, this.size);
    }

    play(fadeTime = 20) {
        this.pointAudio.play(fadeTime);
    }

    updateAudio() {
        this.pointAudio.updateAudio();
    }
}
