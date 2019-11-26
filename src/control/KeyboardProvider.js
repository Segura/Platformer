export class KeyboardProvider {

    constructor (scene, config) {
        this.scene = scene
        this.config = config

        this.keys = this.scene.input.keyboard.addKeys(this.config)
    }

    isUp (button) {
        return this.keys[button].isUp
    }

    isDown (button) {
        return this.keys[button].isDown
    }
}
