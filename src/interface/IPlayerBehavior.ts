import PlayerState from "../const/PlayerState"
import Horse from "../game-object/Horse"

interface IPlayerBehavior {
    playerState: PlayerState

    setPlayerState(state: PlayerState): void
    getPlayerState(): PlayerState
    increaseActionCount(count: number): void
    decreaseActionCount(): void
    getActionCount(): number
    pickHorse(horse: Horse): void
    rollDices(): number
}

export default IPlayerBehavior