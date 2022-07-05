import State from "../const/PlayerState"
import ITeam from "../interface/ITeam"

export default class Player extends Phaser.GameObjects.Image implements ITeam {
    team!: ITeam

    constructor(scene: Phaser.Scene, x: number, y: number, color: number) {
        super(scene, x, y, 'player')
        this.setScale(0.3)
        this.setTintFill(color)
        // scene.add.existing(this)
    }

    initTeam(): void {

    }

    getTeamNumber(): number {
        return 1
    }

    getColor(): number {
        return 1

    }

    getState(): State {
        return State.Dicing
    }

    update(...args: any[]): void {
    }
}