export class GamepadProvider {

    constructor (scene, config) {
        this.scene = scene
        this.config = config
    }

    handleInput = ({ keyCode, isDown }) => {
        const event = this.config[keyCode]
        this.scene.handleInput(isDown ? event.PRESSED : event.RELEASED)
    }

    subscribe = () => {
        const pad = this.scene.input.gamepad.getPad(0)
        if (!pad) {
            return
        }
        Object.keys(this.config).forEach((button) => {
            if (typeof button === 'function') {
                // return mappedButton(pad)
            } else {
                const button = pad.getButtonValue(parseInt(button))
                button.on('down', this.handleInput)
                button.on('up', this.handleInput)
            }
            // const key = this.scene.input.keyboard.addKey(keyCode)
            // key.on('down', this.handleInput)
            // key.on('up', this.handleInput)
        })
    }

    // getValue (button) {
    //     const pad = this.scene.input.gamepad.getPad(0)
    //     if (pad) {
    //         const mappedButtons = Array.isArray(this.config[button]) ? this.config[button] : [this.config[button]]
    //         return mappedButtons.some((mappedButton) => {
    //             if (typeof mappedButton === 'function') {
    //                 return mappedButton(pad)
    //             }
    //             return !!pad.buttons.js[mappedButton].value
    //         })
    //     }
    //     return false
    // }
    //
    // isUp (button) {
    //     return !this.getValue(button)
    // }
    //
    // isDown (button) {
    //     return this.getValue(button)
    // }
}
