export class DrawConfig {
    position = {};

    constructor(
        x = 0,
        y = 0,
        color = [255, 255, 255],
        size = 50,
        id,
    ) {
        this.position.x = x;
        this.position.y = y;
        this.color = color;
        this.size = size;
        if (id) {
            this.id = id;
        }
    }
}
