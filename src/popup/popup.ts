import Phaser from "phaser"

const { GAMEOBJECT_POINTER_UP } = Phaser.Input.Events

export default class PopupContainer extends Phaser.GameObjects.Container{
    scene: Phaser.Scene
    graphics: Phaser.GameObjects.Graphics
    background!: Phaser.GameObjects.Container
    moveText: Phaser.GameObjects.Text
    spawnText: Phaser.GameObjects.Text
    backgroundWidth = 0
    backgroundHeight = 0

    constructor(scene: Phaser.Scene) {
        super(scene, 250, 50)
        this.width = 400
        this.displayWidth = 400
        this.height = 300
        this.displayHeight = 300
        this.scene = scene
        this.graphics = this.scene.add.graphics({x: 0, y: 0})
        const { width, height } = this.scene.sys.game.scale.gameSize
        this.backgroundWidth = width
        this.backgroundHeight = height

        this.moveText = this.scene.add.text(0,0, 'Move',  { font: '32px Arial', color: '#ff0000' })
        this.moveText.setInteractive()
        this.spawnText = this.scene.add.text(0,0, 'Spawn',  { font: '32px Arial', color: '#ffff00' })
        this.spawnText.setInteractive()
        this.add(this.spawnText)
        this.add(this.moveText)

        this.scene.add.existing(this)
        this.createBackground()
    }

    drawPopup() {
        const background = 0x000000
        const rightCorner = 0x03609d
        const rightEdge = 0x0674b4
        const bottomEdge = 0x01467f
        const foreground = 0x025f9f

        const rect = new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height)

        //black bg
        this.graphics.fillStyle(background)
        this.graphics.fillRoundedRect(rect.left,rect.top, rect.width, rect.height, {tl:8,tr:8, bl:4,br:4})

        //bottom right corner
        this.graphics.fillStyle(rightCorner)
        this.graphics.fillRoundedRect(rect.left+3, rect.bottom - 50, rect.width - 6, 50 - 6,{tl:0,tr:0, bl:30,br:8})

        //cyan color right edge
        this.graphics.fillStyle(rightEdge)
        this.graphics.fillRoundedRect(rect.left+3, rect.top+ 3, rect.width - 6, rect.height - 19,{tl:8,tr:8, bl:30,br:12})

        //bottom 3d line
        this.graphics.fillStyle(bottomEdge)
        this.graphics.fillRoundedRect(rect.left+3, rect.bottom - 50, rect.width - 12, 50 - 6,{tl:8,tr:0, bl:8,br:0})

        //gradient fg
        this.graphics.fillStyle(foreground)
        this.graphics.fillRoundedRect(rect.left+3, rect.top+ 6, rect.width - 12, rect.height - 24,{tl:8,tr:8, bl:6,br:0})

        //make shadow
        this.graphics.fillStyle(0x000000,.3)
        this.graphics.fillRoundedRect(rect.left, rect.bottom - 10, rect.width,   20 ,{tl:0,tr:0, bl:12,br:12})
    }

    createBackground() {
        this.background = new Phaser.GameObjects.Container(this.scene, this.backgroundWidth/2, this.backgroundHeight/2)
        this.background.setSize(this.backgroundWidth, this.backgroundHeight)
        this.background.setInteractive()
        this.initCloseEvent()
    }

    drawBackground() {
        this.graphics.fillStyle(0x000000, 0.7)
        this.graphics.fillRect(0, 0, this.backgroundWidth, this.backgroundHeight)
    }

    open() {
        this.drawBackground()
        this.drawPopup()

        Phaser.Display.Align.In.LeftCenter(this.moveText, this)
        Phaser.Display.Align.In.RightCenter(this.spawnText, this, -90)
    }

    close() {
        this.graphics.clear()
        this.setActive(false)
        this.setVisible(false)
    }

    initCloseEvent() {
        this.moveText.on(GAMEOBJECT_POINTER_UP, this.close, this)
        this.spawnText.on(GAMEOBJECT_POINTER_UP, this.close, this)
    }

    initOpenEvent() {
        this.scene.events.on('open-popup', this.open, this)
    }

    onDestroy() {
        this.background.off(GAMEOBJECT_POINTER_UP, this.close, this)
        this.scene.events.off('open-popup', this.open, this)
    }

}
