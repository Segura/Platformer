export class StateMachine {

    constructor (states, onChange) {
        this.states = {}
        states.forEach((state) => {
            this.states[state.key] = state
        })
        this.onChange = onChange
        this.defaultState = states.find((state) => state.isDefault)
        this.reset()
    }

    update (delta) {
        this.currentState.onUpdate(delta)
    }

    handleEvent (event) {
        this.currentState.transitions.some((transition) => {
            if (transition.event === event && transition.checks.every(check => check())) {
                this.change(transition.target)
                return true
            }
        })
    }

    change (state) {
        this.currentState.onLeave()
        this.currentState = this.states[state]
        this.currentState.onEnter()
        this.onChange(state)
    }

    reset () {
        this.currentState = this.defaultState
        this.onChange(this.currentState.key)
    }
}
