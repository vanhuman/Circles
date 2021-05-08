import {PointAudio} from './point-audio.js';
import {PointMovement} from './point-movement.js';

export class Point {
    canvasContext = null;
    audioContext = null;
    pointAudio = null;
    pointMovement = null;
    baseColor = [0, 0, 0];
    color = this.baseColor;
    shape = 'circle';
    size = 50;
    position = {
        x: 0,
        y: 0,
    };
    previousPosition = {
        x: 0,
        y: 0,
    };

    constructor(canvas, audioContext, xPosition, yPosition, color, size, shape) {
        this.canvasContext = canvas.getContext();
        this.audioContext = audioContext;
        this.position = {
            x: xPosition,
            y: yPosition,
        };
        this.color = color;
        if (size) {
            this.size = size;
        }
        if (shape) {
            this.shape = shape;
        }

        this.pointAudio = new PointAudio(this);
        this.pointAudio.play();
    }

    startMovement(vibrateWidth = 3, vibrateWithJumps = false, moveAround = false) {
        this.pointMovement = new PointMovement(this);
        this.pointMovement.vibratePoint(vibrateWidth, vibrateWithJumps);

        if (moveAround) {
            // this.pointMovement.movePoint(5, 5, 1, 1);

            // this.pointMovement.stopAt('bottom', this.pointMovement.movePoint(0, 30, null, 1))
            //     .then(() => this.pointMovement.stopAt('right', this.pointMovement.movePoint(30, 0, 1, null)))
            //     .then(() => this.pointMovement.stopAt('top', this.pointMovement.movePoint(0, 30, null, -1)))
            //     .then(() => this.pointMovement.stopAt('left', this.pointMovement.movePoint(30, 0, 1, null)))
            //     .then(() => console.log('done'));
        }
    }

    setPosition(x, y) {
        this.previousPosition = Object.assign({}, this.position);
        this.position.x = x;
        this.position.y = y;
    }

    setOffset(dx, dy) {
        this.previousPosition = Object.assign({}, this.position);
        this.position.x = this.position.x + dx;
        this.position.y = this.position.y + dy;
    }

    draw() {
        if (this.shape === 'circle') {
            this.drawCircle(true);
            this.drawCircle();
        } else {
            this.drawSquare(true);
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
            color = this.baseColor;
        }
        // this.context.globalAlpha = 0.5;
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
        this.canvasContext.arc(x, y, 0.5 * this.size, 0, 2 * Math.PI);
        this.canvasContext.fill();
    }

    drawSquare(clear = false) {
        let x = this.position.x;
        let y = this.position.y;
        let color = this.color;
        if (clear) {
            x = this.previousPosition.x;
            y = this.previousPosition.y;
            color = this.baseColor;
        }
        this.canvasContext.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
        this.canvasContext.fillRect(x, y, this.size, this.size);
    }

    play(fadeTime = 20) {
        this.pointAudio.play(fadeTime);
    }

    updateAudio() {
        this.pointAudio.updateAudio();
    }

}
