import Phaser from 'phaser'
import { Character } from '../character'
import { Slime } from '../enemies'
import { Controls } from '../control'
import { BUTTONS_EVENTS } from '../events'
import { AchievementsManager } from '../achievements'

import { GENGameS3Controller } from './GENGameS3Controller'

export class GameScene extends Phaser.Scene {

    static DEFAULT_MAP_OFFSET = 450

    static CONFIG = {
        keyboard: {
            [Phaser.Input.Keyboard.KeyCodes.LEFT]: BUTTONS_EVENTS.LEFT,
            [Phaser.Input.Keyboard.KeyCodes.RIGHT]: BUTTONS_EVENTS.RIGHT,
            [Phaser.Input.Keyboard.KeyCodes.UP]: BUTTONS_EVENTS.UP,
            [Phaser.Input.Keyboard.KeyCodes.DOWN]: BUTTONS_EVENTS.DOWN,
            [Phaser.Input.Keyboard.KeyCodes.R]: BUTTONS_EVENTS.RESET,
        },
        gamepad: {
            [GENGameS3Controller.LEFT]: BUTTONS_EVENTS.LEFT,
            [GENGameS3Controller.RIGHT]: BUTTONS_EVENTS.RIGHT,
            [GENGameS3Controller.UP]: BUTTONS_EVENTS.UP,
            [GENGameS3Controller.A]: BUTTONS_EVENTS.UP,
            [GENGameS3Controller.DOWN]: BUTTONS_EVENTS.DOWN,
            [GENGameS3Controller.START]: BUTTONS_EVENTS.RESET
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
        this.platforms.setCollisionByProperty({ collided: true })
        this.bridges.setCollisionByProperty({ collided: true })

        this.tileSize = map.tileWidth

        if (DEBUG) {
            const debugGraphics = this.add.graphics().setAlpha(0.75)
            this.platforms.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            })
            this.bridges.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            })
        }

        const spawnPoint = map.findObject('objects', (object) => object.type === 'player')
        this.player = new Character(this, spawnPoint)

        this.enemies = []

        map.filterObjects('objects', (object) => object.type === 'slime').forEach((spawnPoint) => {
            const slime = new Slime(this, spawnPoint)
            this.physics.add.collider(slime, this.platforms)
            this.physics.add.collider(slime, this.bridges)
            this.physics.add.collider(slime, this.player)
            this.enemies.push(slime)
        })

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels - GameScene.DEFAULT_MAP_OFFSET)
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setLerp(0.3, 0.3)
        this.cameras.main.setDeadzone(50, 50)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true)
        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.bridges)

        this.achievementsManager = new AchievementsManager(this)

        // this.cameras.main.setRotation(Phaser.Math.DegToRad(90))
        // this.physics.world.gravity.set(6000, 0)
        // this.add.tween(this.cameras.main.setRotation).to({x:2,y:2}, 500, Phaser.Easing.Elastic.Out, true, 100)

        if (DEBUG) {
            this.debugText = this.add.text(this.cameras.main.worldView.x + 20, this.cameras.main.worldView.y + 20, '', {font: '12px', fill: '#000'}).setScrollFactor(0)
        }
    }

    handleInput = (event) => {
        this.player.handleInput(event)
    }

    update (time, delta) {
        this.player.update(delta / 1000)
        // this.enemies.forEach((enemy) => enemy.update(delta / 1000))
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
