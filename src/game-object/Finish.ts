import Territory from "./Territory";

export default class Finish extends Territory {
    private finishIndex!: number

    constructor(x: number, y: number, index, finishIndex: number) {
        super(x, y, index)
        this.finishIndex = finishIndex
    }

    getFinishIndex() :number {
        return this.finishIndex
    }

    public coloring(graphics: Phaser.GameObjects.Graphics, scene: Phaser.Scene): void {
        graphics.fillStyle(this.color, 0.7)
        graphics.fillCircleShape(this)
        //@ts-ignore
        scene.add.text(this.x - 20, this.y - 20, `${this.index}`, {color: 'black', fontSize: 30})
    }

}