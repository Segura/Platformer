import { DO_NOTHING } from '../common'

export class StateTransition {

    constructor (checks, target, onChange = DO_NOTHING) {
        this.checks = Array.isArray(checks) ? checks : [checks]
        this.target = target
        this.onChange = onChange
    }
}
