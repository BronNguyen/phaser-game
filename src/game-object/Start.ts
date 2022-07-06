import ITeam from "../interface/ITeam"
import TeamKeys from "../const/TeamKeys"
import IShape from "../interface/IShape"

export default class Start extends Phaser.Geom.Rectangle implements ITeam, IShape {
    color!: number
    teamKey = TeamKeys.Red

    constructor() {
        super(0, 0, 100, 100)
    }

    joinTeam(teamKey: TeamKeys): void {
        this.teamKey = teamKey
    }
    getTeamKey(): TeamKeys {
        return this.teamKey
    }

    getColor(): number {
        return this.color
    }

    coloring(graphics: Phaser.GameObjects.Graphics): void {
        graphics.fillStyle(this.color, 0.2)
        graphics.fillRectShape(this)
    }
}