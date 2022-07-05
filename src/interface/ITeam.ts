import TeamKeys from "../const/TeamKeys"

interface ITeam {
    teamKey: TeamKeys
    color: number

    getTeamKey(): TeamKeys
    getColor(): number
}

export default ITeam