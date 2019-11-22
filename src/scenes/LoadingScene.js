import Phaser from 'phaser'

export class LoadingScene extends Phaser.Scene {

    text
    dotsCount = 0

    constructor() {
        super({key: 'LoadingScene'})
    }

    preload() {
        this.time.addEvent({ delay: 300, callback: this.updateText, callbackScope: this, loop: true })
        this.text = this.add.bitmapText(this.cameras.main.centerX, this.cameras.main.centerY, 'titleFont', 'Loading').setOrigin(0.5);

        this.load.bitmapFont('textFont', './assets/fonts/ribeye-18.png', './assets/fonts/ribeye-18.xml')
        this.load.image('background', './assets/images/sky.png')
        this.load.image('tiles', './assets/images/tileset.png')
        this.load.tilemapTiledJSON('map', './assets/map.json')
        this.load.spritesheet('character', 'assets/images/character.png', {frameWidth: 50, frameHeight: 37})
    }

    create() {
        this.scene.start('GameScene')
    }

    updateText () {
        this.text.setText(`Loading${'.'.repeat(this.dotsCount++)}`)
        if (this.dotsCount > 3) {
            this.dotsCount = 0
        }
    }
}
