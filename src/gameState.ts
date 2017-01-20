import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';
import * as Globals from './globals';
import { PieceMaker } from './assets/pieces';

export default class GameState extends Phaser.State {

	nextPiece: number;
	x = 5;
	rotation = 0;
	cursor: Phaser.Sprite;

	nextPieceSprite: Phaser.Sprite;

	init() {
		//TODO
	}

	preload() {

		PieceMaker(Globals.AllPieceDefs, this.load);
		this.randomiseNext();

		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.gravity.y = 1000;
		this.physics.p2.friction = 0.8;
		//this.physics.p2.restitution;

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

		this.nextPieceSprite = this.add.sprite(100, 100, Globals.AllPieceDefs[this.nextPiece].filename);

		//input
		this.input.gamepad.pad1.onDownCallback = (inputIndex: number) => {

			if (inputIndex == Phaser.Gamepad.XBOX360_DPAD_LEFT) {
				this.x--;
			} else if (inputIndex == Phaser.Gamepad.XBOX360_DPAD_RIGHT) {
				this.x++;
			} else if (inputIndex == Phaser.Gamepad.XBOX360_A) {
				this.placeBlock();
			} else if (inputIndex == Phaser.Gamepad.XBOX360_X) {
				this.rotation++;
			} else if (inputIndex == Phaser.Gamepad.XBOX360_B) {
				this.rotation--;
			}

			this.cursor.x = this.x * Globals.GridPx;
			this.rotation = this.rotation % 4;
			this.nextPieceSprite.angle = 90 * this.rotation;
			//console.log(this.rotation);
		};
	}

	randomiseNext() {
		this.nextPiece = Math.floor(Math.random() * Globals.AllPieceDefs.length);
	}
	create() { }

	placeBlock() {
		//let square = this.add.sprite(this.x * Globals.GridPx, 100, '');
		let square = this.add.sprite(this.x * Globals.GridPx, 100, Globals.AllPieceDefs[this.nextPiece].filename);
		Globals.AllPieceDefs[this.nextPiece].addPhysics(this.physics.p2, square);
		square.angle = 90 * this.rotation;
		(<Phaser.Physics.P2.Body>square.body).angle = square.angle;
		square.scale.set(Globals.GridPx / 60);

		this.randomiseNext();
		this.nextPieceSprite.loadTexture(Globals.AllPieceDefs[this.nextPiece].filename);
		
	}

	update() {
		//console.log(this.input.gamepad.supported, this.input.gamepad.active, this.input.gamepad.pad1.connected, this.input.gamepad.pad1.axis(Phaser.Gamepad.AXIS_0));
	}
}