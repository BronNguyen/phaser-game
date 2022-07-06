import TeamKeys from "../const/TeamKeys"

interface ITeam {
    joinTeam(teamKey: TeamKeys): void
    getTeamKey(): TeamKeys
    getColor(): number
}

export default ITeam