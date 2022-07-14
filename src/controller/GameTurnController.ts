import PlayerState from "../const/PlayerState";
import Battle from "../scenes/Battle";
import Player from "../game-object/Player";

type PlayerOrder = {
    [index: number]: Player;
}

export default class GameTurnController {
    scene: Battle
    currentIndex = 0
    lastIndex = 0
    arrow: Phaser.GameObjects.Image
    playerOrders: PlayerOrder = {}

    constructor(scene: Battle) {
        this.scene = scene
        this.arrow = this.scene.add.image(0, 0, 'arrow')
    }

    resetAllPlayersState(): void {
        for (let key in this.playerOrders) {
            this.playerOrders[key].playerState = PlayerState.Waiting
        }
    }

    addActionCount(quantity = 1) {
        const player = this.getCurrentPlayer()
        player.increaseActionCount(quantity)
    }

    decreaseActionCount() {
        const player = this.getCurrentPlayer()
        player.decreaseActionCount()
    }

    setPlayerOrder(playerOrder: Player []) {
        playerOrder.forEach((player, index)=> {
            this.playerOrders[index] = player
        })
    }

    getCurrentPlayer(): Player {
        return this.playerOrders[this.currentIndex]
    }

    switchPlayer(): void {
        this.lastIndex = this.currentIndex
        this.currentIndex = Phaser.Math.Wrap(++this.currentIndex, 0 , 4)
        const player = this.getCurrentPlayer()
        this.arrow.setPosition(player.x, 370)
    }

    processPlayerStartTurn(): boolean {
        const player = this.getCurrentPlayer()
        const actionCount = player?.getActionCount()

        if(player && actionCount > 0) {
            return true
        }

        return false
    }

}