import Horse from "../game-object/Horse"

type StartPosition = {
    index: number,
    x: number,
    y: number,
    horse: Horse | null
}

export default StartPosition
