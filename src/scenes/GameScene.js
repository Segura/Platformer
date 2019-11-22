import Phaser from 'phaser'
import {Character} from "./Character"

export class GameScene extends Phaser.Scene {

    static DEFAULT_MAP_OFFSET = 450

    constructor() {
        super({ key: 'GameScene' })
    }

    init() {}

    preload() {}

    create() {
        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        let scaleX = this.cameras.main.width / image.width
        let scaleY = this.cameras.main.height / image.height
        let scale = Math.max(scaleX, scaleY)
        image.setScale(scale).setScrollFactor(0)

        const map = this.make.tilemap({key: 'map'})
        const tileSet = map.addTilesetImage('tileset', 'tiles')
        const platforms = map.createStaticLayer('main', tileSet)
        const bridges = map.createStaticLayer('bridges', tileSet)
        const behind = map.createStaticLayer('behind', tileSet)
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

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels - GameScene.DEFAULT_MAP_OFFSET)
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setLerp(0.3, 0.3)
        this.cameras.main.setDeadzone(50, 50)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true)
        this.physics.add.collider(this.player, platforms)
        this.physics.add.collider(this.player, bridges)

        this.cursors = this.input.keyboard.createCursorKeys()
        this.resetKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        // this.cameras.main.setRotation(Phaser.Math.DegToRad(90))
        // this.physics.world.gravity.set(6000, 0)
        // this.add.tween(this.cameras.main.setRotation).to({x:2,y:2}, 500, Phaser.Easing.Elastic.Out, true, 100)
    }

    update(time, delta) {
        this.player.update(delta / 1000)
    }
}
