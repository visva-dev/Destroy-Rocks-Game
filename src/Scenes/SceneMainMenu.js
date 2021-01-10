/* eslint-disable no-plusplus */
import * as Phaser from 'phaser';
import STYLE from '../styles/style';
import ScrollingBackground from '../Objects/ScrollingBackground';

export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
  }

  preload() {
    this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);

    const assetText = this.make.text({
      x: window.global.width / 2,
      y: (window.global.height / 2 - 70),
      text: '',
      style: {
        font: '18px monospace',
        fill: STYLE.colors.white,
      },
    })
      .setOrigin(0.5);
    const loadingText = this.make.text({
      x: assetText.x,
      y: assetText.y + 32,
      text: '',
      style: {
        font: '18px monospace',
        fill: STYLE.colors.white,
      },
    })
      .setOrigin(0.5);
    this.load.on('progress', value => {
      // eslint-disable-next-line radix
      loadingText.setText(`${parseInt(value * 100)} %`);
    });
    this.load.on('fileprogress', file => {
      assetText.setText(`Loading asset: ${file.key}`);
    });
    this.load.on('complete', () => {
      assetText.destroy();
      loadingText.destroy();
    });

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
    this.load.audio('bgm', ['assets/audio/bgm_bit.mp3', 'assets/sounds/bgm_bit.ogg']);
  }

  create() {
    this.add.text(2, this.game.config.height - 2,
      `Play Control\nMove: [A (Left), D (Right), W (Up), S (Down)]\nShoot: [Space]\n${window.global.signature}`)
      .setOrigin(0, 1);

    if (window.global.bgmInstance === undefined) {
      this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
      this.bgm.play();
      window.global.bgmInstance = this.bgm;
    }

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

    const printText = this.add.text(240, 240, '', {
      fontSize: '12px',
      fixedWidth: 100,
      fixedHeight: 100,
    }).setOrigin(0.5);
    const inputText = this.add.rexInputText(240, 260, 200, 30, {
      type: 'text',
      placeholder: 'Enter player name',
      fontSize: STYLE.fonts.small,
      color: STYLE.colors.white,
      borderBottom: `3px solid ${STYLE.colors.gold}`,
    })
      .setOrigin(0.5)
      .on('textchange', () => {
        printText.text = inputText.text;
      });

    printText.text = inputText.text;

    this.submitButton = this.add.text(240, 300, 'Submit Name').setInteractive().setOrigin(0.5);
    this.submitButton.on('pointerdown', () => {
      if (printText.text.length > 0) {
        window.global.userName = printText.text;
        this.submitButton.destroy();
      }
    });

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
