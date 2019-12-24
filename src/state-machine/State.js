import { DO_NOTHING } from '../common'

export class State {
    constructor (key, transitions, { onEnter = DO_NOTHING, onLeave = DO_NOTHING, onUpdate = DO_NOTHING, isDefault = false } = {}) {
        this.key = key
        this.transitions = transitions
        this.onEnter = onEnter
        this.onLeave = onLeave
        this.onUpdate = onUpdate
        this.isDefault = isDefault
    }
}
