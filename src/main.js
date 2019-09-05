import Phaser from 'phaser'

import BootScene from './scenes/Boot'
import LoadingScene from './scenes/Loading'
import GameScene from './scenes/Game'

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
