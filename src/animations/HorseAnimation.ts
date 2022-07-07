import Horse from "../game-object/Horse"

const AVAILABLE_HORSE_CONFIG = {
    targets: [],
    y: '-=15',
    ease: 'Sine.easeInOut',
    duration: 300,
    yoyo: true,
    repeat: -1,
    paused: true
}

class HorseAnimation {
    scene: Phaser.Scene
    availableHorseTween!: Phaser.Tweens.Tween
    chosenHorseTween!: Phaser.Tweens.Tween

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    playAvailableHorseAnimation(horse: Horse[]): void {
        if(this.availableHorseTween) return

        this.availableHorseTween = this.scene.tweens.add({...AVAILABLE_HORSE_CONFIG, targets: horse})
        this.availableHorseTween.play()
    }

    stopAvailableHorseAnimation(): void {
        this.availableHorseTween.stop()
        this.scene.tweens.remove(this.availableHorseTween)
    }

    playChosenHorseAnimation(horse: Horse): void {
        if(this.chosenHorseTween) return

        this.chosenHorseTween = this.scene.tweens.add({...AVAILABLE_HORSE_CONFIG, targets: horse})
    }

}

export default HorseAnimation