export class KeyboardProvider {

    constructor (scene, config) {
        this.scene = scene
        this.config = config
    }

    handleInput = ({ keyCode, isDown }) => {
        const event = this.config[keyCode]
        this.scene.handleInput(isDown ? event.PRESSED : event.RELEASED)
    }

    subscribe = () => {
        Object.keys(this.config).map(Number).forEach((keyCode) => {
            const key = this.scene.input.keyboard.addKey(keyCode)
            key.on('down', this.handleInput)
            key.on('up', this.handleInput)
        })
    }
}
