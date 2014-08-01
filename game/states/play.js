
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
    this.verticalDivider = null;x
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
