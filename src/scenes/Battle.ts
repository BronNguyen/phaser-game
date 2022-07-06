import Phaser, { Tilemaps } from "phaser"
import PluginName from "../const/Plugins";
import SceneKeys from "../const/SceneKeys"
import TeamKeys from "../const/TeamKeys";
import GameState from "../const/GameState";
import HorseState from "../const/HorseState";
import DiceState from "../const/DiceState";
import PlayerColors from "../const/PlayerColors";

import PlayerPlugin, { PlayerGameObjectGroup } from "../factories/PlayerFactory";

import Player from "../game-object/Player";
import Territory from "../game-object/Territory";
import Horse from "../game-object/Horse";
import Start from "../game-object/Start";
import Finish from "../game-object/Finish";
import GameTurnController from "../game-object/GameTurnController";
import Dice from "../game-object/Dice";

import DiceAnimation from "../animations/DiceAnimations";
import { uniq } from 'lodash'

import PopupContainer from "../popup/popup";

const { GAMEOBJECT_POINTER_UP } = Phaser.Input.Events

export default class Battle extends Phaser.Scene {
    cameraControl!: Phaser.Cameras.Controls.SmoothedKeyControl
    playerGroup!: Phaser.GameObjects.Group
    graphics!: Phaser.GameObjects.Graphics
    gameTurnController!: GameTurnController
    gameState = GameState.Init
    territories: Territory [] = []
    horses: Horse[] = []
    diceGroup!: Phaser.GameObjects.Group
    dices!: Dice []
    diceRectangle!: Phaser.GameObjects.Rectangle

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
        const diceAnimationManager = new DiceAnimation(this)
        diceAnimationManager.createRollDiceAnimation()

        const cursors = this.input.keyboard.createCursorKeys()

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.35,
            drag: 0.01,
            maxSpeed: 1.0
        }

        this.cameraControl = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig)

        this.playerGroup = this.make.group({
            classType: Player,
            runChildUpdate: true,
        })

        this.diceGroup = this.add.group({
            classType: Dice,
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
        this.initDiceSection()
        const popup = new PopupContainer(this)
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

        const horseGroup = this.add.group({classType: Horse})
        const teamHorses = Array(4).fill(undefined)

        teamHorses.map((_, index)=> {
            const horse = horseGroup.get()
            horse.joinTeam(teamKey)
            horse.setPosition(40 * (index % 2) + 30 + teamStart.left,40 * (index % 2) + 30 + teamStart.top)
            this.horses.push(horse)
        })
    }

    startGame() {
        this.gameState = GameState.StartTurn
        const sortedPlayers = this.setTeamOrder() as Player []
        this.gameTurnController.setPlayerOrder(sortedPlayers)
    }

    setTeamOrder() {
        const players = this.playerGroup.getChildren()
        players.sort(()=>(Phaser.Math.Between(1,4)-Phaser.Math.Between(1,4)))
        return players
    }

    initDiceSection () {
        this.diceRectangle = this.add.rectangle(650, 450, 300, 300, 0x000000, 0.1)

        this.diceGroup.create()
        this.diceGroup.create()

        this.dices = this.diceGroup.getChildren() as Dice[]
        const { x, y } = this.diceRectangle

        this.dices.map((dice: Dice, index)=> {
            dice.setPosition(x + index * 130 - 75, y)
            // dice.play('roll')
            // dice
        })

        this.diceRectangle.setInteractive()
        this.diceRectangle.on(GAMEOBJECT_POINTER_UP, this.rollDices, this)
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
        player.decreaseActionCount()
    }

    handlePlayerPreAction() {
        const currentPlayer = this.gameTurnController.getCurrentPlayer()
        const currentTeam = currentPlayer.getTeamKey()
        const teamHorses = this.horses.filter(horse=> horse.getTeamKey()=== currentTeam)
        const aliveHorses = teamHorses.filter(horse=> horse.horseState === HorseState.Idle)
        const deadHorses = teamHorses.filter(horse => horse.horseState === HorseState.Dead)

        const diceState = this.processDices()

        if(!aliveHorses.length && diceState === DiceState.Regular) {
            this.gameTurnController.switchPlayer()
            this.gameState = GameState.StartTurn
        }



        // const selectedHorse = this.horses.find((horse)=> horse.isChoosing)
        // if(selectedHorse) {
        //     this.gameState = GameState.HorseAction
        // }
    }

    processDices() {
        let diceState = DiceState.Regular

        if(this.checkDouble()) diceState = DiceState.Double

        if(this.checkOneSix()) diceState = DiceState.OneSix

        return diceState
    }

    checkOneSix() {
        const sixDice = this.dices.find(dice=>dice.face === 6)
        const oneDice = this.dices.find(dice=> dice.face === 1)

        return sixDice && oneDice
    }

    checkDouble() {
        const faceArray = this.dices.map(dice=> dice.face)
        if(uniq(faceArray).length !== faceArray.length) return true
        return false
    }

    getDiceFaces() {
        this.dices.map(dice=>{
            dice.roll()
            dice.stop()
            dice.setFace()
        })

        this.gameState = GameState.SelectHorse
        this.handlePlayerPreAction()
    }

    rollDices() {
        if(this.gameState === GameState.StartTurn){
            this.dices.map((dice)=> {
                dice.play('roll')
            })
            this.gameState = GameState.RollDice
        }
    }


    update(time, delta) {
        this.count++

        if(this.count > 100){
            console.log(this.gameState, this.gameTurnController.getCurrentPlayer().getTeamKey())
            this.count = 0
        }

        this.cameraControl.update(delta)

        if(this.gameState === GameState.Init) {
            this.startGame()
        }

        if(this.gameState === GameState.StartTurn) {
            return
        }

        if(this.gameState === GameState.SelectHorse){



        }

        if(this.gameState === GameState.HorseAction) {
            
        }

        if(this.gameState === GameState.RollDice) {
            this.gameState = GameState.Rolling
            this.time.delayedCall(2000 ,this.getDiceFaces ,[] ,this);
        }

        if(this.gameState === GameState.Rolling) {
            return
            // this.time
        }
    }
}