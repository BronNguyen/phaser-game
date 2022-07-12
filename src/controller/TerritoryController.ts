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
        let index = 0
        for(let y = 0; y < 4; y++){
            for(let x = 0; x < 14; x++){
                index++
                const territory  = new Territory(30 + x * 65, 30 + y * 65, index)
                this.territories.push(territory)
            }
        }

        let finishIndex = 0
        for(let y = 0; y < 4; y++) {
            for(let x = 0; x < 6; x++) {
                index++
                const finish = new Finish(30 + (x+ 14) * 65, 30 + y * 65, index, finishIndex)
                this.territories.push(finish)
            }
        }
    }


    setTeamTerritories(teamKey: TeamKeys, graphics: Phaser.GameObjects.Graphics) {
        let territoryCount = 0

        this.territories.forEach((territory)=> {
            if(territory.getColor()) return

            territoryCount++

            if(territoryCount > 14) return

            if(territoryCount === 1) territory.isFinishGate = true

            if(territoryCount === 2) territory.isInitiator = true

            territory.joinTeam(teamKey)
            territory.coloring(graphics, this.scene)
        })
    }

    setTeamFinish(teamKey: TeamKeys, graphics: Phaser.GameObjects.Graphics) {
        let finishCount = 0

        for(let i = this.territories.length - 1; i > 0; i--){
            if(this.territories[i].getColor()) continue
            finishCount++

            if(finishCount > 6) return

            this.territories[i].joinTeam(teamKey)
            this.territories[i].coloring(graphics, this.scene)
        }
    }

    fetchTerritories(teamKey: TeamKeys, currentTerritory: Territory, moveNumber: number): Territory [] {
        const territories: Territory[] = []

        let current: Territory| undefined = currentTerritory
        console.log('current: ', current)

        for (let i = 0; i < moveNumber; i++) {

            if (current instanceof Finish ) {
                const index = current.getIndex()
                current = this.getFinishTerritory(index + 1, teamKey)
                if(!current) return []
            }

            if(!current) return []

            let isTeamFinishGate = current.isFinishGate && current.getTeamKey() === teamKey
            console.log('isTeamFinishGate: ', isTeamFinishGate)

            if (isTeamFinishGate) {
                current = this.getFinishTerritory(1, teamKey)
                if(!current) return []

            } else {
                const index = current.getIndex()
                current = this.getTerritory(index + 1)
                if(!current) return []

                territories.push(current)
            }
        }

        return territories
    }

    getTeamTerritories(teamKey: TeamKeys): Territory [] {
        const territories = this.territories.filter(territory=> territory.getTeamKey() === teamKey)
        return territories
    }

    getTerritory(index: number): Territory {
        const availableIndex = Phaser.Math.Wrap(index, 1, 57)
        console.log('availableIndex: ', availableIndex)
        const territory = this.territories.find(ter=> ter.index === availableIndex) as Territory
        console.log('territory: ', territory)
        return territory
    }

    getFinishTerritory(finishIndex: number, teamKey: TeamKeys): Territory | undefined {

        const territory = this.territories.find((ter)=> {
            if(ter instanceof Finish) {
                return ter.finishIndex === finishIndex && ter.getTeamKey() === teamKey
            }
        })

        return territory
    }

    public getTerritoriesWithinDistance(landFrom: ILand, landTo: ILand): ILand [] {
        const territories: ILand[] = []

        if(!(landTo instanceof Finish)) {
            for(let i = landFrom.getIndex(); i < landTo.getIndex(); i++ ) {
                territories.push(this.territories[i+1])
            }
        }

        // if(!(landFrom instanceof Finish) && landTo instanceof Finish) {
        //     const offset = 55 - this.distance

        //     for(let i = 0; i < offset; i++){
        //         territories.push(this.territories[landFrom.getIndex() + i + 1])
        //     }

        //     for(let i = 0; i < landTo.finishIndex; i++) {
        //         territories.push(this.territories[])
        //     }
        // }

        return territories
    }


    getInitiator(teamKey): Territory {
        const initiator = this.getTeamTerritories(teamKey).find(ter=>ter.isInitiator) as Territory
        return initiator
    }

}