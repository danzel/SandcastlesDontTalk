import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';
import * as Globals from './globals';
import { Player } from './player';
import { PowerUp } from './powerUp';



let wonLast = -1;
let globalScore = [
	0, 0, 0, 0
];
let lastPowerUp: PowerUp = -1;



export default class GameState extends Phaser.State {

	shots = new Array<Phaser.Sprite>();
	players = new Array<Player>();

	gameHasEnded = false;
	powerUp: PowerUp;
	explodeSound: Phaser.Sound;
	scoreText: Array<Phaser.Text>;

	sparkEmitter: Phaser.Particles.Arcade.Emitter;

	timeGameEnded = 0;

	init() {
		this.defaultFrameRate = 0.016666666666666666;
		//TODO
	}

	preload() {
		this.timeGameEnded = 0;
		this.shots.length = 0;
		this.players.length = 0;
		this.gameHasEnded = false;
		do { 
			this.powerUp = Math.floor(Math.random() * PowerUp.Count);
		} while (this.powerUp == lastPowerUp);
		lastPowerUp = this.powerUp;

		this.lastBulletHellShot = this.game.time.totalElapsedSeconds();

		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.restitution = 1;
		this.physics.p2.friction = 0;
		this.physics.p2.setImpactEvents(true);
	}


	defaultFrameRate: number;
	create() {
		this.camera.shake(0,0);
		let bg = this.add.sprite(0, 0, 'bg');
		let xRight = 20;
		let yBot = 130;

		this.add.audio(PowerUp[this.powerUp]).play();

		this.sparkEmitter = this.game.add.emitter(0,0, 1000);
		(<any>this.sparkEmitter).blendMode = PIXI.blendModes.ADD;
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
		this.scoreText.forEach(s => s.sendToBack());

		let pt = this.add.text(Globals.ScreenWidth / 2, Globals.ScreenHeight / 2, PowerUp[this.powerUp], {
			font: '100px ' + Globals.FontName, fill: '#ffffff'
		});
		pt.anchor.set(0.5);
		let tween = this.game.add.tween(pt);
		tween.to({}, 1000)
			.chain(this.game.add.tween(pt)
				.to({ alpha: 0 }, 1000)
			)
			.start();

		this.players.push(new Player(this.shots, this.input.gamepad.pad1, 1, this.powerUp));
		this.players.push(new Player(this.shots, this.input.gamepad.pad2, 2, this.powerUp));
		this.players.push(new Player(this.shots, this.input.gamepad.pad3, 3, this.powerUp));
		this.players.push(new Player(this.shots, this.input.gamepad.pad4, 4, this.powerUp));

		if (wonLast >= 0) {
			this.players[wonLast].addCrown();
		}

		this.explodeSound = this.game.add.sound('explode');

		this.physics.p2.onBeginContact.add((a, b,c,d,e) => {

			if (a.player && !a.player.isDead) {
				let p = <Player>a.player;
				this.killPlayer(p);
				console.log('rip')
			}
			if (b.player && !b.player.isDead) {
				let p = <Player>b.player;
				this.killPlayer(p);
				console.log('rip')
			}

			if (a.shotBy && b.shotBy && a.shotBy != b.shotBy) {
				console.log('collideshot');
				let aSprite = <Phaser.Sprite>a.sprite;
				let bSprite = <Phaser.Sprite>b.sprite;

				let midX = (aSprite.x + bSprite.x) / 2;
				let midY = (aSprite.y + bSprite.y) / 2;

				a.shotBy = null;
				b.shotBy = null;
				this.shots.splice(this.shots.indexOf(a.sprite), 1);
				this.shots.splice(this.shots.indexOf(b.sprite), 1);
				aSprite.destroy();
				bSprite.destroy();

				//make magic
				this.createExplosion(midX, midY, 8);
			}

			if (this.shots.indexOf(a.sprite) >= 0 || this.shots.indexOf(b.sprite) >= 0) {
				let sprite = a.sprite || b.sprite;
				if (!sprite.hasParticledThisTick) {
					this.sparkEmitter.x = sprite.x;
					this.sparkEmitter.y = sprite.y;
					this.sparkEmitter.start(true, 2000, null, 10);
					sprite.hasParticledThisTick = true;
				}
			}
		});

		if (this.powerUp == PowerUp.Walls) {
			this.addWalls();

			this.add.sprite(0, 0, 'walls').sendToBack();
		}

		bg.sendToBack();

	}

