import {CanvasConfig} from '../services/canvas-config.js';
import {DrawConfig} from '../config/draw-config.js';
import {Point} from './point.js';
import {VibrationConfig} from '../config/vibration-config.js';
import {MovementConfig} from '../config/movement-config.js';
import {Helper} from '../helpers/helper.js';

export class Drawing {
    constructor(canvas, audioContext) {
        this.canvas = canvas;
        this.audioContext = audioContext;
        this.scenarios = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(method => method.substring(0, 8) === 'scenario');
        this.skipScenarios = [
            this.scenario_audiotest,
            this.scenario_big,
            this.scenario_blue_alpha,
            this.scenario_blue,
            this.scenario_green,
            this.scenario_duet,
            this.scenario_small,
            this.scenario_red,
            this.scenario_paint,
            this.scenario_walk,
        ];
    }

    scenario_static() {
        this.reset();
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 200))
                .startVibration(new VibrationConfig(3))
                .stopAfter(randInt(20, 40)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 200))
                .startVibration(new VibrationConfig(3))
                .stopAfter(randInt(20, 40)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 200))
                .startVibration(new VibrationConfig(3))
                .stopAfter(randInt(20, 40)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 200))
                .startVibration(new VibrationConfig(3))
                .stopAfter(randInt(20, 40)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 200))
                .startVibration(new VibrationConfig(3))
                .stopAfter(randInt(20, 40)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 200))
                .setClearBeforeDraw(false)
                .setDelayClear(1000)
                .startVibration(new VibrationConfig(5, true, 5, 40, 0.7))
                .stopAfter(randInt(20, 40))
        ]).then(() => this.runRandomScenario(this.scenario_static));
    }

    scenario_duet() {
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor(), 200))
            .startVibration()
            .startMovement()
            .stopAfter(3)
        this.drawPoint(new DrawConfig(CanvasConfig.width * 2 / 4, CanvasConfig.height / 4, getRandomColor(), 200))
            .startVibration()
            .startMovement(new MovementConfig(5, 5, -1, -1))
            .stopAfter(20)
    }

    scenario_walk() {
        this.canvas.setBackground(Math.random() < 0.5 ? 'fff' : '000');
        if (Math.random() < 0.5) {
            CanvasConfig.params.disableClear = "ON";
            this.canvas.setAlpha(Math.random() * 0.1 + 0.005);
        }
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getGreyVariant(), 200))
            .startVibration(new VibrationConfig(3))
            .startMovement()
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getGreyVariant(), 200))
            .startVibration(new VibrationConfig(1))
            .startMovement(new MovementConfig(5, 5, -1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getGreyVariant(), 200))
            .startVibration(new VibrationConfig(1))
            .startMovement(new MovementConfig(5, 5, -1, -1))
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getGreyVariant(), 200))
            .startVibration(new VibrationConfig(2))
            .startMovement(new MovementConfig(5, 5, -1, -1))
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getGreyVariant(), 200))
            .startVibration(new VibrationConfig(2))
            .startMovement(new MovementConfig(5, 5, -1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getGreyVariant(), 200))
            .startVibration(new VibrationConfig(3))
            .startMovement()
    }

    scenario_big() {
        this.drawPoint(new DrawConfig(CanvasConfig.width / 2, 500, getRandomColor(), 2000))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(5, 1, -1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 2000))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(5, 0, 1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 2000))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(2, 1, 1, -1))
    }

    scenario_small() {
        CanvasConfig.params.disableClear = "ON";
        this.drawPoint(new DrawConfig(CanvasConfig.width / 2, 500, getRandomColor(), 10))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(5, 1, -1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width / 5, 500, getRandomColor(), 10))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(5, 1, -1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width / 3, 300, getRandomColor(), 10))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(50, 1, -1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width / 8, 200, getRandomColor(), 10))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(15, 1, -1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 10))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(5, 0, 1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 100, getRandomColor(), 10))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(5, 0, 1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width / 2, 100, getRandomColor(), 10))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(5, 15, 1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width / 2, 500, getRandomColor(), 10))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(15, 2, 1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 10))
            .startVibration(new VibrationConfig(3))
            .startMovement(new MovementConfig(12, 1, 1, -1))
    }

    scenario_paint() {
        this.canvas.setBackground('fff');
        this.canvas.setAlpha(0.2);
        CanvasConfig.params.disableClear = "ON";
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 200))
            .startVibration()
            .startMovement(new MovementConfig(4, 0, 1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 200))
            .startVibration()
            .startMovement(new MovementConfig(0, 5, 1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 200))
            .startVibration()
            .startMovement(new MovementConfig(5, 5, -1, 1))
        this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 200))
            .startVibration()
            .startMovement(new MovementConfig(5, 5, -1, -1))
    }

    scenario_audiotest() {
        this.canvas.setBackground('000');
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 2, getRandomColor([255, 0, 0], [255, 0, 0]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 255, 0], [0, 255, 0]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 2, getRandomColor([0, 0, 255], [0, 0, 255]), 200))
            .startVibration()
    }

    scenario_red_alpha() {
        this.canvas.setBackground('000');
        this.canvas.setAlpha(0.05);
        CanvasConfig.params.disableClear = "ON";
        CanvasConfig.params.delayClear = 3000;
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
                .startVibration(new VibrationConfig(2, true, 30, 10, 0.2))
                .stopAfter(60),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200, 1))
                .startVibration()
                .stopAfter(80),
            this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200, 2))
                .startVibration()
                .startMovement(new MovementConfig(3, 3, 1, 1))
                .stopAfter(80),
            this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
                .startVibration()
                .stopAfter(90)
        ]).then(() => this.runRandomScenario(this.scenario_red_alpha));
    }

    scenario_red() {
        this.canvas.setBackground('000');
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
            .startVibration()
    }

    scenario_blue_alpha() {
        CanvasConfig.params.disableClear = "ON";
        this.canvas.setAlpha(0.05);
        CanvasConfig.params.delayClear = 5000;
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
            .startVibration(new VibrationConfig(2, true))
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
            .startVibration()
    }

    scenario_blue() {
        this.canvas.setBackground('000');
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
            .startVibration()
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
            .startVibration()
    }

    scenario_green() {
        this.canvas.setBackground('000');
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
            .startVibration(new VibrationConfig(1))
            .startMovement(new MovementConfig(3, 0, 1, 1))
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
            .startVibration(new VibrationConfig(1))
            .startMovement(new MovementConfig(4, 0, 1, 1))
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
            .startVibration(new VibrationConfig(1))
            .startMovement(new MovementConfig(5, 0, 1, 1))
        this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
            .startVibration(new VibrationConfig(1))
            .startMovement(new MovementConfig(4, 0, 1, 1))
    }

    scenario_yellow() {
        this.reset();
        Promise.all([
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([255, 255, 0], [255, 255, 230]), 200))
                .startVibration()
                .startMovement(new MovementConfig(4, 2, 1, 1))
                .stopAfter(20),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([255, 255, 0], [255, 255, 230]), 200))
                .startVibration()
                .startMovement(new MovementConfig(0, 1, 1, 1))
                .stopAfter(30),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([255, 255, 0], [255, 255, 230]), 200))
                .startVibration()
                .startMovement(new MovementConfig(2, 2, -1, 1))
                .stopAfter(40),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([255, 255, 0], [255, 255, 230]), 200))
                .startVibration()
                .startMovement(new MovementConfig(4, 0, 1, 1))
                .stopAfter(15),
        ]).then(() => this.runRandomScenario(this.scenario_yellow));
    }

    reset() {
        this.canvas.setAlpha(1);
        if (!CanvasConfig.baseColor.equals(Helper.hexToRgb('fff'))) {
            this.canvas.setBackground('fff');
        }
        CanvasConfig.params.disableClear = null;
        CanvasConfig.params.delayClear = null;
    }

    runRandomScenario(currentScenario) {
        console.log('new scenario');
        let index;
        let scenario;
        let validScenario = false;
        while (!validScenario) {
            index = randInt(0, this.scenarios.length - 1);
            scenario = this[this.scenarios[index]];
            console.log(scenario);
            if (!this.skipScenarios.includes(scenario) && scenario !== currentScenario) {
                console.log('valid!');
                validScenario = true;
                setTimeout(() => {
                    scenario.call(this);
                }, 100);
            }
        }
    }

    drawPoint(config) {
        const point = new Point(this.canvas, this.audioContext, config);
        point.draw();
        return point;
    }
}
