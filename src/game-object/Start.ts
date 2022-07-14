import ITeam from "../interface/ITeam"
import TeamKeys from "../const/TeamKeys"
import IShape from "../interface/IShape"
import PlayerColors from "../const/PlayerColors"
import Horse from "./Horse"
import StartPosition from "../const/StartPosition"

export default class Start extends  Phaser.Geom.Rectangle implements ITeam, IShape {
    private color!: number
    private teamKey = TeamKeys.Red
    private horses: Horse [] = []
    private positions: StartPosition []

    constructor(x, y) {
        super(x, y, 100, 100)
        this.positions =
        [{
            index: 1,
            x: 30,
            y: 30,
            horse: null,
        },
        {
            index: 2,
            x: 70,
            y: 30,
            horse: null,
        },
        {
            index: 3,
            x: 30,
            y: 70,
            horse: null,
        },
        {
            index: 4,
            x: 70,
            y: 70,
            horse: null,
        }]
    }

    adopt(horse: Horse) {
        console.log('adopt: ')
        for(let i = 0; i < this.positions.length; i++) {
            if(!this.positions[i].horse) {
                this.positions[i].horse = horse
                const {x, y} = this.positions[i]
                horse.setPosition(this.left + x, this.top + y)
                return
            }
        }
    }

    joinTeam(teamKey: TeamKeys): void {
        this.teamKey = teamKey
        this.color = PlayerColors[teamKey]
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