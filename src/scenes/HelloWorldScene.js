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

    const particles = this.add.particles('smoke')
    this.ship = this.add.image(width * 0.5, height * 0.5, 'ship');

    particles.createEmitter({
      quantity: 10,
      speedY: { min: 20, max: 50 },
      speedX: { min: -10, max: 10 },
      accelerationY: 1000,
      lifespan: { min: 100, max: 300 },
      alpha: { start: 0.5, end: 0, ease: 'Sine.easeIn' },
      scale: { start: 0.065, end: 0.002 },
      rotate: { min: -180, max: 180 },
      angle: { min: 30, max: 110 },
      blendMode: 'ADD',
      frequency: 15,
      follow: this.ship,
      followOffset: { y: this.ship.height * 0.5},
      tint: 0xed7e77
    })
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
