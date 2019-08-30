import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
    this.add.text(100, 100, 'loading fonts...')

    this.load.image('background', './assets/images/sky.png')
    this.load.image('tiles', './assets/images/tileset.png')
    this.load.tilemapTiledJSON('map', './assets/map.json')

    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })
  }

  update () {
    if (this.fontsReady) {
      this.scene.start('GameScene')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
