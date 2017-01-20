import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';

export default class GameState extends Phaser.State {
	init() {
		//TODO
	}

	preload() {
		let text = this.add.text(this.world.centerX, this.world.centerY, 'Loaded, lets go ', { font: '42px Bangers', fill: '#dddddd', align: 'center' });
		text.anchor.setTo(0.5, 0.5);
	}
}