import ILand from "../interface/ILand"
import TeamKeys from "../const/TeamKeys"
import Territory from "../game-object/Territory"
import Finish from "../game-object/Finish"

export default class TerritoryController {
    scene: Phaser.Scene
    territories: Territory [] = []

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.initTerritory()
    }

    initTerritory(): void {
        let finishIndex = 0
        let index = 0
        for(var y = 0; y < 4; y++)
        {
            for(var x = 0; x < 20; x++)
            {
                let territory: Territory
                if(x < 14) {
                    index++
                    territory  = new Territory(30 + x * 65, 30 + y * 65, index)
                }else {
                    territory  = new Finish(30 + x * 65, 30 + y * 65, index + 39, ++finishIndex)
                }

                this.territories.push(territory)
                if(finishIndex > 5) finishIndex = 0
            }
        }
    }


    setTeamTerritories(teamKey: TeamKeys, graphics: Phaser.GameObjects.Graphics) {
        let territoryCount = 0

        this.territories.map((territory)=> {
            if(territory.getColor()) return

            if(++territoryCount > 20) return

            if(territoryCount === 2) territory.isInitiator = true

            territory.joinTeam(teamKey)
            territory.coloring(graphics, this.scene)
        })
    }

    getTeamTerritories(teamKey: TeamKeys): Territory [] {
        const territories = this.territories.filter(territory=> territory.getTeamKey() === teamKey)
        return territories
    }

    getTerritory(index: number, isFinish: boolean): ILand {
        if(!isFinish) {
            const availableIndex = Phaser.Math.Wrap(index, 1, 57)
            const territory = this.territories.find(ter=>ter.index === availableIndex) as Territory
            return territory
        }

        const territory = this.territories.find(ter => {
            if(ter instanceof Finish) {
                return ter.finishIndex === index
            }
        }) as ILand

        return territory
    }

    getInitiator(teamKey): Territory {
        const initiator = this.getTeamTerritories(teamKey).find(ter=>ter.isInitiator) as Territory
        return initiator
    }

}