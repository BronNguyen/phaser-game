export default class Dice extends Phaser.GameObjects.Sprite {
    face = 1
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'dices', '1')
        this.initEvents()
    }

    setFace(){
        this.setFrame(`${this.face}.png`)
    }

    roll() {
        this.face = Phaser.Math.Between(1, 6)
    }

    playRollAnimation() {
        this.play('roll')

        this.scene.time.delayedCall(1500 ,this.stopRollAnimation ,[] , this);
    }

    stopRollAnimation() {
        this.roll()
        this.stop()
        this.setFace()
    }

    initEvents() {
        this.scene.events.on('roll-dices', this.playRollAnimation, this)
    }

}