'use strict';

var Colors = require('../utils/Colors');
var HUD = function(game) {
  Phaser.Group.call(this, game);
  this.barWidth = this.game.width / 6;
  this.barHeight = 20;

  this.barBackgroundBMD = this.game.make.bitmapData(this.barWidth, this.barHeight);
  this.barBackgroundBMD.ctx.fillStyle = Colors.BAR_BACKGROUND;
  this.barBackgroundBMD.ctx.fillRect(0,0, this.barWidth, this.barHeight);



  this.possibleBMD = this.game.make.bitmapData(this.barWidth, this.barHeight);
  this.currentBMD = this.game.make.bitmapData(this.barWidth, this.barHeight);

  this.barBackground = this.game.make.sprite(0,0, this.barBackgroundBMD);
  this.possibleBar = this.game.make.sprite(0,0, this.possibleBMD);
  this.currentBar = this.game.make.sprite(0,0, this.currentBMD);
  this.livesBMD = this.game.make.bitmapData(this.barWidth, 50);

  this.lives = this.game.make.sprite(0, this.barHeight + 10, this.livesBMD);

  this.add(this.barBackground);
  this.add(this.possibleBar);
  this.add(this.currentBar);
  this.add(this.lives);
};

HUD.prototype = Object.create(Phaser.Group.prototype);
HUD.prototype.constructor = HUD;


HUD.prototype.updatePossibleCompletion = function(percent) {
  var ctx = this.possibleBMD.ctx;
  this.possibleBMD.clear();
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = Colors.BAR;
  ctx.globalAlpha = 0.25;
  ctx.rect(0,0, this.barWidth * percent, this.barHeight);
  ctx.fill();
  ctx.restore();


};



HUD.prototype.updateCurrentCompletion = function(percent) {
  console.log('updating urrent', percent, this.barWidth * percent);
  var ctx = this.currentBMD.ctx;
  this.currentBMD.clear();
  ctx.beginPath();
  ctx.fillStyle = Colors.BAR;
  ctx.rect(0,0, this.barWidth * percent, this.barHeight);
  ctx.fill();
};

HUD.prototype.updateTarget = function(target) {

};

HUD.prototype.loseLife = function() {
  this.health--;
  this.updateLivesDisplay();
};

HUD.prototype.updateMaxLives = function(lives) {
  this.health = lives;
  this.maxHealth = lives;
  this.updateLivesDisplay();
};

HUD.prototype.updateLivesDisplay = function() {
  var ctx = this.livesBMD.ctx;
  ctx.fillStyle = Colors.PLAYER;
  ctx.strokeStyle = Colors.PLAYER;
  var circleSpacingX = this.barWidth / 10;
  var circleSpacingY = 14;

  this.livesBMD.clear();
  var y = 0;
  var x = 0;
  for(var i = 0; i < this.maxHealth; i++) {
    ctx.beginPath();
    ctx.arc((circleSpacingX * x) + 6, (circleSpacingY * y) + 6, 5, 0, Math.PI * 2);
    if(i < this.health) {
      ctx.fill();
    } else {
      ctx.stroke();
    }

    x++;
    if(i > 0 && i % 10 === 0) {
      y++;
      x = 0;
    }
  }
};

module.exports = HUD;
