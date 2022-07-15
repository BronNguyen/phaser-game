import ITeam from "../interface/ITeam"
import TeamKeys from "../const/TeamKeys"
import IShape from "../interface/IShape"
import PlayerColors from "../const/PlayerColors"
import Horse from "./Horse"
import StartPosition from "../const/StartPosition"

export default class Start extends  Phaser.Geom.Rectangle implements ITeam, IShape {
    private color!: number
    private teamKey = TeamKeys.Red
    private startPositions: StartPosition []

    constructor(x, y) {
        super(x, y, 100, 100)
        this.startPositions = [
            new StartPosition(1, this.left + 30, this.top + 30),
            new StartPosition(2, this.left + 70, this.top + 30),
            new StartPosition(3, this.left + 30, this.top + 70),
            new StartPosition(4, this.left + 70, this.top + 70)
        ]
    }

    adopt(horse: Horse) {
        const emptyStart = this.startPositions.find(position => !position.getHorse())
        if(!emptyStart) return
        emptyStart.setHorse(horse)
    }

    joinTeam(teamKey: TeamKeys): void {
        this.teamKey = teamKey
        this.color = PlayerColors[teamKey]
    }

    getPosition(): { x: number; y: number } {
        return {x: this.x, y: this.y}
    }

    getTeamKey(): TeamKeys {
        return this.teamKey
    }

    getColor(): number {
        return this.color
    }

    coloring(graphics: Phaser.GameObjects.Graphics): void {
        graphics.fillStyle(this.color, 0.3)
        graphics.fillRectShape(this)

    }
}