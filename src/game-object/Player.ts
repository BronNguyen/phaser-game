import TeamKeys from "../const/TeamKeys"
import PlayerState from "../const/PlayerState"
import ITeam from "../interface/ITeam"
import IPlayer from "../interface/IPlayer"
import PlayerColors from "../const/PlayerColors"

export default class Player extends Phaser.GameObjects.Image implements IPlayer ,ITeam , IRollDice {
    color: number
    teamKey = TeamKeys.Red
    playerState = PlayerState.Init

    constructor(scene: Phaser.Scene, x: number, y: number, teamKey: TeamKeys) {
        super(scene, x, y, 'player')
        this.setScale(0.3)
        const color = PlayerColors[teamKey]
        this.color = color
        this.setTintFill(color)
        scene.add.existing(this)
    }

    getTeamKey(): TeamKeys {
        return this.teamKey
    }

    getColor(): number {
        return this.color

    }

    getPlayerState(): PlayerState {
        return PlayerState.Init
    }

    setPlayerState(state: PlayerState): void {
        this.playerState = state
    }

    roll(diceCount: number): number {
        let stepCount = 0
        for(let i = 0; i < diceCount; i++ ) {
            stepCount += Phaser.Math.Between(1, 6)
        }

        return stepCount
    }

    update(...args: any[]): void {
    }
}