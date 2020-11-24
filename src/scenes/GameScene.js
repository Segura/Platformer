import Phaser from 'phaser'
import { Character } from '../character'
import { BUTTONS, Controls } from '../control'
import { AchievementsManager } from '../achievements'

import { GENGameS3Controller } from './GENGameS3Controller'

export class GameScene extends Phaser.Scene {

    static CONFIG = {
        keyboard: {
            [BUTTONS.LEFT]: Phaser.Input.Keyboard.KeyCodes.LEFT,
            [BUTTONS.RIGHT]: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            [BUTTONS.UP]: Phaser.Input.Keyboard.KeyCodes.UP,
            [BUTTONS.DOWN]: Phaser.Input.Keyboard.KeyCodes.DOWN,
            [BUTTONS.RESET]: Phaser.Input.Keyboard.KeyCodes.R
        },
        gamepad: {
            [BUTTONS.LEFT]: GENGameS3Controller.LEFT,
            [BUTTONS.RIGHT]: GENGameS3Controller.RIGHT,
            [BUTTONS.UP]: [
                GENGameS3Controller.UP,
                GENGameS3Controller.A
            ],
            [BUTTONS.DOWN]: GENGameS3Controller.DOWN,
            [BUTTONS.RESET]: GENGameS3Controller.START
        }
    }

    constructor () {
        super({ key: 'GameScene' })
    }

    init () {
    }

    preload () {
    }

    createTiledBackground (key, scrollFactor, positionFactor, scaleFactor) {
        const textureHeight = this.cameras.main.height * scaleFactor
        const scale = textureHeight / this.textures.get(key).getSourceImage().height
        const yShift = textureHeight / 2 + this.cameras.main.height * positionFactor
        return this.add.tileSprite(
            0,
            this.map.heightInPixels - yShift,
            this.map.widthInPixels,
            textureHeight,
            key
        )
            .setTileScale(scale, scale)
            .setScrollFactor(scrollFactor, 1)
    }

    createBackgroundGround (positionFactor, scaleFactor) {
        const textureHeight = this.cameras.main.height * scaleFactor
        let image = this.add.image(this.map.widthInPixels * positionFactor, this.map.heightInPixels - textureHeight / 2, 'background.ground')
        const scale = textureHeight / this.textures.get('background.ground').getSourceImage().height
        image.setScale(scale).setScrollFactor(0.5, 1)
        return image
    }

    create () {
        this.controls = new Controls(this, GameScene.CONFIG)

        const map = this.make.tilemap({ key: 'map' })
        this.map = map
        this.tileSize = map.tileWidth

        const backgroundSky = this.createTiledBackground('background.sky', 0.15, 0.2, 0.8)
        const backgroundClouds = this.createTiledBackground('background.clouds', 0.2, 0.2, 0.4)
        const backgroundSea = this.createTiledBackground('background.sea', 0.3, 0, 0.2)
        const backgroundGround1 = this.createBackgroundGround(0.1, 0.25)
        const backgroundGround2 = this.createBackgroundGround(0.6, 0.2)

        const tileSet = map.addTilesetImage('tileset', 'tiles', this.tileSize, this.tileSize, 1, 2)
        this.platforms = map.createStaticLayer('main', tileSet)
        this.bridges = map.createStaticLayer('bridges', tileSet)
        this.behind = map.createStaticLayer('behind', tileSet)

        this.collisions = map.createStaticLayer('collisions', tileSet).setCollisionByProperty({ collided: true }).setVisible(false)

        const spawnPoint = map.findObject('objects', (object) => object.type === 'player')
        this.player = new Character(this, spawnPoint)

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
            .startFollow(this.player)
            .setLerp(0.3, 0.3)
            .setDeadzone(50, 50)
            .setRoundPixels(true)
            .setBackgroundColor('A1F2EC')

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true)
        this.physics.add.collider(this.player, this.collisions)

        this.achievementsManager = new AchievementsManager(this)

        // this.cameras.main.setRotation(Phaser.Math.DegToRad(90))
        // this.physics.world.gravity.set(6000, 0)
        // this.add.tween(this.cameras.main.setRotation).to({x:2,y:2}, 500, Phaser.Easing.Elastic.Out, true, 100)

        if (DEBUG) {
            const debugGraphics = this.add.graphics().setAlpha(0.75)
            this.collisions.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            })
            this.debugText = this.add.text(this.cameras.main.worldView.x + 20, this.cameras.main.worldView.y + 20, 'Some text', {
                font: '12px',
                fill: 'red'
            }).setScrollFactor(0)
        }
    }

    update (time, delta) {
        this.player.update(delta / 1000)
        if (DEBUG) {
            const pad = this.input.gamepad.gamepads[0]
            if (pad) {
                this.debugText.setText([
                    pad.id,
                    pad.buttons.map((button) => `B${button.index}: ${button.value}`).join(' '),
                    pad.axes.map((axes) => `A${axes.index}: ${axes.getValue()}`).join(' ')
                ])
            }
        }
    }
}
