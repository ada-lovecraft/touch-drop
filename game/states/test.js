
  'use strict';
  function Test() {
    this.bullets = null;
    this.angle = null;
    this.cannon = null;
    this.fireRate = 100;
    this.nextFire = 0;
  }

  Test.prototype = {
    create: function() {
      this.game.stage.backgroundColor = '#2d2d2d';
      this.game.world.setBounds(0, 0, 800, 600);

      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

      this.game.physics.p2.gravity.y = 170;
      this.game.physics.p2.restitution = 0.8;
      this.game.physics.p2.friction = 0.1;

      this.bullets = this.game.add.group();
      this.bullets.createMultiple(500, 'bullets', 0, false);

      this.cannon = this.game.add.sprite(50, 500, 'arrow');
      this.cannon.anchor.set(0, 0.5);
    },
    update: function() {
      var dx = this.game.input.activePointer.worldX - this.cannon.x;
      var dy = this.game.input.activePointer.worldY - this.cannon.y;
      this.cannon.rotation = Math.atan2(dy,dx);
      if(this.game.input.activePointer.isDown) {
        this.fire();
      }
    },
    fire: function() {
      if(this.game.time.now > this.nextFire) {
        this.nextFire = this.game.time.now + this.fireRate;

        var bullet = this.bullets.getFirstExists(false);
        if (bullet) {
          var frame = this.game.rnd.integerInRange(0,6);
          bullet.frame = frame;
          bullet.exists = true;
          bullet.position.set(this.cannon.x, this.cannon.y);
          this.game.physics.p2.enable(bullet, true);
          bullet.body.setCircle(9);
          bullet.body.rotation = this.cannon.rotation + this.game.math.degToRad(-90);
          bullet.scale.setTo(this.game.rnd.realInRange(0.5, 3.0));

          //bullet.body.collideWorldBounds = true;

          var magnitude = 500;
          var angle = bullet.body.rotation + Math.PI /2;
          bullet.body.velocity.x = magnitude * Math.cos(angle);
          bullet.body.velocity.y = magnitude * Math.sin(angle);
        }

      }
    },
    render: function() {

    }
  };

  module.exports = Test;
