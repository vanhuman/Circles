import {CanvasConfig} from '../services/canvas-config.js';
import {DrawConfig} from './draw-config.js';
import {Point} from "./point.js";

export class Drawing {
    constructor(canvas, audioContext) {
        this.canvas = canvas;
        this.audioContext = audioContext;
    }

    scenario_duet() {
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 4, this.getRandomColor(), 200))
            .startVibration()
            .startMovement(5, 5, 1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 2 / 4, CanvasConfig.height / 4, this.getRandomColor(),200))
            .startVibration()
            .startMovement(5, 5, -1, 1)
    }

    scenario_static() {
        // CanvasConfig.disableClear = true;
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, this.getRandomColor(), 200))
            .startVibration(3, false)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, this.getRandomColor(), 200))
            .startVibration(3, false)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, this.getRandomColor(), 200))
            .startVibration(3, false)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, this.getRandomColor(), 200))
            .startVibration(3, false)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, this.getRandomColor(), 200))
            .startVibration(3, false)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, this.getRandomColor(), 200))
            .setClearBeforeDraw(true)
            .startVibration(3, false)
    }

    scenario_walk() {
        CanvasConfig.disableClear = false;
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, this.getRandomColor(), 200))
            .startVibration(3, false)
            .startMovement(5, 5, 1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, this.getRandomColor(), 200))
            .startVibration(3, false)
            .startMovement(5, 5, -1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, this.getRandomColor(), 200))
            .startVibration(3, false)
            .startMovement(5, 5, -1, -1)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, this.getRandomColor(), 200))
            .startVibration(3, false)
            .startMovement(5, 5, -1, -1)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, this.getRandomColor(), 200))
            .startVibration(3, false)
            .startMovement(5, 5, -1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, this.getRandomColor(), 200))
            .setClearBeforeDraw(true)
            .startVibration(3, false)
            .startMovement(5, 5, 1, 1)
    }

    scenario_big() {
        this.drawPoint(new DrawConfig(CanvasConfig.width / 2, 500, this.getRandomColor(), 2000))
            .startVibration(3, false)
            .startMovement(5, 1, -1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, this.getRandomColor(), 2000))
            .startVibration(3, false)
            .startMovement(5, 0, 1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, this.getRandomColor(), 2000))
            .startVibration(3, false)
            .startMovement(2, 1, 1, -1)
    }

    scenario_small() {
        this.drawPoint(new DrawConfig(CanvasConfig.width / 2, 500, this.getRandomColor(), 10))
            .setClearBeforeDraw(false)
            .startVibration(3, false)
            .startMovement(5, 1, -1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 5, 500, this.getRandomColor(), 10))
            .setClearBeforeDraw(false)
            .startVibration(3, false)
            .startMovement(5, 1, -1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 3, 300, this.getRandomColor(), 10))
            .setClearBeforeDraw(false)
            .startVibration(3, false)
            .startMovement(50, 1, -1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 8, 200, this.getRandomColor(), 10))
            .setClearBeforeDraw(false)
            .startVibration(3, false)
            .startMovement(15, 1, -1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, this.getRandomColor(), 10))
            .setClearBeforeDraw(false)
            .startVibration(3, false)
            .startMovement(5, 0, 1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 100, this.getRandomColor(), 10))
            .setClearBeforeDraw(false)
            .startVibration(3, false)
            .startMovement(5, 0, 1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 2, 100, this.getRandomColor(), 10))
            .setClearBeforeDraw(false)
            .startVibration(3, false)
            .startMovement(5, 15, 1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 2, 500, this.getRandomColor(), 10))
            .setClearBeforeDraw(false)
            .startVibration(3, false)
            .startMovement(15, 2, 1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, this.getRandomColor(), 10))
            .setClearBeforeDraw(false)
            .startVibration(3, false)
            .startMovement(12, 1, 1, -1)
    }

    scenario_paint() {
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, this.getRandomColor(), 200))
            .setClearBeforeDraw(false)
            .startVibration(2, false)
            .startMovement(4, 0, 1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, this.getRandomColor(), 200))
            .setClearBeforeDraw(false)
            .startVibration(2, false)
            .startMovement(0, 5, 1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, this.getRandomColor(), 200))
            .setClearBeforeDraw(false)
            .startVibration(2, false)
            .startMovement(5, 5, -1, 1)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, this.getRandomColor(), 200))
            .setClearBeforeDraw(false)
            .startVibration(2, false)
            .startMovement(5, 5, -1, -1)
    }

    drawPoint(config) {
        const point = new Point(this.canvas, this.audioContext, config);
        point.draw();
        return point;
    }

    getRandomColor() {
        return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    }

}
