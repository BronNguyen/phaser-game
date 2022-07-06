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
// import Territory from "../game-object/Territory";

export default class Battle extends Phaser.Scene {
    cameraControl!: Phaser.Cameras.Controls.SmoothedKeyControl
    playerGroup!: Phaser.GameObjects.Group
    territories: Territory [] = []
    graphics!: Phaser.GameObjects.Graphics

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

        for(var x = 0; x < 14; x++)
        {
            for(var y = 0; y < 4; y++)
            {
                const territory  = new Territory(30 + x * 65, 30 + y * 65)
                this.territories.push(territory);
            }
        }

        this.initiateObjects()
    }

    initiateObjects() {
        const teamKeys = Object.keys(TeamKeys);
        teamKeys.forEach((teamKey) => {
            this.initTeam(TeamKeys[teamKey])
        });
    }

    initTeam(teamKey: TeamKeys) {
        const player = new Player(this, 100, 100)
        player.joinTeam(teamKey)
        this.playerGroup.add(player)

        let territoryCount = 0
        const teamTerritories = this.territories.map((territory)=> {
            if(++territoryCount > 14) return

            territory.index = territoryCount

            if(territory.index === 1) territory.isInitiator = true

            territory.joinTeam(teamKey)
            territory.coloring(this.graphics)
        })

        const teamStart = new Start()
        teamStart.joinTeam(teamKey)

        const horseGroup = this.add.group({classType: Horse})
        const teamHorses = Array(4).fill(undefined) as (Phaser.Geom.Rectangle | undefined) []

        teamHorses.map(()=> {
            const horse = new Horse(this)
            horse.joinTeam(teamKey)
            horseGroup.add(horse)
        })

    }

    update (time, delta)
    {
        this.cameraControl.update(delta)
    }
}