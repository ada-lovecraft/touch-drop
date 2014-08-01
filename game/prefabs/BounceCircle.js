'use strict';

var BounceCircle = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'BounceCircle', frame);

  // initialize your prefab here
  
};

BounceCircle.prototype = Object.create(Phaser.Sprite.prototype);
BounceCircle.prototype.constructor = BounceCircle;

BounceCircle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = BounceCircle;
