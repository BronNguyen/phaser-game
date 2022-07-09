import Phaser, { Tilemaps } from "phaser"
import PluginName from "../const/Plugins";
import SceneKeys from "../const/SceneKeys"
import TeamKeys from "../const/TeamKeys";
import GameState from "../const/GameState";
import HorseState from "../const/HorseState";
import RollResult, { DiceResult } from "../const/DiceResult";
import PlayerColors from "../const/PlayerColors";

import PlayerPlugin, { PlayerGameObjectGroup } from "../factories/PlayerFactory";

import Player from "../game-object/Player";
import Territory from "../game-object/Territory";
import Horse from "../game-object/Horse";
import Start from "../game-object/Start";
import Finish from "../game-object/Finish";
import Dice from "../game-object/Dice";

import { shuffle } from 'lodash'

import GameTurnController from "../controller/GameTurnController";
import DiceController from "../controller/DiceController";
import HorseController from "../controller/HorseController";
import TerritoryController from "../controller/TerritoryController";

import DiceAnimation from "../animations/DiceAnimations";

import PopupContainer from "../popup/popup";
import PlayerState from "../const/PlayerState";
import DiceState from "../const/DiceState";
import HorseAnimation from "../animations/HorseAnimation";

export default class Battle extends Phaser.Scene {
    playerGroup!: Phaser.GameObjects.Group
    graphics!: Phaser.GameObjects.Graphics
    gameTurnController!: GameTurnController
    diceController!: DiceController
    horseController!: HorseController
    territoryController!: TerritoryController
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
        const popup = new PopupContainer(this)

        this.initiateAnimations()
        this.initiateControllers()

        const cursors = this.input.keyboard.createCursorKeys()

        this.playerGroup = this.make.group({
            classType: Player,
            runChildUpdate: true,
        })

        this.graphics = this.add.graphics()


        this.initiateTeams()
    }

    initiateControllers() {
        this.diceController = new DiceController(this)
        this.horseController = new HorseController(this)
        this.gameTurnController = new GameTurnController(this)
        this.territoryController = new TerritoryController(this)
    }

    initiateAnimations() {
        const diceAnimationManager = new DiceAnimation(this)
        this.horseAnimationManager = new HorseAnimation(this)
    }

    initiateTeams() {
        const teamKeys = Object.keys(TeamKeys);
        teamKeys.forEach((teamKey, index) => {
            this.initTeam(TeamKeys[teamKey], index)
        });


    }

    initTeam(teamKey: TeamKeys, teamIndex) {
        const player = this.playerGroup.create()
        player.setActive(false)
        player.setVisible(false)
        player.joinTeam(teamKey)

        const teamStart = new Start(20 + teamIndex * 110, 300)
        teamStart.joinTeam(teamKey)
        teamStart.coloring(this.graphics)

        this.horseController.initTeamHorse(teamKey, teamStart)
        this.territoryController.setTeamTerritories(teamKey, this.graphics)
    }

    startGame() {
        this.gameState = GameState.SwitchPlayer
        const players = this.playerGroup.getChildren()
        const sortedPlayers = shuffle(players)
        this.gameTurnController.setPlayerOrder(sortedPlayers)
    }


    update() {
        this.count++

        const currentPlayer = this.gameTurnController.getCurrentPlayer()
        const currentTeam = currentPlayer?.getTeamKey()
        if(this.count > 100){
            // console.log(this.gameState, currentTeam)

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
            const initiatorHorse = this.territoryController.getInitiator(currentTeam)
            //todo use diceresult to find available horse, with available move
            let availableHorses = this.horseController.getTeamAliveHorses(currentTeam)

            if(diceResult === DiceResult.Double) {
                //todo: bug action count too much
                this.gameTurnController.addActionCount()
                availableHorses = this.horseController.getTeamHorses(currentTeam)
                //todo set finish rank up available
            }

            if(diceResult === DiceResult.OneSix) {
                this.gameTurnController.addActionCount()
                availableHorses = this.horseController.getTeamHorses(currentTeam)
            }

            if(availableHorses.length) {
                this.horseController.setAvailableHorses(availableHorses)
                this.horseAnimationManager.playAvailableHorseAnimation(availableHorses)
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

            const availableHorses = this.horseController.getTeamAvailableHorses(currentTeam)

            if(!availableHorses.includes(chosenHorse)) {
                this.horseController.resetChosenHorse()
                return
            }

            this.diceController.setDiceReady()
            this.horseAnimationManager.stopAvailableHorseAnimation()
            this.horseController.resetAvailableHorse()

            if(chosenHorse.horseState === HorseState.Dead) {
                chosenHorse.spawn()
                const initiator = this.territoryController.getInitiator(currentTeam)
                chosenHorse.moveTo(initiator)
                this.horseController.resetChosenHorse()
                //todo delay, horse move animation
            } else {
                const currentIndex = chosenHorse.currentPlace.getIndex()
                const availableDestination = chosenHorse.getAvailableDestination(number)
                // if(!availableDestination) {
                //     //todo cant move horse
                // }
                const {index, isFinish} = availableDestination as {index: number, isFinish: boolean}

                const nextTerritory = this.territoryController.getTerritory(index, isFinish)
                chosenHorse.setRaceDistance(number)
                chosenHorse.moveTo(nextTerritory)
                this.horseController.resetChosenHorse()
            }

            this.gameState = GameState.StartPlayerTurn

            return
        }

        if(this.gameState === GameState.EndPlayerTurn) {
            this.gameState = GameState.SwitchPlayer
        }


    }
}