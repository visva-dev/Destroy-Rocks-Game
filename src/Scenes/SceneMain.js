/* eslint-disable no-plusplus */
import * as Phaser from 'phaser';
import STYLE from '../styles/style';
import ScrollingBackground from '../Objects/ScrollingBackground';
import Player from '../Objects/Player';
import ChaserShip from '../Objects/ChaserShip';

export default class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMain' });
  }

  preload() {
    this.load.spritesheet('sprExplosion', './assets/ui/exp.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('sprEnemy1', 'assets/ui/rocks.png', {
      frameWidth: 50,
      frameHeight: 35,
    });
    this.load.image('sprLaserPlayer', './assets/ui/sprLaserPlayer.png');
    this.load.image('sprPlayer', './assets/ui/playerShip2_red.png');

    this.load.audio('sndExplode0', './assets/sounds/explode.wav');
    this.load.audio('sndExplode1', './assets/sounds/explode.wav');
    this.load.audio('sndLaser', '../assets/sounds/laser.wav');
  }

  create() {
    const frameNames = this.anims.generateFrameNumbers('sprExplosion');
    const f2 = frameNames.slice();
    f2.reverse();
    const f3 = f2.concat(frameNames);
    this.anims.create({
      key: 'sprExplosion',
      frames: f3,
      frameRate: 48,
      repeat: false,
    });
    this.anims.create({
      key: 'sprPlayer',
      frames: this.anims.generateFrameNumbers('sprPlayer'),
      frameRate: 20,
      repeat: -1,
    });

    this.sfx = {
      explosions: [
        this.sound.add('sndExplode0'),
        this.sound.add('sndExplode1'),
      ],
      laser: this.sound.add('sndLaser'),
    };

    this.backgrounds = [];
    for (let i = 0; i < 5; i++) {
      const bg = new ScrollingBackground(this, 'sprBg0', i * 10);
      this.backgrounds.push(bg);
    }

    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'sprPlayer',
    );

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    this.time.addEvent({
      delay: 1000,
      callback() {
        let enemy = null;
        if (Phaser.Math.Between(0, 150) >= 5) {
          if (this.getEnemiesByType('ChaserShip').length < 10) {
            enemy = new ChaserShip(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0,
            );
          }
        }

        if (enemy !== null) {
          enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
          this.enemies.add(enemy);
        }
      },
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(
      this.playerLasers,
      this.enemies,
      (playerLaser, enemy) => {
        if (enemy) {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }
          this.scoreAdd();
          enemy.explode(true);
          playerLaser.destroy();
        }
      },
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      (player, enemy) => {
        if (!player.getData('isDead') && !enemy.getData('isDead')) {
          player.explode(false);
          player.onDestroy();
          enemy.explode(true);
        }
      },
    );

    this.scoreText = this.add.text(16, 16, '0', {
      fontFamily: 'times',
      fontSize: STYLE.fonts.big,
      fontStyle: 'bold',
      color: STYLE.colors.white,
      align: 'left',
      stroke: STYLE.colors.purple,
      strokeThickness: 2,
    });
    this.scoreText.setDepth(10);
    this.scoreReset();
  }

  getEnemiesByType(type) {
    const arr = [];
    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      const enemy = this.enemies.getChildren()[i];
      if (enemy.getData('type') === type) {
        arr.push(enemy);
      }
    }
    return arr;
  }

  scoreAdd(value = 1) {
    window.global.score += value;
    this.scoreText.setText(window.global.score);
    this.tweens.add({
      targets: this.scoreText,
      scaleX: 1.3,
      scaleY: 1.3,
      yoyo: true,
      duration: 60,
      repeat: 0,
      onComplete: () => {
        this.scoreText.scaleX = 1;
        this.scoreText.scaleY = this.scoreText.scaleX;
      },
    });
  }

  scoreReset() {
    window.global.score = 0;
    this.scoreText.setText(window.global.score);
  }

  update() {
    if (!this.player.getData('isDead')) {
      this.player.update();
      if (this.keyW.isDown) {
        this.player.moveUp();
      } else if (this.keyS.isDown) {
        this.player.moveDown();
      }
      if (this.keyA.isDown) {
        this.player.moveLeft();
      } else if (this.keyD.isDown) {
        this.player.moveRight();
      }

      if (this.keySpace.isDown) {
        this.player.setData('isShooting', true);
      } else {
        this.player.setData(
          'timerShootTick',
          this.player.getData('timerShootDelay') - 1,
        );
        this.player.setData('isShooting', false);
      }
    }

    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      const enemy = this.enemies.getChildren()[i];

      enemy.update();

      if (
        enemy.x < -enemy.displayWidth
        || enemy.x > this.game.config.width + enemy.displayWidth
        || enemy.y < -enemy.displayHeight * 4
        || enemy.y > this.game.config.height + enemy.displayHeight
      ) {
        if (enemy) {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }
          enemy.destroy();
        }
      }
    }

    for (let i = 0; i < this.playerLasers.getChildren().length; i++) {
      const laser = this.playerLasers.getChildren()[i];
      laser.update();
      if (
        laser.x < -laser.displayWidth
        || laser.x > this.game.config.width + laser.displayWidth
        || laser.y < -laser.displayHeight * 4
        || laser.y > this.game.config.height + laser.displayHeight
      ) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}
