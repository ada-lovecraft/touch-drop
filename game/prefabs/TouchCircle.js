'use strict';
var Circle = require('./Circle');
var TouchCircle = function(game, x, y, color) {
  Circle.call(this, game, x, y, 10);
  this.color = color;
  // initialize your prefab here
  this.body.data.gravityScale = 1;
  this.body.restitution = 0.25;
};

TouchCircle.prototype = Object.create(Circle.prototype);
TouchCircle.prototype.constructor = TouchCircle;

TouchCircle.prototype.update = function() {

  // write your prefab's specific update code here

};

TouchCircle.prototype.grow = function() {
  this.size++;
  this.body.setCircle(this.size);
  this.body.setZeroForce();
  this.body.setZeroVelocity();
  this.body.mass = this.size;
  this.updateTexture();
};


module.exports = TouchCircle;
