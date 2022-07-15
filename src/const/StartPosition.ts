import ILand from "interface/ILand"
import Horse from "../game-object/Horse"

class StartPosition implements ILand {
    index: number
    x: number
    y: number
    horse: Horse | undefined

    constructor(index: number, x: number, y: number) {
        this.index = index
        this.x = x
        this.y = y
        this.horse = undefined
    }

    getHorse(): Horse | undefined {
        return this.horse
    }

    setHorse(horse: Horse | undefined): void {
        this.horse = horse
        if(!horse) return

        horse.currentPlace = this
    }

    getIndex(): number {
        return this.index
    }

    getPosition(): { x: number; y: number; } {
        const {x, y} = this
        return {x, y}
    }

}

export default StartPosition
