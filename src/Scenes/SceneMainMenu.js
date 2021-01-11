import Phaser from 'phaser';
import STYLE from '../styles/style';
import ScrollingBackground from '../Objects/ScrollingBackground';

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({
      key: 'SceneMainMenu',
    });
  }

  init() {
    window.global.width = this.game.config.width;
    window.global.height = this.game.config.height;
    window.emitter = new Phaser.Events.EventEmitter();
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

    this.load.image('sprBtnPlay', 'assets/ui/sprBtnPlay.png');
    this.load.image('sprBtnPlayHover', 'assets/ui/sprBtnPlayHover.png');
    this.load.image('sprBtnPlayDown', 'assets/ui/sprBtnPlayDown.png');
    this.load.image('sprBtnRestart', 'assets/ui/sprBtnRestart.png');
    this.load.image('sprBtnRestartHover', 'assets/ui/sprBtnRestartHover.png');
    this.load.image('sprBtnRestartDown', 'assets/ui/sprBtnRestartDown.png');
    this.load.image('sprBg0', 'assets/ui/sprBg0.png');
    this.load.image('sprBg1', 'assets/ui/sprBg1.png');
    this.load.image('blueButton1', 'assets/ui/blue_button02.png');
    this.load.image('blueButton2', 'assets/ui/blue_button03.png');
    this.load.audio('sndBtnOver', 'assets/sounds/sndBtnOver.wav');
    this.load.audio('sndBtnDown', 'assets/sounds/sndBtnDown.wav');

    this.load.audio('sndExplode0', 'assets/sounds/explode.wav');
    this.load.audio('sndExplode1', 'assets/sounds/explode.ogg');
    this.load.audio('sndLaser', 'assets/sounds/laser.wav');
    this.load.audio('sndLaser0', ['assets/sounds/laser.wav', 'assets/sounds/laser.ogg']);

    this.load.audio('menuSong', 'assets/sounds/TownTheme.mp3');
  }

  create() {
    this.add.text(750, this.game.config.height - 1,
      `Play Control\nMove: A (Left), D (Right), W (Up), S (Down)\n\nShoot: [Space]\n${window.global.signature}`)
      .setOrigin(0, 1.5);

    if (window.global.bgmInstance === undefined) {
      this.menuSong = this.sound.add('menuSong', { loop: true, volume: 0.5 });
      this.menuSong.play();
      window.global.bgmInstance = this.menuSong;
    }

    this.sfx = {
      btnOver: this.sound.add('sndBtnOver'),
      btnDown: this.sound.add('sndBtnDown'),
    };
    this.btnPlay = this.add.sprite(
      window.global.width / 2,
      (window.global.height / 2) + 100,
      'sprBtnPlay',
    );
    this.btnPlay.setInteractive();
    this.btnPlay.on('pointerover', this.onHover.bind(this));
    this.btnPlay.on('pointerout', this.onOut.bind(this));
    this.btnPlay.on('pointerdown', this.onClick.bind(this));
    this.btnPlay.on('pointerup', () => {
      this.btnPlay.setTexture('sprBtnPlayHover');
    });
    this.title = this.add.text(window.global.width * 0.5, 128, 'SPACESHOOTER', {
      fontFamily: 'Times',
      fontSize: STYLE.fonts.title,
      fontStyle: 'bold',
      color: STYLE.colors.white,
      align: 'center',
    });
    this.title.setOrigin(0.5);

    const printText = this.add.text(240, 240, '', {
      fontSize: '12px',
      fixedWidth: 100,
      fixedHeight: 100,
    }).setOrigin(0.5);
    const inputText = this.add.rexInputText(240, 260, 200, 30, {
      type: 'text',
      placeholder: 'Enter player name',
      fontSize: STYLE.fonts.normal,
      color: STYLE.colors.white,
      borderBottom: `3px solid ${STYLE.colors.aqua}`,
    })
      .setOrigin(-3.1)
      .on('textchange', () => {
        printText.text = inputText.text;
      });

    printText.text = inputText.text;
    this.submitButton = this.add.sprite(960, 310, 'blueButton2').setInteractive();
    this.submitButton = this.add.text(960, 310, 'Submit Name').setInteractive().setOrigin(0.5);
    this.submitButton.on('pointerdown', () => {
      if (printText.text.length > 0) {
        window.global.userName = printText.text;
        this.submitButton.destroy();
      }
    });

    this.backgrounds = [];
    for (let i = 0; i < 15; i += 1) {
      const keys = ['sprBg0', 'sprBg1'];
      const key = keys[Phaser.Math.Between(0, keys.length - 1)];
      const bg = new ScrollingBackground(this, key, i * 40);
      this.backgrounds.push(bg);
    }
  }

  onClick() {
    this.btnPlay.setTexture('sprBtnPlayDown');
    this.sfx.btnDown.play();
    this.time.addEvent({
      delay: 90,
      callback: () => {
        this.scene.start('SceneMain');
      },
      loop: false,
    });
  }

  onOut() {
    this.btnPlay.setTexture('sprBtnPlay');
  }

  onHover() {
    this.btnPlay.setTexture('sprBtnPlayHover');
    this.sfx.btnOver.play();
  }

  update() {
    for (let i = 0; i < this.backgrounds.length; i += 1) {
      this.backgrounds[i].update();
    }
  }
}

export default SceneMainMenu;
