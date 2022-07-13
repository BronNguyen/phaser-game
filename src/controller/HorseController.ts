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

        teamHorses.map(()=> {
            const horse = horseGroup.get()
            horse.joinTeam(teamKey)
            this.horses.push(horse)
            teamStart.adopt(horse)
        })

    }

    setAvailableHorses(horses: Horse[]): void {
        horses.map(horse=> horse.isAvailable = true)
    }

    getTeamAvailableHorses(teamKey: TeamKeys): Horse [] {
        const teamHorses = this.getTeamHorses(teamKey)
        const availableHorses = teamHorses.filter(horse=> horse.isAvailable)
        return availableHorses
    }

    resetAvailableHorse(): void {
        this.horses.map(horse=> {
            horse.isAvailable = false
            horse.setPotentialDestination(undefined)
        })
    }

    resetChosenHorse(): void {
        this.horses.map(horse=> horse.isChoosing = false)
    }

    getChosenHorse(teamKey: TeamKeys): Horse | undefined {
        const teamHorses = this.getTeamAvailableHorses(teamKey)
        const chosenHorse = teamHorses.find(horse=> horse.isChoosing)
        return chosenHorse
    }

    getTeamHorses(teamKey: TeamKeys): Horse[] {
        const teamHorses = this.horses.filter(horse => horse.getTeamKey() === teamKey)
        return teamHorses
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

    setHorseToStart(horse?: Horse) {
        if(!horse) return

        
    }
}