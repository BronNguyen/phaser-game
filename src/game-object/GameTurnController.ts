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

    setPlayerOrder(playerOrder: Player []) {
        playerOrder.forEach((player, index)=> {
            const turnNumber = index + 1
            this.playerOrders[turnNumber] = player
        })
    }

    getCurrentPlayer() {
        return this.playerOrders[this.currentIndex]
    }

    switchPlayer() {
        this.lastIndex = this.currentIndex
        this.currentIndex = Phaser.Math.Wrap(++this.currentIndex, 1 , 4)
    }

}