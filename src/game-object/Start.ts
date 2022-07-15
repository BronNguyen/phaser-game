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
            new StartPosition(1, 30, 30),
            new StartPosition(2, 70, 30),
            new StartPosition(3, 30, 70),
            new StartPosition(4, 70, 70)
        ]
    }

    adopt(horse: Horse) {
        for(let i = 0; i < this.startPositions.length; i++) {
            if(!this.startPositions[i].getHorse()) {
                const {x, y} = this.startPositions[i].getPosition()
                this.startPositions[i].setHorse(horse)
                horse.setPosition(this.left + x, this.top + y)
                return
            }
        }
    }

    joinTeam(teamKey: TeamKeys): void {
        this.teamKey = teamKey
        this.color = PlayerColors[teamKey]
    }

    // setHorse(horse: Horse): void {
    //     this.horses.push(horse)
    // }

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