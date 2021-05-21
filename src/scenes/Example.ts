import Phaser from "phaser";
import SceneKeys from "../const/SceneKeys";

export default class Example extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Example)
    }
    create() {
        this.add.image(400, 16, 'bg').setOrigin(0.5, 0);

        for (var i = 0; i < 13; i++)
        {
            this.add.image(64 * i, 536, 'tiles', 1).setOrigin(0);
        }

        var text = this.add.text(400, 8, 'Click to play animation chain', { color: '#ffffff' }).setOrigin(0.5, 0);

        //  Our animations
        this.anims.create({
            key: 'guardStart',
            frames: this.anims.generateFrameNames('knight', { prefix: 'guard_start/frame', start: 0, end: 3, zeroPad: 4 }),
            frameRate: 8
        });

        this.anims.create({
            key: 'guard',
            frames: this.anims.generateFrameNames('knight', { prefix: 'guard/frame', start: 0, end: 5, zeroPad: 4 }),
            frameRate: 8,
            repeat: 2
        });

        this.anims.create({
            key: 'guardEnd',
            frames: this.anims.generateFrameNames('knight', { prefix: 'guard_end/frame', start: 0, end: 3, zeroPad: 4 }),
            frameRate: 8
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('knight', { prefix: 'idle/frame', start: 0, end: 5, zeroPad: 4 }),
            frameRate: 8,
            repeat: -1
        });

        var lancelot = this.add.sprite(500, 536,"knight")

        lancelot.setOrigin(0.5, 1);
        lancelot.setScale(10);
        lancelot.play('idle');

        lancelot.on(Phaser.Animations.Events.ANIMATION_START, function (anim) {

            text.setText('Playing ' + anim.key);

        });

        this.input.on('pointerdown', function () {

            if (lancelot.anims.getName() === 'idle')
            {
                lancelot.playAfterRepeat('guardStart');
                lancelot.chain([ 'guard', 'guardEnd', 'idle' ]);
            }

        }, this);
    }
}