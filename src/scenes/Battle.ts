import Phaser from "phaser"
import PluginName from "../const/Plugins";
import SceneKeys from "../const/SceneKeys"
import TeamKeys from "../const/TeamKeys";
import GameState from "../const/GameState";
import HorseState from "../const/HorseState";
import RollResult, { DiceResult } from "../const/DiceResult";

import PlayerPlugin from "../factories/PlayerFactory";

import Player from "../game-object/Player";
import Territory from "../game-object/Territory";
import Horse from "../game-object/Horse";
import Finish from "../game-object/Finish";
import Dice from "../game-object/Dice";

import { shuffle, clone } from 'lodash'

import GameTurnController from "../controller/GameTurnController";
import DiceController from "../controller/DiceController";
import HorseController from "../controller/HorseController";
import LandController from "../controller/LandController";
import CameraController from "../controller/CameraController";

import DiceAnimation from "../animations/DiceAnimations";

import HorseAnimation from "../animations/HorseAnimation";

export default class Battle extends Phaser.Scene {
    playerGroup!: Phaser.GameObjects.Group
    graphics!: Phaser.GameObjects.Graphics
    gameTurnController!: GameTurnController
    diceController!: DiceController
    horseController!: HorseController
    landController!: LandController
    cameraController!: CameraController
    horseAnimationManager!: HorseAnimation
    gameState = GameState.Start
    horses: Horse[] = []
    dices!: Dice []
    diceRectangle!: Phaser.GameObjects.Rectangle
    currentPlayer!: Player

    count = 0

    constructor() {
        super(SceneKeys.Battle)
    }

    preload(){
        this.load.scenePlugin({
            key: PluginName.PlayerPlugin,
            url: PlayerPlugin,
            sceneKey: SceneKeys.Battle
        });
    }

    create() {
        this.playerGroup = this.make.group({
            classType: Player,
            runChildUpdate: true,
        })
        this.graphics = this.add.graphics()
        this.initiateAnimations()
        this.initiateControllers()
        this.initiateTeams()
    }

    initiateControllers() {
        const emitter = new Phaser.Events.EventEmitter()

        this.diceController = new DiceController(this)
        this.horseController = new HorseController(this)
        this.gameTurnController = new GameTurnController(this)
        this.landController = new LandController(this)
        this.cameraController = new CameraController(this)
    }

    initiateAnimations() {
        const diceAnimationManager = new DiceAnimation(this)
        this.horseAnimationManager = new HorseAnimation(this)
    }

    initiateTeams() {
        const teamKeys = Object.keys(TeamKeys);
        teamKeys.forEach((teamKey, index) => {
            this.createTeam(TeamKeys[teamKey], index)
        });
    }

    createTeam(teamKey: TeamKeys, teamIndex: number) {
        const player = this.playerGroup.create()
        player.setActive(false)
        player.setVisible(false)
        player.joinTeam(teamKey)

        const teamStart = this.landController.createStart(teamIndex)
        teamStart.joinTeam(teamKey)
        teamStart.coloring(this.graphics)

        this.horseController.initTeamHorse(teamKey, teamStart)
        this.landController.setTeamTerritories(teamKey, this.graphics)
        this.landController.setTeamFinish(teamKey, this.graphics)
    }

    startGame() {
        this.gameState = GameState.SwitchPlayer
        const players = this.playerGroup.getChildren()
        const sortedPlayers = shuffle(players)
        this.gameTurnController.setPlayerOrder(sortedPlayers)
    }

    startPlayerTurn = () => {
        this.horseController.resetAvailableHorse()
        this.horseController.resetChosenHorse()
        const deadHorses = this.horseController.getDeadHorses()
        this.landController.adoptDeadHorses(deadHorses)
        this.gameState = GameState.StartPlayerTurn
    }


