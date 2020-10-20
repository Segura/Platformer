import Phaser from 'phaser'
import { Character } from '../character'
import { BUTTONS, Controls } from '../control'
import { AchievementsManager } from '../achievements'

import { GENGameS3Controller } from './GENGameS3Controller'

export class GameScene extends Phaser.Scene {

    static DEFAULT_MAP_OFFSET = 450

    static CONFIG = {
        keyboard: {
            [BUTTONS.LEFT]: Phaser.Input.Keyboard.KeyCodes.LEFT,
            [BUTTONS.RIGHT]:  Phaser.Input.Keyboard.KeyCodes.RIGHT,
            [BUTTONS.UP]:  Phaser.Input.Keyboard.KeyCodes.UP,
            [BUTTONS.DOWN]:  Phaser.Input.Keyboard.KeyCodes.DOWN,
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

    constructor() {
        super({ key: 'GameScene' })
    }

    init() {}

    preload() {}

    create() {
        this.controls = new Controls(this, GameScene.CONFIG)

        let image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        let scaleX = this.cameras.main.width / image.width
        let scaleY = this.cameras.main.height / image.height
        let scale = Math.max(scaleX, scaleY)
        image.setScale(scale).setScrollFactor(0)

        const map = this.make.tilemap({key: 'map'})

        const tileSet = map.addTilesetImage('tileset', 'tiles')
        this.platforms = map.createStaticLayer('main', tileSet)
        this.bridges = map.createStaticLayer('bridges', tileSet)
        this.behind = map.createStaticLayer('behind', tileSet)
        this.collisions = map.createStaticLayer('collisions', tileSet).setCollisionByProperty({ collided: true }).setVisible(false)

        this.tileSize = map.tileWidth

        if (DEBUG) {
            const debugGraphics = this.add.graphics().setAlpha(0.75)
            this.collisions.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            })
        }

        const spawnPoint = map.findObject('objects', (object) => object.type === 'player')
        this.player = new Character(this, spawnPoint)

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels - GameScene.DEFAULT_MAP_OFFSET)
            .startFollow(this.player)
            .setLerp(0.3, 0.3)
            .setDeadzone(50, 50)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true)
        this.physics.add.collider(this.player, this.collisions)

        this.achievementsManager = new AchievementsManager(this)

        // this.cameras.main.setRotation(Phaser.Math.DegToRad(90))
        // this.physics.world.gravity.set(6000, 0)
        // this.add.tween(this.cameras.main.setRotation).to({x:2,y:2}, 500, Phaser.Easing.Elastic.Out, true, 100)

        if (DEBUG) {
            this.debugText = this.add.text(this.cameras.main.worldView.x + 20, this.cameras.main.worldView.y + 20, '', {font: '12px', fill: '#000'}).setScrollFactor(0)
        }
    }

    update(time, delta) {
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
