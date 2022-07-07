import TeamKeys from "../const/TeamKeys"
import PlayerState from "../const/PlayerState"
import ITeam from "../interface/ITeam"
import IPlayerBehavior from "../interface/IPlayerBehavior"
import PlayerColors from "../const/PlayerColors"
import Horse from "./Horse"

export default class Player extends Phaser.GameObjects.Image implements IPlayerBehavior ,ITeam {
    private teamKey = TeamKeys.Red
    private actionCount = 0
    private color!: number

    playerState = PlayerState.Waiting
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
        return PlayerState.Waiting
    }

    setPlayerState(state: PlayerState): void {
        this.playerState = state
    }

    getActionCount(): number {
        return this.actionCount
    }

    decreaseActionCount(): void {
        this.actionCount--
    }

    increaseActionCount(quantity: number): void {
        this.actionCount += quantity
    }

    pickHorse(horse: Horse): void {
        horse.isChoosing = true
    }

    playTurn(): void {
        if(this.playerState === PlayerState.StartTurn) {
            this.rollDices()
        }
    }

    rollDices(): void {
        this.playerState = PlayerState.Rolling
    }

    coloring(): void {
        if(!this.color) return

        this.setTintFill(this.color)
    }

    update(): void {
        super.update()
    }
}