
'use strict';
function GameOver() {
  this.levelCounter = null;
}

GameOver.prototype = {
  init: function(data) {
    this.levelCounter = data.levelCounter;
  },
  preload: function () {

  },
  create: function () {

    this.titleText = this.game.add.bitmapText(200, 100, 'minecraftia','Game Over\n',64);

    this.congratsText = this.game.add.bitmapText(320, 200, 'minecraftia','You win!',32);

    this.instructionText = this.game.add.bitmapText(330, 300, 'minecraftia','Tap to play again!',12);

  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play', true,false, {levelCounter: this.levelCounter});
    }
  }
};
module.exports = GameOver;
