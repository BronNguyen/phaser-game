class DiceAnimation {
    scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    createRollDiceAnimation() {
        this.scene.anims.create({
            key: 'roll',
            frames: this.scene.anims.generateFrameNames('dices'),
            frameRate: 3,
            repeat: -1
        });
    }

}

export default DiceAnimation