import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';
import * as Globals from './globals';
import { Player } from './player';



export default class GameState extends Phaser.State {

	players = new Array<Player>();

	collisionGroup: Phaser.Group;

	init() {
		//TODO
	}

	preload() {

		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.input.gamepad.start();

		let text = this.add.text(this.world.centerX, this.world.centerY, 'Loaded, lets go ', { font: '42px Bangers', fill: '#dddddd', align: 'center' });
		text.anchor.setTo(0.5, 0.5);

		this.collisionGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad1, 1));
		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad2, 2));
		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad3, 3));
		this.players.push(new Player(this.collisionGroup, this.input.gamepad.pad4, 4));
	}

	create() { }

	update() {
		//console.log(this.input.gamepad.supported, this.input.gamepad.active, this.input.gamepad.pad1.connected, this.input.gamepad.pad1.axis(Phaser.Gamepad.AXIS_0));

		this.players.forEach(p => p.update());

		this.game.physics.arcade.collide(this.collisionGroup, undefined, (a, b, c) => {
			if (a.player) {
				let p = <Player>a.player;
				//RIP
				console.log('RIP ' + p.playerNumber);
				this.createExplosion(p.sprite.x, p.sprite.y);
				p.sprite.destroy();
			}
			if (b.player) {
				let p = <Player>b.player;
				//RIP
				console.log('RIP ' + p.playerNumber);
				this.createExplosion(p.sprite.x, p.sprite.y);
				p.sprite.destroy();
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
	}

	createExplosion(x, y) {

		[
			[1, 0],
			[0.71, 0.71],
			[0, 1],
			[0, -1],
			[-1, 0],
			[-0.71, 0.71],
			[0.71, -0.71],
			[-0.71, 0.71]
		].forEach(dir => {
			let shot = this.game.add.sprite(x + dir[0] * 20, y + dir[1] * 20);

			this.game.physics.arcade.enable(shot);
			let shotBody = <Phaser.Physics.Arcade.Body>shot.body;
			shotBody.setCircle(Globals.ShotRadius);
			shotBody.collideWorldBounds = true;
			shotBody.velocity.set(
				dir[0] * Globals.ShotSpeed,
				dir[1] * Globals.ShotSpeed
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