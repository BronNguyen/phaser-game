import Dice from '../game-object/Dice'
import { uniq } from 'lodash'
import DiceState from '../const/DiceState'
import RollResult, { DiceResult } from '../const/DiceResult'

const { GAMEOBJECT_POINTER_UP } = Phaser.Input.Events

export default class DiceController {
    scene: Phaser.Scene
    diceState = DiceState.Ready
    dices!: Dice []

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.initDiceSection()
    }


    initDiceSection () {
        const diceRectangle = this.scene.add.rectangle(650, 450, 300, 300, 0x000000, 0.1)

        const diceGroup = this.scene.add.group({
            classType: Dice,
        })

        diceGroup.create()
        diceGroup.create()

        this.dices = diceGroup.getChildren() as Dice[]
        const { x, y } = diceRectangle

        this.dices.map((dice: Dice, index)=> {
            dice.setPosition(x + index * 130 - 75, y)
        })

        diceRectangle.setInteractive()
        diceRectangle.on(GAMEOBJECT_POINTER_UP, this.rollDices, this)
    }


    // handleRollingDice() {
    //     if(this.gameTurnController.processPlayerRollingDice()) {
    //         this.events.emit('roll-dices')
    //     }
    // }

    setDiceReady(): void {
        this.diceState = DiceState.Ready
    }

    getDiceState(): DiceState {
        return this.diceState
    }

    getRollResult(): RollResult | undefined {
        if(this.diceState !== DiceState.Rolled) return


        let diceResult = DiceResult.Regular

        if(this.checkDouble()) diceResult = DiceResult.Double

        if(this.checkOneSix()) diceResult = DiceResult.OneSix

        const number = this.dices.reduce((currentNumber, dice )=> currentNumber + dice.face, 0)

        return { diceResult, number }
    }

    checkOneSix() {
        const sixDice = this.dices.find(dice=>dice.face === 6)
        const oneDice = this.dices.find(dice=> dice.face === 1)

        return sixDice && oneDice
    }

    checkDouble() {
        const faceArray = this.dices.map(dice=> dice.face)
        // if there has duplicate faces in dices
        if(uniq(faceArray).length !== faceArray.length) return true
        return false
    }

    rollDices() {
        if(this.diceState !== DiceState.Ready) return

        this.dices.map(dice=> {
            dice.playRollAnimation()
        })

        this.diceState = DiceState.Rolling

        this.scene.time.delayedCall(1600 ,this.stopDices ,[] ,this)
    }

    stopDices() {
        this.dices.map(dice => {
            dice.roll()
            dice.stop()
            dice.setFace()
        })

        this.diceState = DiceState.Rolled
    }

}