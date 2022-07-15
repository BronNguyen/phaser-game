import Phaser from "phaser"
import Player from "../game-object/Player";

export class PlayerGameObjectGroup extends Phaser.GameObjects.Group {
    constructor(scene){
        super(scene, {
            classType: Player,
            quantity: 4,
            active: true,
            maxSize: 8,
            runChildUpdate: true,

        })
    }
}

export default class PlayerPlugin extends Phaser.Plugins.ScenePlugin {

    constructor (scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager, pluginKey: string)
    {
        super(scene, pluginManager, pluginKey);

        //  Register our new Game Object type
        pluginManager.registerGameObject('playerGroup', this.createPlayer, undefined);
    }

    createPlayer(){
        // @ts-ignore
        return this.displayList.add(new PlayerGameObjectGroup(this.scene));
    }

}