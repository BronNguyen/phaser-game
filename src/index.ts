import Phaser from 'phaser';
import Smoke from './scenes/Smoke';
import Preloader from './scenes/Preloader';
import Fruit from './scenes/Fruit';
import Example from './scenes/Example';
import PlayerPlugin from './factories/PlayerFactory';
import Battle from './scenes/Battle';
import PluginName from './const/Plugins';


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
	// plugins: {
    //     global: [
    //         { key: PluginName.PlayerPlugin, plugin: PlayerPlugin, start: true }
    //     ]
    // },
	scene: [Preloader, Battle, Example,Fruit, Smoke, ]
}

export default new Phaser.Game(config)
