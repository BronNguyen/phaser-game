import PlayerColors from "../const/PlayerColors"
import HorseState from "../const/HorseState"
import IHorse from "../interface/IHorse"
import ITeam from "../interface/ITeam"
import TeamKeys from "../const/TeamKeys"
import Territory from "./Territory"
import ILand from "interface/ILand"

export default class Horse extends Phaser.GameObjects.Image implements IHorse, ITeam {
    isChoosing = false
    color!: number
    teamKey = TeamKeys.Red
    horseState = HorseState.Dead
    currentPlace!: ILand
    index: number = 0

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, 'horse')
        this.horseState = HorseState.Dead
        this.index = 0
        scene.add.existing(this)
    }

    public joinTeam(teamKey: TeamKeys): void {
        this.teamKey = teamKey
        this.color = PlayerColors[teamKey]
        this.coloring()
        this.horseState = HorseState.Dead
    }

    public setHorseState(state: HorseState): void {
        this.horseState = state
    }

    public getHorseState(): HorseState {
        return this.horseState
    }

    public moveTo(land: ILand): void {
        if(this.horseState === HorseState.Moving) {
            this.currentPlace = land
        }
    }

    public die(): void {
        this.horseState = HorseState.Dead
    }

    public getTeamKey(): TeamKeys {
        return this.teamKey
    }

    public getColor(): number {
        return this.color
    }

    public coloring(): void {
        this.setTint(this.color)
    }
}