export default class CameraController {
    controls: Phaser.Cameras.Controls.SmoothedKeyControl

    constructor(scene) {
        const cursors = scene.input.keyboard.createCursorKeys();

        const controlConfig = {
            camera: scene.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            acceleration: 0.6,
            drag: 0.5,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        const cam = scene.cameras.main;
    }

    update(timer, delta) {
        this.controls.update(delta);
    }
}