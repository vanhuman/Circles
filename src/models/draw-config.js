export class DrawConfig {
    position = {
        x: 0,
        y: 0,
    }
    color = [255, 255, 255];
    size = 50;
    shape = 'circle';

    constructor(x, y, color, size, shape) {
        this.position.x = x;
        this.position.y = y;
        this.color = color;
        if (size) {
            this.size = size;
        }
        if (shape) {
            this.shape = shape;
        }
    }
}
