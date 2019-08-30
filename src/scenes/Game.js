import Phaser from 'phaser'

export default class extends Phaser.Scene {

  constructor () {
    super({ key: 'GameScene' })
  }
  init () {}
  preload () {}

  create () {
    const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);
    backgroundImage.setScale(800 / 112, 600 / 304);
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tiles');
    const platforms = map.createStaticLayer('main', tileset, 0, 200);
  }
}
