import Phaser from 'phaser'

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

        const map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('tileset', 'tiles');
        const platforms = map.createStaticLayer('main', tileset);
        const bridges = map.createStaticLayer('bridges', tileset);
        const behind = map.createStaticLayer('behind', tileset);
        platforms.setCollisionByProperty({ collided: true })
        bridges.setCollisionByProperty({ collided: true })

        this.playerTile = map.findByIndex(1, 0, false, 'player')

        if (DEBUG) {
            const debugGraphics = this.add.graphics().setAlpha(0.75);
            platforms.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            });
            bridges.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            });
        }

        this.player = this.physics.add.sprite(this.playerTile.pixelX, this.playerTile.pixelY, 'character')
        this.player.setSize(20, 30)

        this.cameras.main.startFollow(this.player)

        this.physics.add.collider(this.player, platforms)
        this.physics.add.collider(this.player, bridges)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true)
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        const idleAnimation = this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });
        const runAnimation = this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('character', { start: 8, end: 13 }),
            frameRate: 8,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update () {
        if (this.cursors.left.isDown)
        {
            this.player.flipX = true
            this.player.setVelocityX(-160);
            this.player.anims.play('run', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.flipX = false
            this.player.setVelocityX(160);
            this.player.anims.play('run', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
        }
        if (this.cursors.up.isDown && this.player.body.blocked.down)
        {
            this.player.setVelocityY(-330);
        }

        if (!Phaser.Geom.Rectangle.Overlaps(this.physics.world.bounds, this.player.getBounds())) {
            this.player.setPosition(this.playerTile.pixelX, this.playerTile.pixelY)
        }
    }
}
