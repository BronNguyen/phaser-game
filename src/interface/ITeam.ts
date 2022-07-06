import TeamKeys from "../const/TeamKeys"

interface ITeam {
    teamKey: TeamKeys
    color: number

    joinTeam(teamKey: TeamKeys): void
    getTeamKey(): TeamKeys
    getColor(): number
}

export default ITeam