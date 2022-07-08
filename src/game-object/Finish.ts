import Territory from "./Territory";

export default class Finish extends Territory {
    finishIndex!: number

    constructor(x, y) {
        super(x, y,66)
    }

}