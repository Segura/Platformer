import Phaser from 'phaser'

export default {
    type: Phaser.AUTO,
    title: NAME,
    version: VERSION,
    url: 'https://github.com/Segura/platformer',
    parent: 'content',
    width: 800,
    height: 600,
    input: {
        gamepad: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: DEBUG
        }
    },
    disableContextMenu: true
}
