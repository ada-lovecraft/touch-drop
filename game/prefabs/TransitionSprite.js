'use strict';

var TransitionSprite = function(game, color ) {


  this.bmd = game.make.bitmapData(game.width, game.height);
  Phaser.Sprite.call(this, game, 0, 0, this.bmd );
  this.origin = {
    x: 0,
    y: 0
  };
  this.properties = {
    innerRadius: 0,
    outterRadius: 0,
  };
  this.color = color;


  this.events.onHalfTransition = new Phaser.Signal();
  this.events.onTransitionComplete = new Phaser.Signal();
};

TransitionSprite.prototype = Object.create(Phaser.Sprite.prototype);
TransitionSprite.prototype.constructor = TransitionSprite;

TransitionSprite.prototype.update = function() {
  this.updateTexture();
  // write your prefab's specific update code here

};

TransitionSprite.prototype.start = function() {
  this.revive();
  this.properties = {
    innerRadius: 0,
    outterRadius: 0,
  };
  this.game.add.tween(this.properties).to({outterRadius: this.game.width}, 1000, Phaser.Easing.Linear.NONE, true)
  .onComplete.addOnce(function() {
    this.events.onHalfTransition.dispatch();
  }, this);
  this.game.add.tween(this.properties).to({innerRadius: this.game.width}, 1000, Phaser.Easing.Linear.NONE, true,1000)
  .onComplete.addOnce(function() {
    this.events.onTransitionComplete.dispatch();
  }, this);
};

TransitionSprite.prototype.updateTexture = function() {
  this.bmd.clear();
  var ctx = this.bmd.ctx;
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.origin.x, this.origin.y, this.properties.outterRadius, 0, Math.PI * 2);
  ctx.arc(this.origin.x, this.origin.y, this.properties.innerRadius, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.closePath();
  this.bmd.dirty = true;
};

module.exports = TransitionSprite;
