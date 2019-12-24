import Phaser from 'phaser'

import { StateMachine } from '../state-machine'
import { BUTTONS_EVENTS, CHARACTER_EVENTS } from '../events'

import { stateMachineConfig } from './state-machine-config'

import { STATES } from './states'

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
            key: STATES.STAND,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: Character.DEFAULT_STAND_ANIMATION_FRAME_RATE,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATES.RUN_LEFT,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 8, end: 13 }),
            frameRate: 8,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATES.RUN_RIGHT,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 8, end: 13 }),
            frameRate: 8,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATES.JUMP_UP,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 16, end: 16 }),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: STATES.JUMP_TOP,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 17, end: 17 }),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: STATES.JUMP_DOWN,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 18, end: 18 }),
            frameRate: 1,
            repeat: 1
        })
        this.scene.anims.create({
            key: STATES.CROUCH,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
            frameRate: 4,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATES.GRAB,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 29, end: 32 }),
            frameRate: 2,
            repeat: -1
        })
        this.scene.anims.create({
            key: STATES.GLIDE,
            frames: this.scene.anims.generateFrameNumbers('character', { start: 24, end: 28 }),
            frameRate: 3,
            repeat: -1
        })

        this.machine = new StateMachine(stateMachineConfig(this), this.onChangeState)

        this.reset()
    }

    isStop = () => this.body.velocity.x === 0
    isOnGround = () => this.body.onFloor()
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
        // if (this.isKeyUpUp()) {
        //     // TODO: other states
        //     this.canJump = true
        // }
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
        // if (this.isKeyLeft() && this.isMovingForward || this.isKeyRight() && !this.isMovingForward) {
        //     this.slowDownByX(Character.AIR_DECELERATION, delta)
        // }
    }

    onLeaveStand = () => {
        if (this.idleTimer) {
            this.idleTimer.remove()
        }
    }

    handleInput = (event) => {
        if (event === BUTTONS_EVENTS.RESET.RELEASED) {
            return this.onDie()
        }
        this.machine.handleEvent(event)
    }

    update (delta) {
        if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())/* || this.scene.controls.isDown(BUTTONS.RESET)*/) {
            return this.onDie()
        }
        if (this.isStop()) {
            this.machine.handleEvent(CHARACTER_EVENTS.STOP)
        }
        if (this.isFailing()) {
            this.machine.handleEvent(CHARACTER_EVENTS.FAILING)
        }
        if (this.isOnTop()) {
            this.machine.handleEvent(CHARACTER_EVENTS.STOP_ELEVATION)
        }
        if (this.isOnGround()) {
            this.machine.handleEvent(CHARACTER_EVENTS.ON_GROUND)
        }
        if (this.isCanGrab()) {
            this.machine.handleEvent(CHARACTER_EVENTS.CAN_GRUB)
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
