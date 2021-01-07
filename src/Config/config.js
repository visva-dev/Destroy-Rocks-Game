import * as Phaser from 'phaser';
import SceneMainMenu from '../Scenes/SceneMainMenu';
import SceneMain from '../Scenes/SceneMain';
import SceneGameOver from '../Scenes/SceneGameOver';

const config = {
  type: Phaser.WEBGL,
  width: 480,
  height: 640,
  backgroundColor: 'black',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [SceneMainMenu, SceneMain, SceneGameOver],
  pixelArt: true,
  roundPixels: true,
};

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.start('Entity');
  }
}

window.onload = () => {
  window.game = new Game();
};