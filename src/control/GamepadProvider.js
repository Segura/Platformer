export class GamepadProvider {

    constructor (scene, config) {
        this.scene = scene
        this.config = config
    }

    getValue (button) {
        const pad = this.scene.input.gamepad.getPad(0)
        if (pad) {
            const mappedButtons = Array.isArray(this.config[button]) ? this.config[button] : [this.config[button]]
            return mappedButtons.some((mappedButton) => {
                if (typeof mappedButton === 'function') {
                    return mappedButton(pad)
                }
                return !!pad.buttons[mappedButton].value
            })
        }
        return false
    }

    isUp (button) {
        return !this.getValue(button)
    }

    isDown (button) {
        return this.getValue(button)
    }
}
