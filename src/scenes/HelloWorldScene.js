import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  /** @type {Phaser.GameObjects.Image} */
  ship;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image('ship', 'images/playerShip2_red.png');
    this.load.image('smoke', 'images/whitePuff00.png');
  }

  create() {
    const { width, height } = this.scale;

    this.ship = this.add.image(width * 0.5, height * 0.5, 'ship');
  }

  update() {
    const speed = 8;
    if (this.cursors.left.isDown) {
      this.ship.x -= speed;
    } else if (this.cursors.right.isDown) {
      this.ship.x += speed;
    }

    if (this.cursors.up.isDown) {
      this.ship.y -= speed;
    } else if (this.cursors.down.isDown) {
      this.ship.y += speed;
    }
  }
}
