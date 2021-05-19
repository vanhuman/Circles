import {CanvasConfig} from './canvas-config.js';
import {Helper} from '../helpers/helper.js';

export class Canvas {
    pointPosition = new Map();

    constructor() {
        this.initCanvas();
    }

    initCanvas() {
        this.canvas = document.getElementById('MovingPointsCanvas');
        this.context = this.canvas.getContext('2d');
        this.setSize();
        this.setBackground();
        this.setAlpha();
        this.listenForWindowSizeChanges();
    }

    registerPosition(point, position) {
        this.pointPosition.set(point, Object.assign({}, position));
    }

    checkForCollisionWithPoint(pointToCheck) {
        let collision = false;
        Array.from(this.pointPosition.keys()).forEach((point) => {
            const distance = Math.sqrt(
                Math.pow(point.position.x - pointToCheck.position.x, 2)
                + Math.pow(point.position.y - pointToCheck.position.y, 2)
            );
            if (point !== pointToCheck && distance < (0.5 * point.size + 0.5 * pointToCheck.size)) {
                collision = true;
            }
        });
        return collision;
    }

    listenForWindowSizeChanges() {
        window.addEventListener('resize', function() {
            setTimeout(function(){ window.location.reload() })
        }, false);
        window.addEventListener('orientationchange', function() {
            window.location.reload();
        }, false);
    }

    setSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        CanvasConfig.width = window.innerWidth;
        CanvasConfig.height = window.innerHeight;
    }

    setBackground(hexColor) {
        if (!hexColor) {
            hexColor = CanvasConfig.params.background ?? null;
        }
        if (hexColor) {
            CanvasConfig.baseColor = Helper.hexToRgb(hexColor);
        } else {
            hexColor = Helper.rgbToHex(CanvasConfig.baseColor);
        }
        const body = document.getElementById('MovingPoints');
        body.style.backgroundColor = '#' + hexColor;
    }

    setAlpha(alphaValue) {
        if (alphaValue) {
            this.context.globalAlpha = alphaValue;
            return;
        }
        const alphaParam = CanvasConfig.params.alpha;
        if (!alphaParam) {
            return;
        }
        if (alphaParam == Number(alphaParam)) {
            this.context.globalAlpha = Number(alphaParam);
        } else {
            let [alphaProcess, alpha, increment, step] = this.getAlphaParameters(alphaParam);
            switch (alphaProcess) {
                case 'fade-in':
                    this.context.globalAlpha = alpha;
                    const alphaFader = Helper.taskConstructor(() => {
                        alpha = alpha + increment;
                        this.context.globalAlpha = alpha;
                        if (alpha > 1) {
                            alphaFader.stop();
                        }
                    }, 1000 * step);
                    break;
                default:
                    //
                    break;
            }
        }
    }

    getAlphaParameters(alphaParam) {
        let alphaProcess;
        let alpha;
        let increment;
        let step; // in seconds
        let alphaParamArray = alphaParam.split(',');
        if (alphaParamArray.length >= 4) {
            [alphaProcess, alpha, increment, step] = alphaParamArray;
        } else {
            alphaProcess = alphaParam;
        }
        alpha = alpha == Number(alpha) && Number(alpha) > 0 && Number(alpha) <= 1 ? Number(alpha) : 0.005;
        increment = increment == Number(increment) && Number(increment) > 0 && Number(increment) <= 1 ? Number(increment) : 0.005;
        step = step == Number(step) && Number(step) > 0 && Number(step) <= 10 ? Number(step) : 0.1;
        return [alphaProcess, alpha, increment, step];
    }
}
