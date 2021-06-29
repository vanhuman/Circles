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
    delayClear = 0;
    collision = true;
    stopped = false;

    constructor(canvas, audioContext, config) {
        this.canvas = canvas;
        this.audioContext = audioContext;
        this.position = config.position;
        this.color = CanvasConfig.params.color ? Helper.hexToRgb(CanvasConfig.params.color) : config.color;
        this.size = CanvasConfig.params.size && CanvasConfig.params.size !== '' ? CanvasConfig.params.size : config.size;
        this.pointAudio = new PointAudio(this);
        this.pointAudio.play();
        this.pointMovement = new PointMovement(this);
        this.id = config.id ?? null;
    }

    startVibration(config) {
        this.pointMovement.vibratePoint(config);
        return this;
    }

    startMovement(config) {
        this.pointMovement.movePoint(config);
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
        this.canvas.registerPointPosition(this, this.position);
        this.collision = this.canvas.checkForCollisionWithPoint(this);
    }

    setOffset(dx, dy) {
        this.setPosition(this.position.x + dx, this.position.y + dy);
    }

    setClearBeforeDraw(clearBeforeDraw) {
        this.clearBeforeDraw = clearBeforeDraw;
        return this;
    }

    setDelayClear(delayClear) {
        this.delayClear = delayClear;
        return this;
    }

    draw() {
        if (CanvasConfig.params.enableClear || (this.clearBeforeDraw && !CanvasConfig.params.disableClear)) {
            const alpha = this.canvas.context.globalAlpha;
            this.canvas.context.globalAlpha = 1;
            this.drawPoint(true);
            this.canvas.context.globalAlpha = alpha;
        }
        this.drawPoint();
    }

    drawPoint(clear = false) {
        let x = this.position.x;
        let y = this.position.y;
        let color = this.color;
        if (clear) {
            x = this.previousPosition.x;
            y = this.previousPosition.y;
            color = CanvasConfig.baseColor;
        } else if ((CanvasConfig.params.delayClear || this.delayClear) && (!this.clearBeforeDraw || CanvasConfig.params.disableClear)) {
            let xPast = this.previousPosition.x;
            let yPast = this.previousPosition.y;
            let colorPast = CanvasConfig.baseColor;
            let delay = isNumber(this.delayClear) ? Number(this.delayClear) : 0;
            if (!delay) {
                delay = isNumber(CanvasConfig.params.delayClear) ? Number(CanvasConfig.params.delayClear) : 5000;
            }
            setTimeout(() => {
                if (!this.stopped) {
                    this.drawArc(colorPast, xPast, yPast);
                }
            }, delay);
        }
        this.drawArc(color, x, y);

        if (CanvasConfig.params.circles) {
            this.drawInnerCircle(x, y);
        }
    }

    drawInnerCircle(x, y) {
        const factor = isNumber(CanvasConfig.params.circles) ? Number(CanvasConfig.params.circles) : 0.95;
        const color = CanvasConfig.baseColor;
        const randX = ((Math.random() - 0.5) * 5);
        const randY = ((Math.random() - 0.5) * 5);
        // const alpha = this.canvas.context.globalAlpha;
        // this.canvas.context.globalAlpha = 0.2;
        this.drawArc(color, x + randX, y + randY, this.size * factor);
        // this.canvas.context.globalAlpha = alpha;
    }

    drawArc(color, x, y, size = this.size) {
        this.canvas.context.beginPath();
        this.canvas.context.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
        this.canvas.context.arc(x, y, 0.5 * size, 0, 2 * Math.PI);
        this.canvas.context.fill();
    }

    clearPoint() {
        let wait = 30;
        if (CanvasConfig.params.movementFactor) {
            wait = CanvasConfig.params.movementFactor * wait;
        }
        return new Promise((resolve) => {
            let maxSteps = Math.max(
                Math.abs(this.color[0] - CanvasConfig.baseColor[0]),
                Math.abs(this.color[1] - CanvasConfig.baseColor[1]),
                Math.abs(this.color[2] - CanvasConfig.baseColor[2])
            );
            const signs = [
                this.color[0] - CanvasConfig.baseColor[0] < 0 ? 1 : -1,
                this.color[1] - CanvasConfig.baseColor[1] < 0 ? 1 : -1,
                this.color[2] - CanvasConfig.baseColor[2] < 0 ? 1 : -1,
            ];
            let color = this.color;
            const clearPointFadeOut = Helper.taskConstructor(() => {
                color[0] = color[0] + (color[0] === CanvasConfig.baseColor[0] ? 0 : signs[0]);
                color[1] = color[1] + (color[1] === CanvasConfig.baseColor[1] ? 0 : signs[1]);
                color[2] = color[2] + (color[2] === CanvasConfig.baseColor[2] ? 0 : signs[2]);
                this.drawArc(color, this.position.x, this.position.y);
                this.drawArc(color, this.previousPosition.x, this.previousPosition.y);
                if (maxSteps === 0) {
                    clearPointFadeOut.stop();
                    resolve();
                }
                maxSteps--;
            }, wait);
        });
    }

    stopAfter(duration) {
        if (CanvasConfig.params.movementFactor) {
            duration = CanvasConfig.params.movementFactor * duration;
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                this.pointAudio.scheduleStop(4);
                if (this.pointMovement.movePointTask) {
                    this.pointMovement.movePointTask.stop();
                }
                this.clearPoint().then(() => {
                    if (this.pointMovement.vibratePointTask) {
                        this.pointMovement.vibratePointTask.stop();
                    }
                    this.stopped = true;
                    this.pointMovement = null;
                    this.pointAudio = null;
                    this.canvas.deRegisterPoint(this);
                    resolve();
                });
            }, duration * 1000);
        });
    }

    play(fadeTime = 20) {
        this.pointAudio.play(fadeTime);
    }

    updateAudio() {
        this.pointAudio.updateAudio();
    }
}
