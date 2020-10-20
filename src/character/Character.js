import Phaser from 'phaser'

import { State, StateMachine, StateTransition } from '../state-machine'
import { BUTTONS } from '../control'
import { CHARACTER_EVENTS } from '../events'

const STATE = {
    RUN_LEFT: 'RUN_LEFT',
    RUN_RIGHT: 'RUN_RIGHT',
    JUMP: 'JUMP',
    CROUCH: 'CROUCH',
    GRAB: 'GRAB',
    JUMP_TOP: 'JUMP_TOP',
    STAND: 'STAND',
    JUMP_UP: 'JUMP_UP',
    JUMP_DOWN: 'JUMP_DOWN',
    GLIDE: 'GLIDE'
}

export class Character extends Phaser.Physics.Arcade.Sprite {

    static JUMP_SPEED = 330
    static RUN_SPEED = 150

    static ACCELERATION = 400
    static DECELERATION = 800
    static AIR_DECELERATION = 150
    static SLIDE_DECELERATION = 100

    static DEFAULT_STAND_ANIMATION_FRAME_RATE = 8
    static MIN_STAND_ANIMATION_FRAME_RATE = 4
    static SLOW_DOWN_STAND_ANIMATION_EVERY_S = 2

    static WIDTH = 20
    static HEIGHT = 30

