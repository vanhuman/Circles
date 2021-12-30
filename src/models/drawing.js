import { CanvasConfig } from '../services/canvas-config.js';
import { DrawConfig } from '../config/draw-config.js';
import { Point } from './point.js';
import { VibrationConfig } from '../config/vibration-config.js';
import { MovementConfig } from '../config/movement-config.js';
import { Helper } from '../helpers/helper.js';

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
                .setClearBeforeDraw(false)
                .setDelayClear(1000)
                .startVibration(new VibrationConfig(5, true, 3, 40, 0.2))
                .stopAfter(randInt(40, 60)),
        ]).then(() => this.runRandomScenario(), () => {
        });
    }

    scenario_duet() {
        this.canvas.setBackground('fff');
        CanvasConfig.params.circles = 0.55;
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height - 110, getRandomColor([0, 0, 0], [155, 50, 255]), 200))
                .startVibration(new VibrationConfig(1, true, 300, 2, 0.1))
                .startMovement(new MovementConfig(10, 2, 1, -1))
                .stopAfter(randInt(40, 60)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height - 110, getRandomColor([0, 0, 0], [50, 255, 50]), 200))
                .startVibration(new VibrationConfig(1, true, 100, 3, 0.1))
                .startMovement(new MovementConfig(10, 2, -1, -1))
                .stopAfter(randInt(40, 60))
        ]).then(() => this.runRandomScenario(), () => {
        });
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
        ]).then(() => this.runRandomScenario(), () => {
        });
    }

    scenario_big() {
        let minLength = 30;
        let maxLength = 60;
        if (Math.random() < 0.5) {
            CanvasConfig.params.disableClear = "ON";
            this.canvas.setAlpha(Math.random() * 0.1 + 0.005);
            minLength = 60;
            maxLength = 120;
        }
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, 500, getRandomColor(), 2000))
                .startVibration(new VibrationConfig(3))
                .startMovement(new MovementConfig(5, 1, -1, 1))
                .stopAfter(randInt(minLength, maxLength)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, 300, getRandomColor(), 2000))
                .startVibration(new VibrationConfig(3))
                .startMovement(new MovementConfig(5, 0, 1, 1))
                .stopAfter(randInt(minLength, maxLength)),
            this.drawPoint(new DrawConfig(CanvasConfig.width * 3 / 4, 300, getRandomColor(), 2000))
                .startVibration(new VibrationConfig(3))
                .startMovement(new MovementConfig(2, 1, 1, -1))
                .stopAfter(randInt(minLength, maxLength))
        ]).then(() => this.runRandomScenario(), () => {
        });
    }

    scenario_small() {
        if (Math.random() < 0.5) {
            CanvasConfig.params.disableClear = "ON";
            this.canvas.setAlpha(Math.random() * 0.1 + 0.005);
        }
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
        Promise.all(promises).then(() => this.runRandomScenario(), () => {
        });
    }

    scenario_paint() {
        this.canvas.setAlpha(Math.random() * 0.6 + 0.005);
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
        ]).then(() => this.runRandomScenario(true), () => {
        });
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
        this.canvas.setAlpha(Math.random() * 0.1 + 0.005);
        CanvasConfig.params.disableClear = "ON";
        CanvasConfig.params.delayClear = 3000;
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
                .startVibration(new VibrationConfig(2, true, 30, 10, 0.2))
                .stopAfter(randInt(60, 120)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200, 1))
                .startVibration()
                .stopAfter(randInt(60, 120)),
            this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200, 2))
                .startVibration()
                .startMovement(new MovementConfig(3, 3, 1, 1))
                .stopAfter(randInt(60, 120)),
            this.drawPoint(new DrawConfig(3 * CanvasConfig.width / 4, CanvasConfig.height / 4, getRandomColor([50, 0, 0], [255, 0, 0]), 200))
                .startVibration()
                .stopAfter(randInt(60, 120))
        ]).then(() => this.runRandomScenario(), () => {
        });
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
        ]).then(() => this.runRandomScenario(), () => {
        });
    }

    scenario_blue() {
        let vibrationWidth = 1;
        let vibrationWithJumps = false;
        let showRed = false;
        this.canvas.setBackground('000');
        if (Math.random() < 0.5) {
            CanvasConfig.params.disableClear = "ON";
            this.canvas.setAlpha(Math.random() * 0.1 + 0.005);
            CanvasConfig.params.delayClear = 5000;
            vibrationWidth = 2;
            vibrationWithJumps = true;
            showRed = true;
        }
        let promises = [
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 120)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration(new VibrationConfig(vibrationWidth, vibrationWithJumps))
                .stopAfter(randInt(60, 120)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 120)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 120))
        ];
        if (showRed) {
            promises.push(this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(CanvasConfig.height - 200, CanvasConfig.height), getRandomColor([10, 0, 0], [40, 0, 0]), 200))
                .startVibration()
                .stopAfter(randInt(60, 120)));
        }
        Promise.all(promises).then(() => this.runRandomScenario(), () => {
        });
    }

    scenario_blue_middle() {
        this.canvas.setBackground('000');
        Promise.all([
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 50, 50], [0, 100, 255]), 200))
                .startVibration(new VibrationConfig(2, true, 10, 2, 0.5))
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70)),
            this.drawPoint(new DrawConfig(CanvasConfig.width / 2, CanvasConfig.height / 2, getRandomColor([0, 0, 50], [0, 0, 255]), 200))
                .startVibration()
                .stopAfter(randInt(60, 70))
        ]).then(() => this.runRandomScenario(), () => {
        });
    }

    scenario_green() {
        let vibrationWithJumps = false;
        if (Math.random() < 0.5) {
            CanvasConfig.params.disableClear = "ON";
            this.canvas.setAlpha(Math.random() * 0.1 + 0.005);
            CanvasConfig.params.delayClear = 5000;
            vibrationWithJumps = true;
        } else {
            this.canvas.setBackground('000');
        }
        Promise.all([
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
                .startVibration(new VibrationConfig(1, vibrationWithJumps, 100, 2, 0.2))
                .startMovement(new MovementConfig(3, 0, 1, 1))
                .stopAfter(randInt(80, 120)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(4, 0, 1, 1))
                .stopAfter(randInt(80, 120)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(5, 0, 1, 1))
                .stopAfter(randInt(80, 120)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([0, 20, 0], [0, 255, 0]), 200))
                .startVibration(new VibrationConfig(1))
                .startMovement(new MovementConfig(4, 0, 1, 1))
                .stopAfter(randInt(80, 120))
        ]).then(() => this.runRandomScenario(), () => {
        });
    }

    scenario_green_red_alpha() {
        this.canvas.setBackground('fff');
        CanvasConfig.params.disableClear = "ON";
        this.canvas.setAlpha(0.05);
        CanvasConfig.params.delayClear = 5000;
        Promise.all([
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([20, 20, 0], [100, 255, 0]), 200))
                .startVibration(new VibrationConfig(1,true, 100, 2, 0.5))
                .startMovement(new MovementConfig(3, 0, 1, 1))
                .stopAfter(randInt(80, 90)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([20, 20, 0], [100, 255, 0]), 200))
                .startVibration(new VibrationConfig(1,true, 100, 2, 0.8))
                .startMovement(new MovementConfig(4, 0, 1, 1))
                .stopAfter(randInt(80, 90))
        ]).then(() => this.runRandomScenario(), () => {
        });
    }

    scenario_blue_red_alpha() {
        this.canvas.setBackground('fff');
        CanvasConfig.params.disableClear = "ON";
        this.canvas.setAlpha(Math.random() * 0.1 + 0.005);
        CanvasConfig.params.delayClear = 10000;
        Promise.all([
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([20, 0, 0], [100, 0, 255]), 200))
                .startVibration(new VibrationConfig(1,true, 100, 2, 0.5))
                .startMovement(new MovementConfig(3, 0, 1, 1))
                .stopAfter(randInt(80, 90)),
            this.drawPoint(new DrawConfig(randInt(0, CanvasConfig.width), randInt(0, CanvasConfig.height), getRandomColor([20, 0, 0], [100, 0, 255]), 200))
                .startVibration(new VibrationConfig(1,true, 100, 2, 0.8))
                .startMovement(new MovementConfig(4, 0, 1, 1))
                .stopAfter(randInt(80, 90))
        ]).then(() => this.runRandomScenario(), () => {
        });
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
        ]).then(() => this.runRandomScenario(), () => {
        });
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

    runRandomScenario(clearBackground = false) {
        this.reset(clearBackground);
        let index;
        let scenario;
        let validScenario = false;
        while (!validScenario) {
            index = randInt(0, this.scenarios.length - 1);
            scenario = this[this.scenarios[index]];
            if (!this.skipScenarios.includes(scenario) && scenario !== this.currentScenario) {
                validScenario = true;
                this.currentScenario = scenario;
                this.canvas.setStatus('Playing ' + this.scenarios[index]);
                setTimeout(() => {
                    scenario.call(this);
                }, 100);
            }
        }
    }

    runSameScenario() {
        this.reset(true);
        setTimeout(() => {
            this.canvas.setStatus('Playing ' + this.currentScenario.name);
            this.currentScenario.call(this);
        }, 100);
    }

    drawPoint(config) {
        const point = new Point(this.canvas, this.audio, config);
        point.draw();
        return point;
    }
}
