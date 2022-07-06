import Phaser from "phaser";
import SceneKeys from "../const/SceneKeys";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }
  preload() {
    this.load.image("player", "assets/game-objects/player.png");
    this.load.image("horse", "assets/game-objects/horse.png");
    this.load.atlas(
      "dices",
      "assets/game-objects/dices.png",
      "assets/game-objects/dices.json"
    );
    this.load.atlas(
      "flares",
      "assets/particles/flares.png",
      "assets/particles/flares.json"
    );
    this.load.image("dark-smoke", "assets/particles/smoke-puff.png");
    this.load.image("white-smoke", "assets/particles/smoke0.png");
    this.load.image("fire", "assets/particles/muzzleflash3.png");
    this.load.image("spark0", "assets/particles/blue.png");
    this.load.image("spark1", "assets/particles/red.png");
    this.load.spritesheet("veg", "assets/sprites/fruitnveg64wh37.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.atlas(
      "knight",
      "assets/animations/knight.png",
      "assets/animations/knight.json"
    );
    this.load.image("bg", "assets/skies/clouds.png");
    this.load.spritesheet("tiles", "assets/tilemaps/tiles/fantasy-tiles.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.scene.start(SceneKeys.Battle);
  }
}
