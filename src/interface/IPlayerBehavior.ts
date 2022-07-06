import PlayerState from "../const/PlayerState"
import Horse from "../game-object/Horse"

interface IPlayerBehavior {
    playerState: PlayerState

    setPlayerState(state: PlayerState): void
    getPlayerState(): PlayerState
    pickHorse(horse: Horse): void
    rollDices(): number
}

export default IPlayerBehavior