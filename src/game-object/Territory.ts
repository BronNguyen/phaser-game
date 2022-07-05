import ITeam from "../interface/ITeam"
import PlayerColors from "../const/PlayerColors"
import TerritoryState from "../const/TerritoryState"
import TeamKeys from "../const/TeamKeys"

export default class Territory extends Phaser.GameObjects.Arc implements ITeam {
    territoryState!: TerritoryState
    color!: number
    teamKey = TeamKeys.Red
    isInitiator = false
    index: number = 0

    constructor(scene: Phaser.Scene,index: number, team: TeamKeys , x: number, y: number, radius: number) {
        const color = PlayerColors[team]
        super(scene, x, y, radius, undefined, undefined, undefined, color, 0.2)
        this.territoryState = TerritoryState.Free
        this.teamKey = team
        this.color = color
        this.index = index
        scene.add.existing(this)
    }

    getTeamKey(): TeamKeys {
        return this.teamKey
    }

    getColor(): number {
        return this.color
    }
}