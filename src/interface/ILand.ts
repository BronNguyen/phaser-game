import Horse from "../game-object/Horse"

interface ILand {
    horse: Horse|undefined

    setHorse(horse: Horse| undefined): void
    getHorse(): Horse | null
    getIndex(): number
    getPosition(): {x: number, y: number}
}

export default ILand