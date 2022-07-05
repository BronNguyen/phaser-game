import HorseState from "../const/HorseState"

interface IHorse {
    setHorseState(state: HorseState): void
    getHorseState(): HorseState
    move(count: number): void
    die(): void
}

export default IHorse