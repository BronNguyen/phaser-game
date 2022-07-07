import Horse from "../game-object/Horse"

interface ILand {
    horse?: Horse
    index: number

    setHorse(horse: Horse): void
    getHorse(): Horse | null
    getIndex(): number
    getPosition(): {x: number, y: number}
}

export default ILand