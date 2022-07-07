import Phaser, { Tilemaps } from "phaser"
import PluginName from "../const/Plugins";
import SceneKeys from "../const/SceneKeys"
import TeamKeys from "../const/TeamKeys";
import GameState from "../const/GameState";
import HorseState from "../const/HorseState";
import DiceResult from "../const/DiceResult";
import PlayerColors from "../const/PlayerColors";

import PlayerPlugin, { PlayerGameObjectGroup } from "../factories/PlayerFactory";

import Player from "../game-object/Player";
import Territory from "../game-object/Territory";
import Horse from "../game-object/Horse";
import Start from "../game-object/Start";
import Finish from "../game-object/Finish";
import Dice from "../game-object/Dice";

import GameTurnController from "../controller/GameTurnController";
import DiceController from "../controller/DiceController";
import HorseController from "../controller/HorseController";

import DiceAnimation from "../animations/DiceAnimations";
import { uniq } from 'lodash'

import PopupContainer from "../popup/popup";
import PlayerState from "../const/PlayerState";
import DiceState from "../const/DiceState";

export default class Battle extends Phaser.Scene {
    playerGroup!: Phaser.GameObjects.Group
    graphics!: Phaser.GameObjects.Graphics
    gameTurnController!: GameTurnController
    diceController!: DiceController
    horseController!: HorseController
    gameState = GameState.Init
    territories: Territory [] = []
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
        const diceAnimationManager = new DiceAnimation(this)
        this.initiateControllers()

        const cursors = this.input.keyboard.createCursorKeys()

        this.playerGroup = this.make.group({
            classType: Player,
            runChildUpdate: true,
        })


        // const players = group.createMultiple({ classType: Player ,quantity: 4 });
        // console.log('players: ', players)

        // // @ts-ignore
        // const playerGroup = this.add.playerGroup() as PlayerGameObjectGroup

        // const player2 = playerGroup.get() as Player
        // player2.setPosition(100,100).setActive(true).setVisible(true)
        // console.log('player2: ', player2)
        // console.log('playerGroup: ', playerGroup)

        this.graphics = this.add.graphics()
        this.gameTurnController = new GameTurnController(this)

        for(var y = 0; y < 4; y++)
        {
            for(var x = 0; x < 14; x++)
            {
                const territory  = new Territory(30 + x * 65, 30 + y * 65)
                this.territories.push(territory);
            }
        }

        this.initiateObjects()
    }

    initiateControllers() {
        this.diceController = new DiceController(this)
        this.horseController = new HorseController(this)
    }

    initiateObjects() {
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

        let territoryCount = 0
        this.territories.map((territory)=> {
            if(territory.getColor()) return
            if(++territoryCount > 14) return

            territory.index = territoryCount

            if(territory.index === 1) territory.isInitiator = true

            territory.joinTeam(teamKey)
            territory.coloring(this.graphics)
        })

        const teamStart = new Start(20 + teamIndex * 110, 300)
        teamStart.joinTeam(teamKey)
        teamStart.coloring(this.graphics)

        this.horseController.initTeamHorse(teamKey, teamStart)
    }

    startGame() {
        this.gameState = GameState.Start
        const sortedPlayers = this.setTeamOrder() as Player []
        this.gameTurnController.setPlayerOrder(sortedPlayers)
    }

    setTeamOrder() {
        const players = this.playerGroup.getChildren()
        players.sort(()=>(Phaser.Math.Between(1,4)-Phaser.Math.Between(1,4)))
        return players
    }

    handleSpawnHorse() {
        // if()
        const player = this.gameTurnController.getCurrentPlayer()
        const teamKey = player.getTeamKey()
        const teamTerritory = this.territories.filter(ter=> ter.getTeamKey()=== teamKey)
        const initiator = teamTerritory.find(ter => ter.isInitiator) as Territory

        const horse = initiator.getHorse()
        if(!horse) {
            //TODO make decide UI
            //TODO wait Choosing Horse
            // initiator.setHorse()
            // horse
        }

        // const horseTeamKey = horse.getTeamKey()
        // player.decreaseActionCount()
    }

    handlePlayerPreAction() {
        const currentPlayer = this.gameTurnController.getCurrentPlayer()
        const currentTeam = currentPlayer.getTeamKey()
        const teamHorses = this.horses.filter(horse=> horse.getTeamKey()=== currentTeam)
        const aliveHorses = teamHorses.filter(horse=> horse.horseState === HorseState.Alive)


        //     //todo: waiting for horse chosing
    }


    update(time, delta) {
        this.count++

        const currentPlayer = this.gameTurnController.getCurrentPlayer()
        const currentTeam = currentPlayer?.getTeamKey()
        if(this.count > 100){
            console.log(this.gameState, currentTeam, this.currentPlayer.playerState)
            console.log('this.diceController.diceState: ', this.diceController.diceState)

            this.count = 0
        }

        if(this.gameState === GameState.Init) {
            this.startGame()
        }

        if(this.gameState === GameState.Start) {
            //reset all players state
            this.gameTurnController.resetAllPlayersState()
            this.gameState = GameState.SwitchPlayer
        }

        if(this.gameState === GameState.SwitchPlayer) {
            if(this.currentPlayer) {
                this.gameTurnController.switchPlayer()
            }

            this.currentPlayer = this.gameTurnController.getCurrentPlayer()
            this.gameTurnController.addActionCount()
            this.gameState = GameState.StartPlayerTurn
            this.currentPlayer.setPlayerState(PlayerState.StartTurn)
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

        if(this.gameState === GameState.PlayerTurn) {
            if(this.diceController.diceState === DiceState.Rolled) {
                const rollResult = this.diceController.getRollResult()
                const {diceResult, number} = rollResult
                this.horseController.setMoveAble()

                if(diceResult === DiceResult.Double) {
                    this.gameTurnController.addActionCount()
                    this.horseController.setSpawnAble()
                }

                if(diceResult === DiceResult.OneSix) {
                    this.gameTurnController.addActionCount()
                }

                if(diceResult === DiceResult.Regular) {
                }

                // this.currentPlayer.playTurn(number)

            }
            return
        }

        if(this.gameState === GameState.EndPlayerTurn) {
            this.gameState = GameState.SwitchPlayer
        }


    }
}