import ITeam from "../interface/ITeam"
import TeamKeys from "../const/TeamKeys"
import IShape from "../interface/IShape"
import PlayerColors from "../const/PlayerColors"
import ILand from "../interface/ILand"
import Horse from "./Horse"

export default class Start extends Phaser.Geom.Rectangle implements ITeam, IShape, ILand {
    private index = 0
    private color!: number
    private teamKey = TeamKeys.Red
    private horses: Horse [] = []

    constructor(x, y) {
        super(x, y, 100, 100)
    }

    joinTeam(teamKey: TeamKeys): void {
        this.teamKey = teamKey
        this.color = PlayerColors[teamKey]
    }

    getIndex(): number {
        return this.index
    }

    getHorse(): Horse | null {
        const horse = Phaser.Math.RND.pick(this.horses)
        return horse
    }

    setHorse(horse: Horse): void {
        this.horses.push(horse)
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