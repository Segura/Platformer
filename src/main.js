import Phaser from 'phaser'

import {BootScene, GameScene, LoadingScene} from './scenes'

import config from './config'

const gameConfig = Object.assign(config, {
  scene: [BootScene, LoadingScene, GameScene]
})

class Game extends Phaser.Game {
  constructor () {
    super(gameConfig)
  }
}

window.game = new Game()
