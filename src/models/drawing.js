import {CanvasConfig} from '../services/canvas-config.js';
import {DrawConfig} from '../config/draw-config.js';
import {Point} from './point.js';
import {VibrationConfig} from '../config/vibration-config.js';
import {MovementConfig} from '../config/movement-config.js';
import {Helper} from '../helpers/helper.js';

export class Drawing {
    constructor(canvas, audio) {
        this.canvas = canvas;
        this.audio = audio;
        this.scenarios = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(method => method.substring(0, 8) === 'scenario');
        this.skipScenarios = [
            this.scenario_audiotest,
            // this.scenario_blue_alpha,
            // this.scenario_duet,
            // this.scenario_paint,
            // this.scenario_big,
            // this.scenario_blue,
            // this.scenario_blue_middle,
            // this.scenario_green,
            // this.scenario_small,
            // this.scenario_red,
            // this.scenario_red_alpha,
            // this.scenario_walk,
        ];
    }

    scenario_static() {
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 200))
                .startVibration(new VibrationConfig(3, true, 3, 40, 0.2))
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 200))
                .startVibration(new VibrationConfig(3))
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 200))
                .startVibration(new VibrationConfig(3))
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 200))
                .startVibration(new VibrationConfig(3))
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 200))
                .startVibration(new VibrationConfig(3))
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 200))
                .setClearBeforeDraw(true)
                .setDelayClear(1000)
                .startVibration(new VibrationConfig(5, true, 3, 40, 0.2))
                .stopAfter(randInt(40, 60)),
        ]).then(() => this.runRandomScenario(this.scenario_static));
    }

    scenario_duet() {
        CanvasConfig.params.circles = 0.95;
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 0, 0], [0, 50, 255]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(10, 3, 1, 1))
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 0, 0], [0, 255, 50]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(15, 2, -1, -1))
                .stopAfter(randInt(40, 60))
        ]).then(() => this.runRandomScenario(this.scenario_duet));
    }

    scenario_walk() {
        this.canvas.setBackground(Math.random() < 0.5 ? 'fff' : '000');
        if (Math.random() < 0.5) {
            CanvasConfig.params.disableClear = "ON";
            this.canvas.setAlpha(Math.random() * 0.1 + 0.005);
        }
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getGreyVariant(), 200))
                .startVibration(new VibrationConfig(3))
                .startMovement()
                .stopAfter(randInt(80, 160)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getGreyVariant(), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(5, 5, -1, 1))
                .stopAfter(randInt(80, 160)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getGreyVariant(), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(5, 5, -1, -1))
                .stopAfter(randInt(80, 160)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getGreyVariant(), 200))
                .startVibration(new VibrationConfig(2))
                .startMovement(new MovementConfig(5, 5, -1, -1))
                .stopAfter(randInt(80, 160)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getGreyVariant(), 200))
                .startVibration(new VibrationConfig(2))
                .startMovement(new MovementConfig(5, 5, -1, 1))
                .stopAfter(randInt(80, 160)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getGreyVariant(), 200))
                .startVibration(new VibrationConfig(3))
                .startMovement()
                .stopAfter(randInt(80, 160))
        ]).then(() => this.runRandomScenario(this.scenario_walk));
    }

    scenario_big() {
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, 500, getRandomColor(), 2000))
                .startVibration(new VibrationConfig(3))
                .startMovement(new MovementConfig(5, 1, -1, 1))
                .stopAfter(randInt(30, 60)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 2000))
                .startVibration(new VibrationConfig(3))
                .startMovement(new MovementConfig(5, 0, 1, 1))
                .stopAfter(randInt(30, 60)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 2000))
                .startVibration(new VibrationConfig(3))
                .startMovement(new MovementConfig(2, 1, 1, -1))
                .stopAfter(randInt(30, 60))
        ]).then(() => this.runRandomScenario(this.scenario_big));
    }

    scenario_small() {
        this.canvas.setBackground('000');
        const size = 40;
        const colorFunc = Math.random() < 0.5 ? getRandomColor : () => [255, 255, 255];
        let i = 0;
        let promises = [];
        const numberOfPoints = Math.floor(Math.random() * 10) + 10;
        while (i < numberOfPoints) {
            promises.push(
                this.drawPoint(new DrawConfig(0, randInt(0, CanvasConfig.height), colorFunc(), size))
                    .startVibration(new VibrationConfig(2))
                    .startMovement(new MovementConfig(40, 0, 1, 0))
                    .stopAfter(randInt(60, 90))
            );
            promises.push(
                this.drawPoint(new DrawConfig(CanvasConfig.width, randInt(0, CanvasConfig.height), colorFunc(), size))
                    .startVibration(new VibrationConfig(2))
                    .startMovement(new MovementConfig(40, 0, -1, 0))
                    .stopAfter(randInt(60, 90))
            );
            i++;
        }
        Promise.all(promises).then(() => this.runRandomScenario(this.scenario_small));
    }

    scenario_paint() {
        // this.canvas.setBackground('fff');
        this.canvas.setAlpha(0.2);
        CanvasConfig.params.disableClear = "ON";
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 200))
                .startVibration()
                .startMovement(new MovementConfig(4, 0, 1, 1))
                .stopAfter(randInt(130, 160)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 200))
                .startVibration()
                .startMovement(new MovementConfig(0, 5, 1, 1))
                .stopAfter(randInt(130, 160)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 200))
                .startVibration()
                .startMovement(new MovementConfig(5, 5, -1, 1))
                .stopAfter(randInt(130, 160)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 200))
                .startVibration()
                .startMovement(new MovementConfig(5, 5, -1, -1))
                .stopAfter(randInt(130, 160))
        ]).then(() => this.runRandomScenario(this.scenario_big, true));
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
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
                .startVibration(new VibrationConfig(2, true, 300, 1, 0.2))
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
                .startVibration()
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
                .startVibration()
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
                .startVibration()
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
                .startVibration()
                .stopAfter(randInt(40, 60))
        ]).then(() => this.runRandomScenario(this.scenario_red));
    }

    scenario_blue_alpha() {
        CanvasConfig.params.disableClear = "ON";
        this.canvas.setAlpha(0.05);
        CanvasConfig.params.delayClear = 5000;
        Promise.all([
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration(new VibrationConfig(2, true))
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70))
        ]).then(() => this.runRandomScenario(this.scenario_blue_alpha));
    }

    scenario_blue() {
        this.canvas.setBackground('000');
        Promise.all([
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70))
        ]).then(() => this.runRandomScenario(this.scenario_blue));
    }

    scenario_blue_middle() {
        this.canvas.setBackground('000');
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration(new VibrationConfig(2, true, 10, 2, 0.5))
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70))
        ]).then(() => this.runRandomScenario(this.scenario_blue_middle));
    }

    scenario_green() {
        this.canvas.setBackground('000');
        Promise.all([
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 155, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(3, 0, 1, 1))
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 155, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(4, 0, 1, 1))
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 155, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(5, 0, 1, 1))
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 155, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(4, 0, 1, 1))
                .stopAfter(randInt(60, 70))
        ]).then(() => this.runRandomScenario(this.scenario_green));
    }

    scenario_green_alpha() {
        // this.canvas.setBackground('fff');
        CanvasConfig.params.disableClear = "ON";
        this.canvas.setAlpha(0.05);
        CanvasConfig.params.delayClear = 5000;
        Promise.all([
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(3, 0, 1, 1))
                .stopAfter(randInt(80, 90)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(4, 0, 1, 1))
                .stopAfter(randInt(80, 90)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(5, 0, 1, 1))
                .stopAfter(randInt(80, 90)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(4, 0, 1, 1))
                .stopAfter(randInt(80, 90))
        ]).then(() => this.runRandomScenario(this.scenario_green_alpha));
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

    reset(clearBackground = false) {
        this.canvas.setAlpha(1);
        if (clearBackground || !CanvasConfig.baseColor.equals(Helper.hexToRgb('fff'))) {
            this.canvas.setBackground('fff');
        }
        CanvasConfig.params.disableClear = null;
        CanvasConfig.params.delayClear = null;
        CanvasConfig.params.circles = null;
    }

    runRandomScenario(currentScenario, clearBackground = false) {
        this.reset(clearBackground);
        let index;
        let scenario;
        let validScenario = false;
        while (!validScenario) {
            index = randInt(0, this.scenarios.length - 1);
            scenario = this[this.scenarios[index]];
            if (!this.skipScenarios.includes(scenario) && scenario !== currentScenario) {
                validScenario = true;
                setTimeout(() => {
                    scenario.call(this);
                }, 100);
            }
        }
    }

    drawPoint(config) {
        const point = new Point(this.canvas, this.audio, config);
        point.draw();
        return point;
    }
}
