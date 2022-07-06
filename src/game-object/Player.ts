import TeamKeys from "../const/TeamKeys"
import PlayerState from "../const/PlayerState"
import ITeam from "../interface/ITeam"
import IPlayerBehavior from "../interface/IPlayer"
import PlayerColors from "../const/PlayerColors"
import Horse from "./Horse"

export default class Player extends Phaser.GameObjects.Image implements IPlayerBehavior ,ITeam , IRollDice {
    color!: number
    teamKey = TeamKeys.Red
    playerState = PlayerState.Init
    diceCount = 2

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player')
        this.setScale(0.3)
        // scene.add.existing(this)
    }

    getTeamKey(): TeamKeys {
        return this.teamKey
    }

    getColor(): number {
        return this.color

    }

    joinTeam(teamKey: TeamKeys): void {
        this.teamKey = teamKey
        this.color = PlayerColors[teamKey]
        this.setTint(this.color)
    }

    getPlayerState(): PlayerState {
        return PlayerState.Init
    }

    setPlayerState(state: PlayerState): void {
        this.playerState = state
    }

    pickHorse(horse: Horse): void {
        horse.isChoosing = true
    }

    rollDices(): number {
        let stepCount = 0
        for(let i = 0; i < this.diceCount; i++ ) {
            stepCount += Phaser.Math.Between(1, 6)
        }

        return stepCount
    }

    coloring(): void {
        if(!this.color) return

        this.setTintFill(this.color)
    }

    update(...args: any[]): void {
    }
}