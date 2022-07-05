import PlayerColors from "../const/PlayerColors"
import TerritoryState from "../const/TerritoryState"

export default class Territory extends Phaser.GameObjects.Arc {
    territoryState!: TerritoryState
    isInitiator = false
    index: number = 0

    constructor(scene: Phaser.Scene,index: number, team: PlayerColors , x: number, y: number, radius: number) {
        const color = team
        super(scene, x, y, radius, undefined, undefined, undefined, color, 0.2)
        this.territoryState = TerritoryState.Free
        this.index = index
        scene.add.existing(this)
    }
}