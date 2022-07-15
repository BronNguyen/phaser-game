import Phaser from "phaser";
import SceneKeys from "../const/SceneKeys";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }
  preload() {
    this.load.image("arrow", "assets/game-objects/arrow.png");
    this.load.image("player", "assets/game-objects/player.png");
    this.load.image("horse", "assets/game-objects/horse.png");
    this.load.atlas(
      "dices",
      "assets/game-objects/dices.png",
      "assets/game-objects/dices.json"
    );
  }

  create() {
    this.scene.start(SceneKeys.Battle);
  }
}
