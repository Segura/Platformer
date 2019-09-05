import Phaser from 'phaser'

export default class extends Phaser.Scene {

    constructor() {
        super({key: 'BootScene'})
    }

    preload() {
        this.load.bitmapFont('titleFont', './assets/fonts/ribeye-72.png', './assets/fonts/ribeye-72.xml')
    }

    create() {
        this.scene.start('LoadingScene')
    }
}
