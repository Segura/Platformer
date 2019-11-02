import Phaser from 'phaser'
import {Character} from "./Character"

export default class extends Phaser.Scene {

    constructor() {
        super({key: 'GameScene'})
    }

    init() {
    }

    preload() {
    }

    create() {
        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        let scaleX = this.cameras.main.width / image.width
        let scaleY = this.cameras.main.height / image.height
        let scale = Math.max(scaleX, scaleY)
        image.setScale(scale).setScrollFactor(0)

        const map = this.make.tilemap({key: 'map'})
        const tileset = map.addTilesetImage('tileset', 'tiles')
        const platforms = map.createStaticLayer('main', tileset)
        const bridges = map.createStaticLayer('bridges', tileset)
        const behind = map.createStaticLayer('behind', tileset)
        platforms.setCollisionByProperty({ collided: true })
        bridges.setCollisionByProperty({ collided: true })

        const playerTile = map.findByIndex(1, 0, false, 'player')
        const spawnPoint = { x: playerTile.pixelX, y: playerTile.pixelY }

        if (DEBUG) {
            const debugGraphics = this.add.graphics().setAlpha(0.75)
            platforms.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            })
            bridges.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            })
        }

        this.player = new Character({
            scene: this,
            spawnPoint,
            asset: 'character'
        })

        this.cameras.main.startFollow(this.player)

        this.physics.add.collider(this.player, platforms)
        this.physics.add.collider(this.player, bridges)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true)
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update () {
        this.player.update()
    }
}
