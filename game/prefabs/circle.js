'use strict';

var Circle = function(game, x, y, size, color) {
  this.bmd = game.make.bitmapData();
  Phaser.Sprite.call(this, game, x, y, this.bmd);
  this.color = color;

  this.game.physics.p2.enableBody(this);
  this.size = size || 0;
  this.body.setCircle(this.size);
  this.anchor.setTo(0.5, 0.5);

  // initialize your prefab here
  this.body.data.gravityScale = 0;
  this.maxSpeed = 20;
  this.updateTexture();
};

Circle.prototype = Object.create(Phaser.Sprite.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.update = function() {
  this.limitSpeed();
};


Circle.prototype.updateTexture = function() {
  this.bmd.clear();
  this.bmd.resize(this.size * 2, this.size * 2);
  var ctx = this.bmd.ctx;
  ctx.fillStyle = this.color;
  ctx.save();
  ctx.translate(this.size, this.size);
  ctx.beginPath();
  ctx.arc(0,0, this.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};


Circle.prototype.limitSpeed = function() {
    var x = this.body.velocity.x;
    var y = this.body.velocity.y;

    if (Math.pow(x, 2) + Math.pow(y, 2) > Math.pow(this.maxSpeed, 2)) {
        var a = Math.atan2(y, x);
        x = -20 * Math.cos(a) * this.maxSpeed;
        y = -20 * Math.sin(a) * this.maxSpeed;
        this.body.velocity.x = x;
        this.body.velocity.y = y;
    }
};
module.exports = Circle;
