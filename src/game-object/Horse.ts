import PlayerColors from "../const/PlayerColors"
import HorseState from "../const/HorseState"
import IHorse from "../interface/IHorse"
import ITeam from "../interface/ITeam"
import TeamKeys from "../const/TeamKeys"
import ILand from "interface/ILand"

const { GAMEOBJECT_POINTER_UP } = Phaser.Input.Events

export default class Horse extends Phaser.GameObjects.Image implements IHorse, ITeam {
    isChoosing = false
    isAvailable = false
    private color!: number
    private teamKey = TeamKeys.Red
    private distance = 0
    horseState: HorseState
    currentPlace!: ILand
    horsePath!: ILand []| undefined

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, 'horse')
        this.horseState = HorseState.Homeless
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

    public getHorsePath(): ILand []| undefined {
        return this.horsePath
    }

    public setHorsePath(lands: ILand [] | undefined): void {
        this.horsePath = lands
    }

    public moveTo(land: ILand): void {
        if(!this.isChoosing) return

        this.currentPlace.setHorse(undefined)
        this.horseState = HorseState.Moving
        const kickedHorse = land.getHorse()
        kickedHorse?.beHomeless()
        land.setHorse(this)
        this.horseState = HorseState.Alive
        this.isChoosing = false
    }

    public moveOnPath(lands: ILand [], completeCallback: Function): void {
        const tweenArray = [] as any

        lands.forEach(land => {
            const {x, y} = land.getPosition()
            tweenArray.push(
            {
                x,
                y,
                targets: this,
                ease: 'cubic.in',
                duration: 200
            })
        })

        this.scene.tweens.timeline({
            tweens: tweenArray,
            onComplete:() => {
                this.moveTo(lands[lands.length-1])
                completeCallback()
            }
        })
    }

    public beHomeless(): void {
        this.horseState = HorseState.Homeless
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