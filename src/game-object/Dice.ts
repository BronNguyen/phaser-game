export default class Dice extends Phaser.GameObjects.Sprite   {
    face = 1
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'dices', '1')
    }

    setFace(){
        this.setFrame(`${this.face}.png`)
    }

    roll() {
        this.face = Phaser.Math.Between(1, 6)
    }
}