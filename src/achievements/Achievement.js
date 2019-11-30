import Phaser from 'phaser'

export class Achievement extends Phaser.GameObjects.Container  {

    static WIDTH = 240
    static HEIGHT = 94
    static HALF_WIDTH = Achievement.WIDTH / 2
    static HALF_HEIGHT = Achievement.HEIGHT / 2
    static DEFAULT_TEXT_STYLE = { fontFamily: 'Arial', fontSize: '12px' }

    constructor (scene, title, description, icon) {
        super(scene, 0, 0)

        this.setSize(Achievement.WIDTH, Achievement.HEIGHT)
        this.setPosition(this.scene.cameras.main.width - Achievement.HALF_WIDTH - 16, this.scene.cameras.main.height + Achievement.HALF_HEIGHT)
        this.setScrollFactor(0)

        this.add(this.createBackground())
        this.add(this.createIcon(icon))
        this.add(this.createTitle(title))
        this.add(this.createDescription(description))

        this.scene.tweens.add({
            y: '-=96',
            targets: this,
            duration: 300,
            ease: 'Linear',
            hold: 3000,
            yoyo: true,
            onComplete: () => { this.destroy() }
        })
    }

    createBackground = () => {
        if (!this.scene.textures.exists('achievement-background')) {
            const texture = this.scene.textures.createCanvas('achievement-background', Achievement.WIDTH, Achievement.HEIGHT)
            const context = texture.getContext()
            const gradient = context.createLinearGradient(0, 0, 0, Achievement.HEIGHT)
            gradient.addColorStop(0, '#353535')
            gradient.addColorStop(1, '#010000')
            context.fillStyle = gradient
            context.fillRect(0, 0, Achievement.WIDTH, Achievement.HEIGHT)
            texture.refresh()
        }
        return new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'achievement-background')
    }

    createIcon = (icon) =>
        new Phaser.GameObjects.Sprite(this.scene, 0, 0, icon)
            .setPosition(-Achievement.HALF_WIDTH + 15, -Achievement.HALF_HEIGHT + 15)
            .setSize(64, 64)
            .setOrigin(0, 0)

    createText = (y, text, style = {}) =>
        new Phaser.GameObjects.Text(this.scene, -Achievement.HALF_WIDTH + 15 + 64 + 10, y, text, { ...Achievement.DEFAULT_TEXT_STYLE, ...style }).setOrigin(0, 0.5)

    createTitle = (text) => this.createText(-13, text, { fontStyle: 'bold' })

    createDescription = (text) => this.createText(13, text)
}
