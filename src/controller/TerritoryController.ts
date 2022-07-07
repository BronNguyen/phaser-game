import TeamKeys from "../const/TeamKeys"
import Territory from "../game-object/Territory"

export default class TerritoryController {
    scene: Phaser.Scene
    territories: Territory [] = []

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.initTerritory()
    }

    initTerritory(): void {
        for(var y = 0; y < 4; y++)
        {
            for(var x = 0; x < 14; x++)
            {
                const territory  = new Territory(30 + x * 65, 30 + y * 65)
                this.territories.push(territory);
            }
        }
    }

    setTeamTerritories(teamKey: TeamKeys, graphics: Phaser.GameObjects.Graphics) {
        let territoryCount = 0

        this.territories.map((territory)=> {
            if(territory.getColor()) return

            if(++territoryCount > 14) return

            territory.index = territoryCount

            if(territory.index === 1) territory.isInitiator = true

            territory.joinTeam(teamKey)
            territory.coloring(graphics)
        })
    }

    getTeamTerritories(teamKey: TeamKeys): Territory [] {
        const territories = this.territories.filter(territory=> territory.getTeamKey() === teamKey)
        return territories
    }

    getTerritory(teamKey: TeamKeys, index: number) {
        const territory = this.getTeamTerritories(teamKey).find(ter=>ter.index === index) as Territory
        return territory
    }

    getInitiator(teamKey): Territory {
        const initiator = this.getTeamTerritories(teamKey).find(ter=>ter.isInitiator) as Territory
        return initiator
    }

}