	update() {


		//console.log(this.input.gamepad.supported, this.input.gamepad.active, this.input.gamepad.pad1.connected, this.input.gamepad.pad1.axis(Phaser.Gamepad.AXIS_0));

		this.players.forEach(p => p.update());

		if (!this.gameHasEnded) {
			let alive = this.players.filter(p => !p.isDead);
			let amountAlive = alive.length;
			this.gameHasEnded = amountAlive <= 1;

			if (amountAlive == 1) {

				let text = this.add.text(this.world.centerX, this.world.centerY, ' PLAYER ' + alive[0].playerNumber + ' WINS! ', { font: '100px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
				text.anchor.setTo(0.5, 0.5);

				globalScore[alive[0].playerNumber - 1]++;
				this.scoreText[alive[0].playerNumber - 1].text = '' + globalScore[alive[0].playerNumber - 1];

				wonLast = alive[0].playerNumber - 1;
				alive[0].addCrown();
				this.add.audio('win_' + alive[0].playerNumber).play();
				

			} else if (amountAlive == 0) {
				let text = this.add.text(this.world.centerX, this.world.centerY, 'DRAW!!!', { font: '100px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
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


		this.shots.forEach(c => {
			(<any>c).shouldBeSlowNow = false;
			(<any>c).hasParticledThisTick = false;
		});

		this.players.forEach(p => {
			if (p.isDead)
				return;
			let pPos = new Phaser.Point(p.body.x, p.body.y);
			this.shots.forEach(c => {
				let a = <any>c;
				let body = <Phaser.Physics.P2.Body>a.body;

				let dist = new Phaser.Point(body.x, body.y).distance(pPos);

				if (dist < Globals.SlowDownRange) {
					a.shouldBeSlowNow = true;
				}
			})

			if (!p.pad.connected) {
				p.isDead = true;
				p.sprite.destroy();

				this.scoreText[p.playerNumber - 1].destroy();
			}
		})

		this.shots.forEach(c => {
			let a = <any>c;
			let body = <Phaser.Physics.P2.Body>a.body;

			if (a.isInInitialSlowArea) {
				if (!a.shouldBeSlowNow)
					a.isInInitialSlowArea = false;
			} else {
				if (!a.shouldBeSlowNow && a.isSlowNow) {
					this.hackVelocityMultiplier(body, 4);
					a.isSlowNow = false;
				}
				if (a.shouldBeSlowNow && !a.isSlowNow) {
					this.hackVelocityMultiplier(body, 0.25);
					a.isSlowNow = true;
				}
			}

			if (this.powerUp == PowerUp.BulletsSlowDown && !(<any>a).player) {
				this.hackVelocityMultiplier(body, 0.99);
			}
		});


		if (this.powerUp == PowerUp.RealBulletHell) {
			let timeSince = this.game.time.totalElapsedSeconds() - this.lastBulletHellShot;

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

		if (this.powerUp == PowerUp.SuperHot || this.powerUp == PowerUp.SuperHotSpreadShot) {
			let alivePlayers = this.players.filter(p => !p.isDead);
			if (alivePlayers.length > 0) {
				let scaler = 0;
				alivePlayers.forEach(p => scaler += new Phaser.Point(p.body.velocity.x, p.body.velocity.y).distance(new Phaser.Point(0, 0)));
				scaler /= alivePlayers.length;
				scaler /= Globals.PlayerSpeed;
				scaler *= 1.5;
				this.game.physics.p2.frameRate = this.defaultFrameRate * scaler;
			} else {
				this.game.physics.p2.frameRate = this.defaultFrameRate;
			}
		} else {
			this.game.physics.p2.frameRate = this.defaultFrameRate;
		}

		if (this.powerUp == PowerUp.Wrap) {
			this.players.forEach(p => {
				if (p.body.x < 0) {
					p.body.x += Globals.ScreenWidth;
				}
				if (p.body.x >= Globals.ScreenWidth) {
					p.body.x -= Globals.ScreenWidth;
				}
			})
		}
	}

	lastBulletHellShot: number;
	bulletHellDir: Phaser.Point;

	killPlayer(p: Player) {
		this.explodeSound.play();
		this.createExplosion(p.sprite.x, p.sprite.y, 15);
		p.sprite.destroy();
		p.isDead = true;

		this.game.camera.shake(0.02, 200);

		if (!this.gameHasEnded) {
			this.scoreText[p.playerNumber - 1].alpha = 0.3;
		}
	}

	hackVelocityMultiplier(body: Phaser.Physics.P2.Body, amount: number) {
		let x = body.velocity.x;
		let y = body.velocity.y;
		body.setZeroVelocity();
		body.moveRight(x * amount);
		body.moveDown(y * amount);
	}

	createExplosion(x, y, explosionSize) {

		let directions = new Array<Phaser.Point>();

		for (var i = 0; i < explosionSize; i++) {
			let a = new Phaser.Point(1, 0);
			a = a.rotate(0, 0, i * 360 / explosionSize, true);
			directions.push(a);
		}

		directions.forEach(dir => {
			this.createShot(x + dir.x * 20, y + dir.y * 20, dir);
		})

		this.sparkEmitter.x = x;
		this.sparkEmitter.y = y;
		this.sparkEmitter.start(true, 2000, null, 40);
	}

	createShot(x, y, dir) {
		//TODO move player code here? and then just have one

		let shot = this.game.add.sprite(x, y, 'shot_0');
		shot.blendMode = PIXI.blendModes.ADD;
		shot.scale.set(3 * Globals.ShotRadius / 136);

		this.game.physics.p2.enable(shot);
		let shotBody = <Phaser.Physics.P2.Body>shot.body;
		shotBody.setCircle(Globals.ShotRadius);
		shotBody.collideWorldBounds = true;
		shotBody.moveRight(dir.x * Globals.ShotSpeed);
		shotBody.moveDown(dir.y * Globals.ShotSpeed);
		shotBody.damping = 0;

		if (this.powerUp == PowerUp.Wrap) {
			shotBody.collideWorldBounds = false;
		}

		shotBody.angle = Math.random() * 360;
		this.shots.push(shot);
	}


	render() {
	}


	addWalls() {

		let places = [
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


		]

		places.forEach(p => {
			let wall = this.game.add.sprite(p[0], p[1], '1px');
			this.game.physics.p2.enable(wall);
			let wallBody = <Phaser.Physics.P2.Body>wall.body;
			wallBody.clearShapes();
			wallBody.addRectangle(p[2], p[3]);
			wallBody.static = true;
		})

	}
}