import Horse from "../game-object/Horse"

interface ILand {
    horse: Horse|undefined

    setHorse(horse: Horse| undefined): void
    setHorsePosition(): void
    getHorse(): Horse | undefined
    getIndex(): number
    getPosition(): {x: number, y: number}
}

export default ILand