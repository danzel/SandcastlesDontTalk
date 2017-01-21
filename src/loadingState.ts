import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';
import * as Globals from './globals';

export default class LoadingState extends Phaser.State {
	init() {
		//TODO?
	}

	preload() {
		WebFont.load({
			google: {
				families: [Globals.FontName]
			},
			active: () => this.fontsLoaded()
		})

		let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' });
		text.anchor.setTo(0.5, 0.5);
	}

	private fontsLoaded() {
		this.state.start('game');
	}
}