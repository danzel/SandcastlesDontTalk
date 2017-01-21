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

	init() {
		//TODO
	}

	preload() {
		this.players.length = 0;
		this.gameHasEnded = false;
		this.powerUp = Math.floor(Math.random() * PowerUp.Count);

		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.input.gamepad.start();

		this.collisionGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

		this.load.image('1px', require('./assets/images/1px.png'));

		this.load.image('player', require('./assets/images/Ship1.png'));
	}

	create() {
		let xRight = 80;
		let yBot = 100;

		this.add.text(10, 10, '' + globalScore[0], { font: '100px Arial', fill: '#ffffff' });
		this.add.text(Globals.ScreenWidth - xRight, 10, '' + globalScore[1], { font: '100px Arial', fill: '#ffffff' });
		this.add.text(Globals.ScreenWidth - xRight, Globals.ScreenHeight - yBot, '' + globalScore[2], { font: '100px Arial', fill: '#ffffff' });
		this.add.text(10, Globals.ScreenHeight - yBot, '' + globalScore[3], { font: '100px Arial', fill: '#ffffff' });

		let pt = this.add.text(Globals.ScreenWidth / 2, Globals.ScreenHeight / 2, PowerUp[this.powerUp], {
			font: '100px Arial', fill: '#ffffff'
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

	}

	update() {
		//console.log(this.input.gamepad.supported, this.input.gamepad.active, this.input.gamepad.pad1.connected, this.input.gamepad.pad1.axis(Phaser.Gamepad.AXIS_0));

		this.players.forEach(p => p.update());

		this.game.physics.arcade.collide(this.collisionGroup, undefined, (a, b, c) => {
			if (a.player) {
				let p = <Player>a.player;
				this.killPlayer(p);
			}
			if (b.player) {
				let p = <Player>b.player;
				this.killPlayer(p);
			}

			if (a.shotBy && b.shotBy && a.shotBy != b.shotBy) {
				console.log('collideshot');
				let aSprite = <Phaser.Sprite>a;
				let bSprite = <Phaser.Sprite>b;

				let midX = (aSprite.x + bSprite.x) / 2;
				let midY = (aSprite.y + bSprite.y) / 2;

				aSprite.destroy();
				bSprite.destroy();

				//make magic
				this.createExplosion(midX, midY, 8);

			}
		});

		if (!this.gameHasEnded) {
			let alive = this.players.filter(p => !p.isDead);
			let amountAlive = alive.length;
			this.gameHasEnded = amountAlive <= 1;

			if (amountAlive == 1) {

				let text = this.add.text(this.world.centerX, this.world.centerY, ' PLAYER ' + alive[0].playerNumber + ' WINS! ', { font: '100px Bangers', fill: '#dddddd', align: 'center' });
				text.anchor.setTo(0.5, 0.5);

				globalScore[alive[0].playerNumber - 1]++;

			} else if (amountAlive == 0) {
				let text = this.add.text(this.world.centerX, this.world.centerY, 'DRAW!!!', { font: '100px Bangers', fill: '#dddddd', align: 'center' });
				text.anchor.setTo(0.5, 0.5);

			}
		}


		this.collisionGroup.children.forEach(c => {
			(<any>c).shouldBeSlowNow = false;
		});

		this.players.forEach(p => {
			if (p.isDead)
				return;

			this.collisionGroup.children.forEach(c => {
				let a = <any>c;
				if (!(a).player) { //A shot (?)
					//TODO: Distance
					let body = <Phaser.Physics.Arcade.Body>a.body;

					let dist = body.position.distance(p.body.position);

					if (dist < Globals.SlowDownRange) {
						a.shouldBeSlowNow = true;
					}
				}
			})
		})

		this.collisionGroup.children.forEach(c => {
			let a = <any>c;
			let body = <Phaser.Physics.Arcade.Body>a.body;

			if (a.isInInitialSlowArea) {
				if (!a.shouldBeSlowNow)
					a.isInInitialSlowArea = false;
			} else {
				if (!a.shouldBeSlowNow && a.isSlowNow) {
					body.velocity.multiply(4, 4);
					a.isSlowNow = false;
				}
				if (a.shouldBeSlowNow && !a.isSlowNow) {
					body.velocity.multiply(0.25, 0.25);
					a.isSlowNow = true;
				}
			}
		});
	}

	killPlayer(p: Player) {
		this.createExplosion(p.sprite.x, p.sprite.y, 16);
		p.sprite.destroy();
		p.isDead = true;

		this.game.camera.shake(0.02, 200);
	}

	createExplosion(x, y, explosionSize) {

		let directions = new Array<Phaser.Point>();

		for (var i = 0; i < explosionSize; i++) {
			let a = new Phaser.Point(1, 0);
			a = a.rotate(0, 0, i * 360 / explosionSize, true);
			directions.push(a);
		}

		directions.forEach(dir => {
			let shot = this.game.add.sprite(x + dir.x * 20, y + dir.y * 20);

			this.game.physics.arcade.enable(shot);
			let shotBody = <Phaser.Physics.Arcade.Body>shot.body;
			shotBody.setCircle(Globals.ShotRadius);
			shotBody.collideWorldBounds = true;
			shotBody.velocity.set(
				dir.x * Globals.ShotSpeed,
				dir.y * Globals.ShotSpeed
			);
			shotBody.bounce.set(1);

			this.collisionGroup.add(shot);
		})
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
}