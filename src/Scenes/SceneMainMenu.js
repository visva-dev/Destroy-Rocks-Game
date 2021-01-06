/* eslint-disable no-plusplus */
import * as Phaser from 'phaser';
import ScrollingBackground from '../Objects/ScrollingBackground';

export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
  }

  preload() {
    this.load.image('sprBg0', 'assets/ui/sprBg0.png');
    this.load.image('sprBg1', 'assets/ui/sprBg1.png');
    this.load.image('sprBtnPlay', 'assets/ui/sprBtnPlay.png');
    this.load.image('sprBtnPlayHover', 'assets/ui/sprBtnPlayHover.png');
    this.load.image('sprBtnPlayDown', 'assets/ui/sprBtnPlayDown.png');
    this.load.image('sprBtnRestart', 'assets/ui/sprBtnRestart.png');
    this.load.image('sprBtnRestartHover', 'assets/ui/sprBtnRestartHover.png');
    this.load.image('sprBtnRestartDown', 'assets/ui/sprBtnRestartDown.png');
    this.load.audio('sndBtnOver', 'assets/sounds/sndBtnOver.wav');
    this.load.audio('sndBtnDown', 'assets/sounds/sndBtnDown.wav');
  }

  create() {
    this.sfx = {
      btnOver: this.sound.add('sndBtnOver'),
      btnDown: this.sound.add('sndBtnDown'),
    };

    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'sprBtnPlay',
    );

    this.btnPlay.setInteractive();

    this.btnPlay.on(
      'pointerover',
      function () {
        this.btnPlay.setTexture('sprBtnPlayHover');
        this.sfx.btnOver.play();
      },
      this,
    );

    this.btnPlay.on('pointerout', function () {
      this.setTexture('sprBtnPlay');
    });

    this.btnPlay.on(
      'pointerdown',
      function () {
        this.btnPlay.setTexture('sprBtnPlayDown');
        this.sfx.btnDown.play();
      },
      this,
    );

    this.btnPlay.on(
      'pointerup',
      function () {
        this.btnPlay.setTexture('sprBtnPlay');
        this.scene.start('SceneMain');
      },
      this,
    );

    this.title = this.add.text(
      this.game.config.width * 0.5,
      128,
      'SPACE SHOOTER',
      {
        fontFamily: 'monospace',
        fontSize: 48,
        fontStyle: 'bold',
        color: '#ffffff',
        align: 'center',
      },
    );
    this.title.setOrigin(0.5);

    this.backgrounds = [];
    for (let i = 0; i < 5; i++) {
      const keys = ['sprBg0', 'sprBg1'];
      const key = keys[Phaser.Math.Between(0, keys.length - 1)];
      const bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }
  }

  update() {
    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}
