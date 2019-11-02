import Phaser from 'phaser'

export default {
    type: Phaser.AUTO,
    title: NAME,
    version: VERSION,
    parent: 'content',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: DEBUG
        }
    },
    disableContextMenu: true,
}
