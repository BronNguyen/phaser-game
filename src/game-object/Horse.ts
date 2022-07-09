import PlayerColors from "../const/PlayerColors"
import HorseState from "../const/HorseState"
import IHorse from "../interface/IHorse"
import ITeam from "../interface/ITeam"
import TeamKeys from "../const/TeamKeys"
import ILand from "interface/ILand"
import Finish from "./Finish"

const { GAMEOBJECT_POINTER_UP } = Phaser.Input.Events

export default class Horse extends Phaser.GameObjects.Image implements IHorse, ITeam {
    isChoosing = false
    isAvailable = false
    private color!: number
    private teamKey = TeamKeys.Red
    private distance = 0
    horseState = HorseState.Dead
    currentPlace!: ILand
    // index: number = 0

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, 'horse')
        this.horseState = HorseState.Dead
        // this.index = 0
        this.setInteractive()
        scene.add.existing(this)
        this.initClickEvent()
    }

    public joinTeam(teamKey: TeamKeys): void {
        this.teamKey = teamKey
        this.color = PlayerColors[teamKey]
        this.coloring()
        this.horseState = HorseState.Dead
    }

    public initClickEvent() {
        this.on(GAMEOBJECT_POINTER_UP, this.setChoosing)
    }

    private setChoosing() {
        this.isChoosing = true
    }

    public setHorseState(state: HorseState): void {
        this.horseState = state
    }

    public getHorseState(): HorseState {
        return this.horseState
    }

    public spawn(): void {
        this.horseState = HorseState.Alive
    }

    public setRaceDistance(number: number): void {
        this.distance += number
    }

    public getRaceDistance(): number {
        return this.distance
    }

    public getAvailableDestination(number: number): {index: number ,isFinish : boolean} | undefined {
        if(!(this.currentPlace instanceof Finish)) {
            const distance = number + this.distance
            const index = this.currentPlace.getIndex()

            if(distance > 55) {
                const finishOffset = distance - 55
                return finishOffset < 7 ? {index: finishOffset, isFinish: true} : undefined
            }

            return {index: index + number, isFinish: false}
        }

        const finishIndex =  this.currentPlace.finishIndex

        return {index: finishIndex + 1, isFinish: true}
    }

    public moveTo(land: ILand): void {
        console.log('land: ', land)
        if(!this.isChoosing) return

        this.horseState = HorseState.Moving
        this.currentPlace = land
        land.setHorse(this)
        const {x, y} = this.currentPlace.getPosition()
        this.setPosition(x, y)
        this.horseState = HorseState.Alive
        this.isChoosing = false
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