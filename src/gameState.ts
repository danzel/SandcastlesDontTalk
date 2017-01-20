import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';
import * as Globals from './globals';
import { PieceMaker } from './assets/pieces';

export default class GameState extends Phaser.State {

	x = 5;
	cursor: Phaser.Sprite;

	init() {
		//TODO
	}

	preload() {
		
		PieceMaker(Globals.AllPieceDefs, this.load);

		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.gravity.y = 1000;

		this.input.gamepad.start();

		let text = this.add.text(this.world.centerX, this.world.centerY, 'Loaded, lets go ', { font: '42px Bangers', fill: '#dddddd', align: 'center' });
		text.anchor.setTo(0.5, 0.5);

		//ground
		let ground = this.add.graphics(Globals.ScreenWidth / 2, Globals.ScreenHeight);
		this.physics.p2.enable(ground, Globals.DebugRender);
		let groundBody = (<Phaser.Physics.P2.Body>ground.body);
		groundBody.clearShapes();
		groundBody.addRectangle(Globals.ScreenWidth, 10);
		groundBody.static = true;

		//Show where cursor is
		this.cursor = this.add.sprite(this.x * Globals.GridPx, 100, 'cursor');


		//input
		this.input.gamepad.pad1.onDownCallback = (inputIndex: number) => {

			if (inputIndex == Phaser.Gamepad.XBOX360_DPAD_LEFT) {
				this.x--;
			} else if (inputIndex == Phaser.Gamepad.XBOX360_DPAD_RIGHT) {
				this.x++;
			} else if (inputIndex == Phaser.Gamepad.XBOX360_A) {
				this.placeBlock();
			}
			this.cursor.x = this.x * Globals.GridPx;
		};
	}

	create() { }

	placeBlock() {
		//Globals.AllPieceDefs[6].filename
		let square = this.add.sprite(this.x * Globals.GridPx, 100, '');
		Globals.AllPieceDefs[6].addPhysics(this.physics.p2, square);
		//TODO square.scale.set(0.5);
	}

	update() {
		//console.log(this.input.gamepad.supported, this.input.gamepad.active, this.input.gamepad.pad1.connected, this.input.gamepad.pad1.axis(Phaser.Gamepad.AXIS_0));
		if (this.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
			console.log("just A");
		}

	}
}