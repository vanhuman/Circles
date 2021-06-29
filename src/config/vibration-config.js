export class VibrationConfig {
    constructor(
        width = 2, // random position change in pixels
        withJumps = false, // when true then the point will incidentally jump to another position
        jumpFactor = 300, // the size of the jump in pixels
        jumpSteps = 2, // the number of steps to take for a jump
        jumpChance = 0.5 // the chance the point will jump for every 100 vibrations
    ) {
        this.width = width;
        this.withJumps = withJumps;
        this.jumpFactor = jumpFactor;
        this.jumpSteps = jumpSteps;
        this.jumpChance = jumpChance;
    }
}
