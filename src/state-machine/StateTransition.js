export class StateTransition {

    constructor (event, target, checks = []) {
        this.event = event
        this.target = target
        this.checks = checks
    }
}
