import { DO_NOTHING } from '../common'

export class State {
    constructor (key, transitions, update = DO_NOTHING, onLeave = DO_NOTHING, isDefault = false) {
        this.key = key
        this.transitions = transitions
        this.update = update
        this.onLeave = onLeave
        this.default = isDefault
    }
}
