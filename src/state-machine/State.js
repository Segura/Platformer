export class State {
    constructor (key, transitions, update, isDefault = false) {
        this.key = key
        this.transitions = transitions
        this.update = update
        this.default = isDefault
    }
}
