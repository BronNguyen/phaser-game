import PlayerColors from "../const/PlayerColors"
import HorseState from "../const/HorseState"
import IHorse from "../interface/IHorse"
import ITeam from "../interface/ITeam"
import TeamKeys from "../const/TeamKeys"

export default class Horse extends Phaser.GameObjects.Image implements IHorse, ITeam {
    horseState = HorseState.Dead
    color!: number
    teamKey = TeamKeys.Red
    currentPlace = 0
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
    }

    public setHorseState(state: HorseState): void {
        this.horseState = state
    }

    public getHorseState(): HorseState {
        return this.horseState
    }

    public move(count: number): void {
        if(this.horseState === HorseState.Moving) {
            this.currentPlace += count
        }
    }

    public die(): void {
        this.currentPlace = 0
        this.horseState = HorseState.Dead
    }

    public getTeamKey(): TeamKeys {
        return this.teamKey
    }

    public getColor(): number {
        return this.color
    }
}