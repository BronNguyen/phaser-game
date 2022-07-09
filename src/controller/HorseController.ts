import HorseControllerState from "../const/HorseControllerState"
import Start from "../game-object/Start"
import TeamKeys from "../const/TeamKeys"
import Horse from "../game-object/Horse"
import HorseState from "../const/HorseState"
import RollResult, { DiceResult } from "../const/DiceResult"

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

    setAvailableHorses(horses: Horse[]): void {
        horses.map(horse=> horse.isAvailable = true)
    }

    getTeamAvailableHorses(teamKey: TeamKeys): Horse [] {
        const teamHorses = this.getTeamHorses(teamKey)
        const availableHorses = teamHorses.filter(horse=> horse.isAvailable)
        return availableHorses
    }

    setAvailableHorseFromRollResult(teamKey: TeamKeys, rollResult: RollResult, inititatorHorse: Horse | undefined): Horse[] {
        const {diceResult, number} = rollResult
        let availableHorses: Horse[] = []
        if(diceResult === DiceResult.Double) {
            const horses = this.getTeamHorses(teamKey)
            const isTeamHorseAtStart = inititatorHorse?.getTeamKey() === teamKey
            //can not kick our team horse
            if(isTeamHorseAtStart) {
                const aliveHorses = this.getTeamAliveHorses(teamKey)
                availableHorses = aliveHorses.filter(horse => {
                    return horse.getAvailableDestination(number)
                })
            }

            //todo do this now


            // availableHorses =
        }

        if (diceResult === DiceResult.OneSix) {

        }
        return []
    }

    resetAvailableHorse(): void {
        this.horses.map(horse=> horse.isAvailable = false)
    }

    resetChosenHorse(): void {
        this.horses.map(horse=> horse.isChoosing = false)
    }

    getChosenHorse(teamKey: TeamKeys): Horse | undefined {
        const teamHorses = this.getTeamHorses(teamKey)
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
}