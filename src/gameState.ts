import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';
import * as Globals from './globals';
import { Player } from './player';
import { PowerUp } from './powerUp';


declare function require(url: string): string;

let globalScore = [
	0, 0, 0, 0
];



export default class GameState extends Phaser.State {

	players = new Array<Player>();

	collisionGroup: Phaser.Group;

	gameHasEnded = false;
	powerUp: PowerUp;
	explodeSound: Phaser.Sound;
	scoreText: Array<Phaser.Text>;

	init() {
		this.defaultFrameRate = 0.016666666666666666;
		//TODO
	}

	preload() {
		this.players.length = 0;
		this.gameHasEnded = false;
		this.powerUp = Math.floor(Math.random() * PowerUp.Count);

		this.lastBulletHellShot = this.game.time.totalElapsedSeconds();

		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.restitution = 1;
		this.physics.p2.friction = 0;
		this.physics.p2.setImpactEvents(true);
		//this.physics.p2.damp

		this.input.gamepad.start();

		this.collisionGroup = this.game.add.physicsGroup(Phaser.Physics.P2JS);

		this.load.image('1px', require('./assets/images/1px.png'));

		this.load.image('player_1', require('./assets/images/space/RedSpaceship.png'));
		this.load.image('player_2', require('./assets/images/space/GreenSpaceship.png'));
		this.load.image('player_3', require('./assets/images/space/BlueSpaceship.png'));
		this.load.image('player_4', require('./assets/images/space/YellowSpaceship.png'));

		this.load.image('shot_1', require('./assets/images/shots/RedAmmo.png'));
		this.load.image('shot_2', require('./assets/images/shots/GreenAmmo.png'));
		this.load.image('shot_3', require('./assets/images/shots/BlueAmmo.png'));
		this.load.image('shot_4', require('./assets/images/shots/YellowAmmo.png'));
		this.load.image('shot_0', require('./assets/images/shots/Shrapnel.png'));

		this.load.image('bg', require('./assets/images/Background.png'));

		this.load.audio('shoot', require('./assets/sounds/shoot.m4a'));
		this.load.audio('explode', require('./assets/sounds/explode.m4a'));
		this.game.sound.setDecodedCallback(['shoot', 'explode'], () => { }, this);

	}


	defaultFrameRate: number;
	create() {
		let bg = this.add.sprite(0, 0, 'bg');
		let xRight = 20;
		let yBot = 130;


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

		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad1, 1, this.powerUp));
		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad2, 2, this.powerUp));
		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad3, 3, this.powerUp));
		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad4, 4, this.powerUp));

		this.explodeSound = this.game.add.sound('explode');

		this.physics.p2.onBeginContact.add((a, b) => {

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
				aSprite.destroy();
				bSprite.destroy();

				//make magic
				this.createExplosion(midX, midY, 8);

			}
		});

		if (this.powerUp == PowerUp.Walls) {
			this.addWalls();
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

			} else if (amountAlive == 0) {
				let text = this.add.text(this.world.centerX, this.world.centerY, 'DRAW!!!', { font: '100px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
				text.anchor.setTo(0.5, 0.5);

			}
		}


		this.collisionGroup.children.forEach(c => {
			(<any>c).shouldBeSlowNow = false;
		});

		this.players.forEach(p => {
			if (p.isDead)
				return;
			let pPos = new Phaser.Point(p.body.x, p.body.y);
			this.collisionGroup.children.forEach(c => {
				let a = <any>c;
				if (!(a).player) { //A shot (?)
					//TODO: Distance
					let body = <Phaser.Physics.P2.Body>a.body;

					let dist = new Phaser.Point(body.x, body.y).distance(pPos);

					if (dist < Globals.SlowDownRange) {
						a.shouldBeSlowNow = true;
					}
				}
			})

			if (!p.pad.connected) {
				p.isDead = true;
				p.sprite.destroy();

				this.scoreText[p.playerNumber - 1].destroy();
			}
		})

		this.collisionGroup.children.forEach(c => {
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
	}

	createShot(x, y, dir) {
		//TODO move player code here? and then just have one

		let shot = this.game.add.sprite(x, y, 'shot_0');
		shot.scale.set(3 * Globals.ShotRadius / 136);
		
		this.game.physics.p2.enable(shot);
		let shotBody = <Phaser.Physics.P2.Body>shot.body;
		shotBody.setCircle(Globals.ShotRadius);
		shotBody.collideWorldBounds = true;
		shotBody.moveRight(dir.x * Globals.ShotSpeed);
		shotBody.moveDown(dir.y * Globals.ShotSpeed);
		shotBody.damping = 0;

		shotBody.angle = Math.random() * 360;
		this.collisionGroup.add(shot);
	}


	render() {
		if (Globals.DebugRender) {
			this.players.forEach(p => {
				this.game.debug.body(p.sprite, p.color);
			});

			this.collisionGroup.children.forEach(c => {
				this.game.debug.body(<any>c, (<any>c).color);
			})
		}
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
			this.game.physics.p2.enable(wall, Globals.DebugRender);
			let wallBody = <Phaser.Physics.P2.Body>wall.body;
			wallBody.clearShapes();
			wallBody.addRectangle(p[2], p[3]);
			wallBody.static = true;
		})

	}
}