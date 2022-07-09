export enum DiceResult {
    Double = 'Double',
    OneSix = 'OneSix',
    Regular = 'Regular'
}

type RollResult = {
    diceResult: DiceResult,
    number: number
}

export default RollResult