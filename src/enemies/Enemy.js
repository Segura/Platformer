import Phaser from 'phaser'

import { State, StateMachine } from '../state-machine'

const STATE = {
    STAND: 'STAND',
    MOVE_LEFT: 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    ATTACK: 'ATTACK',
    DEATH: 'DEATH',
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    static MOVE_SPEED = 50
    static WIDTH = 28
    static HEIGHT = 20

    constructor (scene, spawnPoint, sprite) {
        super(scene, spawnPoint.x, spawnPoint.y, sprite)
        this.spawnPoint = spawnPoint
        this.sprite = sprite
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setSize(Enemy.WIDTH, Enemy.HEIGHT)
        this.setMaxVelocity(Enemy.MOVE_SPEED)
        this.setImmovable(true)

        this.scene.anims.create({
            key: `${this.sprite}-${STATE.STAND}`,
            frames: this.scene.anims.generateFrameNumbers(this.sprite, { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        })
        this.scene.anims.create({
            key: `${this.sprite}-${STATE.ATTACK}`,
            frames: this.scene.anims.generateFrameNumbers(this.sprite, { start: 9, end: 12 }),
            frameRate: 4,
            repeat: 1
        })
        this.scene.anims.create({
            key: STATE.MOVE_LEFT,
            frames: this.scene.anims.generateFrameNumbers(this.sprite, { start: 4, end: 8 }),
            frameRate: 4,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATE.MOVE_RIGHT,
            frames: this.scene.anims.generateFrameNumbers(this.sprite, { start: 4, end: 8 }),
            frameRate: 4,
            repeat: -1
        })

        this.machine = new StateMachine([
            new State(
                STATE.STAND,
                [

                ],
                {
                    isDefault: true
                }
            ),
            new State(
                STATE.MOVE_LEFT,
                [

                ]
            ),
            new State(
                STATE.MOVE_RIGHT,
                [

                ]
            ),
        ], this.onChangeState)

        this.reset()
    }

    onDie = () => {
        this.info.numberOfDeaths += 1
        return this.reset()
    }

    onChangeState = (newState) => {
        console.log(`Set enemy state '${newState}'`)
        this.updateAnimation(newState)
    }

    update (delta) {
        this.machine.update(delta)
    }

    updateAnimation (state) {
        this.flipX = !this.isMovingForward
        this.anims.play(`${this.sprite}-${state}`, true)
    }

    reset () {
        this.setPosition(this.spawnPoint.x, this.spawnPoint.y)
        this.setVelocity(0, 0)
        this.setAcceleration(0, 0)
        this.machine.reset()
        this.isMovingForward = true
    }
}
