import HorseState from "../const/HorseState"
import ILand from "./ILand"

interface IHorse {
    setHorseState(state: HorseState): void
    getHorseState(): HorseState
    spawn(): void
    moveTo(land: ILand): void
    die(): void
}

export default IHorse