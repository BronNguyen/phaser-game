import State from "../const/PlayerState"

interface ITeam {
    initTeam(): void
    getTeamNumber(): number
    getColor(): number
    getState(): State
}

export default ITeam