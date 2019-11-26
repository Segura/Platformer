import {KeyboardProvider} from './KeyboardProvider'
import {GamepadProvider} from './GamepadProvider'

export class Controls {

    constructor (scene, config) {
        this.scene = scene
        this.config = config
        this.providers = []

        if (this.config.keyboard) {
            this.providers.push(new KeyboardProvider(this.scene, this.config.keyboard))
        }
        if (this.config.gamepad) {
            this.providers.push(new GamepadProvider(this.scene, this.config.gamepad))
        }
    }

    isUp (button) {
        return this.providers.every((provider) => provider.isUp(button))
    }

    isDown (button) {
        return this.providers.some((provider) => provider.isDown(button))
    }
}
