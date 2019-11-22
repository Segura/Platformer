import Phaser from 'phaser'

export class Character extends Phaser.Physics.Arcade.Sprite {

    static JUMP_SPEED = 330
    static RUN_SPEED = 150

    static ACCELERATION = 400
    static AIR_DECELERATION = 150

    constructor ({ scene, spawnPoint, asset }) {
        super(scene, spawnPoint.x, spawnPoint.y, asset)
        this.spawnPoint = spawnPoint
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setSize(20, 30)
        this.setMaxVelocity(Character.RUN_SPEED, Character.JUMP_SPEED)

        this.reset()

        this.idleAnimation = this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        })
        this.runAnimation = this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 8, end: 13 }),
            frameRate: 8,
            repeat: -1
        })
        this.jumpUpAnimation = this.scene.anims.create({
            key: 'jumpUp',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 16, end: 16 }),
            frameRate: 1,
            repeat: 1
        })
        this.jumpTopAnimation = this.scene.anims.create({
            key: 'jumpTop',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 17, end: 17 }),
            frameRate: 1,
            repeat: 1
        })
        this.jumpDownAnimation = this.scene.anims.create({
            key: 'jumpDown',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 18, end: 18 }),
            frameRate: 1,
            repeat: 1
        })
        this.crouchAnimation = this.scene.anims.create({
            key: 'crouch',
            frames: this.scene.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
            frameRate: 4,
            repeat: -1
        })
    }

    update (delta) {
        if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds()) || this.scene.resetKey.isDown) {
            return this.reset()
        }

        this.isJump = !this.body.blocked.down
        this.onGround = this.body.blocked.down
        this.isCrouch = this.scene.cursors.down.isDown && this.onGround
        this.isStand = !this.isJump && !this.isCrouch

        if (this.scene.cursors.up.isDown && !this.isJump && this.canJump) {
            this.setVelocityY(-Character.JUMP_SPEED)
            this.canJump = false
        }
        if (!this.isJump && this.scene.cursors.up.isUp) {
            this.canJump = true
        }

        if (this.isStand) {
            if (this.isMovingForward !== this.body.velocity.x > 0) {
                this.setVelocityX(0)
            }
            if (this.scene.cursors.left.isDown) {
                this.isMovingForward = false
                this.setAccelerationX(-Character.ACCELERATION)
            } else if (this.scene.cursors.right.isDown) {
                this.isMovingForward = true
                this.setAccelerationX(Character.ACCELERATION)
            } else {
                this.setAccelerationX(0)
                this.setVelocityX(0)
            }
        } else if (this.isJump) {
            this.setAccelerationX(0)
            if (this.scene.cursors.left.isDown && this.isMovingForward) {
                this.setVelocityX(Math.max(0, this.body.velocity.x - Character.AIR_DECELERATION * delta))
            } else if (this.scene.cursors.right.isDown && !this.isMovingForward) {
                this.setVelocityX(Math.min(0, this.body.velocity.x + Character.AIR_DECELERATION * delta))
            }
            if (this.scene.cursors.up.isUp) {
                this.setVelocityY(this.body.velocity.y + Character.AIR_DECELERATION * delta)
            }
            if (this.body.blocked.left || this.body.blocked.right) {
                this.setAccelerationX(0)
                this.setVelocityX(0)
            }
        }

        this.setAnimation()
    }

    setAnimation() {
        this.flipX = !this.isMovingForward
        if (this.isCrouch) {
            this.anims.play(this.crouchAnimation, true)
        } else if (this.isJump) {
            if (Math.abs(this.body.velocity.y) < Character.JUMP_SPEED / 3) {
                this.anims.play(this.jumpTopAnimation, true)
            } else if (this.body.velocity.y < 0) {
                this.anims.play(this.jumpUpAnimation, true)
            } else {
                this.anims.play(this.jumpDownAnimation, true)
            }
        } else if (this.body.velocity.x !== 0) {
            this.anims.play('run', true)
        } else {
            this.anims.play(this.idleAnimation, true)
        }
    }

    reset() {
        this.setPosition(this.spawnPoint.x, this.spawnPoint.y)
        this.setVelocityX(0)
        this.setVelocityY(0)
        this.isMovingForward = true
        this.canJump = true
    }
}
