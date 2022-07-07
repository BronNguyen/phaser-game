import PlayerState from "../const/PlayerState";
import Battle from "../scenes/Battle";
import Player from "./Player";

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

    addActionCount(player: Player, quantity = 1) {
        player.increaseActionCount(quantity)
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
        player.setPlayerState(PlayerState.StartTurn)
    }

    processPlayerRollingDice(): boolean {
        const player = this.getCurrentPlayer()
        const actionCount = player?.getActionCount()
        const isInRollingState = player.playerState === PlayerState.Rolling

        if(player && isInRollingState && actionCount > 0) {
            return true
        }

        return false
    }

}