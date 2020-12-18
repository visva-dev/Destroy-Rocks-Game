import Phaser from 'phaser';

export default class HelloWorldScene extends Phaser.Scene {
  /** @type {Phaser.GameObjects.Image} */
  ship;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.GameObjects.Particles.ParticleEmitter} */
  exhaustEmitter;

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image('back', 'images/darkPurple.png');
    this.load.image('earth', 'images/earth.png');
    this.load.image('ship', 'images/playerShip2_red.png');
    this.load.image('smoke', 'images/whitePuff00.png');
    this.load.image('laser', 'images/laserBlue02');
  }

  create() {
    const { width, height } = this.scale;
    this.back = this.add.image(0, 0, 'back').setOrigin(0).setScale(8);
    this.earth = this.add.image(width * 0.5, height * 0.5, 'earth');
    const particles = this.add.particles('smoke');
    this.ship = this.add.image(width * 0.5, height * 0.5, 'ship');

    const direction = new Phaser.Math.Vector2(0, 0);
    direction.setToPolar(this.ship.rotation, 1);

    const dx = -direction.x;
    const dy = -direction.y;

    const ox = dx * this.ship.width * 0.55;
    const oy = dy * this.ship.width * 0.55;

    this.exhaustEmitter = particles.createEmitter({
      quantity: 10,
      speedY: { min: 20 * dy, max: 50 * dy },
      speedX: { min: -10 * dx, max: 10 * dx },
      accelerationX: 1000 * dx,
      accelerationY: 1000 * dy,
      lifespan: { min: 100, max: 300 },
      alpha: { start: 0.5, end: 0, ease: 'Sine.easeIn' },
      scale: { start: 0.065, end: 0.002 },
      rotate: { min: -180, max: 180 },
      angle: { min: 30, max: 110 },
      blendMode: 'ADD',
      frequency: 15,
      follow: this.ship,
      followOffset: { x: ox, y: oy },
      tint: 0xed7e77,
    });
  }

  update() {
    const speed = 8;
    if (this.cursors.left.isDown) {
      this.ship.angle -= speed;
    } else if (this.cursors.right.isDown) {
      this.ship.angle += speed;
    }

    const direction = new Phaser.Math.Vector2(0, 0);
    direction.setToPolar(this.ship.rotation, 1);

    const dx = direction.x;
    const dy = direction.y;

    if (this.cursors.up.isDown) {
      this.ship.x += speed * dx;
      this.ship.y += speed * dy;
    }

    if (this.exhaustEmitter) {
      const ox = -dx * this.ship.width * 0.55;
      const oy = -dy * this.ship.width * 0.55;

      const ddx = -dx;
      const ddy = -dy;

      this.exhaustEmitter.setSpeedX({ min: -10 * ddx, max: 10 * ddx });
      this.exhaustEmitter.setSpeedY({ min: 20 * ddy, max: 50 * ddy });

      this.exhaustEmitter.accelerationX.propertyValue = 1000 * ddx;
      this.exhaustEmitter.accelerationY.propertyValue = 1000 * ddy;

      this.exhaustEmitter.followOffset.x = ox;
      this.exhaustEmitter.followOffset.y = oy;
    }
  }
}
