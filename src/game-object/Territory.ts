import ITeam from "../interface/ITeam"
import PlayerColors from "../const/PlayerColors"
import TerritoryState from "../const/TerritoryState"
import TeamKeys from "../const/TeamKeys"
import ILand from "../interface/ILand"
import Horse from "./Horse"
import IShape from "../interface/IShape"

export default class Territory extends Phaser.Geom.Circle implements ITeam, ILand, IShape {
    territoryState!: TerritoryState
    color!: number
    teamKey = TeamKeys.Red
    isInitiator = false
    horse!: Horse
    index: number = 0

    constructor(x, y) {
        super(x, y, 30)
        this.territoryState = TerritoryState.Free
    }

    public getTeamKey(): TeamKeys {
        return this.teamKey
    }

    public getColor(): number {
        return this.color
    }

    public joinTeam(teamKey: TeamKeys): void {
        this.teamKey = teamKey
        this.color = PlayerColors[teamKey]
    }

    public setHorse(horse: Horse): void {
        this.horse = horse
    }

    public getHorse(): Horse | null {
        if(!this.horse) return null

        return this.horse
    }

    public getIndex(): number {
        return this.index
    }

    public coloring(graphics: Phaser.GameObjects.Graphics): void {
        graphics.fillStyle(this.color, 0.2)
        graphics.fillCircleShape(this)
    }
}
