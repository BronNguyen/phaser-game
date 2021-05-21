import Phaser from 'phaser';
import Smoke from './scenes/Smoke';
import Preloader from './scenes/Preloader';
import Fruit from './scenes/Fruit';
import Example from './scenes/Example';


const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1400,
	height: 1000
	,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: true
		},
	},
	transparent: false,
	scene: [Preloader,Example,Fruit, Smoke, ]
}

export default new Phaser.Game(config)
