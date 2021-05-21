import Phaser from "phaser";
import SceneKeys from "../const/SceneKeys";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Preloader);
      }
}