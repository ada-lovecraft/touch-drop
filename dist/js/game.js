(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'touch-drop');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  game.state.add('test', require('./states/test'));
  

  game.state.start('boot');
};

},{"./states/boot":6,"./states/gameover":7,"./states/menu":8,"./states/play":9,"./states/preload":10,"./states/test":11}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"../utils/Colors":12}],4:[function(require,module,exports){
'use strict';
var Circle = require('./Circle');
var TouchCircle = function(game, x, y, color) {
  Circle.call(this, game, x, y, 10);
  this.color = color;
  // initialize your prefab here
  this.body.data.gravityScale = 1;
  this.body.restitution = 0.25;
  this.growSpeed = 1;
};

TouchCircle.prototype = Object.create(Circle.prototype);
TouchCircle.prototype.constructor = TouchCircle;

TouchCircle.prototype.update = function() {

  // write your prefab's specific update code here

};

TouchCircle.prototype.grow = function() {
  this.size += this.growSpeed;
  this.body.setCircle(this.size);
  this.body.setZeroForce();
  this.body.setZeroVelocity();
  this.body.mass = this.size;
  this.updateTexture();
};


module.exports = TouchCircle;

},{"./Circle":2}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {

    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);


    this.titleText = this.game.add.bitmapText(200, 250, 'minecraftia','\'Allo, \'Allo!',64);

    this.instructionsText = this.game.add.bitmapText(200, 400, 'minecraftia','Tap anywhere to play\n "Catch the Yeoman Logo"',24);
    this.instructionsText.align = 'center';
    
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],9:[function(require,module,exports){

  'use strict';

  var TouchCircle = require('../prefabs/TouchCircle');
  var Circle = require('../prefabs/Circle');
  var TransitionSprite = require('../prefabs/TransitionSprite');
  var Levels = require('../utils/Levels');
  var Colors = require('../utils/Colors');
  var HUD = require('../prefabs/HUD');

  function Play() {
    this.bullets = null;
    this.angle = null;
    this.cannon = null;
    this.fireRate = 100;
    this.nextFire = 0;
    this.level = 1;
    this.completion = 0;
    this.activeCircle = null;
    this.playerCollisionGroup = null;
    this.ballCollisionGroup = null;
    this.maxFill = 0;
    this.level = null;
    this.levelCounter = null;
    this.levelText = null;
    this.possiblePercent = 0;
    this.currentPercent = 0;
    this.onTransitionComplete = new Phaser.Signal();
    this.transitionSprite = null;
    this.hud = null;
    this.horizontalDivider = null;
    this.verticalDivider = null;
  }

  Play.prototype = {
    init: function(data) {
      data = data || {};
      this.levelCounter = data.levelCounter || 17;
      this.level = Levels[this.levelCounter];
      this.maxFill = this.game.height;
    },
    create: function() {
      this.game.stage.backgroundColor = Colors.BACKGROUND;
      this.game.world.setBounds(0, 0, 800, 600);
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
      this.game.physics.p2.setImpactEvents(true);

      this.game.physics.p2.gravity.y = 170;




      this.circles = this.game.add.group();
      this.hud = new HUD(this.game);
      this.add.existing(this.hud);
      this.balls = this.game.add.group();



      this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.ballCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.game.physics.p2.updateBoundsCollisionGroup();



      this.ballMaterial = this.game.physics.p2.createMaterial('ballMaterial');
      this.circleMaterial = this.game.physics.p2.createMaterial('circleMaterial');
      var worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');

      this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);

      var ballWorldContactMaterial = this.game.physics.p2.createContactMaterial(this.ballMaterial, worldMaterial);
      ballWorldContactMaterial.friction = 0.0;
      ballWorldContactMaterial.restitution = 1.0;

      var ballBallContactMaterial = this.game.physics.p2.createContactMaterial(this.ballMaterial, this.ballMaterial);
      ballBallContactMaterial.friction = 0.0;
      ballBallContactMaterial.restitution = 1.0;

      var circleWorldContactMaterial = this.game.physics.p2.createContactMaterial(this.circleMaterial, worldMaterial);
      circleWorldContactMaterial.friction = 0.3;
      circleWorldContactMaterial.restitution = 0.25;

      var circleBallContactMaterial = this.game.physics.p2.createContactMaterial(this.circleMaterial, this.ballMaterial);
      circleBallContactMaterial.friction = 0.0;
      circleBallContactMaterial.restitution = 1.0;


      this.

      this.transitionSprite = new TransitionSprite(this.game, Colors.PLAYER);
      this.add.existing(this.transitionSprite);
      this.game.input.onDown.add(this.createPlayerCircle, this);
      this.levelText = this.game.add.text(this.game.world.centerX, this.game.world.centerY);
      this.levelText.fill = Colors.TEXT;
      this.levelText.anchor.setTo(0.5);
      this.transitionToScene();

      this.hud.visible = false;
      this.hud.x = 20;
      this.hud.y = 20;


    },
    update: function() {
      if(this.game.input.activePointer.isDown && this.activeCircle) {
        this.activeCircle.grow();
        this.activeCircle.body.setCollisionGroup(this.playerCollisionGroup);
        this.activeCircle.body.setMaterial(this.circleMaterial);
        this.updatePossibleCompletion();

      } else if(this.game.input.activePointer.isUp && this.activeCircle) {
        this.endPlayerCircle();
      }
    },
    createPlayerCircle: function() {
      var hits = this.game.physics.p2.hitTest(this.game.input.activePointer.position);
      if(!hits.length) {
        console.log('creating new player circle');
        var circle = new TouchCircle(this.game, this.game.input.activePointer.x, this.game.input.activePointer.y, Colors.PLAYER);
        circle.body.collides(this.playerCollisionGroup, this.endPlayerCircle, this);
        circle.body.collides(this.ballCollisionGroup, this.testCollision, this);
        circle.body.setMaterial(this.circleMaterial);
        circle.growSpeed = this.level.growSpeed;
        this.circles.add(circle);
        this.activeCircle = circle;
      }
    },
    endPlayerCircle: function(circle) {
      if(!circle || (this.activeCircle && circle.sprite === this.activeCircle)) {
        this.updateCurrentCompletion();
        this.lastCircle = this.activeCircle;
        this.activeCircle = null;
        this.hud.loseLife();
        this.checkWinLose();
      }
    },
    testCollision: function(circle) {
      if(circle.sprite === this.activeCircle) {
        circle.sprite.kill();
        this.endPlayerCircle();
        this.updatePossibleCompletion();
      }

    },
    updatePossibleCompletion: function() {

      this.possiblePercent = this.calculateCompletetion();
      this.hud.updatePossibleCompletion(this.possiblePercent);
    },
    updateCurrentCompletion: function() {
      this.currentPercent = this.calculateCompletetion();
      this.hud.updateCurrentCompletion(this.currentPercent);
    },
    calculateCompletetion: function() {
      var totalArea = 0;
      this.circles.forEachAlive(function(circle) {
        totalArea += circle.body.data.shapes[0].area;
      }, this);

      return (totalArea/(this.maxFill * this.level.targetPercent));
    },

    showLevel: function() {
      this.levelText.text = this.level.text;
      this.levelText.alpha = 0;
      this.game.add.tween(this.levelText).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 0, 0, true);
      this.hud.visible = !this.level.hideHUD;
    },
    die: function() {
      this.game.state.start('gameover', true, false, {levelCounter: this.levelCounter});
    },
    nextLevel: function() {

        this.levelCounter++;
        this.level = Levels[this.levelCounter];
        this.transitionToScene();
      //this.onTransitionComplete.add(this.startLevel, this);
    },
    startLevel: function() {

    },
    transitionToScene: function() {
      var transitionPoint;
      if(this.lastCircle) {
        transitionPoint = this.lastCircle.position;
      } else {
        transitionPoint = new Phaser.Point(this.game.world.centerX, this.game.world.centerY);
      }

      this.transitionSprite.origin = transitionPoint;
      this.transitionSprite.start();
      this.transitionSprite.events.onHalfTransition.addOnce(this.setupScene, this);
      this.transitionSprite.events.onTransitionComplete.addOnce(this.showLevel, this);

    },
    setupScene: function() {
      this.circles.removeAll(true);
      this.balls.removeAll(true);

      for(var i = 0; i < this.level.enemies; i++) {
        var ball = new Circle(this.game, this.game.world.randomX, this.game.world.randomY, 10);
        ball.body.setCollisionGroup(this.ballCollisionGroup);
        ball.body.collides([this.ballCollisionGroup, this.playerCollisionGroup]);
        ball.body.restitution = 1.0;
        ball.body.damping = 0;
        ball.body.setMaterial(this.ballMaterial);
        ball.body.rotation = this.game.rnd.realInRange(0, Math.PI * 2);
        ball.body.thrust(this.level.maxBallSpeed * 20);
        ball.maxSpeed = this.level.maxBallSpeed;
        this.balls.add(ball);
      }
      this.hud.updateTarget(this.level.targetPercent);
      this.hud.updateMaxLives(this.level.lives);
      this.hud.updateCurrentCompletion(0);
      this.hud.updatePossibleCompletion(0);
    },
    checkWinLose: function() {
      if(this.currentPercent >= 1) {
        this.nextLevel();
      } else {
        if(this.hud.health === 0) {
          this.die();
        }
      }
    },
    render: function() {
    }
  };

  module.exports = Play;

},{"../prefabs/Circle":2,"../prefabs/HUD":3,"../prefabs/TouchCircle":4,"../prefabs/TransitionSprite":5,"../utils/Colors":12,"../utils/Levels":13}],10:[function(require,module,exports){
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('arrow', 'assets/arrow.png');
    this.load.image('chunk', 'assets/chunk.png');
    this.load.spritesheet('bullets', 'assets/balls.png', 17, 17);
    this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia.png', 'assets/fonts/minecraftia.xml');


  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}],11:[function(require,module,exports){

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

},{}],12:[function(require,module,exports){
module.exports = {
  BACKGROUND: '#D9DADE',
  ENEMY: '#2C3230',
  PLAYER: '#95040B',
  TEXT: '#0C0304',
  BAR: '#BC0100',
  BAR_BACKGROUND: '#7C8575'
};

},{}],13:[function(require,module,exports){
module.exports = [
  {
    id: 0,
    name: 'Intro',
    text: 'Tap to Create a Circle',
    targetPercent: 0,
    scoreMultiplier: 0,
    hideHUD: true,
    enemies: 0,
    lives: 1,
    maxBallSpeed: 10,
    growSpeed: 1
  },
  {
    id: 1,
    name: 'Intro 2',
    text: 'Tap and Hold to Grow Your Circle.',
    targetPercent: 0,
    scoreMultiplier: 0,
    enemies: 0,
    lives: 3,
    hideHUD: true,
    maxBallSpeed: 10,
    growSpeed: 1
  },
  {
    id: 2,
    name: 'Intro 3',
    text: 'Fill the Meter Without Running Out Of Lives',
    targetPercent: 0.75,
    scoreMultiplier: 0,
    enemies: 0,
    lives: 10,
    maxBallSpeed: 10,
    growSpeed: 1
  },
  {
    id: 3,
    name: 'Intro 4',
    text: 'You Lose A Life and Your Current Circle\'s Progress If You Get Hit By A Black Circle' ,
    targetPercent: 0.10,
    scoreMultiplier: 0,
    enemies: 40,
    lives: 10,
    maxBallSpeed: 200,
    growSpeed: 1
  },
  {
    id: 4,
    name: 'Level 1',
    text: 'Everything can change.' ,
    targetPercent: 0.5,
    scoreMultiplier: 1,
    enemies: 8,
    lives: 5,
    maxBallSpeed: 800,
    growSpeed: 1
  },
  {
    id: 5,
    name: 'Level 2',
    text: 'Scratch that... Everything -will- change.' ,
    targetPercent: 0.5,
    scoreMultiplier: 1,
    enemies: 8,
    lives: 5,
    maxBallSpeed: 800,
    growSpeed: 1
  },
  {
    id: 5,
    name: 'Level 3',
    text: 'And everyone is different.' ,
    targetPercent: 0.75,
    scoreMultiplier: 1,
    enemies: 8,
    lives: 5,
    maxBallSpeed: 800,
    growSpeed: 1
  },
  {
    id: 6,
    name: 'Level 4',
    text: 'Some of us grow faster than others' ,
    targetPercent: 0.9,
    scoreMultiplier: 1,
    enemies: 8,
    lives: 5,
    maxBallSpeed: 800,
    growSpeed: 2.5
  },
  {
    id: 7,
    name: 'Level 5',
    text: 'Some of us move faster than others.' ,
    targetPercent: 0.75,
    scoreMultiplier: 1,
    enemies: 8,
    lives: 5,
    maxBallSpeed: 1600,
    growSpeed: 1.5
  },
  {
    id: 8,
    name: 'Level 6',
    text: 'Some of us have more enemies than others...' ,
    targetPercent: 0.75,
    scoreMultiplier: 1,
    enemies: 16,
    lives: 5,
    maxBallSpeed: 800,
    growSpeed: 1.5
  },
  {
    id: 9,
    name: 'Level 7',
    text: 'And some of us live longer than others.' ,
    targetPercent: 0.75,
    scoreMultiplier: 1,
    enemies: 16,
    lives: 10,
    maxBallSpeed: 1200,
    growSpeed: 1.5
  },
  {
    id: 10,
    name: 'Level 8',
    text: 'Some of us don\'t change.' ,
    targetPercent: 0.75,
    scoreMultiplier: 1,
    enemies: 16,
    lives: 10,
    maxBallSpeed: 1200,
    growSpeed: 1.5
  },
  {
    id: 11,
    name: 'Level 9',
    text: 'Ever.' ,
    targetPercent: 0.75,
    scoreMultiplier: 1,
    enemies: 16,
    lives: 10,
    maxBallSpeed: 1200,
    growSpeed: 1.5
  },
  {
    id: 12,
    name: 'Level 10',
    text: 'Some of Us Are Exciting.' ,
    targetPercent: 0.5,
    scoreMultiplier: 1,
    enemies: 10,
    lives: 5,
    maxBallSpeed: 3000,
    growSpeed: 5

  },
  {
    id: 13,
    name: 'Level 11',
    text: 'Some of Us Are... Less So.',
    targetPercent: 0.05,
    scoreMultiplier: 1,
    enemies: 30,
    lives: 8,
    maxBallSpeed: 600,
    growSpeed: 0.25
  },
  {
    id: 14,
    name: 'Level 11',
    text: 'Some of Us Feel Alone in a Crowd' ,
    targetPercent: 0.025,
    scoreMultiplier: 1,
    enemies: 100,
    lives: 1,
    maxBallSpeed: 1,
    growSpeed: 0.1
  },
  {
    id: 15,
    name: 'Level 11',
    text: 'Others Revel In It' ,
    targetPercent: 0.5,
    scoreMultiplier: 1,
    enemies: 100,
    lives: 10,
    maxBallSpeed: 1,
    growSpeed: 3
  },
  {
    id: 16,
    name: 'Level 12',
    text: 'Some of Us Go Through Life Alone' ,
    targetPercent: 1,
    scoreMultiplier: 1,
    enemies: 0,
    lives: 10,
    maxBallSpeed: 1,
    growSpeed: 5
  }
];

},{}]},{},[1])