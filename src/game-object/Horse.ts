import PlayerColors from "../const/PlayerColors"
import HorseState from "../const/HorseState"
import IHorse from "../interface/IHorse"
import ITeam from "../interface/ITeam"
import TeamKeys from "../const/TeamKeys"

export default class Horse extends Phaser.GameObjects.Arc implements IHorse, ITeam {
    horseState = HorseState.Dead
    color!: number
    teamKey = TeamKeys.Red
    currentPlace = 0
    index: number = 0

    constructor(scene: Phaser.Scene,index: number, state = HorseState.Dead, team: PlayerColors , x: number, y: number, radius: number, fillColor: number) {
        super(scene, x, y, radius, undefined, undefined, undefined, fillColor, 0.2)
        this.horseState = state
        this.index = index
        scene.add.existing(this)
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

    getTeamKey(): TeamKeys {
        return this.teamKey
    }

    getColor(): number {
        return this.color
    }
}