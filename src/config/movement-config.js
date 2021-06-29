export class MovementConfig {
    constructor(
        deltaX = 5,
        deltaY = 5,
        directionX = 1,
        directionY = 1
    ) {
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.directionX = directionX;
        this.directionY = directionY;
    }
}
