import Phaser from 'phaser'

export class LoadingScene extends Phaser.Scene {

    text
    dotsCount = 0

    constructor() {
        super({key: 'LoadingScene'})
    }

    preload() {
        this.time.addEvent({ delay: 300, callback: this.updateText, callbackScope: this, loop: true })
        this.text = this.add.bitmapText(this.cameras.main.centerX, this.cameras.main.centerY, 'titleFont', 'Loading').setOrigin(0.5)

        this.load.bitmapFont('textFont', './assets/fonts/ribeye-18.png', './assets/fonts/ribeye-18.xml')
        this.load.image('background.sky', './assets/images/background/sky.png')
        this.load.image('background.clouds', './assets/images/background/clouds.png')
        this.load.image('background.sea', './assets/images/background/sea.png')
        this.load.image('background.ground', './assets/images/background/ground.png')
        this.load.image('tiles', './assets/images/tileset-extruded.png')

        this.load.image('dead', './assets/images/achievements/dead.png')
        this.load.image('idle', './assets/images/achievements/idle.png')

        this.load.tilemapTiledJSON('map', './assets/map.json')
        this.load.spritesheet('character', 'assets/images/character.png', { frameWidth: 50, frameHeight: 37 })
        this.load.spritesheet('slime', 'assets/images/enemies/slime.png', { frameWidth: 32, frameHeight: 25 })
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
