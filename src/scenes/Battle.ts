import Phaser from "phaser"
import PlayerPlugin, { PlayerGameObjectGroup } from "../factories/PlayerFactory";
import PluginName from "../const/Plugins";
import SceneKeys from "../const/SceneKeys"
import Player from "../game-object/Player";
import Territory from "../game-object/Territory";
import TeamKeys from "../const/TeamKeys";
import PlayerColors from "../const/PlayerColors";
import Horse from "../game-object/Horse";
import Start from "../game-object/Start";
import Finish from "../game-object/Finish";
import GameState from "../const/GameState";
import GameTurnController from "../game-object/GameTurnController";
// import Territory from "../game-object/Territory";

export default class Battle extends Phaser.Scene {
    cameraControl!: Phaser.Cameras.Controls.SmoothedKeyControl
    playerGroup!: Phaser.GameObjects.Group
    graphics!: Phaser.GameObjects.Graphics
    gameTurnController!: GameTurnController
    gameState = GameState.Init
    territories: Territory [] = []

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
            if(territory.color) return
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
        const teamHorses = Array(4).fill(undefined) as (Phaser.Geom.Rectangle | undefined) []

        teamHorses.map((_, index)=> {
            const horse = horseGroup.get()
            horse.joinTeam(teamKey)
            horse.setPosition(40 * (index % 2) + 30 + teamStart.left,40 * (index % 2) + 30 + teamStart.top)
        })
    }

    startGame() {
        this.gameState= GameState.Start
        const sortedPlayers = this.setTeamOrder() as Player []
        this.gameTurnController = new GameTurnController(this, sortedPlayers)
    }

    setTeamOrder() {
        const players = this.playerGroup.getChildren()
        players.sort(()=>(Phaser.Math.Between(1,4)-Phaser.Math.Between(1,4)))
        return players
    }


    update(time, delta) {
        if(this.gameState === GameState.Init) {
            this.startGame()
        }
        this.cameraControl.update(delta)
    }
}