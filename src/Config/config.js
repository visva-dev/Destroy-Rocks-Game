import * as Phaser from 'phaser';
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin';
import SceneMain from '../Scenes/SceneMain';
import SceneMainMenu from '../Scenes/SceneMainMenu';
import SceneGameOver from '../Scenes/SceneGameOver';

const seedRand = Date.now();

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
  dom: {
    createContainer: true,
  },
  seed: [seedRand],
  plugins: {
    global: [{
      key: 'rexInputTextPlugin',
      plugin: InputTextPlugin,
      start: true,
    }],
  },
};

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.start('SceneMainMenu');
  }
}

window.onload = () => {
  window.game = new Game();
};

window.global = {
  signature: 'Made by Visvaldas Rapalis',
  score: 0,
  emitter: null,
};