    constructor (scene, spawnPoint) {
        super(scene, spawnPoint.x, spawnPoint.y, 'character')
        this.spawnPoint = spawnPoint
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setSize(Character.WIDTH, Character.HEIGHT)
        this.setMaxVelocity(Character.RUN_SPEED, Character.JUMP_SPEED)
        this.setImmovable(true)
        // TODO: save/load
        this.info = {
            numberOfDeaths: 0
        }

        this.scene.anims.create({
            key: STATE.STAND,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: Character.DEFAULT_STAND_ANIMATION_FRAME_RATE,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATE.RUN_LEFT,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 8, end: 13 }),
            frameRate: 8,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATE.RUN_RIGHT,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 8, end: 13 }),
            frameRate: 8,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATE.JUMP_UP,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 16, end: 16 }),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: STATE.JUMP_TOP,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 17, end: 17 }),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: STATE.JUMP_DOWN,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 18, end: 18 }),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: STATE.CROUCH,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
            frameRate: 4,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATE.GRAB,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 29, end: 32 }),
            frameRate: 2,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATE.GLIDE,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 24, end: 28 }),
            frameRate: 3,
            repeat: -1
        })

        this.machine = new StateMachine([
            new State(
                STATE.STAND,
                [
                    new StateTransition(this.isFailing, STATE.JUMP_DOWN),
                    new StateTransition(this.isKeyDown, STATE.CROUCH),
                    // TODO: remove repeated jumps
                    new StateTransition(this.isKeyUp, STATE.JUMP_UP, this.onJump),
                    new StateTransition([this.isKeyLeft, this.canMoveLeft], STATE.RUN_LEFT, this.onRunLeft),
                    new StateTransition([this.isKeyRight, this.canMoveRight], STATE.RUN_RIGHT, this.onRunRight),
                ],
                void 0,
                this.onLeaveStand,
                true
            ),
            new State(
                STATE.CROUCH,
                [
                    new StateTransition(this.isKeyDownUp, STATE.STAND, this.onStand),
                ]
            ),
            new State(
                STATE.JUMP_UP,
                [
                    new StateTransition(this.isOnTop, STATE.JUMP_TOP),
                    new StateTransition(this.isCanGrab, STATE.GRAB, this.onGrub),
                ],
                this.ifInAir
            ),
            new State(
                STATE.JUMP_TOP,
                [
                    new StateTransition(this.isFailing, STATE.JUMP_DOWN),
                    new StateTransition(this.isCanGrab, STATE.GRAB, this.onGrub),
                ],
                this.ifInAir
            ),
            new State(
                STATE.JUMP_DOWN,
                [
                    new StateTransition([this.isOnGround, this.isKeyLeft], STATE.RUN_LEFT, this.onRunLeft),
                    new StateTransition([this.isOnGround, this.isKeyRight], STATE.RUN_RIGHT, this.onRunRight),
                    new StateTransition(this.isOnGround, STATE.STAND, this.onStand),
                    new StateTransition(this.isCanGrab, STATE.GRAB, this.onGrub),
                ],
                this.ifInAir
            ),
            new State(
                STATE.RUN_LEFT,
                [
                    new StateTransition(this.isKeyUp, STATE.JUMP_UP, this.onJump),
                    new StateTransition(this.isFailing, STATE.JUMP_DOWN),
                    new StateTransition(this.isKeyDown, STATE.GLIDE, this.onGlide),
                    new StateTransition(this.isKeyRight, STATE.RUN_RIGHT, this.onRunRight),
                    new StateTransition(this.isKeyLeftUp, STATE.STAND, this.onStand),
                    new StateTransition(this.isStop, STATE.STAND, this.onStand),
                ],
                this.ifRun
            ),
            new State(
                STATE.RUN_RIGHT,
                [
                    new StateTransition(this.isKeyUp, STATE.JUMP_UP, this.onJump),
                    new StateTransition(this.isFailing, STATE.JUMP_DOWN),
                    new StateTransition(this.isKeyDown, STATE.GLIDE, this.onGlide),
                    new StateTransition(this.isKeyLeft, STATE.RUN_LEFT, this.onRunLeft),
                    new StateTransition(this.isKeyRightUp, STATE.STAND, this.onStand),
                    new StateTransition(this.isStop, STATE.STAND, this.onStand),
                ],
                this.ifRun
            ),
            new State(
                STATE.GLIDE,
                [
                    new StateTransition(this.isKeyUp, STATE.JUMP_UP, this.onJump),
                    new StateTransition(this.isFailing, STATE.JUMP_DOWN),
                    new StateTransition(this.isStop, STATE.STAND, this.onStand),
                    // TODO: new StateTransition(???, STATE.CROUCH),
                ],
                this.ifGlide
            ),
            new State(
                STATE.GRAB,
                [
                    new StateTransition(this.isKeyDown, STATE.JUMP_DOWN, this.onDrop),
                ]
            )
        ], this.onChangeState)

        this.reset()
    }

    isStop = () => this.body.velocity.x === 0
    isOnGround = () => this.body.onFloor()
    isKeyDown = () => this.scene.controls.isDown(BUTTONS.DOWN)
    isKeyDownUp = () => this.scene.controls.isUp(BUTTONS.DOWN)
    isKeyLeft = () => this.scene.controls.isDown(BUTTONS.LEFT)
    isKeyLeftUp = () => this.scene.controls.isUp(BUTTONS.LEFT)
    isKeyRight = () => this.scene.controls.isDown(BUTTONS.RIGHT)
    isKeyRightUp = () => this.scene.controls.isUp(BUTTONS.RIGHT)
    isKeyUp = () => this.scene.controls.isDown(BUTTONS.UP)
    isKeyUpUp = () => this.scene.controls.isUp(BUTTONS.UP)
    isFailing = () => this.body.velocity.y > 0
    isOnTop = () => Math.abs(this.body.velocity.y) < Character.JUMP_SPEED / 3
    isCanJump = () => this.canJump
    isCanGrab = () => {
        if (!this.canGrab) {
            return false
        }
        const tileSize = this.scene.tileSize
        const right = this.x + this.body.halfWidth
        const top = this.y - this.body.halfHeight
        const tileX = Math.floor(right / tileSize)
        const tileY = Math.floor(top / tileSize)
        // TODO: left/right

        return this.scene.platforms.findTile(this.isNearToGrub, null, tileX, tileY, 1, 1, { isNotEmpty: true, isColliding: true })
    }

    isNearToGrub = (tile) => Phaser.Math.Distance.Between(this.x + this.body.halfWidth, this.y - this.body.halfHeight, tile.pixelX, tile.pixelY) < 1

    canMoveLeft = () => !this.body.blocked.left
    canMoveRight = () => !this.body.blocked.right

    onStand = () => {
        if (this.isKeyUpUp()) {
            // TODO: other states
            this.canJump = true
        }
        this.standDuration = 0
        this.setAccelerationX(0)
        this.setVelocityX(0)
        this.idleTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: this.onStandEverySecond,
            loop: true
        });
    }

    onRunLeft = () => {
        this.isMovingForward = false
        if (this.body.velocity.x > 0) {
            this.setVelocityX(0)
        }
        this.setAccelerationX(-Character.ACCELERATION)
    }

    onRunRight = () => {
        this.isMovingForward = true
        if (this.body.velocity.x < 0) {
            this.setVelocityX(0)
        }
        this.setAccelerationX(Character.ACCELERATION)
    }

    onGlide = () => {
        this.setAccelerationX(0)
    }

    onJump = () => {
        this.setAccelerationX(0)
        this.setVelocityY(-Character.JUMP_SPEED)
        this.canJump = false
    }

    onGrub = () => {
        this.canGrab = false
        this.setAcceleration(0, 0)
        this.setVelocity(0, 0)
        this.body.moves = false
    }

    onDrop = () => {
        this.body.moves = true
    }

    onDie = () => {
        this.info.numberOfDeaths += 1
        this.scene.events.emit(CHARACTER_EVENTS.DIE, this.info.numberOfDeaths)
        return this.reset()
    }

    onChangeState = (newState) => {
        console.log(`Set state '${newState}'`)
        this.updateAnimation(newState)
    }

    onStandEverySecond = () => {
        this.standDuration += 1
        const newRate = Character.DEFAULT_STAND_ANIMATION_FRAME_RATE - this.standDuration / Character.SLOW_DOWN_STAND_ANIMATION_EVERY_S
        this.anims.msPerFrame = 1000 / Math.max(Character.MIN_STAND_ANIMATION_FRAME_RATE, newRate)
        this.scene.events.emit(CHARACTER_EVENTS.IDLE, this.standDuration)
    }

    ifRun = () => {
        this.canGrab = true
    }

    ifGlide = (delta) => {
        this.slowDownByX(Character.SLIDE_DECELERATION, delta)
    }

    ifInAir = (delta) => {
        if (this.isKeyLeft() && this.isMovingForward || this.isKeyRight() && !this.isMovingForward) {
            this.slowDownByX(Character.AIR_DECELERATION, delta)
        }
    }

    onLeaveStand = () => {
        if (this.idleTimer) {
            this.idleTimer.remove()
        }
    }

    update (delta) {
        if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds()) || this.scene.controls.isDown(BUTTONS.RESET)) {
            return this.onDie()
        }

        this.machine.update(delta)
    }

    updateAnimation (state) {
        this.flipX = !this.isMovingForward
        this.anims.play(state, true)
    }

    reset () {
        this.setPosition(this.spawnPoint.x, this.spawnPoint.y)
        this.setVelocity(0, 0)
        this.setAcceleration(0, 0)
        this.machine.reset()
        this.isMovingForward = true
        this.canJump = false
        this.canGrab = false
        this.body.moves = true
    }

    slowDownByX (slowDownSpeed, delta) {
        const sign = Math.sign(this.body.velocity.x)
        const absoluteValue = Math.abs(this.body.velocity.x)
        const lowedValue = absoluteValue - slowDownSpeed * delta
        this.setVelocityX(sign * Math.max(0, lowedValue))
    }
}
