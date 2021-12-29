import { CanvasConfig } from './canvas-config.js';
import { Helper } from '../helpers/helper.js';

export class Canvas {
    pointPosition = new Map();
    listeningForWindowSize = false;
    statusList = [];
    resizeFunction = function () {
        setTimeout(() => window.location.reload());
    };
    orientationChangeFunction = function () {
        window.location.reload();
    };

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
        this.listenForKeys();
    }

    setDrawing(drawing) {
        this.drawing = drawing;
    }

    registerPointPosition(point, position) {
        this.pointPosition.set(point, Object.assign({}, position));
    }

    deRegisterPoint(point) {
        if (this.pointPosition.has(point)) {
            this.pointPosition.delete(point);
        }
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
        if (!this.listeningForWindowSize) {
            window.addEventListener('resize', this.resizeFunction);
            window.addEventListener('orientationchange', this.orientationChangeFunction);
        } else {
            window.removeEventListener('resize', this.resizeFunction);
            window.removeEventListener('orientationchange', this.orientationChangeFunction);
        }
        this.listeningForWindowSize = !this.listeningForWindowSize;
    }

    listenForKeys() {
        let self = this;
        window.addEventListener('keyup', function (event) {
            if (event.key === 'n') {
                self.setStatus('Requesting next scenario...');
                const stopPromises = Array.from(self.pointPosition.keys()).map(point => point.stop());
                Promise.all(stopPromises).then(() => self.drawing.runRandomScenario(true));
            }
            if (event.key === 's') {
                self.listenForWindowSizeChanges();
                self.setStatus('Window size listener is ' + (self.listeningForWindowSize ? 'ON' : 'OFF'));
            }
            if (event.key === 'q') {
                self.setStatus('Stopping...');
                const stopPromises = Array.from(self.pointPosition.keys()).map(point => point.stop());
                Promise.all(stopPromises);
            }
            if (event.key === 'p') {
                if (self.pointPosition.size !== 0) {
                    self.setStatus('Already playing...');
                } else {
                    self.setStatus('Starting...');
                    self.drawing.runRandomScenario(true);
                }
            }
        });
    }

    setStatus(status = 'status') {
        if (status) {
            clearInterval(this.statusTimeout);
            this.statusList.push(status);
            if (this.statusList.length > 3) {
                this.statusList.shift();
            }
            const statusBar = window.document.getElementById('status');
            statusBar.style.display = 'block';
            statusBar.innerHTML = this.statusList.map((status, index) => index === this.statusList.length - 1 ? '> ' + status : status).join('<br />');
            this.statusTimeout = setTimeout(() => {
                statusBar.style.display = 'none';
                this.statusList = [];
            }, 10000);
        }
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
        this.context.fillStyle = "rgb(" + CanvasConfig.baseColor[0] + "," + CanvasConfig.baseColor[1] + "," + CanvasConfig.baseColor[2] + ")";
        this.context.fillRect(0, 0, CanvasConfig.width, CanvasConfig.height);
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
        if (isNumber(alphaParam)) {
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
                            console.log('alpha value reached:', alpha.toFixed(2));
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
        alpha = isNumber(alpha) && Number(alpha) > 0 && Number(alpha) <= 1 ? Number(alpha) : 0.005;
        increment = isNumber(increment) && Number(increment) > 0 && Number(increment) <= 1 ? Number(increment) : 0.005;
        step = isNumber(step) && Number(step) > 0 && Number(step) <= 10 ? Number(step) : 0.1;
        return [alphaProcess, alpha, increment, step];
    }
}
