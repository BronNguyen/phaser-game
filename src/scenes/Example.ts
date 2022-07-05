import Phaser from "phaser"
import SceneKeys from "../const/SceneKeys"

export default class Example extends Phaser.Scene {
    cameraControl!: Phaser.Cameras.Controls.SmoothedKeyControl

    constructor() {
        super({key:SceneKeys.Example, active: false})
    }

    preload(){

    }

    create() {
        const cursors = this.input.keyboard.createCursorKeys()


        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.35,
            drag: 0.01,
            maxSpeed: 1.0
        }

        this.cameraControl = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig)


        const payload = {
            x: 50,
            y: 200,
            width: 300,
            height: 500,
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
        const graphics = this.add.graphics({x:0,y:0})
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

        const texture = this.textures.createCanvas('foreground', rect.width - 14, rect.height - 20);
        const gradient = texture.context.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, '#000000')
        gradient.addColorStop(1, '#025f9f')

        texture.context.fillStyle = gradient
        texture.context.fillRect(0, 0, rect.width - 12,rect.height - 24)
        texture.refresh();
        const image = this.add.image(rect.left+3 , rect.top+ 6, 'foreground').setOrigin(0);

        //make shadow
        graphics.fillStyle(0x000000,.3)
        graphics.fillRoundedRect(rect.left, rect.bottom - 10, rect.width,   20 ,{tl:0,tr:0, bl:12,br:12})

        //set light
        const radius = rect.width
        const intensity = 0.1
        const attenuation = 0.05
        let light = this.add.pointlight(rect.centerX, rect.centerY - height / 12, 0, radius, intensity, attenuation)
        light.color.setTo(255, 255, 255)

    }


    update (time, delta)
    {
        this.cameraControl.update(delta)
    }
}