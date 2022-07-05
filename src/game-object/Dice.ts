export default class Dice extends Phaser.GameObjects.Image   {
    face = 1
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'dices', '1')
    }

    roll() {
        this.face = Phaser.Math.Between(1, 6)
    }
}