import {Helper} from '../helpers/helper.js';
import {CanvasConfig} from './canvas-config.js';

export class PointMovement {
    point = null;

    constructor(point) {
        this.point = point;
    }

    vibratePoint(amp = 1, withJumps = false) {
        const wait = 50;
        const point = this.point;
        const checkOutOfRange = this.checkOutOfRange;
        let count = 0;
        let directionX = Math.random() < 0.5 ? -1 : 1;
        let directionY = Math.random() < 0.5 ? -1 : 1;
        let dx, dy;
        let waitFactor = 1;
        let jumpFactor = 1;
        const vibratePoint = Helper.taskConstructor(function () {
            if (count%100 <= 95 || !withJumps) {
                directionX = Math.random() < 0.5 ? -1 : 1;
                directionY = Math.random() < 0.5 ? -1 : 1;
                jumpFactor = 1;
            } else {
                jumpFactor = 30;
            }
            dx = amp * directionX * jumpFactor;
            dy = amp * directionY * jumpFactor;
            [dx, dy, directionX, directionY] = checkOutOfRange(dx, dy, point.position.x, point.position.y, directionX, directionY);
            point.setOffset(dx, dy);
            point.updateAudio();
            point.draw();
            count++;
            return wait * waitFactor;
        }, wait);
    }

    movePoint(deltaX, deltaY, directionX, directionY) {
        const wait = 50;
        const point = this.point;
        const checkOutOfRange = this.checkOutOfRange;
        const movePoint = Helper.taskConstructor(() => {
            let dirX, dirY;
            if (directionX) {
                dirX = directionX;
            } else {
                dirX = Math.random() < 0.5 ? -1 : 1;
            }
            if (directionY) {
                dirY = directionY;
            } else {
                dirY = Math.random() < 0.5 ? -1 : 1;
            }
            let dx = dirX * deltaX;
            let dy = dirY * deltaY;
            [dx, dy, directionX, directionY] = checkOutOfRange(dx, dy, point.position.x, point.position.y, directionX, directionY);
            point.setOffset(dx, dy);
            point.updateAudio();
            point.draw();
            return wait;
        }, wait);
        return movePoint;
    }

    checkOutOfRange(dx, dy, x, y, dirX, dirY) {
        if (x + dx < 0 || x + dx > CanvasConfig.width) {
            dx = -1 * dx;
            dirX = -1 * dirX;
        }
        if (y + dy < 0 || y + dy > CanvasConfig.height) {
            dy = -1 * dy;
            dirY = -1 * dirY;
        }
        return [dx, dy, dirX, dirY];
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
