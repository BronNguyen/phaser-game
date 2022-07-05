import ITeam from "../interface/ITeam"
import PlayerColors from "../const/PlayerColors"
import TerritoryState from "../const/TerritoryState"
import TeamKeys from "../const/TeamKeys"

export default class Territory extends Phaser.Geom.Circle implements ITeam {
    territoryState!: TerritoryState
    color!: number
    teamKey = TeamKeys.Red
    isInitiator = false
    index: number = 0

    constructor() {
        super(0, 0, 30)
        this.territoryState = TerritoryState.Free
        this.index = 0
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
    }
}