    update(time, delta) {
        this.count++

        const currentPlayer = this.gameTurnController.getCurrentPlayer()
        const currentTeam = currentPlayer?.getTeamKey()
        if(this.count > 100){
            this.count = 0
        }

        if(this.gameState === GameState.Start) {
            this.startGame()
        }

        if(this.gameState === GameState.SwitchPlayer) {
            if(this.currentPlayer) {
                this.gameTurnController.switchPlayer()
            }

            this.currentPlayer = this.gameTurnController.getCurrentPlayer()
            this.gameTurnController.addActionCount()
            this.gameState = GameState.StartPlayerTurn
        }

        if(this.gameState === GameState.StartPlayerTurn) {
            const isStartAvailable = this.gameTurnController.processPlayerStartTurn()

            if(isStartAvailable) {
                this.diceController.setDiceReady()
                this.gameTurnController.decreaseActionCount()
                this.gameState = GameState.PlayerTurn
                return
            }

            this.gameState = GameState.EndPlayerTurn
        }

        const rollResult = this.diceController.getRollResult() as RollResult

        if(this.gameState === GameState.PlayerTurn) {
            if(rollResult) {
                this.gameState = GameState.AfterRollDice
            }
        }

        if(this.gameState === GameState.AfterRollDice) {
            if(!rollResult) return

            const { diceResult, number } = rollResult

            const teamHorses = this.horseController.getTeamHorses(currentTeam)
            const teamInitiator = this.landController.getInitiator(currentTeam)
            const guardHorse = teamInitiator.getHorse()
            const isGuardHorseTeamHorse = guardHorse && guardHorse.getTeamKey() === currentTeam

            //process with number
            teamHorses.forEach((horse: Horse) => {
                if(horse.horseState === HorseState.Dead) {
                    if(isGuardHorseTeamHorse) {
                        return
                    }

                    horse.isAvailable = true
                    return
                }

                if(horse.horseState === HorseState.Alive) {
                    const currentTerritory = horse.currentPlace

                    if(currentTerritory instanceof Finish) {
                        const finishIndex = currentTerritory.getFinishIndex()

                        if(number !== finishIndex + 1 && diceResult !== DiceResult.Double) return

                        const potentialFinish = this.landController.getFinishTerritory(finishIndex + 1, currentTeam)

                        if(!potentialFinish) return

                        horse.isAvailable = true
                        horse.setHorsePath([potentialFinish])
                    }

                    //todo: can move with double / 2 number
                    if(!(currentTerritory instanceof Territory) || currentTerritory instanceof Finish) return

                    const territories = this.landController.fetchTerritories(currentTeam, currentTerritory, number)
                    if(!territories.length) return

                    const cloneTerritories = clone(territories)
                    const lastTerritory = cloneTerritories.pop() as Territory

                    const hasHorseConfront = cloneTerritories.find((ter)=> !!ter.getHorse())
                    if(hasHorseConfront) return

                    const destinationHorse = lastTerritory.getHorse()

                    if(destinationHorse && destinationHorse.getTeamKey() === currentTeam) return

                    horse.setHorsePath(territories)
                    horse.isAvailable = true
                }
            })

            const processedHorses = this.horseController.getTeamAvailableHorses(currentTeam)
            let availableHorses = clone(processedHorses)
            //process with dice result
            if(diceResult === DiceResult.Double) {
                this.gameTurnController.addActionCount()

            }

            if(diceResult === DiceResult.OneSix) {
                this.gameTurnController.addActionCount()
            }

            if(diceResult === DiceResult.Regular) {
                availableHorses = processedHorses.filter((horse) => horse.horseState === HorseState.Alive)
            }

            if(availableHorses.length) {
                this.horseAnimationManager.playAvailableHorseAnimation(availableHorses)
                this.horseController.resetChosenHorse()
                this.gameState = GameState.MoveHorse
            } else {
                this.gameState = GameState.StartPlayerTurn
                return
            }
        }

        if(this.gameState === GameState.MoveHorse) {
            if(!rollResult) return

            const { number } = rollResult
            const chosenHorse = this.horseController.getChosenHorse(currentTeam)

            if(!chosenHorse) return

            this.diceController.setDiceReady()
            this.horseAnimationManager.stopAvailableHorseAnimation()

            if(chosenHorse.horseState === HorseState.Dead) {
                chosenHorse.spawn()
                const initiator = this.landController.getInitiator(currentTeam)
                chosenHorse.moveTo(initiator)
                this.startPlayerTurn()
            } else {
                chosenHorse.setRaceDistance(number)
                const territories = chosenHorse.getHorsePath()

                if(!territories) return

                chosenHorse.moveOnPath(territories, this.startPlayerTurn)
            }
            return
        }

        if(this.gameState === GameState.EndPlayerTurn) {
            this.gameState = GameState.SwitchPlayer
        }
        //camera control
        this.cameraController.update(time, delta)
    }
}