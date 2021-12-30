import { Helper } from '../helpers/helper.js';
import { CanvasConfig } from '../services/canvas-config.js';
import { VibrationConfig } from '../config/vibration-config.js';
import { MovementConfig } from '../config/movement-config.js';

export class PointMovement {
    point = null;

    constructor(point) {
        this.point = point;
    }

    vibratePoint(config) {
        if (!config) {
            config = new VibrationConfig();
        }
        const wait = 50;
        const point = this.point;
        const checkOutOfRange = this.checkOutOfRange;
        let count = 0;
        let countTo = 0;
        let directionX = Math.random() < 0.5 ? -1 : 1;
        let directionY = Math.random() < 0.5 ? -1 : 1;
        let dx, dy;
        let waitFactor = CanvasConfig.params.vibrationFactor ?? 1;
        let jump = 1;
        const jumpPosition = randInt(20, 99);
        this.vibratePointTask = Helper.taskConstructor(function () {
            if (count % 100 === jumpPosition && countTo === 0 && Math.random() < config.jumpChance && config.withJumps) {
                countTo = config.jumpSteps;
            }
            if (countTo > 0) {
                jump = config.jumpFactor;
                countTo--;
            } else {
                directionX = Math.random() < 0.5 ? -1 : 1;
                directionY = Math.random() < 0.5 ? -1 : 1;
                jump = 1;
            }
            dx = config.width * directionX * jump;
            dy = config.width * directionY * jump;
            [dx, dy, directionX, directionY] = checkOutOfRange(dx, dy, point.position.x, point.position.y, directionX, directionY);
            point.setOffset(dx, dy);
            point.updateAudio();
            point.draw();
            count++;
            return wait * waitFactor;
        }, wait);
    }

    movePoint(config) {
        if (!config) {
            config = new MovementConfig();
        }
        const wait = 50;
        const point = this.point;
        const checkOutOfRange = this.checkOutOfRange;
        let waitFactor = CanvasConfig.params.movementFactor ?? 1;
        this.movePointTask = Helper.taskConstructor(() => {
            let dirX, dirY;
            if (config.directionX) {
                dirX = config.directionX;
            } else {
                dirX = Math.random() < 0.5 ? -1 : 1;
            }
            if (config.directionY) {
                dirY = config.directionY;
            } else {
                dirY = Math.random() < 0.5 ? -1 : 1;
            }
            let dx = dirX * config.deltaX;
            let dy = dirY * config.deltaY;
            [dx, dy, config.directionX, config.directionY] = checkOutOfRange(dx, dy, point.position.x, point.position.y, config.directionX, config.directionY);
            point.setOffset(dx, dy);
            point.updateAudio();
            point.draw();
            return wait * waitFactor;
        }, wait);
        return this.movePointTask;
    }

    checkOutOfRange(dx, dy, x, y, directionX, directionY) {
        if (x + dx < 0 || x + dx > CanvasConfig.width) {
            dx = -1 * dx + 1; // +1 to give it a kick to not get stuck on that side
            directionX = -1 * directionX;
        }
        if (y + dy < 0 || y + dy > CanvasConfig.height) {
            dy = -1 * dy + 1; // +1 to give it a kick to not get stuck on that side
            directionY = -1 * directionY;
        }
        return [dx, dy, directionX, directionY];
    }

    stopAt(location, movePoint) {
        return new Promise((resolve) => {
            const stopAtTask = Helper.taskConstructor(() => {
                let condition;
                switch (location) {
                    case 'bottom':
                        condition = this.point.position.y > CanvasConfig.height - 35;
                        break;
                    case 'top':
                        condition = this.point.position.y < 35;
                        break;
                    case 'right':
                        condition = this.point.position.x > CanvasConfig.width - 35;
                        break;
                    case 'left':
                        condition = this.point.position.x < 35;
                        break;
                    default:
                        break;
                }
                if (condition) {
                    movePoint.stop();
                    stopAtTask.stop();
                    resolve();
                }
            }, 10);
        });
    }
}
