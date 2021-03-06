import ITeam from "../interface/ITeam"
import PlayerColors from "../const/PlayerColors"
import TerritoryState from "../const/TerritoryState"
import TeamKeys from "../const/TeamKeys"
import ILand from "../interface/ILand"
import Horse from "./Horse"
import IShape from "../interface/IShape"

export default class Territory extends Phaser.Geom.Circle implements ITeam, ILand, IShape {
    territoryState!: TerritoryState
    protected color!: number
    private teamKey = TeamKeys.Red
    isInitiator = false
    isFinishGate = false
    horse!: Horse | undefined
    index: number = 0

    constructor(x: number, y: number, index: number) {
        super(x, y, 30)
        this.territoryState = TerritoryState.Free
        this.index = index
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

    public setHorse(comingHorse: Horse | undefined): void {
        //allow set undefined to land (no horse occupies this land)
        this.horse = comingHorse

        if(!this.isHorse(comingHorse)) return

        comingHorse.currentPlace = this
        this.resetHorsePosition()
    }

    private isHorse(horse: Horse | undefined): horse is Horse {
        return horse instanceof Horse
    }

    public resetHorsePosition(): void {
        const {x, y} = this
        this.horse?.setPosition(x, y)
    }

    public getHorse(): Horse | undefined {
        return this.horse
    }

    public getPosition(): { x: number; y: number; } {
        const x = this.x
        const y = this.y
        return {x, y}
    }

    public getIndex(): number {
        return this.index
    }

    public coloring(graphics: Phaser.GameObjects.Graphics, scene: Phaser.Scene): void {
        graphics.fillStyle(this.color, 0.3)
        graphics.fillCircleShape(this)
        //@ts-ignore
        scene.add.text(this.x - 20, this.y - 20, `${this.index}`, {color: 'black', fontSize: 30})
    }
}
