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

		this.game.physics.arcade.collide(this.collisionGroup)
	}


	render() {
		if (Globals.DebugRender) {
			this.players.forEach(p => {
				this.game.debug.body(p.sprite);
				p.shotGroup.children.forEach(s => {
					this.game.debug.body(<any>s);
				});
			});

			this.collisionGroup.children.forEach(c => {
				this.game.debug.body(<any>c);
			})
		}
	}
}