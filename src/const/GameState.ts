enum GameState {
    Start = 'Start',
    SwitchPlayer = 'SwitchPlayer',
    StartPlayerTurn = 'StartPlayerTurn',
    PlayerTurn = 'PlayerTurn',
    AfterRollDice = 'RollingDice',
    ChooseHorse = 'ChooseHorse',
    MoveHorse = 'MoveHorse',
    EndPlayerTurn = 'EndPlayerTurn',
    Over = 'Over'
}

export default GameState