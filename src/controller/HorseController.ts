import HorseControllerState from "../const/HorseControllerState"
import Start from "../game-object/Start"
import TeamKeys from "../const/TeamKeys"
import Horse from "../game-object/Horse"
import HorseState from "../const/HorseState"

export default class HorseController {
    scene: Phaser.Scene
    horseControllerState = HorseControllerState.MoveAble
    horses: Horse []

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.horses = []
    }

    initTeamHorse(teamKey: TeamKeys, teamStart: Start): void {
        const horseGroup = this.scene.add.group({classType: Horse})
        const teamHorses = Array(4).fill(undefined)

        teamHorses.map((_, index)=> {
            const horse = horseGroup.get()
            horse.joinTeam(teamKey)
            horse.setPosition(40 * (index % 2) + 30 + teamStart.left,40 * (index % 2) + 30 + teamStart.top)
            this.horses.push(horse)
        })
    }

    setSpawnAble() {
        this.horseControllerState = HorseControllerState.SpawnAble
    }

    setMoveAble() {
        this.horseControllerState = HorseControllerState.MoveAble
    }

    getTeamDeadHorses(teamKey: TeamKeys): Horse[] {
        const teamHorses = this.horses.filter(horse => horse.getTeamKey() === teamKey)
        const deadHorses = teamHorses.filter(horse => horse.horseState === HorseState.Dead)

        return deadHorses
    }

    getTeamAliveHorses(teamKey: TeamKeys): Horse[] {
        const teamHorses = this.horses.filter(horse => horse.getTeamKey() === teamKey)
        const aliveHorses = teamHorses.filter(horse => horse.horseState === HorseState.Alive)

        return aliveHorses
    }
}