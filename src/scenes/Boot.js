import Phaser from 'phaser'

export default class extends Phaser.Scene {

    constructor() {
        super({key: 'BootScene'})
    }

    preload() {
        this.load.image('background', './assets/images/sky.png')
        this.load.image('tiles', './assets/images/tileset.png')
        this.load.tilemapTiledJSON('map', './assets/map.json')
        this.load.spritesheet('character', 'assets/images/character.png', {frameWidth: 50, frameHeight: 37})
    }

    update() {
        this.scene.start('GameScene')
    }
}
