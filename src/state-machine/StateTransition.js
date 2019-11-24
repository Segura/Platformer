export class StateTransition {

    constructor (checks, target, onChange) {
        this.checks = Array.isArray(checks) ? checks : [checks]
        this.target = target
        this.onChange = onChange
    }
}
