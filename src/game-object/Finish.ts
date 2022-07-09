import Territory from "./Territory";

export default class Finish extends Territory {
    finishIndex!: number

    constructor(x: number, y: number, index, finishIndex: number) {
        super(x, y, index)
        this.finishIndex = finishIndex
    }

    public coloring(graphics: Phaser.GameObjects.Graphics): void {
        graphics.fillStyle(this.color, 0.7)
        graphics.fillCircleShape(this)
    }

}