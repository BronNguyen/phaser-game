import Phaser from "phaser"
import PlayerPlugin, { PlayerGameObjectGroup } from "../factories/PlayerFactory";
import PluginName from "../const/Plugins";
import SceneKeys from "../const/SceneKeys"
import Player from "../game-object/Player";
import Territory from "../game-object/Territory";
import TeamKeys from "../const/TeamKeys";
import PlayerColors from "../const/PlayerColors";
// import Territory from "../game-object/Territory";

export default class Battle extends Phaser.Scene {
    cameraControl!: Phaser.Cameras.Controls.SmoothedKeyControl

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

        const group = this.make.group({
            classType: Player,
            gridAlign: {
                x: 100,
                y: 100,
                width: 60,
                height: 60,
                cellWidth: 100,
                cellHeight: 100
            }
        })

        // console.log('group: ', group)
        // const players = group.createMultiple({ classType: Player ,quantity: 4 });
        // console.log('players: ', players)

        // // @ts-ignore
        // const playerGroup = this.add.playerGroup() as PlayerGameObjectGroup

        // const player2 = playerGroup.get() as Player
        // player2.setPosition(100,100).setActive(true).setVisible(true)
        // console.log('player2: ', player2)
        // console.log('playerGroup: ', playerGroup)

        const player1 = new Player(this, 100, 100, TeamKeys.Red)
        const player2 = new Player(this, 200, 100, TeamKeys.Green)
        const player3 = new Player(this, 300, 100, TeamKeys.Blue)
        const player4 = new Player(this, 400, 100, TeamKeys.Yellow)

        const territoryGroup = this.add.group({classType: Territory})
        const horseGroup = this.add.group({})

        const territories = Array(56).fill(undefined) as (Phaser.Geom.Circle | undefined) []
        territories.map((_, index)=>{
            let team = TeamKeys.Yellow

            if(index < 42) team = TeamKeys.Blue
            if(index < 28) team = TeamKeys.Green
            if(index < 14) team = TeamKeys.Red

            const territory =  new Territory(this, index, team, 0, 0, 30)
            territoryGroup.add(territory)
            return territory
        })



        Phaser.Actions.GridAlign(territoryGroup.getChildren(), { width: 14, cellWidth: 70, cellHeight: 70, x: 80, y: 80 })
    }



    update (time, delta)
    {
        this.cameraControl.update(delta)
    }
}