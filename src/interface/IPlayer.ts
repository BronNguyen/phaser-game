import PlayerState from "const/PlayerState"

interface IPlayer {
    playerState: PlayerState

    setPlayerState(state: PlayerState): void
    getPlayerState(): PlayerState
}

export default IPlayer