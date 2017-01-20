import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';
import * as Globals from './globals';
import { Player } from './player';

declare function require(url: string): string;


export default class GameState extends Phaser.State {

	players = new Array<Player>();

	collisionGroup: Phaser.Group;

	gameHasEnded = false;

	init() {
		//TODO
	}

	preload() {
		this.players.length = 0;
		this.gameHasEnded = false;

		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.input.gamepad.start();

		this.collisionGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

		this.load.image('1px', require('./assets/images/1px.png'));
	}

	create() {
		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad1, 1));
		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad2, 2));
		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad3, 3));
		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad4, 4));

	}

	update() {
		//console.log(this.input.gamepad.supported, this.input.gamepad.active, this.input.gamepad.pad1.connected, this.input.gamepad.pad1.axis(Phaser.Gamepad.AXIS_0));

		this.players.forEach(p => p.update());

		this.game.physics.arcade.collide(this.collisionGroup, undefined, (a, b, c) => {
			if (a.player) {
				let p = <Player>a.player;
				this.createExplosion(p.sprite.x, p.sprite.y);
				p.sprite.destroy();
				p.isDead = true;
			}
			if (b.player) {
				let p = <Player>b.player;
				this.createExplosion(p.sprite.x, p.sprite.y);
				p.sprite.destroy();
				p.isDead = true;
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
				this.createExplosion(midX, midY);

			}
		});

		if (!this.gameHasEnded) {
			let alive = this.players.filter(p => !p.isDead);
			let amountAlive = alive.length;
			this.gameHasEnded = amountAlive <= 1;

			if (amountAlive == 1) {

				let text = this.add.text(this.world.centerX, this.world.centerY, ' PLAYER ' + alive[0].playerNumber + ' WINS! ', { font: '100px Bangers', fill: '#dddddd', align: 'center' });
				text.anchor.setTo(0.5, 0.5);

			} else if (amountAlive == 0) {
				let text = this.add.text(this.world.centerX, this.world.centerY, 'DRAW!!!', { font: '100px Bangers', fill: '#dddddd', align: 'center' });
				text.anchor.setTo(0.5, 0.5);

			}
		}
	}

	createExplosion(x, y) {

		let directions = new Array<Phaser.Point>();

		let explosionSize = 8;
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