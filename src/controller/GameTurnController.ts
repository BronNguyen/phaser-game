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
    playerOrders: PlayerOrder = {}

    constructor(scene: Battle) {
        this.scene = scene
        this.currentIndex = 1
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
            const turnNumber = index + 1
            this.playerOrders[turnNumber] = player
        })
    }

    getCurrentPlayer(): Player {
        return this.playerOrders[this.currentIndex]
    }

    switchPlayer(): void {
        this.lastIndex = this.currentIndex
        this.currentIndex = Phaser.Math.Wrap(++this.currentIndex, 1 , 4)
        const player = this.getCurrentPlayer()
        // player.setPlayerState(PlayerState.StartTurn)
    }

    processPlayerStartTurn(): boolean {
        const player = this.getCurrentPlayer()
        const actionCount = player?.getActionCount()
        console.log('actionCount: ', actionCount)
        // const isInRollingState = player.playerState === PlayerState.Rolling

        if(player && actionCount > 0) {
            return true
        }

        return false
    }

}