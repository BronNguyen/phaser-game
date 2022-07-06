import Phaser from "phaser"

export default class PopupContainer extends Phaser.GameObjects.Container{
    scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        super(scene)
        this.scene = scene

        const payload = {
            x: 50,
            y: 200,
            width: 600,
            height: 1000,
            background: 0x000000,
            rightCorner: 0x03609d,
            rightEdge: 0x0674b4,
            bottomEdge: 0x01467f,
            foreground: 0x025f9f
        }

        this.createPopup({payload})
    }

    createPopup = ({payload}): void => {
        const {x, y, width, height, background, rightCorner, rightEdge, bottomEdge, foreground} = payload
        const graphics = this.scene.add.graphics({x: 0, y: 0})
        const rect = new Phaser.Geom.Rectangle(x,y, width, height)

        //black bg
        graphics.fillStyle(background)
        graphics.fillRoundedRect(rect.left,rect.top, rect.width, rect.height, {tl:8,tr:8, bl:4,br:4})

        //bottom right corner
        graphics.fillStyle(rightCorner)
        graphics.fillRoundedRect(rect.left+3, rect.bottom - 50, rect.width - 6, 50 - 6,{tl:0,tr:0, bl:30,br:8})

        //cyan color right edge
        graphics.fillStyle(rightEdge)
        graphics.fillRoundedRect(rect.left+3, rect.top+ 3, rect.width - 6, rect.height - 19,{tl:8,tr:8, bl:30,br:12})

        //bottom 3d line
        graphics.fillStyle(bottomEdge)
        graphics.fillRoundedRect(rect.left+3, rect.bottom - 50, rect.width - 12, 50 - 6,{tl:8,tr:0, bl:8,br:0})

        //gradient fg
        graphics.fillStyle(foreground)
        graphics.fillRoundedRect(rect.left+3, rect.top+ 6, rect.width - 12, rect.height - 24,{tl:8,tr:8, bl:6,br:0})

        //make shadow
        graphics.fillStyle(0x000000,.3)
        graphics.fillRoundedRect(rect.left, rect.bottom - 10, rect.width,   20 ,{tl:0,tr:0, bl:12,br:12})
    }
}
