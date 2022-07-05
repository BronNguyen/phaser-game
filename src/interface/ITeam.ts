import TeamKeys from "../const/TeamKeys"

interface ITeam {
    teamKey: TeamKeys
    color: number

    initTeam(): void
    getTeamKey(): TeamKeys
    getColor(): number
}

export default ITeam