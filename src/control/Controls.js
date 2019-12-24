import { KeyboardProvider } from './KeyboardProvider'
import { GamepadProvider } from './GamepadProvider'

export class Controls {

    constructor (scene, config) {
        this.scene = scene
        this.config = config
        this.providers = []

        if (this.config.keyboard) {
            this.providers.push(new KeyboardProvider(this.scene, this.config.keyboard))
        }
        if (this.config.gamepad) {
            // GamepadPlugin.
            console.log(scene.input.gamepad.total)
            scene.input.gamepad.once('connected', this.onGamepadConnect)
        }

        this.subscribe()
    }

    onGamepadConnect = () => {
        console.log('connect')
        this.providers.push(new GamepadProvider(this.scene, this.config.gamepad))
    }

    subscribe = () => this.providers.forEach((provider) => provider.subscribe())
}
