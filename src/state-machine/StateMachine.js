export class StateMachine {

    constructor (states, onChange) {
        this.states = {}
        states.forEach((state) => {
            this.states[state.key] = state
        })
        this.onChange = onChange
        this.defaultState = states.find((state) => state.default)
        this.reset()
    }

    update (delta) {
        this.currentState.transitions.some((transition) => {
            if (transition.checks.every((check) => check())) {
                const newStateKey = transition.target
                this.currentState.onLeave()
                transition.onChange(newStateKey)
                this.onChange(newStateKey)
                this.currentState = this.states[newStateKey]
                return true
            }
        })
        this.currentState.update(delta)
    }

    reset () {
        this.currentState = this.defaultState
        this.onChange(this.currentState.key)
    }
}
