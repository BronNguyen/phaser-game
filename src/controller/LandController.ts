import TeamKeys from "../const/TeamKeys"
import Territory from "../game-object/Territory"
import Finish from "../game-object/Finish"
import Start from "../game-object/Start"

export default class LandController {
    scene: Phaser.Scene
    territories: Territory [] = []
    starts: Start [] = []

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.initTerritory()
        this.initEvents()
    }

    initEvents() {
        this.scene.events.on('kick-horse', this.handleHorseDead, this)
    }

    handleHorseDead(horse, teamKey: TeamKeys) {
        const start = this.getStart(teamKey)
        start.adopt(horse)
    }

    initTerritory(): void {
        let index = 0
        for(let y = 0; y  < 4; y++){
            for(let x = 0; x < 14; x++){
                index++
                const territory  = new Territory(30 + x * 65, 30 + y * 65, index)
                this.territories.push(territory)
            }
        }

        for(let y = 0; y < 4; y++) {
            for(let x = 0; x < 6; x++) {
                index++
                const finish = new Finish(30 + (x+ 14) * 65, 30 + y * 65, index, x + 1)
                this.territories.push(finish)
            }
        }
    }

    createStart(teamIndex: number): Start {
        const teamStart = new Start(20 + teamIndex * 110, 300)
        this.starts.push(teamStart)
        return teamStart
    }

    getStart(teamKey: TeamKeys): Start {
        const teamStart = this.starts.find(start => start.getTeamKey() === teamKey) as Start
        return teamStart
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

        for (let i = 0; i < moveNumber; i++) {
            if (current instanceof Finish ) {
                const index = current.getFinishIndex()
                current = this.getFinishTerritory(index + 1, teamKey)
                if(!current) return []

                territories.push(current)
                continue
            }

            if(!current) return []

            let isTeamFinishGate = current.isFinishGate && current.getTeamKey() === teamKey

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
        const territory = this.territories.find(ter=> ter.index === availableIndex) as Territory
        return territory
    }

    getFinishTerritory(finishIndex: number, teamKey: TeamKeys): Territory | undefined {
        const territory = this.territories.find((ter)=> {
            if(ter instanceof Finish) {
                return ter.getFinishIndex() === finishIndex && ter.getTeamKey() === teamKey
            }
        })

        return territory
    }

    getInitiator(teamKey): Territory {
        const initiator = this.getTeamTerritories(teamKey).find(ter=>ter.isInitiator) as Territory
        return initiator
    }

}