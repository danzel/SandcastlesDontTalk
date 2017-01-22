webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(1);
	__webpack_require__(3);
	var Phaser = __webpack_require__(5);
	__webpack_require__(8);
	var Globals = __webpack_require__(10);
	var gameState_1 = __webpack_require__(11);
	var loadingState_1 = __webpack_require__(14);
	var splashScreenState_1 = __webpack_require__(47);
	var SimpleGame = (function () {
	    function SimpleGame() {
	        this.game = new Phaser.Game(Globals.ScreenWidth, Globals.ScreenHeight, Phaser.AUTO, "content");
	        this.game.state.add('loading', loadingState_1.default);
	        this.game.state.add('splashscreen', splashScreenState_1.default);
	        this.game.state.add('game', gameState_1.default);
	        this.game.state.start('loading');
	    }
	    return SimpleGame;
	}());
	var game = new SimpleGame();


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	"use strict";
	exports.ScreenWidth = 1920;
	exports.ScreenHeight = 1080;
	exports.DebugRender = true;
	exports.PlayerRadius = 10;
	exports.ShotRadius = 3;
	exports.ShotAwayDist = 30;
	exports.PlayerSpeed = 300;
	exports.ShotSpeed = 400;
	exports.SlowDownRange = 150;
	exports.FontName = 'Carter One';


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Phaser = __webpack_require__(5);
	var Globals = __webpack_require__(10);
	var player_1 = __webpack_require__(12);
	var powerUp_1 = __webpack_require__(13);
	var wonLast = -1;
	var globalScore = [
	    0, 0, 0, 0
	];
	var lastPowerUp = -1;
	var GameState = (function (_super) {
	    __extends(GameState, _super);
	    function GameState() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.shots = new Array();
	        _this.players = new Array();
	        _this.gameHasEnded = false;
	        _this.timeGameEnded = 0;
	        return _this;
	    }
	    GameState.prototype.init = function () {
	        this.defaultFrameRate = 0.016666666666666666;
	        //TODO
	    };
	    GameState.prototype.preload = function () {
	        this.timeGameEnded = 0;
	        this.shots.length = 0;
	        this.players.length = 0;
	        this.gameHasEnded = false;
	        do {
	            this.powerUp = Math.floor(Math.random() * powerUp_1.PowerUp.Count);
	        } while (this.powerUp == lastPowerUp);
	        lastPowerUp = this.powerUp;
	        this.lastBulletHellShot = this.game.time.totalElapsedSeconds();
	        this.physics.startSystem(Phaser.Physics.P2JS);
	        this.physics.p2.restitution = 1;
	        this.physics.p2.friction = 0;
	        this.physics.p2.setImpactEvents(true);
	    };
	    GameState.prototype.create = function () {
	        var _this = this;
	        this.camera.shake(0, 0);
	        var bg = this.add.sprite(0, 0, 'bg');
	        var xRight = 20;
	        var yBot = 130;
	        this.add.audio(powerUp_1.PowerUp[this.powerUp]).play();
	        this.sparkEmitter = this.game.add.emitter(0, 0, 1000);
	        this.sparkEmitter.blendMode = PIXI.blendModes.ADD;
	        this.sparkEmitter.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In);
	        this.sparkEmitter.setRotation(0, 360);
	        this.sparkEmitter.setXSpeed(-30, 30);
	        this.sparkEmitter.setYSpeed(-30, 30);
	        this.sparkEmitter.makeParticles('particle_1'); //TODO: REAL PARTICLE GFX
	        this.scoreText = [
	            this.add.text(xRight, 0, '' + globalScore[0], { font: '100px ' + Globals.FontName, fill: '#ffffff' }),
	            this.add.text(Globals.ScreenWidth - xRight, 0, '' + globalScore[1], { font: '100px ' + Globals.FontName, fill: '#ffffff' }),
	            this.add.text(Globals.ScreenWidth - xRight, Globals.ScreenHeight - yBot, '' + globalScore[2], { font: '100px ' + Globals.FontName, fill: '#ffffff' }),
	            this.add.text(xRight, Globals.ScreenHeight - yBot, '' + globalScore[3], { font: '100px ' + Globals.FontName, fill: '#ffffff' })
	        ];
	        this.scoreText[1].anchor.set(1, 0);
	        this.scoreText[2].anchor.set(1, 0);
	        this.scoreText.forEach(function (s) { return s.sendToBack(); });
	        var pt = this.add.text(Globals.ScreenWidth / 2, Globals.ScreenHeight / 2, powerUp_1.PowerUp[this.powerUp], {
	            font: '100px ' + Globals.FontName, fill: '#ffffff'
	        });
	        pt.anchor.set(0.5);
	        var tween = this.game.add.tween(pt);
	        tween.to({}, 1000)
	            .chain(this.game.add.tween(pt)
	            .to({ alpha: 0 }, 1000))
	            .start();
	        this.players.push(new player_1.Player(this.shots, this.input.gamepad.pad1, 1, this.powerUp));
	        this.players.push(new player_1.Player(this.shots, this.input.gamepad.pad2, 2, this.powerUp));
	        this.players.push(new player_1.Player(this.shots, this.input.gamepad.pad3, 3, this.powerUp));
	        this.players.push(new player_1.Player(this.shots, this.input.gamepad.pad4, 4, this.powerUp));
	        if (wonLast >= 0) {
	            this.players[wonLast].addCrown();
	        }
	        this.explodeSound = this.game.add.sound('explode');
	        this.physics.p2.onBeginContact.add(function (a, b, c, d, e) {
	            if (a.player && !a.player.isDead) {
	                var p = a.player;
	                _this.killPlayer(p);
	                console.log('rip');
	            }
	            if (b.player && !b.player.isDead) {
	                var p = b.player;
	                _this.killPlayer(p);
	                console.log('rip');
	            }
	            if (a.shotBy && b.shotBy && a.shotBy != b.shotBy) {
	                console.log('collideshot');
	                var aSprite = a.sprite;
	                var bSprite = b.sprite;
	                var midX = (aSprite.x + bSprite.x) / 2;
	                var midY = (aSprite.y + bSprite.y) / 2;
	                a.shotBy = null;
	                b.shotBy = null;
	                _this.shots.splice(_this.shots.indexOf(a.sprite), 1);
	                _this.shots.splice(_this.shots.indexOf(b.sprite), 1);
	                aSprite.destroy();
	                bSprite.destroy();
	                //make magic
	                _this.createExplosion(midX, midY, 8);
	            }
	            if (_this.shots.indexOf(a.sprite) >= 0 || _this.shots.indexOf(b.sprite) >= 0) {
	                var sprite = a.sprite || b.sprite;
	                if (!sprite.hasParticledThisTick) {
	                    _this.sparkEmitter.x = sprite.x;
	                    _this.sparkEmitter.y = sprite.y;
	                    _this.sparkEmitter.start(true, 2000, null, 10);
	                    sprite.hasParticledThisTick = true;
	                }
	            }
	        });
	        if (this.powerUp == powerUp_1.PowerUp.Walls) {
	            this.addWalls();
	            this.add.sprite(0, 0, 'walls').sendToBack();
	        }
	        bg.sendToBack();
	    };
	    GameState.prototype.update = function () {
	        //console.log(this.input.gamepad.supported, this.input.gamepad.active, this.input.gamepad.pad1.connected, this.input.gamepad.pad1.axis(Phaser.Gamepad.AXIS_0));
	        var _this = this;
	        this.players.forEach(function (p) { return p.update(); });
	        if (!this.gameHasEnded) {
	            var alive = this.players.filter(function (p) { return !p.isDead; });
	            var amountAlive = alive.length;
	            this.gameHasEnded = amountAlive <= 1;
	            if (amountAlive == 1) {
	                var text = this.add.text(this.world.centerX, this.world.centerY, ' PLAYER ' + alive[0].playerNumber + ' WINS! ', { font: '100px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
	                text.anchor.setTo(0.5, 0.5);
	                globalScore[alive[0].playerNumber - 1]++;
	                this.scoreText[alive[0].playerNumber - 1].text = '' + globalScore[alive[0].playerNumber - 1];
	                wonLast = alive[0].playerNumber - 1;
	                alive[0].addCrown();
	                this.add.audio('win_' + alive[0].playerNumber).play();
	            }
	            else if (amountAlive == 0) {
	                var text = this.add.text(this.world.centerX, this.world.centerY, 'DRAW!!!', { font: '100px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
	                text.anchor.setTo(0.5, 0.5);
	                wonLast = -1;
	                this.add.audio('draw').play();
	            }
	            if (this.gameHasEnded) {
	                this.timeGameEnded = this.time.totalElapsedSeconds();
	            }
	        }
	        if (this.gameHasEnded && this.time.totalElapsedSeconds() - this.timeGameEnded > 2) {
	            this.state.start('game');
	        }
	        this.shots.forEach(function (c) {
	            c.shouldBeSlowNow = false;
	            c.hasParticledThisTick = false;
	        });
	        this.players.forEach(function (p) {
	            if (p.isDead)
	                return;
	            var pPos = new Phaser.Point(p.body.x, p.body.y);
	            _this.shots.forEach(function (c) {
	                var a = c;
	                var body = a.body;
	                var dist = new Phaser.Point(body.x, body.y).distance(pPos);
	                if (dist < Globals.SlowDownRange) {
	                    a.shouldBeSlowNow = true;
	                }
	            });
	            if (!p.pad.connected) {
	                p.isDead = true;
	                p.sprite.destroy();
	                _this.scoreText[p.playerNumber - 1].destroy();
	            }
	        });
	        this.shots.forEach(function (c) {
	            var a = c;
	            var body = a.body;
	            if (a.isInInitialSlowArea) {
	                if (!a.shouldBeSlowNow)
	                    a.isInInitialSlowArea = false;
	            }
	            else {
	                if (!a.shouldBeSlowNow && a.isSlowNow) {
	                    _this.hackVelocityMultiplier(body, 4);
	                    a.isSlowNow = false;
	                }
	                if (a.shouldBeSlowNow && !a.isSlowNow) {
	                    _this.hackVelocityMultiplier(body, 0.25);
	                    a.isSlowNow = true;
	                }
	            }
	            if (_this.powerUp == powerUp_1.PowerUp.BulletsSlowDown && !a.player) {
	                _this.hackVelocityMultiplier(body, 0.99);
	            }
	        });
	        if (this.powerUp == powerUp_1.PowerUp.RealBulletHell) {
	            var timeSince = this.game.time.totalElapsedSeconds() - this.lastBulletHellShot;
	            if (timeSince >= 0.2) {
	                this.lastBulletHellShot = this.game.time.totalElapsedSeconds();
	                //this.shot
	                if (!this.bulletHellDir) {
	                    this.bulletHellDir = new Phaser.Point(1, 0);
	                    this.bulletHellDir = this.bulletHellDir.rotate(0, 0, Math.random() * 360, true);
	                }
	                this.createShot(10, 10, this.bulletHellDir);
	                this.createShot(Globals.ScreenWidth - 10, 10, this.bulletHellDir);
	                this.createShot(Globals.ScreenWidth - 10, Globals.ScreenHeight - 10, this.bulletHellDir);
	                this.createShot(10, Globals.ScreenHeight - 10, this.bulletHellDir);
	                this.bulletHellDir = this.bulletHellDir.rotate(0, 0, 10 + Math.random() * 2, true);
	            }
	        }
	        if (this.powerUp == powerUp_1.PowerUp.SuperHot || this.powerUp == powerUp_1.PowerUp.SuperHotSpreadShot) {
	            var alivePlayers = this.players.filter(function (p) { return !p.isDead; });
	            if (alivePlayers.length > 0) {
	                var scaler_1 = 0;
	                alivePlayers.forEach(function (p) { return scaler_1 += new Phaser.Point(p.body.velocity.x, p.body.velocity.y).distance(new Phaser.Point(0, 0)); });
	                scaler_1 /= alivePlayers.length;
	                scaler_1 /= Globals.PlayerSpeed;
	                scaler_1 *= 1.5;
	                this.game.physics.p2.frameRate = this.defaultFrameRate * scaler_1;
	            }
	            else {
	                this.game.physics.p2.frameRate = this.defaultFrameRate;
	            }
	        }
	        else {
	            this.game.physics.p2.frameRate = this.defaultFrameRate;
	        }
	        if (this.powerUp == powerUp_1.PowerUp.Wrap) {
	            this.players.forEach(function (p) {
	                if (p.body.x < 0) {
	                    p.body.x += Globals.ScreenWidth;
	                }
	                if (p.body.x >= Globals.ScreenWidth) {
	                    p.body.x -= Globals.ScreenWidth;
	                }
	            });
	        }
	    };
	    GameState.prototype.killPlayer = function (p) {
	        this.explodeSound.play();
	        this.createExplosion(p.sprite.x, p.sprite.y, 15);
	        p.sprite.destroy();
	        p.isDead = true;
	        this.game.camera.shake(0.02, 200);
	        if (!this.gameHasEnded) {
	            this.scoreText[p.playerNumber - 1].alpha = 0.3;
	        }
	    };
	    GameState.prototype.hackVelocityMultiplier = function (body, amount) {
	        var x = body.velocity.x;
	        var y = body.velocity.y;
	        body.setZeroVelocity();
	        body.moveRight(x * amount);
	        body.moveDown(y * amount);
	    };
	    GameState.prototype.createExplosion = function (x, y, explosionSize) {
	        var _this = this;
	        var directions = new Array();
	        for (var i = 0; i < explosionSize; i++) {
	            var a = new Phaser.Point(1, 0);
	            a = a.rotate(0, 0, i * 360 / explosionSize, true);
	            directions.push(a);
	        }
	        directions.forEach(function (dir) {
	            _this.createShot(x + dir.x * 20, y + dir.y * 20, dir);
	        });
	        this.sparkEmitter.x = x;
	        this.sparkEmitter.y = y;
	        this.sparkEmitter.start(true, 2000, null, 40);
	    };
	    GameState.prototype.createShot = function (x, y, dir) {
	        //TODO move player code here? and then just have one
	        var shot = this.game.add.sprite(x, y, 'shot_0');
	        shot.blendMode = PIXI.blendModes.ADD;
	        shot.scale.set(3 * Globals.ShotRadius / 136);
	        this.game.physics.p2.enable(shot);
	        var shotBody = shot.body;
	        shotBody.setCircle(Globals.ShotRadius);
	        shotBody.collideWorldBounds = true;
	        shotBody.moveRight(dir.x * Globals.ShotSpeed);
	        shotBody.moveDown(dir.y * Globals.ShotSpeed);
	        shotBody.damping = 0;
	        if (this.powerUp == powerUp_1.PowerUp.Wrap) {
	            shotBody.collideWorldBounds = false;
	        }
	        shotBody.angle = Math.random() * 360;
	        this.shots.push(shot);
	    };
	    GameState.prototype.render = function () {
	    };
	    GameState.prototype.addWalls = function () {
	        var _this = this;
	        var places = [
	            [
	                500, Globals.ScreenHeight / 2,
	                400, 40
	            ],
	            [
	                Globals.ScreenWidth - 500, Globals.ScreenHeight / 2,
	                400, 40
	            ],
	            [
	                Globals.ScreenWidth - 500 - 200, Globals.ScreenHeight / 2,
	                40, 600
	            ],
	            [
	                500 + 200, Globals.ScreenHeight / 2,
	                40, 600
	            ]
	        ];
	        places.forEach(function (p) {
	            var wall = _this.game.add.sprite(p[0], p[1], '1px');
	            _this.game.physics.p2.enable(wall);
	            var wallBody = wall.body;
	            wallBody.clearShapes();
	            wallBody.addRectangle(p[2], p[3]);
	            wallBody.static = true;
	        });
	    };
	    return GameState;
	}(Phaser.State));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = GameState;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Globals = __webpack_require__(10);
	var powerUp_1 = __webpack_require__(13);
	var toEdgeX = 600;
	var toEdgeY = 200;
	var startPoses = [
	    [toEdgeX, toEdgeY],
	    [Globals.ScreenWidth - toEdgeX, toEdgeY],
	    [Globals.ScreenWidth - toEdgeX, Globals.ScreenHeight - toEdgeY],
	    [toEdgeX, Globals.ScreenHeight - toEdgeY]
	];
	var bulletHellStartPoses = [
	    [Globals.ScreenWidth / 2 - 100, Globals.ScreenHeight / 2 - 100],
	    [Globals.ScreenWidth / 2 + 100, Globals.ScreenHeight / 2 - 100],
	    [Globals.ScreenWidth / 2 + 100, Globals.ScreenHeight / 2 + 100],
	    [Globals.ScreenWidth / 2 - 100, Globals.ScreenHeight / 2 + 100],
	];
	var colors = [
	    0xffcccc,
	    0xccffcc,
	    0xccccff,
	    0xffeebb
	];
	var Player = (function () {
	    function Player(shots, pad, playerNumber, powerUp) {
	        var _this = this;
	        this.shots = shots;
	        this.pad = pad;
	        this.playerNumber = playerNumber;
	        this.isDead = false;
	        this.lastShot = this.pad.game.time.totalElapsedSeconds();
	        this.powerUp = powerUp;
	        pad.deadZone = 0;
	        this.shootSound = pad.game.add.audio('shoot');
	        var startPos = ((powerUp == powerUp_1.PowerUp.RealBulletHell) ? bulletHellStartPoses : startPoses);
	        this.sprite = pad.game.add.sprite(startPos[playerNumber - 1][0], startPos[playerNumber - 1][1], '1px');
	        this.pad.game.physics.p2.enable(this.sprite);
	        this.body = this.sprite.body;
	        this.body.data.player = this; //HACK
	        this.body.clearShapes();
	        this.body.addCircle(Globals.PlayerRadius);
	        //this.body.setCircle(Globals.PlayerRadius, 0, 0);
	        this.body.collideWorldBounds = true;
	        this.color = colors[playerNumber - 1]; //hack
	        pad.onDownCallback = function (inputIndex) {
	            //right bumper
	            if (inputIndex == 5) {
	            }
	            if (inputIndex == 9) {
	                _this.pad.game.state.start('game');
	            }
	        };
	        if (powerUp == powerUp_1.PowerUp.Wrap) {
	            this.body.collideWorldBounds = false;
	        }
	        var circle = this.pad.game.add.graphics(0, 0);
	        this.sprite.addChild(circle);
	        circle.lineStyle(2, 0xffffff, 0.2);
	        circle.beginFill(this.color, 0.2);
	        circle.drawCircle(0, 0, Globals.SlowDownRange * 2);
	        //circle.beginFill(0, 1);
	        //circle.beginFill(this.color, 1);
	        //circle.drawCircle(0, 0, Globals.PlayerRadius * 2);
	        this.realSprite = this.pad.game.add.sprite(0, 0, 'player_' + playerNumber);
	        this.realSprite.anchor.set(0.5, 0.575);
	        this.sprite.addChild(this.realSprite);
	    }
	    Player.prototype.addCrown = function () {
	        var crown = this.pad.game.add.sprite(0, -40, 'crown');
	        crown.scale.set(0.8);
	        crown.anchor.set(0.53, -0.1);
	        this.sprite.addChild(crown);
	    };
	    Player.prototype.update = function () {
	        if (!this.pad.connected || this.isDead)
	            return;
	        var speed = Globals.PlayerSpeed;
	        if (this.powerUp == powerUp_1.PowerUp.Speedy)
	            speed *= 1.6;
	        this.body.setZeroVelocity();
	        this.body.moveRight(this.pad.axis(0) * speed);
	        this.body.moveDown(this.pad.axis(1) * speed);
	        this.realSprite.angle = new Phaser.Point(this.body.velocity.x, this.body.velocity.y).angle(new Phaser.Point(0, 0), true) - 90;
	        var timeSinceLast = this.pad.game.time.totalElapsedSeconds() - this.lastShot;
	        var thing = new Phaser.Point(this.pad.axis(2), this.pad.axis(3));
	        var length = thing.distance(new Phaser.Point(0, 0));
	        thing.normalize();
	        var timeBetweenShots = 0.5;
	        if (this.powerUp == powerUp_1.PowerUp.MachineGun) {
	            timeBetweenShots = 0.2;
	        }
	        if (this.powerUp == powerUp_1.PowerUp.SpreadShot || this.powerUp == powerUp_1.PowerUp.SuperHotSpreadShot) {
	            timeBetweenShots *= 2;
	        }
	        if (this.powerUp != powerUp_1.PowerUp.RealBulletHell && timeSinceLast > timeBetweenShots && length > 0.7) {
	            this.lastShot = this.pad.game.time.totalElapsedSeconds();
	            var spreadAmount = 10;
	            this.shootSound.play();
	            this.fireShot(thing);
	            if (this.powerUp == powerUp_1.PowerUp.SpreadShot || this.powerUp == powerUp_1.PowerUp.SuperHotSpreadShot) {
	                thing = thing.rotate(0, 0, spreadAmount, true);
	                this.fireShot(thing);
	                thing = thing.rotate(0, 0, -2 * spreadAmount, true);
	                this.fireShot(thing);
	                thing = thing.rotate(0, 0, 3 * spreadAmount, true);
	                this.fireShot(thing);
	                thing = thing.rotate(0, 0, -4 * spreadAmount, true);
	                this.fireShot(thing);
	            }
	        }
	    };
	    Player.prototype.fireShot = function (thing) {
	        var x = this.sprite.x + Globals.PlayerRadius - Globals.ShotRadius + thing.x * (Globals.PlayerRadius + Globals.ShotAwayDist);
	        var y = this.sprite.y + Globals.PlayerRadius - Globals.ShotRadius + thing.y * (Globals.PlayerRadius + Globals.ShotAwayDist);
	        var shot = this.pad.game.add.sprite(x, y, 'shot_' + this.playerNumber);
	        shot.scale.set(3 * Globals.ShotRadius / 136);
	        shot.blendMode = PIXI.blendModes.ADD;
	        //shot.beginFill(this.color, 0.7);
	        //shot.drawCircle(0, 0, Globals.ShotRadius * 2);
	        this.pad.game.physics.p2.enable(shot);
	        var shotBody = shot.body;
	        shotBody.setCircle(Globals.ShotRadius);
	        shotBody.angle = Math.random() * 360;
	        if (this.powerUp == powerUp_1.PowerUp.Wrap) {
	            shotBody.collideWorldBounds = false;
	        }
	        var shotSpeed = Globals.ShotSpeed;
	        if (this.powerUp == powerUp_1.PowerUp.Speedy) {
	            shotSpeed *= 2;
	        }
	        shotBody.moveRight(thing.x * shotSpeed);
	        shotBody.moveDown(thing.y * shotSpeed);
	        shotBody.damping = 0;
	        //TODO shotBody.bounce.set(1);
	        shotBody.data.sprite = shot;
	        shotBody.data.shotBy = this;
	        shotBody.data.color = this.color;
	        shot.isInInitialSlowArea = true;
	        this.shots.push(shot);
	    };
	    return Player;
	}());
	exports.Player = Player;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	var PowerUp;
	(function (PowerUp) {
	    //None,
	    PowerUp[PowerUp["SuperHot"] = 0] = "SuperHot";
	    PowerUp[PowerUp["SuperHotSpreadShot"] = 1] = "SuperHotSpreadShot";
	    PowerUp[PowerUp["Walls"] = 2] = "Walls";
	    PowerUp[PowerUp["RealBulletHell"] = 3] = "RealBulletHell";
	    PowerUp[PowerUp["Speedy"] = 4] = "Speedy";
	    PowerUp[PowerUp["MachineGun"] = 5] = "MachineGun";
	    PowerUp[PowerUp["SpreadShot"] = 6] = "SpreadShot";
	    PowerUp[PowerUp["BulletsSlowDown"] = 7] = "BulletsSlowDown";
	    PowerUp[PowerUp["Count"] = 8] = "Count";
	    PowerUp[PowerUp["Wrap"] = 9] = "Wrap";
	})(PowerUp = exports.PowerUp || (exports.PowerUp = {}));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Phaser = __webpack_require__(5);
	var WebFont = __webpack_require__(15);
	var Globals = __webpack_require__(10);
	var powerUp_1 = __webpack_require__(13);
	var LoadingState = (function (_super) {
	    __extends(LoadingState, _super);
	    function LoadingState() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.loaded = 0;
	        return _this;
	    }
	    LoadingState.prototype.init = function () {
	    };
	    LoadingState.prototype.preload = function () {
	        var _this = this;
	        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	        WebFont.load({
	            google: {
	                families: [Globals.FontName]
	            },
	            active: function () { return _this.create(); }
	        });
	        var text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts and sweet sweet graphics', { font: '16px Arial', fill: '#dddddd', align: 'center' });
	        text.anchor.setTo(0.5, 0.5);
	        this.load.image('1px', __webpack_require__(16));
	        this.load.image('particle_1', __webpack_require__(17));
	        this.load.image('player_1', __webpack_require__(18));
	        this.load.image('player_2', __webpack_require__(19));
	        this.load.image('player_3', __webpack_require__(20));
	        this.load.image('player_4', __webpack_require__(21));
	        this.load.image('shot_1', __webpack_require__(22));
	        this.load.image('shot_2', __webpack_require__(23));
	        this.load.image('shot_3', __webpack_require__(24));
	        this.load.image('shot_4', __webpack_require__(25));
	        this.load.image('shot_0', __webpack_require__(26));
	        this.load.image('bg', __webpack_require__(27));
	        this.load.image('walls', __webpack_require__(28));
	        this.load.image('crown', __webpack_require__(29));
	        this.load.image('SplashScreen', __webpack_require__(30));
	        this.load.image('Title', __webpack_require__(31));
	        this.load.audio('shoot', __webpack_require__(32));
	        this.load.audio('explode', __webpack_require__(33));
	        //Needed?
	        /*this.game.sound.setDecodedCallback([
	            'shoot', 'explode'
	        ], () => { }, this);*/
	        this.load.audio(powerUp_1.PowerUp[powerUp_1.PowerUp.BulletsSlowDown], __webpack_require__(34));
	        this.load.audio(powerUp_1.PowerUp[powerUp_1.PowerUp.MachineGun], __webpack_require__(35));
	        this.load.audio(powerUp_1.PowerUp[powerUp_1.PowerUp.RealBulletHell], __webpack_require__(36));
	        this.load.audio(powerUp_1.PowerUp[powerUp_1.PowerUp.Speedy], __webpack_require__(37));
	        this.load.audio(powerUp_1.PowerUp[powerUp_1.PowerUp.SpreadShot], __webpack_require__(38));
	        this.load.audio(powerUp_1.PowerUp[powerUp_1.PowerUp.SuperHot], __webpack_require__(39));
	        this.load.audio(powerUp_1.PowerUp[powerUp_1.PowerUp.SuperHotSpreadShot], __webpack_require__(40));
	        this.load.audio(powerUp_1.PowerUp[powerUp_1.PowerUp.Walls], __webpack_require__(41));
	        this.load.audio('draw', __webpack_require__(42));
	        this.load.audio('win_1', __webpack_require__(43));
	        this.load.audio('win_2', __webpack_require__(44));
	        this.load.audio('win_3', __webpack_require__(45));
	        this.load.audio('win_4', __webpack_require__(46));
	        this.input.gamepad.start();
	    };
	    LoadingState.prototype.create = function () {
	        this.loaded++;
	        if (this.loaded == 2) {
	            //this.state.start('game');
	            this.state.start('splashscreen');
	        }
	    };
	    return LoadingState;
	}(Phaser.State));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LoadingState;


/***/ },
/* 15 */,
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "e3c35d210dcd163d9abacad207b05a2b.png";

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "397cc0366391ffdbf15ddab1d6af34a8.png";

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c669aece517d978a1fc1c3b730be3b21.png";

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "5d00af30d584e3d1e75829391761da02.png";

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "7a74761fb3324a3954e04d1d5b91fa63.png";

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "9e8ced068af2dd29b6465d86d7459a5d.png";

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "7de15cae48e797c49dd3f285e64e2236.png";

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c7256a5e7355141b92786de6b87cb61c.png";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f42025ff4e0a370840513be5460d3cdf.png";

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "de1c3c4b0c65a2d430d664902e5865e7.png";

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "83b66ce5cb3e76f9c0966c5c6d633909.png";

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "d7b81339f883eac2ac0d0c7cd6e02569.png";

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "27ec246cbb2e833925ce913ce9e1670c.png";

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "777e0863fc94314b487f4d2c9ab982d1.png";

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "78e6593ec6a989f1b6210df2f932d929.png";

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "e043eb52b0f1e1ef4555214f02aa16fa.png";

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "73b1892556a6bc84b1ffc2d300071050.m4a";

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c9a90b67a6ddd6034808893551a9c729.m4a";

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "eb35ddc1bfd169a35f568a0728439797.m4a";

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "40c93ffd78f623c336f0f45da1f45461.m4a";

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "440bac681dfebf30b46cae395a571ace.m4a";

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "9f8b31582f7f9b5812858690e1222f96.m4a";

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "078c16755867ba3726fa7f51025c841a.m4a";

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "8141c7684ac8cb2c6a0e4828f90ec767.m4a";

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "0075945f4a3286f0034837afa72103cf.m4a";

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "2e2f9d8b2d11a8e57bc4790f83e9b1b4.m4a";

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "9312eb78af4703bb3dafff65f8557b6f.m4a";

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "67bc0a755fb9a385c2bcce1636e446cc.m4a";

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "1a1d0465a18bfa7a19af49a0d0b46ad1.m4a";

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c0d857dcdc46d6bc3b5b52a311e49d21.m4a";

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a90df81ffbbbd81b1b2d46376287ea8f.m4a";

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Globals = __webpack_require__(10);
	var LoadingState = (function (_super) {
	    __extends(LoadingState, _super);
	    function LoadingState() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    LoadingState.prototype.init = function () {
	    };
	    LoadingState.prototype.create = function () {
	        this.physics.startSystem(Phaser.Physics.P2JS);
	        this.physics.p2.restitution = 1;
	        this.physics.p2.friction = 0;
	        this.physics.p2.setImpactEvents(true);
	        this.add.sprite(0, 0, 'SplashScreen');
	        for (var i = 0; i < 200; i++) {
	            var shot = this.game.add.sprite(Math.random() * Globals.ScreenWidth, Math.random() * Globals.ScreenHeight, 'shot_' + Math.floor(Math.random() * 5));
	            shot.blendMode = PIXI.blendModes.ADD;
	            shot.scale.set(3 * Globals.ShotRadius / 136);
	            this.game.physics.p2.enable(shot);
	            var shotBody = shot.body;
	            shotBody.setCircle(Globals.ShotRadius);
	            shotBody.collideWorldBounds = true;
	            shotBody.moveRight((Math.random() * 2 - 1) * Globals.ShotSpeed);
	            shotBody.moveDown((Math.random() * 2 - 1) * Globals.ShotSpeed);
	            shotBody.damping = 0;
	            shotBody.angle = Math.random() * 360;
	        }
	        this.add.sprite(0, 0, 'Title');
	        this.padsText = this.add.text(this.world.centerX, this.world.height - 300, 'TODO', { font: '50px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
	        this.padsText.anchor.setTo(0.5, 0.5);
	        this.startToPlay = this.add.text(this.world.centerX, this.world.height - 200, 'Press Start to Play', { font: '50px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
	        this.startToPlay.anchor.setTo(0.5, 0.5);
	    };
	    LoadingState.prototype.update = function () {
	        this.padsText.text = this.input.gamepad.padsConnected + ' Pads Connected';
	        if (!this.input.gamepad.enabled || !this.input.gamepad.active) {
	            this.padsText.text += '. Press a button to enable maybe';
	        }
	        this.startToPlay.visible = (this.input.gamepad.padsConnected >= 2);
	        if (this.startToPlay.visible) {
	            if (this.input.gamepad.pad1.isDown(9) || this.input.gamepad.pad2.isDown(9) || this.input.gamepad.pad3.isDown(9) || this.input.gamepad.pad4.isDown(9)) {
	                this.state.start('game');
	            }
	        }
	    };
	    return LoadingState;
	}(Phaser.State));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LoadingState;


/***/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9jc3MvcmVzZXQuY3NzIiwid2VicGFjazovLy8uL2dsb2JhbHMudHMiLCJ3ZWJwYWNrOi8vLy4vZ2FtZVN0YXRlLnRzIiwid2VicGFjazovLy8uL3BsYXllci50cyIsIndlYnBhY2s6Ly8vLi9wb3dlclVwLnRzIiwid2VicGFjazovLy8uL2xvYWRpbmdTdGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvaW1hZ2VzLzFweC5wbmciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9wYXJ0aWNsZXMvMS5wbmciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9zcGFjZS9SZWRTcGFjZXNoaXAucG5nIiwid2VicGFjazovLy8uL2Fzc2V0cy9pbWFnZXMvc3BhY2UvR3JlZW5TcGFjZXNoaXAucG5nIiwid2VicGFjazovLy8uL2Fzc2V0cy9pbWFnZXMvc3BhY2UvQmx1ZVNwYWNlc2hpcC5wbmciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9zcGFjZS9ZZWxsb3dTcGFjZXNoaXAucG5nIiwid2VicGFjazovLy8uL2Fzc2V0cy9pbWFnZXMvc2hvdHMvUmVkQW1tby5wbmciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9zaG90cy9HcmVlbkFtbW8ucG5nIiwid2VicGFjazovLy8uL2Fzc2V0cy9pbWFnZXMvc2hvdHMvQmx1ZUFtbW8ucG5nIiwid2VicGFjazovLy8uL2Fzc2V0cy9pbWFnZXMvc2hvdHMvWWVsbG93QW1tby5wbmciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9zaG90cy9TaHJhcG5lbC5wbmciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9CYWNrZ3JvdW5kLnBuZyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvaW1hZ2VzL1dhbGxzLnBuZyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvaW1hZ2VzL0Nyb3duLnBuZyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvaW1hZ2VzL1NwbGFzaFNjcmVlbi5wbmciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2ltYWdlcy9UaXRsZS5wbmciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3NvdW5kcy9zaG9vdC5tNGEiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3NvdW5kcy9leHBsb2RlLm00YSIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9hbm5vdW5jZXItYnVsbGV0c3Nsb3dkb3duLm00YSIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9hbm5vdW5jZXItbWFjaGluZWd1bi5tNGEiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvYW5ub3VuY2VyLXJlYWxidWxsZXRoZWxsLm00YSIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9hbm5vdW5jZXItc3BlZWR5Lm00YSIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9hbm5vdW5jZXItc3ByZWFkc2hvdC5tNGEiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvYW5ub3VuY2VyLXN1cGVyaG90Lm00YSIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9hbm5vdW5jZXItc3VwZXJob3RzcHJlYWRzaG90Lm00YSIsIndlYnBhY2s6Ly8vLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9hbm5vdW5jZXItd2FsbHMubTRhIiwid2VicGFjazovLy8uL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2RyYXcubTRhIiwid2VicGFjazovLy8uL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL3BsYXllcjF3aW4ubTRhIiwid2VicGFjazovLy8uL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL3BsYXllcjJ3aW4ubTRhIiwid2VicGFjazovLy8uL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL3BsYXllcjN3aW4ubTRhIiwid2VicGFjazovLy8uL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL3BsYXllcjR3aW4ubTRhIiwid2VicGFjazovLy8uL3NwbGFzaFNjcmVlblN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0JBQWM7QUFDZCx3QkFBWTtBQUNaLHFDQUFpQztBQUNqQyx3QkFBeUI7QUFDekIsdUNBQXFDO0FBRXJDLDJDQUFvQztBQUNwQyw4Q0FBMEM7QUFDMUMsbURBQW9EO0FBSXBEO0tBS0M7U0FDQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztTQUMvRixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLHNCQUFZLENBQUMsQ0FBQztTQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLDJCQUFpQixDQUFDLENBQUM7U0FDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxtQkFBUyxDQUFDLENBQUM7U0FDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2xDLENBQUM7S0FDRixpQkFBQztBQUFELEVBQUM7QUFFRCxLQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQzFCOUIsMEM7Ozs7Ozs7O0FDQWEsb0JBQVcsR0FBRyxJQUFJLENBQUM7QUFDbkIscUJBQVksR0FBRyxJQUFJLENBQUM7QUFDcEIsb0JBQVcsR0FBRyxJQUFJLENBQUM7QUFFbkIscUJBQVksR0FBRyxFQUFFLENBQUM7QUFDbEIsbUJBQVUsR0FBRyxDQUFDLENBQUM7QUFFZixxQkFBWSxHQUFHLEVBQUUsQ0FBQztBQUVsQixvQkFBVyxHQUFHLEdBQUcsQ0FBQztBQUNsQixrQkFBUyxH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R0FBRyxDQUFDLENBQUM7U0FFNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLG1CQUFPLENBQUMsRUFBeUIsQ0FBQyxDQUFDLENBQUM7U0FFM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLG1CQUFPLENBQUMsRUFBaUMsQ0FBQyxDQUFDLENBQUM7U0FHMUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLG1CQUFPLENBQUMsRUFBd0MsQ0FBQyxDQUFDLENBQUM7U0FDL0UsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLG1CQUFPLENBQUMsRUFBMEMsQ0FBQyxDQUFDLENBQUM7U0FDakYsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLG1CQUFPLENBQUMsRUFBeUMsQ0FBQyxDQUFDLENBQUM7U0FDaEYsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLG1CQUFPLENBQUMsRUFBMkMsQ0FBQyxDQUFDLENBQUM7U0FFbEYsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLG1CQUFPLENBQUMsRUFBbUMsQ0FBQyxDQUFDLENBQUM7U0FDeEUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLG1CQUFPLENBQUMsRUFBcUMsQ0FBQyxDQUFDLENBQUM7U0FDMUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLG1CQUFPLENBQUMsRUFBb0MsQ0FBQyxDQUFDLENBQUM7U0FDekUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLG1CQUFPLENBQUMsRUFBc0MsQ0FBQyxDQUFDLENBQUM7U0FDM0UsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLG1CQUFPLENBQUMsRUFBb0MsQ0FBQyxDQUFDLENBQUM7U0FFekUsSUFBSSxDQUFDLElBQUksQ0FBQyxL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QUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDaEUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQy9ELFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO2FBRXJCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQztTQUN0QyxDQUFDO1NBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUUvQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUMzSixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBRXJDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLHFCQUFxQixFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDN0ssSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUN6QyxDQUFDO0tBRUQsNkJBQU0sR0FBTjtTQUNDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxpQkFBaUIsQ0FBQztTQUUxRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDL0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksa0NBQWtDO1NBQ3pELENBQUM7U0FDRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUduRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RKLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFCLENBQUM7U0FDRixDQUFDO0tBQ0YsQ0FBQztLQUNGLG1CQUFDO0FBQUQsRUFBQyxDQXpEeUMsTUFBTSxDQUFDLEtBQUssR0F5RHJEIiwiZmlsZSI6Im1haW4uYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdwaXhpJztcclxuaW1wb3J0ICdwMic7XHJcbmltcG9ydCAqIGFzIFBoYXNlciBmcm9tICdwaGFzZXInO1xyXG5pbXBvcnQgJy4vY3NzL3Jlc2V0LmNzcyc7XHJcbmltcG9ydCAqIGFzIEdsb2JhbHMgZnJvbSAnLi9nbG9iYWxzJztcclxuXHJcbmltcG9ydCBHYW1lU3RhdGUgZnJvbSAnLi9nYW1lU3RhdGUnO1xyXG5pbXBvcnQgTG9hZGluZ1N0YXRlIGZyb20gJy4vbG9hZGluZ1N0YXRlJztcclxuaW1wb3J0IFNwbGFzaFNjcmVlblN0YXRlIGZyb20gJy4vc3BsYXNoU2NyZWVuU3RhdGUnO1xyXG5cclxuZGVjbGFyZSBmdW5jdGlvbiByZXF1aXJlKGZpbGVuYW1lOiBzdHJpbmcpOiBhbnk7XHJcblxyXG5jbGFzcyBTaW1wbGVHYW1lIHtcclxuXHRnYW1lOiBQaGFzZXIuR2FtZTtcclxuXHRsb2dvOiBQaGFzZXIuU3ByaXRlO1xyXG5cdGN1cnNvcnM6IFBoYXNlci5DdXJzb3JLZXlzO1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZShHbG9iYWxzLlNjcmVlbldpZHRoLCBHbG9iYWxzLlNjcmVlbkhlaWdodCwgUGhhc2VyLkFVVE8sIFwiY29udGVudFwiKTtcclxuXHRcdHRoaXMuZ2FtZS5zdGF0ZS5hZGQoJ2xvYWRpbmcnLCBMb2FkaW5nU3RhdGUpO1xyXG5cdFx0dGhpcy5nYW1lLnN0YXRlLmFkZCgnc3BsYXNoc2NyZWVuJywgU3BsYXNoU2NyZWVuU3RhdGUpO1xyXG5cdFx0dGhpcy5nYW1lLnN0YXRlLmFkZCgnZ2FtZScsIEdhbWVTdGF0ZSk7XHJcblx0XHR0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ2xvYWRpbmcnKTtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgU2ltcGxlR2FtZSgpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9pbmRleC50cyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jc3MvcmVzZXQuY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjb25zdCBTY3JlZW5XaWR0aCA9IDE5MjA7XHJcbmV4cG9ydCBjb25zdCBTY3JlZW5IZWlnaHQgPSAxMDgwO1xyXG5leHBvcnQgY29uc3QgRGVidWdSZW5kZXIgPSB0cnVlO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBsYXllclJhZGl1cyA9IDEwO1xyXG5leHBvcnQgY29uc3QgU2hvdFJhZGl1cyA9IDM7XHJcblxyXG5leHBvcnQgY29uc3QgU2hvdEF3YXlEaXN0ID0gMzA7XHJcblxyXG5leHBvcnQgY29uc3QgUGxheWVyU3BlZWQgPSAzMDA7XHJcbmV4cG9ydCBjb25zdCBTaG90U3BlZWQgPSA0MDA7XHJcblxyXG5leHBvcnQgY29uc3QgU2xvd0Rvd25SYW5nZSA9IDE1MDtcclxuXHJcbmV4cG9ydCBjb25zdCBGb250TmFtZSA9ICdDYXJ0ZXIgT25lJztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbG9iYWxzLnRzIiwiaW1wb3J0ICogYXMgUGhhc2VyIGZyb20gJ3BoYXNlcic7XHJcbmltcG9ydCAqIGFzIFdlYkZvbnQgZnJvbSAnd2ViZm9udGxvYWRlcic7XHJcbmltcG9ydCAqIGFzIEdsb2JhbHMgZnJvbSAnLi9nbG9iYWxzJztcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSAnLi9wbGF5ZXInO1xyXG5pbXBvcnQgeyBQb3dlclVwIH0gZnJvbSAnLi9wb3dlclVwJztcclxuXHJcblxyXG5cclxubGV0IHdvbkxhc3QgPSAtMTtcclxubGV0IGdsb2JhbFNjb3JlID0gW1xyXG5cdDAsIDAsIDAsIDBcclxuXTtcclxubGV0IGxhc3RQb3dlclVwOiBQb3dlclVwID0gLTE7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVTdGF0ZSBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XHJcblxyXG5cdHNob3RzID0gbmV3IEFycmF5PFBoYXNlci5TcHJpdGU+KCk7XHJcblx0cGxheWVycyA9IG5ldyBBcnJheTxQbGF5ZXI+KCk7XHJcblxyXG5cdGdhbWVIYXNFbmRlZCA9IGZhbHNlO1xyXG5cdHBvd2VyVXA6IFBvd2VyVXA7XHJcblx0ZXhwbG9kZVNvdW5kOiBQaGFzZXIuU291bmQ7XHJcblx0c2NvcmVUZXh0OiBBcnJheTxQaGFzZXIuVGV4dD47XHJcblxyXG5cdHNwYXJrRW1pdHRlcjogUGhhc2VyLlBhcnRpY2xlcy5BcmNhZGUuRW1pdHRlcjtcclxuXHJcblx0dGltZUdhbWVFbmRlZCA9IDA7XHJcblxyXG5cdGluaXQoKSB7XHJcblx0XHR0aGlzLmRlZmF1bHRGcmFtZVJhdGUgPSAwLjAxNjY2NjY2NjY2NjY2NjY2NjtcclxuXHRcdC8vVE9ET1xyXG5cdH1cclxuXHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdHRoaXMudGltZUdhbWVFbmRlZCA9IDA7XHJcblx0XHR0aGlzLnNob3RzLmxlbmd0aCA9IDA7XHJcblx0XHR0aGlzLnBsYXllcnMubGVuZ3RoID0gMDtcclxuXHRcdHRoaXMuZ2FtZUhhc0VuZGVkID0gZmFsc2U7XHJcblx0XHRkbyB7IFxyXG5cdFx0XHR0aGlzLnBvd2VyVXAgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBQb3dlclVwLkNvdW50KTtcclxuXHRcdH0gd2hpbGUgKHRoaXMucG93ZXJVcCA9PSBsYXN0UG93ZXJVcCk7XHJcblx0XHRsYXN0UG93ZXJVcCA9IHRoaXMucG93ZXJVcDtcclxuXHJcblx0XHR0aGlzLmxhc3RCdWxsZXRIZWxsU2hvdCA9IHRoaXMuZ2FtZS50aW1lLnRvdGFsRWxhcHNlZFNlY29uZHMoKTtcclxuXHJcblx0XHR0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuUDJKUyk7XHJcblx0XHR0aGlzLnBoeXNpY3MucDIucmVzdGl0dXRpb24gPSAxO1xyXG5cdFx0dGhpcy5waHlzaWNzLnAyLmZyaWN0aW9uID0gMDtcclxuXHRcdHRoaXMucGh5c2ljcy5wMi5zZXRJbXBhY3RFdmVudHModHJ1ZSk7XHJcblx0fVxyXG5cclxuXHJcblx0ZGVmYXVsdEZyYW1lUmF0ZTogbnVtYmVyO1xyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdHRoaXMuY2FtZXJhLnNoYWtlKDAsMCk7XHJcblx0XHRsZXQgYmcgPSB0aGlzLmFkZC5zcHJpdGUoMCwgMCwgJ2JnJyk7XHJcblx0XHRsZXQgeFJpZ2h0ID0gMjA7XHJcblx0XHRsZXQgeUJvdCA9IDEzMDtcclxuXHJcblx0XHR0aGlzLmFkZC5hdWRpbyhQb3dlclVwW3RoaXMucG93ZXJVcF0pLnBsYXkoKTtcclxuXHJcblx0XHR0aGlzLnNwYXJrRW1pdHRlciA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcigwLDAsIDEwMDApO1xyXG5cdFx0KDxhbnk+dGhpcy5zcGFya0VtaXR0ZXIpLmJsZW5kTW9kZSA9IFBJWEkuYmxlbmRNb2Rlcy5BREQ7XHJcblx0XHR0aGlzLnNwYXJrRW1pdHRlci5zZXRBbHBoYSgxLCAwLCAyMDAwLCBQaGFzZXIuRWFzaW5nLkN1YmljLkluKTtcclxuXHRcdHRoaXMuc3BhcmtFbWl0dGVyLnNldFJvdGF0aW9uKDAsIDM2MCk7XHJcblx0XHR0aGlzLnNwYXJrRW1pdHRlci5zZXRYU3BlZWQoLTMwLCAzMCk7XHJcblx0XHR0aGlzLnNwYXJrRW1pdHRlci5zZXRZU3BlZWQoLTMwLCAzMCk7XHJcblxyXG5cdFx0dGhpcy5zcGFya0VtaXR0ZXIubWFrZVBhcnRpY2xlcygncGFydGljbGVfMScpOyAvL1RPRE86IFJFQUwgUEFSVElDTEUgR0ZYXHJcblxyXG5cclxuXHRcdHRoaXMuc2NvcmVUZXh0ID0gW1xyXG5cdFx0XHR0aGlzLmFkZC50ZXh0KHhSaWdodCwgMCwgJycgKyBnbG9iYWxTY29yZVswXSwgeyBmb250OiAnMTAwcHggJyArIEdsb2JhbHMuRm9udE5hbWUsIGZpbGw6ICcjZmZmZmZmJyB9KSxcclxuXHRcdFx0dGhpcy5hZGQudGV4dChHbG9iYWxzLlNjcmVlbldpZHRoIC0geFJpZ2h0LCAwLCAnJyArIGdsb2JhbFNjb3JlWzFdLCB7IGZvbnQ6ICcxMDBweCAnICsgR2xvYmFscy5Gb250TmFtZSwgZmlsbDogJyNmZmZmZmYnIH0pLFxyXG5cdFx0XHR0aGlzLmFkZC50ZXh0KEdsb2JhbHMuU2NyZWVuV2lkdGggLSB4UmlnaHQsIEdsb2JhbHMuU2NyZWVuSGVpZ2h0IC0geUJvdCwgJycgKyBnbG9iYWxTY29yZVsyXSwgeyBmb250OiAnMTAwcHggJyArIEdsb2JhbHMuRm9udE5hbWUsIGZpbGw6ICcjZmZmZmZmJyB9KSxcclxuXHRcdFx0dGhpcy5hZGQudGV4dCh4UmlnaHQsIEdsb2JhbHMuU2NyZWVuSGVpZ2h0IC0geUJvdCwgJycgKyBnbG9iYWxTY29yZVszXSwgeyBmb250OiAnMTAwcHggJyArIEdsb2JhbHMuRm9udE5hbWUsIGZpbGw6ICcjZmZmZmZmJyB9KVxyXG5cdFx0XTtcclxuXHRcdHRoaXMuc2NvcmVUZXh0WzFdLmFuY2hvci5zZXQoMSwgMCk7XHJcblx0XHR0aGlzLnNjb3JlVGV4dFsyXS5hbmNob3Iuc2V0KDEsIDApO1xyXG5cdFx0dGhpcy5zY29yZVRleHQuZm9yRWFjaChzID0+IHMuc2VuZFRvQmFjaygpKTtcclxuXHJcblx0XHRsZXQgcHQgPSB0aGlzLmFkZC50ZXh0KEdsb2JhbHMuU2NyZWVuV2lkdGggLyAyLCBHbG9iYWxzLlNjcmVlbkhlaWdodCAvIDIsIFBvd2VyVXBbdGhpcy5wb3dlclVwXSwge1xyXG5cdFx0XHRmb250OiAnMTAwcHggJyArIEdsb2JhbHMuRm9udE5hbWUsIGZpbGw6ICcjZmZmZmZmJ1xyXG5cdFx0fSk7XHJcblx0XHRwdC5hbmNob3Iuc2V0KDAuNSk7XHJcblx0XHRsZXQgdHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHB0KTtcclxuXHRcdHR3ZWVuLnRvKHt9LCAxMDAwKVxyXG5cdFx0XHQuY2hhaW4odGhpcy5nYW1lLmFkZC50d2VlbihwdClcclxuXHRcdFx0XHQudG8oeyBhbHBoYTogMCB9LCAxMDAwKVxyXG5cdFx0XHQpXHJcblx0XHRcdC5zdGFydCgpO1xyXG5cclxuXHRcdHRoaXMucGxheWVycy5wdXNoKG5ldyBQbGF5ZXIodGhpcy5zaG90cywgdGhpcy5pbnB1dC5nYW1lcGFkLnBhZDEsIDEsIHRoaXMucG93ZXJVcCkpO1xyXG5cdFx0dGhpcy5wbGF5ZXJzLnB1c2gobmV3IFBsYXllcih0aGlzLnNob3RzLCB0aGlzLmlucHV0LmdhbWVwYWQucGFkMiwgMiwgdGhpcy5wb3dlclVwKSk7XHJcblx0XHR0aGlzLnBsYXllcnMucHVzaChuZXcgUGxheWVyKHRoaXMuc2hvdHMsIHRoaXMuaW5wdXQuZ2FtZXBhZC5wYWQzLCAzLCB0aGlzLnBvd2VyVXApKTtcclxuXHRcdHRoaXMucGxheWVycy5wdXNoKG5ldyBQbGF5ZXIodGhpcy5zaG90cywgdGhpcy5pbnB1dC5nYW1lcGFkLnBhZDQsIDQsIHRoaXMucG93ZXJVcCkpO1xyXG5cclxuXHRcdGlmICh3b25MYXN0ID49IDApIHtcclxuXHRcdFx0dGhpcy5wbGF5ZXJzW3dvbkxhc3RdLmFkZENyb3duKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5leHBsb2RlU291bmQgPSB0aGlzLmdhbWUuYWRkLnNvdW5kKCdleHBsb2RlJyk7XHJcblxyXG5cdFx0dGhpcy5waHlzaWNzLnAyLm9uQmVnaW5Db250YWN0LmFkZCgoYSwgYixjLGQsZSkgPT4ge1xyXG5cclxuXHRcdFx0aWYgKGEucGxheWVyICYmICFhLnBsYXllci5pc0RlYWQpIHtcclxuXHRcdFx0XHRsZXQgcCA9IDxQbGF5ZXI+YS5wbGF5ZXI7XHJcblx0XHRcdFx0dGhpcy5raWxsUGxheWVyKHApO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdyaXAnKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChiLnBsYXllciAmJiAhYi5wbGF5ZXIuaXNEZWFkKSB7XHJcblx0XHRcdFx0bGV0IHAgPSA8UGxheWVyPmIucGxheWVyO1xyXG5cdFx0XHRcdHRoaXMua2lsbFBsYXllcihwKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygncmlwJylcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGEuc2hvdEJ5ICYmIGIuc2hvdEJ5ICYmIGEuc2hvdEJ5ICE9IGIuc2hvdEJ5KSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2NvbGxpZGVzaG90Jyk7XHJcblx0XHRcdFx0bGV0IGFTcHJpdGUgPSA8UGhhc2VyLlNwcml0ZT5hLnNwcml0ZTtcclxuXHRcdFx0XHRsZXQgYlNwcml0ZSA9IDxQaGFzZXIuU3ByaXRlPmIuc3ByaXRlO1xyXG5cclxuXHRcdFx0XHRsZXQgbWlkWCA9IChhU3ByaXRlLnggKyBiU3ByaXRlLngpIC8gMjtcclxuXHRcdFx0XHRsZXQgbWlkWSA9IChhU3ByaXRlLnkgKyBiU3ByaXRlLnkpIC8gMjtcclxuXHJcblx0XHRcdFx0YS5zaG90QnkgPSBudWxsO1xyXG5cdFx0XHRcdGIuc2hvdEJ5ID0gbnVsbDtcclxuXHRcdFx0XHR0aGlzLnNob3RzLnNwbGljZSh0aGlzLnNob3RzLmluZGV4T2YoYS5zcHJpdGUpLCAxKTtcclxuXHRcdFx0XHR0aGlzLnNob3RzLnNwbGljZSh0aGlzLnNob3RzLmluZGV4T2YoYi5zcHJpdGUpLCAxKTtcclxuXHRcdFx0XHRhU3ByaXRlLmRlc3Ryb3koKTtcclxuXHRcdFx0XHRiU3ByaXRlLmRlc3Ryb3koKTtcclxuXHJcblx0XHRcdFx0Ly9tYWtlIG1hZ2ljXHJcblx0XHRcdFx0dGhpcy5jcmVhdGVFeHBsb3Npb24obWlkWCwgbWlkWSwgOCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLnNob3RzLmluZGV4T2YoYS5zcHJpdGUpID49IDAgfHwgdGhpcy5zaG90cy5pbmRleE9mKGIuc3ByaXRlKSA+PSAwKSB7XHJcblx0XHRcdFx0bGV0IHNwcml0ZSA9IGEuc3ByaXRlIHx8IGIuc3ByaXRlO1xyXG5cdFx0XHRcdGlmICghc3ByaXRlLmhhc1BhcnRpY2xlZFRoaXNUaWNrKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNwYXJrRW1pdHRlci54ID0gc3ByaXRlLng7XHJcblx0XHRcdFx0XHR0aGlzLnNwYXJrRW1pdHRlci55ID0gc3ByaXRlLnk7XHJcblx0XHRcdFx0XHR0aGlzLnNwYXJrRW1pdHRlci5zdGFydCh0cnVlLCAyMDAwLCBudWxsLCAxMCk7XHJcblx0XHRcdFx0XHRzcHJpdGUuaGFzUGFydGljbGVkVGhpc1RpY2sgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aWYgKHRoaXMucG93ZXJVcCA9PSBQb3dlclVwLldhbGxzKSB7XHJcblx0XHRcdHRoaXMuYWRkV2FsbHMoKTtcclxuXHJcblx0XHRcdHRoaXMuYWRkLnNwcml0ZSgwLCAwLCAnd2FsbHMnKS5zZW5kVG9CYWNrKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ymcuc2VuZFRvQmFjaygpO1xyXG5cclxuXHR9XHJcblxyXG5cdHVwZGF0ZSgpIHtcclxuXHJcblxyXG5cdFx0Ly9jb25zb2xlLmxvZyh0aGlzLmlucHV0LmdhbWVwYWQuc3VwcG9ydGVkLCB0aGlzLmlucHV0LmdhbWVwYWQuYWN0aXZlLCB0aGlzLmlucHV0LmdhbWVwYWQucGFkMS5jb25uZWN0ZWQsIHRoaXMuaW5wdXQuZ2FtZXBhZC5wYWQxLmF4aXMoUGhhc2VyLkdhbWVwYWQuQVhJU18wKSk7XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXJzLmZvckVhY2gocCA9PiBwLnVwZGF0ZSgpKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuZ2FtZUhhc0VuZGVkKSB7XHJcblx0XHRcdGxldCBhbGl2ZSA9IHRoaXMucGxheWVycy5maWx0ZXIocCA9PiAhcC5pc0RlYWQpO1xyXG5cdFx0XHRsZXQgYW1vdW50QWxpdmUgPSBhbGl2ZS5sZW5ndGg7XHJcblx0XHRcdHRoaXMuZ2FtZUhhc0VuZGVkID0gYW1vdW50QWxpdmUgPD0gMTtcclxuXHJcblx0XHRcdGlmIChhbW91bnRBbGl2ZSA9PSAxKSB7XHJcblxyXG5cdFx0XHRcdGxldCB0ZXh0ID0gdGhpcy5hZGQudGV4dCh0aGlzLndvcmxkLmNlbnRlclgsIHRoaXMud29ybGQuY2VudGVyWSwgJyBQTEFZRVIgJyArIGFsaXZlWzBdLnBsYXllck51bWJlciArICcgV0lOUyEgJywgeyBmb250OiAnMTAwcHggJyArIEdsb2JhbHMuRm9udE5hbWUsIGZpbGw6ICcjZGRkZGRkJywgYWxpZ246ICdjZW50ZXInIH0pO1xyXG5cdFx0XHRcdHRleHQuYW5jaG9yLnNldFRvKDAuNSwgMC41KTtcclxuXHJcblx0XHRcdFx0Z2xvYmFsU2NvcmVbYWxpdmVbMF0ucGxheWVyTnVtYmVyIC0gMV0rKztcclxuXHRcdFx0XHR0aGlzLnNjb3JlVGV4dFthbGl2ZVswXS5wbGF5ZXJOdW1iZXIgLSAxXS50ZXh0ID0gJycgKyBnbG9iYWxTY29yZVthbGl2ZVswXS5wbGF5ZXJOdW1iZXIgLSAxXTtcclxuXHJcblx0XHRcdFx0d29uTGFzdCA9IGFsaXZlWzBdLnBsYXllck51bWJlciAtIDE7XHJcblx0XHRcdFx0YWxpdmVbMF0uYWRkQ3Jvd24oKTtcclxuXHRcdFx0XHR0aGlzLmFkZC5hdWRpbygnd2luXycgKyBhbGl2ZVswXS5wbGF5ZXJOdW1iZXIpLnBsYXkoKTtcclxuXHRcdFx0XHRcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoYW1vdW50QWxpdmUgPT0gMCkge1xyXG5cdFx0XHRcdGxldCB0ZXh0ID0gdGhpcy5hZGQudGV4dCh0aGlzLndvcmxkLmNlbnRlclgsIHRoaXMud29ybGQuY2VudGVyWSwgJ0RSQVchISEnLCB7IGZvbnQ6ICcxMDBweCAnICsgR2xvYmFscy5Gb250TmFtZSwgZmlsbDogJyNkZGRkZGQnLCBhbGlnbjogJ2NlbnRlcicgfSk7XHJcblx0XHRcdFx0dGV4dC5hbmNob3Iuc2V0VG8oMC41LCAwLjUpO1xyXG5cdFx0XHRcdHdvbkxhc3QgPSAtMTtcclxuXHRcdFx0XHR0aGlzLmFkZC5hdWRpbygnZHJhdycpLnBsYXkoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHRoaXMuZ2FtZUhhc0VuZGVkKSB7XHJcblx0XHRcdFx0dGhpcy50aW1lR2FtZUVuZGVkID0gdGhpcy50aW1lLnRvdGFsRWxhcHNlZFNlY29uZHMoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuZ2FtZUhhc0VuZGVkICYmIHRoaXMudGltZS50b3RhbEVsYXBzZWRTZWNvbmRzKCkgLSB0aGlzLnRpbWVHYW1lRW5kZWQgPiAyKSB7XHJcblx0XHRcdHRoaXMuc3RhdGUuc3RhcnQoJ2dhbWUnKTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dGhpcy5zaG90cy5mb3JFYWNoKGMgPT4ge1xyXG5cdFx0XHQoPGFueT5jKS5zaG91bGRCZVNsb3dOb3cgPSBmYWxzZTtcclxuXHRcdFx0KDxhbnk+YykuaGFzUGFydGljbGVkVGhpc1RpY2sgPSBmYWxzZTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMucGxheWVycy5mb3JFYWNoKHAgPT4ge1xyXG5cdFx0XHRpZiAocC5pc0RlYWQpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRsZXQgcFBvcyA9IG5ldyBQaGFzZXIuUG9pbnQocC5ib2R5LngsIHAuYm9keS55KTtcclxuXHRcdFx0dGhpcy5zaG90cy5mb3JFYWNoKGMgPT4ge1xyXG5cdFx0XHRcdGxldCBhID0gPGFueT5jO1xyXG5cdFx0XHRcdGxldCBib2R5ID0gPFBoYXNlci5QaHlzaWNzLlAyLkJvZHk+YS5ib2R5O1xyXG5cclxuXHRcdFx0XHRsZXQgZGlzdCA9IG5ldyBQaGFzZXIuUG9pbnQoYm9keS54LCBib2R5LnkpLmRpc3RhbmNlKHBQb3MpO1xyXG5cclxuXHRcdFx0XHRpZiAoZGlzdCA8IEdsb2JhbHMuU2xvd0Rvd25SYW5nZSkge1xyXG5cdFx0XHRcdFx0YS5zaG91bGRCZVNsb3dOb3cgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdGlmICghcC5wYWQuY29ubmVjdGVkKSB7XHJcblx0XHRcdFx0cC5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0XHRcdHAuc3ByaXRlLmRlc3Ryb3koKTtcclxuXHJcblx0XHRcdFx0dGhpcy5zY29yZVRleHRbcC5wbGF5ZXJOdW1iZXIgLSAxXS5kZXN0cm95KCk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblxyXG5cdFx0dGhpcy5zaG90cy5mb3JFYWNoKGMgPT4ge1xyXG5cdFx0XHRsZXQgYSA9IDxhbnk+YztcclxuXHRcdFx0bGV0IGJvZHkgPSA8UGhhc2VyLlBoeXNpY3MuUDIuQm9keT5hLmJvZHk7XHJcblxyXG5cdFx0XHRpZiAoYS5pc0luSW5pdGlhbFNsb3dBcmVhKSB7XHJcblx0XHRcdFx0aWYgKCFhLnNob3VsZEJlU2xvd05vdylcclxuXHRcdFx0XHRcdGEuaXNJbkluaXRpYWxTbG93QXJlYSA9IGZhbHNlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICghYS5zaG91bGRCZVNsb3dOb3cgJiYgYS5pc1Nsb3dOb3cpIHtcclxuXHRcdFx0XHRcdHRoaXMuaGFja1ZlbG9jaXR5TXVsdGlwbGllcihib2R5LCA0KTtcclxuXHRcdFx0XHRcdGEuaXNTbG93Tm93ID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChhLnNob3VsZEJlU2xvd05vdyAmJiAhYS5pc1Nsb3dOb3cpIHtcclxuXHRcdFx0XHRcdHRoaXMuaGFja1ZlbG9jaXR5TXVsdGlwbGllcihib2R5LCAwLjI1KTtcclxuXHRcdFx0XHRcdGEuaXNTbG93Tm93ID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLnBvd2VyVXAgPT0gUG93ZXJVcC5CdWxsZXRzU2xvd0Rvd24gJiYgISg8YW55PmEpLnBsYXllcikge1xyXG5cdFx0XHRcdHRoaXMuaGFja1ZlbG9jaXR5TXVsdGlwbGllcihib2R5LCAwLjk5KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdGlmICh0aGlzLnBvd2VyVXAgPT0gUG93ZXJVcC5SZWFsQnVsbGV0SGVsbCkge1xyXG5cdFx0XHRsZXQgdGltZVNpbmNlID0gdGhpcy5nYW1lLnRpbWUudG90YWxFbGFwc2VkU2Vjb25kcygpIC0gdGhpcy5sYXN0QnVsbGV0SGVsbFNob3Q7XHJcblxyXG5cdFx0XHRpZiAodGltZVNpbmNlID49IDAuMikge1xyXG5cdFx0XHRcdHRoaXMubGFzdEJ1bGxldEhlbGxTaG90ID0gdGhpcy5nYW1lLnRpbWUudG90YWxFbGFwc2VkU2Vjb25kcygpO1xyXG5cdFx0XHRcdC8vdGhpcy5zaG90XHJcblxyXG5cdFx0XHRcdGlmICghdGhpcy5idWxsZXRIZWxsRGlyKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJ1bGxldEhlbGxEaXIgPSBuZXcgUGhhc2VyLlBvaW50KDEsIDApO1xyXG5cdFx0XHRcdFx0dGhpcy5idWxsZXRIZWxsRGlyID0gdGhpcy5idWxsZXRIZWxsRGlyLnJvdGF0ZSgwLCAwLCBNYXRoLnJhbmRvbSgpICogMzYwLCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuY3JlYXRlU2hvdCgxMCwgMTAsIHRoaXMuYnVsbGV0SGVsbERpcik7XHJcblx0XHRcdFx0dGhpcy5jcmVhdGVTaG90KEdsb2JhbHMuU2NyZWVuV2lkdGggLSAxMCwgMTAsIHRoaXMuYnVsbGV0SGVsbERpcik7XHJcblx0XHRcdFx0dGhpcy5jcmVhdGVTaG90KEdsb2JhbHMuU2NyZWVuV2lkdGggLSAxMCwgR2xvYmFscy5TY3JlZW5IZWlnaHQgLSAxMCwgdGhpcy5idWxsZXRIZWxsRGlyKTtcclxuXHRcdFx0XHR0aGlzLmNyZWF0ZVNob3QoMTAsIEdsb2JhbHMuU2NyZWVuSGVpZ2h0IC0gMTAsIHRoaXMuYnVsbGV0SGVsbERpcik7XHJcblxyXG5cdFx0XHRcdHRoaXMuYnVsbGV0SGVsbERpciA9IHRoaXMuYnVsbGV0SGVsbERpci5yb3RhdGUoMCwgMCwgMTAgKyBNYXRoLnJhbmRvbSgpICogMiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5wb3dlclVwID09IFBvd2VyVXAuU3VwZXJIb3QgfHwgdGhpcy5wb3dlclVwID09IFBvd2VyVXAuU3VwZXJIb3RTcHJlYWRTaG90KSB7XHJcblx0XHRcdGxldCBhbGl2ZVBsYXllcnMgPSB0aGlzLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuaXNEZWFkKTtcclxuXHRcdFx0aWYgKGFsaXZlUGxheWVycy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0bGV0IHNjYWxlciA9IDA7XHJcblx0XHRcdFx0YWxpdmVQbGF5ZXJzLmZvckVhY2gocCA9PiBzY2FsZXIgKz0gbmV3IFBoYXNlci5Qb2ludChwLmJvZHkudmVsb2NpdHkueCwgcC5ib2R5LnZlbG9jaXR5LnkpLmRpc3RhbmNlKG5ldyBQaGFzZXIuUG9pbnQoMCwgMCkpKTtcclxuXHRcdFx0XHRzY2FsZXIgLz0gYWxpdmVQbGF5ZXJzLmxlbmd0aDtcclxuXHRcdFx0XHRzY2FsZXIgLz0gR2xvYmFscy5QbGF5ZXJTcGVlZDtcclxuXHRcdFx0XHRzY2FsZXIgKj0gMS41O1xyXG5cdFx0XHRcdHRoaXMuZ2FtZS5waHlzaWNzLnAyLmZyYW1lUmF0ZSA9IHRoaXMuZGVmYXVsdEZyYW1lUmF0ZSAqIHNjYWxlcjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmdhbWUucGh5c2ljcy5wMi5mcmFtZVJhdGUgPSB0aGlzLmRlZmF1bHRGcmFtZVJhdGU7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZ2FtZS5waHlzaWNzLnAyLmZyYW1lUmF0ZSA9IHRoaXMuZGVmYXVsdEZyYW1lUmF0ZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5wb3dlclVwID09IFBvd2VyVXAuV3JhcCkge1xyXG5cdFx0XHR0aGlzLnBsYXllcnMuZm9yRWFjaChwID0+IHtcclxuXHRcdFx0XHRpZiAocC5ib2R5LnggPCAwKSB7XHJcblx0XHRcdFx0XHRwLmJvZHkueCArPSBHbG9iYWxzLlNjcmVlbldpZHRoO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAocC5ib2R5LnggPj0gR2xvYmFscy5TY3JlZW5XaWR0aCkge1xyXG5cdFx0XHRcdFx0cC5ib2R5LnggLT0gR2xvYmFscy5TY3JlZW5XaWR0aDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsYXN0QnVsbGV0SGVsbFNob3Q6IG51bWJlcjtcclxuXHRidWxsZXRIZWxsRGlyOiBQaGFzZXIuUG9pbnQ7XHJcblxyXG5cdGtpbGxQbGF5ZXIocDogUGxheWVyKSB7XHJcblx0XHR0aGlzLmV4cGxvZGVTb3VuZC5wbGF5KCk7XHJcblx0XHR0aGlzLmNyZWF0ZUV4cGxvc2lvbihwLnNwcml0ZS54LCBwLnNwcml0ZS55LCAxNSk7XHJcblx0XHRwLnNwcml0ZS5kZXN0cm95KCk7XHJcblx0XHRwLmlzRGVhZCA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5nYW1lLmNhbWVyYS5zaGFrZSgwLjAyLCAyMDApO1xyXG5cclxuXHRcdGlmICghdGhpcy5nYW1lSGFzRW5kZWQpIHtcclxuXHRcdFx0dGhpcy5zY29yZVRleHRbcC5wbGF5ZXJOdW1iZXIgLSAxXS5hbHBoYSA9IDAuMztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGhhY2tWZWxvY2l0eU11bHRpcGxpZXIoYm9keTogUGhhc2VyLlBoeXNpY3MuUDIuQm9keSwgYW1vdW50OiBudW1iZXIpIHtcclxuXHRcdGxldCB4ID0gYm9keS52ZWxvY2l0eS54O1xyXG5cdFx0bGV0IHkgPSBib2R5LnZlbG9jaXR5Lnk7XHJcblx0XHRib2R5LnNldFplcm9WZWxvY2l0eSgpO1xyXG5cdFx0Ym9keS5tb3ZlUmlnaHQoeCAqIGFtb3VudCk7XHJcblx0XHRib2R5Lm1vdmVEb3duKHkgKiBhbW91bnQpO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlRXhwbG9zaW9uKHgsIHksIGV4cGxvc2lvblNpemUpIHtcclxuXHJcblx0XHRsZXQgZGlyZWN0aW9ucyA9IG5ldyBBcnJheTxQaGFzZXIuUG9pbnQ+KCk7XHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBleHBsb3Npb25TaXplOyBpKyspIHtcclxuXHRcdFx0bGV0IGEgPSBuZXcgUGhhc2VyLlBvaW50KDEsIDApO1xyXG5cdFx0XHRhID0gYS5yb3RhdGUoMCwgMCwgaSAqIDM2MCAvIGV4cGxvc2lvblNpemUsIHRydWUpO1xyXG5cdFx0XHRkaXJlY3Rpb25zLnB1c2goYSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZGlyZWN0aW9ucy5mb3JFYWNoKGRpciA9PiB7XHJcblx0XHRcdHRoaXMuY3JlYXRlU2hvdCh4ICsgZGlyLnggKiAyMCwgeSArIGRpci55ICogMjAsIGRpcik7XHJcblx0XHR9KVxyXG5cclxuXHRcdHRoaXMuc3BhcmtFbWl0dGVyLnggPSB4O1xyXG5cdFx0dGhpcy5zcGFya0VtaXR0ZXIueSA9IHk7XHJcblx0XHR0aGlzLnNwYXJrRW1pdHRlci5zdGFydCh0cnVlLCAyMDAwLCBudWxsLCA0MCk7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVTaG90KHgsIHksIGRpcikge1xyXG5cdFx0Ly9UT0RPIG1vdmUgcGxheWVyIGNvZGUgaGVyZT8gYW5kIHRoZW4ganVzdCBoYXZlIG9uZVxyXG5cclxuXHRcdGxldCBzaG90ID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoeCwgeSwgJ3Nob3RfMCcpO1xyXG5cdFx0c2hvdC5ibGVuZE1vZGUgPSBQSVhJLmJsZW5kTW9kZXMuQUREO1xyXG5cdFx0c2hvdC5zY2FsZS5zZXQoMyAqIEdsb2JhbHMuU2hvdFJhZGl1cyAvIDEzNik7XHJcblxyXG5cdFx0dGhpcy5nYW1lLnBoeXNpY3MucDIuZW5hYmxlKHNob3QpO1xyXG5cdFx0bGV0IHNob3RCb2R5ID0gPFBoYXNlci5QaHlzaWNzLlAyLkJvZHk+c2hvdC5ib2R5O1xyXG5cdFx0c2hvdEJvZHkuc2V0Q2lyY2xlKEdsb2JhbHMuU2hvdFJhZGl1cyk7XHJcblx0XHRzaG90Qm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xyXG5cdFx0c2hvdEJvZHkubW92ZVJpZ2h0KGRpci54ICogR2xvYmFscy5TaG90U3BlZWQpO1xyXG5cdFx0c2hvdEJvZHkubW92ZURvd24oZGlyLnkgKiBHbG9iYWxzLlNob3RTcGVlZCk7XHJcblx0XHRzaG90Qm9keS5kYW1waW5nID0gMDtcclxuXHJcblx0XHRpZiAodGhpcy5wb3dlclVwID09IFBvd2VyVXAuV3JhcCkge1xyXG5cdFx0XHRzaG90Qm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRzaG90Qm9keS5hbmdsZSA9IE1hdGgucmFuZG9tKCkgKiAzNjA7XHJcblx0XHR0aGlzLnNob3RzLnB1c2goc2hvdCk7XHJcblx0fVxyXG5cclxuXHJcblx0cmVuZGVyKCkge1xyXG5cdH1cclxuXHJcblxyXG5cdGFkZFdhbGxzKCkge1xyXG5cclxuXHRcdGxldCBwbGFjZXMgPSBbXHJcblx0XHRcdFtcclxuXHRcdFx0XHQ1MDAsIEdsb2JhbHMuU2NyZWVuSGVpZ2h0IC8gMixcclxuXHRcdFx0XHQ0MDAsIDQwXHJcblx0XHRcdF0sXHJcblx0XHRcdFtcclxuXHRcdFx0XHRHbG9iYWxzLlNjcmVlbldpZHRoIC0gNTAwLCBHbG9iYWxzLlNjcmVlbkhlaWdodCAvIDIsXHJcblx0XHRcdFx0NDAwLCA0MFxyXG5cdFx0XHRdLFxyXG5cdFx0XHRbXHJcblx0XHRcdFx0R2xvYmFscy5TY3JlZW5XaWR0aCAtIDUwMCAtIDIwMCwgR2xvYmFscy5TY3JlZW5IZWlnaHQgLyAyLFxyXG5cdFx0XHRcdDQwLCA2MDBcclxuXHRcdFx0XSxcclxuXHRcdFx0W1xyXG5cdFx0XHRcdDUwMCArIDIwMCwgR2xvYmFscy5TY3JlZW5IZWlnaHQgLyAyLFxyXG5cdFx0XHRcdDQwLCA2MDBcclxuXHRcdFx0XVxyXG5cclxuXHJcblx0XHRdXHJcblxyXG5cdFx0cGxhY2VzLmZvckVhY2gocCA9PiB7XHJcblx0XHRcdGxldCB3YWxsID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUocFswXSwgcFsxXSwgJzFweCcpO1xyXG5cdFx0XHR0aGlzLmdhbWUucGh5c2ljcy5wMi5lbmFibGUod2FsbCk7XHJcblx0XHRcdGxldCB3YWxsQm9keSA9IDxQaGFzZXIuUGh5c2ljcy5QMi5Cb2R5PndhbGwuYm9keTtcclxuXHRcdFx0d2FsbEJvZHkuY2xlYXJTaGFwZXMoKTtcclxuXHRcdFx0d2FsbEJvZHkuYWRkUmVjdGFuZ2xlKHBbMl0sIHBbM10pO1xyXG5cdFx0XHR3YWxsQm9keS5zdGF0aWMgPSB0cnVlO1xyXG5cdFx0fSlcclxuXHJcblx0fVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2FtZVN0YXRlLnRzIiwiaW1wb3J0ICogYXMgR2xvYmFscyBmcm9tICcuL2dsb2JhbHMnO1xyXG5pbXBvcnQgeyBQb3dlclVwIH0gZnJvbSAnLi9wb3dlclVwJztcclxuXHJcbmNvbnN0IHRvRWRnZVggPSA2MDA7XHJcbmNvbnN0IHRvRWRnZVkgPSAyMDA7XHJcbmNvbnN0IHN0YXJ0UG9zZXMgPSBbXHJcblx0W3RvRWRnZVgsIHRvRWRnZVldLFxyXG5cdFtHbG9iYWxzLlNjcmVlbldpZHRoIC0gdG9FZGdlWCwgdG9FZGdlWV0sXHJcblx0W0dsb2JhbHMuU2NyZWVuV2lkdGggLSB0b0VkZ2VYLCBHbG9iYWxzLlNjcmVlbkhlaWdodCAtIHRvRWRnZVldLFxyXG5cdFt0b0VkZ2VYLCBHbG9iYWxzLlNjcmVlbkhlaWdodCAtIHRvRWRnZVldXHJcbl1cclxuXHJcbmNvbnN0IGJ1bGxldEhlbGxTdGFydFBvc2VzID0gW1xyXG5cdFtHbG9iYWxzLlNjcmVlbldpZHRoIC8gMiAtIDEwMCwgR2xvYmFscy5TY3JlZW5IZWlnaHQgLyAyIC0gMTAwXSxcclxuXHRbR2xvYmFscy5TY3JlZW5XaWR0aCAvIDIgKyAxMDAsIEdsb2JhbHMuU2NyZWVuSGVpZ2h0IC8gMiAtIDEwMF0sXHJcblx0W0dsb2JhbHMuU2NyZWVuV2lkdGggLyAyICsgMTAwLCBHbG9iYWxzLlNjcmVlbkhlaWdodCAvIDIgKyAxMDBdLFxyXG5cdFtHbG9iYWxzLlNjcmVlbldpZHRoIC8gMiAtIDEwMCwgR2xvYmFscy5TY3JlZW5IZWlnaHQgLyAyICsgMTAwXSxcclxuXVxyXG5cclxuY29uc3QgY29sb3JzID0gW1xyXG5cdDB4ZmZjY2NjLFxyXG5cdDB4Y2NmZmNjLFxyXG5cdDB4Y2NjY2ZmLFxyXG5cdDB4ZmZlZWJiXHJcbl07XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyIHtcclxuXHJcblx0Y29sb3I6IGFueTtcclxuXHRzcHJpdGU6IFBoYXNlci5TcHJpdGU7XHJcblx0cmVhbFNwcml0ZTogUGhhc2VyLlNwcml0ZTtcclxuXHRib2R5OiBQaGFzZXIuUGh5c2ljcy5QMi5Cb2R5O1xyXG5cclxuXHRsYXN0U2hvdDogbnVtYmVyO1xyXG5cclxuXHRwb3dlclVwOiBQb3dlclVwO1xyXG5cclxuXHRpc0RlYWQgPSBmYWxzZTtcclxuXHJcblx0c2hvb3RTb3VuZDogUGhhc2VyLlNvdW5kO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHNob3RzOiBBcnJheTxQaGFzZXIuU3ByaXRlPiwgcHVibGljIHBhZDogUGhhc2VyLlNpbmdsZVBhZCwgcHVibGljIHBsYXllck51bWJlcjogbnVtYmVyLCBwb3dlclVwOiBQb3dlclVwKSB7XHJcblx0XHR0aGlzLmxhc3RTaG90ID0gdGhpcy5wYWQuZ2FtZS50aW1lLnRvdGFsRWxhcHNlZFNlY29uZHMoKTtcclxuXHJcblx0XHR0aGlzLnBvd2VyVXAgPSBwb3dlclVwO1xyXG5cclxuXHRcdHBhZC5kZWFkWm9uZSA9IDA7XHJcblxyXG5cdFx0dGhpcy5zaG9vdFNvdW5kID0gcGFkLmdhbWUuYWRkLmF1ZGlvKCdzaG9vdCcpO1xyXG5cclxuXHRcdGxldCBzdGFydFBvcyA9ICgocG93ZXJVcCA9PSBQb3dlclVwLlJlYWxCdWxsZXRIZWxsKSA/IGJ1bGxldEhlbGxTdGFydFBvc2VzIDogc3RhcnRQb3Nlcyk7XHJcblx0XHR0aGlzLnNwcml0ZSA9IHBhZC5nYW1lLmFkZC5zcHJpdGUoc3RhcnRQb3NbcGxheWVyTnVtYmVyIC0gMV1bMF0sIHN0YXJ0UG9zW3BsYXllck51bWJlciAtIDFdWzFdLCAnMXB4Jyk7XHJcblxyXG5cdFx0dGhpcy5wYWQuZ2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzLnNwcml0ZSk7XHJcblx0XHR0aGlzLmJvZHkgPSA8UGhhc2VyLlBoeXNpY3MuUDIuQm9keT50aGlzLnNwcml0ZS5ib2R5O1xyXG5cdFx0KDxhbnk+dGhpcy5ib2R5LmRhdGEpLnBsYXllciA9IHRoaXM7Ly9IQUNLXHJcblx0XHR0aGlzLmJvZHkuY2xlYXJTaGFwZXMoKTtcclxuXHRcdHRoaXMuYm9keS5hZGRDaXJjbGUoR2xvYmFscy5QbGF5ZXJSYWRpdXMpO1xyXG5cdFx0Ly90aGlzLmJvZHkuc2V0Q2lyY2xlKEdsb2JhbHMuUGxheWVyUmFkaXVzLCAwLCAwKTtcclxuXHRcdHRoaXMuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xyXG5cdFx0dGhpcy5jb2xvciA9IGNvbG9yc1twbGF5ZXJOdW1iZXIgLSAxXTsgLy9oYWNrXHJcblxyXG5cdFx0cGFkLm9uRG93bkNhbGxiYWNrID0gKGlucHV0SW5kZXg6IG51bWJlcikgPT4ge1xyXG5cdFx0XHQvL3JpZ2h0IGJ1bXBlclxyXG5cdFx0XHRpZiAoaW5wdXRJbmRleCA9PSA1KSB7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChpbnB1dEluZGV4ID09IDkpIHsgLy9zdGFydFxyXG5cdFx0XHRcdHRoaXMucGFkLmdhbWUuc3RhdGUuc3RhcnQoJ2dhbWUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwb3dlclVwID09IFBvd2VyVXAuV3JhcCkge1xyXG5cdFx0XHR0aGlzLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0XHJcblx0XHRsZXQgY2lyY2xlID0gdGhpcy5wYWQuZ2FtZS5hZGQuZ3JhcGhpY3MoMCwgMCk7XHJcblx0XHR0aGlzLnNwcml0ZS5hZGRDaGlsZChjaXJjbGUpO1xyXG5cclxuXHRcdGNpcmNsZS5saW5lU3R5bGUoMiwgMHhmZmZmZmYsIDAuMik7XHJcblx0XHRjaXJjbGUuYmVnaW5GaWxsKHRoaXMuY29sb3IsIDAuMik7XHJcblx0XHRjaXJjbGUuZHJhd0NpcmNsZSgwLCAwLCBHbG9iYWxzLlNsb3dEb3duUmFuZ2UgKiAyKTtcclxuXHJcblx0XHQvL2NpcmNsZS5iZWdpbkZpbGwoMCwgMSk7XHJcblx0XHQvL2NpcmNsZS5iZWdpbkZpbGwodGhpcy5jb2xvciwgMSk7XHJcblx0XHQvL2NpcmNsZS5kcmF3Q2lyY2xlKDAsIDAsIEdsb2JhbHMuUGxheWVyUmFkaXVzICogMik7XHJcblxyXG5cdFx0dGhpcy5yZWFsU3ByaXRlID0gdGhpcy5wYWQuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsICdwbGF5ZXJfJyArIHBsYXllck51bWJlcik7XHJcblx0XHR0aGlzLnJlYWxTcHJpdGUuYW5jaG9yLnNldCgwLjUsIDAuNTc1KTtcclxuXHRcdHRoaXMuc3ByaXRlLmFkZENoaWxkKHRoaXMucmVhbFNwcml0ZSk7XHJcblx0fVxyXG5cclxuXHRhZGRDcm93bigpIHtcclxuXHRcdGxldCBjcm93biA9IHRoaXMucGFkLmdhbWUuYWRkLnNwcml0ZSgwLCAtNDAsICdjcm93bicpO1xyXG5cdFx0Y3Jvd24uc2NhbGUuc2V0KDAuOCk7XHJcblx0XHRjcm93bi5hbmNob3Iuc2V0KDAuNTMsIC0wLjEpO1xyXG5cdFx0dGhpcy5zcHJpdGUuYWRkQ2hpbGQoY3Jvd24pO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKCkge1xyXG5cdFx0aWYgKCF0aGlzLnBhZC5jb25uZWN0ZWQgfHwgdGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHJcblx0XHRsZXQgc3BlZWQgPSBHbG9iYWxzLlBsYXllclNwZWVkO1xyXG5cdFx0aWYgKHRoaXMucG93ZXJVcCA9PSBQb3dlclVwLlNwZWVkeSlcclxuXHRcdFx0c3BlZWQgKj0gMS42O1xyXG5cdFx0dGhpcy5ib2R5LnNldFplcm9WZWxvY2l0eSgpO1xyXG5cdFx0dGhpcy5ib2R5Lm1vdmVSaWdodCh0aGlzLnBhZC5heGlzKDApICogc3BlZWQpO1xyXG5cdFx0dGhpcy5ib2R5Lm1vdmVEb3duKHRoaXMucGFkLmF4aXMoMSkgKiBzcGVlZCk7XHJcblxyXG5cdFx0dGhpcy5yZWFsU3ByaXRlLmFuZ2xlID0gbmV3IFBoYXNlci5Qb2ludCh0aGlzLmJvZHkudmVsb2NpdHkueCwgdGhpcy5ib2R5LnZlbG9jaXR5LnkpLmFuZ2xlKG5ldyBQaGFzZXIuUG9pbnQoMCwgMCksIHRydWUpIC0gOTA7XHJcblx0XHRsZXQgdGltZVNpbmNlTGFzdCA9IHRoaXMucGFkLmdhbWUudGltZS50b3RhbEVsYXBzZWRTZWNvbmRzKCkgLSB0aGlzLmxhc3RTaG90O1xyXG5cdFx0dmFyIHRoaW5nID0gbmV3IFBoYXNlci5Qb2ludCh0aGlzLnBhZC5heGlzKDIpLCB0aGlzLnBhZC5heGlzKDMpKTtcclxuXHRcdGxldCBsZW5ndGggPSB0aGluZy5kaXN0YW5jZShuZXcgUGhhc2VyLlBvaW50KDAsIDApKTtcclxuXHRcdHRoaW5nLm5vcm1hbGl6ZSgpO1xyXG5cclxuXHRcdGxldCB0aW1lQmV0d2VlblNob3RzID0gMC41O1xyXG5cdFx0aWYgKHRoaXMucG93ZXJVcCA9PSBQb3dlclVwLk1hY2hpbmVHdW4pIHtcclxuXHRcdFx0dGltZUJldHdlZW5TaG90cyA9IDAuMjtcclxuXHJcblx0XHRcdC8vdGhpbmcgPSB0aGluZy5yb3RhdGUoMCwgMCwgMjAgKiBNYXRoLnJhbmRvbSgpIC0gMTAsIHRydWUpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMucG93ZXJVcCA9PSBQb3dlclVwLlNwcmVhZFNob3QgfHwgdGhpcy5wb3dlclVwID09IFBvd2VyVXAuU3VwZXJIb3RTcHJlYWRTaG90KSB7XHJcblx0XHRcdHRpbWVCZXR3ZWVuU2hvdHMgKj0gMjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5wb3dlclVwICE9IFBvd2VyVXAuUmVhbEJ1bGxldEhlbGwgJiYgdGltZVNpbmNlTGFzdCA+IHRpbWVCZXR3ZWVuU2hvdHMgJiYgbGVuZ3RoID4gMC43KSB7XHJcblx0XHRcdHRoaXMubGFzdFNob3QgPSB0aGlzLnBhZC5nYW1lLnRpbWUudG90YWxFbGFwc2VkU2Vjb25kcygpO1xyXG5cclxuXHRcdFx0bGV0IHNwcmVhZEFtb3VudCA9IDEwO1xyXG5cclxuXHRcdFx0dGhpcy5zaG9vdFNvdW5kLnBsYXkoKTtcclxuXHJcblx0XHRcdHRoaXMuZmlyZVNob3QodGhpbmcpO1xyXG5cdFx0XHRpZiAodGhpcy5wb3dlclVwID09IFBvd2VyVXAuU3ByZWFkU2hvdCB8fCB0aGlzLnBvd2VyVXAgPT0gUG93ZXJVcC5TdXBlckhvdFNwcmVhZFNob3QpIHtcclxuXHRcdFx0XHR0aGluZyA9IHRoaW5nLnJvdGF0ZSgwLCAwLCBzcHJlYWRBbW91bnQsIHRydWUpO1xyXG5cdFx0XHRcdHRoaXMuZmlyZVNob3QodGhpbmcpO1xyXG5cdFx0XHRcdHRoaW5nID0gdGhpbmcucm90YXRlKDAsIDAsIC0yICogc3ByZWFkQW1vdW50LCB0cnVlKTtcclxuXHRcdFx0XHR0aGlzLmZpcmVTaG90KHRoaW5nKTtcclxuXHRcdFx0XHR0aGluZyA9IHRoaW5nLnJvdGF0ZSgwLCAwLCAzICogc3ByZWFkQW1vdW50LCB0cnVlKTtcclxuXHRcdFx0XHR0aGlzLmZpcmVTaG90KHRoaW5nKTtcclxuXHRcdFx0XHR0aGluZyA9IHRoaW5nLnJvdGF0ZSgwLCAwLCAtNCAqIHNwcmVhZEFtb3VudCwgdHJ1ZSk7XHJcblx0XHRcdFx0dGhpcy5maXJlU2hvdCh0aGluZyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZpcmVTaG90KHRoaW5nOiBQaGFzZXIuUG9pbnQpIHtcclxuXHRcdGxldCB4ID0gdGhpcy5zcHJpdGUueCArIEdsb2JhbHMuUGxheWVyUmFkaXVzIC0gR2xvYmFscy5TaG90UmFkaXVzICsgdGhpbmcueCAqIChHbG9iYWxzLlBsYXllclJhZGl1cyArIEdsb2JhbHMuU2hvdEF3YXlEaXN0KTtcclxuXHRcdGxldCB5ID0gdGhpcy5zcHJpdGUueSArIEdsb2JhbHMuUGxheWVyUmFkaXVzIC0gR2xvYmFscy5TaG90UmFkaXVzICsgdGhpbmcueSAqIChHbG9iYWxzLlBsYXllclJhZGl1cyArIEdsb2JhbHMuU2hvdEF3YXlEaXN0KTtcclxuXHRcdGxldCBzaG90ID0gdGhpcy5wYWQuZ2FtZS5hZGQuc3ByaXRlKHgsIHksICdzaG90XycgKyB0aGlzLnBsYXllck51bWJlcik7XHJcblx0XHRzaG90LnNjYWxlLnNldCgzICogR2xvYmFscy5TaG90UmFkaXVzIC8gMTM2KTtcclxuXHRcdHNob3QuYmxlbmRNb2RlID0gUElYSS5ibGVuZE1vZGVzLkFERDtcclxuXHRcdC8vc2hvdC5iZWdpbkZpbGwodGhpcy5jb2xvciwgMC43KTtcclxuXHRcdC8vc2hvdC5kcmF3Q2lyY2xlKDAsIDAsIEdsb2JhbHMuU2hvdFJhZGl1cyAqIDIpO1xyXG5cclxuXHRcdHRoaXMucGFkLmdhbWUucGh5c2ljcy5wMi5lbmFibGUoc2hvdCk7XHJcblx0XHRsZXQgc2hvdEJvZHkgPSA8UGhhc2VyLlBoeXNpY3MuUDIuQm9keT5zaG90LmJvZHk7XHJcblx0XHRzaG90Qm9keS5zZXRDaXJjbGUoR2xvYmFscy5TaG90UmFkaXVzKTtcclxuXHRcdHNob3RCb2R5LmFuZ2xlID0gTWF0aC5yYW5kb20oKSAqIDM2MDtcclxuXHRcdGlmICh0aGlzLnBvd2VyVXAgPT0gUG93ZXJVcC5XcmFwKSB7XHJcblx0XHRcdHNob3RCb2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBzaG90U3BlZWQgPSBHbG9iYWxzLlNob3RTcGVlZDtcclxuXHRcdGlmICh0aGlzLnBvd2VyVXAgPT0gUG93ZXJVcC5TcGVlZHkpIHtcclxuXHRcdFx0c2hvdFNwZWVkICo9IDI7XHJcblx0XHR9XHJcblx0XHRzaG90Qm9keS5tb3ZlUmlnaHQodGhpbmcueCAqIHNob3RTcGVlZCk7XHJcblx0XHRzaG90Qm9keS5tb3ZlRG93bih0aGluZy55ICogc2hvdFNwZWVkKTtcclxuXHRcdHNob3RCb2R5LmRhbXBpbmcgPSAwO1xyXG5cdFx0Ly9UT0RPIHNob3RCb2R5LmJvdW5jZS5zZXQoMSk7XHJcblx0XHQoPGFueT5zaG90Qm9keS5kYXRhKS5zcHJpdGUgPSBzaG90O1xyXG5cdFx0KDxhbnk+c2hvdEJvZHkuZGF0YSkuc2hvdEJ5ID0gdGhpcztcclxuXHRcdCg8YW55PnNob3RCb2R5LmRhdGEpLmNvbG9yID0gdGhpcy5jb2xvcjtcclxuXHRcdCg8YW55PnNob3QpLmlzSW5Jbml0aWFsU2xvd0FyZWEgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuc2hvdHMucHVzaChzaG90KTtcclxuXHR9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wbGF5ZXIudHMiLCJleHBvcnQgZW51bSBQb3dlclVwIHtcclxuXHQvL05vbmUsXHJcblx0U3VwZXJIb3QsXHJcblx0U3VwZXJIb3RTcHJlYWRTaG90LFxyXG5cdFdhbGxzLFxyXG5cdFJlYWxCdWxsZXRIZWxsLFxyXG5cclxuXHRTcGVlZHksXHJcblx0TWFjaGluZUd1bixcclxuXHRTcHJlYWRTaG90LFxyXG5cclxuXHRCdWxsZXRzU2xvd0Rvd24sXHJcblx0Q291bnQsXHJcblxyXG5cdFdyYXAsXHJcblx0XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcG93ZXJVcC50cyIsImltcG9ydCAqIGFzIFBoYXNlciBmcm9tICdwaGFzZXInO1xyXG5pbXBvcnQgKiBhcyBXZWJGb250IGZyb20gJ3dlYmZvbnRsb2FkZXInO1xyXG5pbXBvcnQgKiBhcyBHbG9iYWxzIGZyb20gJy4vZ2xvYmFscyc7XHJcbmltcG9ydCB7IFBvd2VyVXAgfSBmcm9tICcuL3Bvd2VyVXAnO1xyXG5cclxuZGVjbGFyZSBmdW5jdGlvbiByZXF1aXJlKHVybDogc3RyaW5nKTogc3RyaW5nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGluZ1N0YXRlIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcclxuXHRpbml0KCkge1xyXG5cdH1cclxuXHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG5cclxuXHRcdFdlYkZvbnQubG9hZCh7XHJcblx0XHRcdGdvb2dsZToge1xyXG5cdFx0XHRcdGZhbWlsaWVzOiBbR2xvYmFscy5Gb250TmFtZV1cclxuXHRcdFx0fSxcclxuXHRcdFx0YWN0aXZlOiAoKSA9PiB0aGlzLmNyZWF0ZSgpXHJcblx0XHR9KVxyXG5cclxuXHRcdGxldCB0ZXh0ID0gdGhpcy5hZGQudGV4dCh0aGlzLndvcmxkLmNlbnRlclgsIHRoaXMud29ybGQuY2VudGVyWSwgJ2xvYWRpbmcgZm9udHMgYW5kIHN3ZWV0IHN3ZWV0IGdyYXBoaWNzJywgeyBmb250OiAnMTZweCBBcmlhbCcsIGZpbGw6ICcjZGRkZGRkJywgYWxpZ246ICdjZW50ZXInIH0pO1xyXG5cdFx0dGV4dC5hbmNob3Iuc2V0VG8oMC41LCAwLjUpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnMXB4JywgcmVxdWlyZSgnLi9hc3NldHMvaW1hZ2VzLzFweC5wbmcnKSk7XHJcblxyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwYXJ0aWNsZV8xJywgcmVxdWlyZSgnLi9hc3NldHMvaW1hZ2VzL3BhcnRpY2xlcy8xLnBuZycpKTtcclxuXHJcblxyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwbGF5ZXJfMScsIHJlcXVpcmUoJy4vYXNzZXRzL2ltYWdlcy9zcGFjZS9SZWRTcGFjZXNoaXAucG5nJykpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwbGF5ZXJfMicsIHJlcXVpcmUoJy4vYXNzZXRzL2ltYWdlcy9zcGFjZS9HcmVlblNwYWNlc2hpcC5wbmcnKSk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3BsYXllcl8zJywgcmVxdWlyZSgnLi9hc3NldHMvaW1hZ2VzL3NwYWNlL0JsdWVTcGFjZXNoaXAucG5nJykpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwbGF5ZXJfNCcsIHJlcXVpcmUoJy4vYXNzZXRzL2ltYWdlcy9zcGFjZS9ZZWxsb3dTcGFjZXNoaXAucG5nJykpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnc2hvdF8xJywgcmVxdWlyZSgnLi9hc3NldHMvaW1hZ2VzL3Nob3RzL1JlZEFtbW8ucG5nJykpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdzaG90XzInLCByZXF1aXJlKCcuL2Fzc2V0cy9pbWFnZXMvc2hvdHMvR3JlZW5BbW1vLnBuZycpKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnc2hvdF8zJywgcmVxdWlyZSgnLi9hc3NldHMvaW1hZ2VzL3Nob3RzL0JsdWVBbW1vLnBuZycpKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnc2hvdF80JywgcmVxdWlyZSgnLi9hc3NldHMvaW1hZ2VzL3Nob3RzL1llbGxvd0FtbW8ucG5nJykpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdzaG90XzAnLCByZXF1aXJlKCcuL2Fzc2V0cy9pbWFnZXMvc2hvdHMvU2hyYXBuZWwucG5nJykpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnYmcnLCByZXF1aXJlKCcuL2Fzc2V0cy9pbWFnZXMvQmFja2dyb3VuZC5wbmcnKSk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3dhbGxzJywgcmVxdWlyZSgnLi9hc3NldHMvaW1hZ2VzL1dhbGxzLnBuZycpKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnY3Jvd24nLCByZXF1aXJlKCcuL2Fzc2V0cy9pbWFnZXMvQ3Jvd24ucG5nJykpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnU3BsYXNoU2NyZWVuJywgcmVxdWlyZSgnLi9hc3NldHMvaW1hZ2VzL1NwbGFzaFNjcmVlbi5wbmcnKSk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ1RpdGxlJywgcmVxdWlyZSgnLi9hc3NldHMvaW1hZ2VzL1RpdGxlLnBuZycpKTtcclxuXHRcdFxyXG5cclxuXHRcdHRoaXMubG9hZC5hdWRpbygnc2hvb3QnLCByZXF1aXJlKCcuL2Fzc2V0cy9zb3VuZHMvc2hvb3QubTRhJykpO1xyXG5cdFx0dGhpcy5sb2FkLmF1ZGlvKCdleHBsb2RlJywgcmVxdWlyZSgnLi9hc3NldHMvc291bmRzL2V4cGxvZGUubTRhJykpO1xyXG5cdFx0Ly9OZWVkZWQ/XHJcblx0XHQvKnRoaXMuZ2FtZS5zb3VuZC5zZXREZWNvZGVkQ2FsbGJhY2soW1xyXG5cdFx0XHQnc2hvb3QnLCAnZXhwbG9kZSdcclxuXHRcdF0sICgpID0+IHsgfSwgdGhpcyk7Ki9cclxuXHJcblx0XHR0aGlzLmxvYWQuYXVkaW8oUG93ZXJVcFtQb3dlclVwLkJ1bGxldHNTbG93RG93bl0sIHJlcXVpcmUoJy4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvYW5ub3VuY2VyLWJ1bGxldHNzbG93ZG93bi5tNGEnKSk7XHJcblx0XHR0aGlzLmxvYWQuYXVkaW8oUG93ZXJVcFtQb3dlclVwLk1hY2hpbmVHdW5dLCByZXF1aXJlKCcuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2Fubm91bmNlci1tYWNoaW5lZ3VuLm00YScpKTtcclxuXHRcdHRoaXMubG9hZC5hdWRpbyhQb3dlclVwW1Bvd2VyVXAuUmVhbEJ1bGxldEhlbGxdLCByZXF1aXJlKCcuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2Fubm91bmNlci1yZWFsYnVsbGV0aGVsbC5tNGEnKSk7XHJcblx0XHR0aGlzLmxvYWQuYXVkaW8oUG93ZXJVcFtQb3dlclVwLlNwZWVkeV0sIHJlcXVpcmUoJy4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvYW5ub3VuY2VyLXNwZWVkeS5tNGEnKSk7XHJcblx0XHR0aGlzLmxvYWQuYXVkaW8oUG93ZXJVcFtQb3dlclVwLlNwcmVhZFNob3RdLCByZXF1aXJlKCcuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2Fubm91bmNlci1zcHJlYWRzaG90Lm00YScpKTtcclxuXHRcdHRoaXMubG9hZC5hdWRpbyhQb3dlclVwW1Bvd2VyVXAuU3VwZXJIb3RdLCByZXF1aXJlKCcuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2Fubm91bmNlci1zdXBlcmhvdC5tNGEnKSk7XHJcblx0XHR0aGlzLmxvYWQuYXVkaW8oUG93ZXJVcFtQb3dlclVwLlN1cGVySG90U3ByZWFkU2hvdF0sIHJlcXVpcmUoJy4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvYW5ub3VuY2VyLXN1cGVyaG90c3ByZWFkc2hvdC5tNGEnKSk7XHJcblx0XHR0aGlzLmxvYWQuYXVkaW8oUG93ZXJVcFtQb3dlclVwLldhbGxzXSwgcmVxdWlyZSgnLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9hbm5vdW5jZXItd2FsbHMubTRhJykpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5hdWRpbygnZHJhdycsIHJlcXVpcmUoJy4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvZHJhdy5tNGEnKSk7XHJcblx0XHR0aGlzLmxvYWQuYXVkaW8oJ3dpbl8xJywgcmVxdWlyZSgnLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9wbGF5ZXIxd2luLm00YScpKTtcclxuXHRcdHRoaXMubG9hZC5hdWRpbygnd2luXzInLCByZXF1aXJlKCcuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL3BsYXllcjJ3aW4ubTRhJykpO1xyXG5cdFx0dGhpcy5sb2FkLmF1ZGlvKCd3aW5fMycsIHJlcXVpcmUoJy4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvcGxheWVyM3dpbi5tNGEnKSk7XHJcblx0XHR0aGlzLmxvYWQuYXVkaW8oJ3dpbl80JywgcmVxdWlyZSgnLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9wbGF5ZXI0d2luLm00YScpKTtcclxuXHJcblx0XHR0aGlzLmlucHV0LmdhbWVwYWQuc3RhcnQoKTtcclxuXHJcblx0fVxyXG5cclxuXHRsb2FkZWQgPSAwO1xyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdHRoaXMubG9hZGVkKys7XHJcblx0XHRpZiAodGhpcy5sb2FkZWQgPT0gMil7XHJcblx0XHRcdC8vdGhpcy5zdGF0ZS5zdGFydCgnZ2FtZScpO1xyXG5cdFx0XHR0aGlzLnN0YXRlLnN0YXJ0KCdzcGxhc2hzY3JlZW4nKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9sb2FkaW5nU3RhdGUudHMiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJlM2MzNWQyMTBkY2QxNjNkOWFiYWNhZDIwN2IwNWEyYi5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9pbWFnZXMvMXB4LnBuZ1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiMzk3Y2MwMzY2MzkxZmZkYmYxNWRkYWIxZDZhZjM0YTgucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvaW1hZ2VzL3BhcnRpY2xlcy8xLnBuZ1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYzY2OWFlY2U1MTdkOTc4YTFmYzFjM2I3MzBiZTNiMjEucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvaW1hZ2VzL3NwYWNlL1JlZFNwYWNlc2hpcC5wbmdcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjVkMDBhZjMwZDU4NGUzZDFlNzU4MjkzOTE3NjFkYTAyLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL2ltYWdlcy9zcGFjZS9HcmVlblNwYWNlc2hpcC5wbmdcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjdhNzQ3NjFmYjMzMjRhMzk1NGUwNGQxZDViOTFmYTYzLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL2ltYWdlcy9zcGFjZS9CbHVlU3BhY2VzaGlwLnBuZ1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiOWU4Y2VkMDY4YWYyZGQyOWI2NDY1ZDg2ZDc0NTlhNWQucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvaW1hZ2VzL3NwYWNlL1llbGxvd1NwYWNlc2hpcC5wbmdcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjdkZTE1Y2FlNDhlNzk3YzQ5ZGQzZjI4NWU2NGUyMjM2LnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL2ltYWdlcy9zaG90cy9SZWRBbW1vLnBuZ1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYzcyNTZhNWU3MzU1MTQxYjkyNzg2ZGU2Yjg3Y2I2MWMucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvaW1hZ2VzL3Nob3RzL0dyZWVuQW1tby5wbmdcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImY0MjAyNWZmNGUwYTM3MDg0MDUxM2JlNTQ2MGQzY2RmLnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL2ltYWdlcy9zaG90cy9CbHVlQW1tby5wbmdcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImRlMWMzYzRiMGM2NWEyZDQzMGQ2NjQ5MDJlNTg2NWU3LnBuZ1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL2ltYWdlcy9zaG90cy9ZZWxsb3dBbW1vLnBuZ1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiODNiNjZjZTVjYjNlNzZmOWMwOTY2YzVjNmQ2MzM5MDkucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvaW1hZ2VzL3Nob3RzL1NocmFwbmVsLnBuZ1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiZDdiODEzMzlmODgzZWFjMmFjMGQwYzdjZDZlMDI1NjkucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvaW1hZ2VzL0JhY2tncm91bmQucG5nXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIyN2VjMjQ2Y2JiMmU4MzM5MjVjZTkxM2NlOWUxNjcwYy5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9pbWFnZXMvV2FsbHMucG5nXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI3NzdlMDg2M2ZjOTQzMTRiNDg3ZjRkMmM5YWI5ODJkMS5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9pbWFnZXMvQ3Jvd24ucG5nXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI3OGU2NTkzZWM2YTk4OWYxYjYyMTBkZjJmOTMyZDkyOS5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9pbWFnZXMvU3BsYXNoU2NyZWVuLnBuZ1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiZTA0M2ViNTJiMGYxZTFlZjQ1NTUyMTRmMDJhYTE2ZmEucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvaW1hZ2VzL1RpdGxlLnBuZ1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiNzNiMTg5MjU1NmE2YmM4NGIxZmZjMmQzMDAwNzEwNTAubTRhXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvc291bmRzL3Nob290Lm00YVxuLy8gbW9kdWxlIGlkID0gMzJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYzlhOTBiNjdhNmRkZDYwMzQ4MDg4OTM1NTFhOWM3MjkubTRhXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvc291bmRzL2V4cGxvZGUubTRhXG4vLyBtb2R1bGUgaWQgPSAzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJlYjM1ZGRjMWJmZDE2OWEzNWY1NjhhMDcyODQzOTc5Ny5tNGFcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2Fubm91bmNlci1idWxsZXRzc2xvd2Rvd24ubTRhXG4vLyBtb2R1bGUgaWQgPSAzNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI0MGM5M2ZmZDc4ZjYyM2MzMzZmMGY0NWRhMWY0NTQ2MS5tNGFcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2Fubm91bmNlci1tYWNoaW5lZ3VuLm00YVxuLy8gbW9kdWxlIGlkID0gMzVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiNDQwYmFjNjgxZGZlYmYzMGI0NmNhZTM5NWE1NzFhY2UubTRhXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9hbm5vdW5jZXItcmVhbGJ1bGxldGhlbGwubTRhXG4vLyBtb2R1bGUgaWQgPSAzNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI5ZjhiMzE1ODJmN2Y5YjU4MTI4NTg2OTBlMTIyMmY5Ni5tNGFcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2Fubm91bmNlci1zcGVlZHkubTRhXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIwNzhjMTY3NTU4NjdiYTM3MjZmYTdmNTEwMjVjODQxYS5tNGFcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2Fubm91bmNlci1zcHJlYWRzaG90Lm00YVxuLy8gbW9kdWxlIGlkID0gMzhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiODE0MWM3Njg0YWM4Y2IyYzZhMGU0ODI4ZjkwZWM3NjcubTRhXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvc291bmRzL2Fubm91bmNlci9hbm5vdW5jZXItc3VwZXJob3QubTRhXG4vLyBtb2R1bGUgaWQgPSAzOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIwMDc1OTQ1ZjRhMzI4NmYwMDM0ODM3YWZhNzIxMDNjZi5tNGFcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2Fubm91bmNlci1zdXBlcmhvdHNwcmVhZHNob3QubTRhXG4vLyBtb2R1bGUgaWQgPSA0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIyZTJmOWQ4YjJkMTFhOGU1N2JjNDc5MGY4M2U5YjFiNC5tNGFcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9zb3VuZHMvYW5ub3VuY2VyL2Fubm91bmNlci13YWxscy5tNGFcbi8vIG1vZHVsZSBpZCA9IDQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjkzMTJlYjc4YWY0NzAzYmIzZGFmZmY2NWY4NTU3YjZmLm00YVwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvZHJhdy5tNGFcbi8vIG1vZHVsZSBpZCA9IDQyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjY3YmMwYTc1NWZiOWEzODVjMmJjY2UxNjM2ZTQ0NmNjLm00YVwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvcGxheWVyMXdpbi5tNGFcbi8vIG1vZHVsZSBpZCA9IDQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjFhMWQwNDY1YTE4YmZhN2ExOWFmNDlhMGQwYjQ2YWQxLm00YVwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvcGxheWVyMndpbi5tNGFcbi8vIG1vZHVsZSBpZCA9IDQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImMwZDg1N2RjZGM0NmQ2YmMzYjViNTJhMzExZTQ5ZDIxLm00YVwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvcGxheWVyM3dpbi5tNGFcbi8vIG1vZHVsZSBpZCA9IDQ1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImE5MGRmODFmZmJiYmQ4MWIxYjJkNDYzNzYyODdlYThmLm00YVwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL3NvdW5kcy9hbm5vdW5jZXIvcGxheWVyNHdpbi5tNGFcbi8vIG1vZHVsZSBpZCA9IDQ2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIEdsb2JhbHMgZnJvbSAnLi9nbG9iYWxzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRpbmdTdGF0ZSBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XHJcblx0aW5pdCgpIHtcclxuXHR9XHJcblxyXG5cdHBhZHNUZXh0OiBQaGFzZXIuVGV4dDtcclxuXHRzdGFydFRvUGxheTogUGhhc2VyLlRleHQ7XHJcblxyXG5cdGNyZWF0ZSgpIHtcclxuXHJcblx0XHR0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuUDJKUyk7XHJcblx0XHR0aGlzLnBoeXNpY3MucDIucmVzdGl0dXRpb24gPSAxO1xyXG5cdFx0dGhpcy5waHlzaWNzLnAyLmZyaWN0aW9uID0gMDtcclxuXHRcdHRoaXMucGh5c2ljcy5wMi5zZXRJbXBhY3RFdmVudHModHJ1ZSk7XHJcblxyXG5cdFx0dGhpcy5hZGQuc3ByaXRlKDAsIDAsICdTcGxhc2hTY3JlZW4nKTtcclxuXHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAyMDA7IGkrKykge1xyXG5cdFx0XHRsZXQgc2hvdCA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKE1hdGgucmFuZG9tKCkgKiBHbG9iYWxzLlNjcmVlbldpZHRoLCBNYXRoLnJhbmRvbSgpICogR2xvYmFscy5TY3JlZW5IZWlnaHQsICdzaG90XycgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KSk7XHJcblx0XHRcdHNob3QuYmxlbmRNb2RlID0gUElYSS5ibGVuZE1vZGVzLkFERDtcclxuXHRcdFx0c2hvdC5zY2FsZS5zZXQoMyAqIEdsb2JhbHMuU2hvdFJhZGl1cyAvIDEzNik7XHJcblxyXG5cdFx0XHR0aGlzLmdhbWUucGh5c2ljcy5wMi5lbmFibGUoc2hvdCk7XHJcblx0XHRcdGxldCBzaG90Qm9keSA9IDxQaGFzZXIuUGh5c2ljcy5QMi5Cb2R5PnNob3QuYm9keTtcclxuXHRcdFx0c2hvdEJvZHkuc2V0Q2lyY2xlKEdsb2JhbHMuU2hvdFJhZGl1cyk7XHJcblx0XHRcdHNob3RCb2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XHJcblx0XHRcdHNob3RCb2R5Lm1vdmVSaWdodCgoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIEdsb2JhbHMuU2hvdFNwZWVkKTtcclxuXHRcdFx0c2hvdEJvZHkubW92ZURvd24oKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiBHbG9iYWxzLlNob3RTcGVlZCk7XHJcblx0XHRcdHNob3RCb2R5LmRhbXBpbmcgPSAwO1xyXG5cclxuXHRcdFx0c2hvdEJvZHkuYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMzYwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuYWRkLnNwcml0ZSgwLCAwLCAnVGl0bGUnKTtcclxuXHJcblx0XHR0aGlzLnBhZHNUZXh0ID0gdGhpcy5hZGQudGV4dCh0aGlzLndvcmxkLmNlbnRlclgsIHRoaXMud29ybGQuaGVpZ2h0IC0gMzAwLCAnVE9ETycsIHsgZm9udDogJzUwcHggJyArIEdsb2JhbHMuRm9udE5hbWUsIGZpbGw6ICcjZGRkZGRkJywgYWxpZ246ICdjZW50ZXInIH0pO1xyXG5cdFx0dGhpcy5wYWRzVGV4dC5hbmNob3Iuc2V0VG8oMC41LCAwLjUpO1xyXG5cclxuXHRcdHRoaXMuc3RhcnRUb1BsYXkgPSB0aGlzLmFkZC50ZXh0KHRoaXMud29ybGQuY2VudGVyWCwgdGhpcy53b3JsZC5oZWlnaHQgLSAyMDAsICdQcmVzcyBTdGFydCB0byBQbGF5JywgeyBmb250OiAnNTBweCAnICsgR2xvYmFscy5Gb250TmFtZSwgZmlsbDogJyNkZGRkZGQnLCBhbGlnbjogJ2NlbnRlcicgfSk7XHJcblx0XHR0aGlzLnN0YXJ0VG9QbGF5LmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoKSB7XHJcblx0XHR0aGlzLnBhZHNUZXh0LnRleHQgPSB0aGlzLmlucHV0LmdhbWVwYWQucGFkc0Nvbm5lY3RlZCArICcgUGFkcyBDb25uZWN0ZWQnO1xyXG5cclxuXHRcdGlmICghdGhpcy5pbnB1dC5nYW1lcGFkLmVuYWJsZWQgfHwgIXRoaXMuaW5wdXQuZ2FtZXBhZC5hY3RpdmUpIHtcclxuXHRcdFx0dGhpcy5wYWRzVGV4dC50ZXh0ICs9ICcuIFByZXNzIGEgYnV0dG9uIHRvIGVuYWJsZSBtYXliZSdcclxuXHRcdH1cclxuXHRcdHRoaXMuc3RhcnRUb1BsYXkudmlzaWJsZSA9ICh0aGlzLmlucHV0LmdhbWVwYWQucGFkc0Nvbm5lY3RlZCA+PSAyKTtcclxuXHJcblxyXG5cdFx0aWYgKHRoaXMuc3RhcnRUb1BsYXkudmlzaWJsZSkge1xyXG5cdFx0XHRpZiAodGhpcy5pbnB1dC5nYW1lcGFkLnBhZDEuaXNEb3duKDkpIHx8IHRoaXMuaW5wdXQuZ2FtZXBhZC5wYWQyLmlzRG93big5KSB8fCB0aGlzLmlucHV0LmdhbWVwYWQucGFkMy5pc0Rvd24oOSkgfHwgdGhpcy5pbnB1dC5nYW1lcGFkLnBhZDQuaXNEb3duKDkpKSB7XHJcblx0XHRcdFx0dGhpcy5zdGF0ZS5zdGFydCgnZ2FtZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NwbGFzaFNjcmVlblN0YXRlLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==