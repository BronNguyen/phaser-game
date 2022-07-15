import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import Battle from './scenes/Battle';


const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1400,
	height: 1000,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		},
	},
	transparent: true,

	scene: [Preloader, Battle]
}

export default new Phaser.Game(config)
