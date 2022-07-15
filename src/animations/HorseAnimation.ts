import Horse from "../game-object/Horse"

const AVAILABLE_HORSE_CONFIG = {
    targets: [],
    y: '-=15',
    ease: 'Sine.easeInOut',
    duration: 300,
    yoyo: true,
    repeat: -1,
    paused: true,
    onStop(_, horses) {
        horses.map(horse => horse.currentPlace.resetHorsePosition())
    }
}

class HorseAnimation {
    scene: Phaser.Scene
    availableHorseTween!: Phaser.Tweens.Tween | undefined
    chosenHorseTween!: Phaser.Tweens.Tween | undefined

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    playAvailableHorseAnimation(horses: Horse[]): void {
        if(this.availableHorseTween) return

        this.availableHorseTween = this.scene.tweens.add({...AVAILABLE_HORSE_CONFIG, targets: horses})
        this.availableHorseTween.play()
    }

    stopAvailableHorseAnimation(): void {
        if(!this.availableHorseTween) return

        this.availableHorseTween.stop()
        this.scene.tweens.remove(this.availableHorseTween)
        this.availableHorseTween = undefined
    }

    playChosenHorseAnimation(horse: Horse): void {
        if(this.chosenHorseTween) return

        this.chosenHorseTween = this.scene.tweens.add({...AVAILABLE_HORSE_CONFIG, targets: horse})
        this.chosenHorseTween.play()
    }

    stopChosenHorseAnimation(): void {
        if(!this.chosenHorseTween) return

        this.chosenHorseTween.stop()
        this.scene.tweens.remove(this.chosenHorseTween)
        this.availableHorseTween = undefined
    }
}

export default HorseAnimation